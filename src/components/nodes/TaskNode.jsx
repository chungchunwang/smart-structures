import { Handle } from '@xyflow/react';
import { useState } from 'react';

function TaskNode({ data, isConnectable }) {
  const [title, setTitle] = useState(data.properties?.title || '');
  const [description, setDescription] = useState(data.properties?.description || '');
  const [priority, setPriority] = useState(data.properties?.priority || 'Medium');
  const [dueDate, setDueDate] = useState(data.properties?.dueDate || '');

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
        Create Task
      </div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task Title"
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
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task Description"
        style={{
          width: '100%',
          padding: '0.5rem',
          borderRadius: '4px',
          border: '1px solid #e2e8f0',
          marginBottom: '0.5rem',
          minHeight: '80px',
          resize: 'vertical',
          fontSize: '0.9rem',
          boxSizing: 'border-box',
        }}
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
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
        <option value="Low">Low Priority</option>
        <option value="Medium">Medium Priority</option>
        <option value="High">High Priority</option>
      </select>
      <input
        type="text"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        placeholder="Due Date (e.g., Today, Tomorrow)"
        style={{
          width: '100%',
          padding: '0.5rem',
          borderRadius: '4px',
          border: '1px solid #e2e8f0',
          fontSize: '0.9rem',
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

export default TaskNode; 