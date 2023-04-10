import React, { useState } from 'react';
import './FormOther.css';

function Form() {
  const [completedClasses, setCompletedClasses] = useState([]);
  const [plannedClasses, setPlannedClasses] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [day, setDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
//added
  const [step, setStep] = useState(1); // state to keep track of the current step
//done
 const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Completed classes:', completedClasses);
    console.log('Planned classes:', plannedClasses);
    console.log('Conflicts:', conflicts);
    console.log('Day:', day);
    console.log('Start time:', startTime);
    console.log('End time:', endTime);
  };

  const handleAddCompletedClass = (event) => {
    event.preventDefault();
    const input = event.target.previousElementSibling;
    const classInput = input.value.trim();
    if (classInput) {
      setCompletedClasses([...completedClasses, classInput]);
      input.value = '';
    }
  };

  const handleAddPlannedClass = (event) => {
    event.preventDefault();
    const input = event.target.previousElementSibling;
    const classInput = input.value.trim();
    if (classInput) {
      setPlannedClasses([...plannedClasses, classInput]);
      input.value = '';
    }
  };

  const handleAddConflict = (event) => {
    event.preventDefault();
    const conflictInput = `${day}, ${startTime} - ${endTime}`;
    if (day && startTime && endTime) {
      setConflicts([...conflicts, conflictInput]);
      setDay('');
      setStartTime('');
      setEndTime('');
    }
  };
//added
  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const renderStepOne = () => {//done
  return (
    <div>
    <div className="form-container">
      <div className="form-header">
        <h4>Step 1</h4>
        <p>Add your completed courses</p>
      </div>
      <div className="form-steps">
        <form onSubmit={handleSubmit}>
          <h5 htmlFor="completed-classes">Courses Complete:</h5>
          <div className="class-inputs">
            <input type="text" id="completed-classes" placeholder="e.g. Digital Circuits" />
            <button onClick={handleAddCompletedClass}>Add</button>
          </div>
          <ul className="class-list">
            {completedClasses.map((classInput, index) => (
              <li key={index}>{classInput}</li>
            ))}
          </ul>
          {/*added*/ }
          <button type="submit" className="submit-button" onClick={handleNext}>
        Next
      </button>
      </form>
      </div>
      </div>
      </div>
    );
  }



    const renderStepTwo = () => {
    return (
    <>           {/*added*/ }
        <div className="form-container">
      <div className="form-header">
            <h4>Step 2</h4>
        <p>Add your needed courses</p>
        </div><br></br>
          <h5 htmlFor="planned-classes">Courses Needed:</h5>
          <div className="class-inputs">
            <input type="text" id="planned-classes" placeholder="e.g. Senior Project" />
            <button onClick={handleAddPlannedClass}>Add</button>
          </div>
          <ul className="class-list">
            {plannedClasses.map((classInput, index) => (
              <li key={index}>{classInput}</li>
            ))}
          </ul>
          <div>
          <button type="submit" className="submit-button" onClick={handleBack}>
        Back
      </button>
      <button type="submit" className="submit-button" onClick={handleNext}>
        Next
      </button>
      </div>
      </div>
      </>
    );
  }; 


    const renderStepThree = () => {
    return (
    <> 
            <div className="form-container">
      <div className="form-header"></div>
              <h4>Step 3</h4><br></br>
        <p>Add your schedule conflicts</p>
        </div>
          <h5 htmlFor="conflicts">Schedule Conflicts:</h5>
          <div className="conflict-inputs">
            <select value={day} onChange={(event) => setDay(event.target.value)}>
              <option value="">Select day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
          <option value="Sunday">Sunday</option>
        </select>
        <input
          type="time"
          value={startTime}
          onChange={(event) => setStartTime(event.target.value)}
        />
        <span>-</span>
        <input
          type="time"
          value={endTime}
          onChange={(event) => setEndTime(event.target.value)}
        />
        <button onClick={handleAddConflict}>Add</button>
      </div>
      <ul className="conflict-list">
        {conflicts.map((conflictInput, index) => (
          <li key={index}>{conflictInput}</li>
        ))}
      </ul>
      <div>
      <button type="submit" className="submit-button" onClick={handleBack}>
        Back
      </button>
<button type="submit" className="submit-button" onClick={handleNext}>
        Next
      </button>
      </div>


      </>
);
}

const renderStepFour = () => {
return (
<>
<br></br>
<h4>Step 4</h4><br></br>
        <p>Review</p><br></br>
  <div className="review-container">
    <div className="review-list">
      <div className="review-list-section">
        <h4>Completed Classes:</h4>
        <ul>
          {completedClasses.map((classInput, index) => (
            <li key={index}>{classInput}</li>
          ))}
        </ul>
      </div>
    </div>
    <div className="review-list">
      <div className="review-list-section">
        <h4>Planned Classes:</h4>
        <ul>
          {plannedClasses.map((classInput, index) => (
            <li key={index}>{classInput}</li>
          ))}
        </ul>
      </div>
    </div>
    <div className="review-list">
      <div className="review-list-section">
        <h4>Schedule Conflicts:</h4>
        <ul>
          {conflicts.map((conflict, index) => (
            <li key={index}>{conflict}</li>
          ))}
          </ul>
      </div>
    </div>
  </div>
  <div>
    <button type="submit" className="submit-button" onClick={handleBack}>
      Back
    </button>
    <button type="submit" className="submit-button">
      Submit
    </button>
  </div>
</>
);
};

 return (
   <div className="form-container">
   <h6>Course Planner</h6>
   <form onSubmit={handleSubmit}>
   {step === 1 && renderStepOne()}
   {step === 2 && renderStepTwo()}
   {step === 3 && renderStepThree()}
   {step === 4 && renderStepFour()}
   </form>
   </div>
   );
}
  

export default Form;
