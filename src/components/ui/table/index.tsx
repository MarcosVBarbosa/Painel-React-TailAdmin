// src/components/ui/table.tsx
import {
  ReactNode,
  ThHTMLAttributes,
  TdHTMLAttributes,
  HTMLAttributes,
} from "react";

/* ---------- Tipagens ---------- */
interface TableProps {
  children: ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
  className?: string;
}

interface TableCellProps
  extends
    ThHTMLAttributes<HTMLTableCellElement>,
    TdHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
  isHeader?: boolean;
  className?: string;
}

/** NOVO */
interface TableFooterProps {
  children: ReactNode;
  className?: string;
}

/* ---------- Componentes ---------- */

// Table component:
const Table: React.FC<TableProps> = ({ children, className }) => {
  return <table className={`w-full ${className ?? ""}`}>{children}</table>;
};

const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return <thead className={className}>{children}</thead>;
};

const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return <tbody className={className}>{children}</tbody>;
};

const TableRow: React.FC<TableRowProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <tr className={className} {...props}>
      {children}
    </tr>
  );
};

const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  className,
  ...props
}) => {
  const CellTag = (isHeader ? "th" : "td") as "th" | "td";
  return (
    <CellTag className={className} {...props}>
      {children}
    </CellTag>
  );
};

/** NOVO: TableFooter */
const TableFooter: React.FC<TableFooterProps> = ({ children, className }) => {
  return <tfoot className={className}>{children}</tfoot>;
};

export { Table, TableHeader, TableBody, TableRow, TableCell, TableFooter };
