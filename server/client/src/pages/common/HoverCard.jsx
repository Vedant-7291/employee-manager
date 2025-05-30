import { motion } from 'framer-motion';

const HoverCard = ({ children, className = '' }) => {
  return (
    <motion.div
      className={`${className} relative overflow-hidden group`}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {children}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={{ opacity: 0 }}
      />
    </motion.div>
  );
};

export default HoverCard;