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
  username: string;
  password: string;
  role_id: string;
  rolename?: string | null;
  status: boolean;
}

export interface PermissionActions {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export interface FormRolesUserData {
  id: number;
  name: string;
  description: string;
  crud: Record<string, PermissionActions>;
  status: boolean | number;
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

export type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  permission?: string;
  subItems?: {
    name: string;
    path: string;
    permission?: string;
    pro?: boolean;
    new?: boolean;
  }[];
};
