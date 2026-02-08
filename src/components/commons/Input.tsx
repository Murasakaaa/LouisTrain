import React from "react";
import "../../style/components/commons/Input.css";

export default function Input({
  type,
  name,
  placeholder,
  darkInput,
}: {
  type: string;
  name: string;
  placeholder: string;
  darkInput: boolean;
}) {
  return (
    <input
      type={type}
      name={name}
      id={name}
      placeholder={placeholder}
      className={darkInput ? "dark-input" : "light-input"}
    />
  );
}

export const DropDown = ({
  options,
  name,
}: {
  options: string[];
  name: string;
}) => {
  return (
    <select name={name} id={name} className="dropdown">
      {options.map((option, index) => (
        <option key={index} value={option.toLocaleLowerCase()}>
          {option}
        </option>
      ))}
    </select>
  );
};
