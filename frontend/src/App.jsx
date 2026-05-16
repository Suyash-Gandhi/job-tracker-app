import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import People from './pages/People';
import Interviews from './pages/Interviews';
import Analytics from './pages/Analytics';
import ResumeAnalyzer from './pages/ResumeAnalyzer';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/jobs" replace />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="people" element={<People />} />
        <Route path="interviews" element={<Interviews />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="resume" element={<ResumeAnalyzer />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
