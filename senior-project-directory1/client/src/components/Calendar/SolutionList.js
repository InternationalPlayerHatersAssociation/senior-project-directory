import React, { useState, useEffect } from 'react';
import './SolutionList.css';

function SolutionList() {
  const [solutions, setSolutions] = useState([
    'Solution #1',//replace with req solutions
    'Solution #2',
    'Solution #3',
  ]);
  const [selectedSolution, setSelectedSolution] = useState('');
  const [generatedCRNs, setGeneratedCRNs] = useState([]);

  const handleSolutionClick = (solution) => {
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
      {solutions.map((solution) => (
        <div
          key={solution}
          className={`solution-list-item ${
            solution === selectedSolution ? 'selected' : ''
          }`}
          onClick={() => handleSolutionClick(solution)}
        >
          {solution}
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

