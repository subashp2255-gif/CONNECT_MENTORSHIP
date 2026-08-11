import { useState } from 'react';
import { X, ShieldAlert, Eye, AlertOctagon, CheckSquare, RefreshCcw } from 'lucide-react';
import Button from '../ui/Button';

export default function ReportDetailsModal({ report, users, onClose, onResolve, onDismiss }) {
  const [resolutionNote, setResolutionNote] = useState('');
  const [resolving, setResolving] = useState(false);

  if (!report) return null;

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.name} (${user.role})` : userId;
  };

  const handleResolveSubmit = (e) => {
    e.preventDefault();
    if (!resolutionNote.trim()) return;
    onResolve(report.id, resolutionNote.trim());
    setResolving(false);
    setResolutionNote('');
  };

  const handleDismissSubmit = () => {
    onDismiss(report.id, 'No platform violation detected.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-surface border border-border rounded-3xl p-6 w-full max-w-xl shadow-2xl my-8 relative flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-400" /> Inspect Report details
            </h2>
            <p className="text-xs text-text-dim mt-0.5">Report ID: {report.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scroll Content */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-2 custom-scrollbar">
          
          {/* Reporter & Accused */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-panel border border-border/30 rounded-xl p-4 text-xs">
              <p className="text-text-dim font-bold uppercase tracking-wider text-[10px]">Reporter User</p>
              <p className="text-white font-semibold mt-1">{getUserName(report.reporterId)}</p>
              <p className="text-text-muted mt-0.5">ID: {report.reporterId}</p>
            </div>
            <div className="bg-panel border border-border/30 rounded-xl p-4 text-xs">
              <p className="text-text-dim font-bold uppercase tracking-wider text-[10px]">Accused / Reported User</p>
              <p className="text-white font-semibold mt-1">{getUserName(report.reportedUserId)}</p>
              <p className="text-text-muted mt-0.5">ID: {report.reportedUserId}</p>
            </div>
          </div>

          {/* Reason & details */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-text-dim uppercase tracking-wider">Reported Violation Reason</p>
            <div className="bg-panel border border-border/40 p-4 rounded-xl">
              <p className="text-sm font-bold text-white mb-2">{report.reason}</p>
              <p className="text-xs text-text-muted leading-relaxed whitespace-pre-wrap">{report.description}</p>
            </div>
          </div>

          {/* Evidence Attachments */}
          {report.evidenceUrl && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-text-dim uppercase tracking-wider">Submitted Evidence Link</p>
              <div className="p-3 bg-panel border border-border/40 rounded-xl flex items-center justify-between text-xs">
                <span className="text-white font-medium truncate max-w-[250px]">{report.evidenceUrl}</span>
                <a 
                  href={report.evidenceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-light hover:text-white font-semibold transition-colors flex items-center gap-1 shrink-0"
                >
                  <Eye className="w-3.5 h-3.5" /> View Evidence
                </a>
              </div>
            </div>
          )}

          {/* Resolution notes display if resolved */}
          {report.status === 'Resolved' && (
            <div className="bg-green-500/5 border border-green-500/20 p-4 rounded-xl text-xs space-y-1.5">
              <p className="font-bold text-green-400 uppercase tracking-wider text-[10px]">Report Resolution Notes</p>
              <p className="text-text-muted leading-relaxed">{report.resolutionNote || 'Resolved by administrator.'}</p>
            </div>
          )}

          {/* Resolution notes display if dismissed */}
          {report.status === 'Dismissed' && (
            <div className="bg-gray-500/5 border border-gray-500/20 p-4 rounded-xl text-xs space-y-1.5">
              <p className="font-bold text-text-dim uppercase tracking-wider text-[10px]">Report Dismissal Reason</p>
              <p className="text-text-muted leading-relaxed">{report.resolutionNote || 'Dismissed by administrator.'}</p>
            </div>
          )}

          {/* Inline Form if resolving */}
          {resolving && (
            <form onSubmit={handleResolveSubmit} className="bg-primary/5 border border-primary/20 p-4 rounded-2xl space-y-3 animate-scaleUp">
              <label className="block text-xs font-bold text-primary-light uppercase tracking-wider">
                Explain Resolution Decision
              </label>
              <textarea
                placeholder="Enter details explaining how the report was resolved (e.g. Warned the user, fixed comment details)..."
                required
                value={resolutionNote}
                onChange={e => setResolutionNote(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-border bg-panel text-white placeholder-text-dim focus:border-primary focus:ring-1 focus:ring-primary py-2.5 px-4 text-xs focus:outline-none transition-colors"
              />
              <div className="flex justify-end gap-2.5">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  type="button"
                  onClick={() => setResolving(false)}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  variant="primary" 
                  type="submit"
                >
                  Confirm Resolution
                </Button>
              </div>
            </form>
          )}

        </div>

        {/* Action buttons */}
        {!resolving && report.status !== 'Resolved' && report.status !== 'Dismissed' && (
          <div className="flex flex-wrap gap-4 pt-6 border-t border-border mt-6 shrink-0">
            <Button
              variant="ghost"
              onClick={onClose}
              className="flex-1 text-xs"
            >
              Close
            </Button>
            <Button
              variant="danger"
              onClick={handleDismissSubmit}
              className="flex-1 text-xs"
            >
              Dismiss Report
            </Button>
            <Button
              variant="primary"
              onClick={() => setResolving(true)}
              className="flex-1 text-xs flex items-center justify-center gap-1.5"
            >
              <CheckSquare className="w-4 h-4" /> Resolve Report
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}
