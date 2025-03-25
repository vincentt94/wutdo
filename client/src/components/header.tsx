import { Link } from 'react-router-dom';
import { type MouseEvent } from 'react';
import Auth from '../utils/auth';
// import logo from '../assets/Logo.png'; 
//NEED TO IMPORT A LOGO IMAGE INTO ASSETS FOLDER 


const Header = () => {
  const logout = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // Logs the user out by calling the logout method from Auth
    Auth.logout();
  };


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
                Home
              </Link>
              <Link to="/mynotes">
                My Notes
              </Link>
              <Link to="/createnote">
                Create Note
              </Link>
              <button id = "logoutButton" onClick={logout}>
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
