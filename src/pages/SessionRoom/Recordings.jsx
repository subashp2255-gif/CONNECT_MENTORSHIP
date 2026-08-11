import React from 'react';
import { Play, Calendar, Clock, Download, Share2 } from 'lucide-react';
import useSessionRoomStore from '../../stores/sessionRoomStore';

const Recordings = () => {
  const recordings = useSessionRoomStore(state => state.recordings);

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-brand font-bold text-white mb-2">Session Recordings</h1>
          <p className="text-[#6b6b8a]">View and manage your past session recordings.</p>
        </div>
      </div>

      {recordings.length === 0 ? (
        <div className="bg-[#16161e] border border-[#2a2a3a] rounded-xl p-12 text-center text-[#6b6b8a]">
          <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-medium text-white mb-2">No recordings yet</h3>
          <p>Your recorded sessions will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recordings.map((rec) => (
            <div key={rec.id} className="bg-[#16161e] border border-[#2a2a3a] rounded-xl overflow-hidden hover:border-[#7c3aed]/50 transition-all group">
              {/* Mock Video Thumbnail */}
              <div className="aspect-video bg-[#0a0a0f] relative group-hover:bg-[#111118] transition-colors flex items-center justify-center cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="w-16 h-16 rounded-full bg-[#7c3aed]/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#7c3aed] transition-all duration-300">
                  <Play className="w-8 h-8 text-[#7c3aed] group-hover:text-white ml-1" fill="currentColor" />
                </div>
                <div className="absolute bottom-3 right-3 text-xs bg-black/80 px-2 py-1 rounded text-white font-mono">
                  {formatDuration(rec.duration || 0)}
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="text-lg font-medium text-white mb-3">Session {rec.sessionId.split('-')[0]}...</h3>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-[#6b6b8a]">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(rec.timestamp).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-[#6b6b8a]">
                    <Clock className="w-4 h-4 mr-2" />
                    {new Date(rec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-[#2a2a3a]">
                  <button className="flex-1 flex items-center justify-center text-sm font-medium text-white bg-[#2a2a3a] hover:bg-[#323246] py-2 rounded-lg transition-colors">
                    <Download className="w-4 h-4 mr-2" /> Download
                  </button>
                  <button className="p-2 text-[#6b6b8a] hover:text-white hover:bg-[#2a2a3a] rounded-lg transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recordings;
