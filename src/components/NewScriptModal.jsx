import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { FiX } from 'react-icons/fi';

function NewScriptModal({ onClose, onSave }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('monitoring');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: Date.now().toString(),
      name,
      description,
      category,
      lastModified: new Date().toISOString().split('T')[0],
    });
    onClose();
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
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '2rem',
          width: '100%',
          maxWidth: '500px',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
          }}
        >
          <FiX size={20} />
        </button>

        <h2 style={{
          fontSize: '1.25rem',
          color: '#334155',
          marginBottom: '1.5rem',
          fontFamily: 'Poppins, sans-serif',
        }}>
          Create New Action Script
        </h2>

        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <div>
            <label
              htmlFor="name"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#334155',
                fontSize: '0.9rem',
              }}
            >
              Script Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '0.9rem',
                boxSizing: 'border-box',
              }}
              placeholder="e.g., Temperature Alert"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#334155',
                fontSize: '0.9rem',
              }}
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '0.9rem',
                minHeight: '100px',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
              placeholder="Describe what this script does..."
            />
          </div>

          <div>
            <label
              htmlFor="category"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#334155',
                fontSize: '0.9rem',
              }}
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '0.9rem',
                backgroundColor: '#fff',
                boxSizing: 'border-box',
              }}
            >
              <option value="monitoring">Monitoring</option>
              <option value="maintenance">Maintenance</option>
              <option value="alerts">Alerts</option>
              <option value="automation">Automation</option>
            </select>
          </div>

          <div style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '1rem',
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#fff',
                color: '#334155',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#528F75',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              Create Script
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

NewScriptModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default NewScriptModal; 