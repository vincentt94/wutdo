import { useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import CreateNote from "./createnote";
import JournalCard from "../components/journalcard.tsx";
import { USER_NOTES } from "../utils/queries.js";
import { DELETE_NOTE } from "../utils/mutations";

interface Note {
  _id: string;
  title: string;
  note: string;
  imageUrls?: string[];  // 
  username?: string;
}

export default function MyNotes() {
  const { data, refetch } = useQuery(USER_NOTES);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
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

  const notes = data?.getUserNotes ?? [];

  const filteredNotes = notes.filter((note: Note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {editingNote ? (
        <CreateNote
          onAddNote={refetch}
          noteToEdit={editingNote}
          onFinishEdit={() => setEditingNote(null)}
        />
      ) : (
        <CreateNote onAddNote={refetch} />
      )}

<input
  type="text"
  placeholder="Search by title..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  style={{ margin: "20px auto", display: "block", padding: "10px", width: "300px" }}
/>

      <h3>My Notes</h3>

      <div className="story-list">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note: Note) => (
            <div key={note._id} className="note-wrapper">
              <JournalCard
                _id={note._id}
                title={note.title}
                note={note.note}
                imageUrls={note.imageUrls} // 
                username={note.username}
              />
              <button onClick={() => setEditingNote(note)}>Edit Note</button>
              <button onClick={() => handleDelete(note._id)}>Delete Note</button>
            </div>
          ))
        ) : (
          <p>No Notes found.</p>
        )}
      </div>
    </div>
  );
}
