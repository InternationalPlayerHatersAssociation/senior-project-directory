import React, { useState } from 'react';
import './SolutionList.css';
import {Link} from 'react-router-dom';

function SolutionList(props) {
  const [selectedSolution, setSelectedSolution] = useState('');
  const [generatedCRNs, setGeneratedCRNs] = useState([]);

  const handleSolutionClick = (solution, index) => {
    props.setSolutionChoice(index);
    console.log('Here is the solution value:',selectedSolution);
    if (selectedSolution === solution) {
      setSelectedSolution('');
    } else {
      setSelectedSolution(solution);
    }
    setGeneratedCRNs([]);
  };


const handleGenerateCRNs = () => {
  const courseNames = selectedSolution.map(course => `${course.name} - ${course.crn}`);
  setGeneratedCRNs(courseNames);
};

console.log(props.solutions);
const solutions = (Array.isArray(props.solutions) ? props.solutions : []);
return (
  <div className="solution-list-container">
    <h2 className="solution-list-header">Choose a Solution</h2>
    <div className="solution-list">
      {solutions.map((solution, index) => (
        <div
          key={index}
          className={`solution-list-item ${
            solution === selectedSolution ? 'selected' : ''
          }`}
          onClick={() => handleSolutionClick(solution, index)}
        >
          {`Solution #${index + 1}`}
        </div>
      ))}
    </div>
    <button type="submit" className="submit-button" onClick={handleGenerateCRNs}>Generate CRNs</button>
    {generatedCRNs.length > 0 && (
      <div className="generated-crns-container">

        {generatedCRNs.map((crn) => (
          <div key={crn} className="generated-crns-item">{crn}</div>
        ))}
      </div>
    )}
    <br></br> <br></br>
    <h3 style={{margin: '10px'}}><small>click <Link to="/form">here</Link> to edit your classes and schedule conflicts.</small></h3>
  </div>
);
        }

export default SolutionList;

