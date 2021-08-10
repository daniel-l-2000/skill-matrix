export interface ToastData {
  title: string;
  description?: string;
  time: Date;
}

export interface ToastContextModel {
  toasts: ToastData[];
  showToast: (title: string, description?: string) => void;
}
