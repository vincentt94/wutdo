import { useState, useEffect } from "react";

interface JournalCardProps {
  _id?: string;
  title: string;
  note: string;
  imageUrls?: string[];
  username?: string;
}

export default function JournalCard({ title, note, imageUrls = [], username }: JournalCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [showFullImage, setShowFullImage] = useState<string | null>(null);

  const handleModalClose = () => setShowModal(false);
  const handleOverlayClick = () => setShowFullImage(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowModal(false);
        setShowFullImage(null);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <div className="journal-card fixed-note-card" onClick={() => setShowModal(true)} style={{ cursor: "pointer" }}>
        {imageUrls?.[0] && (
          <img
            src={imageUrls[0].replace("/upload/", "/upload/w_400,h_300,c_fill/")}
            alt="Preview"
            className="journal-image"
            style={{ marginBottom: "10px", borderRadius: "6px", maxWidth: "100%" }}
          />
        )}
        <div className="journal-content">
          <h2 className="journal-title">{title}</h2>
          {username && <p className="journal-author">By: {username}</p>}
          <p className="journal-text">
            {note.length > 150 ? `${note.slice(0, 150)}...` : note}
          </p>
        </div>
      </div>

      {/* Expanded Note Modal */}
      {showModal && (
        <div className="note-modal-overlay" onClick={handleModalClose}>
          <div className="note-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleModalClose}
              className="note-modal-close-button"
              aria-label="Close Modal"
            >
              &times;
            </button>

            <h2 className="modal-note-title">{title}</h2>
            <p className="modal-note-text">{note}</p>

            <div className="modal-images-wrapper">
              {imageUrls.map((url, index) => {
                const resized = url.replace("/upload/", "/upload/w_400,h_300,c_fill/");
                return (
                  <img
                    key={index}
                    src={resized}
                    alt={`Note ${index}`}
                    className="modal-thumbnail"
                    onClick={() => setShowFullImage(url)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Full Image Modal */}
      {showFullImage && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
