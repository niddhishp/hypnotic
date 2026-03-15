// src/lib/craft/prompt-library.ts
// Complete template prompt library — organized by output category.
// Each template is a premade prompt architecture that:
//   1. Works standalone
//   2. Gets enhanced by Meta-Prompt Architect (brand memory injected)
//   3. Maps to specific generation parameters automatically

export type OutputCategory =
  | 'document'   // decks, reports, briefs
  | 'image'      // stills, campaigns, social
  | 'video'      // ads, films, explainers
  | 'audio'      // music, voice, sfx
  | 'avatar'     // characters, presenters, influencers
  | 'interactive'; // chat assistants, data viz

export type ImageStyle = {
  id: string;
  label: string;
  category: 'photo' | 'illustration' | '3d' | 'design' | 'core';
  prompt_suffix: string;
  preview_color: string;
};

export type Template = {
  id: string;
  label: string;
  category: OutputCategory;
  subcategory: string;
  description: string;
  prompt: string;                     // base prompt (brand memory injected on top)
  requiredInputs: string[];           // what user must provide
  optionalInputs?: string[];
  defaultParams: Record<string, string | number | boolean>;
  tags: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  insightMappings?: string[];         // which insight fields get injected
};

// ── IMAGE STYLES ─────────────────────────────────────────────────────────────

export const IMAGE_STYLES: ImageStyle[] = [
  // ── Core ──────────────────────────────────────────────────────────────────
  { id: 'natural',        label: 'Natural',           category: 'core',         prompt_suffix: 'natural light, authentic, unposed, photojournalism quality',                                       preview_color: '#C4A882' },
  { id: 'editorial',      label: 'Editorial',         category: 'core',         prompt_suffix: 'editorial photography, magazine quality, art directed, intentional composition',                    preview_color: '#8C7B6B' },
  { id: 'cinematic',      label: 'Cinematic',         category: 'core',         prompt_suffix: 'cinematic still, anamorphic lens, film grain, color graded, movie quality',                         preview_color: '#2A2A2A' },
  { id: 'vibrant-film',   label: 'Vibrant Film',      category: 'core',         prompt_suffix: 'vibrant film photography, saturated colors, analog warmth, 35mm grain',                            preview_color: '#C45C2A' },
  { id: 'fashion-photo',  label: 'Fashion',           category: 'core',         prompt_suffix: 'high fashion photography, editorial lighting, premium styling, Vogue quality',                      preview_color: '#1A1A2E' },
  { id: 'silent-noir',    label: 'Noir',              category: 'core',         prompt_suffix: 'film noir, deep shadows, chiaroscuro lighting, black and white, moody atmosphere',                 preview_color: '#1A1A1A' },

  // ── Photo ─────────────────────────────────────────────────────────────────
  { id: 'warm-cold',      label: '#WarmCold',         category: 'photo',        prompt_suffix: 'split warm and cold color grading, dramatic temperature contrast, cinematic',                       preview_color: '#7A9EA8' },
  { id: 'cinematic-still',label: '#CinematicStill',   category: 'photo',        prompt_suffix: 'cinematic still frame, depth of field, professional cinematography, film look',                     preview_color: '#3D3D3D' },
  { id: 'dark-fantasy',   label: '#DarkFantasy',      category: 'photo',        prompt_suffix: 'dark fantasy atmosphere, dramatic lighting, mystical quality, rich shadows',                        preview_color: '#2A1A3A' },
  { id: 'editorial-portrait','label': '#EditorialPortrait', category: 'photo', prompt_suffix: 'editorial portrait, magazine quality, deliberate lighting, strong character',                       preview_color: '#5A4A3A' },
  { id: 'bold-product',   label: '#BoldProduct',      category: 'photo',        prompt_suffix: 'bold product photography, graphic composition, high contrast, commercial quality',                  preview_color: '#C4302A' },
  { id: 'neo-romanticism',label: '#NeoRomanticism',   category: 'photo',        prompt_suffix: 'neo-romantic aesthetic, soft drama, painterly quality, emotional atmosphere',                       preview_color: '#8A6A7A' },
  { id: 'film-burn',      label: '#FilmBurn',         category: 'photo',        prompt_suffix: 'film burn effects, analog grain, light leak, vintage film damage, lo-fi warmth',                   preview_color: '#C4882A' },
  { id: 'dream-landscape',label: '#DreamLandscape',   category: 'photo',        prompt_suffix: 'dreamlike landscape, ethereal atmosphere, surreal beauty, color rich',                             preview_color: '#4A6A8A' },
  { id: 'indie-poster',   label: '#IndiePoster',      category: 'photo',        prompt_suffix: 'indie film poster aesthetic, artistic composition, alternative visual language',                    preview_color: '#6A4A4A' },
  { id: 'baroque',        label: '#Baroque',          category: 'photo',        prompt_suffix: 'baroque lighting, Rembrandt quality, rich gold tones, dramatic chiaroscuro',                        preview_color: '#8A6A2A' },
  { id: 'vibrant-noir',   label: '#VibrantNoir',      category: 'photo',        prompt_suffix: 'vibrant color noir, neon against darkness, saturated shadows, city night life',                    preview_color: '#1A0A2A' },

  // ── Illustration ──────────────────────────────────────────────────────────
  { id: 'risograph',      label: '#Risograph',        category: 'illustration', prompt_suffix: 'risograph print, limited color palette, texture grain, vintage offset printing quality',           preview_color: '#C4A82A' },
  { id: 'gradient-grainy',label: '#GradientGrainy',   category: 'illustration', prompt_suffix: 'grainy gradient texture, noise overlay, analog warmth, graphic design quality',                    preview_color: '#8A2AC4' },
  { id: 'neon-grainy',    label: '#NeonGrainy',       category: 'illustration', prompt_suffix: 'neon colors with grain, glowing palette, textured surface, electric vibrancy',                     preview_color: '#2AC48A' },
  { id: 'fresh-cartoon',  label: '#FreshCartoon',     category: 'illustration', prompt_suffix: 'clean cartoon illustration, bold outlines, flat color, playful professional',                       preview_color: '#2A8AC4' },
  { id: 'soft-watercolor',label: '#SoftWatercolor',   category: 'illustration', prompt_suffix: 'soft watercolor painting, delicate washes, paper texture, gentle brushwork',                       preview_color: '#A8C4D4' },
  { id: 'painterly-anime',label: '#PainterlyAnime',   category: 'illustration', prompt_suffix: 'painterly anime style, Studio Ghibli quality, hand-drawn warmth, cinematic anime',                 preview_color: '#2A3A6A' },
  { id: 'vector-vintage', label: '#VectorVintage',    category: 'illustration', prompt_suffix: 'vintage vector illustration, retro poster quality, limited palette, clean lines',                   preview_color: '#C48A2A' },
  { id: 'screen-print',   label: '#ScreenPrint',      category: 'illustration', prompt_suffix: 'screen print aesthetic, bold flat colors, deliberate registration, artisanal quality',             preview_color: '#8AC42A' },
  { id: 'oil-pastel',     label: '#OilPastel',        category: 'illustration', prompt_suffix: 'oil pastel texture, rich pigment, gestural marks, tactile quality',                                preview_color: '#C4682A' },

  // ── 3D ────────────────────────────────────────────────────────────────────
  { id: 'clay-3d',        label: '#ClayToon',         category: '3d',           prompt_suffix: 'claymation 3D render, clay texture, warm lighting, playful Laika quality',                         preview_color: '#C4A882' },
  { id: 'glossy-3d',      label: '#Glam3D',           category: '3d',           prompt_suffix: 'glossy 3D render, reflective surfaces, premium product quality, studio lighting',                  preview_color: '#8A8A8A' },
  { id: 'cinematic-3d',   label: '#Cinematic3D',      category: '3d',           prompt_suffix: 'cinematic 3D render, photorealistic quality, depth of field, dramatic lighting',                   preview_color: '#2A2A3A' },
  { id: 'kawaii-3d',      label: '#Kawaii3D',         category: '3d',           prompt_suffix: 'kawaii 3D style, cute proportions, pastel tones, Pixar quality, endearing',                        preview_color: '#F4C4D4' },
  { id: 'vinyl-toy',      label: '#VinylToy',         category: '3d',           prompt_suffix: 'vinyl toy aesthetic, designer collectible quality, bold shapes, clean finish',                      preview_color: '#4A2AC4' },
  { id: 'isometric',      label: '#IsometricWorld',   category: '3d',           prompt_suffix: 'isometric 3D design, architectural precision, colorful details, diorama quality',                  preview_color: '#2AC4C4' },
  { id: 'squishy-3d',     label: '#Squishy3D',        category: '3d',           prompt_suffix: 'soft squishy 3D render, inflated forms, gentle light, satisfying tactile quality',                 preview_color: '#A8F4D4' },
  { id: 'dream-glass',    label: '#DreamGlass',       category: '3d',           prompt_suffix: 'glass material 3D, refractive quality, translucent forms, light caustics',                         preview_color: '#A8D4F4' },

  // ── Design ────────────────────────────────────────────────────────────────
  { id: 'bold-poster',    label: '#BoldPoster',       category: 'design',       prompt_suffix: 'bold graphic poster design, strong typography, high impact visual, Saul Bass quality',             preview_color: '#C4402A' },
  { id: 'neo-memphis',    label: '#NeoMemphis',       category: 'design',       prompt_suffix: 'neo-Memphis design, geometric shapes, bold colors, graphic pattern, retro modern',                 preview_color: '#F4C42A' },
  { id: 'minimal-typo',   label: '#MinimalTypo',      category: 'design',       prompt_suffix: 'minimalist typography design, clean layout, generous whitespace, Swiss school quality',            preview_color: '#F4F4F4' },
  { id: 'holo-icon',      label: '#HoloIcon',         category: 'design',       prompt_suffix: 'holographic icon design, iridescent surface, tech aesthetic, premium app quality',                 preview_color: '#A8C4F4' },
  { id: 'branding-air',   label: '#BrandingInTheAir', category: 'design',       prompt_suffix: 'floating brand identity mockup, clean studio environment, premium presentation',                   preview_color: '#F4F4F4' },
  { id: 'sticker-icon',   label: '#StickerIcon',      category: 'design',       prompt_suffix: 'sticker-style icon, thick outline, flat color, playful badge design',                             preview_color: '#F4D42A' },
  { id: 'bold-typo',      label: '#BoldTypo',         category: 'design',       prompt_suffix: 'bold typography design, expressive letterforms, graphic power, editorial quality',                 preview_color: '#2A2A2A' },
];

// ── VIDEO STYLES ─────────────────────────────────────────────────────────────

export const VIDEO_STYLES = [
  { id: 'photorealistic',   label: 'Photorealistic',        desc: 'True-to-life, shot-on-camera quality',      thumbnail: '#3A3A3A' },
  { id: 'cinematic',        label: 'Cinematic',             desc: 'Film-grade production, color graded',        thumbnail: '#1A1A2A' },
  { id: 'anime-jp',         label: 'Anime — Japanese',      desc: 'Traditional anime aesthetic, cel shading',   thumbnail: '#2A3A5A' },
  { id: 'anime-kr',         label: 'Anime — Korean',        desc: 'Webtoon-influenced, softer palette',         thumbnail: '#3A2A5A' },
  { id: 'pixar-3d',         label: '3D Animated',           desc: 'Studio-quality 3D render, warm lighting',    thumbnail: '#2A5A3A' },
  { id: 'claymation',       label: 'Claymation',            desc: 'Textured clay world, artisanal charm',       thumbnail: '#C4A882' },
  { id: 'dark-gritty',      label: 'Dark & Gritty',         desc: 'Raw, high-contrast, urban texture',          thumbnail: '#1A1A1A' },
  { id: 'dreamy-pastel',    label: 'Dreamy Pastel',         desc: 'Soft tones, hazy atmosphere, gentle',        thumbnail: '#F4C4D4' },
  { id: 'retro-vhs',        label: 'Retro / VHS',           desc: 'Analog grain, scan lines, nostalgia',        thumbnail: '#6A4A2A' },
  { id: 'luxury-minimal',   label: 'Luxury Minimal',        desc: 'Premium restraint, aspirational clarity',    thumbnail: '#D4C4A8' },
];

// ── VIDEO TEMPLATES ───────────────────────────────────────────────────────────

export const VIDEO_TEMPLATES: Template[] = [
  // Featured
  { id: 'brand-film',           label: 'Brand Film',              category: 'video', subcategory: 'featured',       description: 'Emotional long-form brand story — character-led, brand as enabler',                    prompt: 'Create a cinematic brand film where the protagonist overcomes a relatable challenge, with the brand appearing as a quiet enabler of transformation, not the hero. Visual style: naturalistic cinematography, practical lighting. Tone: earned, human, resonant.',     requiredInputs: ['brand', 'protagonist_type'],                    defaultParams: { aspect: '16:9', duration: '90s', model: 'kling-2.0' },     tags: ['emotional', 'character', 'cinematic'],    isFeatured: true,   insightMappings: ['audience.primaryPersona', 'culturalTension', 'brief.creativeDirective'] },
  { id: 'premium-commercial',   label: 'Premium Commercial',      category: 'video', subcategory: 'featured',       description: '30-second premium ad — craft-level production, single clear message',                   prompt: 'Generate a 30-second premium brand commercial. Single location, single character or product hero. Cinematography: anamorphic, shallow depth of field. No voice-over, music-led, product reveal in final 5 seconds.',                                             requiredInputs: ['product', 'hero_moment'],                       defaultParams: { aspect: '16:9', duration: '30s', model: 'kling-2.0' },     tags: ['commercial', 'premium', '30s'],           isFeatured: true },
  { id: 'social-movement',      label: 'Social Movement',         category: 'video', subcategory: 'featured',       description: 'Cultural commentary piece — designed to spread organically',                          prompt: 'Create a culturally resonant video that taps into an existing social tension or movement, positioning the brand as a natural participant not a corporate interloper. Tone: raw, unpolished, authentic. Format: vertical 9:16.',                                    requiredInputs: ['cultural_tension', 'brand_angle'],              defaultParams: { aspect: '9:16', duration: '45s', model: 'kling-2.0' },     tags: ['viral', 'cultural', 'social'],            isFeatured: true,   insightMappings: ['culturalTension.tension', 'audience.unspokenDesire'] },
  { id: 'tech-innovation',      label: 'Tech Innovation Demo',    category: 'video', subcategory: 'featured',       description: 'Product demonstration with futuristic aesthetic — inspires confidence',                 prompt: 'Generate a technology product demonstration video. Visual language: clean white environments, precision motion, data visualization elements, aspirational product interaction. No clutter, no unnecessary motion. Product is the protagonist.',                   requiredInputs: ['product', 'key_feature'],                       defaultParams: { aspect: '16:9', duration: '60s', model: 'kling-2.0' },     tags: ['tech', 'product', 'demo'],                isFeatured: true },
  { id: 'disruptive-marketing', label: 'Disruptive Campaign',     category: 'video', subcategory: 'featured',       description: 'Category convention-breaking video — owes nothing to the competition',                 prompt: 'Create a video that deliberately breaks the visual and narrative conventions of its category. If everyone is clean and aspirational, be raw and honest. If everyone shouts, be quiet. Identify the category cliché and invert it.',                              requiredInputs: ['category', 'convention_to_break'],              defaultParams: { aspect: '9:16', duration: '30s', model: 'kling-2.0' },     tags: ['disruptive', 'challenger', 'bold'],       isFeatured: true,   insightMappings: ['competitorLandscape.competitorClichés'] },

  // Social Media
  { id: 'ugc-style',            label: 'UGC Creator Style',       category: 'video', subcategory: 'social',         description: 'Looks like organic user content — high trust, native feel',                          prompt: 'Create a user-generated content style video. Handheld camera, natural light, casual framing, authentic reaction. Product appears naturally in context. No branded lower thirds. Feels found, not made.',                                                          requiredInputs: ['product', 'scenario'],                          defaultParams: { aspect: '9:16', duration: '30s', model: 'kling-2.0' },     tags: ['ugc', 'organic', 'authentic'] },
  { id: 'social-reel',          label: 'Platform Reel',           category: 'video', subcategory: 'social',         description: 'Engineered for algorithmic reach — hook in 3 seconds',                              prompt: 'Create a social media reel with a strong visual hook in the first 2 seconds, fast mid-section pacing, and a satisfying visual close. Text overlays optional. Optimized for vertical viewing.',                                                                  requiredInputs: ['hook_moment', 'product_or_topic'],              defaultParams: { aspect: '9:16', duration: '15s', model: 'kling-2.0' },     tags: ['reel', 'social', 'algorithm'] },
  { id: 'grwm-style',           label: 'GRWM Routine',            category: 'video', subcategory: 'social',         description: 'Get-ready-with-me format — category staple for beauty, fashion, lifestyle',          prompt: 'Generate a GRWM (get ready with me) style video showing a morning or evening routine. Products appear naturally within the routine. Warm color grade, cozy environment, genuine feeling.',                                                                       requiredInputs: ['routine_type', 'products'],                     defaultParams: { aspect: '9:16', duration: '45s', model: 'kling-2.0' },     tags: ['lifestyle', 'routine', 'beauty'] },
  { id: 'product-asmr',         label: 'Product ASMR',            category: 'video', subcategory: 'social',         description: 'Tactile, sensory-focused close-up — satisfying and premium',                        prompt: 'Create a product ASMR video focusing on tactile details, texture, sound cues, and satisfying interactions with the product. Macro shots, gentle motion, premium feel. No voiceover.',                                                                             requiredInputs: ['product'],                                      defaultParams: { aspect: '9:16', duration: '30s', model: 'kling-2.0' },     tags: ['asmr', 'product', 'tactile'] },
  { id: '360-product',          label: '360° Showcase',           category: 'video', subcategory: 'social',         description: 'Full product rotation — works for e-commerce, launch, showcase',                    prompt: 'Generate a 360-degree product rotation video on a clean studio surface. Smooth rotation, perfect lighting, product occupies 70% of frame. Available in square for feed and vertical for stories.',                                                               requiredInputs: ['product_description'],                          defaultParams: { aspect: '1:1', duration: '10s', model: 'kling-2.0' },      tags: ['360', 'product', 'ecommerce'] },

  // Advertising
  { id: 'product-lifestyle',    label: 'Lifestyle Scene',         category: 'video', subcategory: 'advertising',    description: 'Product in aspirational real-world context — desire-building',                       prompt: 'Place the product in a realistic, aspirational lifestyle scene. Environment and people suggest the target audience\'s desired identity. Product feels natural, not planted. Location-specific, sensory-rich.',                                                    requiredInputs: ['product', 'lifestyle_context', 'audience_type'],defaultParams: { aspect: '16:9', duration: '30s', model: 'kling-2.0' },     tags: ['lifestyle', 'aspirational', 'product'] },
  { id: 'testimonial-case',     label: 'Case Study / Proof',      category: 'video', subcategory: 'advertising',    description: 'Evidence-led brand story — trust-building, conversion-focused',                      prompt: 'Create a documentary-style case study video featuring a real-world outcome. Interview-style framing, observational B-roll, data or result callouts. Tone: honest, grounded, confident. Not a commercial — a proof point.',                                        requiredInputs: ['outcome', 'protagonist_type'],                   defaultParams: { aspect: '16:9', duration: '90s', model: 'kling-2.0' },     tags: ['case-study', 'proof', 'trust'] },
  { id: 'explainer-animated',   label: 'Animated Explainer',      category: 'video', subcategory: 'advertising',    description: 'Concept clarification through motion — simplifies the complex',                      prompt: 'Generate an animated explainer video that takes a complex concept or product and makes it immediately clear through metaphor, visual demonstration, and simple progressive revelation. No jargon. Every frame earns its place.',                                  requiredInputs: ['concept', 'target_audience'],                   defaultParams: { aspect: '16:9', duration: '90s', model: 'kling-2.0' },     tags: ['explainer', 'animated', 'education'] },
  { id: 'batch-ad-variations',  label: 'Batch Ad Variations',     category: 'video', subcategory: 'advertising',    description: 'Generate multiple ad variants from one concept — A/B test at scale',                  prompt: 'Create 3 distinct video ad variations from the same product/brief. Variation A: benefit-led. Variation B: emotion-led. Variation C: problem-led. Same product, different narrative entry. Same visual quality throughout.',                                     requiredInputs: ['product', 'key_benefit'],                       defaultParams: { aspect: '9:16', duration: '30s', model: 'kling-2.0' },     tags: ['batch', 'a/b test', 'variations'] },

  // Cinematic
  { id: 'cinematic-trailer',    label: 'Cinematic Trailer',       category: 'video', subcategory: 'cinematic',      description: 'Full brand film trailer — epic, emotional, built for sharing',                       prompt: 'Create a cinematic brand trailer in the style of a premium film teaser. Opens with atmosphere, builds with emotional music, reveals the central question or tension at the midpoint, closes with brand mark and quiet confidence. No product features. Pure story.',requiredInputs: ['brand', 'emotional_territory'],                  defaultParams: { aspect: '16:9', duration: '60s', model: 'kling-2.0' },     tags: ['trailer', 'cinematic', 'premium'],        isFeatured: true,   insightMappings: ['brief.bigIdea', 'culturalTension.opportunity'] },
  { id: 'documentary-portrait', label: 'Documentary Portrait',    category: 'video', subcategory: 'cinematic',      description: 'Real people, real stories — the most trusted format in advertising',                 prompt: 'Generate a documentary portrait video featuring an authentic character whose life or work connects naturally to the brand\'s world. Observational style, natural light, minimal intervention. Character does not speak to camera — life is the narrative.',        requiredInputs: ['character_type', 'world'],                      defaultParams: { aspect: '16:9', duration: '2m', model: 'kling-2.0' },      tags: ['documentary', 'authentic', 'portrait'] },
];

// ── IMAGE TEMPLATES ───────────────────────────────────────────────────────────

export const IMAGE_TEMPLATES: Template[] = [
  // Featured
  { id: 'hero-shot',            label: 'Hero Product Shot',       category: 'image', subcategory: 'featured',       description: 'The defining image of a product — bold, aspirational, campaign-ready',             prompt: 'Create a hero product shot: the subject fills the frame with authority. Perfect studio lighting with character. Background complements, not competes. The product looks like the most important object in the world.',                                            requiredInputs: ['product'],                                      defaultParams: { aspect: '16:9', quality: 'ultra' },                        tags: ['product', 'hero', 'campaign'],            isFeatured: true },
  { id: 'tech-product-ad',      label: 'Tech Product Ad',         category: 'image', subcategory: 'featured',       description: 'Futuristic product ad visual — premium tech aesthetic',                            prompt: 'Generate a technology product advertisement image. Floating product on gradient or atmospheric background. Cinematic lighting, data visualization elements optional. Aspirational, futuristic, premium brand quality.',                                           requiredInputs: ['product', 'key_feature'],                       defaultParams: { aspect: '16:9', quality: 'ultra' },                        tags: ['tech', 'product', 'futuristic'],          isFeatured: true },
  { id: 'fashion-editorial',    label: 'Fashion Editorial',       category: 'image', subcategory: 'featured',       description: 'Magazine-quality fashion image — identity-defining, share-worthy',                  prompt: 'Create an editorial fashion photograph: strong character with deliberate styling, intentional composition with tension, lighting that reveals more than illuminates. Vogue quality, not catalog.',                                                              requiredInputs: ['clothing_description', 'mood'],                 defaultParams: { aspect: '4:5', quality: 'ultra' },                         tags: ['fashion', 'editorial', 'identity'],       isFeatured: true },
  { id: 'product-lifestyle-im', label: 'Product in Life',         category: 'image', subcategory: 'featured',       description: 'Product naturally embedded in aspirational real-world context',                    prompt: 'Place the product in a realistic lifestyle scene where it appears found, not planted. Environment suggests the audience\'s desired identity. Natural light preferred. Product visible but not dominant.',                                                         requiredInputs: ['product', 'context'],                           defaultParams: { aspect: '4:5', quality: 'ultra' },                         tags: ['lifestyle', 'product', 'authentic'],      isFeatured: true },
  { id: 'campaign-visual',      label: 'Campaign Visual',         category: 'image', subcategory: 'featured',       description: 'The central visual of a campaign — one image to anchor everything',                 prompt: 'Create the anchor campaign visual: a single image that immediately communicates the campaign\'s emotional territory without words. Conceptual, visual metaphor, arresting. Should work as a poster, social post, and billboard.',                                requiredInputs: ['brand', 'campaign_idea'],                       defaultParams: { aspect: '16:9', quality: 'ultra' },                        tags: ['campaign', 'concept', 'bold'],            isFeatured: true,   insightMappings: ['brief.bigIdea', 'brand.persona'] },

  // Branding
  { id: 'brand-identity',       label: 'Brand Identity System',   category: 'image', subcategory: 'branding',       description: 'Complete visual identity across surfaces — packaging, stationery, digital',          prompt: 'Generate a brand identity presentation showing the visual system across stationery, packaging, and digital surfaces. Clean white studio environment, floating elements, professional identity photography.',                                                    requiredInputs: ['brand_name', 'visual_style'],                   defaultParams: { aspect: '16:9', quality: 'ultra' },                        tags: ['branding', 'identity', 'system'] },
  { id: 'packaging-mockup',     label: 'Branded Packaging',       category: 'image', subcategory: 'branding',       description: 'Product packaging in a realistic premium environment',                             prompt: 'Create a branded packaging mockup in a realistic premium setting. Professional studio lighting, high-end retail environment. Product packaging looks production-ready and market-worthy.',                                                                       requiredInputs: ['product', 'packaging_style'],                   defaultParams: { aspect: '4:5', quality: 'ultra' },                         tags: ['packaging', 'mockup', 'branding'] },
  { id: '3d-icon',              label: '3D Brand Icon',           category: 'image', subcategory: 'branding',       description: 'Premium 3D rendered brand icon or symbol',                                        prompt: 'Create a premium 3D rendered brand icon: floating on white or gradient background, soft studio lighting, shadows suggesting depth. Material options: matte, glossy, metallic, clay.',                                                                           requiredInputs: ['symbol_description'],                           defaultParams: { aspect: '1:1', quality: 'ultra' },                         tags: ['icon', '3d', 'premium'] },
  { id: 'typographic-poster',   label: 'Typographic Poster',      category: 'image', subcategory: 'branding',       description: 'Typography as the visual — bold, designed, poster-worthy',                         prompt: 'Design a typographic poster where the type IS the image. Strong grid, expressive letterforms, deliberate color use. Text communicates visually before it communicates literally. Suitable for print and digital.',                                               requiredInputs: ['headline', 'visual_direction'],                 defaultParams: { aspect: '2:3', quality: 'ultra' },                         tags: ['typography', 'poster', 'bold'] },

  // Social Media
  { id: 'social-profile',       label: 'AI Creator Profile',      category: 'image', subcategory: 'social',         description: 'Ownable social identity — consistent character for content calendars',             prompt: 'Create a social media character profile image: strong personality, consistent identity, visually distinctive. Character should be ownable and repeatable across content series.',                                                                              requiredInputs: ['character_type', 'visual_style'],               defaultParams: { aspect: '1:1', quality: 'high' },                          tags: ['influencer', 'character', 'social'] },
  { id: 'editorial-still-life', label: 'Editorial Still Life',    category: 'image', subcategory: 'social',         description: 'Object composition as storytelling — beautiful, shareable',                       prompt: 'Create an editorial still life composition: objects chosen for emotional resonance and visual rhythm. Art directed styling, deliberate shadows, intentional color relationships.',                                                                              requiredInputs: ['objects', 'mood'],                              defaultParams: { aspect: '4:5', quality: 'ultra' },                         tags: ['still life', 'editorial', 'social'] },
  { id: 'y2k-composition',      label: 'Y2K Editorial',           category: 'image', subcategory: 'social',         description: 'Early 2000s nostalgia aesthetic — resonates with Gen Z + Millennial audiences',    prompt: 'Generate a Y2K-era editorial composition: cyber-blue and metallic silver palette, low-resolution digital texture, bubble typography, lens flare, early internet aesthetic.',                                                                                  requiredInputs: ['subject'],                                      defaultParams: { aspect: '4:5', quality: 'high' },                          tags: ['y2k', 'nostalgia', 'trend'] },

  // Advertising
  { id: 'food-composition',     label: 'Food Campaign Shot',      category: 'image', subcategory: 'advertising',    description: 'Appetite-inducing food photography — premium restaurant or FMCG quality',           prompt: 'Generate a professional food photography composition: dramatic moody lighting, hero ingredient elevated, styling that suggests freshness and craft. Editorial quality with commercial intention.',                                                                requiredInputs: ['dish_or_product'],                              defaultParams: { aspect: '4:5', quality: 'ultra' },                         tags: ['food', 'product', 'campaign'] },
  { id: 'beauty-closeup',       label: 'Beauty Close-up',         category: 'image', subcategory: 'advertising',    description: 'Skin-level detail photography — luxury cosmetics and beauty standard',              prompt: 'Create an editorial beauty close-up: extreme proximity to skin or makeup detail, lighting that reveals texture and radiance without harshness. Luxury magazine quality.',                                                                                       requiredInputs: ['beauty_product_or_look'],                       defaultParams: { aspect: '3:4', quality: 'ultra' },                         tags: ['beauty', 'close-up', 'luxury'] },
  { id: 'storyboard-visual',    label: 'Storyboard to Scene',     category: 'image', subcategory: 'advertising',    description: 'Convert a storyboard frame description into a full production-quality image',       prompt: 'Translate this storyboard frame into a production-quality image: exact framing, lighting, and character positioning as described. This image will serve as a reference for video production.',                                                                 requiredInputs: ['scene_description', 'shot_type'],               defaultParams: { aspect: '16:9', quality: 'ultra' },                        tags: ['storyboard', 'production', 'reference'] },
  { id: 'floating-product',     label: 'Floating Product Photo',  category: 'image', subcategory: 'advertising',    description: 'Premium e-commerce product shot — gravity-defying, editorially composed',           prompt: 'Generate a floating-style product photograph: product suspended in mid-air on a gradient or atmospheric background, perfect shadow beneath, premium lighting. Suitable for e-commerce hero, social ad, and campaign.',                                         requiredInputs: ['product'],                                      defaultParams: { aspect: '1:1', quality: 'ultra' },                         tags: ['floating', 'product', 'ecommerce'] },

  // Fun
  { id: 'surreal-scene',        label: 'Surreal World',           category: 'image', subcategory: 'fun',            description: 'Dreamlike, unexpected, visually provocative — stops scrolling',                    prompt: 'Create a surreal scene where the ordinary becomes extraordinary: scale distortions, impossible situations, dreamlike logic, rich in visual discovery. Something you need to look at twice.',                                                                     requiredInputs: ['central_element', 'surreal_twist'],             defaultParams: { aspect: '16:9', quality: 'ultra' },                        tags: ['surreal', 'creative', 'viral'] },
  { id: 'giant-character',      label: 'Giant Character',         category: 'image', subcategory: 'fun',            description: 'Kaiju-scale character in urban setting — attention-commanding scale play',          prompt: 'Place a giant version of the character or mascot in a realistic city environment at colossal scale. Cinematic lighting, realistic shadows, believable scale cues.',                                                                                           requiredInputs: ['character_description'],                        defaultParams: { aspect: '16:9', quality: 'ultra' },                        tags: ['scale', 'giant', 'surreal'] },
  { id: 'retro-scifi',          label: 'Retro Sci-Fi',            category: 'image', subcategory: 'fun',            description: '1970s science-fiction aesthetic — vintage future, warm analog',                    prompt: 'Generate a retro science fiction scene in the style of 1970s NASA concept art and pulp sci-fi illustration. Warm analog palette, optimistic future, hand-painted quality.',                                                                                    requiredInputs: ['scene_description'],                            defaultParams: { aspect: '16:9', quality: 'ultra' },                        tags: ['retro', 'sci-fi', 'nostalgic'] },
];

// ── AUDIO TEMPLATES ───────────────────────────────────────────────────────────

export const AUDIO_TEMPLATES: Template[] = [
  // Music
  { id: 'luxury-showcase',      label: 'Luxury Product Showcase', category: 'audio', subcategory: 'music',          description: 'Minimal, premium ambient — lets the visual breathe',                             prompt: 'Compose a luxury product showcase background track: minimal piano, subtle strings, generous silence, tempo around 70bpm. The music supports without competing. Aspirational without being aggressive.',                                                            requiredInputs: [],                                               defaultParams: { duration: 60, genre: 'ambient', mood: 'luxury' },           tags: ['luxury', 'ambient', 'product'] },
  { id: 'epic-trailer-hit',     label: 'Epic Trailer',            category: 'audio', subcategory: 'music',          description: 'Cinematic build to impact — perfect for brand film reveals',                     prompt: 'Create an epic trailer music track: starts minimal, builds through 3 acts, climax at 75% with full orchestral impact, resolves with brand-moment clarity. Tempo: variable. Duration: 60-90 seconds.',                                                             requiredInputs: [],                                               defaultParams: { duration: 75, genre: 'cinematic', mood: 'epic' },           tags: ['trailer', 'epic', 'cinematic'],           isFeatured: true },
  { id: 'brand-narrative',      label: 'Brand Story',             category: 'audio', subcategory: 'music',          description: 'Warm, emotional, human — for documentary and brand film',                        prompt: 'Compose a brand story background track: acoustic guitar or piano base, warm mid-tempo, emotionally open. The music should feel like it belongs to real moments, not manufactured ones.',                                                                          requiredInputs: [],                                               defaultParams: { duration: 90, genre: 'acoustic', mood: 'warm' },            tags: ['brand', 'warm', 'storytelling'] },
  { id: 'fashion-beat',         label: 'Fashion Slow Motion',     category: 'audio', subcategory: 'music',          description: 'Slow, atmospheric — fashion editorial and lifestyle content',                     prompt: 'Generate a fashion editorial music track: slow, textured electronic, 60-80bpm, building tension and release. Suitable for slow motion footage. Contemporary and stylish without being trend-chasing.',                                                            requiredInputs: [],                                               defaultParams: { duration: 45, genre: 'electronic', mood: 'fashion' },       tags: ['fashion', 'slow-motion', 'editorial'] },
  { id: 'product-reveal',       label: 'Product Reveal',          category: 'audio', subcategory: 'music',          description: 'Anticipation → reveal → satisfaction — designed for product launches',           prompt: 'Create a product reveal music arc: 8 seconds of build (quiet, anticipatory), impact at the reveal moment, then warm resolution. Suitable for packaging reveals, launch moments, e-commerce.',                                                                   requiredInputs: [],                                               defaultParams: { duration: 20, genre: 'hybrid', mood: 'reveal' },            tags: ['reveal', 'launch', 'impact'] },
  { id: 'social-vibe',          label: 'Social Media Vibe',       category: 'audio', subcategory: 'music',          description: 'Loop-friendly, platform-native — reels, stories, and feed videos',                prompt: 'Generate a social media background track: 15-second loop-ready, contemporary production quality, upbeat without being annoying. Platform-native sound. Available in 15s and 30s versions.',                                                                       requiredInputs: [],                                               defaultParams: { duration: 30, genre: 'pop', mood: 'upbeat' },               tags: ['social', 'loop', 'upbeat'] },

  // Voice
  { id: 'ad-voice-warm',        label: 'Warm Ad Narration',       category: 'audio', subcategory: 'voice',          description: 'Human, trustworthy voiceover — builds connection, not authority',                 prompt: 'Record warm brand narration: conversational but professional, human but credible, pace allowing the words to breathe. Not a DJ voice. Not broadcast. A person talking to another person.',                                                                       requiredInputs: ['script'],                                       defaultParams: { voice_style: 'warm-conversational', pace: 'measured' },     tags: ['voice', 'warm', 'narration'] },
  { id: 'character-voice',      label: 'Character Voice',         category: 'audio', subcategory: 'voice',          description: 'Distinct character voice for animation or branded content',                      prompt: 'Generate a character voice with distinct personality: specific accent, age quality, emotional register. Consistent and ownable across multiple lines. Character voice, not generic announcer.',                                                                  requiredInputs: ['script', 'character_description'],              defaultParams: { voice_style: 'character', pace: 'natural' },               tags: ['character', 'animation', 'branded'] },
  { id: 'documentary-narration',label: 'Documentary Narration',   category: 'audio', subcategory: 'voice',          description: 'Authoritative but accessible — BBC/NatGeo register',                              prompt: 'Record documentary-style narration: measured, authoritative, intellectually credible. Sounds like it belongs to important content. Not dramatic, not casual. The voice of considered observation.',                                                               requiredInputs: ['script'],                                       defaultParams: { voice_style: 'documentary', pace: 'considered' },           tags: ['documentary', 'authority', 'credible'] },
  { id: 'multilang-narration',  label: 'Pan-India Narration',     category: 'audio', subcategory: 'voice',          description: 'Generate narration in Hindi, Tamil, Telugu, Bengali, Marathi instantly',         prompt: 'Generate brand narration in multiple Indian languages from a single English script. Maintain the same emotional register and brand voice across all language versions. Priority languages: Hindi, Tamil, Telugu, Bengali, Marathi, Kannada.',                    requiredInputs: ['script', 'target_languages'],                   defaultParams: { languages: 'hi,ta,te,bn,mr', pace: 'measured' }, tags: ['multilingual', 'india', 'pan-india'],   isFeatured: true },
];

// ── DOCUMENT TEMPLATES ────────────────────────────────────────────────────────

export const DOCUMENT_TEMPLATES: Template[] = [
  { id: 'strategy-deck',        label: 'Strategy Deck',           category: 'document', subcategory: 'deck',        description: 'Full brand or campaign strategy — board-ready, agency-quality',                  prompt: 'Build a complete brand strategy deck: situation analysis, audience insight, brand positioning, strategic platform, creative direction, channel strategy, measurement framework. Each section earns its place.',                                                   requiredInputs: ['brand', 'brief'],                               defaultParams: { slides: 20, format: 'pptx' },                              tags: ['strategy', 'deck', 'agency'],             isFeatured: true,   insightMappings: ['all'] },
  { id: 'campaign-brief',       label: 'Campaign Brief',          category: 'document', subcategory: 'document',    description: 'Production-ready campaign brief — from strategy to execution',                   prompt: 'Write a campaign brief that distills strategy into creative direction: problem statement, audience truth, single-minded proposition, mandatory elements, tone of voice, and success metrics. One page.',                                                          requiredInputs: ['brand', 'campaign_goal'],                       defaultParams: { pages: 2, format: 'pdf' },                                 tags: ['brief', 'campaign', 'production'],        insightMappings: ['brief.problemStatement', 'brief.bigIdea'] },
  { id: 'content-calendar',     label: 'Content Calendar',        category: 'document', subcategory: 'document',    description: '30-day social content calendar with posts, formats, and captions',                prompt: 'Create a 30-day social media content calendar: post by post, platform-specific, with caption hooks, format recommendations, and content pillar mapping. Variety between promotional, educational, entertaining, and community content.',                          requiredInputs: ['brand', 'platforms', 'audience'],               defaultParams: { days: 30, format: 'xlsx' },                                tags: ['content', 'calendar', 'social'] },
  { id: 'research-report',      label: 'Research Report',         category: 'document', subcategory: 'report',      description: 'Full intelligence report — synthesizes all Insight findings into a shareable document', prompt: 'Generate a research intelligence report from the brief: executive summary, category landscape, audience analysis, competitive mapping, cultural tension, strategic opportunity, and recommended routes. Professional, publishable.',                       requiredInputs: ['research_data'],                                defaultParams: { pages: 15, format: 'pdf' },                                tags: ['research', 'report', 'intelligence'],     insightMappings: ['all'] },
];

// ── AVATAR/CHARACTER TEMPLATES ────────────────────────────────────────────────

export const AVATAR_TEMPLATES: Template[] = [
  { id: 'brand-ambassador',     label: 'AI Brand Ambassador',     category: 'avatar', subcategory: 'character',     description: 'Consistent AI character who represents and speaks for the brand',                 prompt: 'Create a brand ambassador character: specific visual appearance, consistent styling, ownable facial features and expression. This character will appear across all content. Design for recognition and trust.',                                                    requiredInputs: ['brand_personality', 'audience_type'],           defaultParams: { style: 'photorealistic' },                                 tags: ['ambassador', 'character', 'consistent'],  isFeatured: true },
  { id: 'ai-influencer',        label: 'AI Content Creator',      category: 'avatar', subcategory: 'influencer',    description: 'Synthetic influencer with defined personality and content style',                 prompt: 'Design an AI content creator character: compelling visual identity, specific lifestyle aesthetic, consistent appearance across multiple settings. Must feel like a real person with a real world.',                                                               requiredInputs: ['niche', 'aesthetic', 'audience'],               defaultParams: { style: 'photorealistic' },                                 tags: ['influencer', 'ai', 'social'] },
  { id: 'animated-mascot',      label: 'Brand Mascot',            category: 'avatar', subcategory: 'mascot',        description: 'Animated brand character — Duolingo owl level ownable and memorable',            prompt: 'Create a brand mascot character: simple enough to be recognized at small sizes, distinctive enough to own, expressive enough to carry emotion. Design system: front view, side view, 4 key expressions.',                                                       requiredInputs: ['brand_values', 'mascot_type'],                  defaultParams: { style: '3d-animated' },                                    tags: ['mascot', 'brand', 'character'] },
  { id: 'digital-presenter',    label: 'Digital Presenter',       category: 'avatar', subcategory: 'presenter',     description: 'Photorealistic video presenter for corporate and educational content',             prompt: 'Generate a digital human presenter: photorealistic appearance, professional styling, neutral expressiveness suitable for on-camera delivery. Can lip-sync to any script in any language.',                                                                       requiredInputs: ['presenter_look', 'use_case'],                   defaultParams: { style: 'photorealistic' },                                 tags: ['presenter', 'digital-human', 'video'] },
];

// ── INTERACTIVE TEMPLATES ─────────────────────────────────────────────────────

export const INTERACTIVE_TEMPLATES: Template[] = [
  { id: 'brand-chat-agent',     label: 'Brand Chat Agent',        category: 'interactive', subcategory: 'chat',     description: 'Conversational AI that speaks in brand voice — customer service or engagement',  prompt: 'Build a brand chat assistant with defined personality, consistent brand voice, knowledge of product/service, and empathetic conversational style. Handles enquiries, educates, and never breaks character.',                                                     requiredInputs: ['brand_voice', 'knowledge_areas'],               defaultParams: { model: 'claude-sonnet' },                                  tags: ['chat', 'brand', 'conversational'] },
  { id: 'data-viz-report',      label: 'Data Visualization',      category: 'interactive', subcategory: 'dataviz',  description: 'Transform data into compelling visual narrative — shareable infographics',         prompt: 'Create an interactive data visualization that makes the numbers tell a story. Each chart earns its place, the visual hierarchy guides attention, and the overall arc moves from problem to insight to implication.',                                              requiredInputs: ['data', 'story_goal'],                           defaultParams: { format: 'interactive' },                                   tags: ['data', 'visualization', 'insight'] },
];

// ── ALL TEMPLATES MERGED ──────────────────────────────────────────────────────

export const ALL_TEMPLATES: Template[] = [
  ...VIDEO_TEMPLATES,
  ...IMAGE_TEMPLATES,
  ...AUDIO_TEMPLATES,
  ...DOCUMENT_TEMPLATES,
  ...AVATAR_TEMPLATES,
  ...INTERACTIVE_TEMPLATES,
];

// ── MANIFEST OUTPUT CATEGORIES ────────────────────────────────────────────────
// What Manifest surfaces to the user after Insight runs.
// Organized by strategic intent, not just format.

export const MANIFEST_OUTPUT_CATEGORIES = [
  {
    id:          'brand_film',
    label:       'Brand Film',
    description: 'The emotional centrepiece — character-led, long-form',
    icon:        'Film',
    color:       '#C9A96E',
    outputs:     ['cinematic-trailer', 'brand-film', 'documentary-portrait'],
    bestFor:     ['brand_launch', 'repositioning', 'emotional_connection'],
  },
  {
    id:          'campaign',
    label:       'Campaign System',
    description: 'Anchor visual + content variants across all formats',
    icon:        'Layers',
    color:       '#7aaee0',
    outputs:     ['campaign-visual', 'strategy-deck', 'batch-ad-variations'],
    bestFor:     ['product_launch', 'seasonal', 'brand_refresh'],
  },
  {
    id:          'social_factory',
    label:       'Social Content',
    description: 'Reels, posts, stories — bulk generation with brand voice',
    icon:        'Zap',
    color:       '#a07ae0',
    outputs:     ['social-reel', 'ugc-style', 'product-asmr', 'content-calendar'],
    bestFor:     ['always_on', 'community', 'engagement'],
  },
  {
    id:          'thought_leadership',
    label:       'Thought Leadership',
    description: 'Reports, research, expert content — builds authority',
    icon:        'FileText',
    color:       '#7abf8e',
    outputs:     ['research-report', 'strategy-deck', 'campaign-brief'],
    bestFor:     ['b2b', 'trust', 'authority'],
  },
  {
    id:          'product_showcase',
    label:       'Product Showcase',
    description: 'Hero shots, demos, ASMR — product as the hero',
    icon:        'Package',
    color:       '#e0a07a',
    outputs:     ['hero-shot', '360-product', 'floating-product', 'product-asmr'],
    bestFor:     ['ecommerce', 'launch', 'retail'],
  },
  {
    id:          'influence',
    label:       'Influence Engine',
    description: 'AI creators, brand characters, digital ambassadors',
    icon:        'Users',
    color:       '#e07aa0',
    outputs:     ['brand-ambassador', 'ai-influencer', 'ugc-style'],
    bestFor:     ['social', 'awareness', 'community'],
  },
] as const;
