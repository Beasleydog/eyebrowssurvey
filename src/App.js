import "./App.css";
import { useState } from "react";
import Question from "./Question";
function App() {
  const images = ["./people/1.png", "./people/2.png"];
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const userId = Math.random().toString(36).substring(2, 15);
  function handleNextQuestion(data) {
    storeData(data, userId);
    setCurrentQuestion(currentQuestion + 1);
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
      {currentQuestion < images.length ? (
        <Question
          image={images[currentQuestion]}
          onSubmit={handleNextQuestion}
        />
      ) : (
        <Conclude />
      )}
    </div>
  );
}

function Conclude() {
  return <div>Thank you for participating!</div>;
}

export default App;
