import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

function Header() {
  const navigate = useNavigate();
  const { remainingTime: tokenValidTime, token } = useAuth();
  const logOut = () => {
    localStorage.removeItem("budget-access-token");
    navigate("/login");
  };

  useEffect(() => {
    if (!!tokenValidTime && tokenValidTime < 1) logOut();
  }, [tokenValidTime]);

  function handleRefreshToken() {
    axios
      .get(process.env.REACT_APP_SERVER_URL + "/api/refresh-token", {
        headers: {
          Authorization: token,
        },
      })
      .then((data) => {
        localStorage.setItem("budget-access-token", data.data.token);
      });
  }

  return (
    <div className="header-container" role="banner">
      <div className="header">
        <span className="heading">Budget Tracker</span>
        <nav className="nav">
          <div className="header-element">
            <Link to={"/"}>Home</Link>
          </div>
          <div className="header-element">
            <Link to={"/add-expense"}>Add Expense</Link>
          </div>
          <div className="header-element">
            <Link to={"/add-budget"}>Add Budget</Link>
          </div>
          <div className="header-element">
            <span onClick={logOut}>Log out</span>
          </div>
        </nav>
      </div>
      {tokenValidTime && tokenValidTime > 0 && tokenValidTime < 21 && (
        <div
          style={{
            width: "100vw",
            background: "#ff3737",
            padding: "15px",
            fontSize: "larger",
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            alignItems: "center",
            boxSizing: "border-box",
          }}
        >
          <span>Token is going to expire in {tokenValidTime} seconds</span>
          <button
            style={{
              outline: "none",
              border: "none",
              padding: "10px",
              cursor: "pointer",
            }}
            onClick={handleRefreshToken}
          >
            Refresh token
          </button>
        </div>
      )}
    </div>
  );
}

export default Header;
