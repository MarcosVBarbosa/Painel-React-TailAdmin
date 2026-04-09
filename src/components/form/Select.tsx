import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  value?: string;
  defaultValue?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Selecione uma opção",
  onChange,
  className = "",
  value: externalValue,
  defaultValue = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // O estado interno agora prioriza o valor que vem de fora (externalValue)
  const [internalValue, setInternalValue] = useState<string>(defaultValue);
  const containerRef = useRef<HTMLDivElement>(null);

  // Valor final que será exibido: se houver value externo, use-o; senão, use o interno.
  const currentValue =
    externalValue !== undefined ? externalValue : internalValue;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (value: string) => {
    setInternalValue(value);
    onChange(value);
    setIsOpen(false);
  };

  const selectedLabel = options.find((opt) => opt.value == currentValue)?.label;

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-12 w-full items-center justify-between rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
          isOpen
            ? "border-blue-500 ring-2 ring-blue-500/20 dark:border-blue-400"
            : "border-gray-200 bg-gray-50/30 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800/50"
        } ${currentValue ? "text-gray-800 dark:text-white" : "text-gray-400 dark:text-gray-500"}`}
      >
        <span className="truncate">{selectedLabel || placeholder}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-[9999] mt-2 w-full  overflow-hidden rounded-xl border border-gray-100 bg-white p-1 shadow-xl animate-in fade-in zoom-in duration-200 dark:border-gray-800 dark:bg-gray-900">
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleOptionClick(option.value)}
                className={`flex w-full items-center px-3 py-2.5 text-sm rounded-lg transition-colors ${
                  currentValue === option.value
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400"
                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/[0.03]"
                }`}
              >
                {option.label || "teste"}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Select;
