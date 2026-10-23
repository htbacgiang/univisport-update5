// components/MessengerButton.tsx

'use client';

import { FC, useState, useEffect } from 'react';
import FbMess from '../../public/fbmess.png';
import Image from "next/image";
import styles from "../about/RingPhone.module.css";
import Link from 'next/link';
import Zalo from "../../public/zalo-icon.png";
import { trackMessengerClick, trackZaloClick } from '../../lib/meta-pixel';

const MESSAGES = [
  'Liên hệ với Đồng phục Univi',
];

const MessengerButton: FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    // Hiện lần đầu sau 5 giây
    const initial = setTimeout(() => {
      setShowTooltip(true);
    }, 5000);

    // Sau đó lặp mỗi 30 giây
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
      setShowTooltip(true);
    }, 20000);

    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, []);

  // Tự ẩn sau 6 giây
  useEffect(() => {
    if (!showTooltip) return;
    const timer = setTimeout(() => setShowTooltip(false), 6000);
    return () => clearTimeout(timer);
  }, [showTooltip]);

  return (
    <div className={styles.helpContainer}>

      {/* Tooltip nhắc nhở */}
      {showTooltip && (
        <div
          className="messenger-tooltip"
          style={{
            position: 'absolute',
            bottom: '75px',
            right: '52px',
            background: 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)',
            color: '#1a1a2e',
            padding: '10px 14px 10px 10px',
            borderRadius: '16px',
            boxShadow: '0 8px 30px rgba(16,93,151,0.18), 0 2px 8px rgba(0,0,0,0.08)',
            fontSize: '13px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '1.5px solid #d0e8f8',
            animation: 'tooltipSlideIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
          }}
        >


          <span style={{ color: '#1a3a5c' }}>{MESSAGES[msgIndex]}</span>

          {/* Chấm đỏ nhấp nháy */}
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#ef4444', flexShrink: 0,
            animation: 'pulseDot 1.2s ease-in-out infinite',
            boxShadow: '0 0 0 0 rgba(239,68,68,0.5)',
          }} />

          {/* Mũi tên chỉ xuống */}
          <span
            style={{
              position: 'absolute',
              bottom: '-8px',
              right: '22px',
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '8px solid #d0e8f8',
            }}
          />
          <span
            style={{
              position: 'absolute',
              bottom: '-6px',
              right: '23px',
              width: 0,
              height: 0,
              borderLeft: '7px solid transparent',
              borderRight: '7px solid transparent',
              borderTop: '7px solid #f0f7ff',
            }}
          />
        </div>
      )}

      <div className={styles.phoneRing}>
        <div className={styles.zaloRingCircle}></div>
        <div className={styles.phoneRingCircleFill}>
          <Link
            href="https://m.me/dongphucunivi"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Messenger Đồng phục Univi"
            data-meta-tracked="true"
            onClick={() => trackMessengerClick({ source: "floating_button" })}
          >
            <Image src={FbMess} alt="Messenger Icon" width={60} height={60} />
          </Link>
        </div>
      </div>
      <div className={styles.zaloRing}>
        <div className={styles.zaloRingCircle}></div>
        <div className={styles.zaloRingCircleFill}>
          <Link
            href="https://zalo.me/0834204999"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Zalo Đồng phục Univi"
            data-meta-tracked="true"
            onClick={() => trackZaloClick({ source: "floating_button" })}
          >
            <Image src={Zalo} alt="Zalo Icon" width={60} height={60} />
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes tooltipSlideIn {
          0%   { opacity: 0; transform: translateX(20px) scale(0.88); }
          60%  { opacity: 1; transform: translateX(-4px) scale(1.03); }
          80%  { transform: translateX(2px) scale(0.99); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes pulseDot {
          0%   { transform: scale(1);    box-shadow: 0 0 0 0   rgba(239,68,68,0.6); }
          50%  { transform: scale(1.15); box-shadow: 0 0 0 5px rgba(239,68,68,0); }
          100% { transform: scale(1);    box-shadow: 0 0 0 0   rgba(239,68,68,0); }
        }
        @media (max-width: 768px) {
          .messenger-tooltip {
            bottom: 90px !important;
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MessengerButton;

