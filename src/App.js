import React, { useState, useEffect } from 'react';
import './App.css';
import { Parser } from 'acorn';
import { Checkbox } from '@zeit-ui/react'
import Editor from './components/editor';
import renderFigureData from './components/renderFigureData';


const defaultProgram = 
`line1 = line([100, 100], [200, 200]);

rect1 = rect([025, 300], 120, 150);

ellipse1 = ellipse([425, 300], 10, 20);`


function App() {
  const [program, setProgram] = useState(defaultProgram);
  const [errorMessage, setErrorMessage] = useState("");
  const [SVGComponent, setSVGComponent] = useState(null); // 描画する SVG の Component

  /**
   * 点の座標からプログラム上の位置へのマップ
   * 
   * type 
   * 0: 直線
   * 1: 長方形の左上
   * 2: 長方形の右上
   * 3: 長方形の左下
   * 4: 長方形の右下
   */
  const [pointsToPos, setPointsToPos] = useState(null); 

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isWidgetsOn, setIsWidgetsOn] = useState(true); 

  useEffect(() => {
    try {
      const newSVGComponent = [];
      const newPointsToPos = [];


      const programNodes = Parser.parse(program);

      for (const node of programNodes.body) {
        const data = renderFigureData(node);

        switch (data.type) {
          case "line":
            newPointsToPos.push({
              type: 0, 
              point: { data: [data.p1[0], data.p1[1]], start: data.p1Start, end: data.p1End }
            });
            newPointsToPos.push({
              type: 0,
              point: { data: [data.p2[0], data.p2[1]], start: data.p2Start, end: data.p2End }
            });

            const leftPoint = (data.p1[0] < data.p2[0]) ? data.p1 : data.p2;
  
            newSVGComponent.push(
              <>
                <line 
                  x1={data.p1[0]} 
                  y1={data.p1[1]} 
                  x2={data.p2[0]} 
                  y2={data.p2[1]} 
                  rx="10px"
                  ry="2"
                  stroke="#c13030" 
                  strokeWidth="5" 
                  strokeLinecap="round"
                  key={data.name}
                />
                {isWidgetsOn ? (
                  <>
                    <text x={leftPoint[0] - 20} y={leftPoint[1] - 20}>{data.name}</text> 
                    <circle cx={data.p1[0]} cy={data.p1[1]} r="7" stroke="black" fill="#fff" strokeWidth="2" />
                    <circle cx={data.p2[0]} cy={data.p2[1]} r="7" stroke="black" fill="#fff" strokeWidth="2" />
                  </>
                ) : null}
              </>
            )
            break;

          case "rect":      
            newSVGComponent.push(
              <>
                <rect
                  x={data.p[0]} 
                  y={data.p[1]} 
                  width={data.width} 
                  height={data.height} 
                  stroke="#c13030" 
                  fill="#c13030"
                  strokeWidth="5" 
                  strokeLinecap="round"
                  key={data.name}
                />
                {isWidgetsOn ? (
                  <>
                    <text x={data.p[0] - 20} y={data.p[1] - 20}>{data.name}</text>
                    <circle cx={data.p[0]} cy={data.p[1]} r="7" stroke="black" fill="#fff" strokeWidth="2" />
                    <circle cx={data.p[0] + data.width} cy={data.p[1]} r="7" stroke="black" fill="#fff" strokeWidth="2" />
                    <circle cx={data.p[0]} cy={data.p[1] + data.height} r="7" stroke="black" fill="#fff" strokeWidth="2" />
                    <circle cx={data.p[0] + data.width} cy={data.p[1] + data.height} r="7" stroke="black" fill="#fff" strokeWidth="2" />
                  </>
                ) : null}
              </>
            )

            newPointsToPos.push({
              type: 1, 
              point: { data: [data.p[0], data.p[1]], start: data.pStart, end: data.pEnd },
              width: { data: data.width, start: data.widthStart, end: data.widthEnd },
              height: { data: data.height, start: data.heightStart, end: data.heightEnd }
            });
            newPointsToPos.push({
              type: 2, 
              point: { data: [data.p[0], data.p[1]], start: data.pStart, end: data.pEnd },
              width: { data: data.width, start: data.widthStart, end: data.widthEnd },
              height: { data: data.height, start: data.heightStart, end: data.heightEnd }
            });

            break;

          case "ellipse":
            newSVGComponent.push(
              <>
                <ellipse
                  cx={data.p[0]} 
                  cy={data.p[1]} 
                  rx={data.rx} 
                  ry={data.ry} 
                  stroke="#c13030" 
                  fill="#c13030"
                  strokeWidth="5" 
                  strokeLinecap="round"
                  key={data.name}
                />
                {isWidgetsOn ? (
                  <>
                    <text x={data.p[0] - 20} y={data.p[1] - 20}>{data.name}</text>
                    <circle cx={data.p[0]} cy={data.p[1]} r="7" stroke="black" fill="#fff" strokeWidth="2" />
                  </>
                ) : null}
              </>
            )

            newPointsToPos.push({
              type: 0, 
              point: { data: [data.p[0], data.p[1]], start: data.pStart, end: data.pEnd }
            });

            break;

          default:
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
  }, [isWidgetsOn, program]);

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

  const handleWidgetCheckBoxClick = (e) => {
    setIsWidgetsOn(!isWidgetsOn);
  }

  const movePoints = (currentX, currentY) => {    
    if (currentX <= 0 || currentX >= 600) return;
    if (currentY <= 0 || currentY >= 600) return;

    let min = 100000000000000;
    let tmpMap = null;

    if (pointsToPos) {
      for (const m of pointsToPos) {
        const tmp = (currentX - m["point"]["data"][0]) * (currentX - m["point"]["data"][0]) 
          + (currentY - m["point"]["data"][1]) * (currentY - m["point"]["data"][1]);
        if (tmp < min) {
          min = tmp;
          tmpMap = m;
        }
      }

      const currentProgram = program;
      const paddingX = `000${currentX}`.slice(-3);
      const paddingY = `000${currentY}`.slice(-3);
      let newProgram;
      let start;
      let end;

      switch (tmpMap.type) {
        case 0:
          start = tmpMap["point"]["start"];
          end = tmpMap["point"]["end"];

          newProgram = `${currentProgram.slice(0, start)}[${paddingX}, ${paddingY}]${currentProgram.slice(end)}`;
          setProgram(newProgram);
          break;

        case 1:
          start = tmpMap["point"]["start"];
          end = tmpMap["height"]["end"];

          const currentWidth = Math.abs(tmpMap["point"]["data"][0] + tmpMap["width"]["data"] - currentX);
          const currentHeight = Math.abs(tmpMap["point"]["data"][1] + tmpMap["height"]["data"] - currentY);

          const paddingWidth = `000${currentWidth}`.slice(-3);
          const paddingHeight = `000${currentHeight}`.slice(-3);

          newProgram = `${currentProgram.slice(0, start)}[${paddingX}, ${paddingY}], ${paddingWidth}, ${paddingHeight}${currentProgram.slice(end)}`;
          setProgram(newProgram);
          break;

        default:
      }
    }
  }

  // ゼロ埋めを見た目消す
  const deleteZeroPadding = (program) => {
    return program.replace(/\d{3}/gi, (match) => {
      if (match[0] === '0' && match[1] === '0') {
        return match[2]
      } else if (match[0] === '0') {
        return match[1] + match[2]
      } else {
        return match;
      }
    })
  }

  return (
    (window.innerWidth > 1220) ? (
      <div className="App">
        <div className="wrapper">
          <Editor 
            program={deleteZeroPadding(program)}
            onChange={setProgram}
          />
          <div className="output">
            <div>
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
            </div>
            <div className="panel">
              <Checkbox checked={isWidgetsOn} onChange={handleWidgetCheckBoxClick}>Show Widgets</Checkbox>
            </div>
          </div>
          <br/>
        </div>
      </div>
    ) : (
      <div className="App"><br/>Please let window width be over 1220px</div>
    )
  );
}

export default App;
