import "../../styles/home/footer.css";

const Footer = () => {
  return (
    <footer id="footer" className="modern-footer">
      {/* Top Section */}
      <div className="footer-top">
        <div className="footer-container">
          <div className="footer-grid">
            {/* Left Column */}
            <div className="footer-brand">
              <h4 className="footer-logo">
                Nhóm 2<sup>®</sup>
              </h4>
              <p className="footer-tagline">
                Không gian học tập Triết học Mác&nbsp;‑&nbsp;Lênin
              </p>

              <div className="footer-links-row">
                {[
                  "Bài học chia theo chủ đề",
                  "Câu hỏi ôn tập có giải thích",
                  "Thẻ nhớ và trò chơi nhanh",
                  "Tài liệu gọn để xem lại",
                ].map((item) => (
                  <span key={item} className="footer-link-tag">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div className="footer-contact">
              <h4 className="footer-heading">Liên hệ nhóm</h4>
              <div className="footer-contact-list">
                <div className="footer-contact-item">
                  <i className="bi bi-envelope-at" />
                  <span>tranduytrung251105@gmail.com</span>
                </div>
                <div className="footer-contact-item">
                  <i className="bi bi-telephone" />
                  <span>0822777349</span>
                </div>
              </div>

              <h4 className="footer-heading" style={{ marginTop: "2rem" }}>
                Theo dõi
              </h4>
              <div className="footer-social">
                <a
                  href="https://www.facebook.com/trung.tran.678726?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                  aria-label="Facebook"
                >
                  <i className="bi bi-facebook" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="footer-bottom-inner">
            <span className="footer-copyright">
              © 2026 Nhóm 2 — Website học tập Triết học Mác‑Lênin.
            </span>
            <div className="footer-bottom-links">
              {["Giới thiệu", "Bài học", "Liên hệ"].map((item) => (
                <a key={item} href="#" className="footer-bottom-link">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
