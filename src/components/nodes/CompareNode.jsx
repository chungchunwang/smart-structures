import { Handle } from 'reactflow';
import { useState } from 'react';

function CompareNode({ data, isConnectable }) {
  const [input1, setInput1] = useState(data.properties?.input1 || '');
  const [input2, setInput2] = useState(data.properties?.input2 || '');
  const [operator, setOperator] = useState(data.properties?.operator || '>');

  return (
    <div style={{
      padding: '1rem',
      borderRadius: '8px',
      backgroundColor: '#fff',
      border: '1px solid #e2e8f0',
      minWidth: '200px',
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
        Compare
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <input
          value={input1}
          onChange={(e) => setInput1(e.target.value)}
          placeholder="Input 1"
          style={{
            flex: 1,
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #e2e8f0',
          }}
        />
        <select
          value={operator}
          onChange={(e) => setOperator(e.target.value)}
          style={{
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #e2e8f0',
          }}
        >
          <option value=">">{'>'}</option>
          <option value="<">{'<'}</option>
          <option value=">=">{'≥'}</option>
          <option value="<=">{'≤'}</option>
          <option value="==">{'='}</option>
        </select>
        <input
          value={input2}
          onChange={(e) => setInput2(e.target.value)}
          placeholder="Input 2"
          style={{
            flex: 1,
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #e2e8f0',
          }}
        />
      </div>
      <Handle
        type="source"
        position="bottom"
        id="true"
        style={{ background: '#10b981', left: '25%' }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position="bottom"
        id="false"
        style={{ background: '#ef4444', left: '75%' }}
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default CompareNode; 