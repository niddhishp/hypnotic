-- ─── 013: Helper Views & Functions ──────────────────────────────────────────────

-- ── Project summary view (used by Dashboard) ────────────────────────────────────
CREATE OR REPLACE VIEW public.project_summaries AS
SELECT
  p.id,
  p.user_id,
  p.name,
  p.brand,
  p.status,
  p.thumbnail_url,
  p.created_at,
  p.updated_at,
  COUNT(DISTINCT ir.id)  AS insight_count,
  COUNT(DISTINCT mr.id)  AS manifest_count,
  COUNT(DISTINCT ca.id)  AS asset_count,
  COUNT(DISTINCT sp.id)  AS published_count
FROM public.projects p
LEFT JOIN public.insight_runs  ir ON ir.project_id = p.id AND ir.status = 'complete'
LEFT JOIN public.manifest_runs mr ON mr.project_id = p.id AND mr.status = 'complete'
LEFT JOIN public.craft_assets  ca ON ca.project_id = p.id AND ca.status = 'approved'
LEFT JOIN public.scheduled_posts sp ON sp.project_id = p.id AND sp.status = 'published'
GROUP BY p.id;

-- ── User stats function (used by admin dashboard) ────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_user_stats(p_user_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'projects',    (SELECT COUNT(*) FROM public.projects WHERE user_id = p_user_id AND status = 'active'),
    'reports',     (SELECT COUNT(*) FROM public.insight_runs WHERE user_id = p_user_id AND status = 'complete'),
    'decks',       (SELECT COUNT(*) FROM public.manifest_runs WHERE user_id = p_user_id AND status = 'complete'),
    'assets',      (SELECT COUNT(*) FROM public.craft_assets WHERE user_id = p_user_id),
    'credits',     (SELECT generation_credits FROM public.user_subscriptions WHERE user_id = p_user_id),
    'plan',        (SELECT plan FROM public.user_subscriptions WHERE user_id = p_user_id)
  ) INTO v_result;
  RETURN v_result;
END;
$$;

-- ── Check module access ──────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.can_access_module(
  p_user_id UUID,
  p_module  TEXT
)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_plan TEXT;
BEGIN
  SELECT plan INTO v_plan
  FROM public.user_subscriptions
  WHERE user_id = p_user_id AND status IN ('active','trialing');

  IF v_plan IS NULL THEN RETURN FALSE; END IF;

  -- Free tier: insight + manifest only
  IF v_plan = 'free' AND p_module IN ('workspace','marketplace') THEN
    RETURN FALSE;
  END IF;

  RETURN TRUE;
END;
$$;

-- ── Update expert rating after hire review ───────────────────────────────────────
CREATE OR REPLACE FUNCTION public.update_expert_rating()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.rating IS NOT NULL AND OLD.rating IS NULL THEN
    UPDATE public.experts
    SET
      average_rating = (
        SELECT AVG(rating)
        FROM public.hire_requests
        WHERE expert_id = NEW.expert_id AND rating IS NOT NULL
      ),
      total_projects = total_projects + 1
    WHERE id = NEW.expert_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_hire_request_reviewed
  AFTER UPDATE ON public.hire_requests
  FOR EACH ROW
  WHEN (NEW.rating IS NOT NULL AND OLD.rating IS NULL)
  EXECUTE FUNCTION public.update_expert_rating();
