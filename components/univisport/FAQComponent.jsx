"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { DEFAULT_HOMEPAGE_FAQS } from "../../data/homepageFaqs";

const FAQComponent = ({ items = DEFAULT_HOMEPAGE_FAQS }) => {
  const [expanded, setExpanded] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(0);
  const [hasVideoStarted, setHasVideoStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Bắt đầu với muted để autoplay được phép
  const [audioEnabled, setAudioEnabled] = useState(false); // Track if audio context is enabled

  // Force autoplay with user interaction
  const handleVideoInteraction = () => {
    try {
      // Tạo một user interaction để enable autoplay với audio
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();

      // Resume audio context nếu bị suspend
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Tạo âm thanh rất nhỏ để kích hoạt audio context
      gainNode.gain.setValueAtTime(0.001, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.05);

      // Set flag để cho biết user đã tương tác
      window.userHasInteracted = true;
    } catch (error) {
      console.log('Audio context error:', error);
      window.userHasInteracted = true;
    }
  };

  // Load Facebook SDK
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.FB) {
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v18.0';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      document.body.appendChild(script);

      script.onload = () => {
        if (window.FB) {
          window.FB.init({
            appId: 'your-app-id', // Có thể để trống nếu không cần
            version: 'v18.0'
          });
        }
      };
    }
  }, []);

  // Setup user interaction handlers for audio autoplay
  useEffect(() => {
    const enableAudioAutoplay = () => {
      handleVideoInteraction();
      setAudioEnabled(true);

      // Tự động unmute video sau khi có user interaction
      setTimeout(() => {
        if (hasVideoStarted) {
          setIsMuted(false);
        }
      }, 1000); // Delay 1 giây để đảm bảo video đã load
    };

    // Các sự kiện user interaction để enable audio autoplay
    const events = ['click', 'touchstart', 'keydown', 'mousedown'];

    events.forEach(event => {
      document.addEventListener(event, enableAudioAutoplay, { once: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, enableAudioAutoplay);
      });
    };
  }, [hasVideoStarted]);

  // Auto unmute first video when audio is enabled
  useEffect(() => {
    if (audioEnabled && hasVideoStarted && isMuted) {
      const timer = setTimeout(() => {
        setIsMuted(false);
      }, 2000); // Delay 2 giây để đảm bảo video đã load hoàn toàn

      return () => clearTimeout(timer);
    }
  }, [audioEnabled, hasVideoStarted, isMuted]);

  const faqs = useMemo(
    () =>
      (Array.isArray(items) ? items : [])
        .filter((faq) => faq?.question && faq?.answer)
        .map((faq, index) => ({
          ...faq,
          _id: faq._id || `faq-${index}`,
          image: faq.image || "/images/thumb-univi.jpg",
          video: faq.video || "",
        })),
    [items]
  );

  const toggleFAQ = (index) => {
    setExpanded(expanded === index ? null : index);
    setSelectedMedia(index);

    // Reset video state khi chuyển câu hỏi
    if (selectedMedia !== index) {
      setHasVideoStarted(false);
      setIsMuted(true); // Reset về muted khi chuyển video

      if (!faqs[index]?.video) return;

      // Enable autoplay với user interaction
      handleVideoInteraction();

      // Auto start video khi chuyển câu hỏi mới
      setTimeout(() => {
        setHasVideoStarted(true);

        // Nếu audio đã được enable, tự động unmute sau khi video load
        if (audioEnabled) {
          setTimeout(() => {
            setIsMuted(false);
          }, 1500); // Delay thêm để đảm bảo iframe đã load xong
        }
      }, 300);
    }
  };

  const currentFaq = faqs[selectedMedia];

  if (!currentFaq) return null;

  return (
    <section className="faq-section py-16 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute bottom-0 right-0 w-96 h-96 gradient-faq-bg-decoration rounded-full blur-3xl translate-x-48 translate-y-48"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="md:text-2xl text-xl font-medium tracking-tight leading-6 uppercase md:mb-4 mb-2 gradient-faq-title mx-auto">
            Câu Hỏi Thường Gặp Về  Univi
          </h2>
          <div className="w-16 h-1 gradient-faq-divider mx-auto md:mb-4 mb-2 rounded-full"></div>
          <p className="text-lg text-slate-600/90 max-w-4xl mx-auto">
            Tìm hiểu các thông tin về sản phẩm và dịch vụ đồng phục thể thao chuyên nghiệp của Đồng Phục Univi
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* FAQ Section */}
          <div className="space-y-3 lg:col-span-2">
            {faqs.map((faq, index) => (
              <div
                key={faq._id}
                className={`group rounded-2xl overflow-hidden transition-all duration-300 ${selectedMedia === index
                  ? "gradient-faq-selected ring-2 ring-blue-200 shadow-lg"
                  : "bg-white/80 backdrop-blur-sm ring-1 ring-white/40 shadow-md hover:shadow-lg"
                  }`}
              >
                <button
                  className="w-full p-4 lg:p-5 text-left transition-all duration-300 hover:bg-white/50"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={expanded === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className={`font-medium text-sm lg:text-base transition-colors duration-300 ${selectedMedia === index ? "text-[#105d97]" : "text-slate-700"
                      }`}>
                      {faq.question}
                    </h3>
                    <ChevronDown className={`w-4 h-4 lg:w-5 lg:h-5 transition-all duration-300 flex-shrink-0 ml-2 ${expanded === index ? "rotate-180" : ""
                      } ${selectedMedia === index ? "text-[#105d97]" : "text-slate-400"}`} />
                  </div>
                </button>

                {/* Mobile Video Overlay - không làm thay đổi layout */}
                {expanded === index && faq.video && (
                  <div
                    className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeInDown"
                    onClick={(e) => {
                      // Đóng video khi click vào backdrop (không phải video container)
                      if (e.target === e.currentTarget) {
                        setExpanded(null);
                      }
                    }}
                  >
                    {/* Video container */}
                    <div className="relative max-w-xs mx-auto w-full">
                      <div className="relative rounded-2xl overflow-hidden bg-white/90 backdrop-blur-sm shadow-2xl">
                        <div className="relative aspect-[9/16]">
                          <iframe
                            src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(faq.video)}&show_text=false&autoplay=true&muted=${isMuted}&playsinline=true&controls=true&width=280&height=498`}
                            width="100%"
                            height="100%"
                            style={{ border: 'none', overflow: 'hidden' }}
                            scrolling="no"
                            frameBorder="0"
                            allowFullScreen={true}
                            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share; microphone; camera; fullscreen"
                            className="rounded-2xl"
                            key={`mobile-${index}-${isMuted}`}
                          />

                          {/* Close Button Overlay - thay thế nút mute */}
                          <button
                            onClick={() => setExpanded(null)}
                            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-all duration-300 shadow-lg z-10 hover:scale-110"
                            title="Đóng video"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Facebook Button - Mobile */}
                      <div className="mt-4 flex justify-center">
                        <a
                          href={faq.video}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-3 gradient-faq-button text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-medium text-sm hover:scale-105"
                        >
                          <div className="relative">
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                              </svg>
                            </div>
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          </div>
                          <span>Xem trên Facebook</span>
                          <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                <div className={`overflow-hidden transition-all duration-300 ${expanded === index ? "max-h-64 lg:max-h-48 opacity-100" : "max-h-0 opacity-0"
                  }`}>
                  <div className="px-4 lg:px-5 pb-4 lg:pb-5">
                    <div className="border-t border-slate-200/50 pt-3 lg:pt-4">
                      <div className="text-slate-600 text-sm lg:text-base leading-6">
                        {faq.answer.split("\n").map((line, lineIndex) => (
                          <p key={lineIndex} className="mb-1 last:mb-0">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Media Section - Desktop Only */}
          <div className="relative w-fit mx-auto lg:mx-0 hidden lg:block lg:col-span-1">
            <div className="relative rounded-xl overflow-hidden shadow-xl">
              {hasVideoStarted && currentFaq.video ? (
                <div className="relative aspect-[9/16] w-64">
                  <iframe
                    src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(currentFaq.video)}&show_text=false&autoplay=true&muted=${isMuted}&playsinline=true&controls=true&width=256&height=455`}
                    width="100%"
                    height="100%"
                    style={{ border: 'none', overflow: 'hidden' }}
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen={true}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share; microphone; camera; fullscreen"
                    className="rounded-xl"
                    key={`desktop-${selectedMedia}-${isMuted}`} // Force reload khi muted state thay đổi
                  />
                </div>
              ) : (
                <div
                  className={`relative aspect-[9/16] w-64 ${currentFaq.video ? "cursor-pointer" : ""
                    }`}
                  onClick={() => {
                    if (!currentFaq.video) return;
                    handleVideoInteraction();
                    setHasVideoStarted(true);
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentFaq.image}
                    alt={currentFaq.question}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 gradient-faq-image-overlay"></div>

                  {/* Play button overlay */}
                  {currentFaq.video && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-blue-600/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700/90 transition-colors duration-200">
                        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Topic indicator */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md">
                      <p className="text-xs text-slate-700 font-medium line-clamp-2">{currentFaq.question}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>


            {/* Facebook Button */}
            {currentFaq.video && (
              <div className="mt-2">
                <a
                  href={currentFaq.video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 w-64 justify-center gradient-faq-button text-white px-2 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 font-medium text-base"
                >
                  <div className="relative">
                    <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </div>
                    <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <span>Video Facebook </span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQComponent;
