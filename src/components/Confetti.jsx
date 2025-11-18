import ReactConfetti from 'react-confetti';
import { useWindowSize } from '../hooks/useWindowSize';

/**
 * Confetti Component - Win animation
 * Triggered when user wins the auction
 */

export const Confetti = ({ show }) => {
  const { width, height } = useWindowSize();

  if (!show) return null;

  return (
    <ReactConfetti
      width={width}
      height={height}
      recycle={false}
      numberOfPieces={500}
      gravity={0.3}
      colors={['#ff3366', '#ffd700', '#00ff88', '#00ccff', '#ff66cc']}
    />
  );
};
