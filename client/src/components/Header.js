import { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function Header() {
  const {setUserInfo,userInfo} = useContext(UserContext);
  useEffect(() => {
    fetch('https://bspweb-api.vercel.app/profile', {
      method: 'GET',
      credentials: 'include',
      headers: {
          'Content-Type': 'application/json',
      },  
    });
  }, []);

  function logout() {
    fetch('https://bspweb-api.vercel.app/logout', {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">
        cobble logs
      </Link>
      <nav>
        {username && (
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
        )}{!username&& (
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
