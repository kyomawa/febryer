import ContentHeader from "../../components/ContentHeader";
import ColorPicker from "./colorPicker";

export default function General() {
  return (
    <div>
      <ContentHeader title="Général" refreshTagNameButton="Général" />
      <div className="flex flex-row gap-4">
        <div>
          <ColorPicker type="primary" />
        </div>
        <div>
          <ColorPicker type="secondary" />
        </div>
      </div>
    </div>
  );
}
