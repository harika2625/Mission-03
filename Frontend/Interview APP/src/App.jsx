import "./App.css";

const App = () => {
  return (
    <div className="container">
      <h1>AI Mock Interviewer</h1>
      <div className="job-title">
        <p>Job Title:</p>
        <input type="textarea" placeholder="Job Title" className="role" />
      </div>
      <input className="AI-response" />
      <div className="human-response">
        <input
          className="response"
          type="text"
          placeholder="type your response"
        />
        <button type="submit">Submit</button>
      </div>
    </div>
  );
};

export default App;
