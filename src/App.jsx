import React, { useState, useEffect } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    if (isLoggedIn) {
      fetch("/api/schedule")
        .then((res) => res.json())
        .then((data) => setSchedule(data))
        .catch(() => alert("Failed to load schedule"));
    }
  }, [isLoggedIn]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "yourpassword") {
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  const handleSchedule = (e) => {
    e.preventDefault();
    if (!name || !datetime) {
      alert("Please enter both name and date/time");
      return;
    }

    fetch("/api/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, datetime }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network response not OK");
        return res.json();
      })
      .then((newEntry) => {
        setSchedule((prev) => [...prev, newEntry]);
        setName("");
        setDatetime("");
      })
      .catch(() => alert("Failed to save schedule"));
  };

  if (!isLoggedIn) {
    return (
      <div style={{ padding: "2rem", maxWidth: 400, margin: "auto" }}>
        <h2>Please Log In</h2>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", fontSize: "1rem" }}
          />
          <button
            type="submit"
            style={{
              marginTop: "1rem",
              width: "100%",
              padding: "0.5rem",
              fontSize: "1rem",
            }}
          >
            Log In
          </button>
        </form>
        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: 500, margin: "auto" }}>
      <h1>Welcome to the Scheduling App!</h1>

      <form onSubmit={handleSchedule} style={{ marginTop: "2rem" }}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: "0.5rem", width: "100%", marginBottom: "1rem" }}
        />
        <input
          type="datetime-local"
          value={datetime}
          onChange={(e) => setDatetime(e.target.value)}
          style={{ padding: "0.5rem", width: "100%", marginBottom: "1rem" }}
        />
        <button type="submit" style={{ padding: "0.5rem", width: "100%" }}>
          Submit Schedule
        </button>
      </form>

      <ul style={{ marginTop: "2rem", textAlign: "left" }}>
        {schedule.map((entry, index) => (
          <li key={index}>
            <strong>{entry.name}</strong> scheduled for{" "}
            {new Date(entry.datetime).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;





