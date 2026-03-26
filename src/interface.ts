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
  usuario: string;
  status: string;
}

export interface DataTableBasic {
  columns: Column[];
  rows: Row[];
  title: string;
  new?: boolean;
  edit?: boolean;
  delete?: boolean;
}

export interface UserFormData {
  id?: string | number;
  name: string;
  departamento: string;
  usuario: string;
  nivel: string;
  status: boolean;
}

export interface UserFormProps {
  user?: UserFormData;
  onSave: (data: UserFormData) => void;
  onCancel: () => void;
}
