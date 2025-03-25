import { useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import JournalCard from "../components/journalcard.tsx";
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

  const [deleteNote] = useMutation(DELETE_NOTE, {
    onCompleted: () => refetch(),
    onError: (error) => {
      console.error("Delete error:", error);
      alert("Failed to delete note.");
    },
  });

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this note?")) {
      await deleteNote({ variables: { id } });
    }
  };

  const navigate = useNavigate();

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
                    backgroundColor: "#4285F4",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(note._id)}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#EA4335",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
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
    </div>
  );
}
