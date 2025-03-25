import { useState, useEffect } from "react";

interface JournalCardProps {
  _id?: string;
  title: string;
  note: string;
  imageUrls?: string[];
  username?: string;
}




export default function JournalCard({ title, note, imageUrls = [], username }: JournalCardProps) {
  const [showFullImage, setShowFullImage] = useState<string | null>(null);

  const handleOverlayClick = () => setShowFullImage(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowFullImage(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <div className="journal-card">
        {imageUrls?.map((url, index) => {
          const resizedUrl = url.replace("/upload/", "/upload/w_400,h_300,c_fill/");
          return (
            <img
              key={index}
              src={resizedUrl}
              alt={`Note Image ${index}`}
              className="journal-image"
              onClick={() => setShowFullImage(url)}
              style={{ cursor: "pointer", marginBottom: "10px" }}
            />
          );
        })}

        <div className="journal-content">
          <h2 className="journal-title">{title}</h2>
          {username && <p className="journal-author">By: {username}</p>}
          <p className="journal-text">{note}</p>
        </div>
      </div>

      {showFullImage && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ position: "relative" }}>
            <button
              onClick={handleOverlayClick}
              style={{
                position: "absolute",
                top: "10px",
                right: "20px",
                background: "none",
                border: "none",
                color: "white",
                fontSize: "32px",
                cursor: "pointer",
                zIndex: 1001,
              }}
              aria-label="Close Full Image"
            >
              &times;
            </button>

            <img
              src={showFullImage}
              alt="Full Size"
              className="modal-image"
              onDragStart={(e) => e.preventDefault()}
            />
          </div>
        </div>
      )}
    </>
  );
}
