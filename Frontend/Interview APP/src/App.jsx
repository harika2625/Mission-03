import { useState, useEffect, useRef } from "react";
import "./App.css";

const App = () => {
  const [role, setRole] = useState("");
  const [AIresponse, setAIResponse] = useState("");
  const [humanResponse, setHumanResponse] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const bottomRef = useRef(null); // Create a ref for the last chat entry

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setRole(newRole);

    // Clear chat history when the role changes
    if (newRole !== role) {
      setChatHistory([]); 
    }
  };

  const handleHumanResponseChange = (e) => {
    setHumanResponse(e.target.value);
  };

  const fetchAIResponse = async () => {
    if (!role) {
      alert("Please enter a job title");
      return; // Prevent further execution
    }

    // Create initial history with the role as "user" asking for the job title
    const updatedHistory = [
      ...chatHistory,
      {
        role: "user",
        parts: [{ text: role }],
      },
    ];

    setChatHistory(updatedHistory); // Update the chat history with the user response

    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat: role, // Send the job title
          history: updatedHistory, // Use the updated history
        }),
      });

      const data = await response.json();
      setAIResponse(data.text || "No response received");
    } catch (error) {
      console.error("Error:", error);
      setAIResponse("Error fetching response from the server");
    }
  };

  useEffect(() => {
    if (AIresponse) {
      // After the AI response is set, add it to the chat history
      setChatHistory((prevHistory) => [
        ...prevHistory,
        {
          role: "model",
          parts: [{ text: AIresponse }],
        },
      ]);
    }
  }, [AIresponse]); // run this effect when AIresponse changes

  useEffect(() => {
    // Scroll to the bottom whenever the chat history changes
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]); // runs when chatHistory is updated

  const handleSubmit = async () => {
    console.log("User Response:", humanResponse);

    if (!role) {
      alert("Please enter a job title");
      return; // Prevent further execution
    }

    if (!humanResponse) {
      alert("Please enter a response");
      return; // Prevent further execution
    }

    // Add the user response to the chat history
    const updatedHistory = [
      ...chatHistory,
      {
        role: "user",
        parts: [{ text: humanResponse }],
      },
    ];

    setChatHistory(updatedHistory); // Update the chat history

    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat: humanResponse, // Send the text from the user input
          history: updatedHistory, // Pass the updated history to the backend
        }),
      });

      const data = await response.json();
      setAIResponse(data.text || "No response received");
    } catch (error) {
      console.error("Error:", error);
      setAIResponse("Error fetching response from the server");
    }

    setHumanResponse(""); // Clear the human response input field
  };

  return (
    <div className="container">
      <h1>AI Mock Interviewer</h1>
      <div className="job-title">
        <p>Job Title:</p>
        <input
          type="text"
          placeholder="Enter Job Title"
          className="role"
          value={role}
          onChange={handleRoleChange}
        />
        <button onClick={fetchAIResponse} className="generateQ">
          Generate
        </button>
      </div>

      <div className="AI-response">
        {/* Iterate over chatHistory to display the full conversation */}
        {chatHistory.map((entry, index) => (
          <div key={index} className={`chat-entry ${entry.role}`}>
            <strong>{entry.role === "user" ? "Me" : "Interviewer"}: </strong>
            <span>{entry.parts[0].text}</span>
          </div>
        ))}
        {/* Reference to bottom of DIV to make scrolling work */}
        <div ref={bottomRef}></div>
      </div>

      <div className="human-response">
        <input
          className="response"
          type="text"
          placeholder="Type your response"
          value={humanResponse}
          onChange={handleHumanResponseChange}
        />
        <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default App;
