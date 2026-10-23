import { useState, useEffect } from "react";
import Image from "next/image";
import Head from "next/head";
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  Heart,
  Award,
  Coffee,
  GraduationCap,
  Shield,
  Zap
} from "lucide-react";
import DefaultLayout2 from "../../components/layout/DefaultLayout2";

export default function TuyenDung() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });

    try {
      const formData = new FormData(e.target);
      if (selectedJob && selectedJob._id) {
        formData.append('jobId', selectedJob._id);
      }

      const response = await fetch('/api/recruitment/apply', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setSubmitMessage({
          type: 'success',
          text: data.message
        });
        e.target.reset();
        setTimeout(() => {
          setSelectedJob(null);
          setSubmitMessage({ type: '', text: '' });
        }, 3000);
      } else {
        setSubmitMessage({
          type: 'error',
          text: data.message || 'Có lỗi xảy ra. Vui lòng thử lại.'
        });
      }
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: 'Không thể gửi hồ sơ. Vui lòng thử lại sau.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const jobs = [
    {
      id: 6,
      title: "Nhân Viên Kiểm Kê Hàng Hóa",
      department: "Kho",
      location: "Nhà D14, ngõ 180 đường Thanh Bình, phường Hà Đông, Hà Nội",
      type: "Full-time/Part-time",
      salary: "6-7 triệu (Full-time), 3-3.5 triệu (Part-time)",
      experience: "Không yêu cầu",
      description: "ông ty Cổ phần Tập đoàn Unicore Holdings – thương hiệu Đồng phục UNIVI là một công ty gần 10 năm trong ngành đồng phục. Là đối tác cung cấp đồng phục cho các tập đoàn lớn như tập đoàn Sungroup, tập đoàn Thành Công, Tổng công ty Than Khoáng Sản,...",
      requirements: [
        "Biết sử dụng Excel (biết MISA là lợi thế)",
        "Nhanh nhẹn, thật thà, cẩn thận, có trách nhiệm",
        "Ưu tiên ứng viên có thể đi làm ngay",
        "Kiểm đếm hàng từ xưởng về, nhập vào sổ theo dõi hằng ngày",
        "Xuất hàng theo đơn hàng từ phòng kinh doanh",
        "Gấp, đóng gói hàng theo đơn hàng để giao cho khách",
        "Giữ kho luôn gọn gàng",
        "Báo cáo định kỳ hàng tuần: số lượng xuất nhập kho, tồn kho và mẫu mã bán chạy trong tháng"
      ],
      benefits: [
        "Fulltime: Lương từ 6.000.000 – 7.000.000đ",
        "Parttime: Lương 3.000.000đ - 3.500.000đ (làm ca chiều hoặc có thể luân phiên các ca)",
        "Thưởng lễ, tết theo quy định công ty",
        "Giờ hành chính: Sáng 8h-12h, Chiều 13h30-17h30",
        "Nghỉ chủ nhật",
        "Liên hệ: Email dongphucunivi@gmail.com hoặc Zalo: 038.7042.221 – Trần Nguyệt"
      ]
    },
    {
      id: 7,
      title: "Kế Toán Nội Bộ",
      department: "Kế Toán",
      location: "Nhà D14, ngõ 180 đường Thanh Bình, phường Hà Đông, Hà Nội",
      type: "Full-time",
      salary: "6-8 triệu",
      experience: "Tốt nghiệp đại học/cao đẳng/trung cấp kế toán",
      description: "ông ty Cổ phần Tập đoàn Unicore Holdings– thương hiệu Đồng phục UNIVI là một công ty gần 10 năm trong ngành đồng phục. Là đối tác cung cấp đồng phục cho các tập đoàn lớn như tập đoàn Sungroup, tập đoàn Thành Công, Tổng công ty Than Khoáng Sản,...",
      requirements: [
        "Tốt nghiệp đại học, cao đẳng, trung cấp kế toán",
        "Sử dụng thành thạo phần mềm MISA",
        "Nhanh nhẹn, thật thà, có trách nhiệm",
        "Ưu tiên ứng viên có thể đi làm ngay",
        "Hạch toán sao kê của tất cả tài khoản mua bán trên MISA",
        "Lên chứng từ mua hàng, xuất nhập kho, nguyên vật liệu trên phần mềm MISA",
        "Lên toàn bộ chứng từ bán hàng trên MISA",
        "Kiểm tra đối soát tổng hợp tồn kho, hàng hoá và sổ chi tiết tồn kho hàng hoá",
        "Đối soát công nợ mua hàng và bán hàng thực tế",
        "Chấm công, tính lương cho nhân sự"
      ],
      benefits: [
        "Lương cứng từ 6.000.000 – 8.000.000đ",
        "Thưởng lễ, tết theo quy định công ty",
        "Cơ hội phát triển nghề nghiệp, đào tạo chuyên môn định kỳ",
        "Giờ hành chính: Sáng 8h-12h, Chiều 13h30-17h30",
        "Nghỉ chiều thứ 7 và chủ nhật",
        "Liên hệ: Email dongphucunivi@gmail.com hoặc Zalo: 038.7042.221 – Trần Nguyệt"
      ]
    }
  ];

  const benefits = [
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Lương Thưởng Hấp Dẫn",
      description: "Lương cạnh tranh, thưởng theo hiệu suất và doanh thu"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Cơ Hội Thăng Tiến",
      description: "Lộ trình thăng tiến rõ ràng, đánh giá định kỳ 6 tháng"
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Đào Tạo & Phát Triển",
      description: "Các khóa đào tạo chuyên môn và kỹ năng mềm thường xuyên"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Bảo Hiểm Đầy Đủ",
      description: "BHXH, BHYT, BHTN theo luật + Bảo hiểm tai nạn 24/7"
    },
    {
      icon: <Coffee className="w-8 h-8" />,
      title: "Môi Trường Trẻ Trung",
      description: "Văn phòng hiện đại, team trẻ, năng động, văn hóa cởi mở"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Phúc Lợi Đặc Biệt",
      description: "Du lịch, team building, quà tặng sinh nhật, lễ tết"
    }
  ];

  const companyValues = [
    {
      icon: <Award className="w-6 h-6" />,
      title: "Chất Lượng",
      description: "Cam kết chất lượng sản phẩm và dịch vụ tốt nhất"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Đội Ngũ",
      description: "Con người là tài sản quý giá nhất"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Sáng Tạo",
      description: "Luôn đổi mới và sáng tạo trong mọi hoạt động"
    }
  ];

  return (
    <DefaultLayout2>
      <Head>
        <title>Tuyển Dụng - Đồng Phục Univi | Cơ Hội Nghề Nghiệp</title>
        <meta name="description" content="Tham gia đội ngũ Đồng Phục Univi - Môi trường làm việc chuyên nghiệp, năng động với nhiều cơ hội phát triển" />
        <meta property="og:title" content="Tuyển Dụng - Đồng Phục Univi" />
        <meta property="og:description" content="Tham gia đội ngũ Đồng Phục Univi - Môi trường làm việc chuyên nghiệp" />
      </Head>

      {/* Hero Section */}
      <section className="relative gradient-recruitment-hero min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')" }}></div>

        <div className="container mx-auto px-4 text-center relative z-10 py-20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-6">
              Tuyển Dụng Univi
            </h1>

            <p className="text-xl text-white/90 mb-8 max-w-6xl mx-auto leading-6">
              Tham gia đội ngũ của chúng tôi - nơi tài năng được tôn vinh,
              sự phát triển được khuyến khích và thành công được chia sẻ
            </p>

            <div className="flex flex-wrap gap-4 justify-center items-center">
              <a
                href="#jobs"
                className="px-8 py-4 bg-white font-bold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl flex items-center gap-2"
                style={{ color: '#105d97' }}
              >
                <span>Xem Vị Trí Tuyển Dụng</span>
                <TrendingUp className="w-5 h-5" />
              </a>

            </div>
          </div>
        </div>

      </section>

      {/* Jobs Section */}
      <section id="jobs" className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 gradient-recruitment-secondary text-white rounded-full mb-4">
              <Briefcase className="w-4 h-4" />
              <span className="text-sm font-semibold">Vị Trí Tuyển Dụng</span>
            </div>
            <h2 className="text-xl md:text-4xl font-bold text-gray-900 mb-2">
              Cơ Hội <span className="text-gradient-recruitment">Nghề Nghiệp</span> Đang Chờ Bạn
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tìm vị trí phù hợp với bạn và bắt đầu hành trình phát triển sự nghiệp
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {jobs.map((job) => (
              <div
                key={job._id || job.id}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-blue-100 hover:border-blue-400 transform hover:-translate-y-2"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="p-3 gradient-recruitment-primary rounded-xl text-white transform group-hover:rotate-6 transition-transform">
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 transition-colors" style={{ color: 'inherit' }}>{job.title}</h3>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: '#e0f2fe' }}>
                    <MapPin className="w-5 h-5" style={{ color: '#105d97' }} />
                    <div>
                      <p className="text-xs text-gray-500">Địa điểm</p>
                      <p className="text-sm font-semibold text-gray-900">{job.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500">Lương</p>
                      <p className="text-sm font-semibold text-gray-900">{job.salary}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: '#f0f9ff' }}>
                    <Clock className="w-5 h-5" style={{ color: '#1e7bb8' }} />
                    <div>
                      <p className="text-xs text-gray-500">Kinh nghiệm</p>
                      <p className="text-sm font-semibold text-gray-900">{job.experience}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: '#fef3c7' }}>
                    <Users className="w-5 h-5" style={{ color: '#f59e0b' }} />
                    <div>
                      <p className="text-xs text-gray-500">Hình thức</p>
                      <p className="text-sm font-semibold text-gray-900">{job.type}</p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-6 leading-6">{job.description}</p>

                <button
                  onClick={() => setSelectedJob(job)}
                  className="w-full py-4 gradient-recruitment-btn text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                >
                  <span>Xem Chi Tiết & Ứng Tuyển</span>
                  <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedJob(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] mt-4 overflow-hidden shadow-2xl transform animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky gradient-recruitment-primary text-white px-8 py-6 flex justify-between items-start">
              <div className="flex-1">

                <h2 className="text-2xl  font-bold mb-1">{selectedJob.title}</h2>
                <p className="text-white/90 text-base">{selectedJob.location} • {selectedJob.type}</p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="w-12 h-12 rounded-full hover:bg-white/30 flex items-center justify-center transition-all backdrop-blur-sm transform hover:rotate-90 duration-300"
              >
                <span className="text-2xl text-white">×</span>
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="p-8 space-y-8">
                {/* Job Info Cards */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-4 p-5 gradient-recruitment-benefit rounded-2xl border border-blue-100 hover:shadow-lg transition-all">
                    <div className="p-3 gradient-recruitment-primary rounded-xl text-white">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Địa điểm</p>
                      <p className="font-bold text-sm text-gray-900">{selectedJob.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-5 bg-green-50 rounded-2xl border border-green-100 hover:shadow-lg transition-all">
                    <div className="p-3 gradient-recruitment-success rounded-xl text-white">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Mức lương</p>
                      <p className="font-bold text-sm text-gray-900">{selectedJob.salary}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-5 bg-blue-50 rounded-2xl border border-blue-100 hover:shadow-lg transition-all">
                    <div className="p-3 gradient-recruitment-secondary rounded-xl text-white">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Kinh nghiệm</p>
                      <p className="font-bold text-sm text-gray-900">{selectedJob.experience}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 gradient-recruitment-primary rounded-full"></div>
                    <h3 className="text-xl font-bold text-gray-900">Mô Tả Công Việc</h3>
                  </div>
                  <p className="text-gray-700 leading-6 text-base">{selectedJob.description}</p>
                </div>

                {/* Requirements */}
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-1 h-6 gradient-recruitment-primary rounded-full"></div>
                    <h3 className="text-2xl font-bold text-gray-900">Yêu Cầu</h3>
                  </div>
                  <div className="space-y-3">
                    {selectedJob.requirements.map((req, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:shadow-md transition-all" style={{ backgroundColor: '#eff6ff' }}>
                        <div className="flex-shrink-0 w-8 h-8 gradient-recruitment-primary rounded-full flex items-center justify-center text-white font-bold">
                          ✓
                        </div>
                        <span className="text-gray-800 leading-6 pt-1">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-1 h-6 gradient-recruitment-success rounded-full"></div>
                    <h3 className="text-2xl font-bold text-gray-900">Quyền Lợi</h3>
                  </div>
                  <div className="space-y-3">
                    {selectedJob.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-green-50 rounded-xl hover:shadow-md transition-all">
                        <div className="flex-shrink-0 w-8 h-8 gradient-recruitment-success rounded-full flex items-center justify-center text-white font-bold">
                          ★
                        </div>
                        <span className="text-gray-800 leading-6 pt-1">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Application Form */}
                <div className="gradient-recruitment-benefit p-8 rounded-2xl border-2 shadow-lg" style={{ borderColor: '#bfdbfe' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 gradient-recruitment-primary rounded-xl text-white">
                      <Zap className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Ứng Tuyển Ngay</h3>
                  </div>

                  {submitMessage.text && (
                    <div className={`mb-6 p-5 rounded-2xl shadow-md flex items-center gap-3 ${submitMessage.type === 'success'
                      ? 'gradient-recruitment-success text-white'
                      : 'bg-red-500 text-white'
                      }`}>
                      {submitMessage.type === 'success' ? '✓' : '✕'}
                      <span className="font-semibold">{submitMessage.text}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Họ và tên *
                        </label>
                        <input
                          type="text"
                          name="name"
                          placeholder="Nguyễn Văn A"
                          className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl transition-all focus:outline-none focus:border-blue-500"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          placeholder="email@example.com"
                          className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl transition-all focus:outline-none focus:border-blue-500"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Số điện thoại *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="0123 456 789"
                          className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl transition-all focus:outline-none focus:border-blue-500"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Vị trí ứng tuyển
                        </label>
                        <input
                          type="text"
                          name="position"
                          value={selectedJob.title}
                          className="w-full px-5 py-4 border-2 rounded-xl font-semibold"
                          style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe', color: '#105d97' }}
                          readOnly
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Giới thiệu bản thân
                      </label>
                      <textarea
                        name="message"
                        placeholder="Chia sẻ về kinh nghiệm, kỹ năng và lý do bạn phù hợp với vị trí này..."
                        rows="4"
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl transition-all focus:outline-none focus:border-blue-500"
                        disabled={isSubmitting}
                      ></textarea>
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <GraduationCap className="w-4 h-4" />
                        Đính kèm CV (PDF, DOC, DOCX)
                      </label>
                      <input
                        type="file"
                        name="cv"
                        accept=".pdf,.doc,.docx"
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:gradient-recruitment-primary file:text-white hover:file:opacity-90 transition-all"
                        disabled={isSubmitting}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-5 gradient-recruitment-btn text-white font-bold rounded-xl transition-all disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Đang gửi...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          <span>Gửi Hồ Sơ Ứng Tuyển</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Section */}
      <section className="relative py-10 gradient-recruitment-hero overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')" }}></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6 border border-white/30">
              <Heart className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-semibold">Liên Hệ</span>
            </div>

            <h2 className="text-xl md:text-4xl font-bold mb-2 text-white">
              Không Tìm Thấy Vị Trí Phù Hợp?
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-6">
              Đừng lo lắng! Gửi CV của bạn cho chúng tôi.
              Chúng tôi luôn chào đón những tài năng mới và sẽ liên hệ khi có cơ hội phù hợp
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="mailto:dongphucunivi@gmail.com"
                className="group inline-flex items-center gap-3 px-10 py-5 bg-white font-bold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
                style={{ color: '#105d97' }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
                <span>dongphucunivi@gmail.com</span>
                <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="tel:+84123456789"
                className="inline-flex items-center gap-3 px-10 py-5 bg-white/10 backdrop-blur-sm text-white font-bold rounded-full hover:bg-white/20 transition-all border border-white/30"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                </svg>
                <span>0834.204.999</span>
              </a>
            </div>

          </div>
        </div>
      </section>
    </DefaultLayout2>
  );
}

