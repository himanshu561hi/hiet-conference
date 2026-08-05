import { useState, useEffect, useRef } from 'react';
import { handleApiError } from '../utils/apiErrorHandler';

/**
 * Debounces a save function to automatically persist drafts
 * @param {Function} saveFn The API function to call (e.g. updateDraft)
 * @param {Number} delay Ms to wait before triggering save (default: 2000)
 */
export const useAutosave = (saveFn, delay = 2000) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const saveTimeoutRef = useRef(null);

  const triggerSave = (payload) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        setIsSaving(true);
        await saveFn(payload);
        setLastSaved(new Date());
      } catch (err) {
        handleApiError(err, 'Autosave failed.');
      } finally {
        setIsSaving(false);
      }
    }, delay);
  };

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  return { isSaving, lastSaved, triggerSave };
};
