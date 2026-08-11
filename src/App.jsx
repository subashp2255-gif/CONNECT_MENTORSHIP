import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useStore } from './store/useStore';

// Use HashRouter in Electron (file:// protocol doesn't support history API)
const isElectron = typeof window !== 'undefined' && 
  (window.__ELECTRON__ || navigator.userAgent.toLowerCase().includes(' electron/'));
const Router = isElectron ? HashRouter : BrowserRouter;
import { AnimatePresence, motion } from 'framer-motion';

// Layout
import Layout from './components/layout/Layout';
import RouteSkeleton from './components/ui/RouteSkeleton';

// Pages
const Landing = lazy(() => import('./pages/Landing'));
const MentorsBrowse = lazy(() => import('./pages/MentorsBrowse'));
const MentorProfile = lazy(() => import('./pages/MentorProfile'));
const MenteeDashboard = lazy(() => import('./pages/MenteeDashboard'));
const MentorDashboard = lazy(() => import('./pages/MentorDashboard'));
const Messages = lazy(() => import('./pages/Messages'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const SessionFeedback = lazy(() => import('./pages/SessionFeedback'));
const OnboardingWizard = lazy(() => import('./pages/OnboardingWizard'));
const NotesLibrary = lazy(() => import('./pages/Notes/NotesLibrary'));
const SessionNotes = lazy(() => import('./pages/Notes/SessionNotes'));
const SessionSummary = lazy(() => import('./pages/Notes/SessionSummary'));
const SessionRoom = lazy(() => import('./pages/SessionRoom/SessionRoom'));
const Recordings = lazy(() => import('./pages/SessionRoom/Recordings'));
const GoalDetailsPage = lazy(() => import('./pages/GoalDetailsPage'));

const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';

// Forum Pages
const ForumPage = lazy(() => import('./pages/Forum/ForumPage'));
const CreatePostPage = lazy(() => import('./pages/Forum/CreatePostPage'));
const PostDetailsPage = lazy(() => import('./pages/Forum/PostDetailsPage'));

// Social Follow & Feed Pages
const FollowingMentorsPage = lazy(() => import('./pages/FollowingMentorsPage'));
const FeedPage = lazy(() => import('./pages/Feed/FeedPage'));

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
        <Suspense fallback={<RouteSkeleton />}>
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
              <Route path="/onboarding" element={<OnboardingWizard />} />
              <Route path="/session/:id/feedback" element={<SessionFeedback />} />
              <Route path="/session/:id/notes" element={<SessionNotes />} />
              <Route path="/session/:id/summary" element={<SessionSummary />} />
              <Route path="/notes" element={<NotesLibrary />} />
              <Route path="/recordings" element={<Recordings />} />
              <Route path="/goals/:id" element={<GoalDetailsPage />} />
              
              {/* Forum Routes */}
              <Route path="/forum" element={<ForumPage />} />
              <Route path="/forum/create" element={<CreatePostPage />} />
              <Route path="/forum/post/:postId" element={<PostDetailsPage />} />
              <Route path="/forum/category/:category" element={<ForumPage />} />
              <Route path="/forum/tag/:tag" element={<ForumPage />} />
              <Route path="/forum/saved" element={<ForumPage defaultFilter="saved" />} />
              <Route path="/forum/my-posts" element={<ForumPage defaultFilter="my-posts" />} />
              <Route path="/forum/unanswered" element={<ForumPage defaultFilter="unanswered" />} />

              {/* Social Follow & Feed Routes */}
              <Route path="/feed" element={<FeedPage />} />
              <Route path="/following-mentors" element={<FollowingMentorsPage />} />
            </Route>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            } />
            <Route path="/session/:sessionId/room" element={<SessionRoom />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const { login, logout } = useStore();

  useEffect(() => {
    // Session management logic removed
  }, []);

  return (
    <Router basename={isElectron ? undefined : import.meta.env.BASE_URL}>
      <AnimatedRoutes />
    </Router>
  );
}
