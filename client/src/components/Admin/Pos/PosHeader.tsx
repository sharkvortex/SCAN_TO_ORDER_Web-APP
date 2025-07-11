import {
  FiUser,
  FiMail,
  FiCreditCard,
  FiLogOut,
  FiSettings,
} from "react-icons/fi";
import { useProtectRoute } from "../../../hooks/Auth/useProtectRoute";
function PosHeader() {
  const { profile } = useProtectRoute();

  return (
    <header className="sticky top-0 z-40 bg-white">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-100">
              <svg
                className="h-5 w-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                />
              </svg>
            </div>
            <span className="cursor-default text-lg font-semibold -tracking-tighter text-gray-800">
              POS
            </span>
          </div>

          <div className="group relative">
            <button className="flex items-center space-x-3 focus:outline-none">
              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <FiUser className="text-lg" />
                </div>
                <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-400"></span>
              </div>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium text-gray-800">
                  {profile?.firstName + profile?.lastName}
                </p>
                <p className="text-xs text-gray-500">{profile.role}</p>
              </div>
            </button>

            <div className="invisible absolute right-0 z-50 mt-2 w-64 rounded-md border border-gray-200 bg-white opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
              <div className="border-b px-4 py-3">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <FiUser className="text-xl" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {profile?.firstName + profile?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{profile.role}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 border-b px-4 py-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FiMail className="text-gray-400" />
                  <span>{profile?.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FiCreditCard className="text-gray-400" />
                  <span>@{profile?.username}</span>
                </div>
              </div>

              <div className="p-1">
                <button className="flex w-full items-center space-x-2 rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <FiSettings className="text-gray-500" />
                  <span>ตั้งค่าบัญชี</span>
                </button>
                <button className="flex w-full items-center space-x-2 rounded px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                  <FiLogOut className="text-red-500" />
                  <span>ออกจากระบบ</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default PosHeader;
