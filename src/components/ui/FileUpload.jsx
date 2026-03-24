import { useRef, useState } from 'react';
import { UploadCloud, X } from 'lucide-react';
import { cn } from '../../utils/helpers';

export default function FileUpload({ value, onChange, preview, label, accept = "image/*" }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file) => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ file, preview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block font-mono text-xs text-text-dim uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      
      {!preview ? (
        <div 
          className={cn(
            "w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-surface/50",
            isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50 hover:bg-surface"
          )}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
        >
          <UploadCloud className="w-10 h-10 text-text-muted mb-3" />
          <p className="text-sm font-medium text-white mb-1">Click or drag to upload</p>
          <p className="text-xs text-text-dim">SVG, PNG, JPG or GIF (max. 5MB)</p>
          <input 
            type="file" 
            ref={inputRef} 
            onChange={onFileChange} 
            accept={accept} 
            className="hidden" 
          />
        </div>
      ) : (
        <div className="flex items-center gap-6 p-4 bg-surface border border-border rounded-xl">
          <img src={preview} alt="Preview" className="w-20 h-20 rounded-full object-cover border-2 border-primary/20 shadow-lg" />
          <div className="flex-1">
            <p className="text-sm font-medium text-white mb-1">{value?.name || 'profile_photo.jpg'}</p>
            <p className="text-xs text-text-dim mb-3">
              {value ? (value.size / (1024 * 1024)).toFixed(2) + ' MB' : 'Uploaded successfully'}
            </p>
            <button 
              type="button" 
              onClick={() => onChange({ file: null, preview: null })}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
            >
              <X className="w-3 h-3" /> Remove image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
