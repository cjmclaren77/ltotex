import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";

const client = generateClient<Schema>();

function App() {
  const { signOut } = useAuthenticator();

  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Schema["Message"]["type"][]>([]);

  // Create message
  const handleSubmit = async () => {
    if (!userId.trim() || !message.trim()) return;

    await client.models.Message.create({
      userId,
      message,
      timestamp: new Date().toISOString(),
    });

    setMessage("");
    fetchMessages(); // Refresh list
  };

  // Fetch messages manually
  const fetchMessages = async () => {
    const result = await client.models.Message.list();
    setMessages(messages);
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>📝 Message App</h1>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Enter ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={{ padding: "0.5rem", marginRight: "0.5rem" }}
        />
        <input
          type="text"
          maxLength={180}
          placeholder="Enter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ padding: "0.5rem", width: "300px" }}
        />
        <button onClick={handleSubmit} style={{ marginLeft: "0.5rem" }}>
          Submit
        </button>
      </div>

      <button onClick={fetchMessages} style={{ marginBottom: "1rem" }}>
        Load Messages
      </button>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {messages.map((msg) => (
          <li key={msg.id} style={{ marginBottom: "1rem" }}>
            <strong>{msg.userId}:</strong> {msg.message} <br />
            <small>{new Date(msg.timestamp).toLocaleString()}</small>
          </li>
        ))}
      </ul>

      <button onClick={signOut} style={{ marginTop: "2rem", color: "red" }}>
        Sign Out
      </button>
    </main>
  );
}

export default App;
