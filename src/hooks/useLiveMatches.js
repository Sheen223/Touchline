// src/hooks/useLiveMatches.js
import { useMatchContext } from '../context/MatchContext';

export const useLiveMatches = () => {
  return useMatchContext();
};