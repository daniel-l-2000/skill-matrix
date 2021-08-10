export type IconType = "info" | "success" | "warning" | "danger";

export interface ToastData {
  title: string;
  icon: IconType;
  description?: string;
  time: Date;
}

export interface ToastContextModel {
  toasts: ToastData[];
  showToast: (title: string, icon: IconType, description?: string) => void;
}
