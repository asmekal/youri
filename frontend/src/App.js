// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Container, ThemeProvider } from '@mui/material';
import axios from 'axios';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingActionButton from './components/FloatingActionButton';
import { componentRegistry } from './core/ComponentRegistry';
import theme from './theme'; // Import the updated theme

function App() {
  const [components, setComponents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
      setCurrentComponentId(null); // Reset editing state after addition
    };

    const handleComponentUpdated = (event) => {
      const { component_id, code } = event.detail;
      localStorage.setItem(component_id, code);
      componentRegistry.clearComponent(component_id); // Clear cache for the updated component
      setComponents((prevComponents) =>
        prevComponents.map((comp) =>
          comp.component_id === component_id ? { ...comp, code } : comp
        )
      );
    };

    window.addEventListener('componentAdded', handleComponentAdded);
    window.addEventListener('componentUpdated', handleComponentUpdated);

    return () => {
      window.removeEventListener('componentAdded', handleComponentAdded);
      window.removeEventListener('componentUpdated', handleComponentUpdated);
    };
  }, []);

  const handleEditComponent = (componentId) => {
    const event = new CustomEvent('editComponent', {
      detail: { component_id: componentId },
    });
    window.dispatchEvent(event);
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <CssBaseline />
        <Header />
        <Container sx={{ py: 5 }}>
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  components={components}
                  isLoading={isLoading}
                  onEdit={handleEditComponent}
                  columns={{ xs: 12, sm: 6, lg: 3 }}
                  spacing={4}
                />
              }
            />
            {/* Add more routes here if needed */}
          </Routes>
        </Container>
        <Footer />
        <FloatingActionButton editingComponentId={currentComponentId} />
      </Router>
    </ThemeProvider>
  );
}

export default App;
