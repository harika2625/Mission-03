import { useState } from "react";
import "./App.css";

const App = () => {
  const [role, setRole] = useState("");
  const [AIresponse, setAIResponse] = useState("");
  const [humanResponse, setHumanResponse] = useState("");

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };
  const handleHumanResponseChange = (e) => {
    setHumanResponse(e.target.value);
  };
  const handleSubmit = () => {
    console.log("User Response:", humanResponse);
    setHumanResponse("");
  };

  const fetchAIResponse = async () => {
    if (!role) {
      alert("Please enter a job title");
      return; // Prevent further execution
    }
  
    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat: role, // Send the job title
          history: [], // Pass an empty history for now (can be updated later)
        }),
      });
  
      const data = await response.json();
      setAIResponse(data.text || "No response received");
    } catch (error) {
      console.error("Error:", error);
      setAIResponse("Error fetching response from the server");
    }
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
          Generate Q
        </button>
      </div>
      <div className="AI-response">
        <p>AI Question:{AIresponse}</p>
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
