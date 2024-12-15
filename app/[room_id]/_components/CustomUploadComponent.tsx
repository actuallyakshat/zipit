import { useState } from "react";

function CustomUploadComponent() {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event: any) => {
    setFiles(Array.from(event.target.files));
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
    } catch (error) {
      console.error("Upload failed:");
    }
  };

  return (
    <div style={{ backgroundColor: "rgba(255, 255, 255, 0.3)", width: "70%" }}>
      <label style={{ color: "var(--primary)" }}>
        Upload Files
        <input type="file" multiple onChange={handleFileChange} />
      </label>
      <button
        style={{
          fontWeight: "500",
          cursor: "pointer",
          backgroundColor: "var(--primary)",
        }}
        onClick={handleUpload}
      >
        Upload
      </button>
    </div>
  );
}

export default CustomUploadComponent;
