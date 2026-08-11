import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import Button from '../ui/Button';

export default function DeleteGoalDialog({ isOpen, onClose, onConfirm, goalTitle }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-surface border border-border rounded-3xl p-6 w-full max-w-md shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Delete Goal</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="mb-6 space-y-2">
            <p className="text-sm text-text-muted">
              Are you sure you want to delete <strong className="text-white">"{goalTitle}"</strong>? This action is permanent and will delete all associated milestones, task history, and activities.
            </p>
            <p className="text-xs text-red-400 font-medium">
              This action cannot be undone.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3">
            <Button
              variant="ghost"
              fullWidth
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              Delete Goal
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
