import "./Question.css";
import { useState, useRef, useEffect } from "react";

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function Question({ image, onSubmit, currentStep = 1, totalSteps = 8 }) {
  const initialYear = new Date().getFullYear();
  const initialConfidence = 5;

  const [dots, setDots] = useState([]);
  const [comments, setComments] = useState([]);
  const [year, setYear] = useState(initialYear);
  const [confidence, setConfidence] = useState(initialConfidence);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    setDots([]);
    setComments([]);
    setYear(initialYear);
    setConfidence(initialConfidence);
  }, [image]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const color = getRandomColor();
    setDots([...dots, { x, y, color }]);
    setComments([...comments, ""]);
  };

  const handleCommentChange = (index, value) => {
    const newComments = [...comments];
    newComments[index] = value;
    setComments(newComments);
  };

  const handleDeleteComment = (index) => {
    const newDots = dots.filter((_, i) => i !== index);
    const newComments = comments.filter((_, i) => i !== index);
    setDots(newDots);
    setComments(newComments);
  };

  const handleSubmit = () => {
    const data = {
      image,
      yearGuess: year,
      confidence,
      points: dots.map((dot, index) => ({
        ...dot,
        comment: comments[index],
      })),
    };
    onSubmit(data);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = image;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Draw the image
      dots.forEach((dot) => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 10, 0, 2 * Math.PI); // Increase the radius to make the dot bigger
        ctx.fillStyle = dot.color;
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)"; // Set shadow color
        ctx.shadowBlur = 10; // Set shadow blur
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow blur to avoid affecting other drawings
      });
    };
  }, [dots, image]);

  return (
    <div className="questionContainer">
      <div className="imageAndComments">
        <div className="imageContainer" onClick={handleCanvasClick}>
          <canvas
            width={500}
            height={500}
            ref={canvasRef}
            className="dotCanvas"
          />
        </div>
        <div className="commentsContainer">
          {comments.length === 0 ? (
            <div className="emptyStateMessage">
              Click anywhere on the image to add a point and leave a comment
            </div>
          ) : (
            comments.map((comment, index) => (
              <div key={index} className="commentItem">
                <div
                  className="dotColor"
                  style={{
                    backgroundColor: dots[index].color,
                  }}
                ></div>
                <textarea
                  value={comment}
                  onChange={(e) => handleCommentChange(index, e.target.value)}
                  placeholder={`Comment ${index + 1}`}
                  className="commentTextarea"
                />
                <button
                  className="delete"
                  onClick={() => handleDeleteComment(index)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="sliderControls">
        <div className="yearSliderContainer">
          <label htmlFor="yearSlider">Year Estimate:</label>
          <input
            id="yearSlider"
            type="range"
            min="1980"
            max={new Date().getFullYear()}
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="yearSlider"
          />
          <span className="yearLabel">{year}</span>
        </div>
        <div className="confidenceContainer">
          <label htmlFor="confidenceSlider">Confidence:</label>
          <input
            id="confidenceSlider"
            type="range"
            min="1"
            max="10"
            value={confidence}
            onChange={(e) => setConfidence(e.target.value)}
            className="confidenceSlider"
          />
          <span className="confidenceLabel">{confidence}/10</span>
        </div>
        <button onClick={handleSubmit} className="submitButton">
          Next ({currentStep}/{totalSteps})
        </button>
      </div>
    </div>
  );
}

export default Question;
