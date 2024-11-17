import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiX } from 'react-icons/fi';

export default function CreateTaskModal({ onClose, onSave, sources }) {
  const [taskData, setTaskData] = useState({
    title: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'Medium',
    description: '',
    source: sources[0],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newTask = {
      ...taskData,
      document_id: Math.random().toString(36).substr(2, 9), // Simple random ID
    };

    try {
      const response = await fetch('https://novel-gibbon-related.ngrok-free.app/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask)
      });

      if (!response.ok) throw new Error('Failed to create task');
      
      onSave();
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '2rem',
          width: '90%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Create New Task</h2>
          <button onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Title</label>
            <input
              type="text"
              value={taskData.title}
              onChange={e => setTaskData(prev => ({ ...prev, title: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #e2e8f0',
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Due Date</label>
            <input
              type="date"
              value={taskData.dueDate}
              onChange={e => setTaskData(prev => ({ ...prev, dueDate: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #e2e8f0',
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Priority</label>
            <select
              value={taskData.priority}
              onChange={e => setTaskData(prev => ({ ...prev, priority: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #e2e8f0',
              }}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Source</label>
            <select
              value={taskData.source}
              onChange={e => setTaskData(prev => ({ ...prev, source: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #e2e8f0',
              }}
            >
              {sources.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
            <textarea
              value={taskData.description}
              onChange={e => setTaskData(prev => ({ ...prev, description: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #e2e8f0',
                minHeight: '100px',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: '#528F75',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              border: 'none',
              width: '100%',
              cursor: 'pointer',
            }}
          >
            Create Task
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
} 