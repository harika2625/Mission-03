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
    }
    try {
      const response = await fetch("http://localhost:3000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `Generate an interview question for a ${role} role.`,
        }),
      });
      const data = await response.json();
      setAIResponse(data.answer || "No response received");
    } catch (error) {
      console.log("Error:", error);
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
