import { useQuery } from "@apollo/client";
import { GET_NOTES } from "../utils/queries";
import { Link } from "react-router-dom";
import JournalCard from "../components/journalcard";


export default function Home() {
    const { data, loading, error } = useQuery(GET_NOTES);

    // Get all stories from query result
    const notes = data?.getNotes || [];

    // Function to get 4 random stories (can change how much we want to display)
    const getRandomNotes = (notesArray: any[], count: number) => {
        const shuffled = [...notesArray].sort(() => 0.5 - Math.random()); // Shuffle array
        return shuffled.slice(0, count); // Pick first 'count' elements
    };

    // Select up to 4 random stories (can change how much we want to display)
    const randomNotes = getRandomNotes(notes, 4);



    return (
        <div className="home-container">
            <h1>Recent Stories</h1>
    
            {loading && <p>Loading stories...</p>}
            {error && <p>Error loading stories.</p>}
    
            <div className="story-feed">
                {randomNotes.map((note) => (
                    <JournalCard
                        key={note._id}
                        title={note.title}
                        note={note.story}
                        imageUrl={note.imageUrl}
                        username={note.username}
                    />
                ))}
            </div>
    
            <Link to="/mynotes">
                <button className="create-story-button">Add a new note</button>
            </Link>

        
        </div>
    );
    
}