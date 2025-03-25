import { useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import JournalCard from "../components/journalcard.tsx";
import ConfirmationModal from "../components/confirmationmodal.tsx";
import { USER_NOTES } from "../utils/queries.js";
import { DELETE_NOTE } from "../utils/mutations";

interface Note {
  _id: string;
  title: string;
  note: string;
  imageUrls?: string[];
  username?: string;
}

export default function MyNotes() {
  const { data, loading, error, refetch } = useQuery(USER_NOTES, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  const [searchTerm, setSearchTerm] = useState("");

  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [deleteNote] = useMutation(DELETE_NOTE, {
    onCompleted: () => {
      refetch();
      setNoteToDelete(null);
    },
    onError: (error) => {
      console.error("Delete error:", error);
      alert("Failed to delete note."); // Optional: convert this to a modal later too
    },
  });

  const navigate = useNavigate();

  const handleDeleteClick = (id: string) => {
    setNoteToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (noteToDelete) {
      await deleteNote({ variables: { id: noteToDelete } });
    }
    setShowDeleteModal(false);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setNoteToDelete(null);
  };

  if (loading) return <p>Loading notes...</p>;
  if (error) return <p>Error loading notes: {error.message}</p>;

  const notes = data?.getUserNotes ?? [];

  const filteredNotes = notes.filter((note: Note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          margin: "20px auto",
          display: "block",
          padding: "10px",
          width: "300px",
        }}
      />

      <h3 style={{ textAlign: "center" }}>My Notes</h3>

      <div className="story-list">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note: Note) => (
            <div key={note._id} className="note-wrapper">
              <JournalCard
                _id={note._id}
                title={note.title}
                note={note.note}
                imageUrls={note.imageUrls}
                username={note.username}
              />
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() => navigate(`/createnote/${note._id}`)}
                  style={{
                    marginRight: "10px",
                    padding: "6px 12px",
                    backgroundColor: "#5F7A3E", // Olive green
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDeleteClick(note._id)}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#A14C3A", // Warm muted red-brown
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                >
                  Delete Note
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center" }}>No Notes found.</p>
        )}
      </div>

      {showDeleteModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this note?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}
