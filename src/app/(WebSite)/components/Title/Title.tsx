export interface TitleProps {
  paragraph?: string;
  title: string;
}
export default function Title(props: TitleProps) {
  return (
    <div>
      <p className="text-md font-semibold text-gray-500">{props.paragraph}</p>
      <h1 className="text-4xl font-bold">{props.title}</h1>
    </div>
  );
}
