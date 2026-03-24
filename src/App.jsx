import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Layout
import Layout from './components/layout/Layout';

// Pages
import Landing from './pages/Landing';
import MentorsBrowse from './pages/MentorsBrowse';
import MentorProfile from './pages/MentorProfile';
import MenteeDashboard from './pages/MenteeDashboard';
import MentorDashboard from './pages/MentorDashboard';
import Messages from './pages/Messages';
import Login from './pages/Login';
import Register from './pages/Register';
import SessionFeedback from './pages/SessionFeedback';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex-1 flex flex-col w-full"
      >
        <Routes location={location} key={location.pathname}>
          <Route element={<Layout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/mentors" element={<MentorsBrowse />} />
            <Route path="/mentors/:id" element={<MentorProfile />} />
            <Route path="/dashboard" element={<MenteeDashboard />} />
            <Route path="/mentor/dashboard" element={<MentorDashboard />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/session/:id/feedback" element={<SessionFeedback />} />
          </Route>
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <AnimatedRoutes />
    </Router>
  );
}
