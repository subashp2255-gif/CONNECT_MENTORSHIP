import { Navigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';

export default function AdminProtectedRoute({ children }) {
  const { isLoggedIn, role, currentUser } = useStore();

  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  if (role !== 'admin' || currentUser?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-surface border border-border rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-500 font-extrabold text-2xl">!</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-text-muted mb-6">
            This account does not have administrator privileges to view this section.
          </p>
        </div>
      </div>
    );
  }

  return children;
}
