import React from "react";
import "../../style/components/commons/Input.css";

export default function Input({ darkInput = false, ...props }) {
  return (
    <input
      {...props}
      className={
        props.type === "radio" ? "" : darkInput ? "dark-input" : "light-input"
      }
    />
  );
}

export const DropDown = ({ options, name, defaultValue }) => {
  return (
    <select name={name} id={name} className="dropdown">
      <option value="" disabled selected>
        {defaultValue}
      </option>
      {options.map((option, index) => (
        <option key={index} value={option.toLocaleLowerCase()}>
          {option}
        </option>
      ))}
    </select>
  );
};
