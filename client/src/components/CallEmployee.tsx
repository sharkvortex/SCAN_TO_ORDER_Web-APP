import { useState } from "react";
import { FaBell } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useCallEmployee } from "../hooks/useCallEmployee";
import toast from "react-hot-toast";
function CallEmployee() {
  const { callEmployee } = useCallEmployee();
  const [isRinging, setIsRinging] = useState(false);
  const [isCalled, setIsCalled] = useState(false);

  const handleCall = async () => {
    if (isRinging) return;

    setIsRinging(true);

    try {
      await callEmployee();
      setIsCalled(true);
    } catch (error) {
      toast.error("ไม่สามารถเรียกพนักงานได้ ลองใหม่อีกครั้ง");
      console.log(error);
    } finally {
      setTimeout(() => {
        setIsCalled(false);
        setIsRinging(false);
      }, 4000);
    }
  };

  return (
    <div className="absolute bottom-2 left-4 z-50 flex items-center">
      <motion.button
        onClick={handleCall}
        disabled={isRinging}
        whileTap={{ scale: 0.95 }}
        className={`relative flex items-center gap-1 rounded-full px-5 py-2 text-sm font-medium text-nowrap text-white shadow-lg transition-all duration-300 ${
          isCalled ? "bg-green-500" : "bg-red-500"
        } hover:cursor-pointer hover:shadow-xl focus:outline-none`}
        aria-label="เรียกพนักงาน"
      >
        <motion.div
          animate={isRinging ? { rotate: [0, -15, 15, -10, 10, 0] } : {}}
          transition={{ duration: 0.5, repeat: isRinging ? 3 : 0 }}
        >
          <FaBell className="text-lg" />
        </motion.div>

        <motion.span
          animate={isRinging ? { opacity: [1, 0.8, 1] } : { opacity: 1 }}
          transition={{
            duration: 1,
            repeat: isRinging ? Infinity : 0,
            repeatType: "reverse",
          }}
        >
          {isRinging ? "เรียกพนักงานแล้ว" : "เรียกพนักงาน"}
        </motion.span>

        <AnimatePresence>
          {isRinging && (
            <>
              <motion.span
                key="ring-outer"
                initial={{ scale: 0.5, opacity: 0.7 }}
                animate={{ scale: 3, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.5,
                  ease: "easeOut",
                  repeat: 1,
                }}
                className="pointer-events-none absolute inset-0 rounded-full bg-yellow-400/30"
              />
              <motion.span
                key="ring-inner"
                initial={{ scale: 0.5, opacity: 0.5 }}
                animate={{ scale: 4, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 2,
                  ease: "easeOut",
                  delay: 0.3,
                  repeat: 1,
                }}
                className="pointer-events-none absolute inset-0 rounded-full bg-yellow-300/20"
              />
            </>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isCalled && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 10 }}
            className="ml-3 rounded-full bg-white px-4 py-1 text-sm text-gray-800 shadow-md"
          >
            <motion.span
              animate={{ opacity: [0.6, 1] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              เรียกพนักงานแล้วครับ/ค่ะ...
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CallEmployee;
