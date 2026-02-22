"use client";
import "../../style/components/commons/Button.css";

export default function Button({ text, onClick, style, id }) {
  return (
    <button id={id} className="button" style={style} onClick={onClick}>
      {text}
    </button>
  );
}
