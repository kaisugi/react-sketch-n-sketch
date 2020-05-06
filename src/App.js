import React, { useState, useEffect } from 'react';
import './App.css';
import { Parser } from 'acorn';
import { Button, Checkbox, Input, Modal, Radio, Spacer } from '@zeit-ui/react'
import { SketchPicker } from 'react-color';
import reactCSS from 'reactcss'
import Editor from './components/editor';
import renderFigureData from './components/renderFigureData';


const defaultProgram = `leftBlueEll = ellipse([268, 286], 218, 261, "#187fc4")
leftWhiteEll = ellipse([269, 288], 162, 264, "#ffffff")
leftRect = rect([048, 016], 207, 547, "#ffffff")
rightBlueEll = ellipse([264, 277], 115, 166, "#187fc4")
rightWhiteEll = ellipse([266, 277], 064, 175, "#ffffff")
rightRect = rect([256, 113], 130, 329, "#ffffff")
centerYellowEll1 = ellipse([286, 205], 049, 094, "#fabe00");
centerYellowEll2 = ellipse([307, 359], 052, 086, "#fabe00");
centerWhiteEll1 = ellipse([314, 182], 053, 090, "#ffffff");
centerWhiteEll2 = ellipse([269, 359], 049, 073, "#ffffff");`;


const defaultColors = 
  ['#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', 
  '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', 
  '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF',
  '#187FC4', '#FABE00']


const fillzero = str => {
  return `000${str}`.slice(-3);
}


function App() {
  const [program, setProgram] = useState(defaultProgram);
  const [groupProgramNodes, setGroupProgamNodes] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [SVGComponent, setSVGComponent] = useState(null);
  const [optionalSVGComponent, setOptionalSVGComponent] = useState(null);
  const [counter, setCounter] = useState(1);

  const [mode, setMode] = useState(0);
  const [drawMode, setDrawMode] = useState(0);

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

  const [startX, setStartX] = useState(null);
  const [startY, setStartY] = useState(null);

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isWidgetsOn, setIsWidgetsOn] = useState(true); 
  const [modalState, setModalState] = useState(false);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [color, setColor] = useState("#c13030");
  const [varName, setVarName] = useState("");

  const styles = reactCSS({
    'default': {
      color: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
        background: color,
      },
      swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
      },
      popover: {
        position: 'absolute',
        zIndex: '4',
      },
      cover: {
        position: 'fixed',
        top: 'px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
    },
  });


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
                  stroke={data.color}
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
              name: { start: data.nameStart, end: data.nameEnd }, 
              object: { start: data.start, end: data.end },
              color: { value: data.color, start: data.colorStart, end: data.colorEnd },
              point: { value: [data.p1[0], data.p1[1]], start: data.p1Start, end: data.p1End }
            });
            newPointsToPos.push({
              type: 0,
              name: { start: data.nameStart, end: data.nameEnd },
              object: { start: data.start, end: data.end },
              color: { value: data.color, start: data.colorStart, end: data.colorEnd },
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
                  stroke={data.color}
                  fill={data.color}
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
              name: { start: data.nameStart, end: data.nameEnd },
              object: { start: data.start, end: data.end },
              color: { value: data.color, start: data.colorStart, end: data.colorEnd },
              point: { value: [data.p[0], data.p[1]], start: data.pStart, end: data.pEnd },
              width: { value: data.width, start: data.widthStart, end: data.widthEnd },
              height: { value: data.height, start: data.heightStart, end: data.heightEnd }
            });
            newPointsToPos.push({
              type: 2, 
              name: { start: data.nameStart, end: data.nameEnd },
              object: { start: data.start, end: data.end },
              color: { value: data.color, start: data.colorStart, end: data.colorEnd },
              point: { value: [data.p[0]+data.width, data.p[1]], start: data.pStart, end: data.pEnd },
              width: { value: data.width, start: data.widthStart, end: data.widthEnd },
              height: { value: data.height, start: data.heightStart, end: data.heightEnd }
            });
            newPointsToPos.push({
              type: 3, 
              name: { start: data.nameStart, end: data.nameEnd },
              object: { start: data.start, end: data.end },
              color: { value: data.color, start: data.colorStart, end: data.colorEnd },
              point: { value: [data.p[0], data.p[1]+data.height], start: data.pStart, end: data.pEnd },
              width: { value: data.width, start: data.widthStart, end: data.widthEnd },
              height: { value: data.height, start: data.heightStart, end: data.heightEnd }
            });
            newPointsToPos.push({
              type: 4, 
              name: { start: data.nameStart, end: data.nameEnd },
              object: { start: data.start, end: data.end },
              color: { value: data.color, start: data.colorStart, end: data.colorEnd },
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
                  stroke={data.color}
                  fill={data.color}
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
              name: { start: data.nameStart, end: data.nameEnd },
              object: { start: data.start, end: data.end },
              color: { value: data.color, start: data.colorStart, end: data.colorEnd },
              point: { value: [data.p[0]+data.rx, data.p[1]], start: data.pStart, end: data.pEnd },
              rx: { value: data.rx, start: data.rxStart, end: data.rxEnd },
              ry: { value: data.ry, start: data.ryStart, end: data.ryEnd }
            });
            newPointsToPos.push({
              type: 6, 
              name: { start: data.nameStart, end: data.nameEnd },
              object: { start: data.start, end: data.end },
              color: { value: data.color, start: data.colorStart, end: data.colorEnd },
              point: { value: [data.p[0], data.p[1]+data.ry], start: data.pStart, end: data.pEnd },
              rx: { value: data.rx, start: data.rxStart, end: data.rxEnd },
              ry: { value: data.ry, start: data.ryStart, end: data.ryEnd }
            });
            newPointsToPos.push({
              type: 7, 
              name: { start: data.nameStart, end: data.nameEnd },
              object: { start: data.start, end: data.end },
              color: { value: data.color, start: data.colorStart, end: data.colorEnd },
              point: { value: [data.p[0]-data.rx, data.p[1]], start: data.pStart, end: data.pEnd },
              rx: { value: data.rx, start: data.rxStart, end: data.rxEnd },
              ry: { value: data.ry, start: data.ryStart, end: data.ryEnd }
            });
            newPointsToPos.push({
              type: 8, 
              name: { start: data.nameStart, end: data.nameEnd },
              object: { start: data.start, end: data.end },
              color: { value: data.color, start: data.colorStart, end: data.colorEnd },
              point: { value: [data.p[0], data.p[1]-data.ry], start: data.pStart, end: data.pEnd },
              rx: { value: data.rx, start: data.rxStart, end: data.rxEnd },
              ry: { value: data.ry, start: data.ryStart, end: data.ryEnd }
            });
            newPointsToPos.push({
              type: 0, 
              object: { start: data.start, end: data.end },
              color: { value: data.color, start: data.colorStart, end: data.colorEnd },
              point: { value: [data.p[0], data.p[1]], start: data.pStart, end: data.pEnd },
            });

            break;

          default:
        }
      }


      setErrorMessage("");
      setSVGComponent(newSVGComponent);
      setPointsToPos(newPointsToPos);
    } catch (e) {
      setErrorMessage(`${e}`);
      setSVGComponent(null);
      setPointsToPos(null);
    }
  }, [isWidgetsOn, program]);

  const handleMouseDown = (e) => {
    setIsMouseDown(true);

    const currentX = e.clientX - 605;
    const currentY = e.clientY - 5;

    if (mode === 0) {
      setStartX(currentX);
      setStartY(currentY);
    }
  }

  const handleMouseMove = (e) => {
    const currentX = e.clientX - 605;
    const currentY = e.clientY - 5;

    if (isMouseDown) {
      if (mode === 1) {
        movePoints(currentX, currentY);
      } else if (mode === 0) {
        setOptionalSVGComponent(
          <rect
            x={Math.min(startX, currentX)} 
            y={Math.min(startY, currentY)} 
            width={Math.max(startX, currentX) - Math.min(startX, currentX) - 5} 
            height={Math.max(startY, currentY) - Math.min(startY, currentY)} 
            stroke="black"
            strokeDasharray="4 4"
            fill="none"
            strokeWidth="2" 
            strokeLinecap="round"
          />
        )
      }
    }
  }

  const handleMouseUp = (e) => {
    setIsMouseDown(false);

    const currentX = e.clientX - 605;
    const currentY = e.clientY - 5;

    if (mode === 2) {
      deleteObject(currentX, currentY);
    } else if (mode === 3) {
      changeColor(currentX, currentY);
    } else if (mode === 0) {
      setOptionalSVGComponent(null);
      drawObject(currentX, currentY);
    } else if (mode === 4) {
      changeVarName(currentX, currentY);
    }
  }

  const handleModalClose = () => {
    setModalState(false);
  }

  const handleWidgetCheckBoxClick = (e) => {
    setIsWidgetsOn(!isWidgetsOn);
  }

  const handleMode = val => {
    setMode(val)
  }

  const handleDrawMode = val => {
    setDrawMode(val);
  }

  const handleColorPickerClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  }

  const handleColorPickerClose = () => {
    setDisplayColorPicker(false);
  };

  const handleColorPickerChange = (color) => {
    setColor(color.hex)
  };

  const handleInputChange = (e) => {
    setVarName(e.target.value);
  }

  const handleGroupButtonClick = () => {
    setModalState(true);
    setGroupProgamNodes(Parser.parse(program))
  }

  const movePoints = (currentX, currentY) => {    
    if (currentX <= 0 || currentX >= 600) return;
    if (currentY <= 0 || currentY >= 600) return;

    let min = 100000000000000;
    let tmpMap;

    if (pointsToPos && pointsToPos.length > 0) {
      for (const m of pointsToPos) {
        const tmp = (currentX - m["point"]["value"][0]) * (currentX - m["point"]["value"][0]) 
          + (currentY - m["point"]["value"][1]) * (currentY - m["point"]["value"][1]);
        if (tmp < min) {
          min = tmp;
          tmpMap = m;
        }
      }

      const currentProgram = program;
      let newX;
      let newY;
      let newProgram;
      let start;
      let end;

      let currentWidth;
      let currentHeight;

      let currentRx;
      let currentRy;

      switch (tmpMap.type) {
        case 0:
          start = tmpMap["point"]["start"];
          end = tmpMap["point"]["end"];

          newProgram = `${currentProgram.slice(0, start)}[${fillzero(currentX)}, ${fillzero(currentY)}]${currentProgram.slice(end)}`;
          setProgram(newProgram);
          break;

        case 1:
          start = tmpMap["point"]["start"];
          end = tmpMap["height"]["end"];

          currentWidth = Math.abs(tmpMap["point"]["value"][0] + tmpMap["width"]["value"] - currentX);
          currentHeight = Math.abs(tmpMap["point"]["value"][1] + tmpMap["height"]["value"] - currentY);

          newProgram = `${currentProgram.slice(0, start)}[${fillzero(currentX)}, ${fillzero(currentY)}], ${fillzero(currentWidth)}, ${fillzero(currentHeight)}${currentProgram.slice(end)}`;
          setProgram(newProgram);
          break;

        case 2:
          start = tmpMap["point"]["start"];
          end = tmpMap["height"]["end"];

          currentWidth = Math.abs(tmpMap["point"]["value"][0] - tmpMap["width"]["value"] - currentX);
          currentHeight = Math.abs(tmpMap["point"]["value"][1] + tmpMap["height"]["value"] - currentY);

          newX = tmpMap["point"]["value"][0] - tmpMap["width"]["value"];

          newProgram = `${currentProgram.slice(0, start)}[${fillzero(newX)}, ${fillzero(currentY)}], ${fillzero(currentWidth)}, ${fillzero(currentHeight)}${currentProgram.slice(end)}`;
          setProgram(newProgram);
          break;

        case 3:
          start = tmpMap["point"]["start"];
          end = tmpMap["height"]["end"];

          currentWidth = Math.abs(tmpMap["point"]["value"][0] + tmpMap["width"]["value"] - currentX);
          currentHeight = Math.abs(tmpMap["point"]["value"][1] - tmpMap["height"]["value"] - currentY);

          newY = tmpMap["point"]["value"][1] - tmpMap["height"]["value"];

          newProgram = `${currentProgram.slice(0, start)}[${fillzero(currentX)}, ${fillzero(newY)}], ${fillzero(currentWidth)}, ${fillzero(currentHeight)}${currentProgram.slice(end)}`;
          setProgram(newProgram);
          break;

        case 4:
          start = tmpMap["point"]["start"];
          end = tmpMap["height"]["end"];

          currentWidth = Math.abs(tmpMap["point"]["value"][0] - tmpMap["width"]["value"] - currentX);
          currentHeight = Math.abs(tmpMap["point"]["value"][1] - tmpMap["height"]["value"] - currentY);

          newX = tmpMap["point"]["value"][0] - tmpMap["width"]["value"];
          newY = tmpMap["point"]["value"][1] - tmpMap["height"]["value"];

          newProgram = `${currentProgram.slice(0, start)}[${fillzero(newX)}, ${fillzero(newY)}], ${fillzero(currentWidth)}, ${fillzero(currentHeight)}${currentProgram.slice(end)}`;
          setProgram(newProgram);
          break;

        case 5:
          start = tmpMap["rx"]["start"];
          end = tmpMap["ry"]["end"];

          currentRx = Math.abs(tmpMap["point"]["value"][0] - tmpMap["rx"]["value"] - currentX);
          currentRy = tmpMap["ry"]["value"];

          newProgram = `${currentProgram.slice(0, start)}${fillzero(currentRx)}, ${fillzero(currentRy)}${currentProgram.slice(end)}`;
          setProgram(newProgram);
          break;

        case 6:
          start = tmpMap["rx"]["start"];
          end = tmpMap["ry"]["end"];

          currentRx = tmpMap["rx"]["value"];
          currentRy = Math.abs(tmpMap["point"]["value"][1] - tmpMap["ry"]["value"] - currentY);

          newProgram = `${currentProgram.slice(0, start)}${fillzero(currentRx)}, ${fillzero(currentRy)}${currentProgram.slice(end)}`;
          setProgram(newProgram);
          break;

        case 7:
          start = tmpMap["rx"]["start"];
          end = tmpMap["ry"]["end"];

          currentRx = Math.abs(tmpMap["point"]["value"][0] + tmpMap["rx"]["value"] - currentX);
          currentRy = tmpMap["ry"]["value"];

          newProgram = `${currentProgram.slice(0, start)}${fillzero(currentRx)}, ${fillzero(currentRy)}${currentProgram.slice(end)}`;
          setProgram(newProgram);
          break;

        case 8:
          start = tmpMap["rx"]["start"];
          end = tmpMap["ry"]["end"];

          currentRx = tmpMap["rx"]["value"];
          currentRy = Math.abs(tmpMap["point"]["value"][1] + tmpMap["ry"]["value"] - currentY);

          newProgram = `${currentProgram.slice(0, start)}${fillzero(currentRx)}, ${fillzero(currentRy)}${currentProgram.slice(end)}`;
          setProgram(newProgram);
          break;

        default:
      }
    }
  }

  // ゼロ埋めを見た目消す
  const deleteZeroPadding = (program) => {
    return program.replace(/[^\da-f](\d{3})[^\da-f]/gi, (match) => {
      if (match[1] === '0' && match[2] === '0') {
        return match[0] + match[3] + match[4]
      } else if (match[1] === '0') {
        return match[0] + match[2] + match[3] + match[4]
      } else {
        return match;
      }
    })
  }

  const drawObject = (currentX, currentY) => {
    let currentProgram = program;
    let leftUpX;
    let leftUpY;
    let width;
    let height;

    let optionalNewLine;

    setCounter(counter + 1);

    switch (drawMode) {
      case 0:
        optionalNewLine = (currentProgram === "" ) ? "" : "\n";

        currentProgram += `${optionalNewLine}line${counter} = line([${fillzero(startX)}, ${fillzero(startY)}], [${fillzero(currentX)}, ${fillzero(currentY)}], "${color}")`
        setProgram(currentProgram)
        break;

      case 1:
        optionalNewLine = (currentProgram === "" ) ? "" : "\n";

        leftUpX = Math.min(startX, currentX);
        leftUpY = Math.min(startY, currentY);
        width = Math.max(startX, currentX) - leftUpX;
        height = Math.max(startY, currentY) - leftUpY;

        currentProgram += `${optionalNewLine}rect${counter} = rect([${fillzero(leftUpX)}, ${fillzero(leftUpY)}], ${fillzero(width)}, ${fillzero(height)}, "${color}")`
        setProgram(currentProgram)
        break;

      case 2:
        optionalNewLine = (currentProgram === "" ) ? "" : "\n";

        const centerX = Math.floor((startX + currentX) / 2);
        const centerY = Math.floor((startY + currentY) / 2);
        const rx = Math.max(startX, currentX) - centerX;
        const ry = Math.max(startY, currentY) - centerY;

        currentProgram += `${optionalNewLine}ellipse${counter} = ellipse([${fillzero(centerX)}, ${fillzero(centerY)}], ${fillzero(rx)}, ${fillzero(ry)}, "${color}");`
        setProgram(currentProgram)
        break;

      case 3:
        leftUpX = Math.min(startX, currentX);
        leftUpY = Math.min(startY, currentY);
        width = Math.max(startX, currentX) - leftUpX;
        height = Math.max(startY, currentY) - leftUpY;

        let index = 0;
        for (const node of groupProgramNodes.body) {
          if (node.type === "ExpressionStatement") {
            const data = renderFigureData(node);

            switch (data.type) {
              case "line":
                optionalNewLine = (currentProgram === "" ) ? "" : "\n";

                const newStartX = Math.floor(leftUpX + data.p1[0]*width/600);
                const newStartY = Math.floor(leftUpY + data.p1[1]*height/600);
                const newEndX = Math.floor(leftUpX + data.p2[0]*width/600);
                const newEndY = Math.floor(leftUpY + data.p2[1]*height/600);
                currentProgram += `${optionalNewLine}line${counter + index} = line([${fillzero(newStartX)}, ${fillzero(newStartY)}], [${fillzero(newEndX)}, ${fillzero(newEndY)}], "${data.color}")`
                break;

              case "rect":
                optionalNewLine = (currentProgram === "" ) ? "" : "\n";

                const newLeftUpX = Math.floor(leftUpX + data.p[0]*width/600);
                const newLeftUpY = Math.floor(leftUpY + data.p[1]*height/600);
                const newWidth = Math.floor(data.width*width/600);
                const newHeight = Math.floor(data.height*height/600);
                currentProgram += `${optionalNewLine}rect${counter + index} = rect([${fillzero(newLeftUpX)}, ${fillzero(newLeftUpY)}], ${fillzero(newWidth)}, ${fillzero(newHeight)}, "${data.color}")`
                break;

              case "ellipse":
                optionalNewLine = (currentProgram === "" ) ? "" : "\n";

                const newCx = Math.floor(leftUpX + data.p[0]*width/600);
                const newCy = Math.floor(leftUpY + data.p[1]*height/600);
                const newRx = Math.floor(data.rx*width/600);
                const newRy = Math.floor(data.ry*height/600);
                currentProgram += `${optionalNewLine}ellipse${counter + index} = ellipse([${fillzero(newCx)}, ${fillzero(newCy)}], ${fillzero(newRx)}, ${fillzero(newRy)}, "${data.color}")`
                break;
              
              default:
        
            }
          }

          index++;
        }

        setCounter(counter + index)
        setProgram(currentProgram)
        break;

      default:

    }
  }

  const deleteObject = (currentX, currentY) => {  
    if (currentX <= 0 || currentX >= 600) return;
    if (currentY <= 0 || currentY >= 600) return;

    let min = 100000000000000;
    let tmpMap;

    if (pointsToPos && pointsToPos.length > 0) {
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
      const newProgram = `${currentProgram.slice(0, start)}${currentProgram.slice(end+1)}`
        .replace("\n\n", "\n")
        .replace(/^\n/, "");
      setProgram(newProgram);
    }
  }

  const changeColor = (currentX, currentY) => {  
    if (currentX <= 0 || currentX >= 600) return;
    if (currentY <= 0 || currentY >= 600) return;

    let min = 100000000000000;
    let tmpMap;

    if (pointsToPos && pointsToPos.length > 0) {
      for (const m of pointsToPos) {
        const tmp = (currentX - m["point"]["value"][0]) * (currentX - m["point"]["value"][0]) 
          + (currentY - m["point"]["value"][1]) * (currentY - m["point"]["value"][1]);
        if (tmp < min) {
          min = tmp;
          tmpMap = m;
        }
      }

      const start = tmpMap["color"]["start"];
      const end = tmpMap["color"]["end"];

      const currentProgram = program;
      const newProgram = `${currentProgram.slice(0, start)}"${color}"${currentProgram.slice(end)}`
      setProgram(newProgram);
    }
  }

  const changeVarName = (currentX, currentY) => {  
    if (currentX <= 0 || currentX >= 600) return;
    if (currentY <= 0 || currentY >= 600) return;

    let min = 100000000000000;
    let tmpMap;

    if (pointsToPos && pointsToPos.length > 0) {
      for (const m of pointsToPos) {
        const tmp = (currentX - m["point"]["value"][0]) * (currentX - m["point"]["value"][0]) 
          + (currentY - m["point"]["value"][1]) * (currentY - m["point"]["value"][1]);
        if (tmp < min) {
          min = tmp;
          tmpMap = m;
        }
      }

      const start = tmpMap["name"]["start"];
      const end = tmpMap["name"]["end"];

      const currentProgram = program;
      const newProgram = `${currentProgram.slice(0, start)}${varName.replace(" ", "")}${currentProgram.slice(end)}`
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
              <Modal open={modalState} onClose={handleModalClose}>
                <Modal.Title>New group is set.</Modal.Title>
              </Modal>
              { displayColorPicker ? <div style={ styles.popover }>
                <div style={ styles.cover } onClick={ handleColorPickerClose }/>
                <SketchPicker presetColors={defaultColors} color={ color } onChange={ handleColorPickerChange } />
              </div> : null }
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
                {optionalSVGComponent}
              </svg>
            </div>
            <div className="panel">
              <Checkbox checked={isWidgetsOn} onChange={handleWidgetCheckBoxClick}>Show Widgets</Checkbox>&nbsp;&nbsp;&nbsp;
              <a href="https://github.com/7ma7X/react-sketch-n-sketch/blob/master/README.md" target="_blank" rel="noopener noreferrer">README</a>
              <Spacer y={1}/>
              <Radio.Group value={mode} onChange={handleMode} useRow>
                <Radio value={0}>DRAW</Radio>
                <Radio.Group style={{opacity: (mode===0) ? 1: 0.2}}value={drawMode} onChange={handleDrawMode} useRow>
                  <Spacer x={2}/>
                  <Radio value={0}>line</Radio>
                  <Radio value={1}>rectangle</Radio>
                  <Radio value={2}>ellipse</Radio>
                  <Radio value={3}>group</Radio>
                </Radio.Group>
              </Radio.Group>
              <Spacer y={1}/>
              <Radio.Group value={mode} onChange={handleMode} useRow>
                <Radio value={3}>CHANGE COLOR</Radio>
                <Spacer x={1}/>
                <div style={ styles.swatch } onClick={ handleColorPickerClick }>
                  <div style={ styles.color } />
                </div>
                <Spacer x={1}/>
                <Radio value={1}>MOVE</Radio>
                <Spacer x={1}/>
                <Radio value={2}>DELETE</Radio>
                <Spacer x={1}/>
                <Button size="mini" onClick={handleGroupButtonClick}>Make Group</Button>
              </Radio.Group>
              <Spacer y={1}/>
              <Radio.Group value={mode} onChange={handleMode} useRow>
                <Radio value={4}>CHANGE VARIABLE NAME</Radio>
                <Spacer x={1}/>
                <Input label="new name" initialValue="" onChange={handleInputChange} />
              </Radio.Group>
            </div>
          </div>
          <br/>
        </div>
      </div>
    ) : (
      <div className="App"><br/>Please let window width be over 1220px<br/>画面の横幅を 1220px より大きくしてリロードしてください。</div>
    )
  );
}

export default App;
