import { useQuery } from "@apollo/client";
import CreateNote from "./createnote";
import JournalCard from "../components/journalcard.tsx";
import { USER_NOTES } from "../utils/queries.js";
import { DELETE_NOTE } from "../utils/mutations";
import { useMutation } from "@apollo/client";

interface Note {
    _id: string;
    title: string;
    note: string;
    imageUrl?: string;
    username?: string;
}

export default function MyNotes() {

    const { data, refetch } = useQuery(USER_NOTES);

    const [deleteNote] = useMutation(DELETE_NOTE, {
        onCompleted: () => refetch(),
        onError: (error) => {
          console.error("Delete error:", error);
          alert("Failed to delete note.");
        }
      });

      const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this note?")) {
          await deleteNote({ variables: { id } });
        }
      };

    // Ensure data exists before accessing getUserStories
    const notes = data?.getUserNotes ?? [];

    /*
    const handleAddStory = (id: string, title: string, story: string, image?: string) => {
        setStories([...stories, { id, title, story, image }]);
    };
    */

    return (
        <div>
            <CreateNote onAddNote={refetch} />
            <h3>My Notes</h3>
            <div className="story-list">
                {notes.length > 0 ? (
                    notes.map((note: Note, index: number) => <div key={index} className="note-wrapper">
                    <JournalCard
                      _id={note._id}
                      title={note.title}
                      note={note.note}
                      imageUrl={note.imageUrl}
                      username={note.username}
                    />
                    <button onClick={() => handleDelete(note._id)}>Delete Note</button>
                  </div> )
                ) : (
                    <p>No Notes found.</p>
                )}
            </div>
        </div>
    );
}
