// AppRoutes.jsx
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import ReportForm from './pages/ReportForm';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ListPage from './pages/ListPage';
import NotFound from './pages/NotFound';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route index element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="report/:type" element={<ReportForm />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="found" element={<ListPage type="found" />} />
        <Route path="lost" element={<ListPage type="lost" />} />
      </Route>

      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;