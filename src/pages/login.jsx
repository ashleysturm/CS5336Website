import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// VALIDATION FUNCTIONS

// Username will have at least 2 letters followed by 2 digits
const isValidUsername = (username) => {
  return /^[a-zA-Z]{2,}\d{2}$/.test(username);
};

// Instructions say password must be having at least these requirements
//  At least 6 characters
//At least 1 uppercase
//  At least 1 lowercase
// At least 1 number
const isValidPassword = (password) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);
};



function Login() {
  const navigate = useNavigate();

  // Simulated user database (frontend only)
  const [users, setUsers] = useState([
    { username: "admin", password: "Admin123", role: "/admin" },
    { username: "airline", password: "airline123", role: "/airline" },
    { username: "gate", password: "gate123", role: "/gate" },
    { username: "ground", password: "ground123", role: "/ground" }
  ]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Change password state
  const [showChange, setShowChange] = useState(false);
  const [changeUser, setChangeUser] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");

  // -------------------------
  // LOGIN
  // -------------------------
  const handleLogin = (e) => {
    e.preventDefault();
    // Admin can stay as-is (hardcoded account), everyone else must follow format rules
    if (username !== "admin" && !isValidUsername(username)) {
      alert("Username must be at least 2 letters followed by 2 digits (example: ab47).");
      return;
    }

    if (!isValidPassword(password)) {
      alert("Password must be at least 6 characters and include at least one uppercase letter, one lowercase letter, and one number.");
      return;
    }
    const user = users.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      navigate(user.role);
    } else {
      alert("Invalid login");
    }
  };

  // -------------------------
  // CHANGE PASSWORD
  // -------------------------
  const handleChangePassword = (e) => {
    e.preventDefault();

    const userIndex = users.findIndex(
      u => u.username === changeUser && u.password === oldPass
    );

    if (userIndex === -1) {
      alert("Invalid username or old password");
      return;
    }

    const updatedUsers = [...users];
    updatedUsers[userIndex].password = newPass;

    setUsers(updatedUsers);

    alert("Password changed successfully!");
    setShowChange(false);
    setChangeUser("");
    setOldPass("");
    setNewPass("");
  };

  return (
    <div>
      {/* HEADER */}
      <div className="system-header">
        <div className="header-left">SAN Airport</div>
        {/* No logout on login page */}
      </div>

      {/* LOGIN CARD */}
      <div className="dashboard-container" style={{ textAlign: "center", marginTop: "50px" }}>
        <div className="section-card">
          <h2>Login</h2>

          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ marginBottom: "10px", width: "200px" }}
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ marginBottom: "10px", width: "200px" }}
            />
            <br />
            <button type="submit" className="primary-btn">Login</button>
          </form>

          <br />

          <button className="secondary-btn" onClick={() => setShowChange(!showChange)}>
            {showChange ? "Cancel" : "Change Password"}
          </button>

          {showChange && (
            <div style={{ marginTop: "20px" }}>
              <h3>Change Password</h3>

              <form onSubmit={handleChangePassword}>
                <input
                  type="text"
                  placeholder="Username"
                  value={changeUser}
                  onChange={(e) => setChangeUser(e.target.value)}
                  style={{ marginBottom: "10px", width: "200px" }}
                />
                <br />
                <input
                  type="password"
                  placeholder="Old Password"
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  style={{ marginBottom: "10px", width: "200px" }}
                />
                <br />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  style={{ marginBottom: "10px", width: "200px" }}
                />
                <br />
                <button type="submit" className="primary-btn">Update Password</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
