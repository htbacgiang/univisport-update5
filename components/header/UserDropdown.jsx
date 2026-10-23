import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaRegUser, FaDownload, FaHeart, FaUpload, FaSignOutAlt, FaMapMarkerAlt } from "react-icons/fa";
import { MdSubscriptions } from "react-icons/md";
import { useSession, signIn, signOut } from "next-auth/react";

const UserDropdown = ({ userDropdownOpen, toggleUserDropdown }) => {
  const { data: session } = useSession();


  if (!userDropdownOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-3 w-80 backdrop-blur-xl bg-white/95 border border-gray-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-[100] animate-fade-in-up overflow-hidden">
      {session ? (
        <div className="flex flex-col">
          {/* User Header Section */}
          <div className="p-5 border-b border-gray-50 bg-gradient-to-br from-[#105d97]/5 to-transparent">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0 group">
                <div className="absolute inset-0 bg-[#105d97]/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={session.user.image || "/avatar.jpg"}
                  alt="Avatar"
                  width={60}
                  height={60}
                  className="rounded-full border-2 border-white shadow-sm relative z-10 object-cover w-[60px] h-[60px]"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <h4 className="font-bold text-gray-800 text-lg truncate leading-6">
                  {session.user.name}
                </h4>
                <p className="text-sm text-gray-500 truncate mt-0.5">
                  {session.user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-2">
            <ul className="space-y-0.5 font-medium text-sm">
              {[
                { label: "Thông tin cá nhân", href: "/profile", icon: <FaRegUser /> },
                { label: "Lịch sử mua hàng", href: "/profile?tab=orders", icon: <FaDownload /> },
                { label: "Sản phẩm yêu thích", href: "/profile?tab=wishlist", icon: <FaHeart /> },
                { label: "Sổ địa chỉ", href: "/profile?tab=addresses", icon: <FaMapMarkerAlt /> },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:text-[#105d97] hover:bg-[#105d97]/5 transition-all duration-200 group"
                  >
                    <span className="text-[#105d97] text-lg transition-transform group-hover:scale-110">
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}

              <li className="pt-2 mt-1 border-t border-gray-50">
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200 group"
                >
                  <FaSignOutAlt className="text-lg transition-transform group-hover:-translate-x-1" />
                  <span className="font-semibold">Đăng xuất</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-[#105d97]/10 rounded-full flex items-center justify-center text-[#105d97]">
            <FaRegUser size={30} />
          </div>
          <div>
            <h5 className="font-bold text-gray-800">Chào bạn!</h5>
            <p className="text-sm text-gray-500 mt-1">Vui lòng đăng nhập để sử dụng tiếp các tính năng</p>
          </div>
          <button
            onClick={() => signIn()}
            className="w-full py-3 bg-[#105d97] text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-900/10 transition-all duration-300 hover:bg-[#0d4c7a]"
          >
            Đăng nhập ngay
          </button>
          <p className="text-xs text-gray-400">
            Chưa có tài khoản? <Link href="/dang-ky" className="text-[#105d97] hover:underline">Tham gia ngay</Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;