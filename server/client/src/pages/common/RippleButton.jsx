import { motion } from 'framer-motion';

const RippleButton = ({ children, onClick, className = '' }) => {
  return (
    <motion.button
      className={`${className} relative overflow-hidden`}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
      <motion.span
        className="absolute top-0 left-0 w-full h-full bg-white opacity-0"
        initial={{ scale: 0, opacity: 0.5 }}
        animate={{ scale: 10, opacity: 0 }}
        transition={{ duration: 0.6 }}
      />
    </motion.button>
  );
};

export default RippleButton;