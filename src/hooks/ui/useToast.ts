import {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
  showWarningToast,
} from '@/lib/utils/notificationToasts';

export function useToast() {
  return {
    showSuccessToast,
    showErrorToast,
    showInfoToast,
    showWarningToast,
  };
}
