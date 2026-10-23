import React from 'react';
import {
  User as UserIcon,
  Bell,
  ShoppingBag,
  Heart,
  Repeat,
  MapPin,
  CreditCard,
} from 'lucide-react';

export default function UserSidebar({ selectedTab, onTabClick, userName, userImage }) {
  return (
    <div className="w-64 bg-white border p-4">
      {/* Phần tiêu đề */}
      <div className="flex items-center mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={userImage || "/default-avatar.png"}
          alt="User avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="ml-2">
          <p className="text-sm text-gray-500">Tài khoản của</p>
          <p className="font-semibold text-sm text-gray-800">
            {userName || "Chưa rõ tên"}
          </p>
        </div>
      </div>
      {/* Danh sách menu với hiệu ứng active */}
      <ul className="space-y-1 text-sm text-gray-700">
        <li
          className={`flex items-center p-2 rounded cursor-pointer ${
            selectedTab === 'account' ? 'bg-gray-200' : 'hover:bg-gray-100'
          }`}
          onClick={() => onTabClick('account')}
        >
          <UserIcon size={16} className="mr-2" />
          Thông tin tài khoản
        </li>
        <li
          className={`flex items-center p-2 rounded cursor-pointer ${
            selectedTab === 'notifications' ? 'bg-gray-200' : 'hover:bg-gray-100'
          }`}
          onClick={() => onTabClick('notifications')}
        >
          <Bell size={16} className="mr-2" />
          Thông báo của tôi
        </li>
        <li
          className={`flex items-center p-2 rounded cursor-pointer ${
            selectedTab === 'orders' ? 'bg-gray-200' : 'hover:bg-gray-100'
          }`}
          onClick={() => onTabClick('orders')}
        >
          <ShoppingBag size={16} className="mr-2" />
          Quản lý đơn hàng
        </li>
        <li
          className={`flex items-center p-2 rounded cursor-pointer ${
            selectedTab === 'returns' ? 'bg-gray-200' : 'hover:bg-gray-100'
          }`}
          onClick={() => onTabClick('returns')}
        >
          <Repeat size={16} className="mr-2" />
          Quản lý đổi trả
        </li>
        <li
          className={`flex items-center p-2 rounded cursor-pointer ${
            selectedTab === 'addresses' ? 'bg-gray-200' : 'hover:bg-gray-100'
          }`}
          onClick={() => onTabClick('addresses')}
        >
          <MapPin size={16} className="mr-2" />
          Sổ địa chỉ
        </li>
        <li
          className={`flex items-center p-2 rounded cursor-pointer ${
            selectedTab === 'payment' ? 'bg-gray-200' : 'hover:bg-gray-100'
          }`}
          onClick={() => onTabClick('payment')}
        >
          <CreditCard size={16} className="mr-2" />
          Thông tin thanh toán
        </li>
      </ul>
    </div>
  );
}
