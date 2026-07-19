import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/tuvi/TuviPage.css";
import { createGeminiService } from "../services/geminiService";

const TuviPage = () => {
  const [formData, setFormData] = useState({
    hoten: "",
    nganhhoc: "",
    style: "competition", // competition, monopoly, cartel
    muctieu: "",
  });

  const [luanGiai, setLuanGiai] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);
  const geminiServiceRef = useRef(null);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    geminiServiceRef.current = createGeminiService(GEMINI_API_KEY);
  }, [GEMINI_API_KEY]);

  // Khởi tạo Vanta.js net effect
  useEffect(() => {
    if (!vantaEffect.current && vantaRef.current && window.VANTA) {
      const isMobile = window.innerWidth <= 768;

      vantaEffect.current = window.VANTA.NET({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: isMobile ? 100.0 : 600.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0x3f51b5,
        backgroundColor: 0x11191b,
        points: 10.0,
        maxDistance: 20.0,
        spacing: 15.0,
      });
    }

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createPrompt = () => {
    const styleLabelMap = {
      competition: "Cạnh tranh tự do (Không ngừng đổi mới sáng tạo, tối ưu giá trị lao động cá biệt)",
      monopoly: "Độc quyền tự nhiên (Tập trung kỹ năng hiếm, chuyên biệt sâu để tạo rào cản tự nhiên)",
      cartel: "Liên kết độc quyền (Thích làm việc nhóm, xây dựng các liên minh chiến lược)",
    };

    return `Bạn là Cố vấn Kinh tế & Quản trị chiến lược cá nhân sử dụng lý thuyết trong "Chương 4: Cạnh tranh và độc quyền trong nền kinh tế thị trường" (Triết học Mác - Lênin). 
Hãy phân tích hồ sơ năng lực cạnh tranh và lập báo cáo chiến lược phát triển sự nghiệp chi tiết cho cá nhân sau:

**HỒ SƠ CÁ NHÂN:**
- Họ và tên / Biệt danh: ${formData.hoten || "Học viên ẩn danh"}
- Ngành học / Lĩnh vực: ${formData.nganhhoc || "Chưa xác định"}
- Phong cách hành vi lựa chọn: ${styleLabelMap[formData.style]}
- Mục tiêu nghề nghiệp / Trăn trở: ${formData.muctieu || "Tối ưu hóa giá trị thặng dư bản thân, phát triển nghề nghiệp vững chắc."}

Hãy viết một bản luận giải chi tiết theo đúng cấu trúc sau (viết bằng tiếng Việt, văn phong chuyên nghiệp, vừa học thuật vừa thực tế, hướng nghiệp cao và kết hợp các thuật ngữ kinh tế Chương 4):

## 1. ĐỊNH VỊ SỨC LAO ĐỘNG & LỢI THẾ SO SÁNH
Phân tích ngành học "${formData.nganhhoc || "Chưa xác định"}" trên thị trường lao động hiện tại. Đâu là "lợi thế so sánh" (vũ khí cạnh tranh cốt lõi) giúp người này có thể nâng cao giá trị sức lao động cá biệt so với thời gian lao động xã hội cần thiết?

## 2. PHÂN TÍCH HÀNH VI CẠNH TRANH CÁ NHÂN
Đánh giá phong cách hành vi "${styleLabelMap[formData.style]}" của họ. Phân tích ưu điểm và hạn chế của phong cách này dưới góc nhìn của quy luật cạnh tranh tự do hoặc xu thế độc quyền.

## 3. CẢNH BÁO NGUY CƠ TRÌ TRỆ ĐỘC QUYỀN
Chỉ ra những thói quen hoặc tình huống trong sự nghiệp dễ dẫn đến "sự trì trệ độc quyền cá nhân" (ví dụ: tự mãn khi ở vùng an toàn, bảo thủ không đổi mới công nghệ bản thân, thiếu sáng tạo). Làm sao để tránh rơi vào bẫy trì trệ kinh tế này?

## 4. CHIẾN LƯỢC HÀNH ĐỘNG THEO QUY LUẬT GIÁ TRỊ
Đưa ra 3 lời khuyên cụ thể dựa trên Quy luật giá trị và quy luật cung - cầu để giúp họ liên tục tích lũy giá trị thặng dư cá nhân, định giá cao bản thân và vượt qua các rào cản độc quyền lớn trên thị trường lao động.

Lưu ý:
- Viết văn phong chuyên nghiệp, dễ hiểu, tích cực và mang lại giá trị thực tế cao.
- Độ dài khoảng 800 - 1000 từ.`;
  };

  const createLocalLuanGiai = (
    reason = "Gemini API key chưa được cấu hình",
  ) => {
    const styleLabelMap = {
      competition: "Cạnh tranh tự do (Không ngừng đổi mới sáng tạo, tối ưu giá trị lao động cá biệt)",
      monopoly: "Độc quyền tự nhiên (Tập trung kỹ năng hiếm, chuyên biệt sâu để tạo rào cản tự nhiên)",
      cartel: "Liên kết độc quyền (Thích làm việc nhóm, xây dựng các liên minh chiến lược)",
    };

    return `## 1. ĐỊNH VỊ SỨC LAO ĐỘNG & LỢI THẾ SO SÁNH
Chào ${formData.hoten || "bạn"}, với ngành học/lĩnh vực "${formData.nganhhoc || "Chưa xác định"}", thị trường lao động hiện tại đòi hỏi bạn phải liên tục gia tăng hàm lượng trí tuệ trong công việc để giảm thời gian lao động cá biệt dưới mức trung bình xã hội. Lợi thế so sánh của bạn nằm ở việc kết hợp kiến thức nền tảng vững vàng với kỹ năng thực hành xuất sắc. Đây là bản luận giải cục bộ vì lý do: ${reason}.

## 2. PHÂN TÍCH HÀNH VI CẠNH TRANH CÁ NHÂN
Lựa chọn phong cách hành vi "${styleLabelMap[formData.style]}" của bạn thể hiện định hướng rõ ràng về cách tiếp cận thị trường. Cạnh tranh lành mạnh đòi hỏi sự linh hoạt đổi mới, trong khi xu thế độc quyền kỹ năng có thể mang lại vị thế cao nhưng cần liên tục cập nhật để tránh lạc hậu.

## 3. CẢNH BÁO NGUY CƠ TRÌ TRỆ ĐỘC QUYỀN
Ở góc độ kinh tế học Chương 4, độc quyền không kiểm soát sẽ làm suy giảm động lực cải tiến kỹ thuật. Rủi ro lớn nhất đối với bạn là sự tự mãn khi đạt được một vị trí ổn định tạm thời. Sự trì trệ này sẽ khiến giá trị sức lao động của bạn giảm dần so với đà phát triển chung của thị trường.

## 4. CHIẾN LƯỢC HÀNH ĐỘNG THEO QUY LUẬT GIÁ TRỊ
Bạn nên:
1. Áp dụng quy luật giá trị bằng cách tối ưu hóa hiệu suất làm việc để nâng cao chất lượng sản phẩm lao động.
2. Nắm bắt quy luật cung - cầu bằng cách học thêm các kỹ năng đang có nhu cầu cao nhưng nguồn cung còn khan hiếm.
3. Không ngừng đổi mới, tự tạo ra lợi thế độc quyền kỹ năng riêng để tạo rào cản gia nhập thị trường đối với các đối thủ cạnh tranh.`;
  };

  const isGeminiFallbackError = (message = "") => {
    const normalizedMessage = message.toLowerCase();
    return (
      normalizedMessage.includes("quá tải") ||
      normalizedMessage.includes("chạm giới hạn") ||
      normalizedMessage.includes("quota") ||
      normalizedMessage.includes("429") ||
      normalizedMessage.includes("503")
    );
  };

  const generateLuanGiai = async () => {
    if (!formData.hoten.trim() || !formData.nganhhoc.trim()) {
      alert("Vui lòng điền họ tên và ngành học của bạn!");
      return;
    }

    const apiStatus = geminiServiceRef.current?.getApiKeyStatus();
    if (!geminiServiceRef.current || !apiStatus?.isValid) {
      setLuanGiai(createLocalLuanGiai("Gemini API key chưa được cấu hình"));
      setError(null);
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const prompt = createPrompt();
      const response = await geminiServiceRef.current.generateResponse(prompt);
      setLuanGiai(response);
    } catch (err) {
      console.error("❌ Lỗi:", err);
      if (isGeminiFallbackError(err.message)) {
        setLuanGiai(
          createLocalLuanGiai(
            "Gemini đang quá tải hoặc API key đã chạm giới hạn sử dụng",
          ),
        );
        setError(
          "Gemini đang quá tải hoặc hết quota, nên hệ thống đang hiển thị bản luận giải cục bộ. Bạn có thể thử lại sau ít phút.",
        );
        return;
      }
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="tuvi-container-wrapper" ref={vantaRef}>
      <div className="masthead">
        <div className="container-2">
          <Link to="/">
            <button className="back-home">
              <span className="text">Quay trở lại </span>
            </button>
          </Link>
          <h1 className="wordmark">Cố vấn Cạnh tranh & Kinh tế</h1>
          <p className="advisor-subtitle" style={{ textAlign: "center", color: "rgba(255,255,255,0.7)", marginBottom: "2rem" }}>
            Lập chiến lược phát triển sự nghiệp cá nhân dựa trên lý thuyết Cạnh tranh & Độc quyền (Chương 4)
          </p>

          <div className="formborder tuvi-form-panel">
            <form
              id="lstv"
              className="tuvi-lookup-form"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="tuvi-form-topline">
                <span>Thông tin hồ sơ</span>
                <strong>Chiến lược Chương 4</strong>
              </div>

              <div className="tuvi-form-grid">
                <div className="tuvi-field tuvi-field-wide">
                  <span className="tuvi-field-label">Họ tên / Biệt danh</span>
                  <input
                    type="text"
                    name="hoten"
                    id="hoten"
                    value={formData.hoten}
                    onChange={handleChange}
                    placeholder="Nhập tên hoặc biệt danh của bạn"
                    required
                  />
                </div>

                <div className="tuvi-field tuvi-field-wide">
                  <span className="tuvi-field-label">Ngành học / Lĩnh vực học tập</span>
                  <input
                    type="text"
                    name="nganhhoc"
                    id="nganhhoc"
                    value={formData.nganhhoc}
                    onChange={handleChange}
                    placeholder="Ví dụ: Kỹ thuật phần mềm, Quản trị kinh doanh..."
                    required
                  />
                </div>

                <div className="tuvi-field tuvi-field-wide">
                  <span className="tuvi-field-label">Phong cách cạnh tranh mong muốn</span>
                  <select
                    name="style"
                    id="style"
                    value={formData.style}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "12px",
                      background: "rgba(25, 30, 35, 0.95)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      color: "#fff",
                      fontFamily: "inherit"
                    }}
                  >
                    <option value="competition">Cạnh tranh tự do (Không ngừng đổi mới, tối ưu giá trị sức lao động)</option>
                    <option value="monopoly">Độc quyền tự nhiên (Tạo lợi thế kỹ năng hiếm, xây dựng rào cản cá nhân)</option>
                    <option value="cartel">Liên kết chiến lược (Xây dựng liên minh, làm việc nhóm cộng sinh)</option>
                  </select>
                </div>

                <div className="tuvi-field tuvi-field-wide">
                  <span className="tuvi-field-label">Mục tiêu nghề nghiệp & Trăn trở hiện tại</span>
                  <textarea
                    name="muctieu"
                    id="muctieu"
                    rows="3"
                    value={formData.muctieu}
                    onChange={handleChange}
                    placeholder="Mô tả mục tiêu của bạn hoặc những thách thức bạn đang gặp phải trên thị trường lao động..."
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "12px",
                      background: "rgba(25, 30, 35, 0.95)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      color: "#fff",
                      fontFamily: "inherit"
                    }}
                  />
                </div>
              </div>

              <div className="tuvi-submit-row">
                <input
                  type="button"
                  className="button primary"
                  value="Lập chiến lược cạnh tranh"
                  id="laplaso"
                  onClick={generateLuanGiai}
                />
              </div>
            </form>
          </div>

          {/* Kết quả luận giải */}
          {(luanGiai || isAnalyzing || error) && (
            <div className="tuvi-reading-panel mt-5">
              <div className="tuvi-reading-header">
                <div>
                  <p className="tuvi-reading-kicker">Chiến lược đề xuất</p>
                  <h3>
                    <i className="bi bi-briefcase-fill me-2"></i>
                    Báo cáo định vị & Cố vấn Cạnh tranh
                  </h3>
                </div>
              </div>
              <div className="tuvi-reading-body">
                {isAnalyzing && (
                  <div className="tuvi-reading-loading">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Đang phân tích...</span>
                    </div>
                    <p>
                      <i className="bi bi-sparkles me-2"></i>
                      AI đang lập chiến lược cạnh tranh cho bạn, vui lòng chờ...
                    </p>
                  </div>
                )}

                {error && (
                  <div className="tuvi-reading-error" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}

                {luanGiai && (
                  <div className="luan-giai-content">
                    {luanGiai.split("\n").map((para, i) => {
                      if (para.startsWith("## ")) {
                        return (
                          <h4 key={i} className="tuvi-reading-section-title">
                            {para.replace("## ", "")}
                          </h4>
                        );
                      }
                      if (para.trim()) {
                        return (
                          <p key={i} className="tuvi-reading-paragraph">
                            {para}
                          </p>
                        );
                      }
                      return null;
                    })}

                    <div className="tuvi-reading-note">
                      <p>
                        <i className="bi bi-info-circle me-2"></i>
                        <strong>Lưu ý:</strong> Luận giải này được tích hợp góc nhìn lý thuyết Chương 4 Triết học 2 và phân tích bởi AI. Kết quả mang tính chất gợi ý định hướng học tập, sự nghiệp và tư duy kinh tế.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TuviPage;
