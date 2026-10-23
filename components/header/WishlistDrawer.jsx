import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { AiOutlineHeart, AiOutlineClose, AiOutlineShoppingCart } from 'react-icons/ai';
import { removeFromWishlist, clearWishlist } from '../../store/wishlistSlice';
import { addToCart } from '../../store/cartSlice';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import axios from 'axios';

export default function WishlistDrawer({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const items = useSelector((s) => s.wishlist.items) || [];
  const overlayRef = useRef(null);

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

  const handleRemoveItem = (item) => {
    // Cập nhật Redux ngay lập tức (UI responsive)
    dispatch(removeFromWishlist({ id: item.id }));
    // Sau đó sync lên DB nếu user đăng nhập
    if (session?.user?.id) {
      axios.delete('/api/user/wishlist', { data: { productId: item.id } })
        .catch(() => console.error('Failed to remove wishlist item from DB'));
    }
  };

  const handleClearAll = () => {
    dispatch(clearWishlist());
    if (session?.user?.id) {
      axios.delete('/api/user/wishlist')
        .catch(() => console.error('Failed to clear wishlist in DB'));
    }
  };

  const handleMoveToCart = (item) => {
    dispatch(addToCart({
      product: item.id,
      title: item.name,
      image: item.image,
      price: item.price,
      quantity: 1,
      color: item.color || '',
      colorHex: item.colorHex || '',
      size: '',
      slug: item.slug,
    }));
    handleRemoveItem(item);
    toast.success(`Đã chuyển "${item.name}" vào giỏ hàng!`);
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
        className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-white z-[9999999] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-red-500 text-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <AiOutlineHeart size={22} />
            <span className="font-bold text-base">Yêu thích</span>
            {items.length > 0 && (
              <span className="bg-white text-red-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {items.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={() => { handleClearAll(); }}
                className="text-xs text-white/80 hover:text-white underline transition-colors"
              >
                Xoá tất cả
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Đóng"
            >
              <AiOutlineClose size={18} />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
              <AiOutlineHeart size={56} />
              <p className="text-sm">Chưa có sản phẩm yêu thích</p>
              <button
                onClick={onClose}
                className="text-red-500 text-sm font-medium hover:underline"
              >
                Khám phá sản phẩm →
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {items.map((item, index) => (
                <div key={item.id} className="flex gap-3 py-4">
                  {/* Image */}
                  <Link href={`/${item.slug}`} onClick={onClose} className="flex-shrink-0">
                    <div className="relative w-16 h-20 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                      <Image
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        unoptimized={item.image?.startsWith('http')}
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/${item.slug}`} onClick={onClose}>
                      <p className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-[#105d97] transition-colors leading-6">
                        {item.name}
                      </p>
                    </Link>
                    {item.color && (
                      <span className="text-xs text-gray-400 mt-0.5 block">{item.color}</span>
                    )}
                    <p className="text-sm font-bold text-[#105d97] mt-1">
                      {item.price?.toLocaleString('vi-VN')}đ
                    </p>

                    {/* Move to cart */}
                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[#105d97] hover:text-[#0e4a7a] transition-colors"
                    >
                      <AiOutlineShoppingCart size={14} />
                      Thêm vào giỏ
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => handleRemoveItem(item)}
                    className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors mt-0.5"
                    aria-label="Xoá khỏi yêu thích"
                  >
                    <AiOutlineClose size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="flex-shrink-0 border-t border-gray-100 px-4 py-4 bg-white space-y-3">
            <p className="text-sm text-gray-500 text-center">
              {items.length} sản phẩm yêu thích
            </p>
            <Link
              href="/wishlist"
              onClick={onClose}
              className="block w-full bg-red-500 hover:bg-red-600 text-white font-semibold text-center py-3 rounded-xl transition-colors"
            >
              Xem trang yêu thích
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
