import { showError, showWarning } from './toastHelpers';

export const handleApiError = (error, customMessage = null) => {
  if (!error.response) {
    showError(customMessage || 'Network Error. Please check your connection.');
    return;
  }

  const { status, data } = error.response;
  const { code, message, errors } = data;

  // Specific Error Code Overrides based on 34_REGISTRATION_ERROR_CODES.md
  switch (code) {
    case 'REG_002':
      showWarning('Action Blocked: The registration is currently locked.');
      break;
    case 'REG_006':
      showWarning('Only the Team Leader can perform this action.');
      break;
    case 'REG_008':
      showError('Upload Failed: File exceeds the 10MB maximum limit.');
      break;
    default:
      if (status === 400 && errors && errors.length > 0) {
        showError(errors[0].message || 'Validation failed.');
      } else {
        showError(customMessage || message || 'An unexpected error occurred.');
      }
  }
};
