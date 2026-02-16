import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Login</h2>

      {/* LOGIN FORM */}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <button type="submit">Login</button>
      </form>

      <br />

      <button onClick={() => setShowChange(!showChange)}>
        {showChange ? "Cancel" : "Change Password"}
      </button>

      {/* CHANGE PASSWORD SECTION */}
      {showChange && (
        <div style={{ marginTop: "20px" }}>
          <h3>Change Password</h3>

          <form onSubmit={handleChangePassword}>
            <input
              type="text"
              placeholder="Username"
              value={changeUser}
              onChange={(e) => setChangeUser(e.target.value)}
            />
            <br /><br />

            <input
              type="password"
              placeholder="Old Password"
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
            />
            <br /><br />

            <input
              type="password"
              placeholder="New Password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />
            <br /><br />

            <button type="submit">Update Password</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Login;



