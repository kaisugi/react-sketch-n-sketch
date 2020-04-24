import React from 'react';
import './App.css';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-monokai";

function App() {
  return (
    <div className="App">
      <div className="wrapper">
        <AceEditor
          mode="javascript"
          theme="monokai"
          name="UNIQUE_ID_OF_DIV"
          width="50%"
          height="100vh"
          fontSize={20}
          editorProps={{ $blockScrolling: true }}
          value={`function onLoad(editor) {
  console.log("i've loaded");
}`}
        />
        <svg width="500" height="500" >
          <line x1="10" y1="10" x2="300" y2="300" style={{stroke:"rgb(255,0,0)",strokeWidth:2}} />
        </svg>
      </div>
    </div>
  );
}

export default App;
