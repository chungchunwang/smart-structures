import { Handle } from '@xyflow/react';
import { useState } from 'react';

function CompareNode({ data, isConnectable }) {
  const [operator, setOperator] = useState(data.properties?.operator || '>');

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
        id="input1"
        style={{ background: '#555', left: '25%' }}
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        position="top"
        id="input2"
        style={{ background: '#555', left: '75%' }}
        isConnectable={isConnectable}
      />
      <div style={{
        marginBottom: '0.5rem',
        fontWeight: 'bold',
        color: '#334155',
      }}>
        Compare
      </div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        marginBottom: '0.5rem' 
      }}>
        <select
          value={operator}
          onChange={(e) => setOperator(e.target.value)}
          style={{
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #e2e8f0',
            width: '100px',
            fontSize: '0.9rem',
            boxSizing: 'border-box',
          }}
        >
          <option value=">">{'>'}</option>
          <option value="<">{'<'}</option>
          <option value=">=">{'≥'}</option>
          <option value="<=">{'≤'}</option>
          <option value="==">{'='}</option>
        </select>
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.8rem',
        color: '#666',
        marginBottom: '0.5rem',
        padding: '0 1rem',
      }}>
        <span>Input 1</span>
        <span>Input 2</span>
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