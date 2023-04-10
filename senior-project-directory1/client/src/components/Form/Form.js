import React, { useState } from 'react';
import './FormOther.css';

function Form() {
  const [completedClasses, setCompletedClasses] = useState([]);
  const [plannedClasses, setPlannedClasses] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [day, setDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

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

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>Student Information</h1>
        <p>Enter your courses and planned courses, and any schedule conflicts.</p>
      </div>
      <div className="form-steps">
        <form onSubmit={handleSubmit}>
          <h4 htmlFor="completed-classes">Completed Classes:</h4>
          <div className="class-inputs">
            <input type="text" id="completed-classes" placeholder="e.g. Digital Circuits" />
            <button onClick={handleAddCompletedClass}>Add</button>
          </div>
          <ul className="class-list">
            {completedClasses.map((classInput, index) => (
              <li key={index}>{classInput}</li>
            ))}
          </ul>
          <h4 htmlFor="planned-classes">Planned Classes:</h4>
          <div className="class-inputs">
            <input type="text" id="planned-classes" placeholder="e.g. Senior Project" />
            <button onClick={handleAddPlannedClass}>Add</button>
          </div>
          <ul className="class-list">
            {plannedClasses.map((classInput, index) => (
              <li key={index}>{classInput}</li>
            ))}
          </ul>
          <h4 htmlFor="conflicts">Schedule Conflicts:</h4>
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
        <span> - {'  '}  </span>
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
      <button type="submit" className="submit-button">
        Submit
      </button>
    </form>
  </div>
</div>
);
}

export default Form;
