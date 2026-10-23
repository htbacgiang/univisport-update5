import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const CouponForm = () => {
  const [coupon, setCoupon] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [discount, setDiscount] = useState("");
  const [loading, setLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/coupon", {
        coupon,
        startDate,
        endDate,
        discount: Number(discount),
      });
      toast.success("Coupon created!");
      setCoupon("");
      setStartDate("");
      setEndDate("");
      setDiscount("");
      fetchCoupons();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error creating coupon"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCoupons = async () => {
    try {
      const res = await axios.get("/api/coupon");
      setCoupons(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching coupons");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create Coupon</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block mb-1">Coupon Code</label>
          <input
            type="text"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Discount (%)</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Coupon"}
        </button>
      </form>
      <hr className="my-4" />
      <h3 className="text-lg font-bold mb-2">Existing Coupons</h3>
      <button
        className="mb-2 bg-gray-200 p-2 rounded"
        onClick={fetchCoupons}
      >
        Load Coupons
      </button>
      <ul>
        {coupons.map((c) => (
          <li key={c._id} className="border p-2 rounded mb-2">
            <p>
              <strong>Code:</strong> {c.coupon}
            </p>
            <p>
              <strong>Discount:</strong> {c.discount}%
            </p>
            <p>
              <strong>Valid:</strong> {c.startDate} - {c.endDate}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CouponForm;
