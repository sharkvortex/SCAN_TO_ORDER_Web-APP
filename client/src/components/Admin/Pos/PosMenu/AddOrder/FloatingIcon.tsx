// FloatingIcon.tsx
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

interface FloatingIconProps {
  onClick: () => void;
}

function FloatingIcon({ onClick }: FloatingIconProps) {
  return (
    <motion.div
      onClick={onClick}
      drag
      dragMomentum
      dragElastic={0.3}
      dragTransition={{ bounceStiffness: 200, bounceDamping: 10 }}
      className="fixed right-4 bottom-24 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg transition-all hover:bg-indigo-600"
    >
      <ShoppingCart size={24} />
    </motion.div>
  );
}

export default FloatingIcon;
