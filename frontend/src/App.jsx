import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import History from './pages/History';
import AdminDashboard from './pages/AdminDashboard';
import ManageQuestions from './pages/ManageQuestions';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/quiz/:id" element={<QuizPage />} />
            <Route path="/result/:attemptId" element={<ResultPage />} />
            <Route path="/history" element={<History />} />
          </Route>

          <Route element={<ProtectedRoute role="admin" />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/quiz/:id/questions" element={<ManageQuestions />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </>
  );
}
