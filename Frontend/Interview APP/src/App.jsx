import { useState, useEffect, useRef } from "react";
import "./App.css";
import Markdown from 'react-markdown';

const App = () => {
  const [role, setRole] = useState("");
  const [AIresponse, setAIResponse] = useState("");
  const [humanResponse, setHumanResponse] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false); 
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

    setLoading(true); // Set loading to true while fetching AI response

    const updatedHistory = [
      ...chatHistory,
      {
        role: "user",
        parts: [{ text: role }],
      },
    ];

    setChatHistory(updatedHistory); 

    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat: role,
          history: updatedHistory,
        }),
      });

      const data = await response.json();
      setAIResponse(data.text || "No response received");
    } catch (error) {
      console.error("Error:", error);
      setAIResponse("Error fetching response from the server");
    } finally {
      setLoading(false); // Reset loading after fetching response
    }
  };

  useEffect(() => {
    if (AIresponse) {
      setChatHistory((prevHistory) => [
        ...prevHistory,
        {
          role: "model",
          parts: [{ text: AIresponse }],
        },
      ]);
    }
  }, [AIresponse]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const handleSubmit = async () => {
    if (!role) {
      alert("Please enter a job title");
      return;
    }

    if (!humanResponse) {
      alert("Please enter a response");
      return;
    }

    setLoading(true); // Set loading to true while fetching AI response

    const updatedHistory = [
      ...chatHistory,
      {
        role: "user",
        parts: [{ text: humanResponse }],
      },
    ];

    setChatHistory(updatedHistory); 

    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat: humanResponse,
          history: updatedHistory,
        }),
      });

      const data = await response.json();
      setAIResponse(data.text || "No response received");
    } catch (error) {
      console.error("Error:", error);
      setAIResponse("Error fetching response from the server");
    } finally {
      setLoading(false); // Reset loading after fetching response
    }

    setHumanResponse(""); 
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
        <button 
          onClick={fetchAIResponse} 
          className={`generateQ ${loading && 'loading'}`} 
          disabled={loading} // Disable button when loading
        >
          Generate
        </button>
      </div>

      <div className="AI-response">
        {/* Iterate over chatHistory to display the full conversation */}        
        {chatHistory.map((entry, index) => (
          <div key={index} className={`chat-entry ${entry.role}`}>
            <strong>{entry.role === "user" ? "Me" : "Interviewer"}: </strong>
            <span><Markdown>{entry.parts[0].text}</Markdown></span>
          </div>
        ))}
        {/* reference to the bottom of chat box for auto-scrolling feature*/}
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
        <button 
          type="submit" 
          onClick={handleSubmit} 
          className={`submit ${loading && 'loading'}`} 
          disabled={loading} // Disable button when loading
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default App;
