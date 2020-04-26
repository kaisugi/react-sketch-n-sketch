import React, { useState, useEffect } from 'react';
import './App.css';
import { Parser } from 'acorn';
import Editor from './components/editor';
import renderFigureData from './components/renderFigureData';



function App() {
  const [program, setProgram] = useState("line1 = line([100, 100], [200, 200]);");
  const [errorMessage, setErrorMessage] = useState("");
  const [SVGComponent, setSVGComponent] = useState(null); // 描画する SVG の Component
  const [pointsToPos, setPointsToPos] = useState(null); // 点の座標からプログラム上の位置へのマップ

  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    try {
      const newSVGComponent = [];
      const newPointsToPos = [];


      const programNodes = Parser.parse(program);

      for (const node of programNodes.body) {
        const data = renderFigureData(node);

        if (data.type === "line") {
          newPointsToPos.push([[Number(data.p1[0]), Number(data.p1[1])], [data.p1Start, data.p1End]]);
          newPointsToPos.push([[Number(data.p2[0]), Number(data.p2[1])], [data.p2Start, data.p2End]]);

          newSVGComponent.push(
            <line 
              x1={data.p1[0]} 
              y1={data.p1[1]} 
              x2={data.p2[0]} 
              y2={data.p2[1]} 
              rx="10px"
              ry="2"
              stroke="red" 
              strokeWidth="5" 
              strokeLinecap="round"
              key={data.name}
            />
          )
        }
      }


      setErrorMessage("");
      setSVGComponent(newSVGComponent);
      setPointsToPos(newPointsToPos);

      //console.log(newPointsToPos)
    } catch (e) {
      setErrorMessage(`${e}`);
      setSVGComponent(null);
      setPointsToPos(null);
    }
  }, [program]);

  const handleMouseDown = (e) => {
    setIsMouseDown(true);
  }

  const handleMouseMove = (e) => {
    if (isMouseDown) {
      const currentX = e.clientX - 605;
      const currentY = e.clientY - 5;
      movePoints(currentX, currentY);
    }
  }

  const handleMouseUp = (e) => {
    setIsMouseDown(false);
  }

  const movePoints = (currentX, currentY) => {    
    let min = 100000000000000;
    let start = null;
    let end = null;
    let oldX = null;
    let oldY = null;

    if (pointsToPos) {
      for (const m of pointsToPos) {
        const tmp = (currentX - m[0][0]) * (currentX - m[0][0]) + (currentY - m[0][1]) * (currentY - m[0][1]);
        if (tmp < min) {
          min = tmp;
          oldX = m[0][0];
          oldY = m[0][1];
          start = m[1][0];
          end = m[1][1];
        }
      }

      const newProgram = `${program.slice(0, start)}[${currentX}, ${currentY}]${program.slice(end)}`;
      setProgram(newProgram);
    }

  }

  return (
    <div className="App">
      <div className="wrapper">
        <Editor 
          program={program}
          onChange={setProgram}
        />
        <svg 
          width="600" 
          height="600" 
          viewBox="0, 0, 600, 600" 
          onMouseDown={handleMouseDown} 
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {errorMessage ? <text x="20" y="20">{errorMessage}</text> : null}
          {SVGComponent}
        </svg>
        <br/>
      </div>
    </div>
  );
}

export default App;
