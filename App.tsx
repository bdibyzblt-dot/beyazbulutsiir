
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
import UserManager from './pages/admin/UserManager';
import SeoManager from './pages/admin/SeoManager';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/poem/:id" element={<PoemDetailPage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/categories" element={<CategoryManager />} />
          <Route path="/admin/ai" element={<AIPoemGenerator />} />
          <Route path="/admin/new" element={<PoemEditor />} />
          <Route path="/admin/edit/:id" element={<PoemEditor />} />
          <Route path="/admin/settings" element={<SettingsManager />} />
          <Route path="/admin/seo" element={<SeoManager />} />
          <Route path="/admin/profile" element={<ChangePassword />} />
          <Route path="/admin/password" element={<ChangePassword />} /> 
          <Route path="/admin/users" element={<UserManager />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
