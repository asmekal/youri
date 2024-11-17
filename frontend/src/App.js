import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import { CssBaseline, Container, Modal, Box, Button, Typography } from '@mui/material';
import EditComponentModal from './components/EditComponentModal';

function App() {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentComponentId, setCurrentComponentId] = useState(null);

  const handleOpenEditModal = (componentId) => {
    setCurrentComponentId(componentId);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setCurrentComponentId(null);
  };

  return (
    <Router>
      <CssBaseline />
      <Header />
      <Container style={{ paddingTop: '20px', paddingBottom: '60px' }}>
        <Routes>
          <Route path="/" element={<Dashboard onEdit={handleOpenEditModal} />} />
          {/* Add more routes here if needed */}
        </Routes>
      </Container>
      <Footer />
      {/* Edit Component Modal */}
      {currentComponentId && (
        <EditComponentModal
          open={editModalOpen}
          handleClose={handleCloseEditModal}
          componentId={currentComponentId}
        />
      )}
    </Router>
  );
}

export default App;
