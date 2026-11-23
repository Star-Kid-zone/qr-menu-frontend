export interface SubTabOption<T extends string = string> {
  id: T;
  label: string;
}

export interface SubTabPillsProps<T extends string = string> {
  options: SubTabOption<T>[];
  active: T;
  onChange: (id: T) => void;
}
