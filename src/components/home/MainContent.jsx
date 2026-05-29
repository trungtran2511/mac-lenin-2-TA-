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
    desc: "Trả lời từng câu ngắn, xem giải thích ngay và biết mình đang vướng ở chủ đề nào.",
    image: quizImage,
    link: "/quiz",
    cta: "Làm quiz",
  },
  {
    title: "Memory Lab",
    desc: "Lật cặp hình, ghép ý tương ứng và luyện ghi nhớ khái niệm bằng nhịp chơi nhanh.",
    image: flashcardImage,
    link: "/flip",
    cta: "Chơi ngay",
  },
  {
    title: "Lá số vui cùng AI",
    desc: "Một góc giải trí nhẹ: lập lá số, đọc luận giải tham khảo và xem AI diễn đạt theo cách dễ hiểu.",
    image: thinkingImage,
    link: "/tuvi",
    cta: "Thử lá số",
  },
  {
    title: "Triết Profile",
    desc: "Trả lời 12 tình huống vui để xem bạn nghiêng về duy vật biện chứng, duy tâm, biện chứng hay thực tiễn luận.",
    image: philosophyImage,
    link: "/philosophy-profile",
    cta: "Check vibe",
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
