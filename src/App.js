import React, { useState, useEffect } from 'react';
import './App.css';
import { Parser } from 'acorn';
import { Checkbox, Radio, Spacer } from '@zeit-ui/react'
import Editor from './components/editor';
import renderFigureData from './components/renderFigureData';


const defaultProgram = 
`line1 = line([100, 100], [200, 200]);

rect1 = rect([025, 300], 120, 150);

ellipse1 = ellipse([425, 300], 60, 120);`


function App() {
  const [program, setProgram] = useState(defaultProgram);
  const [errorMessage, setErrorMessage] = useState("");
  const [SVGComponent, setSVGComponent] = useState(null); // 描画する SVG の Component

  /**
   * 操作モード
   * 0: オブジェクト追加
   * 1: オブジェクト編集
   */
  const [mode, setMode] = useState(0);

  /**
   * 点の座標からプログラム上の位置へのマップ
   * 
   * type 
   * 0: 直線
   * 1: 長方形の左上
   * 2: 長方形の右上
   * 3: 長方形の左下
   * 4: 長方形の右下
   * 5: 楕円の右
   * 6: 楕円の上
   * 7: 楕円の左
   * 8: 楕円の下
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

            newPointsToPos.push({
              type: 0, 
              object: { start: data.start, end: data.end },
              point: { value: [data.p1[0], data.p1[1]], start: data.p1Start, end: data.p1End }
            });
            newPointsToPos.push({
              type: 0,
              object: { start: data.start, end: data.end },
              point: { value: [data.p2[0], data.p2[1]], start: data.p2Start, end: data.p2End }
            });

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
              object: { start: data.start, end: data.end },
              point: { value: [data.p[0], data.p[1]], start: data.pStart, end: data.pEnd },
              width: { value: data.width, start: data.widthStart, end: data.widthEnd },
              height: { value: data.height, start: data.heightStart, end: data.heightEnd }
            });
            newPointsToPos.push({
              type: 2, 
              object: { start: data.start, end: data.end },
              point: { value: [data.p[0]+data.width, data.p[1]], start: data.pStart, end: data.pEnd },
              width: { value: data.width, start: data.widthStart, end: data.widthEnd },
              height: { value: data.height, start: data.heightStart, end: data.heightEnd }
            });
            newPointsToPos.push({
              type: 3, 
              object: { start: data.start, end: data.end },
              point: { value: [data.p[0], data.p[1]+data.height], start: data.pStart, end: data.pEnd },
              width: { value: data.width, start: data.widthStart, end: data.widthEnd },
              height: { value: data.height, start: data.heightStart, end: data.heightEnd }
            });
            newPointsToPos.push({
              type: 4, 
              object: { start: data.start, end: data.end },
              point: { value: [data.p[0]+data.width, data.p[1]+data.height], start: data.pStart, end: data.pEnd },
              width: { value: data.width, start: data.widthStart, end: data.widthEnd },
              height: { value: data.height, start: data.heightStart, end: data.heightEnd }
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
                    <text x={data.p[0]-data.rx-20} y={data.p[1]-data.ry-20}>{data.name}</text>
                    <circle cx={data.p[0]+data.rx} cy={data.p[1]} r="7" stroke="black" fill="#fff" strokeWidth="2" />
                    <circle cx={data.p[0]} cy={data.p[1]+data.ry} r="7" stroke="black" fill="#fff" strokeWidth="2" />
                    <circle cx={data.p[0]-data.rx} cy={data.p[1]} r="7" stroke="black" fill="#fff" strokeWidth="2" />
                    <circle cx={data.p[0]} cy={data.p[1]-data.ry} r="7" stroke="black" fill="#fff" strokeWidth="2" />
                    <circle cx={data.p[0]} cy={data.p[1]} r="7" stroke="black" fill="#fff" strokeWidth="2" />
                  </>
                ) : null}
              </>
            )

            newPointsToPos.push({
              type: 5, 
              object: { start: data.start, end: data.end },
              point: { value: [data.p[0]+data.rx, data.p[1]], start: data.pStart, end: data.pEnd },
              rx: { value: data.rx, start: data.rxStart, end: data.rxEnd },
              ry: { value: data.ry, start: data.ryStart, end: data.ryEnd }
            });
            newPointsToPos.push({
              type: 6, 
              object: { start: data.start, end: data.end },
              point: { value: [data.p[0], data.p[1]+data.ry], start: data.pStart, end: data.pEnd },
              rx: { value: data.rx, start: data.rxStart, end: data.rxEnd },
              ry: { value: data.ry, start: data.ryStart, end: data.ryEnd }
            });
            newPointsToPos.push({
              type: 7, 
              object: { start: data.start, end: data.end },
              point: { value: [data.p[0]-data.rx, data.p[1]], start: data.pStart, end: data.pEnd },
              rx: { value: data.rx, start: data.rxStart, end: data.rxEnd },
              ry: { value: data.ry, start: data.ryStart, end: data.ryEnd }
            });
            newPointsToPos.push({
              type: 8, 
              object: { start: data.start, end: data.end },
              point: { value: [data.p[0], data.p[1]-data.ry], start: data.pStart, end: data.pEnd },
              rx: { value: data.rx, start: data.rxStart, end: data.rxEnd },
              ry: { value: data.ry, start: data.ryStart, end: data.ryEnd }
            });
            newPointsToPos.push({
              type: 0, 
              object: { start: data.start, end: data.end },
              point: { value: [data.p[0], data.p[1]], start: data.pStart, end: data.pEnd },
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
    const currentX = e.clientX - 605;
    const currentY = e.clientY - 5;

    if (isMouseDown) {
      if (mode === 1) {
        movePoints(currentX, currentY);
      }
    }
  }

  const handleMouseUp = (e) => {
    setIsMouseDown(false);

    const currentX = e.clientX - 605;
    const currentY = e.clientY - 5;

    if (mode === 2) {
      deleteObject(currentX, currentY);
    }
  }

  const handleWidgetCheckBoxClick = (e) => {
    setIsWidgetsOn(!isWidgetsOn);
  }

  const handleMode = val => {
    setMode(val)
  }

  const movePoints = (currentX, currentY) => {    
    if (currentX <= 0 || currentX >= 600) return;
    if (currentY <= 0 || currentY >= 600) return;

    let min = 100000000000000;
    let tmpMap;

    if (pointsToPos) {
      for (const m of pointsToPos) {
        const tmp = (currentX - m["point"]["value"][0]) * (currentX - m["point"]["value"][0]) 
          + (currentY - m["point"]["value"][1]) * (currentY - m["point"]["value"][1]);
        if (tmp < min) {
          min = tmp;
          tmpMap = m;
        }
      }

      const currentProgram = program;
      let paddingX;
      let paddingY;
      let newProgram;
      let start;
      let end;

      let currentWidth;
      let currentHeight;
      let paddingWidth;
      let paddingHeight;

      let currentRx;
      let currentRy;
      let paddingRx;
      let paddingRy;


      switch (tmpMap.type) {
        case 0:
          start = tmpMap["point"]["start"];
          end = tmpMap["point"]["end"];

          paddingX = `000${currentX}`.slice(-3);
          paddingY = `000${currentY}`.slice(-3);

          newProgram = `${currentProgram.slice(0, start)}[${paddingX}, ${paddingY}]${currentProgram.slice(end)}`;
          setProgram(newProgram);
          break;

        case 1:
          start = tmpMap["point"]["start"];
          end = tmpMap["height"]["end"];

          currentWidth = Math.abs(tmpMap["point"]["value"][0] + tmpMap["width"]["value"] - currentX);
          currentHeight = Math.abs(tmpMap["point"]["value"][1] + tmpMap["height"]["value"] - currentY);

          paddingX = `000${currentX}`.slice(-3);
          paddingY = `000${currentY}`.slice(-3);
          paddingWidth = `000${currentWidth}`.slice(-3);
          paddingHeight = `000${currentHeight}`.slice(-3);

          newProgram = `${currentProgram.slice(0, start)}[${paddingX}, ${paddingY}], ${paddingWidth}, ${paddingHeight}${currentProgram.slice(end)}`;
          setProgram(newProgram);
          break;

        case 2:
          start = tmpMap["point"]["start"];
          end = tmpMap["height"]["end"];

          currentWidth = Math.abs(tmpMap["point"]["value"][0] - tmpMap["width"]["value"] - currentX);
          currentHeight = Math.abs(tmpMap["point"]["value"][1] + tmpMap["height"]["value"] - currentY);

          paddingX = `000${tmpMap["point"]["value"][0] - tmpMap["width"]["value"]}`.slice(-3);
          paddingY = `000${currentY}`.slice(-3);
          paddingWidth = `000${currentWidth}`.slice(-3);
          paddingHeight = `000${currentHeight}`.slice(-3);

          newProgram = `${currentProgram.slice(0, start)}[${paddingX}, ${paddingY}], ${paddingWidth}, ${paddingHeight}${currentProgram.slice(end)}`;
          setProgram(newProgram);
          break;

        case 3:
          start = tmpMap["point"]["start"];
          end = tmpMap["height"]["end"];

          currentWidth = Math.abs(tmpMap["point"]["value"][0] + tmpMap["width"]["value"] - currentX);
          currentHeight = Math.abs(tmpMap["point"]["value"][1] - tmpMap["height"]["value"] - currentY);

          paddingX = `000${currentX}`.slice(-3);
          paddingY = `000${tmpMap["point"]["value"][1] - tmpMap["height"]["value"]}`.slice(-3);
          paddingWidth = `000${currentWidth}`.slice(-3);
          paddingHeight = `000${currentHeight}`.slice(-3);

          newProgram = `${currentProgram.slice(0, start)}[${paddingX}, ${paddingY}], ${paddingWidth}, ${paddingHeight}${currentProgram.slice(end)}`;
          setProgram(newProgram);
          break;

        case 4:
          start = tmpMap["point"]["start"];
          end = tmpMap["height"]["end"];

          currentWidth = Math.abs(tmpMap["point"]["value"][0] - tmpMap["width"]["value"] - currentX);
          currentHeight = Math.abs(tmpMap["point"]["value"][1] - tmpMap["height"]["value"] - currentY);

          paddingX = `000${tmpMap["point"]["value"][0] - tmpMap["width"]["value"]}`.slice(-3);
          paddingY = `000${tmpMap["point"]["value"][1] - tmpMap["height"]["value"]}`.slice(-3);
          paddingWidth = `000${currentWidth}`.slice(-3);
          paddingHeight = `000${currentHeight}`.slice(-3);

          newProgram = `${currentProgram.slice(0, start)}[${paddingX}, ${paddingY}], ${paddingWidth}, ${paddingHeight}${currentProgram.slice(end)}`;
          setProgram(newProgram);
          break;

        case 5:
          start = tmpMap["rx"]["start"];
          end = tmpMap["ry"]["end"];

          currentRx = Math.abs(tmpMap["point"]["value"][0] - tmpMap["rx"]["value"] - currentX);
          currentRy = tmpMap["ry"]["value"];
          paddingRx = `000${currentRx}`.slice(-3);
          paddingRy = `000${currentRy}`.slice(-3);

          newProgram = `${currentProgram.slice(0, start)}${paddingRx}, ${paddingRy}${currentProgram.slice(end)}`;
          setProgram(newProgram);
          break;

        case 6:
          start = tmpMap["rx"]["start"];
          end = tmpMap["ry"]["end"];

          currentRx = tmpMap["rx"]["value"];
          currentRy = Math.abs(tmpMap["point"]["value"][1] - tmpMap["ry"]["value"] - currentY);
          paddingRx = `000${currentRx}`.slice(-3);
          paddingRy = `000${currentRy}`.slice(-3);

          newProgram = `${currentProgram.slice(0, start)}${paddingRx}, ${paddingRy}${currentProgram.slice(end)}`;
          setProgram(newProgram);
          break;

        case 7:
          start = tmpMap["rx"]["start"];
          end = tmpMap["ry"]["end"];

          currentRx = Math.abs(tmpMap["point"]["value"][0] + tmpMap["rx"]["value"] - currentX);
          currentRy = tmpMap["ry"]["value"];
          paddingRx = `000${currentRx}`.slice(-3);
          paddingRy = `000${currentRy}`.slice(-3);

          newProgram = `${currentProgram.slice(0, start)}${paddingRx}, ${paddingRy}${currentProgram.slice(end)}`;
          setProgram(newProgram);
          break;

        case 8:
          start = tmpMap["rx"]["start"];
          end = tmpMap["ry"]["end"];

          currentRx = tmpMap["rx"]["value"];
          currentRy = Math.abs(tmpMap["point"]["value"][1] + tmpMap["ry"]["value"] - currentY);
          paddingRx = `000${currentRx}`.slice(-3);
          paddingRy = `000${currentRy}`.slice(-3);

          newProgram = `${currentProgram.slice(0, start)}${paddingRx}, ${paddingRy}${currentProgram.slice(end)}`;
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

  const deleteObject = (currentX, currentY) => {  
    if (currentX <= 0 || currentX >= 600) return;
    if (currentY <= 0 || currentY >= 600) return;

    let min = 100000000000000;
    let tmpMap;

    if (pointsToPos) {
      for (const m of pointsToPos) {
        const tmp = (currentX - m["point"]["value"][0]) * (currentX - m["point"]["value"][0]) 
          + (currentY - m["point"]["value"][1]) * (currentY - m["point"]["value"][1]);
        if (tmp < min) {
          min = tmp;
          tmpMap = m;
        }
      }

      const start = tmpMap["object"]["start"];
      const end = tmpMap["object"]["end"];

      const currentProgram = program;
      const newProgram = `${currentProgram.slice(0, start)}${currentProgram.slice(end+1)}`;
      setProgram(newProgram);
    }
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
              <Spacer x={5}/>
              <Radio.Group value={mode} onChange={handleMode} useRow>
                <Radio value={0}>CREATE</Radio>
                <Radio value={1}>MOVE</Radio>
                <Radio value={2}>DELETE</Radio>
              </Radio.Group>
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
