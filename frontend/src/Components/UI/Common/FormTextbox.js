import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";

export default function Textbox(props) {
  const methods = useFormContext();
  return (
    <div className="form-floating ">
      <input
        type={props.type}
        className="form-control "
        id="floatingInput"
        defaultValue={props.defaultValue}
        readOnly={props.readOnly}
        {...methods.register(props.DBname)}
      />
      <label htmlFor="floatingInput">{props.UIname}</label>
    </div>
  );
}
