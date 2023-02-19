import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";

export default function FileSelectBox(props) {
  const methods = useFormContext();
  return (
    <div className=" form-floating ">
      <input
        type={props.type}
        style={{ paddingTop: "2.2rem" }}
        className=" form-control form-control-lg "
        id="floatingInput"
        defaultValue={props.defaultValue}
        readOnly={props.readOnly}
        {...methods.register(props.DBname)}
      />
      <label htmlFor="floatingInput">{props.UIname}</label>
    </div>
  );
}
