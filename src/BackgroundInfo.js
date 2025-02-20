import React, { useState } from "react";
import "./BackgroundInfo.css";

function BackgroundInfo({ onSubmit }) {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    race: [],
    fashionKnowledge: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "race") {
      const newRaces = [...formData.race];
      if (e.target.checked) {
        newRaces.push(value);
      } else {
        const index = newRaces.indexOf(value);
        if (index > -1) {
          newRaces.splice(index, 1);
        }
      }
      setFormData((prev) => ({
        ...prev,
        race: newRaces,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      race: formData.race.join(", "),
    };
    onSubmit(submissionData);
  };

  return (
    <div className="background-info">
      <h1>Background Information</h1>
      <p>
        Please provide some information about yourself before starting the
        survey.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            name="age"
            min="0"
            max="120"
            required
            value={formData.age}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            name="gender"
            required
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="nonbinary">Non-binary</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
        </div>

        <div className="form-group">
          <label>Race/Ethnicity (select all that apply):</label>
          <div className="checkbox-group">
            {[
              { value: "asian", label: "Asian" },
              { value: "black", label: "Black or African American" },
              { value: "hispanic", label: "Hispanic or Latino" },
              { value: "white", label: "White" },
              { value: "native", label: "Native American or Alaska Native" },
              {
                value: "pacific",
                label: "Native Hawaiian or Pacific Islander",
              },
              { value: "multiple", label: "Multiple races" },
              { value: "other", label: "Other" },
              { value: "prefer_not_to_say", label: "Prefer not to say" },
            ].map((option) => (
              <div
                key={option.value}
                className="checkbox-item"
                style={{ display: "flex", flexDirection: "row" }}
              >
                <input
                  type="checkbox"
                  id={option.value}
                  name="race"
                  value={option.value}
                  checked={formData.race.includes(option.value)}
                  onChange={handleChange}
                />
                <label htmlFor={option.value}>{option.label}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="fashionKnowledge">
            How would you rate your knowledge of current beauty trends?
          </label>
          <p style={{ margin: "10px", marginLeft: "-20px" }}>
            (this includes the current trends in fashion, makeup, hair,
            eyebrows, accessories)
          </p>
          <select
            id="fashionKnowledge"
            name="fashionKnowledge"
            required
            value={formData.fashionKnowledge}
            onChange={handleChange}
          >
            <option value="">Select level</option>
            <option value="very-limited">
              Very Limited - I rarely notice trends and don't follow any fashion
              content
            </option>
            <option value="basic">
              Basic - I notice major trends but don't actively follow fashion
            </option>
            <option value="moderate">
              Moderate - I follow some fashion content and generally know what's
              in style
            </option>
            <option value="good">
              Good - I actively follow trends and can spot when styles become
              outdated
            </option>
            <option value="expert">
              Expert - I closely follow fashion/beauty trends and notice subtle
              style changes as they happen
            </option>
          </select>
        </div>

        <button type="submit" className="submit-button">
          Begin
        </button>
      </form>
    </div>
  );
}

export default BackgroundInfo;
