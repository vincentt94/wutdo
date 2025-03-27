import { Link } from 'react-router-dom';
import { type MouseEvent } from 'react';
import Auth from '../utils/auth';
import { useEffect, useState } from "react";
// import logo from '../assets/Logo.png'; 
//NEED TO IMPORT A LOGO IMAGE INTO ASSETS FOLDER 


const Header = () => {
  const logout = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // Logs the user out by calling the logout method from Auth
    Auth.logout();
  };

  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (Auth.loggedIn()) {
      const profile = Auth.getProfile();
      setUsername(profile?.data?.username || null);
    } else {
      setUsername(null);
    }
  }, []);


  return (
    <header>
      <div className="header-content">
        <Link to="/" id="logoImg">
          {/* Optional logo image here */}
        </Link>
        <Link to="/">
          <h1>Wutdo</h1>
        </Link>
      </div>
  
      {/* Nav Links & User Info */}
      <div className="header-nav">
        {Auth.loggedIn() ? (
          <>
            {username && (
              <span className="username-below">
                Welcome {username}
              </span>
            )}
            <Link to="/mynotes">My Notes</Link>
            <Link to="/createnote">Create Note</Link>
            <button id="logoutButton" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
