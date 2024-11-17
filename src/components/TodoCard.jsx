import { motion, useMotionValue, useTransform } from 'framer-motion';
import PropTypes from 'prop-types';
import { FiCheck, FiClock, FiTag, FiMenu, FiTrash2, FiRefreshCw, FiMoreVertical } from 'react-icons/fi';
import { useState } from 'react';
import ContextMenu from './ContextMenu';
import useIsMobile from '../hooks/useIsMobile';

function TodoCard({ 
  todo, 
  onComplete, 
  onDelete, 
  onRestore,
  onPriorityChange, 
  isDragging, 
  onSelect,
  isCompleted,
  isRemoved,
  timestamp,
  dragControls
}) {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const isMobile = useIsMobile();
  
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-100, 0, 100],
    ['#4ADE80', '#ffffff', '#ff4444']
  );
  const opacity = useTransform(x, [-100, 0, 100], [0.5, 1, 0.5]);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const buttonSize = isMobile ? '44px' : '32px';
  const iconSize = isMobile ? 20 : 16;

  const formattedTimestamp = timestamp ? new Date(timestamp).toLocaleString() : null;

  const handleDragEnd = () => {
    const xValue = x.get();
    if (xValue <= -100 && onComplete) {
      onComplete(todo.id);
    } else if (xValue >= 100 && onDelete) {
      onDelete(todo.id);
    } else {
      x.set(0); // Reset position if not enough to trigger action
    }
  };

  return (
    <>
      <motion.div
        layout
        style={{
          x,
          background,
          opacity,
          position: 'relative',
          width: '100%',
          padding: isMobile ? '1rem 0.75rem' : '1rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '1rem',
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
          backgroundColor: isCompleted ? '#f0fdf4' : isRemoved ? '#fef2f2' : '#fff',
          userSelect: 'none',
        }}
        whileHover={{ scale: 1.02 }}
        onContextMenu={handleContextMenu}
        onClick={onSelect}
        drag={!isCompleted && !isRemoved ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.5rem',
          pointerEvents: 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
            {!isCompleted && !isRemoved && (
              <div
                onPointerDown={(e) => dragControls?.start(e)}
                style={{ 
                  color: '#666', 
                  cursor: 'grab',
                  touchAction: 'none',
                  pointerEvents: 'auto',
                }}
              >
                <FiMenu />
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ 
                fontSize: '1rem', 
                marginBottom: '0.5rem',
                fontFamily: 'Poppins, sans-serif',
                color: '#333',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textDecoration: isCompleted ? 'line-through' : 'none',
              }}>{todo.title}</h3>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: '0.25rem', 
                fontSize: '0.8rem',
                color: '#666'
              }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <FiClock /> {todo.dueDate}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <FiTag /> {todo.priority}
                  </span>
                </div>
                {timestamp && (
                  <span style={{ fontSize: '0.75rem', color: '#888' }}>
                    {isCompleted ? 'Completed' : 'Removed'} at: {formattedTimestamp}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div style={{ 
            display: 'flex', 
            gap: '0.75rem',
            marginLeft: 'auto',
            padding: isMobile ? '0.25rem' : 0,
            pointerEvents: 'auto',
          }}>
            {onRestore ? (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onRestore();
                }}
                style={{
                  backgroundColor: '#528F75',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: buttonSize,
                  height: buttonSize,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <FiRefreshCw size={iconSize} />
              </motion.button>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(todo.id);
                  }}
                  style={{
                    backgroundColor: '#fee2e2',
                    color: '#ef4444',
                    border: 'none',
                    borderRadius: '50%',
                    width: buttonSize,
                    height: buttonSize,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <FiTrash2 size={iconSize} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onComplete(todo.id);
                  }}
                  style={{
                    backgroundColor: '#528F75',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: buttonSize,
                    height: buttonSize,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <FiCheck size={iconSize} />
                </motion.button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {showContextMenu && (
        <ContextMenu
          x={contextMenuPosition.x}
          y={contextMenuPosition.y}
          onClose={() => setShowContextMenu(false)}
          onDelete={() => onDelete(todo.id)}
          onPriorityChange={(priority) => onPriorityChange(todo.id, priority)}
          currentPriority={todo.priority}
        />
      )}
    </>
  );
}

TodoCard.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    dueDate: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
  onComplete: PropTypes.func,
  onDelete: PropTypes.func,
  onRestore: PropTypes.func,
  onPriorityChange: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  isCompleted: PropTypes.bool,
  isRemoved: PropTypes.bool,
  timestamp: PropTypes.string,
  dragControls: PropTypes.object,
};

export default TodoCard; 