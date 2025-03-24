import { useQuery } from "@apollo/client";
import CreateNote from "./CreateNote";
import JournalCard from "../components/JournalCard.tsx";
import { USER_NOTES } from "../utils/queries.js";

interface Topic {
    id: string;
    title: string;
    note: string;
    imageUrl?: string;
    username?: string;
}

export default function MyNotes() {

    const { data, refetch } = useQuery(USER_NOTES);

    // Ensure data exists before accessing getUserStories
    const notes = data?.getUserNotes ?? [];

    /*
    const handleAddStory = (id: string, title: string, story: string, image?: string) => {
        setStories([...stories, { id, title, story, image }]);
    };
    */

    return (
        <div>
            <CreateNote onAddStory={refetch} />
            <h3>My Notes</h3>
            <div className="story-list">
                {stories.length > 0 ? (
                    stories.map((topic: Topic, index: number) => <JournalCard key={index} id = {story.id} title ={story.title} story = {story.story} imageUrl = {story.imageUrl} username={story.username} />)
                ) : (
                    <p>No Notes found.</p>
                )}
            </div>
        </div>
    );
}
