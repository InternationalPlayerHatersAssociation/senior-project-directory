import React, { useState } from 'react';
import './SolutionList.css';

function SolutionList(props) {
  const [selectedSolution, setSelectedSolution] = useState('');
  const [generatedCRNs, setGeneratedCRNs] = useState([]);

  const handleSolutionClick = (solution, index) => {
    props.setSolutionChoice(index);
    if (selectedSolution === solution) {
      setSelectedSolution('');
    } else {
      setSelectedSolution(solution);
    }
  };


const handleGenerateCRNs = () => {
  console.log('Generating CRNs...');
  const crns = selectedSolution ? [`CRN1-${selectedSolution}`, `CRN2-${selectedSolution}`] : [];
  setGeneratedCRNs(crns);
};

return (
  <div className="solution-list-container">
    <h2 className="solution-list-header">Choose a Solution</h2>
    <div className="solution-list">
      {props.solutions.map((solution, index) => (
        <div
          key={solution}
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
  </div>
);
        }

export default SolutionList;

