import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";

import { uploadImage, imageUrl } from "../services/api";

import "./ImageUpload.css";

// value    = current image path (e.g. "/uploads/123.jpg") or ""
// onChange = called with the new path, or "" when removed
const ImageUpload = ({ value, onChange }) => {
  const inputRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    try {
      setUploading(true);
      setError("");

      const url = await uploadImage(file);
      onChange(url);
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="img-upload">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFile}
        hidden
      />

      {value ? (
        <div className="img-upload-preview">
          <img src={imageUrl(value)} alt="Preview" />

          <button
            type="button"
            className="img-upload-remove"
            onClick={() => onChange("")}
            title="Remove image"
          >
            <X size={15} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="img-upload-btn"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <Loader2 size={22} className="products-spin" />
          ) : (
            <ImagePlus size={22} />
          )}

          <span>
            {uploading ? "Uploading..." : "Click to upload image"}
          </span>

          <small>JPG, PNG or WEBP — max 5MB</small>
        </button>
      )}

      {value && (
        <button
          type="button"
          className="img-upload-change"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Change image"}
        </button>
      )}

      {error && <p className="img-upload-error">{error}</p>}
    </div>
  );
};

export default ImageUpload;
