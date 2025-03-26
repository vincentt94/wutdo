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
      <div>

        <div className="header-content">
          <Link to="/" id="logoImg">
            { /*
                <img src={logo} alt="Travel Journal Logo"/>
             */}
          </Link>
          <Link to="/">
            <h1>Wutdo</h1>
          </Link>
        </div>
      </div>

      <div>
        {/* Checking if the user is logged in to conditionally render profile link and logout button */}
        {Auth.loggedIn() ? (
          <>
            <Link to="/">
            {username && (
              <span style={{ color: "var(--color-creamy-white)", fontSize: "20px", marginRight: "20px" }}>
                Welcome {username}
              </span>
            )}
            </Link>
            <Link to="/mynotes">
              My Notes
            </Link>
            <Link to="/createnote">
              Create Note
            </Link>
            <button id="logoutButton" onClick={logout}>
              Logout
            </button>



          </>
        ) : (
          <>
            <Link to="/login">
              Login&nbsp;
            </Link>

            <Link to="/signup">
              Signup&nbsp;
            </Link>


          </>
        )}
      </div>
    </header>
  );
};

export default Header;
