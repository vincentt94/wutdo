import { useState, useEffect } from "react";

interface JournalCardProps {
  _id?: string;
  title: string;
  note: string;
  imageUrl?: string;
  username?: string;
}

export default function JournalCard({ title, note, imageUrl, username }: JournalCardProps) {
  const [showFullImage, setShowFullImage] = useState(false);

  const resizedUrl = imageUrl?.replace("/upload/", "/upload/w_400,h_300,c_fill/");

  const handleOverlayClick = () => setShowFullImage(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowFullImage(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <div className="journal-card">
        {imageUrl && (
          <img
            src={resizedUrl}
            alt={title}
            className="journal-image"
            onClick={() => setShowFullImage(true)}
            style={{ cursor: "pointer" }}
          />
        )}
        <div className="journal-content">
          <h2 className="journal-title">{title}</h2>
          {username && <p className="journal-author">By: {username}</p>}
          <p className="journal-text">{note}</p>
        </div>
      </div>

      {showFullImage && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ position: "relative" }}>
            {/* ✖ Close Button */}
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
              src={imageUrl}
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
