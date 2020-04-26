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
            <line x1={data.p1[0]} y1={data.p1[1]} x2={data.p2[0]} y2={data.p2[1]} stroke="red" key={data.name}/>
          )
        }
      }


      setErrorMessage("");
      setSVGComponent(newSVGComponent);
      setPointsToPos(newPointsToPos);

      console.log(newPointsToPos)
    } catch (e) {
      setErrorMessage(`${e}`);
      setSVGComponent(null);
      setPointsToPos(null);
    }
  }, [program]);

  const handleClick = (e) => {
    const offset = e.target.getBoundingClientRect()

    const currentX = e.clientX - offset.x;
    const currentY = e.clientY - offset.y;
    
    let min = 100000000000000;
    let newX = null;
    let newY = null;
    let start = null;
    let end = null;

    for (const m of pointsToPos) {
      const tmp = (currentX - m[0][0]) * (currentX - m[0][0]) + (currentY - m[0][1]) * (currentY - m[0][1]);
      if (tmp < min) {
        min = tmp;
        newX = currentX;
        newY = currentY;
        start = m[1][0];
        end = m[1][1];
      }
    }

    const front = program.slice(0, start);
    const back = program.slice(end);
    setProgram(`${front}[${newX}, ${newY}]${back}`);

  }

  return (
    <div className="App">
      <div className="wrapper">
        <Editor 
          program={program}
          onChange={setProgram}
        />
        <svg width="600" height="600" viewBox="0, 0, 600, 600" onClick={handleClick}>
          {errorMessage ? <text x="20" y="20">{errorMessage}</text> : null}
          {SVGComponent}
        </svg>
        <br/>
      </div>
    </div>
  );
}

export default App;
