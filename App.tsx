import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/AboutPage';
import PoemDetailPage from './pages/PoemDetailPage';
import CategoryManager from './pages/admin/CategoryManager';
import AIPoemGenerator from './pages/admin/AIPoemGenerator';
import PoemEditor from './pages/admin/PoemEditor';
import SettingsManager from './pages/admin/SettingsManager';
import CategoryPage from './pages/CategoryPage';
import ChangePassword from './pages/admin/ChangePassword';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/poem/:id" element={<PoemDetailPage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/categories" element={<CategoryManager />} />
          <Route path="/admin/ai" element={<AIPoemGenerator />} />
          <Route path="/admin/new" element={<PoemEditor />} />
          <Route path="/admin/edit/:id" element={<PoemEditor />} />
          <Route path="/admin/settings" element={<SettingsManager />} />
          <Route path="/admin/password" element={<ChangePassword />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;