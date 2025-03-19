import { useState } from "react";
import "./App.css";
import Markdown from "react-markdown";

const App = () => {
  const [role, setRole] = useState("");
  const [AIresponse, setAIResponse] = useState("");
  const [humanResponse, setHumanResponse] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };
  const handleHumanResponseChange = (e) => {
    setHumanResponse(e.target.value);
  };

  const fetchAIResponse = async () => {
    if (!role) {
      alert("Please enter a job title");
      return; // Prevent further execution
    }
  
    //add the human response to the chat history
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
          history: updatedHistory,
        }),
      });
  
      const data = await response.json();
      setAIResponse(data.text || "No response received");
      } catch (error) {
      console.error("Error:", error);
      setAIResponse("Error fetching response from the server");
    }
  };

  const handleSubmit = async () => {
    console.log("User Response:", humanResponse);

    if (!role) {
      alert("Please enter a job title");
      return; // Prevent further execution
    }

    if (!humanResponse){
      alert("Please enter a response");
      return; // Prevent further execution
    }
  
    //add the human response to the chat history
    const updatedHistory = [
      ...chatHistory,
      {
        role: "user",
        parts: [{ text: humanResponse }],
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
          chat: humanResponse, // Send the text from the human response input
          history: chatHistory, // Pass an empty history for now (can be updated later)
        }),
      });
  
      const data = await response.json();
      setAIResponse(data.text || "No response received");
      
    // After receiving the AI's response, add it to the chat history
    setChatHistory([
      ...updatedHistory,
      {
        role: "model",
        parts: [{ text: AIresponse }],
      },
    ]);
    
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
          Generate Q
        </button>
      </div>

      <div className="AI-response">
        <Markdown>
        {/* this will use a plugin to automatically format the markdown generated text to readable format */}
          # AI Response
        </Markdown>
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
