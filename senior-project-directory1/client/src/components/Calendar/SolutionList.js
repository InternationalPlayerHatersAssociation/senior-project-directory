import React, { useState } from 'react';
import './SolutionList.css';

function SolutionList() {
  const [solutions, setSolutions] = useState([
    'Play with cat toys',//replace with DB solutions
    'Give cat treats',
    'Cuddle with cats',
  ]);
  const [selectedSolution, setSelectedSolution] = useState('');

  const handleSolutionClick = (solution) => {
    setSelectedSolution(solution);
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
    </div>
  );
}

export default SolutionList;
