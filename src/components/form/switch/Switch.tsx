import { useState, useEffect } from "react";

interface SwitchProps {
  label: string;
  checked?: boolean; // 🔥 controlado
  defaultChecked?: boolean; // 🔥 fallback
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  color?: "blue" | "gray";
}

const Switch: React.FC<SwitchProps> = ({
  label,
  checked,
  defaultChecked = false,
  disabled = false,
  onChange,
  color = "blue",
}) => {
  const isControlled = checked !== undefined;

  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  // 🔥 valor final (controlado ou não)
  const isChecked = isControlled ? checked : internalChecked;

  // 🔥 sincroniza quando mudar externamente
  useEffect(() => {
    if (isControlled) return;
    setInternalChecked(defaultChecked);
  }, [defaultChecked, isControlled]);

  const handleToggle = () => {
    if (disabled) return;

    const newValue = !isChecked;

    // 🔥 só atualiza interno se NÃO for controlado
    if (!isControlled) {
      setInternalChecked(newValue);
    }

    onChange?.(newValue);
  };

  const switchColors =
    color === "blue"
      ? {
          background: isChecked
            ? "bg-brand-500"
            : "bg-gray-200 dark:bg-white/10",
          knob: isChecked
            ? "translate-x-full bg-white"
            : "translate-x-0 bg-white",
        }
      : {
          background: isChecked
            ? "bg-gray-800 dark:bg-white/10"
            : "bg-gray-200 dark:bg-white/10",
          knob: isChecked
            ? "translate-x-full bg-white"
            : "translate-x-0 bg-white",
        };

  return (
    <label
      className={`flex cursor-pointer select-none items-center gap-3 text-sm font-medium ${
        disabled ? "text-gray-400" : "text-gray-700 dark:text-gray-400"
      }`}
      onClick={handleToggle}
    >
      <div className="relative">
        <div
          className={`block transition duration-150 ease-linear h-6 w-11 rounded-full ${
            disabled
              ? "bg-gray-100 pointer-events-none dark:bg-gray-800"
              : switchColors.background
          }`}
        />
        <div
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full shadow-theme-sm duration-150 ease-linear transform ${switchColors.knob}`}
        />
      </div>
      {label}
    </label>
  );
};

export default Switch;
