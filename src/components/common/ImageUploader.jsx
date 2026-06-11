import { useState, useRef } from 'react';
import { Upload, X, Camera, Image } from 'lucide-react';
import toast from 'react-hot-toast';
import imageCompression from 'browser-image-compression';

export default function ImageUploader({ listingId, onUploadComplete }) {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);
  const cameraRef = useRef(null);

const handleSelect = async (e) => {
  const selected = Array.from(e.target.files);
  if (selected.length + files.length > 10) {
    toast.error('Maximum 10 photos');
    return;
  }

  const newFiles = [];
  const newPreviews = [];

  for (const file of selected) {
    if (!file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
      toast.error(`${file.name} — format non supporté`);
      continue;
    }

    try {
      // Compression automatique
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.5,          // Max 500KB par photo
        maxWidthOrHeight: 1280,   // Max 1280px
        useWebWorker: true,
        onProgress: (progress) => {
          console.log(`Compression ${file.name}: ${progress}%`);
        },
      });

      console.log(`${file.name}: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressed.size / 1024 / 1024).toFixed(2)}MB`);

      newFiles.push(compressed);
      newPreviews.push(URL.createObjectURL(compressed));
      toast.success(`Photo compressée ✅`);
    } catch (err) {
      console.error('Erreur compression:', err);
      // Si compression échoue, utilise l'original
      if (file.size <= 5 * 1024 * 1024) {
        newFiles.push(file);
        newPreviews.push(URL.createObjectURL(file));
      } else {
        toast.error(`${file.name} trop lourd (max 5MB)`);
      }
    }
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
      toast.error('Sélectionnez au moins une photo');
      return;
    }
    if (!listingId) {
      toast.error('Annonce non trouvée');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));

      const token = localStorage.getItem('logezy_token');
      const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiURL}/listings/${listingId}/images`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error('Erreur upload');
      const data = await res.json();
      toast.success(`${files.length} photo(s) uploadée(s) ! 🎉`);
      setFiles([]);
      setPreviews([]);
      onUploadComplete && onUploadComplete(data.images);
    } catch (e) {
      toast.error('Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">

      {/* Boutons de sélection — optimisés mobile */}
      <div className="grid grid-cols-2 gap-3">

        {/* Galerie photos */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 p-5 border-2 border-dashed border-[#E2E8F0] dark:border-[#2A2A2A] rounded-xl hover:border-[#3A7D44] hover:bg-[#EBF5ED] dark:hover:bg-[#2A2A2A] transition-all active:scale-95"
        >
          <Image size={28} className="text-[#3A7D44]" />
          <span className="text-sm font-medium text-[#334155] dark:text-[#94A3B8]">
            Galerie
          </span>
          <span className="text-xs text-[#94A3B8]">
            Choisir des photos
          </span>
        </button>

        {/* Appareil photo */}
        <button
          type="button"
          onClick={() => cameraRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 p-5 border-2 border-dashed border-[#E2E8F0] dark:border-[#2A2A2A] rounded-xl hover:border-[#3A7D44] hover:bg-[#EBF5ED] dark:hover:bg-[#2A2A2A] transition-all active:scale-95"
        >
          <Camera size={28} className="text-[#3A7D44]" />
          <span className="text-sm font-medium text-[#334155] dark:text-[#94A3B8]">
            Appareil photo
          </span>
          <span className="text-xs text-[#94A3B8]">
            Prendre une photo
          </span>
        </button>
      </div>

      {/* Inputs cachés */}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleSelect}
        className="hidden"
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleSelect}
        className="hidden"
      />

      {/* Info */}
      <p className="text-xs text-center text-[#94A3B8]">
        JPG, PNG, WEBP · Max 5MB par photo · 10 photos maximum
      </p>

      {/* Aperçus */}
      {previews.length > 0 && (
        <div>
          <p className="text-xs font-medium text-[#334155] dark:text-[#94A3B8] mb-2">
            {previews.length} photo(s) sélectionnée(s)
            {previews.length > 0 && <span className="text-[#3A7D44]"> — La 1ère sera la photo de couverture</span>}
          </p>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {previews.map((preview, i) => (
              <div key={i} className="relative group aspect-square">
                <img
                  src={preview}
                  alt={`Photo ${i + 1}`}
                  className="w-full h-full object-cover rounded-xl border-2 border-[#E2E8F0] dark:border-[#2A2A2A]"
                />
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 bg-[#3A7D44] text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                    Cover
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 md:opacity-0 transition-opacity active:opacity-100"
                >
                  <X size={12} />
                </button>
                {/* Bouton supprimer visible sur mobile */}
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute top-1 right-1 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center md:hidden"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bouton upload */}
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
              Uploader {files.length} photo(s)
            </>
          )}
        </button>
      )}
    </div>
  );
}