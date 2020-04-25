import React, { useState, useEffect } from 'react';
import './App.css';
import { Parser } from 'acorn';
import Editor from './components/editor';
import renderFigureData from './components/renderFigureData';

function App() {
  const [program, setProgram] = useState("line1 = line([153, 118], [421, 234]);");
  const [errorMessage, setErrorMessage] = useState("");
  const [SVGComponent, setSVGComponent] = useState(null);

  useEffect(() => {
    try {
      const programNodes = Parser.parse(program);

      const newSVGComponent = [];

      for (const node of programNodes.body) {
        const data = renderFigureData(node);

        if (data.type === "line") {
          newSVGComponent.push(
            <line x1={data.p1[0]} y1={data.p1[1]} x2={data.p2[0]} y2={data.p2[1]} stroke="black" key={data.name}/>
          )
        }
      }

      setSVGComponent(newSVGComponent);
      setErrorMessage("");
    } catch (e) {
      setSVGComponent(null);
      setErrorMessage(`${e}`);
    }
  }, [program]);

  const handleClick = (e) => {
    const offset = e.target.getBoundingClientRect()
    // console.log({x: e.clientX - offset.x, y: e.clientY - offset.y})
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
