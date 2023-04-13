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

  const handleRemoveCompletedClass = (classInput) => {
    setCompletedClasses((prevClasses) => {
      const newClasses = prevClasses.filter((c) => c !== classInput);
      return newClasses;
    });
  };

  const handleRemovePlannedClass = (index) => {
    setPlannedClasses((prevClasses) => {
      const newClasses = [...prevClasses];
      newClasses.splice(index, 1);
      return newClasses;
    });
  };

  const handleRemoveConflict = (index) => {
    setConflicts((prevConflicts) => {
      const newConflicts = [...prevConflicts];
      newConflicts.splice(index, 1);
      return newConflicts;
    });
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
    <>
        <div className="formContainer">
          
          <div className="form-header">
          <form1>
        <h2>Step 1</h2>
        </form1>
            <p>Add your completed courses</p>
            </div>
      <div className="form-steps">
        <form onSubmit={handleSubmit}>
          
          <div className="class-inputs">
            <input type="text" id="completed-classes" placeholder="e.g. Digital Circuits" />
            <button onClick={handleAddCompletedClass}>Add</button>
          </div>
          <ul className="class-list">
              {completedClasses.map((classInput) => (
                <div className="class-listing" key={classInput}>
                  <li>
                    {classInput}
                    <button onClick={() => handleRemoveCompletedClass(classInput)}>Remove</button>
                  </li>
                </div>
              ))}
            
          </ul>
          {/*added*/ }
          <div className='div420'>
          <button type="submit" className="submit-button" onClick={handleNext}>
        Next
      </button>
      </div>
      </form>
      </div>
      <br></br><br></br>
      </div>
      </>
    );
  }



    const renderStepTwo = () => {
    return (
    <>           {/*added*/ }
        <div className="formContainer">
          
      <div className="form-header">
      <form1>
    <h2>Step 2</h2>
    </form1>
        <p>Add your needed courses</p>
        </div>
        <div className="form-steps">
          
          <div className="class-inputs">
            <input type="text" id="planned-classes" placeholder="e.g. Senior Project" />
            <button onClick={handleAddPlannedClass}>Add</button>
          </div>
          <ul className="class-list">
            {plannedClasses.map((classInput, index) => (
              <div className="class-listing" key={index}>
                <li>
                  {classInput}
                  <button onClick={() => handleRemovePlannedClass(index)}>Remove</button>
                </li>
              </div>
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
      <br></br><br></br>
      </div>
      </>
    );
  }; 


    const renderStepThree = () => {
    return (
    <> 


              
            <div className="formContainer">
      <div className="form-header">
        <form1>
              <h2>Step 3</h2>
              </form1>
        <p>Add your schedule conflicts</p>
        </div>
        <div className="form-steps">
          
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
          <div className="class-listing">
          <li key={index}>{conflictInput}</li>
          <button onClick={() => handleRemoveConflict(index)}>Remove</button>
        </div>
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
      <br></br><br></br>
      </div>


      </>
);
}

const renderStepFour = () => {
return (
<>
         
<div className="formContainer">
      <div className="form-header">
        <form1>
              <h2>Step 4</h2>
              </form1>
        <p>Review</p>
        </div>
        <div className="form-steps">
  <div className="review-container">
    <div className="review-list">
      <div className="review-list-section">
        <div className='h9'>Completed Courses:</div>
        <ul>
          {completedClasses.map((classInput, index) => (
            <li key={index}>{classInput}</li>
          ))}
      </ul>
      </div>
    </div>

    <div className="review-list">
      <div className="review-list-section">
      <div className='h9'>Needed Courses:</div>
            <ul>
          {plannedClasses.map((classInput, index) => (
            <li key={index}>{classInput}</li>
          ))}
      </ul>
      </div>
    </div>

    <div className="review-list">
      <div className="review-list-section">
      <div className='h9'>Schedule Conflicts:</div>
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
    <div><br></br><br></br></div>
  </div>
  </div>
  </div>
</>
);
};

 return (
  <div>
    <div className='formContainer'>
  <h3> <img src='../../img/creepy-cat.png' alt='success-image' width='175px' /></h3>
    

   <form onSubmit={handleSubmit}>
   {step === 1 && renderStepOne()}
   {step === 2 && renderStepTwo()}
   {step === 3 && renderStepThree()}
   {step === 4 && renderStepFour()}
   </form>
   </div>
   </div>

   );
}
  

export default Form;
