import React from 'react';

const HeroSection1 = () => {
  return (
    <div className="flex flex-col items-center justify-center pt-6 md:pt-16 bg-white">
      <div className="flex items-center gap-4">
        <div className="w-12 h-px bg-black"></div>
        <h3 className="md:text-2xl text-xl font-bold tracking-wide leading-6 text-gray-900 text-center" style={{ fontFamily: "'Univi Anton', 'Anton', sans-serif" }}>CÁC DÒNG VẢI CHUYÊN DỤNG CỦA ĐỒNG PHỤC UNIVI</h3>
        <div className="w-12 h-px bg-black"></div>
      </div>
    </div>
  );
};

export default HeroSection1;