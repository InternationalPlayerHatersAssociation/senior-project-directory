import React, { useState, useEffect, useMemo } from 'react';
import './FormOther.css';
import { v4 as uuidv4 } from 'uuid';

function Form() {
  const [completedClasses, setCompletedClasses] = useState([]);
  const [plannedClasses, setPlannedClasses] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [day, setDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [majorClasses, setMajorClasses] = useState([]);
  const [filterName, setFilterName] = useState('');
//added
  const [step, setStep] = useState(1); // state to keep track of the current step
//done
useEffect(() => {
  if(majorClasses) {
    fetch('/get_major_classes')
    .then(response => response.json())
    .then(data => removeDuplicates(data.names));
  };
}, [filterName]);

const removeDuplicates = (data) => {
  const filteredClasses = [...new Set(data)];
  setMajorClasses(filteredClasses)
}


const handleSubmit = async (event) => {
  event.preventDefault();
  console.log('Completed classes:', completedClasses);
  console.log('Planned classes:', plannedClasses);
  console.log('Conflicts:', conflicts);
  console.log('Day:', day);
  console.log('Start time:', startTime);
  console.log('End time:', endTime);

  try {
    const response = await fetch('/save_user_data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        history: completedClasses,
        classes: plannedClasses,
        conflicts: conflicts,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Response data:', data);
    } else {
      console.error('Error with the response:', response.statusText);
    }
  } catch (error) {
    console.error('Error submitting form:', error);
  }
  };

  const handleAddPlannedClass = (event) => {
    event.preventDefault();
    const classToAdd = event.target.value;
    setPlannedClasses([...plannedClasses, classToAdd]);
    setFilterName('');
  };

  const handleInputChange = (e) => {
    setFilterName(e.target.value);
  };

  const handleAddCompletedClass = (event) => {
    event.preventDefault();
    const classInput = event.target.value;
    if(classInput) {
      setCompletedClasses([...completedClasses, classInput]);
      setFilterName('');
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

  const handleRemovePlannedClass = (event) => {
    event.preventDefault();
    setPlannedClasses((prevClasses) => {
      const newClasses = [...prevClasses];
      newClasses.splice(event.target.value, 1);
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
  
  const handleNext = () => {
    setStep(step + 1);
    setFilterName('');
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const classesToChoose = useMemo(() => {

    if (majorClasses.length > 0) {
      const filteredClasses = majorClasses.filter(item =>
        new RegExp(filterName, 'i').test(item)
      );
  
      if (filteredClasses.length < 10) {
        if(step === 1){
          const notChosen = filteredClasses.filter((item) => !completedClasses.includes(item));
          return notChosen.map(course => (
            <button className='class-Choice-Button' key={uuidv4()} onClick={handleAddCompletedClass} value={course}>{course}</button>
          ));
        } else {
          const notChosen = filteredClasses.filter((item) => !plannedClasses.includes(item));
          return notChosen.map(course => (
            <button  className='class-Choice-Button' key={uuidv4()} onClick={handleAddPlannedClass} value={course}>{course}</button>
        ));
        }

      }
    }
  
    return <></>;
  }, [majorClasses, filterName]);

  const renderStepOne = () => {//done

    return (
      <>
          <div className="formContainer">
            
            <div className="form-header">
          <h2>Step 1</h2>
              <p>Add your completed courses</p>
              </div>
        <div className="form-steps">
            
            <div className="class-inputs">
              <input type="text" id="completed-classes" placeholder="e.g. Digital Circuits" onChange={handleInputChange} value={filterName}/>
            </div>
            <div className='class-Choice-Buttons'>{classesToChoose}</div>
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
    <h2>Step 2</h2>
        <p>Add your needed courses</p>
        </div>
        <div className="form-steps">
          
          <div className="class-inputs">
            <input type="text" id="planned-classes" placeholder="e.g. Senior Project" onChange={handleInputChange} value={filterName}/>
          </div>
          <div className='class-Choice-Buttons'>{classesToChoose}</div>
          <ul className="class-list">
            {plannedClasses.map((classInput, index) => (
              <div className="class-listing" key={index}>
                <li>
                  {classInput}
                  <button value={index} onClick={handleRemovePlannedClass}>Remove</button>
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
              <h2>Step 3</h2>
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
      <div className='class-Choice-Buttons'>{classesToChoose}</div>
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
  };

const renderStepFour = () => {
return (
<>
         
<div className="formContainer">
      <div className="form-header">
              <h2>Step 4</h2>
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