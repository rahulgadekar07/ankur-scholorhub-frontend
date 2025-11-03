import { createContext, useState, useContext } from "react";
import Confetti from "react-confetti";

const ConfettiContext = createContext();

export const useConfetti = () => useContext(ConfettiContext);

export const ConfettiProvider = ({ children }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  const triggerConfetti = (duration = 5000) => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), duration);
  };

  return (
    <ConfettiContext.Provider value={{ showConfetti, triggerConfetti }}>
      {children}
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}
    </ConfettiContext.Provider>
  );
};
