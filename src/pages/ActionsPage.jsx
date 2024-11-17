import { useState, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { FiPlus, FiSave } from 'react-icons/fi';
import useIsMobile from '../hooks/useIsMobile';

// Import custom nodes
import GetDataNode from '../components/nodes/GetDataNode';
import CompareNode from '../components/nodes/CompareNode';
import PublishNode from '../components/nodes/PublishNode';
import EndNode from '../components/nodes/EndNode';

const nodeTypes = {
  getData: GetDataNode,
  compare: CompareNode,
  publish: PublishNode,
  end: EndNode,
};

const initialNodes = [
  {
    id: 'start',
    type: 'getData',
    position: { x: 250, y: 0 },
    data: { 
      label: 'Get Data',
      properties: {
        topic: ''
      }
    },
  },
  {
    id: 'end',
    type: 'end',
    position: { x: 250, y: 400 },
    data: { label: 'End' },
  },
];

function ActionsPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const isMobile = useIsMobile();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
  }, []);

  const addNode = (type) => {
    const newNode = {
      id: `${type}_${Date.now()}`,
      type,
      position: { x: 250, y: nodes.length * 100 },
      data: { 
        label: type.charAt(0).toUpperCase() + type.slice(1),
        properties: type === 'getData' ? { topic: '' } :
                   type === 'compare' ? { input1: '', input2: '', operator: '>' } :
                   type === 'publish' ? { 
                     rule_id: '',
                     action: 'email',
                     action_data: { body: '', to: '' }
                   } : {}
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const generateSchema = () => {
    const schema = {
      start_node: nodes.find(n => n.type === 'getData')?.id || '',
      nodes: nodes.map(node => {
        const baseNode = {
          id: node.id,
          type: node.type,
          properties: node.data.properties || {},
        };

        if (node.type === 'compare') {
          const trueEdge = edges.find(e => e.source === node.id && e.sourceHandle === 'true');
          const falseEdge = edges.find(e => e.source === node.id && e.sourceHandle === 'false');
          return {
            ...baseNode,
            next_true: trueEdge ? [trueEdge.target] : [],
            next_false: falseEdge ? [falseEdge.target] : [],
          };
        } else {
          const nextEdges = edges.filter(e => e.source === node.id);
          return {
            ...baseNode,
            next: nextEdges.map(e => e.target),
          };
        }
      }),
    };

    console.log(JSON.stringify(schema, null, 2));
  };

  return (
    <div style={{
      height: '100%',
      fontFamily: 'Poppins, sans-serif',
    }}>
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{
          padding: '1rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}>
          <h1 style={{ fontSize: '1.25rem', color: '#334155' }}>Action Editor</h1>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={generateSchema}
              style={{
                backgroundColor: '#528F75',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
              }}
            >
              <FiSave />
              Save Flow
            </button>
          </div>
        </div>

        <div style={{ flex: 1, position: 'relative' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background />
            <Controls />
            <Panel position="top-left" style={{
              backgroundColor: '#fff',
              padding: '0.5rem',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}>
              <button
                onClick={() => addNode('getData')}
                style={{
                  backgroundColor: '#f1f5f9',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <FiPlus /> Get Data
              </button>
              <button
                onClick={() => addNode('compare')}
                style={{
                  backgroundColor: '#f1f5f9',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <FiPlus /> Compare
              </button>
              <button
                onClick={() => addNode('publish')}
                style={{
                  backgroundColor: '#f1f5f9',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <FiPlus /> Publish
              </button>
            </Panel>
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

export default ActionsPage; 