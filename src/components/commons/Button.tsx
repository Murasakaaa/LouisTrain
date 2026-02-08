import "../../style/components/commons/Button.css";

export default function Button({
  text,
  onClick,
  style,
}: {
  text: string;
  onClick: () => void;
  style: {};
}) {
  return (
    <button className="button" style={style} onClick={onClick}>
      {text}
    </button>
  );
}
