import { useState, useEffect } from 'react';

/**
 * Calculates percentage completion based on the current registration flow states.
 */
export const useRegistrationProgress = (registrationState, teamState) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!registrationState) {
      setProgress(0);
      return;
    }

    let score = 0;
    const maxScore = 5; // Profile, Team, Paper Details, PDF, Declaration

    // 1. Profile Complete (Assume true if they are logged in and routed here)
    score += 1;

    // 2. Team Complete
    if (teamState && (teamState.teamType === 'Solo' || teamState.members.length > 1)) {
      score += 1;
    }

    // 3. Paper Details
    if (registrationState.title && registrationState.abstract) {
      score += 1;
    }

    // 4. File Uploaded
    if (registrationState.fileUrl) {
      score += 1;
    }

    // 5. Declaration
    if (registrationState.declarationChecked) {
      score += 1;
    }

    setProgress(Math.round((score / maxScore) * 100));
  }, [registrationState, teamState]);

  return progress;
};
