require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());


// ---- Google Generative AI ----
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-lite",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};


/** 
 * POST method route for normal chat.
 * A chat message and the history of the conversation are send to the Gemini 
 * model. The complete response generated by the model to the posted message 
 * will be returned in the API's response.
 * 
 * Expects a JSON payload in the request with the following format:
 * Request:
 *   chat: string,
 *   history: Array
 *
 * Returns a JSON payload containing the model response with the 
 * following format:
 * Response:
 * 	text: string
 */

app.post("/chat", async (req, res) => {
  /** Read the request data. */
  const chatHistory = req.body.history || [];
  const msg = req.body.chat;

  console.log("User input", msg); //log the user chat input
  

  /** Gemini API configuration settings */
  const parts = [
    {text: "The model is acting as an interviewer for an organisation. The first message the model will receive will be a job title, from there the interviewer should start with the question 'tell me a bit about yourself'. Upon recieving this information the model should then ask one follow up question, that an interviewer might as in an interview. This will occur six times for six questions. Upon conclusion of the 6 questions, not prior, the model should provide some feedback about how the interviewee went. This should be clear and relatively conscise."},
    {text: "input: software engineer"},
    {text: "output: Tell me a bit about yourself"},
    {text: "input: A bit about myself is that I have a passion for IT, and have been studying software engineering for the past 6 months - focusing on React, Javascript, Node, Express."},
    {text: "output: That's great to hear! Since you've focused on React, JavaScript, Node, and Express, can you describe a specific project where you utilized these technologies and what challenges you faced?"},
    {text: "input: I often work in group projects and have to work with a variety of people, and different languages. I utilise github to do this."},
    {text: "output: That's a good approach. How do you typically handle conflicting opinions or approaches within a group project setting?"},
    {text: "input: I take a collaborative response to conflict, and try to come to an agreement between parties that sees all persons satisfied."},
    {text: "output: That's a valuable skill. Now, thinking about your past experiences, can you describe a time you had to learn a new technology or skill quickly to meet a project deadline?"},
    {text: "input: During a class at university I had a week to implement generative AI into a chatbot project, prior to this I had never used any AI models. This was challenging but rewarding seeing the final product."},
    {text: "output: That sounds like a great learning experience. What resources did you find most helpful in learning generative AI in such a short timeframe?"},
    {text: "input: I utilised YouTube tutorials, as well as stack overflow and the API documentation."},
    {text: "output: That's resourceful! Let's switch gears a bit. Can you describe a time you made a mistake at work or during a project and what you learned from it?"},
    {text: "input: In an early solo project I spent a lot of time on an element that I had coded wrongly. It wasn't until a few days in that I noticed my error, and realised that changing the approach tactic would make the code easier in the long run - so I revamped my code."},
    {text: "output: That's a great example of problem-solving and adaptability. To build on that, how do you ensure you're writing maintainable and readable code so that future errors are less likely?"},
    {text: "input: I utilise generative AI in some of my coding to help find errors as I am generating my code. I also participate in peer code reviews, and try to write simplistic and easy to follow code."},
    {text: "output: That's a smart approach! For my last question: How do you stay up-to-date with the latest trends and technologies in software engineering?\n\ninput: I regularly watch YouTube videos, and read articles to stay abreast of the current technologies.\noutput:\n\nOkay, that concludes the interview questions.\n\n**Feedback:**\n\nOverall, you presented yourself well and demonstrated a good understanding of software engineering principles. You highlighted your experience with relevant technologies like React, JavaScript, Node, and Express, which is a definite plus. Your answers showcased your ability to work in teams, resolve conflicts collaboratively, learn quickly, and adapt to challenges. You also highlighted a willingness to learn from mistakes and write clean code.\n\nAreas for improvement might include providing more specific details in your project examples. Quantifying your contributions whenever possible (e.g., \"improved performance by X%\") can make your answers even more impactful. Keep practicing articulating your experiences with concrete examples and focusing on the results you achieved. Good luck with your job search!"},
    {text: "input: builder"},
    {text: "output: Tell me a bit about yourself."},
    {text: "input: I like to build houses."},
    {text: "output: That's great! What specifically do you enjoy most about building houses?"},
    {text: "input: I like to construct things with my hands."},
    {text: "output: I see. Can you describe a particularly challenging building project you worked on and how you overcame the obstacles?"},
    {text: "input: I worked on a large house and this was challenging because a lot of other people were involved and we had to work together as a team."},
    {text: "output: That's a common challenge in construction. How did you ensure effective communication and collaboration within the team to stay on schedule and within budget?"},
    {text: "input: I follow what my project manager suggests for schedules and budgets."},
    {text: "output: That's a good approach. Can you give me an example of a time you had to deviate from the project manager's plan due to unforeseen circumstances, and how you handled it?"},
    {text: "input: I cannot give an example of deviating from the project manager's plans."},
    {text: "output: Understood. Let's try a different angle. Could you describe your process for ensuring the structural integrity and safety of a building you're working on?\n\ninput: I ensure I use appropriate materials.\noutput:\n\nOkay, that concludes the interview questions.\n\n**Feedback:**\n\nOverall, you express a clear interest in the hands-on aspects of building. Highlighting your enjoyment of constructing things is a good starting point. However, your responses were often quite brief and lacked specific details.\n\nTo improve, focus on providing more concrete examples and demonstrating a deeper understanding of the construction process. When describing challenges, elaborate on the specific obstacles and the steps you took to overcome them. It would also be beneficial to showcase your knowledge of construction safety, regulations, and problem-solving skills beyond simply following instructions. Quantifiable results could further strengthen your answers. Keep practicing articulating your experiences with concrete examples and focusing on the results you achieved. Good luck with your job search!"},
    {text: "input: "},
    {text: "output: "},
  ];

  
  /** Initialize the chat with the chat history and predefined parts */
  
  const fullChat = [
    [{ role: "user", parts }], // Add the predefined parts to the chat
    ...chatHistory, // Add the chat history to the chat
    { role: "user", parts: [{ text: msg }] },
  ]

  const result = await model.generateContent({
    contents: fullChat, 
    generationConfig,
  });


  /** Send the message posted by the user to the Gemini model and read the response generated by the model.*/

  const response = await result.response;
  const text = response.text();

  /** Send the response returned by the model as the API's response. */
  res.send({"text":text});

  console.log(result.response.text());
});



app.get("/", (req, res) => {
  res.send("Hello, World!");
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
