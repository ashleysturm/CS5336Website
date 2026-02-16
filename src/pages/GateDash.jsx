import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function GateStaffDashboard({ staffName }) {
  const navigate = useNavigate();

  const [selectedGate, setSelectedGate] = useState("");
  const [flight, setFlight] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [allBoarded, setAllBoarded] = useState(false);

  // Sample flights with bags (one loaded, one not)
  const sampleFlights = [
    {
      flightNum: "0245",
      airline: "DL",
      destination: "New York",
      gate: "T1G5",
      passengers: [
        {
          firstName: "John",
          lastName: "Doe",
          ticket: "1234567890",
          status: "Checked-in",
          bags: [
            { bagId: "B100001", status: "Loaded" },
            { bagId: "B100002", status: "Not loaded" },
          ],
        },
        {
          firstName: "Jane",
          lastName: "Smith",
          ticket: "9876543210",
          status: "Checked-in",
          bags: [{ bagId: "B100003", status: "Loaded" }],
        },
      ],
    },
    {
      flightNum: "0246",
      airline: "AA",
      destination: "Los Angeles",
      gate: "T1G6",
      passengers: [
        {
          firstName: "Alice",
          lastName: "Brown",
          ticket: "2233445566",
          status: "Not-checked-in",
          bags: [{ bagId: "B100004", status: "Not loaded" }],
        },
      ],
    },
  ];

  // Message board state
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const handleLogout = () => navigate("/");

  const handleSelectGate = (gate) => {
    setSelectedGate(gate);
    const f = sampleFlights.find((f) => f.gate === gate);
    if (!f) {
      setFlight(null);
      setPassengers([]);
      return;
    }
    setFlight(f);
    setPassengers(f.passengers);
    setAllBoarded(false);
  };

  // Only allow boarding if all bags are loaded
  const handleBoardPassenger = (ticket) => {
    const passenger = passengers.find((p) => p.ticket === ticket);
    const allBagsLoaded = passenger.bags.every((b) => b.status === "Loaded");

    if (!allBagsLoaded) {
      alert(`Cannot board ${passenger.firstName} ${passenger.lastName}: Not all bags are loaded.`);
      return;
    }

    setPassengers((prev) =>
      prev.map((p) => (p.ticket === ticket ? { ...p, status: "Boarded" } : p))
    );
  };

  // Notify admin (also posts to message board)
  const handleNotifyAdmin = () => {
    const unboarded = passengers.filter((p) => p.status !== "Boarded");
    if (unboarded.length > 0) {
      alert("Not all passengers are boarded yet!");
      return;
    }
    setAllBoarded(true);

    const messageText = `Flight ${flight.flightNum} is ready to leave. Admin notified.`;
    setMessages([...messages, { sender: staffName || "Gate Staff", text: messageText, time: new Date().toLocaleTimeString() }]);

    alert(messageText);
  };

  // Send a general message to the board
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setMessages([...messages, { sender: staffName || "Gate Staff", text: newMessage, time: new Date().toLocaleTimeString() }]);
    setNewMessage("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Gate Staff Dashboard</h1>
      <h3>Logged in as: {staffName || "Gate Staff"}</h3>
      <button onClick={handleLogout} style={{ float: "right" }}>Logout</button>

      <div style={{ marginTop: "20px" }}>
        <label>Select Gate: </label>
        <select
          value={selectedGate}
          onChange={(e) => handleSelectGate(e.target.value)}
        >
          <option value="">--Choose Gate--</option>
          <option value="T1G5">T1G5</option>
          <option value="T1G6">T1G6</option>
        </select>
      </div>

      {selectedGate && flight && (
        <div style={{ marginTop: "20px" }}>
          <h2>Flight Info</h2>
          <p>Flight #: {flight.flightNum}</p>
          <p>Airline: {flight.airline}</p>
          <p>Destination: {flight.destination}</p>
          <p>Gate: {flight.gate}</p>

          <h3>Passengers</h3>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Ticket</th>
                <th>Status</th>
                <th>Bags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {passengers.map((p) => {
                const allBagsLoaded = p.bags.every((b) => b.status === "Loaded");
                return (
                  <tr key={p.ticket}>
                    <td>{p.firstName}</td>
                    <td>{p.lastName}</td>
                    <td>{p.ticket}</td>
                    <td>{p.status}</td>
                    <td>{p.bags.map((b) => `${b.bagId} (${b.status})`).join(", ")}</td>
                    <td>
                      {p.status === "Checked-in" && (
                        <button
                          onClick={() => handleBoardPassenger(p.ticket)}
                          disabled={!allBagsLoaded}
                          title={!allBagsLoaded ? "Cannot board: some bags not loaded" : ""}
                        >
                          Board
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <button
            onClick={handleNotifyAdmin}
            style={{ marginTop: "20px" }}
          >
            Notify Admin Flight Ready
          </button>

          {allBoarded && (
            <p style={{ color: "green", marginTop: "10px" }}>
              All passengers boarded! Flight ready.
            </p>
          )}

          {/* Message Board */}
          <div style={{ marginTop: "30px" }}>
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

      {selectedGate && !flight && <p>No flight assigned to this gate yet.</p>}
    </div>
  );
}

export default GateStaffDashboard;










  