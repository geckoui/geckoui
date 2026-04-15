export interface SwitchSizeMap {
  sm: unknown;
  md: unknown;
}

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "size" | "type"> {
  onChange?: (checked: boolean) => void;
  size?: keyof SwitchSizeMap;
  thumbClassName?: string;
}
