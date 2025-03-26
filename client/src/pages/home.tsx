import Auth from "../utils/auth";

export default function Home() {
  const loggedIn = Auth.loggedIn();

  if (!loggedIn) {
    // Unauthenticated version of the homepage (placeholder for now)
    return (
      <div className="home-container">
        <h1>Wutdonow?</h1>
        <p className="about-box2">
        Alright so listen, I went to this, uh, computer school—boot feet bootcamp thing, lotta typing, big brain stuff—anyway, 
        I made this project thing right? It’s like, it helps me remember stuff BUT ALSO it’s got like... pictures? You put the notes in the thing, 
        and then it’s like 'HEY HERE’S A NOTE!' and also 'DON’T FORGET TO DO THE THING!' It’s like notes and chores had a baby, and the baby is screaming 
        at me but in like a helpful way, y’know? You can sign up—press the thing, do the clickity clack, boom, now you’re in the note-zone, baby! 
        It’s like... fun? But also like, productive? I dunno man, I blacked out halfway through building it. WHAT DO NOW?
        </p>
        {/* You can enhance this section later with animations, graphics, or teaser content */}
      </div>
    );
  }

  // Logged-in user homepage content
  return (
    <div className="home-container">
      <h1>Welcome to Wutdo</h1>
      <p className="home-subtext">
        Your personal space to document thoughts, stories, and ideas — privately or shared with others.
      </p>

      <div className="about-box">
        <h2>What is Wutdo?</h2>
        <p>
          Wutdo is your modern journaling companion — whether you're jotting down creative ideas,
          logging your daily mood, or saving images that inspire you.
        </p>
        <p>
          You can create beautiful, image-rich notes, organize them, and access them anytime from anywhere.
        </p>

        <h2>Why Wutdo?</h2>
        <ul>
          <li>✍️ Easy-to-use note creation and editing</li>
          <li>📸 Upload and manage your images per note</li>
          <li>🔒 Fully private — only you can view and edit your notes</li>
          <li>🧠 Great for daily thoughts, dream journaling, study logs, and more</li>
        </ul>
      </div>
    </div>
  );
}
