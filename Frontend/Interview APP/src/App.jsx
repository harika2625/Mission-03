import "./App.css";
import Markdown from "react-markdown";

const App = () => {
  return (
    <div className="container">
      <h1>AI Mock Interviewer</h1>
      <div className="job-title">
        <p>Job Title:</p>
        <input type="textarea" placeholder="Job Title" className="role" />
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
          placeholder="type your response"
        />
        <button type="submit">Submit</button>
      </div>
    </div>
  );
};

export default App;
