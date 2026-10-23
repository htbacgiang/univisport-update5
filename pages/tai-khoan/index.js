import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Camera } from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";
import UserSidebar from "../../components/users/UserSidebar";
import AddressesTab from "../../components/users/AddressesTab";
import OrdersTab from "../../components/users/OrdersTab";
import { toast } from "react-hot-toast";
import Navbar from "../../components/header/Navbar";
import LoadingSpinner from "../../components/users/LoadingSpinner";
import Head from "next/head";

export default function UserProfile() {
  const { data: session, status } = useSession();

  // State quản lý tab hiện tại và trạng thái loading khi chuyển tab
  const [selectedTab, setSelectedTab] = useState("account");
  const [tabLoading, setTabLoading] = useState(false);

  // State lưu thông tin cá nhân
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [gender, setGender] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // State lưu thông tin ban đầu để so sánh khi cập nhật
  const [initialUserData, setInitialUserData] = useState({});

  const fetchUserData = async () => {
    if (!session || !session.user.id) return;
    try {
      const res = await axios.get(`/api/user/${session.user.id}`);
      const userData = res.data;
      setName(userData.name || "");
      setPhoneNumber(userData.phone || "");
      setEmail(userData.email || "");
      setImage(userData.image || "");
      setGender(userData.gender || "");
      if (userData.dateOfBirth) {
        setSelectedDate(new Date(userData.dateOfBirth));
      } else {
        setSelectedDate(null);
      }
      setInitialUserData({
        name: userData.name || "",
        phone: userData.phone || "",
        email: userData.email || "",
        image: userData.image || "",
        gender: userData.gender || "",
        dateOfBirth: userData.dateOfBirth
          ? new Date(userData.dateOfBirth).toISOString()
          : null,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Có lỗi khi lấy thông tin tài khoản!");
    }
  };

  useEffect(() => {
    if (session && session.user) {
      fetchUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Xử lý upload ảnh qua API /api/upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const link = res.data.links[0];
      setImage(link);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Lỗi khi upload ảnh đại diện");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!session || !session.user.id) return;
    const updatedUser = {
      name,
      phone: phoneNumber,
      email,
      image,
      gender,
      dateOfBirth: selectedDate,
    };

    const isDataChanged =
      updatedUser.name !== initialUserData.name ||
      updatedUser.phone !== initialUserData.phone ||
      updatedUser.email !== initialUserData.email ||
      updatedUser.image !== initialUserData.image ||
      updatedUser.gender !== initialUserData.gender ||
      ((updatedUser.dateOfBirth && updatedUser.dateOfBirth.toISOString()) || null) !==
      initialUserData.dateOfBirth;

    if (!isDataChanged) {
      toast("Không có gì thay đổi", { icon: "ℹ️" });
      return;
    }

    try {
      setLoading(true);
      await axios.put(`/api/user/${session.user.id}`, updatedUser);
      toast.success("Cập nhật thông tin thành công!");
      fetchUserData();
    } catch (error) {
      console.error("Error updating user info:", error);
      toast.error("Có lỗi khi cập nhật thông tin!");
    } finally {
      setLoading(false);
    }
  };

  // Hàm chuyển tab có hiệu ứng loading
  const handleTabClick = (tabName) => {
    setTabLoading(true);
    setSelectedTab(tabName);
    // Giả lập hiệu ứng loading khi chuyển tab (500ms)
    setTimeout(() => {
      setTabLoading(false);
    }, 500);
  };

  if (status === "loading" || loading) {
    return <LoadingSpinner />;
  }
  if (!session) {
    return (
      <div className="p-4">
        <p>Vui lòng đăng nhập để xem thông tin tài khoản.</p>
      </div>
    );
  }

  // Nội dung hiển thị theo tab
  let content;
  if (selectedTab === "account") {
    content = (
      <div>
        <h2 className="text-xl font-semibold mb-4">Thông tin tài khoản</h2>
        <div className="mb-4 flex items-center flex-col md:flex-row">
          <div className="relative w-24 h-24">
            {image ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={image}
                alt="User Avatar"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-full text-gray-400">
                Ảnh
              </div>
            )}
            <label
              htmlFor="avatarInput"
              className="absolute bottom-1 right-1 w-8 h-8 bg-white flex items-center justify-center rounded-full cursor-pointer border border-gray-300 hover:bg-gray-100 transition-colors"
              title="Thay đổi ảnh đại diện"
            >
              <Camera size={16} className="text-gray-600" />
            </label>
            <input
              id="avatarInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
          {uploading && (
            <p className="text-sm text-gray-500 ml-2 mt-2 md:mt-0 md:ml-4">
              Đang upload ảnh...
            </p>
          )}
          <div className="md:ml-4 flex w-full items-center gap-2 mt-4 md:mt-0">
            <label className="font-medium">Họ & Tên:</label>
            <input
              className="border rounded p-2 w-full md:w-auto"
              placeholder="Nhập họ tên"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full">
          <div className="mb-4">
            <label className="font-medium mb-1">Số điện thoại</label>
            <input
              className="w-full border p-2 rounded"
              placeholder="Nhập số điện thoại"
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="font-medium mb-1">Địa chỉ email</label>
            <input
              className="w-full border p-2 rounded cursor-not-allowed bg-gray-100"
              placeholder="Nhập email"
              type="email"
              value={email}
              disabled
            />
          </div>
          <div className="mb-4">
            <label className="font-medium mb-1 mr-4">Ngày sinh:</label>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              className="border p-2 rounded w-full"
              placeholderText="Chọn ngày sinh"
            />
          </div>
          <div className="mb-4">
            <span className="font-medium mr-4">Giới tính:</span>
            <label>
              <input
                type="radio"
                name="gender"
                className="mr-2"
                value="Nam"
                checked={gender === "Nam"}
                onChange={(e) => setGender(e.target.value)}
              />
              Nam
            </label>
            <label className="ml-4">
              <input
                type="radio"
                name="gender"
                className="mr-2"
                value="Nữ"
                checked={gender === "Nữ"}
                onChange={(e) => setGender(e.target.value)}
              />
              Nữ
            </label>
            <label className="ml-4">
              <input
                type="radio"
                name="gender"
                className="mr-2"
                value="Khác"
                checked={gender === "Khác"}
                onChange={(e) => setGender(e.target.value)}
              />
              Khác
            </label>
          </div>
          <button
            className="bg-blue-500 text-white rounded px-6 py-2 w-full md:w-auto"
            onClick={handleSave}
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    );
  } else if (selectedTab === "notifications") {
    content = <div>Đây là trang Thông báo của tôi</div>;
  } else if (selectedTab === "orders") {
    content = <OrdersTab />;
  } else if (selectedTab === "returns") {
    content = <div>Đây là trang Quản lý đổi trả</div>;
  } else if (selectedTab === "addresses") {
    content = <AddressesTab userId={session.user.id} />;
  } else if (selectedTab === "payment") {
    content = <div>Đây là trang Thông tin thanh toán</div>;
  } else {
    content = <div>Chọn mục bên trái.</div>;
  }

  return (

    <>
    <Navbar />
    <div className="h-[80px] bg-white"></div>

      <Head>
        <title>Thông tin tài khoản | Eco Bắc Giang</title>
        <meta name="description" content="Trang thông tin tài khoản của bạn, nơi bạn có thể quản lý thông tin cá nhân, đơn hàng và địa chỉ giao hàng." />
        <meta name="keywords" content="tài khoản, thông tin cá nhân, đơn hàng, địa chỉ giao hàng" />
        <meta name="robots" content="index, follow" key="robots" />
        <meta property="og:title" content="Thông tin tài khoản | Tên Website" />
        <meta property="og:description" content="Trang thông tin tài khoản của bạn, nơi bạn có thể quản lý thông tin cá nhân, đơn hàng và địa chỉ giao hàng." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://example.com/tai-khoan" />
        <meta property="og:image" content="https://example.com/static/account.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Thông tin tài khoản | Tên Website" />
        <meta name="twitter:description" content="Trang thông tin tài khoản của bạn, nơi bạn có thể quản lý thông tin cá nhân, đơn hàng và địa chỉ giao hàng." />
        <meta name="twitter:image" content="https://example.com/static/account.jpg" />
      </Head>
      <div className="min-h-screen bg-gray-100 p-4 md:p-6">
        <div className="bg-white shadow rounded-lg p-4 md:p-6 flex flex-col md:flex-row">
          <UserSidebar
            selectedTab={selectedTab}
            onTabClick={handleTabClick}
            userName={session.user.name}
            userImage={session.user.image}
          />
          <div className="flex-grow md:ml-6">
            {tabLoading ? <LoadingSpinner /> : content}
          </div>
        </div>
      </div>
    </>

  );
}
