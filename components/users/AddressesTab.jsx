import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function AddressesTab({ userId }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State cho form popup thêm/chỉnh sửa địa chỉ
  const [showForm, setShowForm] = useState(false);
  const [addressData, setAddressData] = useState({
    _id: "",
    fullName: "",
    phoneNumber: "",
    address1: "",
    city: "",
    cityName: "",
    district: "",
    districtName: "",
    ward: "",
    wardName: "",
    type: "home",
    isDefault: false,
  });
  
  // State lưu dữ liệu tỉnh/TP, quận/huyện, phường/xã
  const [dataAll, setDataAll] = useState([]);
  
  // State xác nhận xóa địa chỉ
  const [confirmDeleteAddressId, setConfirmDeleteAddressId] = useState(null);
  
  useEffect(() => {
    if (showForm && dataAll.length === 0) {
      fetchAllData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showForm]);

  const fetchAllData = async () => {
    try {
      const res = await axios.get("https://provinces.open-api.vn/api/?depth=3");
      const sorted = res.data.sort((a, b) => a.name.localeCompare(b.name));
      setDataAll(sorted);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải dữ liệu Tỉnh/Thành!");
    }
  };

  // Dropdown dữ liệu dựa trên form addressData
  const selectedProvince = dataAll.find(
    (p) => p.code.toString() === addressData.city
  );
  const districts = selectedProvince
    ? selectedProvince.districts.sort((a, b) => a.name.localeCompare(b.name))
    : [];
  const selectedDistrict = districts.find(
    (d) => d.code.toString() === addressData.district
  );
  const wards = selectedDistrict
    ? selectedDistrict.wards.sort((a, b) => a.name.localeCompare(b.name))
    : [];

  // Fetch danh sách địa chỉ của user
  const fetchAddresses = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/address?userId=${userId}`);
      setAddresses(res.data.addresses || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Lỗi lấy địa chỉ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const resetForm = () => {
    setAddressData({
      _id: "",
      fullName: "",
      phoneNumber: "",
      address1: "",
      city: "",
      cityName: "",
      district: "",
      districtName: "",
      ward: "",
      wardName: "",
      type: "home",
      isDefault: false,
    });
  };

  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value;
    const provinceObj = dataAll.find(
      (p) => p.code.toString() === provinceCode
    );
    setAddressData({
      ...addressData,
      city: provinceCode,
      cityName: provinceObj ? provinceObj.name : "",
      district: "",
      districtName: "",
      ward: "",
      wardName: "",
    });
  };

  const handleDistrictChange = (e) => {
    const districtCode = e.target.value;
    const districtObj = selectedProvince?.districts.find(
      (d) => d.code.toString() === districtCode
    );
    setAddressData({
      ...addressData,
      district: districtCode,
      districtName: districtObj ? districtObj.name : "",
      ward: "",
      wardName: "",
    });
  };

  const handleWardChange = (e) => {
    const wardCode = e.target.value;
    const wardObj = selectedDistrict?.wards.find(
      (w) => w.code.toString() === wardCode
    );
    setAddressData({
      ...addressData,
      ward: wardCode,
      wardName: wardObj ? wardObj.name : "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (addressData._id) {
        const payload = { ...addressData, addressId: addressData._id };
        await axios.put(`/api/address?userId=${userId}`, payload);
        toast.success("Địa chỉ cập nhật thành công!");
      } else {
        const { _id, ...newAddress } = addressData;
        await axios.post(`/api/address?userId=${userId}`, newAddress);
        toast.success("Địa chỉ thêm thành công!");
      }
      resetForm();
      setShowForm(false);
      fetchAddresses();
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Có lỗi khi lưu địa chỉ");
    }
  };

  const handleEdit = (addr) => {
    setAddressData(addr);
    setShowForm(true);
  };

  // Khi bấm nút xóa, không xóa ngay mà lưu id cần xóa vào state confirmDeleteAddressId
  const onDeleteClick = (addrId) => {
    setConfirmDeleteAddressId(addrId);
  };

  // Xác nhận xóa: gọi API xóa địa chỉ, sau đó reset state confirmDeleteAddressId
  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/address?userId=${userId}&addressId=${confirmDeleteAddressId}`);
      toast.success("Đã xóa địa chỉ!");
      fetchAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Có lỗi khi xóa địa chỉ");
    } finally {
      setConfirmDeleteAddressId(null);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between border-b pb-2 mb-4">
        <h2 className="text-xl font-semibold">Sổ địa chỉ</h2>
        <button
          className="flex items-center text-blue-600 font-medium hover:underline"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <Plus className="w-4 h-4 mr-1" />
          Thêm địa chỉ mới
        </button>
      </div>
      {loading ? (
        <p> </p>
      ) : addresses.length > 0 ? (
        <ul className="space-y-4">
          {addresses.map((addr) => (
            <li
              key={addr._id}
              className="border p-4 rounded flex justify-between items-start"
            >
              <div>
                <p className="font-semibold uppercase">{addr.fullName}</p>
                <p className="text-gray-600 text-sm">SĐT: {addr.phoneNumber}</p>
                <p className="text-gray-600 text-sm">
                  {addr.address1}, {addr.wardName}, {addr.districtName}, {addr.cityName}
                </p>
                {addr.isDefault && (
                  <span className="text-green-600 text-xs font-medium">
                    Mặc định
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <button
                  className="text-blue-600 text-sm hover:underline flex items-center"
                  onClick={() => handleEdit(addr)}
                >
                  <Edit size={16} className="mr-1" /> Chỉnh sửa
                </button>
                <button
                  className="text-red-600 text-sm hover:underline flex items-center"
                  onClick={() => onDeleteClick(addr._id)}
                >
                  <Trash2 size={16} className="mr-1" /> Xóa
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Không có địa chỉ nào.</p>
      )}

      {showForm && (
        <div className="mt-6 p-4 border rounded">
          <h3 className="text-lg font-semibold mb-4">
            {addressData._id ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Họ và Tên</label>
              <input
                type="text"
                value={addressData.fullName}
                onChange={(e) =>
                  setAddressData({ ...addressData, fullName: e.target.value })
                }
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Số điện thoại</label>
              <input
                type="text"
                value={addressData.phoneNumber}
                onChange={(e) =>
                  setAddressData({ ...addressData, phoneNumber: e.target.value })
                }
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Địa chỉ chi tiết</label>
              <input
                type="text"
                value={addressData.address1}
                onChange={(e) =>
                  setAddressData({ ...addressData, address1: e.target.value })
                }
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-xs font-medium mb-1">
                Tỉnh/Thành, Quận/Huyện, Phường/Xã
              </label>
              <div className="flex gap-2 text-xs">
                <select
                  className="w-1/3 border rounded p-1"
                  value={addressData.city}
                  onChange={handleProvinceChange}
                  required
                >
                  <option value="">Chọn Tỉnh/Thành</option>
                  {dataAll.map((prov) => (
                    <option key={prov.code} value={prov.code.toString()}>
                      {prov.name}
                    </option>
                  ))}
                </select>
                <select
                  className="w-1/3 border rounded p-1"
                  value={addressData.district}
                  onChange={handleDistrictChange}
                  required
                  disabled={!addressData.city || districts.length === 0}
                >
                  <option value="">Chọn Quận/Huyện</option>
                  {districts.map((dist) => (
                    <option key={dist.code} value={dist.code.toString()}>
                      {dist.name}
                    </option>
                  ))}
                </select>
                <select
                  className="w-1/3 border rounded p-1"
                  value={addressData.ward}
                  onChange={handleWardChange}
                  required
                  disabled={!addressData.district || wards.length === 0}
                >
                  <option value="">Chọn Phường/Xã</option>
                  {wards.map((w) => (
                    <option key={w.code} value={w.code.toString()}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-2">
              <label className="block text-xs font-medium mb-1">
                Loại địa chỉ
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`px-4 py-2 rounded border text-sm ${
                    addressData.type === "home"
                      ? "bg-red-500 text-white border-red-500"
                      : "bg-gray-100"
                  }`}
                  onClick={() =>
                    setAddressData({ ...addressData, type: "home" })
                  }
                >
                  Nhà Riêng
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded border text-sm ${
                    addressData.type === "office"
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-100"
                  }`}
                  onClick={() =>
                    setAddressData({ ...addressData, type: "office" })
                  }
                >
                  Văn Phòng
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="inline-flex items-center text-sm">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600"
                  checked={addressData.isDefault}
                  onChange={(e) =>
                    setAddressData({
                      ...addressData,
                      isDefault: e.target.checked,
                    })
                  }
                />
                <span className="ml-2">Đặt làm địa chỉ mặc định</span>
              </label>
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                {addressData._id ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Modal xác nhận xóa */}
      {confirmDeleteAddressId && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-md shadow-md text-center w-80">
            <p className="mb-4">Bạn có chắc chắn muốn xóa địa chỉ này ?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Xóa
              </button>
              <button
                onClick={() => setConfirmDeleteAddressId(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
