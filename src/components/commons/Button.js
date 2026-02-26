"use client";
import "../../style/components/commons/Button.css";

export default function Button({ type, text, onClick, style, id, disabled}) {
  return (
    <button type={type} id={id} className="button" style={style} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
}
