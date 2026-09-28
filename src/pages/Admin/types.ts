import { ReactNode } from 'react';

export type FieldType = 'text' | 'email' | 'tel' | 'select' | 'date' | 'time' | 'datetime-local' | 'number' | 'textarea' | 'badge';

export interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => ReactNode;
  width?: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface FormField {
  key: string;
  label: string;
  type: FieldType;
  options?: SelectOption[];
  required?: boolean;
  span?: 'full' | 'half';
  placeholder?: string;
  readOnly?: boolean;
}

export interface DetailField {
  key: string;
  label: string;
  render?: (value: any, row: any) => ReactNode;
  wide?: boolean;
}

export interface ModuleConfig {
  id: string;
  title: string;
  icon: ReactNode;
  columns: Column[];
  fields: FormField[];
  detailFields?: DetailField[];
  detailTitle?: (row: any) => string;
  detailSubtitle?: (row: any) => string;
  data: any[];
  addLabel?: string;
  avatarKey?: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
  children?: NavItem[];
}

export type SlideOverMode = 'create' | 'edit';

export interface SlideOverState {
  open: boolean;
  mode: SlideOverMode;
  row: any | null;
}

export interface DetailState {
  open: boolean;
  row: any | null;
}
