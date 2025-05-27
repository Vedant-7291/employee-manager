import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 8, color = 'text-blue-600' }) => {
  return (
    <div className="flex justify-center items-center">
      <motion.div
        className={`w-${size} h-${size} ${color} rounded-full border-4 border-t-transparent`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default LoadingSpinner;