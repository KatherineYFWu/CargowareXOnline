import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MPCILayout from './layout/MPCILayout';
import Dashboard from './pages/Dashboard';
import Draft from './pages/Draft';
import NewFiling from './pages/NewFiling';
import Sent from './pages/Sent';

const MPCI: React.FC = () => {
  return (
    <MPCILayout>
      <Routes>
        <Route path="/" element={<Navigate to="/mpci/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/drafts" element={<Draft />} />
        <Route path="/new-filing" element={<NewFiling />} />
        <Route path="/sent" element={<Sent />} />
      </Routes>
    </MPCILayout>
  );
};

export default MPCI;