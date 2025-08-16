import {
  FiUser,
  FiMail,
  FiCreditCard,
  FiLogOut,
  FiSettings,
  FiChevronDown,
} from "react-icons/fi";
import { useProtectRoute } from "../../../hooks/Auth/useProtectRoute";
import { useState, useRef, useEffect } from "react";
import { useLogout } from "@/hooks/Auth/useLogout";
function PosHeader() {
  const { logout } = useLogout();
  const { profile } = useProtectRoute();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!profile) return null;

  const handlerLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <header className="sticky top-0 z-40 bg-white transition-all duration-300">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="group flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-100 transition-all duration-300 group-hover:scale-105 group-hover:bg-blue-200">
              <svg
                className="h-5 w-5 text-blue-600 transition-transform duration-300 group-hover:scale-110"
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
            <span className="cursor-default text-lg font-semibold -tracking-tighter text-gray-800 transition-colors duration-300 group-hover:text-blue-600">
              POS<span className="text-blue-500">System</span>
            </span>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 transition-opacity duration-200 hover:cursor-pointer hover:opacity-80 focus:outline-none"
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 shadow-inner transition-all duration-300 hover:from-blue-200 hover:to-blue-100">
                  <FiUser className="text-lg" />
                </div>
                <span className="absolute right-0 bottom-0 h-2.5 w-2.5 animate-pulse rounded-full border-2 border-white bg-green-400"></span>
              </div>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium text-gray-800 transition-colors duration-200 group-hover:text-blue-600">
                  {profile?.firstName} {profile?.lastName}
                </p>
                <p className="text-xs text-gray-500 transition-colors duration-200 group-hover:text-gray-600">
                  {profile.role}
                </p>
              </div>
              <FiChevronDown
                className={`transform text-gray-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            <div
              className={`absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-lg border border-gray-100 bg-white shadow-xl transition-all duration-200 ${
                isDropdownOpen
                  ? "visible scale-100 opacity-100"
                  : "invisible scale-95 opacity-0"
              }`}
            >
              <div className="border-b border-gray-100 px-4 py-3">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600">
                    <FiUser className="text-xl" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {profile?.firstName} {profile?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{profile.role}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 border-b border-gray-100 px-4 py-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600 transition-colors duration-150 hover:text-blue-600">
                  <FiMail className="flex-shrink-0 text-gray-400" />
                  <span className="truncate">{profile?.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 transition-colors duration-150 hover:text-blue-600">
                  <FiCreditCard className="flex-shrink-0 text-gray-400" />
                  <span>@{profile?.username}</span>
                </div>
              </div>

              <div className="p-1">
                {(profile.role === "ADMINISTRATOR" ||
                  profile.role === "ADMIN") && (
                  <button className="flex w-full items-center space-x-2 rounded-md px-3 py-2 text-sm text-gray-700 transition-colors duration-200 hover:cursor-pointer hover:bg-gray-50 hover:text-blue-600">
                    <FiSettings className="text-gray-500" />
                    <span>แดชบอร์ด</span>
                  </button>
                )}
                <button
                  onClick={() => handlerLogout()}
                  className="flex w-full items-center space-x-2 rounded-md px-3 py-2 text-sm text-red-600 transition-colors duration-200 hover:cursor-pointer hover:bg-red-50"
                >
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
