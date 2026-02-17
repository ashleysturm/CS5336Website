import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Helper functions to generate random username/password
const generateUsername = (firstName, lastName) => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${firstName.slice(0, 2)}${lastName.slice(0, 2)}${randomNum}`;
};

const generatePassword = () => {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const nums = "0123456789";
  const all = upper + lower + nums;

  let password = "";
  password += upper[Math.floor(Math.random() * upper.length)];
  password += lower[Math.floor(Math.random() * lower.length)];
  password += nums[Math.floor(Math.random() * nums.length)];

  for (let i = 0; i < 3; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }
  return password;
};

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("flights");

  // Sample data
  const [flights, setFlights] = useState([
    { airline: "DL", flightNum: "0245", destination: "New York", gate: "T1G5" },
    { airline: "AA", flightNum: "1010", destination: "Chicago", gate: "T2G3" },
  ]);

  const [passengers, setPassengers] = useState([
    { firstName: "John", lastName: "Doe", ticket: "1234567890", flight: "DL0245", status: "Not-checked-in" },
    { firstName: "Jane", lastName: "Smith", ticket: "9876543210", flight: "AA1010", status: "Checked-in" },
  ]);
/*changed the format to accommodate the email and phone number columns*/
 const [staff, setStaff] = useState([
  {
    firstName: "Alice",
    lastName: "Brown",
    role: "Airline Staff",
    airline: "DL",
    phone: "555-111-2222",
    email: "alice@airport.com",
    username: "AlBr1234",
    password: "Xy1ab2",
  },
  {
    firstName: "Bob",
    lastName: "Green",
    role: "Gate Staff",
    airline: "AA",
    phone: "555-333-4444",
    email: "bob@airport.com",
    username: "BoGr5678",
    password: "Ab2cd3",
  },
  {
    firstName: "Charlie",
    lastName: "White",
    role: "Ground Staff",
    airline: "N/A",
    phone: "555-555-6666",
    email: "charlie@airport.com",
    username: "ChWh9012",
    password: "Cd3ef4",
  },
]);
  // Form state
  const [newFlight, setNewFlight] = useState({ airline: "", flightNum: "", destination: "", gate: "" });
  const [newPassenger, setNewPassenger] = useState({ firstName: "", lastName: "", ticket: "", flight: "", status: "Not-checked-in" });
/*added these lines of code to modify the admin having access to phone numbers and emails of the passengers*/
  const [newStaff, setNewStaff] = useState({
    firstName: "",
    lastName: "",
    role: "Airline Staff",
    airline: "",
    phone: "",
    email: "",
  });
  
  // Messages state
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Logout
  const handleLogout = () => navigate("/");

  // Remove handlers
  const handleRemoveFlight = (flightNum) => {
    if (window.confirm(`Remove flight ${flightNum}?`)) {
      setFlights(flights.filter(f => f.flightNum !== flightNum));
    }
  };

  const handleRemovePassenger = (ticket) => {
    if (window.confirm(`Remove passenger with ticket ${ticket}?`)) {
      setPassengers(passengers.filter(p => p.ticket !== ticket));
    }
  };

  const handleRemoveStaff = (firstName, lastName) => {
    if (window.confirm(`Remove staff ${firstName} ${lastName}?`)) {
      setStaff(staff.filter(s => s.firstName !== firstName || s.lastName !== lastName));
    }
  };

  // Add handlers with validations
  const handleAddFlight = (e) => {
    e.preventDefault();
    if (flights.some(f => f.gate === newFlight.gate)) {
      alert(`Gate ${newFlight.gate} already has a flight.`);
      return;
    }
    setFlights([...flights, newFlight]);
    setNewFlight({ airline: "", flightNum: "", destination: "", gate: "" });
  };

  const handleAddPassenger = (e) => {
    e.preventDefault();
    if (!flights.some(f => `${f.airline}${f.flightNum}` === newPassenger.flight)) {
      alert(`Flight ${newPassenger.flight} does not exist.`);
      return;
    }
    setPassengers([...passengers, newPassenger]);
    setNewPassenger({ firstName: "", lastName: "", ticket: "", flight: "", status: "Not-checked-in" });
  };

  const handleAddStaff = (e) => {
    e.preventDefault();
    const username = generateUsername(newStaff.firstName, newStaff.lastName);
    const password = generatePassword();
    setStaff([...staff, { ...newStaff, username, password }]);
    setNewStaff({ firstName: "", lastName: "", role: "Airline Staff", airline: "" });
    alert(`New staff created.\nUsername: ${username}\nPassword: ${password}`);
  };

  // Message handlers
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    setMessages([...messages, { text: newMessage, time: new Date().toLocaleTimeString() }]);
    setNewMessage("");
  };

  return (
    <>
      {/* HEADER */}
      <div className="system-header">
        <div className="header-left">
          SAN Airport – Admin Operations
        </div>
        <div className="header-right">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="dashboard-container">

        {/* TAB NAVIGATION */}
        <div className="section-card">
          <button onClick={() => setActiveTab("flights")}>Flights</button>
          <button onClick={() => setActiveTab("passengers")} className="secondary-btn">Passengers</button>
          <button onClick={() => setActiveTab("staff")} className="secondary-btn">Staff</button>
          <button onClick={() => setActiveTab("messages")} className="secondary-btn">Messages</button>
        </div>

        {/* FLIGHTS */}
        {activeTab === "flights" && (
          <div className="section-card">
            <h2>Flights</h2>

            <form onSubmit={handleAddFlight}>
              <input placeholder="Airline" value={newFlight.airline}
                onChange={e => setNewFlight({...newFlight, airline: e.target.value})} required />
              


              
              <input placeholder="Flight #" value={newFlight.flightNum}
                onChange={e => setNewFlight({...newFlight, flightNum: e.target.value})} required />
              <input placeholder="Destination" value={newFlight.destination}
                onChange={e => setNewFlight({...newFlight, destination: e.target.value})} required />
              <input placeholder="Gate" value={newFlight.gate}
                onChange={e => setNewFlight({...newFlight, gate: e.target.value})} required />
              <button type="submit">Add Flight</button>
            </form>

            <table>
              <thead>
                <tr>
                  <th>Airline</th>
                  <th>Flight #</th>
                  <th>Destination</th>
                  <th>Gate</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {flights.map(f => (
                  <tr key={f.flightNum}>
                    <td>{f.airline}</td>
                    <td>{f.flightNum}</td>
                    <td>{f.destination}</td>
                    <td>{f.gate}</td>
                    <td>
                      <button className="danger-btn"
                        onClick={() => handleRemoveFlight(f.flightNum)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PASSENGERS */}
        {activeTab === "passengers" && (
          <div className="section-card">
            <h2>Passengers</h2>

            <form onSubmit={handleAddPassenger}>
              <input placeholder="First Name"
                value={newPassenger.firstName}
                onChange={e => setNewPassenger({...newPassenger, firstName: e.target.value})} required />
              <input placeholder="Last Name"
                value={newPassenger.lastName}
                onChange={e => setNewPassenger({...newPassenger, lastName: e.target.value})} required />
              <input placeholder="Ticket #"
                value={newPassenger.ticket}
                onChange={e => setNewPassenger({...newPassenger, ticket: e.target.value})} required />
              <input placeholder="Flight"
                value={newPassenger.flight}
                onChange={e => setNewPassenger({...newPassenger, flight: e.target.value})} required />
              <button type="submit">Add Passenger</button>
            </form>

            <table>
              <thead>
                <tr>
                  <th>First</th>
                  <th>Last</th>
                  <th>Ticket</th>
                  <th>Flight</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {passengers.map(p => (
                  <tr key={p.ticket}>
                    <td>{p.firstName}</td>
                    <td>{p.lastName}</td>
                    <td>{p.ticket}</td>
                    <td>{p.flight}</td>
                    <td>{p.status}</td>
                    <td>
                      <button className="danger-btn"
                        onClick={() => handleRemovePassenger(p.ticket)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* STAFF */}
        {activeTab === "staff" && (
          <div className="section-card">
            <h2>Staff Members</h2>

            <form onSubmit={handleAddStaff}>
              <input placeholder="First Name"
                value={newStaff.firstName}
                onChange={e => setNewStaff({...newStaff, firstName: e.target.value})} required />
              <input placeholder="Last Name"
                value={newStaff.lastName}
                onChange={e => setNewStaff({...newStaff, lastName: e.target.value})} required />
              <select
                value={newStaff.role}
                onChange={e => setNewStaff({...newStaff, role: e.target.value})}>
                <option>Airline Staff</option>
                <option>Gate Staff</option>
                <option>Ground Staff</option>
              </select>
              <input placeholder="Airline (if applicable)"
                value={newStaff.airline}
                onChange={e => setNewStaff({...newStaff, airline: e.target.value})} />
              <input
                placeholder="Phone Number"
                value={newStaff.phone}
                onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
              />
              
              <input
                type="email"
                placeholder="Email"
                value={newStaff.email}
                onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
              />
              <button type="submit">Add Staff</button>
            </form>

            <table>
              <thead>
                <tr>
                  <th>First</th>
                  <th>Last</th>
                  <th>Role</th>
                  <th>Airline</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Username</th>
                  <th>Password</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map(s => (
                  <tr key={`${s.firstName}-${s.lastName}`}>
                    <td>{s.firstName}</td>
                    <td>{s.lastName}</td>
                    <td>{s.role}</td>
                    <td>{s.airline}</td>
                    <td>{s.phone}</td>
                    <td>{s.email}</td>
                    <td>{s.username}</td>
                    <td>{s.password}</td>
                    <td>
                      <button className="danger-btn"
                        onClick={() => handleRemoveStaff(s.firstName, s.lastName)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MESSAGES */}
        {activeTab === "messages" && (
          <div className="section-card">
            <h2>Message Board</h2>

            <div className="message-board">
              {messages.length === 0 && <p>No messages yet.</p>}
              {messages.map((msg, idx) => (
                <div key={idx} className="message-entry">
                  <strong>{msg.time}:</strong> {msg.text}
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                style={{ width: "70%" }}
              />
              <button type="submit">Send</button>
            </form>
          </div>
        )}

      </div>
    </>
  );
}

export default AdminDashboard;




