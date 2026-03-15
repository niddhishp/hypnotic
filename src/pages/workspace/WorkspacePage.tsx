import { useState, useCallback, useEffect, useRef } from 'react';
import ReactFlow, {
  Background, Controls, MiniMap, addEdge,
  useNodesState, useEdgesState, Panel,
  Handle, Position,
  type Connection, type Edge, type Node, type NodeProps,
  type NodeMouseHandler,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  Search, FileText, Image, Share2, Network, Save, Sparkles,
  Send, Plus, X, ChevronRight, Film, Music, Hash, Play,
  CheckCircle, Clock, RefreshCw, Zap, MoreHorizontal,
  Maximize2, ExternalLink, Trash2, GitBranch,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useInsightStore, useManifestStore, useCraftStore } from '@/store';
import { cn } from '@/lib/utils';
import { SEO } from '@/components/shared/SEO';

// ─── Node styling config ──────────────────────────────────────────────────────

const MODULE = {
  insight:  { color: '#7aaee0', bg: 'rgba(122,174,224,0.07)', border: 'rgba(122,174,224,0.25)', label: 'INSIGHT'  },
  manifest: { color: '#C9A96E', bg: 'rgba(201,169,110,0.07)', border: 'rgba(201,169,110,0.25)', label: 'MANIFEST' },
  craft:    { color: '#a07ae0', bg: 'rgba(160,122,224,0.07)', border: 'rgba(160,122,224,0.25)', label: 'CRAFT'    },
  amplify:  { color: '#7abf8e', bg: 'rgba(122,191,142,0.07)', border: 'rgba(122,191,142,0.25)', label: 'AMPLIFY'  },
  output:   { color: '#e0a87a', bg: 'rgba(224,168,122,0.07)', border: 'rgba(224,168,122,0.25)', label: 'OUTPUT'   },
};

const STATUS_STYLE = {
  pending:     { dot: '#444',    label: 'Pending'     },
  in_progress: { dot: '#C9A96E', label: 'In Progress' },
  complete:    { dot: '#7abf8e', label: 'Complete'    },
  failed:      { dot: '#ef4444', label: 'Failed'      },
};

type ModuleKey = keyof typeof MODULE;
type StatusKey = keyof typeof STATUS_STYLE;

interface HypNodeData {
  module: ModuleKey;
  title: string;
  subtitle?: string;
  status: StatusKey;
  meta?: string;
  outputType?: string;
  selected?: boolean;
}

// ─── Universal node renderer ──────────────────────────────────────────────────

const ICONS: Record<string, React.ElementType> = {
  insight: Search, manifest: FileText, craft: Image,
  amplify: Share2, output: Zap,
  // subtypes
  video: Film, audio: Music, social: Hash, image: Image,
};

const HypNode = ({ data, selected }: NodeProps<HypNodeData>) => {
  const m = MODULE[data.module] ?? MODULE.insight;
  const s = STATUS_STYLE[data.status] ?? STATUS_STYLE.pending;
  const iconKey = data.outputType ?? data.module;
  const Icon = ICONS[iconKey] ?? ICONS[data.module];

  return (
    <div
      className="relative rounded-xl min-w-[200px] max-w-[240px] select-none transition-all"
      style={{
        background: m.bg,
        border: `1px solid ${selected ? m.color : m.border}`,
        boxShadow: selected ? `0 0 0 2px ${m.color}30` : 'none',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b"
        style={{ borderColor: m.border }}>
        <div className="flex items-center gap-1.5">
          <span className="text-[8px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: m.color }}>{m.label}</span>
          {data.outputType && (
            <span className="text-[8px] uppercase tracking-wide text-white/30">· {data.outputType}</span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
          <span className="text-[8px] text-white/30">{s.label}</span>
        </div>
      </div>

      {/* Body */}
      <div className="px-3 py-2.5">
        <div className="flex items-start gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: `${m.color}15` }}>
            <Icon className="w-3 h-3" style={{ color: m.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-[#F0EDE8] leading-snug truncate">{data.title}</div>
            {data.subtitle && (
              <div className="text-[11px] text-[#555] mt-0.5 truncate">{data.subtitle}</div>
            )}
            {data.meta && (
              <div className="text-[11px] mt-1" style={{ color: `${m.color}90` }}>{data.meta}</div>
            )}
          </div>
        </div>
      </div>

      {/* Real ReactFlow connection handles */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: '#0D0D10',
          border: `2px solid ${m.color}`,
          width: 10,
          height: 10,
          left: -5,
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: '#0D0D10',
          border: `2px solid ${m.color}`,
          width: 10,
          height: 10,
          right: -5,
        }}
      />
    </div>
  );
};

const nodeTypes = { hyp: HypNode };

// ─── Edge style ───────────────────────────────────────────────────────────────

const EDGE_STYLE = {
  stroke: '#C9A96E55',
  strokeWidth: 1.5,
};

const EDGE_MARKER = { type: MarkerType.ArrowClosed, color: '#C9A96E55', width: 14, height: 14 };
const EDGE_MARKER_PENDING = { type: MarkerType.ArrowClosed, color: '#44444a', width: 14, height: 14 };

// ─── Node palette items ───────────────────────────────────────────────────────

const PALETTE = [
  { module: 'insight',  type: 'Research Report',      icon: Search,   outputType: undefined  },
  { module: 'insight',  type: 'Strategic Brief',       icon: FileText, outputType: undefined  },
  { module: 'manifest', type: 'Strategy Deck',         icon: FileText, outputType: 'strategy_deck' },
  { module: 'manifest', type: 'Film Script',           icon: Film,     outputType: 'film_script'   },
  { module: 'manifest', type: 'Social System',         icon: Hash,     outputType: 'social'        },
  { module: 'craft',    type: 'Image Generation',      icon: Image,    outputType: 'image'  },
  { module: 'craft',    type: 'Video Production',      icon: Film,     outputType: 'video'  },
  { module: 'craft',    type: 'Audio / Music',         icon: Music,    outputType: 'audio'  },
  { module: 'amplify',  type: 'Schedule & Publish',    icon: Share2,   outputType: undefined  },
  { module: 'output',   type: 'Export / Deliverable',  icon: Zap,      outputType: undefined  },
] as const;

// ─── Chat Agent ───────────────────────────────────────────────────────────────

interface AgentMsg { role: 'agent' | 'user'; text: string; action?: NodeAction; }
interface NodeAction {
  type: 'add_node' | 'connect_nodes' | 'build_pipeline';
  payload: any;
}

const AGENT_RESPONSES: Record<string, { text: string; action?: NodeAction }> = {
  default: {
    text: 'I can help you build your pipeline. Try:\n· "Build a campaign pipeline for Nike"\n· "Connect my research to a strategy deck"\n· "Add a video production node"\n· "Show me the full INSIGHT → AMPLIFY flow"',
  },
  nike: {
    text: 'Building a full Nike campaign pipeline. Adding Insight → Manifest → Craft → Amplify nodes with connections…',
    action: {
      type: 'build_pipeline',
      payload: {
        nodes: [
          { module: 'insight',  title: 'Nike Brand Research',   subtitle: 'Brand positioning, competitor map',  status: 'complete'    },
          { module: 'manifest', title: 'Q4 Strategy Deck',      subtitle: 'Strategy Deck · 14 sections',        status: 'complete',    outputType: 'strategy_deck' },
          { module: 'manifest', title: 'Hero Film Script',      subtitle: 'Film Script · 8 scenes',             status: 'in_progress', outputType: 'film_script'   },
          { module: 'craft',    title: 'Hero Visual Assets',    subtitle: 'Image Generation · Flux.2 Pro',      status: 'pending',     outputType: 'image'         },
          { module: 'craft',    title: '30s Brand Film',        subtitle: 'Video Production · Kling 2.6',       status: 'pending',     outputType: 'video'         },
          { module: 'amplify',  title: 'Social Launch Campaign',subtitle: 'Instagram · LinkedIn · X',           status: 'pending'     },
        ],
        edges: [[0,1],[1,2],[1,3],[2,4],[3,5],[4,5]],
      },
    },
  },
};

function matchResponse(msg: string) {
  const l = msg.toLowerCase();
  if (l.includes('nike') || l.includes('campaign') || l.includes('build')) return AGENT_RESPONSES.nike;
  if (l.includes('connect') || l.includes('research') || l.includes('insight')) {
    return {
      text: 'I\'ll connect your existing research to a new Manifest node. Looking at your store…',
      action: { type: 'add_node' as const, payload: { module: 'manifest', title: 'New Strategy Deck', subtitle: 'From Insight report', status: 'pending', outputType: 'strategy_deck' } },
    };
  }
  if (l.includes('video')) {
    return {
      text: 'Adding a Video Production node with Kling 2.6.',
      action: { type: 'add_node' as const, payload: { module: 'craft', title: 'Video Production', subtitle: 'Kling 2.6', status: 'pending', outputType: 'video' } },
    };
  }
  if (l.includes('image') || l.includes('visual')) {
    return {
      text: 'Adding an Image Generation node.',
      action: { type: 'add_node' as const, payload: { module: 'craft', title: 'Image Generation', subtitle: 'Flux.2 Pro', status: 'pending', outputType: 'image' } },
    };
  }
  return AGENT_RESPONSES.default;
}

// ─── Main component ───────────────────────────────────────────────────────────

let nodeIdCounter = 100;
const nid = () => `n-${++nodeIdCounter}`;

export function WorkspacePage() {
  const navigate  = useNavigate();
  const { reports } = useInsightStore();
  const { decks }   = useManifestStore();
  const { assets }  = useCraftStore();

  // ── Build initial nodes from store data ─────────────────────────────────────
  const buildInitialGraph = useCallback(() => {
    const nodes: Node<HypNodeData>[] = [];
    const edges: Edge[] = [];

    // Demo data (shown when store is empty)
    const demoInsight = {
      id: 'demo-insight-1',
      subject: 'Nike Air Max — Brand Positioning',
      brandArchetype: { archetype: 'The Hero' },
      confidenceScore: 92,
    };
    const demoDecks = [
      { id: 'demo-deck-1', title: 'Nike Q4 Campaign Strategy', outputType: 'strategy_deck', status: 'complete' },
      { id: 'demo-deck-2', title: 'Hero Film Script', outputType: 'film_script', status: 'in_progress' },
    ];

    const insightData  = reports.length > 0 ? reports  : [demoInsight as any];
    const manifestData = decks.length   > 0 ? decks    : (demoDecks as any[]);

    let xCur = 60;
    const yBase = 200;
    const xStep = 280;
    const prevInsightIds: string[] = [];

    // Insight nodes
    insightData.slice(0, 3).forEach((r: any, i: number) => {
      const id = `ins-${r.id}`;
      prevInsightIds.push(id);
      nodes.push({
        id, type: 'hyp',
        position: { x: xCur, y: yBase + i * 160 },
        data: {
          module: 'insight', status: 'complete',
          title: r.subject ?? 'Research Report',
          subtitle: r.brandArchetype?.archetype ? `Archetype: ${r.brandArchetype.archetype}` : undefined,
          meta: r.confidenceScore ? `${r.confidenceScore}% confidence` : undefined,
        },
      });
    });
    xCur += xStep;

    // Manifest nodes
    const manifestIds: string[] = [];
    manifestData.slice(0, 3).forEach((d: any, i: number) => {
      const id = `man-${d.id}`;
      manifestIds.push(id);
      nodes.push({
        id, type: 'hyp',
        position: { x: xCur, y: yBase + i * 160 },
        data: {
          module: 'manifest',
          status: (d.status === 'complete' ? 'complete' : d.status === 'generating' ? 'in_progress' : 'pending') as StatusKey,
          title: (d as any).title ?? 'Manifest Output',
          subtitle: d.outputType?.replace('_', ' ') ?? undefined,
          outputType: d.outputType,
          meta: (d as any).sectionCount ? `${(d as any).sectionCount} sections` : undefined,
        },
      });
      // Edge from first insight to this manifest
      if (prevInsightIds[0]) {
        edges.push({
          id: `e-ins-man-${i}`, source: prevInsightIds[0], target: id,
          type: 'smoothstep', animated: i === 0,
          style: EDGE_STYLE, markerEnd: EDGE_MARKER,
        });
      }
    });
    xCur += xStep;

    // Craft placeholder nodes
    if (manifestIds.length > 0) {
      const craftTypes = [
        { id: 'craft-img', outputType: 'image', title: 'Image Generation',   subtitle: 'Flux.2 Pro · awaiting Manifest', status: 'pending' as StatusKey },
        { id: 'craft-vid', outputType: 'video', title: 'Video Production',   subtitle: 'Kling 2.6 · awaiting script',    status: 'pending' as StatusKey },
      ];
      craftTypes.forEach((c, i) => {
        nodes.push({
          id: c.id, type: 'hyp',
          position: { x: xCur, y: yBase + i * 160 },
          data: { module: 'craft', status: c.status, title: c.title, subtitle: c.subtitle, outputType: c.outputType },
        });
        edges.push({
          id: `e-man-craft-${i}`, source: manifestIds[0], target: c.id,
          type: 'smoothstep', animated: false,
          style: EDGE_STYLE, markerEnd: EDGE_MARKER,
        });
      });
      xCur += xStep;

      // Amplify
      nodes.push({
        id: 'amp-1', type: 'hyp',
        position: { x: xCur, y: yBase + 80 },
        data: { module: 'amplify', status: 'pending', title: 'Social Launch Campaign', subtitle: 'Instagram · LinkedIn · X · YouTube' },
      });
      ['craft-img', 'craft-vid'].forEach((src, i) => {
        edges.push({
          id: `e-craft-amp-${i}`, source: src, target: 'amp-1',
          type: 'smoothstep', style: EDGE_STYLE,
          markerEnd: EDGE_MARKER,
        });
      });
    }

    return { nodes, edges };
  }, [reports, decks, assets]);

  const { nodes: initNodes, edges: initEdges } = buildInitialGraph();
  const [nodes, setNodes, onNodesChange] = useNodesState<HypNodeData>(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);
  const [selectedNode, setSelectedNode]  = useState<Node<HypNodeData> | null>(null);
  const [chatInput, setChatInput]        = useState('');
  const [msgs, setMsgs]                  = useState<AgentMsg[]>([
    { role: 'agent', text: 'Your pipeline has been auto-populated from your work across Insight, Manifest, and Craft.\n\nYou can:\n· Drag nodes from the palette to add them\n· Connect nodes by dragging from a handle\n· Chat with me to build or modify the pipeline\n· Click any node to inspect it\n\nTry: "Build a campaign pipeline for Nike"' },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const onConnect = useCallback(
    (c: Connection) => setEdges(eds => addEdge({
      ...c, type: 'smoothstep', animated: true,
      style: EDGE_STYLE, markerEnd: EDGE_MARKER,
    }, eds)),
    [setEdges]
  );

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    setSelectedNode(prev => prev?.id === node.id ? null : node);
  }, []);

  // ── Add a node at a smart position ──────────────────────────────────────────
  const addNodeFromData = (data: Partial<HypNodeData>, position?: { x: number; y: number }) => {
    const id = nid();
    const maxX = nodes.reduce((acc, n) => Math.max(acc, n.position.x), 0);
    const pos = position ?? { x: maxX + 300, y: 200 + Math.random() * 150 };
    setNodes(prev => [...prev, {
      id, type: 'hyp', position: pos,
      data: {
        module: (data.module ?? 'insight') as ModuleKey,
        title: data.title ?? 'New Node',
        subtitle: data.subtitle,
        status: (data.status ?? 'pending') as StatusKey,
        outputType: data.outputType,
        meta: data.meta,
      },
    }]);
    return id;
  };

  // ── Build a full pipeline from agent action ──────────────────────────────────
  const applyAction = (action: NodeAction) => {
    if (action.type === 'add_node') {
      addNodeFromData(action.payload);
    }
    if (action.type === 'build_pipeline') {
      const { nodes: pNodes, edges: pEdges } = action.payload;
      const startX = nodes.reduce((acc, n) => Math.max(acc, n.position.x), 0) + 320;
      const xStep = 280;
      const moduleOrder: ModuleKey[] = ['insight', 'manifest', 'craft', 'amplify', 'output'];
      const idMap: string[] = [];

      // group nodes by module order to create columns
      const ordered = [...pNodes].sort((a: any, b: any) =>
        moduleOrder.indexOf(a.module) - moduleOrder.indexOf(b.module)
      );

      // track x per module column
      const colX: Record<string, number> = {};
      const colY: Record<string, number> = {};

      ordered.forEach((n: any) => {
        const colKey = n.module;
        if (colX[colKey] === undefined) {
          const idx = moduleOrder.indexOf(n.module as ModuleKey);
          colX[colKey] = startX + idx * xStep;
          colY[colKey] = 100;
        }
        const id = addNodeFromData({ ...n, module: n.module as ModuleKey, status: n.status as StatusKey },
          { x: colX[colKey], y: colY[colKey] });
        idMap.push(id);
        colY[colKey] += 160;
      });

      // Add edges
      if (pEdges) {
        setTimeout(() => {
          const newEdges: Edge[] = pEdges.map(([si, ti]: [number, number]) => ({
            id: `ae-${Date.now()}-${si}-${ti}`,
            source: idMap[si], target: idMap[ti],
            type: 'smoothstep', animated: true,
            style: { stroke: '#C9A96E50', strokeWidth: 1.5 },
            markerEnd: EDGE_MARKER,
          }));
          setEdges(prev => [...prev, ...newEdges]);
        }, 100);
      }
    }
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setMsgs(prev => [...prev, { role: 'user', text: msg }]);
    setChatInput('');

    // Simulate agent thinking then responding
    setTimeout(() => {
      const response = matchResponse(msg);
      setMsgs(prev => [...prev, { role: 'agent', text: response.text, action: response.action }]);
      if (response.action) {
        setTimeout(() => applyAction(response.action!), 400);
      }
    }, 600);
  };

  // ── Drag from palette ────────────────────────────────────────────────────────
  const onDragStart = (e: React.DragEvent, item: typeof PALETTE[number]) => {
    e.dataTransfer.setData('application/hypnotic-node', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData('application/hypnotic-node');
    if (!raw) return;
    const item = JSON.parse(raw);
    // Get canvas-relative position
    const bounds = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const pos = { x: e.clientX - bounds.left - 100, y: e.clientY - bounds.top - 40 };
    addNodeFromData({
      module: item.module as ModuleKey,
      title: item.type,
      status: 'pending',
      outputType: item.outputType,
    }, pos);
  }, [nodes]);

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };

  const deleteNode = (id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    setEdges(prev => prev.filter(e => e.source !== id && e.target !== id));
    setSelectedNode(null);
  };

  const navigateToModule = (node: Node<HypNodeData>) => {
    const paths: Record<ModuleKey, string> = {
      insight: '/insight', manifest: '/manifest',
      craft: node.data.outputType ? `/craft/${node.data.outputType}` : '/craft',
      amplify: '/amplify', output: '/amplify',
    };
    navigate(paths[node.data.module] ?? '/');
  };

  const m = selectedNode ? MODULE[selectedNode.data.module] : null;

  return (
    <div style={{ background: '#0A0A0C' }} className="flex h-[calc(100vh-64px)] overflow-hidden">

      {/* ── Left: Node Palette ────────────────────────────────── */}
      <div className="w-[200px] flex-shrink-0 border-r border-white/8 flex flex-col overflow-hidden"
        style={{ background: '#0D0D10' }}>
        <div className="px-4 py-4 border-b border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <Network className="w-3.5 h-3.5 text-[#C9A96E]" />
            <span className="text-xs font-medium text-[#F0EDE8]">Workspace</span>
          </div>
          <p className="text-[11px] text-[#444] leading-relaxed">Drag nodes onto canvas or chat to build the pipeline</p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="text-[11px] text-[#444] uppercase tracking-wider mb-2 px-1">Node Palette</div>
          {PALETTE.map((item, i) => {
            const s = MODULE[item.module as ModuleKey];
            const Icon = item.icon as React.ElementType;
            return (
              <div key={i}
                draggable
                onDragStart={e => onDragStart(e, item)}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-grab active:cursor-grabbing hover:bg-white/5 transition-colors group"
                style={{ border: `1px solid transparent` }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = s.border)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
              >
                <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                  style={{ background: s.bg }}>
                  <Icon className="w-3 h-3" style={{ color: s.color }} />
                </div>
                <span className="text-[11px] text-[#888] group-hover:text-[#C0B8AC] transition-colors leading-tight">{item.type}</span>
              </div>
            );
          })}
        </div>

        {/* Pipeline stats */}
        <div className="p-3 border-t border-white/5 space-y-2">
          <div className="text-[11px] text-[#444] uppercase tracking-wider mb-1">Pipeline</div>
          {[
            { label: 'Nodes',    value: nodes.length },
            { label: 'Edges',    value: edges.length },
            { label: 'Complete', value: nodes.filter(n => n.data.status === 'complete').length },
            { label: 'Pending',  value: nodes.filter(n => n.data.status === 'pending').length },
          ].map(s => (
            <div key={s.label} className="flex items-center justify-between">
              <span className="text-[11px] text-[#555]">{s.label}</span>
              <span className="text-[11px] font-medium text-[#888]">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Center: Canvas ────────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden" onDrop={onDrop} onDragOver={onDragOver}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={() => setSelectedNode(null)}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          style={{ background: '#0A0A0C' }}
          deleteKeyCode="Delete"
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: false,
            style: { stroke: '#C9A96E60', strokeWidth: 1.5 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#C9A96E60', width: 16, height: 16 },
          }}
          connectionLineStyle={{ stroke: '#C9A96E', strokeWidth: 2, strokeDasharray: '5 3' }}
          connectionLineType={'smoothstep' as any}
        >
          <Background color="#18181e" gap={24} size={1} variant={'dots' as any} />
          <Controls
            style={{ background: '#0D0D10', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10 }}
            showInteractive={false}
          />
          <MiniMap
            style={{ background: '#0D0D10', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10 }}
            nodeColor={n => {
              const mod = (n.data as HypNodeData)?.module as ModuleKey;
              return MODULE[mod]?.color ?? '#555';
            }}
            maskColor="rgba(0,0,0,0.5)"
          />

          {/* Top-right panel: save + module nav shortcuts */}
          <Panel position="top-right">
            <div className="flex items-center gap-2">
              {(['insight','manifest','craft','amplify'] as ModuleKey[]).map(mod => {
                const s = MODULE[mod];
                const nodeCount = nodes.filter(n => n.data.module === mod).length;
                return (
                  <button key={mod}
                    onClick={() => navigate(`/${mod}`)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all hover:opacity-80"
                    style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
                    {mod.charAt(0).toUpperCase() + mod.slice(1)}
                    <span className="opacity-60">{nodeCount}</span>
                  </button>
                );
              })}
              <button className="flex items-center gap-1.5 bg-[#C9A96E] text-[#08080A] rounded-lg px-3 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity ml-1">
                <Save className="w-3 h-3" /> Save
              </button>
            </div>
          </Panel>

          {/* Node inspector panel */}
          {selectedNode && m && (
            <Panel position="bottom-center">
              <div className="rounded-2xl border overflow-hidden shadow-2xl w-[480px]"
                style={{ background: '#0D0D10', borderColor: m.border }}>
                <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: m.border }}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: m.color }} />
                    <span className="text-xs font-medium" style={{ color: m.color }}>{m.label}</span>
                    <span className="text-xs text-[#F0EDE8]">· {selectedNode.data.title}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => navigateToModule(selectedNode)}
                      className="flex items-center gap-1 text-[11px] px-2 py-1 rounded hover:bg-white/5 transition-colors" style={{ color: m.color }}>
                      <ExternalLink className="w-3 h-3" /> Open
                    </button>
                    <button onClick={() => deleteNode(selectedNode.id)}
                      className="p-1 rounded hover:bg-red-500/10 text-[#555] hover:text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setSelectedNode(null)}
                      className="p-1 rounded hover:bg-white/5 text-[#555] hover:text-[#888] transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="px-4 py-3 flex items-center gap-6 text-[11px]">
                  {selectedNode.data.subtitle && (
                    <span className="text-[#666]">{selectedNode.data.subtitle}</span>
                  )}
                  {selectedNode.data.meta && (
                    <span style={{ color: `${m.color}90` }}>{selectedNode.data.meta}</span>
                  )}
                  <span className="ml-auto flex items-center gap-1 text-[#555]">
                    {selectedNode.data.status === 'complete'
                      ? <><CheckCircle className="w-3 h-3 text-[#7abf8e]" />Complete</>
                      : selectedNode.data.status === 'in_progress'
                      ? <><RefreshCw className="w-3 h-3 text-[#C9A96E] animate-spin" />In Progress</>
                      : <><Clock className="w-3 h-3" />Pending</>}
                  </span>
                </div>
              </div>
            </Panel>
          )}

          {/* Empty state hint */}
          {nodes.length === 0 && (
            <Panel position="top-center">
              <div className="text-center pt-24">
                <Network className="w-10 h-10 text-[#2a2a35] mx-auto mb-3" />
                <div className="text-sm text-[#444] mb-1">Canvas is empty</div>
                <p className="text-xs text-[#333]">Drag nodes from the palette, or chat with the agent to build your pipeline</p>
              </div>
            </Panel>
          )}
        </ReactFlow>
      </div>

      {/* ── Right: Agent Chat ─────────────────────────────────── */}
      <div className="w-[300px] flex-shrink-0 border-l border-white/8 flex flex-col overflow-hidden"
        style={{ background: '#0D0D10' }}>
        {/* Agent header */}
        <div className="px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#C9A96E]/20 flex items-center justify-center">
              <GitBranch className="w-3 h-3 text-[#C9A96E]" />
            </div>
            <div>
              <div className="text-xs font-medium text-[#F0EDE8]">Pipeline Agent</div>
              <div className="text-[11px] text-[#555]">Build via chat or drag nodes</div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
          {msgs.map((msg, i) => (
            <div key={i} className={msg.role === 'agent' ? 'flex gap-2' : 'flex justify-end'}>
              {msg.role === 'agent' ? (
                <>
                  <div className="w-5 h-5 rounded-full bg-[#C9A96E]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-2.5 h-2.5 text-[#C9A96E]" />
                  </div>
                  <div className="bg-white/4 rounded-xl rounded-tl-none px-3 py-2.5 text-[11px] text-[#B0A898] leading-relaxed flex-1"
                    style={{ whiteSpace: 'pre-line' }}>
                    {msg.text}
                    {msg.action && (
                      <div className="mt-2 flex items-center gap-1 text-[11px] text-[#C9A96E]/70">
                        <Zap className="w-2.5 h-2.5" />
                        {msg.action.type === 'build_pipeline' ? 'Pipeline built on canvas' : 'Node added to canvas'}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="bg-[#C9A96E]/12 border border-[#C9A96E]/20 rounded-xl rounded-tr-none px-3 py-2 text-[11px] text-[#F0EDE8] max-w-[90%]">
                  {msg.text}
                </div>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Quick prompts */}
        <div className="px-3 pb-2 flex flex-wrap gap-1">
          {[
            'Build Nike pipeline',
            'Add video node',
            'Connect research',
            'Show full flow',
          ].map(q => (
            <button key={q} onClick={() => { setChatInput(q); }}
              className="text-[11px] px-2 py-1 rounded-lg border border-white/8 text-[#555] hover:border-white/20 hover:text-[#888] transition-all">
              {q}
            </button>
          ))}
        </div>

        {/* Chat input */}
        <div className="px-3 py-3 border-t border-white/5">
          <div className="flex gap-2">
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendChat()}
              placeholder="Build pipeline, add nodes, connect…"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F0EDE8] placeholder:text-[#444] focus:outline-none focus:border-[#C9A96E]/40"
            />
            <button onClick={sendChat}
              className="p-2 bg-[#C9A96E] text-[#08080A] rounded-xl hover:opacity-90 flex-shrink-0">
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
