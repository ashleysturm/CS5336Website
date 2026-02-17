import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AirlineStaffDashboard({ airlineCode, staffName }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("flights");

  // Sample flights for this airline
  const [flights, setFlights] = useState([
    { flightNum: "AA0245", destination: "New York", gate: "T1G5" },
    { flightNum: "AA0246", destination: "Los Angeles", gate: "T1G6" },
  ]);

  // Sample passengers
  const [passengers, setPassengers] = useState([
    { firstName: "John", lastName: "Doe", ticket: "1234567890", flight: "AA0245", status: "Not-checked-in", bags: [] },
    { firstName: "Jane", lastName: "Smith", ticket: "9876543210", flight: "AA0245", status: "Not-checked-in", bags: [] },
  ]);

  const [newBag, setNewBag] = useState({ ticket: "", flight: "" });

  // Message board state (shared messages + notifications to admin)
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Logout
  const handleLogout = () => navigate("/");

  // Check-in passenger
  const handleCheckIn = (ticket) => {
    setPassengers(passengers.map(p => p.ticket === ticket ? { ...p, status: "Checked-in" } : p));
  };

  // Function to generate a random 6-digit bag ID
  const generateBagId = () => Math.floor(100000 + Math.random() * 900000).toString();

  // Add bag
  const handleAddBag = (e) => {
    e.preventDefault();
    const passenger = passengers.find(p => p.ticket === newBag.ticket);
    if (!passenger) {
      alert("Passenger not found");
      return;
    }
    const bagId = generateBagId();
    passenger.bags.push({ bagId, status: "Checked-in", flight: newBag.flight });
    setPassengers([...passengers]);
    setNewBag({ ticket: "", flight: "" });
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
    <>
      {/* HEADER */}
      <div className="system-header">
        <div className="header-left">SAN Airport – {staffName || "Airline Staff"}</div>
        <div className="header-right">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* MAIN DASHBOARD */}
      <div className="dashboard-container">

        {/* TAB NAVIGATION */}
        <div className="section-card">
          <button
            className={activeTab === "flights" ? "active-tab" : ""}
            onClick={() => setActiveTab("flights")}
          >
            Flights
          </button>
          <button
            className={activeTab === "passengers" ? "active-tab secondary-btn" : "secondary-btn"}
            onClick={() => setActiveTab("passengers")}
          >
            Passengers
          </button>
        </div>

        {/* FLIGHTS TAB */}
        {activeTab === "flights" && (
          <div className="section-card">
            <h2>Flights</h2>
            <table>
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

        {/* PASSENGERS TAB */}
        {activeTab === "passengers" && (
          <div className="section-card">
            <h2>Passengers</h2>

            {/* ADD BAG FORM */}
            <form onSubmit={handleAddBag} style={{ marginBottom: "20px" }}>
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
              <button type="submit">Add Bag (auto ID)</button>
            </form>

            {/* PASSENGER TABLE */}
            <table>
              <thead>
                <tr>
                  <th>First</th>
                  <th>Last</th>
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
                        <button className="secondary-btn" onClick={() => handleCheckIn(p.ticket)}>Check-in</button>
                      )}
                      <button className="danger-btn" onClick={() => handleCheckInProblem(p)}>Issue</button>
                      <button className="danger-btn" onClick={() => handleSecurityViolation(p)}>Security</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* MESSAGE BOARD */}
            <div style={{ marginTop: "20px" }}>
              <h2>Message Board</h2>
              <div className="message-board">
                {messages.length === 0 && <p>No messages yet.</p>}
                {messages.map((msg, i) => (
                  <div key={i} className="message-entry">
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
    </>
  );
}

export default AirlineStaffDashboard;


