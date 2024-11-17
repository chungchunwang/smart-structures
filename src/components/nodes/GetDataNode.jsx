import { Handle } from 'reactflow';
import { useState } from 'react';

function GetDataNode({ data, isConnectable }) {
  const [topic, setTopic] = useState(data.properties?.topic || '');

  return (
    <div style={{
      padding: '1rem',
      borderRadius: '8px',
      backgroundColor: '#fff',
      border: '1px solid #e2e8f0',
      minWidth: '200px',
    }}>
      <div style={{
        marginBottom: '0.5rem',
        fontWeight: 'bold',
        color: '#334155',
      }}>
        Get Data
      </div>
      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter topic"
        style={{
          width: '100%',
          padding: '0.5rem',
          borderRadius: '4px',
          border: '1px solid #e2e8f0',
        }}
      />
      <Handle
        type="source"
        position="bottom"
        style={{ background: '#555' }}
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default GetDataNode; 