import { useState, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
  type NodeProps,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  Network,
  Search,
  FileText,
  Image,
  Share2,
  Play,
  Pause,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// ─── Node data type ───────────────────────────────────────────────────────────
interface NodeData {
  label: string;
  status: 'pending' | 'in_progress' | 'complete' | 'failed';
}

// ─── Node components MUST be defined BEFORE nodeTypes object ─────────────────
// Using const arrow functions ensures they are fully initialised before
// nodeTypes is constructed (fixes the TDZ / hoisting bug).

const InsightNode = ({ data }: NodeProps<NodeData>) => (
  <div className="px-4 py-3 rounded-xl min-w-[160px]"
    style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)' }}>
    <div className="flex items-center gap-2 mb-1">
      <Search className="w-4 h-4 text-blue-500" />
      <span className="text-sm font-medium text-blue-500">Insight</span>
    </div>
    <div className="text-xs text-[#A7A7A7]">{data.label}</div>
  </div>
);

const ManifestNode = ({ data }: NodeProps<NodeData>) => (
  <div className="px-4 py-3 rounded-xl min-w-[160px]"
    style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
    <div className="flex items-center gap-2 mb-1">
      <FileText className="w-4 h-4 text-green-500" />
      <span className="text-sm font-medium text-green-500">Manifest</span>
    </div>
    <div className="text-xs text-[#A7A7A7]">{data.label}</div>
  </div>
);

const CraftNode = ({ data }: NodeProps<NodeData>) => (
  <div className="px-4 py-3 rounded-xl min-w-[160px]"
    style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)' }}>
    <div className="flex items-center gap-2 mb-1">
      <Image className="w-4 h-4 text-purple-500" />
      <span className="text-sm font-medium text-purple-500">Craft</span>
    </div>
    <div className="text-xs text-[#A7A7A7]">{data.label}</div>
  </div>
);

const AmplifyNode = ({ data }: NodeProps<NodeData>) => (
  <div className="px-4 py-3 rounded-xl min-w-[160px]"
    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
    <div className="flex items-center gap-2 mb-1">
      <Share2 className="w-4 h-4 text-red-500" />
      <span className="text-sm font-medium text-red-500">Amplify</span>
    </div>
    <div className="text-xs text-[#A7A7A7]">{data.label}</div>
  </div>
);

// nodeTypes AFTER all component definitions
const nodeTypes = {
  insight: InsightNode,
  manifest: ManifestNode,
  craft: CraftNode,
  amplify: AmplifyNode,
} as const;

// ─── Static node templates — NO dynamic Tailwind class strings ────────────────
interface NodeTemplate {
  type: 'insight' | 'manifest' | 'craft' | 'amplify';
  label: string;
  icon: React.ElementType;
  textClass: string;
  bgStyle: React.CSSProperties;
}

const nodeTemplates: NodeTemplate[] = [
  {
    type: 'insight', label: 'New Research', icon: Search, textClass: 'text-blue-500',
    bgStyle: { background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)' },
  },
  {
    type: 'manifest', label: 'New Deck', icon: FileText, textClass: 'text-green-500',
    bgStyle: { background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' },
  },
  {
    type: 'craft', label: 'New Asset', icon: Image, textClass: 'text-purple-500',
    bgStyle: { background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)' },
  },
  {
    type: 'amplify', label: 'New Campaign', icon: Share2, textClass: 'text-red-500',
    bgStyle: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' },
  },
];

const miniMapColors: Record<string, string> = {
  insight: '#3B82F6', manifest: '#22C55E', craft: '#A855F7', amplify: '#EF4444',
};

// ─── Initial data ─────────────────────────────────────────────────────────────
const initialNodes: Node<NodeData>[] = [
  { id: '1', type: 'insight',  position: { x: 100,  y: 200 }, data: { label: 'Nike Research',    status: 'complete'    } },
  { id: '2', type: 'manifest', position: { x: 400,  y: 200 }, data: { label: 'Q4 Strategy Deck', status: 'complete'    } },
  { id: '3', type: 'craft',    position: { x: 700,  y: 200 }, data: { label: 'Hero Images',       status: 'in_progress' } },
  { id: '4', type: 'amplify',  position: { x: 1000, y: 200 }, data: { label: 'Social Launch',     status: 'pending'     } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
  { id: 'e3-4', source: '3', target: '4', animated: true },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export function WorkspacePage() {
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isRunning, setIsRunning] = useState(false);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  const addNode = (template: NodeTemplate) => {
    const newNode: Node<NodeData> = {
      id: `node-${Date.now()}`,
      type: template.type,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: { label: template.label, status: 'pending' },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#D8A34A]/10 rounded-full mb-2">
            <Network className="w-4 h-4 text-[#D8A34A]" />
            <span className="text-xs font-medium text-[#D8A34A] uppercase tracking-wider">Workspace</span>
          </div>
          <h1 className="text-2xl font-semibold text-[#F6F6F6]">Visual Workflow</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsRunning(!isRunning)}
            className="border-white/10 text-[#F6F6F6] hover:bg-white/5"
          >
            {isRunning ? <><Pause className="w-4 h-4 mr-2" />Pause</> : <><Play className="w-4 h-4 mr-2" />Run</>}
          </Button>
          <Button className="bg-[#D8A34A] hover:bg-[#e5b55c] text-[#0B0B0D]">
            <Save className="w-4 h-4 mr-2" />Save
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <Card className="bg-[#0F0F11] border-white/5 mb-4">
        <div className="p-3 flex items-center gap-2 flex-wrap">
          <span className="text-sm text-[#666] mr-2">Add:</span>
          {nodeTemplates.map((t) => (
            <button
              key={t.type}
              onClick={() => addNode(t)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-opacity hover:opacity-80 ${t.textClass}`}
              style={t.bgStyle}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Flow Canvas */}
      <div className="flex-1 bg-[#0F0F11] rounded-xl border border-white/5 overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-[#0F0F11]"
        >
          <Background color="#333" gap={20} size={1} />
          <Controls className="bg-[#0F0F11] border-white/10" />
          <MiniMap
            className="bg-[#0F0F11] border-white/10"
            nodeColor={(n) => miniMapColors[n.type ?? ''] ?? '#666'}
          />
        </ReactFlow>
      </div>
    </div>
  );
}
