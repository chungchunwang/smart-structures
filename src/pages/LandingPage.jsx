import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Assuming you have this

export default function LandingPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F5F5F5',
      color: '#333'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '4rem 1rem'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center' }}
        >
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            color: '#528F75'
          }}>
            Automate Your World
          </h1>
          <p style={{
            fontSize: '1.25rem',
            marginBottom: '2rem',
            color: '#666'
          }}>
            Connect your devices, automate your tasks, and control your environment with ease.
          </p>
          
          <motion.div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '4rem'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={() => signIn()}
              style={{
                backgroundColor: '#528F75',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: 'pointer',
                border: 'none',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#447a63'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#528F75'}
            >
              Get Started
            </button>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginTop: '4rem'
          }}>
            <motion.div
              style={{
                padding: '1.5rem',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
              }}
              whileHover={{ scale: 1.05 }}
            >
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#528F75'
              }}>Smart Automation</h3>
              <p style={{ color: '#666' }}>Create powerful automation workflows with our intuitive interface.</p>
            </motion.div>

            <motion.div
              style={{
                padding: '1.5rem',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
              }}
              whileHover={{ scale: 1.05 }}
            >
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#528F75'
              }}>Task Management</h3>
              <p style={{ color: '#666' }}>Organize and track your tasks with our advanced todo system.</p>
            </motion.div>

            <motion.div
              style={{
                padding: '1.5rem',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
              }}
              whileHover={{ scale: 1.05 }}
            >
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#528F75'
              }}>Device Control</h3>
              <p style={{ color: '#666' }}>Monitor and control your connected devices from anywhere.</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}