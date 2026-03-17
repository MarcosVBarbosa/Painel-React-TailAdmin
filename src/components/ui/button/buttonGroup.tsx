import { ReactNode } from "react";

interface ButtonGroupProps {
  children: ReactNode;
  className?: string;
}

const ButtonGroup = ({ children, className = "" }: ButtonGroupProps) => {
  const items = Array.isArray(children) ? children : [children];

  return (
    <div className={`inline-flex ${className}`}>
      {items.map((child, index) => {
        const isFirst = index === 0;
        const isLast = index === items.length - 1;

        return (
          <div
            key={index}
            className={`
              ${!isFirst ? "-ml-px" : ""}
              [&>button]:rounded-none
              ${isFirst ? "[&>button]:rounded-l-sm" : ""}
              ${isLast ? "[&>button]:rounded-r-sm" : ""}
            `}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};

export default ButtonGroup;
