export interface Column {
  id: number;
  title: string;
  field: keyof Row;
  style?: object;
  className?: string;
}

export interface Row {
  id: number;
  name: string;
  nivel: string;
  contato: string;
  status: string;
}

export interface DataTableBasic {
  columns: Column[];
  rows: Row[];
  title: string;
  action?: boolean;
}
