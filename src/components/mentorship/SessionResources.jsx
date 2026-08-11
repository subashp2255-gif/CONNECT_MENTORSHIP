import { useState } from 'react';
import { useStore } from '../../store/useStore';
import Button from '../ui/Button';
import { Link, Plus, Trash2, Copy, ExternalLink, FileText, Youtube } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SessionResources({ sessionId }) {
  const { resources = [], addResource, deleteResource, currentUser } = useStore();
  const sessionResources = resources.filter(r => r.sessionId === sessionId);
  
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');
  
  const handleAdd = (e) => {
    e.preventDefault();
    if (!url || !label) return;
    
    addResource({
      id: Date.now().toString(),
      sessionId,
      userId: currentUser.id,
      url,
      label,
      type: url.includes('youtube') ? 'video' : url.includes('github') ? 'code' : 'link'
    });
    setUrl('');
    setLabel('');
    toast.success('Resource added');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-panel border border-border p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-white mb-4">Add Resource</h3>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4">
          <input type="text" value={label} onChange={e => setLabel(e.target.value)} placeholder="Resource Title (e.g. System Design Primer)" className="flex-1 bg-surface border border-border rounded-xl p-3 text-white focus:border-primary focus:outline-none" />
          <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." className="flex-1 bg-surface border border-border rounded-xl p-3 text-white focus:border-primary focus:outline-none" />
          <Button type="submit" className="sm:w-32"><Plus className="w-4 h-4 mr-2" /> Add</Button>
        </form>
      </div>
      
      <div className="space-y-3">
        {sessionResources.length > 0 ? sessionResources.map(res => (
          <div key={res.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface border border-border rounded-xl hover:border-primary/50 transition-colors gap-4">
            <div className="flex items-start sm:items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl shrink-0 mt-1 sm:mt-0">
                {res.type === 'video' ? <Youtube className="w-5 h-5 text-red-400" /> : <FileText className="w-5 h-5 text-primary-light" />}
              </div>
              <div className="min-w-0 flex-1">
                <a href={res.url} target="_blank" rel="noopener noreferrer" className="font-bold text-white hover:text-primary-light flex items-center gap-2 truncate">
                  <span className="truncate">{res.label}</span> <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
                <p className="text-xs text-text-muted mt-1 truncate">{res.url}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button onClick={() => { navigator.clipboard.writeText(res.url); toast.success('Link copied'); }} className="p-2 text-text-muted hover:text-white bg-panel rounded-lg transition-colors shadow-sm">
                <Copy className="w-4 h-4" />
              </button>
              {res.userId === currentUser.id && (
                <button onClick={() => { deleteResource(res.id); toast.success('Deleted'); }} className="p-2 text-red-400 hover:text-white hover:bg-red-500 bg-panel rounded-lg transition-colors shadow-sm">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )) : (
          <p className="text-text-muted text-center p-12 bg-surface border border-dashed border-border rounded-xl">No resources shared yet. Add links, videos, or documents here.</p>
        )}
      </div>
    </div>
  );
}
