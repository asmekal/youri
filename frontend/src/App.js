// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Container } from '@mui/material';
import axios from 'axios';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingActionButton from './components/FloatingActionButton';
import { componentRegistry } from './core/ComponentRegistry';

function App() {
  const [components, setComponents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentComponentId, setCurrentComponentId] = useState(null);

  const fetchComponents = async () => {
    setIsLoading(true);
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
      const response = await axios.get(`${backendUrl}/list_components`);
      const fetchedComponents = response.data.components;

      // Store component code in localStorage
      fetchedComponents.forEach((comp) => {
        localStorage.setItem(comp.component_id, comp.code);
      });

      // Load all components through the registry
      const loadedComponents = await componentRegistry.loadAllComponents(fetchedComponents);
      setComponents(loadedComponents || []); // Ensure we always set an array
    } catch (error) {
      console.error('Error fetching components:', error);
      setComponents([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComponents();

    const handleComponentAdded = () => {
      fetchComponents();
    };

    window.addEventListener('componentAdded', handleComponentAdded);
    return () => window.removeEventListener('componentAdded', handleComponentAdded);
  }, []);

  const handleEditComponent = (componentId) => {
    setCurrentComponentId(componentId);
    setEditModalOpen(true);
  };

  return (
    <Router>
      <CssBaseline />
      <Header />
      <Container className="py-5">
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                components={components}
                isLoading={isLoading}
                onEdit={handleEditComponent}
                title="My Custom Dashboard"
                columns={{ xs: 12, sm: 6, lg: 3 }}
                spacing={4}
              />
            }
          />
        </Routes>
      </Container>
      <Footer />
      <FloatingActionButton />
    </Router>
  );
}

export default App;