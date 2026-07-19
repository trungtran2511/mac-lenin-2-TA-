import { Link } from "react-router-dom";
import demoCert from "../../assets/images/demo_certificates.png";
import "../../styles/home/main-content.css";

const philosophyImage =
  "https://commons.wikimedia.org/wiki/Special:FilePath/The%20School%20of%20Athens%20by%20Raffaello%20Sanzio%20da%20Urbino.jpg?width=1280";
const quizImage =
  "https://commons.wikimedia.org/wiki/Special:FilePath/Test%20%28student%20assessment%29.jpeg?width=1280";
const flashcardImage =
  "https://commons.wikimedia.org/wiki/Special:FilePath/Quizkaart%20test%20Normen.png";
const thinkingImage =
  "https://commons.wikimedia.org/wiki/Special:FilePath/Part%20of%20a%20bookshelf%20containing%20books%20about%20ancient%20philosophy%20%281%29.jpg?width=1280";

const FEATURES = [
  {
    title: "Quiz nhanh",
    desc: "Trả lời từng câu hỏi trắc nghiệm Chương 4, xem giải thích chi tiết ngay lập tức để củng cố kiến thức.",
    image: quizImage,
    link: "/quiz",
    cta: "Làm quiz",
  },
  {
    title: "Memory Lab",
    desc: "Lật thẻ ghi nhớ, ghép cặp thuật ngữ và luyện phản xạ ghi nhớ khái niệm cốt lõi bằng nhịp chơi nhanh.",
    image: flashcardImage,
    link: "/flip",
    cta: "Chơi ngay",
  },
  {
    title: "Cố vấn Cạnh tranh & Kinh tế",
    desc: "Nhập hồ sơ cá nhân và nhận tư vấn chiến lược cạnh tranh, định vị sức lao động dưới góc nhìn Chương 4 cùng AI.",
    image: thinkingImage,
    link: "/tuvi",
    cta: "Nhận cố vấn",
  },
];

const MainContent = () => {
  return (
    <div className="main-content-modern">
      {/* ── Quote Section ── */}
      <section className="mc-quote-section">
        <div className="mc-container">
          <p className="mc-quote">
            "Không học thuộc lòng khô cứng; hãy nối mỗi phạm trù với một vấn
            đề thật mà bạn đang thấy quanh mình."
          </p>
          <div className="mc-quote-image">
            <img
              src={philosophyImage}
              alt="The School of Athens"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="mc-features-section">
        <div className="mc-container">
          <span className="mc-label">Vào học thôi</span>
          <h2 className="mc-section-title">Chọn cách học hợp với bạn</h2>
          <p className="mc-section-desc">
            Mỗi phần được thiết kế để học nhanh hơn: đọc ý chính, tự làm câu
            hỏi, lật thẻ ghi nhớ và xem lại phần còn yếu trước khi vào bài
            tiếp theo.
          </p>

          <div className="mc-features-grid">
            {FEATURES.map((feat) => (
              <div className="mc-feature-card" key={feat.title}>
                <div className="mc-feature-img">
                  <img src={feat.image} alt={feat.title} loading="lazy" />
                </div>
                <div className="mc-feature-body">
                  <h3 className="mc-feature-title">{feat.title}</h3>
                  <p className="mc-feature-desc">{feat.desc}</p>
                  <Link to={feat.link} className="mc-feature-cta">
                    {feat.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Knowledge Map Section ── */}
      <section className="mc-knowledge-section">
        <div className="mc-container">
          <div className="mc-knowledge-card">
            <div className="mc-knowledge-text">
              <h2 className="mc-knowledge-title">
                Bản đồ kiến thức gọn để ôn trước giờ kiểm tra
              </h2>
              <p className="mc-knowledge-desc">
                Nội dung được chia thành từng mục nhỏ, có ý chính, ví dụ và câu
                hỏi kiểm tra để bạn tự ôn mà không phải lướt qua quá nhiều
                đoạn dài.
              </p>
              <img
                src={demoCert}
                alt="Demo certificates"
                className="mc-knowledge-cert"
                width="280"
              />
              <Link to="/courses" className="mc-knowledge-cta">
                Mở tài liệu
              </Link>
            </div>
            <div className="mc-knowledge-img">
              <img
                src={philosophyImage}
                alt="Philosophy books"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainContent;
