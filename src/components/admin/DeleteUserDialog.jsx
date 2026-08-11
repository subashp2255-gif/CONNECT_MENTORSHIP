import { useState } from 'react';
import { X, Trash2, AlertOctagon } from 'lucide-react';
import Button from '../ui/Button';

export default function DeleteUserDialog({ isOpen, userId, onConfirm, onClose }) {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onConfirm(userId, reason.trim());
    setReason('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-surface border border-border rounded-3xl p-6 w-full max-w-md shadow-2xl relative animate-scaleUp">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-2">
            <Trash2 className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold text-white">Delete User Account</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/5 text-text-muted hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Statement */}
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-xs text-red-400 flex items-start gap-2.5 mb-6">
          <AlertOctagon className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Permanent Soft Delete Warning</p>
            <p className="mt-1 leading-relaxed">
              This action will soft-delete the user's account and instantly cancel all upcoming meetings. This action cannot be easily undone.
            </p>
          </div>
        </div>

        {/* Form Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">
              Reason for deletion
            </label>
            <textarea
              placeholder="Explain why this account is being deleted (e.g. Fake profile/harmful account)..."
              required
              rows={3}
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full rounded-xl border border-border bg-panel text-white placeholder-text-dim focus:border-red-500 focus:ring-1 focus:ring-red-500 py-3 px-4 text-xs focus:outline-none transition-colors"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex gap-4 pt-4 border-t border-border/60">
            <Button
              variant="ghost"
              fullWidth
              type="button"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              fullWidth
              type="submit"
            >
              Confirm Delete
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
}
