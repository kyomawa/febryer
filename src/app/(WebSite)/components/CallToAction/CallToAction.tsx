export interface CallToActionProps {
  size: "sm" | "md" | "lg";
  isGray?: boolean;
}
export default function CallToAction(props: CallToActionProps) {
  let sizeClass = "";
  let color = "bg-primary";

  if (props.size === "lg") {
    sizeClass = "p-3 text-lg";
  } else if (props.size === "md") {
    sizeClass = "p-2 text-md";
  } else if (props.size === "sm") {
    sizeClass = "p-2 text-sm";
  }

  if (props.isGray) {
    color = "bg-secondary";
  }
  return (
    <button
      className={`${color} ${sizeClass} text-white duration-150 hover:brightness-75`}
    >
      Rendez-vous
    </button>
  );
}
