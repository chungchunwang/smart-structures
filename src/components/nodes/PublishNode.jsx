import { Handle } from 'reactflow';
import { useState } from 'react';

function PublishNode({ data, isConnectable }) {
  const [ruleId, setRuleId] = useState(data.properties?.rule_id || '');
  const [email, setEmail] = useState(data.properties?.action_data?.to || '');
  const [body, setBody] = useState(data.properties?.action_data?.body || '');

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
        Publish Alert
      </div>
      <input
        value={ruleId}
        onChange={(e) => setRuleId(e.target.value)}
        placeholder="Rule ID"
        style={{
          width: '100%',
          padding: '0.5rem',
          borderRadius: '4px',
          border: '1px solid #e2e8f0',
          marginBottom: '0.5rem',
        }}
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        style={{
          width: '100%',
          padding: '0.5rem',
          borderRadius: '4px',
          border: '1px solid #e2e8f0',
          marginBottom: '0.5rem',
        }}
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Message body"
        style={{
          width: '100%',
          padding: '0.5rem',
          borderRadius: '4px',
          border: '1px solid #e2e8f0',
          resize: 'vertical',
          minHeight: '80px',
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

export default PublishNode; 