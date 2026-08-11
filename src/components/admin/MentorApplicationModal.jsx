import { useState } from 'react';
import { X, FileText, CheckCircle2, AlertOctagon, Link2, Eye } from 'lucide-react';
import Button from '../ui/Button';

export default function MentorApplicationModal({ application, onClose, onApprove, onReject }) {
  const [rejecting, setRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  if (!application) return null;

  const handleRejectSubmit = (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) return;
    onReject(application.id, rejectReason.trim());
    setRejecting(false);
    setRejectReason('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-surface border border-border rounded-3xl p-6 w-full max-w-2xl shadow-2xl my-8 relative flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-white">Mentor Application Review</h2>
            <p className="text-xs text-text-dim mt-0.5">Submitted by {application.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scroll Content */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
          
          {/* Card profile */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-panel border border-border/40 p-4 rounded-2xl">
            <img 
              src={application.avatar} 
              alt={application.name} 
              className="w-16 h-16 rounded-xl object-cover border border-border" 
            />
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg font-bold text-white">{application.name}</h3>
              <p className="text-xs text-text-muted">{application.email}</p>
              <p className="text-xs text-primary-light font-medium mt-1">
                {application.jobRole} at {application.company}
              </p>
            </div>
          </div>

          {/* Bio & Journey */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider text-text-dim">Applicant Bio</h4>
            <p className="text-xs text-text-muted leading-relaxed bg-panel border border-border/20 p-4 rounded-xl whitespace-pre-wrap">
              {application.bio || 'No bio submitted.'}
            </p>
          </div>

          {/* Academic Profile */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-panel border border-border/30 rounded-xl p-4 text-xs">
              <p className="text-text-dim font-bold uppercase tracking-wider text-[10px]">Education</p>
              <p className="text-white font-semibold mt-1.5">{application.college}</p>
              <p className="text-text-muted mt-0.5">{application.branch} | {application.year}</p>
            </div>
            <div className="bg-panel border border-border/30 rounded-xl p-4 text-xs">
              <p className="text-text-dim font-bold uppercase tracking-wider text-[10px]">Mentorship Focus</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {application.sessionTypes?.map(type => (
                  <span key={type} className="bg-primary/10 text-primary-light text-[10px] px-2 py-0.5 rounded border border-primary/20">
                    {type}
                  </span>
                )) || <span className="text-text-muted">General Mentoring</span>}
              </div>
            </div>
          </div>

          {/* Professional Socials */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider text-text-dim">Social Links & Portfolios</h4>
            <div className="flex flex-col gap-2">
              {application.linkedin && (
                <a 
                  href={application.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-xs text-text-muted hover:text-white bg-panel hover:bg-white/5 border border-border/40 p-3 rounded-xl transition-all"
                >
                  <Link2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>LinkedIn Profile: <span className="text-primary-light underline">{application.linkedin}</span></span>
                </a>
              )}
              {application.github && (
                <a 
                  href={application.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-xs text-text-muted hover:text-white bg-panel hover:bg-white/5 border border-border/40 p-3 rounded-xl transition-all"
                >
                  <Link2 className="w-4 h-4 text-white shrink-0" />
                  <span>GitHub Profile: <span className="text-primary-light underline">{application.github}</span></span>
                </a>
              )}
            </div>
          </div>

          {/* Verification documents */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider text-text-dim">Uploaded Verification Documents</h4>
            <div className="space-y-2">
              {application.verificationDocuments?.length > 0 ? (
                application.verificationDocuments.map(doc => (
                  <div key={doc} className="flex justify-between items-center bg-panel border border-border/30 p-3 rounded-xl text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary-light" />
                      <span className="font-medium text-white">{doc}</span>
                    </div>
                    <button
                      type="button"
                      className="text-primary-light hover:text-white transition-colors flex items-center gap-1 font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-text-muted italic">No documents uploaded.</p>
              )}
            </div>
          </div>

          {/* Rejection input area */}
          {rejecting && (
            <form onSubmit={handleRejectSubmit} className="bg-red-500/5 border border-red-500/20 p-4 rounded-2xl space-y-3 animate-scaleUp">
              <label className="block text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5" /> Require Reason for Rejection
              </label>
              <textarea
                placeholder="Enter details explaining rejection (e.g. Incomplete verification documents)..."
                required
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-border bg-panel text-white placeholder-text-dim focus:border-red-500 focus:ring-1 focus:ring-red-500 py-2.5 px-4 text-xs focus:outline-none transition-colors"
              />
              <div className="flex justify-end gap-2.5">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  type="button"
                  onClick={() => setRejecting(false)}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  variant="danger" 
                  type="submit"
                >
                  Confirm Rejection
                </Button>
              </div>
            </form>
          )}

        </div>

        {/* Modal Actions */}
        {!rejecting && (
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
              onClick={() => setRejecting(true)}
              className="flex-1 text-xs"
            >
              Reject Application
            </Button>
            <Button
              variant="primary"
              onClick={() => onApprove(application.id)}
              className="flex-1 text-xs flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Approve Mentor
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}
