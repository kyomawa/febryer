import ContentHeader from "../../components/ContentHeader";
import ColorPicker from "./colorPicker";

export default function General() {
  return (
    <div>
      <ContentHeader title="Général" refreshTagNameButton="Général" />
      <ColorPicker />
    </div>
  );
}
