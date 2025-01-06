export interface CallToActionProps {
  size?: "sm" | "md" | "lg";
}
export default function CallToAction(props: CallToActionProps) {
  let sizeClass = "";
  if (props.size === "lg") {
    sizeClass = "p-2 md:p-4 md:text-xl";
  } else if (props.size === "md") {
    sizeClass = "p-2 text-md";
  } else if (props.size === "sm") {
    sizeClass = "p-1 text-sm";
  }
  return <button className={`bg-primary-500 ${sizeClass}`}>Rendez-vous</button>;
}
