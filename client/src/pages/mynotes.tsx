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
  imageUrl?: string;
  username?: string;
}

export default function MyNotes() {
  const { data, refetch } = useQuery(USER_NOTES);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

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

  return (
    <div>
      {/* Show Create or Edit Form */}
      {editingNote ? (
        <CreateNote
          onAddNote={refetch}
          noteToEdit={editingNote}
          onFinishEdit={() => setEditingNote(null)}
        />
      ) : (
        <CreateNote onAddNote={refetch} />
      )}

      <h3>My Notes</h3>

      <div className="story-list">
        {notes.length > 0 ? (
          notes.map((note: Note) => (
            <div key={note._id} className="note-wrapper">
              <JournalCard
                _id={note._id}
                title={note.title}
                note={note.note}
                imageUrl={note.imageUrl}
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
