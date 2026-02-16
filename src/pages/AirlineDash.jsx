import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AirlineStaffDashboard({ airlineCode, staffName }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("flights");

  // Sample flights for this airline
  const [flights, setFlights] = useState([
    { flightNum: "0245", destination: "New York", gate: "T1G5" },
    { flightNum: "0246", destination: "Los Angeles", gate: "T1G6" },
  ]);

  // Sample passengers
  const [passengers, setPassengers] = useState([
    { firstName: "John", lastName: "Doe", ticket: "1234567890", flight: "0245", status: "Not-checked-in", bags: [] },
    { firstName: "Jane", lastName: "Smith", ticket: "9876543210", flight: "0245", status: "Not-checked-in", bags: [] },
  ]);

  const [newBag, setNewBag] = useState({ bagId: "", ticket: "", flight: "" });

  // Message board state (shared messages + notifications to admin)
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Logout
  const handleLogout = () => navigate("/");

  // Check-in passenger
  const handleCheckIn = (ticket) => {
    setPassengers(passengers.map(p => p.ticket === ticket ? { ...p, status: "Checked-in" } : p));
  };

  // Add bag
  const handleAddBag = (e) => {
    e.preventDefault();
    const passenger = passengers.find(p => p.ticket === newBag.ticket);
    if (!passenger) {
      alert("Passenger not found");
      return;
    }
    passenger.bags.push({ bagId: newBag.bagId, status: "Checked-in", flight: newBag.flight });
    setPassengers([...passengers]);
    setNewBag({ bagId: "", ticket: "", flight: "" });
  };

  // Send message to board
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setMessages([...messages, {
      sender: staffName || "Airline Staff",
      text: newMessage,
      time: new Date().toLocaleTimeString()
    }]);

    setNewMessage("");
  };

  // Notify admin (also appears on message board)
  const notifyAdmin = (message) => {
    const adminMessage = `To Admin: ${message}`;
    setMessages([...messages, { sender: staffName || "Airline Staff", text: adminMessage, time: new Date().toLocaleTimeString() }]);
    alert(`Admin notified: ${message}`);
  };

  // Handle passenger issues
  const handleCheckInProblem = (passenger) => {
    notifyAdmin(`Passenger ${passenger.firstName} ${passenger.lastName} (Ticket: ${passenger.ticket}) has a check-in problem.`);
  };

  const handleSecurityViolation = (passenger) => {
    notifyAdmin(`Passenger ${passenger.firstName} ${passenger.lastName} (Ticket: ${passenger.ticket}) removed for security violation.`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Airline Staff Dashboard - {airlineCode}</h1>
      <h3>Logged in as: {staffName || "Airline Staff"}</h3>
      <button onClick={handleLogout} style={{ float: "right" }}>Logout</button>

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setActiveTab("flights")} style={{ marginRight: "10px" }}>Flights</button>
        <button onClick={() => setActiveTab("passengers")}>Passengers</button>
      </div>

      <div style={{ marginTop: "20px" }}>
        {/* Flights Tab */}
        {activeTab === "flights" && (
          <div>
            <h2>Flights</h2>
            <table border="1" cellPadding="5">
              <thead>
                <tr>
                  <th>Flight #</th>
                  <th>Destination</th>
                  <th>Gate</th>
                </tr>
              </thead>
              <tbody>
                {flights.map(f => (
                  <tr key={f.flightNum}>
                    <td>{f.flightNum}</td>
                    <td>{f.destination}</td>
                    <td>{f.gate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Passengers Tab */}
        {activeTab === "passengers" && (
          <div>
            <h2>Passengers</h2>

            <form onSubmit={handleAddBag} style={{ marginBottom: "20px" }}>
              <input
                placeholder="Bag ID"
                value={newBag.bagId}
                onChange={e => setNewBag({ ...newBag, bagId: e.target.value })}
                required
              />
              <input
                placeholder="Passenger Ticket #"
                value={newBag.ticket}
                onChange={e => setNewBag({ ...newBag, ticket: e.target.value })}
                required
              />
              <input
                placeholder="Flight #"
                value={newBag.flight}
                onChange={e => setNewBag({ ...newBag, flight: e.target.value })}
                required
              />
              <button type="submit">Add Bag</button>
            </form>

            <table border="1" cellPadding="5">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Ticket</th>
                  <th>Flight</th>
                  <th>Status</th>
                  <th>Bags</th>
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
                    <td>{p.bags.map(b => b.bagId).join(", ")}</td>
                    <td>
                      {p.status === "Not-checked-in" && (
                        <button onClick={() => handleCheckIn(p.ticket)}>Check-in</button>
                      )}
                      <button onClick={() => handleCheckInProblem(p)}>Remove (Check-in issue)</button>
                      <button onClick={() => handleSecurityViolation(p)}>Remove (Security)</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Message Board */}
            <div style={{ marginTop: "20px" }}>
              <h2>Message Board</h2>
              <div style={{
                border: "1px solid #ccc",
                padding: "10px",
                height: "200px",
                overflowY: "auto",
                marginBottom: "10px",
                backgroundColor: "#f9f9f9"
              }}>
                {messages.length === 0 && <p>No messages yet.</p>}
                {messages.map((msg, i) => (
                  <div key={i} style={{ marginBottom: "5px" }}>
                    <strong>{msg.time} - {msg.sender}:</strong> {msg.text}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage}>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  style={{ width: "70%", marginRight: "10px" }}
                />
                <button type="submit">Send</button>
              </form>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default AirlineStaffDashboard;


