export interface CallToActionProps {
  size: "sm" | "md" | "lg";
  isGray?: boolean;
}
export default function CallToAction(props: CallToActionProps) {
  let sizeClass = "";
  let color = "bg-primary-500";
  if (props.size === "lg") {
    sizeClass = "p-2 md:p-4 md:text-xl";
  } else if (props.size === "md") {
    sizeClass = "p-2 text-md";
  } else if (props.size === "sm") {
    sizeClass = "p-1 text-sm";
  }
  if (props.isGray) {
    color = "bg-gray-800";
  }
  return <button className={`${color} ${sizeClass}`}>Rendez-vous</button>;
}
