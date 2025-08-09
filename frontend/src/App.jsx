// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import AuthPage from './auth/AuthPge';
import Dashboard from './dashbord/Dashbord';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/dashbord/*" element={<Dashboard />} />
    </Routes>
  );
};

export default App;

