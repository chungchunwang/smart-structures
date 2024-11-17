import { Handle } from '@xyflow/react';
import { useState } from 'react';
import PropTypes from 'prop-types';

function TriggerNode({ data, isConnectable }) {
  const [triggerType, setTriggerType] = useState(data.properties?.type || 'time');
  const [cronExpression, setCronExpression] = useState(data.properties?.cron || '');
  const [webhookPath, setWebhookPath] = useState(data.properties?.webhook || '');

  return (
    <div style={{
      padding: '1rem',
      borderRadius: '8px',
      backgroundColor: '#fff',
      border: '1px solid #e2e8f0',
      width: '280px',
      maxWidth: '90vw',
    }}>
      <div style={{
        marginBottom: '0.5rem',
        fontWeight: 'bold',
        color: '#334155',
      }}>
        Trigger
      </div>
      <select
        value={triggerType}
        onChange={(e) => setTriggerType(e.target.value)}
        style={{
          width: '100%',
          padding: '0.5rem',
          borderRadius: '4px',
          border: '1px solid #e2e8f0',
          marginBottom: '0.5rem',
          fontSize: '0.9rem',
          boxSizing: 'border-box',
        }}
      >
        <option value="time">Time-based</option>
        <option value="hook">Hook</option>
      </select>

      {triggerType === 'time' ? (
        <input
          value={cronExpression}
          onChange={(e) => setCronExpression(e.target.value)}
          placeholder="0"
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #e2e8f0',
            fontSize: '0.9rem',
            boxSizing: 'border-box',
          }}
        />
      ) : (
        <input
          value={webhookPath}
          onChange={(e) => setWebhookPath(e.target.value)}
          placeholder="Path (/hooks/my-trigger)"
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #e2e8f0',
            fontSize: '0.9rem',
            boxSizing: 'border-box',
          }}
        />
      )}
      <Handle
        type="source"
        position="bottom"
        style={{ background: '#555' }}
        isConnectable={isConnectable}
      />
    </div>
  );
}

TriggerNode.propTypes = {
  data: PropTypes.shape({
    properties: PropTypes.shape({
      type: PropTypes.string,
      cron: PropTypes.string,
      webhook: PropTypes.string,
    }),
  }),
  isConnectable: PropTypes.bool,
};

export default TriggerNode; 