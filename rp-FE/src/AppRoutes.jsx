// AppRoutes.jsx
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import ReportForm from './pages/ReportForm';
import EditForm from './pages/EditForm';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ListPage from './pages/ListPage';
import Detail from './pages/Detail';
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
  console.log('DEBUG: AppRoutes component rendered');
  
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
        <Route path="edit-lost/:id" element={<EditForm />} />
        <Route path="edit-found/:id" element={<EditForm />} />
        <Route path="dashboard" element={<Dashboard />} />
        {/* IMPORTANT: This should match /lost and /found */}
        <Route path="lost" element={<ListPage />} />
        <Route path="found" element={<ListPage />} />
        <Route path="detail/:id" element={<Detail />} />
      </Route>

      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;