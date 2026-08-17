import { useState, useRef } from 'react';
import { Upload, X, Video as VideoIcon, Film } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VideoUploader({ listingId, onUploadComplete }) {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleSelect = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length + files.length > 3) {
      toast.error('Maximum 3 vidéos');
      return;
    }

    const newFiles = [];
    const newPreviews = [];

    for (const file of selected) {
      if (!file.type.match(/video\/(mp4|webm|quicktime)/)) {
        toast.error(`${file.name} — format non supporté (mp4, webm, mov)`);
        continue;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast.error(`${file.name} trop lourde (max 50MB)`);
        continue;
      }
      newFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    setFiles(prev => [...prev, ...newFiles]);
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeFile = (index) => {
    URL.revokeObjectURL(previews[index]);
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Sélectionnez au moins une vidéo');
      return;
    }
    if (!listingId) {
      toast.error('Annonce non trouvée');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('videos', file));

      const token = localStorage.getItem('logezy_token');
      const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiURL}/listings/${listingId}/videos`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error('Erreur upload');
      const data = await res.json();
      toast.success(`${files.length} vidéo(s) uploadée(s) ! 🎬`);
      setFiles([]);
      setPreviews([]);
      onUploadComplete && onUploadComplete(data.videos);
    } catch (e) {
      toast.error('Erreur lors de l\'upload vidéo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full flex flex-col items-center justify-center gap-2 p-5 border-2 border-dashed border-[#E2E8F0] dark:border-[#2A2A2A] rounded-xl hover:border-[#3A7D44] hover:bg-[#EBF5ED] dark:hover:bg-[#2A2A2A] transition-all active:scale-95"
      >
        <VideoIcon size={28} className="text-[#3A7D44]" />
        <span className="text-sm font-medium text-[#334155] dark:text-[#94A3B8]">
          Ajouter des vidéos
        </span>
        <span className="text-xs text-[#94A3B8]">
          Visite guidée, ambiance du quartier...
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="video/mp4,video/webm,video/quicktime"
        onChange={handleSelect}
        className="hidden"
      />

      <p className="text-xs text-center text-[#94A3B8]">
        MP4, WEBM, MOV · Max 50MB par vidéo · 3 vidéos maximum
      </p>

      {previews.length > 0 && (
        <div>
          <p className="text-xs font-medium text-[#334155] dark:text-[#94A3B8] mb-2">
            {previews.length} vidéo(s) sélectionnée(s)
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {previews.map((preview, i) => (
              <div key={i} className="relative group aspect-video bg-black rounded-xl overflow-hidden border-2 border-[#E2E8F0] dark:border-[#2A2A2A]">
                <video src={preview} className="w-full h-full object-cover" muted />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Film size={24} className="text-white" />
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute top-1 right-1 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-base active:scale-95"
        >
          {uploading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Upload en cours...
            </>
          ) : (
            <>
              <Upload size={18} />
              Uploader {files.length} vidéo(s)
            </>
          )}
        </button>
      )}
    </div>
  );
}