import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function GroundStaffDashboard({ staffName }) {
  const navigate = useNavigate();

  const [mode, setMode] = useState("");
  const [selectedGate, setSelectedGate] = useState("");
  const [currentFlight, setCurrentFlight] = useState(null);
  const [bags, setBags] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // ----------------------------
  // SAMPLE FLIGHTS
  // ----------------------------
  const sampleFlights = [
    {
      airline: "AA",
      flightNum: "0245",
      gate: "T1G5",
      passengers: [
        { firstName: "John", lastName: "Doe", ticket: "1234567890", boarded: true },
        { firstName: "Jane", lastName: "Smith", ticket: "9876543210", boarded: false }
      ]
    },
    {
      airline: "AA",
      flightNum: "0246",
      gate: "T1G6",
      passengers: [
        { firstName: "Alice", lastName: "Brown", ticket: "2233445566", boarded: true }
      ]
    }
  ];

  // ----------------------------
  // SAMPLE BAGS
  // ----------------------------
  const [allBags, setAllBags] = useState([
    { id: "100001", ticket: "1234567890", airline: "AA", flightNum: "0245", status: "Not cleared", location: "Gate" },
    { id: "100002", ticket: "9876543210", airline: "AA", flightNum: "0245", status: "Not cleared", location: "Gate" },
    { id: "100003", ticket: "2233445566", airline: "AA", flightNum: "0246", status: "Not cleared", location: "Gate" }
  ]);

  const handleLogout = () => navigate("/");

  // ----------------------------
  // MODE SELECTION
  // ----------------------------
  const handleSelectMode = (newMode) => {
    setMode(newMode);
    setSelectedGate("");
    setCurrentFlight(null);
    setBags([]);
    if (newMode === "security") {
      setBags(allBags);
    }
  };

  // ----------------------------
  // GATE SELECTION
  // ----------------------------
  const handleSelectGate = (gate) => {
    setSelectedGate(gate);

    const flight = sampleFlights.find(f => f.gate === gate);
    if (!flight) {
      setCurrentFlight(null);
      setBags([]);
      return;
    }
    setCurrentFlight(flight);

    const gateBags = allBags.filter(
      bag => bag.airline === flight.airline && bag.flightNum === flight.flightNum
    );
    setBags(gateBags);
  };

  // ----------------------------
  // SECURITY CLEARANCE ACTIONS
  // ----------------------------
  const handleSecurityCheck = (bagId, isCleared) => {
    const status = isCleared ? "Cleared" : "Security Violation";

    setAllBags(prev =>
      prev.map(b => b.id === bagId ? { ...b, status } : b)
    );

    setBags(prev =>
      prev.map(b => b.id === bagId ? { ...b, status } : b)
    );

    if (!isCleared) {
      const bag = allBags.find(b => b.id === bagId);
      const msgText = `Passenger with bag ${bagId} (Flight: ${bag.airline}${bag.flightNum}) failed security. Admin should remove passenger.`;
      setMessages(prev => [
        ...prev,
        { sender: staffName || "Ground Staff", text: msgText, time: new Date().toLocaleTimeString() }
      ]);
      alert(msgText);
    }
  };

  // ----------------------------
  // LOAD BAG TO PLANE
  // ----------------------------
  const handleLoadBag = (bagId) => {
    setAllBags(prev =>
      prev.map(b => b.id === bagId ? { ...b, location: "Loaded onto Plane" } : b)
    );
    setBags(prev =>
      prev.map(b => b.id === bagId ? { ...b, location: "Loaded onto Plane" } : b)
    );

    const bag = allBags.find(b => b.id === bagId);
    const msgText = `Bag ${bagId} (Flight: ${bag.airline}${bag.flightNum}) loaded onto plane.`;
    setMessages(prev => [
      ...prev,
      { sender: staffName || "Ground Staff", text: msgText, time: new Date().toLocaleTimeString() }
    ]);
  };

  // ----------------------------
  // CHECK IF PASSENGER IS BOARDED
  // ----------------------------
  const isPassengerBoarded = (ticket) => {
    if (!currentFlight) return false;
    const passenger = currentFlight.passengers.find(p => p.ticket === ticket);
    return passenger ? passenger.boarded : false;
  };

  // ----------------------------
  // SEND GENERAL MESSAGE
  // ----------------------------
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages([...messages, {
      sender: staffName || "Ground Staff",
      text: newMessage,
      time: new Date().toLocaleTimeString()
    }]);
    setNewMessage("");
  };

  return (
    <>
      {/* HEADER */}
      <div className="system-header">
        <div className="header-left">SAN Airport – {staffName || "Ground Staff"}</div>
        <div className="header-right">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* DASHBOARD */}
      <div className="dashboard-container">

        {/* MODE SELECTION */}
        <div className="section-card">
          <label>Select Mode: </label>
          <select value={mode} onChange={e => handleSelectMode(e.target.value)}>
            <option value="">--Choose Mode--</option>
            <option value="security">Security Clearance</option>
            <option value="gate">Gate Operations</option>
          </select>
        </div>

        {/* GATE SELECTION */}
        {mode === "gate" && (
          <div className="section-card">
            <label>Select Gate: </label>
            <select value={selectedGate} onChange={e => handleSelectGate(e.target.value)}>
              <option value="">--Choose Gate--</option>
              <option value="T1G5">T1G5</option>
              <option value="T1G6">T1G6</option>
            </select>

            {currentFlight && (
              <div style={{ marginTop: "20px" }}>
                <h3>Flight Info</h3>
                <p>Flight: {currentFlight.airline}{currentFlight.flightNum}</p>
                <p>Gate: {currentFlight.gate}</p>
              </div>
            )}
          </div>
        )}

        {/* BAG TABLE */}
        {bags.length > 0 && (
          <div className="section-card">
            <h2>Bags</h2>
            <table>
              <thead>
                <tr>
                  <th>Bag ID</th>
                  <th>Ticket</th>
                  <th>Status</th>
                  <th>Location</th>
                  {mode === "gate" && <th>Passenger Boarded</th>}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bags.map(b => {
                  const passengerBoarded = isPassengerBoarded(b.ticket);
                  return (
                    <tr key={b.id}>
                      <td>{b.id}</td>
                      <td>{b.ticket}</td>
                      <td>{b.status}</td>
                      <td>{b.location}</td>
                      {mode === "gate" && (
                        <td style={{ color: passengerBoarded ? "green" : "red" }}>
                          {passengerBoarded ? "Yes" : "No"}
                        </td>
                      )}
                      <td>
                        {mode === "security" && b.status === "Not cleared" && (
                          <>
                            <button className="secondary-btn" onClick={() => handleSecurityCheck(b.id, true)}>Clear</button>
                            <button className="danger-btn" onClick={() => handleSecurityCheck(b.id, false)}>Violation</button>
                          </>
                        )}
                        {mode === "gate" && b.location === "Gate" && b.status === "Cleared" && passengerBoarded && (
                          <button className="secondary-btn" onClick={() => handleLoadBag(b.id)}>Load onto Plane</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* MESSAGE BOARD */}
        <div className="section-card">
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
    </>
  );
}

export default GroundStaffDashboard;







  
