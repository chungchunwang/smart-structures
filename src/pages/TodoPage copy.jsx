import { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, Reorder, AnimatePresence, useDragControls } from 'framer-motion';
import TodoCard from '../components/TodoCard';
import TaskDetailModal from '../components/TaskDetailModal';
import Toast from '../components/Toast';
import ListSelector from '../components/ListSelector';
import { FiRefreshCw, FiPlus } from 'react-icons/fi';
import useIsMobile from '../hooks/useIsMobile';
import CreateTaskModal from '../components/CreateTaskModal';

function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedList, setSelectedList] = useState('all');
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [lastAction, setLastAction] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const isMobile = useIsMobile();

  const lists = ['HVAC', 'Water', 'Gas', 'Elevator', 'Report'];

  // Load tasks from server
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const url = selectedList === 'all' 
          ? 'https://novel-gibbon-related.ngrok-free.app/task'
          : `https://novel-gibbon-related.ngrok-free.app/task?source=${selectedList}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        
        const data = await response.json();
        
        // Load saved order from localStorage
        const savedOrder = localStorage.getItem(`todoOrder_${selectedList}`);
        if (savedOrder) {
          try {
            const orderMap = JSON.parse(savedOrder);
            data.sort((a, b) => {
              const orderA = orderMap[a.document_id] ?? Number.MAX_SAFE_INTEGER;
              const orderB = orderMap[b.document_id] ?? Number.MAX_SAFE_INTEGER;
              return orderA - orderB;
            });
          } catch (e) {
            console.error('Error applying saved order:', e);
          }
        }
        
        setTodos(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [selectedList]);

  // Save order to localStorage whenever todos change
  useEffect(() => {
    const orderMap = {};
    todos.forEach((todo, index) => {
      orderMap[todo.document_id] = index;
    });
    localStorage.setItem(`todoOrder_${selectedList}`, JSON.stringify(orderMap));
  }, [todos, selectedList]);

  const handleComplete = useCallback(async (id) => {
    try {
      const response = await fetch(`https://novel-gibbon-related.ngrok-free.app/task/${id}/complete`, {
        method: 'POST'
      });
      
      if (!response.ok) throw new Error('Failed to complete task');
      
      setTodos(prev => prev.filter(todo => todo.document_id !== id));
      setSelectedTodo(null);
      setLastAction('complete');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    } catch (error) {
      console.error('Error completing task:', error);
    }
  }, []);

  const handleDelete = useCallback(async (id) => {
    try {
      const response = await fetch(`https://novel-gibbon-related.ngrok-free.app/task/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete task');
      
      setTodos(prev => prev.filter(todo => todo.document_id !== id));
      setSelectedTodo(null);
      setLastAction('delete');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }, []);

  const handlePriorityChange = async (id, newPriority) => {
    try {
      const response = await fetch(`https://novel-gibbon-related.ngrok-free.app/task/${id}/priority`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ new_priority: newPriority })
      });
      
      if (!response.ok) throw new Error('Failed to update priority');
      
      setTodos(prev => prev.map(todo => 
        todo.document_id === id ? { ...todo, priority: newPriority } : todo
      ));
    } catch (error) {
      console.error('Error updating priority:', error);
    }
  };

  const handleReorderWithAI = () => {
    const priorityOrder = { High: 0, Medium: 1, Low: 2 };
    const reorderedTodos = [...todos].sort((a, b) => 
      priorityOrder[a.priority] - priorityOrder[b.priority]
    );
    setTodos(reorderedTodos);
  };

  const counts = useMemo(() => {
    const result = { 
      all: todos.length,
    };
    lists.forEach(list => {
      result[list] = todos.filter(todo => todo.source === list).length;
    });
    return result;
  }, [todos, lists]);

  const dragControls = useDragControls();

  const renderTodoCard = (todo, source) => (
    <TodoCard
      todo={todo}
      onComplete={source === 'active' ? () => handleComplete(todo.document_id) : undefined}
      onDelete={source === 'active' ? () => handleDelete(todo.document_id) : undefined}
      onPriorityChange={handlePriorityChange}
      isDragging={false}
      onSelect={() => setSelectedTodo(todo)}
      isCompleted={source === 'Completed'}
      isRemoved={source === 'Removed'}
      timestamp={source === 'Completed' ? todo.completedAt : source === 'Removed' ? todo.removedAt : undefined}
      dragControls={source === 'active' ? dragControls : undefined}
    />
  );

  const handleTaskCreated = () => {
    // Refetch tasks

  };

  if (loading) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Poppins, sans-serif',
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <FiRefreshCw size={24} />
        </motion.div>
      </div>
    );
  }

  for (const todo of todos) {
    console.log(todo.document_id);
  }

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      fontFamily: 'Poppins, sans-serif',
    }}>
      {!isMobile && (
        <ListSelector
          selectedList={selectedList}
          onSelectList={setSelectedList}
          lists={lists}
          counts={counts}
        />
      )}

      <div style={{
        flex: 1,
        padding: '1rem',
        maxWidth: isMobile ? '100%' : '800px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'visible',
      }}>
        {isMobile && (
          <ListSelector
            selectedList={selectedList}
            onSelectList={setSelectedList}
            lists={lists}
            counts={counts}
          />
        )}

        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1rem',
        }}>
          <motion.button
            onClick={() => setShowCreateModal(true)}
            style={{
              backgroundColor: '#528F75',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontFamily: 'Poppins, sans-serif',
              flex: 1,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiPlus />
            Create New Task
          </motion.button>

          {selectedList !== 'Completed' && selectedList !== 'Removed' && (
            <motion.button
              onClick={handleReorderWithAI}
              style={{
                backgroundColor: '#528F75',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontFamily: 'Poppins, sans-serif',
                flex: 1,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiRefreshCw />
              Reorder with AI
            </motion.button>
          )}
        </div>

        <div style={{
          flex: 1,
          overflow: 'auto',
        }}>
          {selectedList === 'Completed' || selectedList === 'Removed' ? (
            <div style={{ padding: '0.5rem' }}>
              {todos.map((todo) => (
                <div key={todo.id}>
                  {renderTodoCard(todo, selectedList)}
                </div>
              ))}
            </div>
          ) : (
            <Reorder.Group
              axis="y"
              values={todos}
              onReorder={setTodos}
              style={{
                padding: '0.5rem',
                listStyle: 'none',
                margin: 0,
              }}
            >
              {todos.map((todo) => {
                return (
                  <TodoCard
      todo={todo}
      onComplete={handleComplete}
      onDelete={handleDelete}
      onRestore={() => {}}
      onPriorityChange={handlePriorityChange}
      isDragging={false}
      onSelect={() => setSelectedTodo(todo)}
                    dragControls={dragControls}
                    key={todo.id}
                  />
                );
              })}
            </Reorder.Group>
          )}
        </div>

        <AnimatePresence>
          {selectedTodo && (
            <TaskDetailModal
              task={selectedTodo}
              onClose={() => setSelectedTodo(null)}
              onComplete={handleComplete}
              onDelete={handleDelete}
              onPriorityChange={handlePriorityChange}
            />
          )}

          {showToast && (
            <Toast
              message={`Task ${lastAction === 'delete' ? 'deleted' : 'completed'}`}
              onUndo={()=>{}}
              onClose={() => setShowToast(false)}
              action={lastAction}
            />
          )}

          {showCreateModal && (
            <CreateTaskModal
              onClose={() => setShowCreateModal(false)}
              onSave={handleTaskCreated}
              sources={lists}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default TodoPage; 