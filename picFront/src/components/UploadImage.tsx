import { useState, useEffect } from "react";
import axios from "axios";

function UploadImage() {
  const [image, setImage] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);

  const handleUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    await axios.post("http://localhost:2007/upload", formData);

    fetchImages(); // refresh gallery
  };

  const fetchImages = async () => {
    const res = await axios.get("http://localhost:2007/images");
    setImages(res.data);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div>
      <input
        type="file"
        onChange={(e) =>
          setImage(e.target.files?.[0] || null)
        }
      />

      <button onClick={handleUpload}>Upload</button>

      {/* Gallery */}
      <div>
        {images.map((url, i) => (
          <img key={i} src={url} width="200" />
        ))}
      </div>
    </div>
  );
}

export default UploadImage;