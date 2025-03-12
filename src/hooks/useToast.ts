import {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
  showWarningToast,
} from '@/lib/notificationToasts';

export function useToast() {
  return {
    showSuccessToast,
    showErrorToast,
    showInfoToast,
    showWarningToast,
  };
}
