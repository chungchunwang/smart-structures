import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
    

export function useSensorData() {
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'mqtt_values'));
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(q);
        const sensors = [];
        
        await Promise.all(querySnapshot.docs.map(async (doc) => {
          // Process messages to get the last 24 hours of data
          const messagesSnapshot = await getDocs(collection(doc.ref, 'messages'));
          const last24Hours = messagesSnapshot.docs.map(doc => doc.data())
            .map(msg => ({
              time: new Date(msg.timestamp).toLocaleTimeString(),
              value: parseFloat(msg.value),
              timestamp: msg.timestamp
            }))
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
          console.log(last24Hours);

          // Determine sensor type from topic
          let type = 'unknown';
          if (messagesSnapshot.docs[0]?.data().topic.includes('temperature')) type = 'temperature';
          else if (messagesSnapshot.docs[0]?.data().topic.includes('humidity')) type = 'humidity';
          else if (messagesSnapshot.docs[0]?.data().topic.includes('airflow')) type = 'airflow';
          else if (messagesSnapshot.docs[0]?.data().topic.includes('power')) type = 'power';
          console.log(type);

          sensors.push({
            id: doc.id,
            name: `${type.charAt(0).toUpperCase() + type.slice(1)} Sensor ${sensors.length + 1}`,
            type,
            topic: messagesSnapshot.docs[0]?.data()?.topic || '',
            data: last24Hours
          });
        }));
        console.log(sensors);
        setSensorData(sensors);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { sensorData, loading };
} 