export interface Column<T> {
  id: number;
  title: string;
  field: keyof T;
  style?: object;
  className?: string;
}

export interface DataTableBasic<T> {
  columns: Column<T>;
  rows: T[];
  title: string;
  new?: boolean;
  edit?: boolean;
  delete?: boolean;
}

export interface UserFormData {
  id: number;
  name: string;
  usuario: string;
  nivel: string;
  status: boolean;
}

export interface PermissionsUserFormData {
  id: number;
  name: string;
  status: boolean;
}

export interface FormPropsCustom<T> {
  data?: [];
  onSave: (data: T) => void;
  onCancel: () => void;
}

export interface CardBasicProps {
  headerContent?: React.ReactNode;
  bodyContent?: React.ReactNode;
  footerContent?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}
