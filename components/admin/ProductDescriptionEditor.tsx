"use client";
import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";

function ProductDescriptionEditor() {
  const [value, setValue] = useState<string | undefined>("**Hello world!!!**");
  return (
    <div className="container">
      <MDEditor value={value} onChange={setValue} height={400} />
      {/* Optional: Add a live preview separately */}
      <MDEditor.Markdown
        source={value}
        //    style={{ whiteSpace: "pre-wrap" }}
      />
    </div>
  );
}

export default ProductDescriptionEditor;
