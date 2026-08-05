export const cardHoverVariant = {
  rest: { scale: 1, y: 0, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" },
  hover: { 
    scale: 1.02, 
    y: -5, 
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

export const cardEntryVariant = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } 
  }
};
