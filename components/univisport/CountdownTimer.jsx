import React, { useState, useEffect } from 'react';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 50,
    hours: 13,
    minutes: 47,
    seconds: 17,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 23;
          days--;
        }
        if (days < 0) {
          clearInterval(timer);
          return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center ">
      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="flex flex-col items-center">
          <h2 className="md:text-2xl text-xl font-bold text-[#105d97] text-center">
            ĐỒNG PHỤC THỂ THAO
          </h2>
        </div>

      </div>
    </div>
  );
};

export default CountdownTimer;  