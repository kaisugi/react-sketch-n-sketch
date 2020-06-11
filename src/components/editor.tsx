import React from 'react';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

export default (props) => {
  return (
    <AceEditor
      mode="javascript"
      theme="monokai"
      name="UNIQUE_ID_OF_DIV"
      width="600px"
      height="100vh"
      fontSize={16}
      editorProps={{ $blockScrolling: true }}
      value={props.program}
      onChange={props.onChange}
    />
  )
}