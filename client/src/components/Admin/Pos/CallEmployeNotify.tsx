import { useEffect, useRef, useState } from "react";
import { useSoundNotify } from "../../../contexts/SoundContext/SoundNotifyContext";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { MdWavingHand } from "react-icons/md";

function CallEmployeeNotify() {
  const { callEmployeeData, clearCallEmployee } = useSoundNotify();
  const [latestCall, setLatestCall] = useState<{
    tableNumber: number;
    time: string;
  } | null>(null);
  const [isRinging, setIsRinging] = useState(false);
  const [visible, setVisible] = useState(false);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (callEmployeeData.length === 0) return;

    const lastItem = callEmployeeData[callEmployeeData.length - 1];

    const isNew =
      !latestCall ||
      lastItem.tableNumber !== latestCall.tableNumber ||
      lastItem.time !== latestCall.time;

    if (isNew) {
      setLatestCall(lastItem);
      triggerBellAnimation();
      setVisible(true);
    }
  }, [callEmployeeData, latestCall]);

  const triggerBellAnimation = () => {
    setIsRinging(true);
    setTimeout(() => setIsRinging(false), 2000);
  };

  return (
    <>
      {!visible && (
        <div
          onClick={() => setVisible(true)}
          className="fixed top-35 right-5 z-50 rounded-full bg-blue-500 p-3 hover:cursor-pointer"
        >
          <MdWavingHand className="text-white" size={20} />
        </div>
      )}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 right-5 z-50 w-[350px] rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center text-lg font-semibold text-red-600">
                <span
                  className={`inline-block ${
                    isRinging ? "animate-[ring_0.5s_ease-in-out]" : ""
                  }`}
                >
                  🔔
                </span>
                <span className="ml-2">เรียกพนักงาน</span>
              </h2>

              <div className="flex items-center gap-2">
                {callEmployeeData.length > 0 && (
                  <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-600">
                    {callEmployeeData.length} รายการ
                  </span>
                )}
                <button
                  onClick={() => setVisible(false)}
                  className="text-gray-400 transition hover:cursor-pointer hover:text-red-500"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-2">
              <button
                onClick={() => {
                  clearCallEmployee();
                  setLatestCall(null);
                  setVisible(false);
                }}
                className="rounded-md bg-red-100 px-3 py-1 text-xs font-medium text-red-600 transition hover:cursor-pointer hover:bg-red-200"
              >
                เคลียร์ค่า
              </button>
              <span className="text-xs text-red-400 italic">
                #ข้อมูลแสดงชั่วคราวเท่านั้น
              </span>
            </div>

            {latestCall && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-4 animate-pulse rounded-lg border border-red-100 bg-red-50 p-3"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm text-gray-500">โต๊ะล่าสุด</span>
                  <span className="text-lg font-bold text-red-600">
                    โต๊ะ {latestCall.tableNumber}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">เวลา</span>
                  <span className="font-medium text-gray-700">
                    เมื่อ {latestCall.time}
                  </span>
                </div>
              </motion.div>
            )}

            <div className="max-h-[40vh] overflow-y-auto pr-1">
              {[...callEmployeeData]
                .filter(
                  (item) =>
                    item.tableNumber !== latestCall?.tableNumber ||
                    item.time !== latestCall?.time,
                )
                .reverse()
                .map((item, index) => (
                  <div
                    key={index}
                    className="mb-2 rounded-lg border border-gray-100 bg-gray-50 p-3 shadow-sm"
                  >
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-gray-500">โต๊ะ</span>
                      <span className="font-medium text-gray-800">
                        โต๊ะ {item.tableNumber}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">เวลา</span>
                      <span className="font-medium text-gray-800">
                        เมื่อ {item.time}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default CallEmployeeNotify;
