import { useAuth } from '../context/AuthContext';

export const usePermissions = (team) => {
  const { user } = useAuth();

  if (!team || !user) {
    return { isLeader: false, isMember: false, canEdit: false, isLocked: true };
  }

  const isLeader = team.leader?._id === user._id || team.leader === user._id;
  const isMember = team.members?.some(m => (m.user?._id || m.user) === user._id);
  const isLocked = team.isLocked === true;

  return { 
    isLeader, 
    isMember, 
    canEdit: isLeader && !isLocked,
    isLocked
  };
};
