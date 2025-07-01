import { FiVolume2, FiVolumeX } from "react-icons/fi";
import { useSoundNotify } from "../../../contexts/SoundContext/SoundNotifyContext";

function BtnTurnOnNotify() {
  const { enabled, toggleSound } = useSoundNotify();

  return (
    <div className="flex items-center justify-end gap-4 px-6 py-3 transition-all">
      <button
        onClick={toggleSound}
        className={`relative h-8 w-16 rounded-full transition-colors duration-300 hover:cursor-pointer focus:outline-none ${enabled ? "bg-blue-500" : "bg-red-500"}`}
        aria-label={enabled ? "เสียงเปิดอยู่" : "เสียงปิดอยู่"}
      >
        <span
          className={`absolute top-1 left-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300 ${enabled ? "translate-x-8" : ""}`}
        >
          {enabled ? (
            <FiVolume2 className="text-blue-500" />
          ) : (
            <FiVolumeX className="text-red-500" />
          )}
        </span>
      </button>

      <div className="flex items-center gap-2 text-sm">
        {enabled ? (
          <>
            <FiVolume2 className="text-blue-500" />
            <span className="font-medium text-blue-600">
              เสียงแจ้งเตือน เปิดอยู่
            </span>
          </>
        ) : (
          <>
            <FiVolumeX className="text-red-500" />
            <span className="text-red-600">เสียงแจ้งเตือน ปิดอยู่</span>
          </>
        )}
      </div>
    </div>
  );
}

export default BtnTurnOnNotify;
