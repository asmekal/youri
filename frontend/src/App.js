import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Container, ThemeProvider } from '@mui/material';
import axios from 'axios';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingActionButton from './components/FloatingActionButton';
import { componentRegistry } from './core/ComponentRegistry';
import theme from './theme'; // Import the theme

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

    window.addEventListener('componentAdded', handleComponentAdded);
    return () => window.removeEventListener('componentAdded', handleComponentAdded);
  }, []);

  const handleEditComponent = (componentId) => {
    setCurrentComponentId(componentId);
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
          </Routes>
        </Container>
        <Footer />
        <FloatingActionButton editingComponentId={currentComponentId} />
      </Router>
    </ThemeProvider>
  );
}

export default App;
