import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { FiThermometer, FiDroplet, FiWind, FiZap, FiChevronDown, FiCheckCircle, FiAlertCircle, FiClock, FiCalendar, FiLoader } from 'react-icons/fi';
import useIsMobile from '../hooks/useIsMobile';
import { useSensorData } from '../hooks/useSensorData';
import React from 'react';
const getUnitByType = (type) => {
  switch (type) {
    case 'temperature': return '°C';
    case 'humidity': return '%';
    case 'airflow': return 'm³/h';
    case 'power': return 'W';
    default: return '';
  }
};

const getColorByType = (type) => {
  switch (type) {
    case 'temperature': return '#ef4444';
    case 'humidity': return '#3b82f6';
    case 'airflow': return '#10b981';
    case 'power': return '#f59e0b';
    default: return '#666666';
  }
};

const getIconByType = (type) => {
  switch (type) {
    case 'temperature': return FiThermometer;
    case 'humidity': return FiDroplet;
    case 'airflow': return FiWind;
    case 'power': return FiZap;
    default: return FiLoader;
  }
};

function DashboardPage() {
  const { sensorData, loading: sensorLoading } = useSensorData();
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isMobile = useIsMobile();
  const [taskStats, setTaskStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch task statistics
  useEffect(() => {
    const fetchTaskStats = async () => {
      try {
        const response = await fetch('https://novel-gibbon-related.ngrok-free.app/taskstats');
        if (!response.ok) throw new Error('Failed to fetch task stats');
        const data = await response.json();
        setTaskStats(data);
      } catch (error) {
        console.error('Error fetching task stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchTaskStats();
  }, []);

  // Set initial selected device once data is loaded
  useEffect(() => {
    if (sensorData.length > 0 && !selectedDevice) {
      setSelectedDevice(sensorData[0]);
    }
  }, [sensorData, selectedDevice]);

  // Updated stats data using real data
  const stats = [
    {
      title: "Due Today",
      value: taskStats?.Due_Today || "0",
      icon: FiClock,
      color: "#3b82f6",
      bgColor: "#dbeafe"
    },
    {
      title: "High Priority",
      value: taskStats?.High || "0",
      icon: FiAlertCircle,
      color: "#ef4444",
      bgColor: "#fee2e2"
    },
    {
      title: "Completed",
      value: taskStats?.Completed || "0",
      icon: FiCheckCircle,
      color: "#10b981",
      bgColor: "#d1fae5"
    },
    {
      title: "This Week",
      value: taskStats?.Due_This_Week || "0",
      icon: FiCalendar,
      color: "#8b5cf6",
      bgColor: "#ede9fe"
    },
  ];

  if (sensorLoading || statsLoading || !selectedDevice) {
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
          <FiLoader size={24} />
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{
      height: '100%',
      padding: '1rem',
      fontFamily: 'Poppins, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      overflow: 'auto',
    }}>
      {/* Stats Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
        gap: '1rem',
        marginBottom: '1rem',
      }}>
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              padding: '1rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#666',
              fontSize: '0.9rem',
            }}>
              <div style={{
                backgroundColor: stat.bgColor,
                color: stat.color,
                padding: '0.5rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <stat.icon size={20} />
              </div>
              {stat.title}
            </div>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#334155',
            }}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sensors Section */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '1rem',
        flex: 1,
        minHeight: 0,
      }}>
        {/* Device Selector */}
        <div style={{
          width: isMobile ? '100%' : '250px',
          backgroundColor: '#fff',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          {isMobile ? (
            <>
              <motion.button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  backgroundColor: '#528F75',
                  color: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.9rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {React.createElement(getIconByType(selectedDevice.type), { size: 20 })}
                  <span>{selectedDevice.name}</span>
                </div>
                <FiChevronDown 
                  style={{
                    transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                  }}
                />
              </motion.button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '1rem',
                      right: '1rem',
                      backgroundColor: '#fff',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      zIndex: 10,
                      marginTop: '0.5rem',
                    }}
                  >
                    {sensorData.map(device => (
                      <motion.button
                        key={device.id}
                        onClick={() => {
                          setSelectedDevice(device);
                          setIsDropdownOpen(false);
                        }}
                        whileHover={{ backgroundColor: '#f8fafc' }}
                        style={{
                          width: '100%',
                          padding: '1rem',
                          backgroundColor: selectedDevice.id === device.id ? '#f1f5f9' : '#fff',
                          color: '#334155',
                          border: 'none',
                          borderBottom: '1px solid #e2e8f0',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.9rem',
                        }}
                      >
                        {React.createElement(getIconByType(device.type), { size: 20 })}
                        <span>{device.name}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <>
              <h2 style={{ 
                fontSize: '1.25rem', 
                marginBottom: '1rem',
                color: '#334155'
              }}>
                Devices
              </h2>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}>
                {sensorData.map(device => (
                  <motion.button
                    key={device.id}
                    onClick={() => setSelectedDevice(device)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      padding: '1rem',
                      backgroundColor: selectedDevice.id === device.id ? '#528F75' : '#fff',
                      color: selectedDevice.id === device.id ? '#fff' : '#334155',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      width: '100%',
                      fontSize: '0.9rem',
                    }}
                  >
                    {React.createElement(getIconByType(device.type), { size: 20 })}
                    <span>{device.name}</span>
                  </motion.button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Graph Section */}
        <div style={{
          flex: 1,
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: isMobile ? '400px' : 0,
        }}>
          <h2 style={{ 
            fontSize: '1.25rem', 
            marginBottom: '1rem',
            color: '#334155',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {React.createElement(getIconByType(selectedDevice.type), { 
              size: 24,
              color: getColorByType(selectedDevice.type)
            })}
            {selectedDevice.name}
          </h2>

          <div style={{ flex: 1, minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={selectedDevice.data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#94a3b8"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#94a3b8"
                  tick={{ fontSize: 12 }}
                  unit={getUnitByType(selectedDevice.type)}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={getColorByType(selectedDevice.type)}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage; 