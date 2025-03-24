
interface JournalCardProps {
    _id?: string;
    title: string;
    note: string;
    imageUrl?: string;
    username?: string;
}

export default function JournalCard({ title, note, imageUrl, username }: JournalCardProps) {
    console.log("Rendered JournalCard:", {title, imageUrl, username}); // debugging issue 
    return (
        <div className="journal-card">
            {imageUrl && <img src={imageUrl} alt={title} className="journal-image" />}
            <div className="journal-content">
                <h2 className="journal-title">{title}</h2>
                {username && 
                    <p className = "journal-author"> By: {username}</p>
                }
                <p className="journal-text">{note}</p>
            </div>
        </div>
    );
}
