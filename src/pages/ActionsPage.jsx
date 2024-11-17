import { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FiPlus, FiSave, FiFile, FiTrash2 } from 'react-icons/fi';
import useIsMobile from '../hooks/useIsMobile';
import { motion, AnimatePresence } from 'framer-motion';

// Import custom nodes
import GetDataNode from '../components/nodes/GetDataNode';
import CompareNode from '../components/nodes/CompareNode';
import PublishNode from '../components/nodes/PublishNode';
import TriggerNode from '../components/nodes/TriggerNode';
import TaskNode from '../components/nodes/TaskNode';
import NewScriptModal from '../components/NewScriptModal';

const nodeTypes = {
  trigger: TriggerNode,
  getData: GetDataNode,
  compare: CompareNode,
  publish: PublishNode,
  task: TaskNode,
};

const initialNodes = [
  {
    id: 'trigger1',
    type: 'trigger',
    position: { x: 250, y: 0 },
    data: { 
      label: 'Trigger',
      properties: {
        type: 'time',
        cron: '*/5 * * * *'
      }
    },
  },
];

function ActionsPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const isMobile = useIsMobile();
  const [actionScripts, setActionScripts] = useState([]);
  const [selectedScript, setSelectedScript] = useState(null);
  const [showScriptList, setShowScriptList] = useState(!isMobile);
  const [showNewScriptModal, setShowNewScriptModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActionScripts();
  }, []);

  const fetchActionScripts = async () => {
    try {
      const response = await fetch('https://novel-gibbon-related.ngrok-free.app/action');
      const data = await response.json();
      setActionScripts(data);
      if (data.length > 0) {
        setSelectedScript(data[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching action scripts:', error);
      setLoading(false);
    }
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const addNode = (type) => {
    const newNode = {
      id: `${type}_${Date.now()}`,
      type,
      position: { x: 250, y: nodes.length * 100 },
      data: { 
        label: type.charAt(0).toUpperCase() + type.slice(1),
        properties: type === 'getData' ? { topic: '' } :
                   type === 'compare' ? { operator: '>' } :
                   type === 'publish' ? { 
                     rule_id: '',
                     action: 'email',
                     action_data: { body: '', to: '' }
                   } : type === 'task' ? {
                     title: '',
                     description: '',
                     priority: 'Medium',
                     dueDate: 'Today'
                   } : {}
      },
    };
    setNodes((nds) => [...nds, newNode]);

    // Generate and log schema when adding a task node
    if (type === 'task') {
      generateSchema();
    }
  };

  const generateSchema = () => {
    const schema = {
      start_node: 'trigger1',
      nodes: nodes.map(node => {
        const baseNode = {
          id: node.id,
          type: node.type,
          properties: node.data.properties || {},
        };

        if (node.type === 'compare') {
          // Find input connections for compare node
          const input1Edge = edges.find(e => e.target === node.id && e.targetHandle === 'input1');
          const input2Edge = edges.find(e => e.target === node.id && e.targetHandle === 'input2');
          const trueEdge = edges.find(e => e.source === node.id && e.sourceHandle === 'true');
          const falseEdge = edges.find(e => e.source === node.id && e.sourceHandle === 'false');

          return {
            ...baseNode,
            properties: {
              ...baseNode.properties,
              input1: input1Edge?.source || '',
              input2: input2Edge?.source || '',
            },
            next_true: trueEdge ? [trueEdge.target] : [],
            next_false: falseEdge ? [falseEdge.target] : [],
          };
        } else if (node.type === 'publish' || node.type === 'task') {
          return {
            ...baseNode,
            next: [], // Terminal nodes
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

    console.log('Generated Schema:', JSON.stringify(schema, null, 2));
  };

  const handleNewScript = (scriptData) => {
    // Add the new script to the list
    const newScript = {
      ...scriptData,
      nodes: [], // Initialize with empty nodes
    };
    // You would typically update this in your backend
    console.log('New script created:', newScript);
  };

  return (
    <div style={{
      height: '100%',
      fontFamily: 'Poppins, sans-serif',
      display: 'flex',
    }}>
      {/* Scripts Sidebar */}
      {showScriptList && (
        <div style={{
          width: '300px',
          backgroundColor: '#f8fafc',
          borderRight: '1px solid #e2e8f0',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          height: '100%',
          overflow: 'auto',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <h2 style={{ fontSize: '1.25rem', color: '#334155' }}>Action Scripts</h2>
            <button
              onClick={() => setShowNewScriptModal(true)}
              style={{
                backgroundColor: '#528F75',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <FiPlus /> New
            </button>
          </div>

          {loading ? (
            <div style={{ 
              padding: '1rem', 
              textAlign: 'center',
              color: '#666'
            }}>
              Loading scripts...
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}>
              {actionScripts.map(script => (
                <motion.div
                  key={script.action_id}
                  onClick={() => setSelectedScript(script)}
                  whileHover={{ scale: 1.02 }}
                  style={{
                    padding: '1rem',
                    backgroundColor: selectedScript?.action_id === script.action_id ? '#528F75' : '#fff',
                    color: selectedScript?.action_id === script.action_id ? '#fff' : '#334155',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.25rem',
                  }}>
                    <FiFile />
                    <span style={{ fontWeight: 'medium' }}>{script.name}</span>
                  </div>
                  {script.description && (
                    <p style={{
                      fontSize: '0.8rem',
                      opacity: 0.8,
                      margin: 0,
                    }}>{script.description}</p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Editor Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
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
                fontFamily: 'Poppins, sans-serif',
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
              <button onClick={() => addNode('getData')} style={{
                backgroundColor: '#528F75',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif',
              }}>
                <FiPlus /> Get Data
              </button>
              <button onClick={() => addNode('compare')} style={{
                backgroundColor: '#528F75',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif',
              }}>
                <FiPlus /> Compare
              </button>
              <button onClick={() => addNode('publish')} style={{
                backgroundColor: '#528F75',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif',
              }}>
                <FiPlus /> Email
              </button>
              <button onClick={() => addNode('task')} style={{
                backgroundColor: '#528F75',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif',
              }}>
                <FiPlus /> Create Task
              </button>
            </Panel>
          </ReactFlow>
        </div>
      </div>

      {/* Add the modal */}
      <AnimatePresence>
        {showNewScriptModal && (
          <NewScriptModal
            onClose={() => setShowNewScriptModal(false)}
            onSave={handleNewScript}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default ActionsPage; 