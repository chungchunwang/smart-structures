import { Handle } from 'reactflow';

function EndNode({ isConnectable }) {
  return (
    <div style={{
      padding: '1rem',
      borderRadius: '8px',
      backgroundColor: '#fff',
      border: '1px solid #e2e8f0',
      minWidth: '100px',
      textAlign: 'center',
    }}>
      <Handle
        type="target"
        position="top"
        style={{ background: '#555' }}
        isConnectable={isConnectable}
      />
      <div style={{
        fontWeight: 'bold',
        color: '#334155',
      }}>
        End
      </div>
    </div>
  );
}

export default EndNode; 