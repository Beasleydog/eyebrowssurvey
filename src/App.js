import "./App.css";
import { useState } from "react";
import Question from "./Question";

function App() {
  const images = [
    "/people/man0.png",
    "/people/woman0.png",
    "/people/man1.png",
    "/people/woman1.png",
    "/people/man2.png",
    "/people/woman2.png",
    "/people/man3.png",
    "/people/woman3.png",
    "/people/man4.png",
    "/people/woman4.png",
    "/people/man5.png",
    "/people/woman5.png",
    "/people/man6.png",
    "/people/woman6.png",
    "/people/man7.png",
    "/people/woman7.png",
    "/people/man8.png",
    "/people/woman8.png",
    "/people/man9.png",
    "/people/woman9.png",
    "/people/man10.png",
    "/people/woman10.png",
    "/people/man11.png",
    "/people/woman11.png",
    "/people/man12.png",
    "/people/woman12.png",
    "/people/man13.png",
    "/people/woman13.png",
    "/people/man14.png",
    "/people/woman14.png",
    "/people/man15.png",
    "/people/woman15.png",
    "/people/man16.png",
    "/people/woman16.png",
    "/people/man17.png",
    "/people/woman17.png",
    "/people/man18.png",
    "/people/woman18.png",
    "/people/man19.png",
    "/people/woman19.png",
    "/people/man20.png",
    "/people/woman20.png",
  ];

  const [currentQuestion, setCurrentQuestion] = useState(-1);
  const userId = Math.random().toString(36).substring(2, 15);

  function handleNextQuestion(data) {
    storeData(data, userId);
    setCurrentQuestion(currentQuestion + 1);
  }

  function startSurvey() {
    setCurrentQuestion(0);
  }

  async function storeData(data, userId) {
    try {
      const encodedUserId = encodeURIComponent(userId);
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxO1tjyeciuYlsEiuhOQ2Tfl3hah_kJDFRx9F_-xhk117Xd52EdoQigIV-DX35Un9yvHw/exec?userId=" +
          encodedUserId,
        {
          method: "POST",
          redirect: "follow",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Error storing data:", error);
    }
  }

  return (
    <div className="App">
      {currentQuestion === -1 ? (
        <Instructions onStart={startSurvey} />
      ) : currentQuestion < images.length ? (
        <Question
          key={currentQuestion}
          image={`${process.env.PUBLIC_URL}${images[currentQuestion]}`}
          onSubmit={handleNextQuestion}
        />
      ) : (
        <Conclude />
      )}
    </div>
  );
}

function Instructions({ onStart }) {
  return (
    <div className="instructions-page">
      <h1>Eyebrows Survey</h1>
      <div className="instructions-content">
        <p>
          Welcome! In this survey, you'll be shown a series of photographs and
          asked to guess when each one was taken.
        </p>
        <h2>How it works:</h2>
        <ol>
          <li>
            <strong>Identify Key Features:</strong> Click on any features in the
            photo that stand out or helps you determine its age.
          </li>
          <li>
            <strong>Explain Your Reasoning:</strong> For each feature you click,
            explain why it suggests a particular time period
          </li>
          <li>
            <strong>Date Indicators:</strong> Use the &lt;, =, &gt; buttons to
            specify if a feature suggests the photo was taken:
            <ul>
              <li>
                &lt; <em>before</em> a specific year
              </li>
              <li>
                = <em>exactly in</em> a specific year
              </li>
              <li>
                &gt; <em>after</em> a specific year
              </li>
            </ul>
          </li>
          <li>
            <strong>Final Guess:</strong> Use the slider to make your final
            guess about when the photo was taken
          </li>
          <li>
            <strong>Confidence Rating:</strong> Rate how confident you are in
            your guess from 1-10
          </li>
        </ol>
        <button className="start-button" onClick={onStart}>
          Start Survey
        </button>
      </div>
    </div>
  );
}

function Conclude() {
  return (
    <div className="conclude-page">
      <h1>Thank you for participating!</h1>
      <p>
        Your responses will help us understand how people determine the age of
        photographs.
      </p>
    </div>
  );
}

export default App;
