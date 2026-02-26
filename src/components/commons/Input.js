import React from "react";
import "../../style/components/commons/Input.css";

export default function Input({ darkInput = false, format, onChange, ...props }) {

  const handleChange = (e) => {
    let value = e.target.value;

    if (format === "card") {
      value = value.replace(/\D/g, "");
      value = value.substring(0, 16);
      value = value.replace(/(.{4})/g, "$1 ").trim();
    }

    if (format === "expiration") {
      value = value.replace(/\D/g, "");
      value = value.substring(0, 4);

      if (value.length >= 3) {
        value = value.replace(/(\d{2})(\d{1,2})/, "$1/$2");
      }
    }

    if (format === "cvc") {
      value = value.replace(/\D/g, "");
      value = value.substring(0, 3);
    }

    e.target.value = value;

    if (onChange) onChange(e);
  };

  return (
    <input
      {...props}
      onChange={handleChange}
      className={
        props.type === "radio"
          ? ""
          : darkInput
          ? "dark-input"
          : "light-input"
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
