import { Handle } from '@xyflow/react';
import { useState } from 'react';

function GetDataNode({ data, isConnectable }) {
  const [topic, setTopic] = useState(data.properties?.topic || '');
  const [dataPath, setDataPath] = useState(data.properties?.path || '');

  return (
    <div style={{
      padding: '1rem',
      borderRadius: '8px',
      backgroundColor: '#fff',
      border: '1px solid #e2e8f0',
      width: '280px',
      maxWidth: '90vw',
    }}>
      <Handle
        type="target"
        position="top"
        style={{ background: '#555' }}
        isConnectable={isConnectable}
      />
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
        placeholder="Topic (sensors/temperature)"
        style={{
          width: '100%',
          padding: '0.5rem',
          borderRadius: '4px',
          border: '1px solid #e2e8f0',
          marginBottom: '0.5rem',
          fontSize: '0.9rem',
          boxSizing: 'border-box',
        }}
      />
      <input
        value={dataPath}
        onChange={(e) => setDataPath(e.target.value)}
        placeholder="Data Path (value.temperature)"
        style={{
          width: '100%',
          padding: '0.5rem',
          borderRadius: '4px',
          border: '1px solid #e2e8f0',
          fontSize: '0.9rem',
          boxSizing: 'border-box',
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