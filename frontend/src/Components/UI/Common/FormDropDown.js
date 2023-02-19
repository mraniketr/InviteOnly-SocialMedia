import React from "react";
import { useFormContext } from "react-hook-form";

export default function FormDropDown(props) {
  const methods = useFormContext();
  return (
    <div className="form-floating mb-2 ">
      <select
        className="form-select"
        aria-label="Default select example"
        disabled={props.readOnly}
        {...methods.register(props.DBname)}
      >
        {props.defaultValue ? (
          <option
            value={props.defaultValue}
            defaultValue
            {...methods.register(props.DBname)}
          >
            {props.defaultValue}
          </option>
        ) : (
          ""
        )}
        {props.values.map((x, i) => {
          return (
            <option key={x} value={x} id={i}>
              {x}
            </option>
          );
        })}
      </select>
      <label htmlFor="floatingInput">{props.UIname}</label>
    </div>
  );
}
