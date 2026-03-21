import ComponentCard from "../../common/ComponentCard";
import Switch from "../switch/Switch";

export default function ToggleSwitch(label: string) {
  return (
    <ComponentCard title="Toggle switch input">
      <div className="flex gap-4">
        <Switch label={label} defaultChecked={true} />
      </div>
    </ComponentCard>
  );
}
