import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { AiOutlineShoppingCart, AiOutlineClose } from 'react-icons/ai';
import { increaseQuantity, decreaseQuantity, removeFromCart } from '../../store/cartSlice';
import axios from 'axios';

export default function CartDrawer({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((s) => s.cart.cartItems) || [];
  const cartTotal = useSelector((s) => s.cart.cartTotal) || 0;

  const [coupon, setCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState('');
  const drawerRef = useRef(null);

  const totalQuantity = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      window.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const getImageUrl = (src) => {
    if (!src) return '/images/placeholder.jpg';
    if (src.startsWith('http://') || src.startsWith('https://')) return src;
    if (src.startsWith('/')) return src;
    return `/${src}`;
  };

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) return;
    try {
      const res = await axios.post('/api/coupon', { coupon });
      setCouponMsg(`Áp dụng thành công: giảm ${res.data.discount}%`);
    } catch {
      setCouponMsg('Mã giảm giá không hợp lệ');
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-[9999998] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-white z-[9999999] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#105d97] text-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <AiOutlineShoppingCart size={22} />
            <span className="font-bold text-base">Giỏ hàng</span>
            {totalQuantity > 0 && (
              <span className="bg-white text-[#105d97] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalQuantity}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="Đóng giỏ hàng"
          >
            <AiOutlineClose size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
              <AiOutlineShoppingCart size={56} />
              <p className="text-sm">Giỏ hàng của bạn đang trống</p>
              <button onClick={onClose} className="text-[#105d97] text-sm font-medium hover:underline">
                Tiếp tục mua sắm →
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {cartItems.map((item, index) => (
                <div key={index} className="flex gap-3 py-4">
                  {/* Badge + Image */}
                  <div className="relative flex-shrink-0">
                    <span className="absolute -top-1 -left-1 z-10 bg-[#105d97] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div className="relative w-16 h-20 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                      <Image
                        src={getImageUrl(item.image)}
                        alt={item.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        unoptimized={item.image?.startsWith('http')}
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/${item.slug}`} onClick={onClose}>
                      <p className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-[#105d97] transition-colors leading-6">
                        {item.title}
                      </p>
                    </Link>
                    <div className="flex gap-1 mt-0.5 flex-wrap">
                      {item.color && <span className="text-xs text-gray-400">{item.color}</span>}
                      {item.size && <span className="text-xs text-gray-400">· {item.size}</span>}
                      {!item.size && (
                        <span className="text-xs text-amber-500">· Chưa chọn size</span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-[#105d97] mt-1">
                      {item.price?.toLocaleString('vi-VN')}đ
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                        <button
                          onClick={() => dispatch(decreaseQuantity({ product: item.product, color: item.color, size: item.size }))}
                          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-base font-light"
                          aria-label="Giảm"
                        >−</button>
                        <span className="w-7 text-center text-xs font-medium text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => dispatch(increaseQuantity({ product: item.product, color: item.color, size: item.size }))}
                          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-base font-light"
                          aria-label="Tăng"
                        >+</button>
                      </div>
                      <span className="text-xs text-gray-500">
                        = {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => dispatch(removeFromCart({ product: item.product, color: item.color, size: item.size }))}
                    className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors mt-0.5"
                    aria-label="Xoá"
                  >
                    <AiOutlineClose size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="flex-shrink-0 border-t border-gray-100 px-4 py-4 bg-white space-y-3">
            {/* Subtotal */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Tổng tạm tính</span>
              <span className="font-bold text-gray-900">{cartTotal.toLocaleString('vi-VN')}đ</span>
            </div>

            {/* Coupon */}
            <div>
              <p className="text-sm text-gray-600 mb-1.5 flex items-center gap-1">
                <svg className="w-4 h-4 text-[#f5a623]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Mã giảm giá
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                  placeholder="Nhập mã giảm giá..."
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#105d97] transition-colors"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="bg-[#105d97] hover:bg-[#0e4a7a] text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
                >
                  Áp dụng
                </button>
              </div>
              {couponMsg && (
                <p className={`text-xs mt-1 ${couponMsg.includes('không') ? 'text-red-500' : 'text-green-600'}`}>
                  {couponMsg}
                </p>
              )}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="font-semibold text-gray-900">Thành tiền</span>
              <span className="text-lg font-bold text-[#105d97]">{cartTotal.toLocaleString('vi-VN')}đ</span>
            </div>

            {/* Checkout button */}
            <Link
              href="/checkout"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full bg-[#105d97] hover:bg-[#0e4a7a] text-white font-semibold py-3 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Thanh toán
            </Link>

            <Link
              href="/cart"
              onClick={onClose}
              className="block w-full text-center text-sm text-gray-500 hover:text-[#105d97] transition-colors py-1"
            >
              Xem giỏ hàng đầy đủ →
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
