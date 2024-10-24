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

function Question({ image, onSubmit }) {
  const [dots, setDots] = useState([]);
  const [comments, setComments] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [confidence, setConfidence] = useState(5);
  const canvasRef = useRef(null);

  useEffect(() => {
    setDots([]);
    setComments([]);
    setYear(new Date().getFullYear());
    setConfidence(5);
  }, [image]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const color = getRandomColor();
    setDots([...dots, { x, y, color, year: "", comparison: "=" }]);
    setComments([...comments, ""]);
  };

  const handleCommentChange = (index, value) => {
    const newComments = [...comments];
    newComments[index] = value;
    setComments(newComments);
  };

  const handleYearChange = (index, value) => {
    const newDots = [...dots];
    newDots[index].year = value;
    setDots(newDots);
  };

  const handleComparisonChange = (index, value) => {
    const newDots = [...dots];
    newDots[index].comparison = value;
    setDots(newDots);
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
      <p className="instructions">
        Click on the image to add a dot on any key feature. Explain what stood
        out about it in the text box. Use the date input to show how it impacts
        your perception of the overall date. Use the &lt;, =, &gt; buttons to
        indicate if the dot made you think the image was before, exactly, or
        after a certain year (e.g., if the dot made you think the image was
        after 2000, you would click &gt; and type 2000). Then choose the overall
        date with the slider, input your confidence, and click submit.
      </p>
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
          {comments.map((comment, index) => (
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
              <div className="dateOptions">
                <div className="comparisonButtons">
                  <button
                    onClick={() => handleComparisonChange(index, "<")}
                    className={dots[index].comparison === "<" ? "active" : ""}
                  >
                    &lt;
                  </button>
                  <button
                    onClick={() => handleComparisonChange(index, ">")}
                    className={dots[index].comparison === ">" ? "active" : ""}
                  >
                    &gt;
                  </button>
                  <button
                    onClick={() => handleComparisonChange(index, "=")}
                    className={dots[index].comparison === "=" ? "active" : ""}
                  >
                    =
                  </button>
                </div>
                <input
                  type="number"
                  value={dots[index].year}
                  onChange={(e) => handleYearChange(index, e.target.value)}
                  placeholder="Year"
                  className="yearInput"
                />
              </div>
              <button onClick={() => handleDeleteComment(index)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
      <div className="yearSliderContainer">
        <label htmlFor="yearSlider">Your Guess of the Year:</label>
        <input
          id="yearSlider"
          type="range"
          min="1900"
          max={new Date().getFullYear()}
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="yearSlider"
        />
        <span className="yearLabel">{year}</span>
      </div>
      <div className="confidenceContainer">
        <label htmlFor="confidenceSlider">Confidence (1-10):</label>
        <input
          id="confidenceSlider"
          type="range"
          min="1"
          max="10"
          value={confidence}
          onChange={(e) => setConfidence(e.target.value)}
          className="confidenceSlider"
        />
        <span className="confidenceLabel">{confidence}</span>
      </div>
      <button onClick={handleSubmit} className="submitButton">
        Submit
      </button>
    </div>
  );
}

export default Question;
