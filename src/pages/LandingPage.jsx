import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FaTree, FaLeaf  } from "react-icons/fa";
import { FiBarChart2, FiClock } from 'react-icons/fi';
import { BsArrowUp } from 'react-icons/bs';
import { useState, useEffect } from 'react';


export default function LandingPage() {
  const { signIn } = useAuth();
  const [showArrow, setShowArrow] = useState(true);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowArrow(false);
      } else {
        setShowArrow(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{
        minHeight: '100vh',
        backgroundColor: '#F5F5F5',
        color: '#333',
        fontFamily: 'Poppins, sans-serif',
        position: 'relative'
      }}
    >
      <AnimatePresence>
        {showArrow && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: '5rem', // Position just below navbar
              right: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transform: 'rotate(-15deg)',
              transformOrigin: 'center',
              zIndex: 10
            }}
          >
            <motion.div
              animate={{
                y: [0, -5, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <BsArrowUp size={24} color="#528F75" />
            </motion.div>
            <div
              style={{
                backgroundColor: '#528F75',
                color: 'white',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                fontFamily: 'Poppins, sans-serif',
                maxWidth: '200px'
              }}
            >
              These tools will let you move faster!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '4rem 1rem'
      }}>
        <motion.div variants={itemVariants} style={{ textAlign: 'center' }}>
          <FaTree size={128} style={{ marginBottom: '1.5rem', color: '#528F75' }} />
          <motion.h1
            variants={itemVariants}
            style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              color: '#528F75'
            }}
          >
            Empower Your Management
          </motion.h1>
          <motion.p
            variants={itemVariants}
            style={{
              fontSize: '1.25rem',
              marginBottom: '1rem',
              color: '#666',
              maxWidth: '800px',
              margin: '0 auto 1rem'
            }}
          >
            Boost productivity and efficiency while reducing your carbon footprint through intelligent automation.
          </motion.p>
          <motion.p
            variants={itemVariants}
            style={{
              fontSize: '1.1rem',
              marginBottom: '2rem',
              color: '#666',
              maxWidth: '800px',
              margin: '0 auto 2rem'
            }}
          >
            Our smart solutions help reduce energy consumption by up to 30% while streamlining your management workflow.
          </motion.p>
          
          <motion.div
            variants={itemVariants}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '4rem'
            }}
          >
            <motion.button
              onClick={() => signIn()}
              whileHover={{ scale: 1.05, backgroundColor: '#447a63' }}
              whileTap={{ scale: 0.95 }}
              style={{
                backgroundColor: '#528F75',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: 'pointer',
                border: 'none',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              Start Optimizing Today
            </motion.button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem',
              marginTop: '4rem'
            }}
          >
            {[
              {
                title: "Efficient Management",
                description: "Save up to 10 hours per week with automated task distribution and tracking.",
                icon: <FiClock size={24} />
              },
              {
                title: "Sustainable Operations", 
                description: "Reduce your carbon footprint through smart resource management and automation.",
                icon: <FaLeaf size={24} />
              },
              {
                title: "Real-time Insights",
                description: "Make data-driven decisions with comprehensive analytics and monitoring.",
                icon: <FiBarChart2 size={24} />
              }
            ].map((card, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                style={{
                  padding: '1.5rem',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ color: '#528F75', marginRight: '0.75rem' }}>
                    {card.icon}
                  </div>
                  <motion.h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: '#528F75',
                      margin: 0
                    }}
                  >
                    {card.title}
                  </motion.h3>
                </div>
                <motion.p style={{ color: '#666' }}>
                  {card.description}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}