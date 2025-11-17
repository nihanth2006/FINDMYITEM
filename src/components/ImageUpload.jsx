import { useState } from "react";

export default function ImageUpload({ onUpload }) {
  const [preview, setPreview] = useState(null);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreview(url);
    onUpload(url);
  }

  return (
    <div>
      <div className="w-64 h-64 bg-gray-300 flex justify-center items-center text-6xl">
        {preview ? <img src={preview} className="w-full h-full" /> : "+"}
      </div>
      <input type="file" onChange={handleFile} className="mt-3" />
    </div>
  );
}
