import { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

// Save the token to localStorage
const setStoredToken = (token) => {
  localStorage.setItem('token', token);
};

// Retrieve the token from localStorage
const getStoredToken = () => {
  return localStorage.getItem('token');
};

// Remove the token from localStorage
const removeStoredToken = () => {
  localStorage.removeItem('token');
};
// ... (imports)

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);

  useEffect(async () => {
    const token = getStoredToken();

    if (token) {
      try {
        const response = await fetch('https://bspweb-api.vercel.app/profile', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Handle error (e.g., redirect to login page)
      }
    }
  }, [setUserInfo]);

  function logout() {
    fetch('https://bspweb-api.vercel.app/logout', {
      credentials: 'include',
      method: 'POST',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed: ${response.status} - ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        setUserInfo(null);
        removeStoredToken();
        console.log(data);
      })
      .catch(error => {
        console.error('Error logging out:', error);
        // Handle error (e.g., log or show an error message)
      });
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">
        cobble logs
      </Link>
      <nav>
        {username && (
          <h2>Hi {username}!</h2>
        )}
        {username ? (
          <>
            <Link to="/analysis" className="nav-button">
              Analysis
            </Link>
            <Link to="/create" className="nav-button">
              Create new log
            </Link>
            <Link onClick={logout} className="nav-button">
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link to="/analysis" className="nav-button">
              Analysis
            </Link>
            <Link to="/login" className="nav-button">
              Login
            </Link>
            <Link to="/register" className="nav-button">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
