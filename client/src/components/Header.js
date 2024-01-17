import { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);

  useEffect(() => {
    // Fetch user profile only if there is a token
    const token = getStoredToken(); // Implement this function to retrieve the stored token

    if (token) {
      fetch('https://bspweb-api.vercel.app/profile', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch user profile');
          }
          return response.json();
        })
        .then(data => {
          // Update user info in the context
          setUserInfo(data);
        })
        .catch(error => {
          // Handle error (e.g., redirect to login page)
          console.error('Error fetching user profile:', error);
        });
    }
  }, [setUserInfo]); // Include setUserInfo in the dependency array to avoid potential issues

  function logout() {
    // Logout logic
    fetch('https://bspweb-api.vercel.app/logout', {
      credentials: 'include',
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => {
        // Clear user info in the context
        setUserInfo(null);
        console.log(data);
      })
      .catch(error => {
        // Handle error (e.g., log or show an error message)
        console.error('Error logging out:', error);
      });
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">
        cobble logs
      </Link>
      <nav>
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
