import toast from 'react-hot-toast';

export const showSuccess = (message) => toast.success(message, { duration: 4000 });
export const showError = (message) => toast.error(message, { duration: 5000 });
export const showWarning = (message) => toast(message, { icon: '⚠️', duration: 4000 });
export const showLoading = (message) => toast.loading(message);
export const dismissToast = (toastId) => toast.dismiss(toastId);
