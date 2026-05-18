import React from "react";

const Footer = () => {
  return (
    <footer id="footer" className="custom-footer main-footer">
      <div className="mb2-pb-fpsection position-relative pre-bg0 hidden0 light">
        <div
          className="section-inner"
          style={{ paddingTop: "0px", paddingBottom: "0px" }}
        >
          {/* Footer Main Row */}
          <div
            className="mb2-pb-row pre-bg0 dark bgfixed0 wave-none va0 bgfixed0 wavefliph0 wavepos0 colgutter-m parallax0 heroimg0 herovcenter herogradl0 herogradr0 bgtextmob0 waveover1 heroonsmall1 bordert0 borderb1 borderfw0 obgimg1 heroisvideo isfw0 isbg rowpt-100 rowpb-50"
            style={{
              marginTop: "0px",
              "--mb-pb-row_bgcolor": "rgb(16, 29, 66)",
              "--mb-pb-row_btcolor": "#dddddd",
              "--mb-pb-row_bbcolor": "rgba(255, 255, 255, 0.15)",
              "--mb-pb-row_btw": "1px",
              "--mb-pb-row_bbw": "1px",
              "--mb-pb-row_pt": "110px",
              "--mb-pb-row_pb": "50px",
            }}
          >
            <div className="section-inner mb2-pb-row-inner">
              <div className="row-topgap w-100"></div>
              <div className="container-fluid">
                <div className="row">
                  {/* Left Column */}
                  <div className="mb2-pb-column col-lg-7 noempty light align-none aligncnone mobcenter1 moborder0">
                    <div
                      className="column-inner"
                      style={{ paddingBottom: "30px", maxWidth: "2000px" }}
                    >
                      <div className="clearfix">
                        <h4
                          style={{
                            marginTop: "0px",
                            marginBottom: "45px",
                            maxWidth: "2000px",
                            marginLeft: "auto",
                            marginRight: "auto",
                            fontSize: "1.4rem",
                            "--mb2-pb-heading-thshadow": "0.06em",
                            "--mb2-pb-heading-tvshadow": "0.04em",
                            "--mb2-pb-heading-tbshadow": "0px",
                            "--mb2-pb-heading-tcshadow": "transparent",
                          }}
                          id="typed_69724aa546235"
                          className="heading heading-none upper0 fwglobal lhglobal pbtsize-1"
                        >
                          <span className="headingtext fwglobal nline0">
                            Không gian học tập nhóm 2
                          </span>
                        </h4>

                        <ul
                          className="theme-list mb2-pb-list list1 horizontal1 list-none fwglobal lhsmall upper0"
                          style={{
                            marginBottom: "30px",
                            "--mb2-pb-listcolor": "rgb(255, 255, 255)",
                            "--mb2-pb-listhcolor": "rgb(255, 178, 0)",
                            "--mb2-pb-listgap": "2.03rem",
                            "--mb2-pb-listpl": "0rem",
                            fontSize: "1rem",
                          }}
                        >
                          {[
                            "Bài học chia theo chủ đề",
                            "Câu hỏi ôn tập có giải thích",
                            "Thẻ nhớ và trò chơi nhanh",
                            "Tài liệu gọn để xem lại",
                          ].map((item, idx) => (
                            <li key={idx}>
                              <a className="llink" href="#">
                                {item}
                              </a>
                            </li>
                          ))}
                        </ul>

                        <div
                          className="border-hor custom double0 border-solid"
                          style={{
                            borderColor: "rgba(255, 255, 255, 0.15)",
                            borderWidth: "1px",
                            marginTop: "30px",
                            marginBottom: "30px",
                          }}
                        ></div>

                        <ul
                          className="theme-list mb2-pb-list list1 horizontal1 list-none fwglobal lhglobal upper0"
                          style={{
                            marginBottom: "30px",
                            "--mb2-pb-listcolor": "rgb(255, 255, 255)",
                            "--mb2-pb-listhcolor": "rgb(255, 178, 0)",
                            "--mb2-pb-listgap": "2.03rem",
                            "--mb2-pb-listpl": "0rem",
                            fontSize: "1rem",
                          }}
                        >
                          {[
                            "Học theo từng mục nhỏ",
                            "Ôn trước khi kiểm tra",
                            "Chơi để nhớ lâu hơn",
                            "Góc lá số vui",
                          ].map((item, idx) => (
                            <li key={idx}>
                              <a className="llink" href="#">
                                {item}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="mb2-pb-column col-lg-5 noempty light align-none aligncnone mobcenter1 moborder0">
                    <div
                      className="column-inner"
                      style={{ paddingBottom: "30px", maxWidth: "2000px" }}
                    >
                      <div className="clearfix">
                        <h4
                          style={{
                            marginTop: "0px",
                            marginBottom: "30px",
                            maxWidth: "2000px",
                            marginLeft: "auto",
                            marginRight: "auto",
                            fontSize: "1.4rem",
                            "--mb2-pb-heading-thshadow": "0.06em",
                            "--mb2-pb-heading-tvshadow": "0.04em",
                            "--mb2-pb-heading-tbshadow": "0px",
                            "--mb2-pb-heading-tcshadow": "transparent",
                          }}
                          id="typed_69724aa546357"
                          className="heading heading-none upper0 fwglobal lhglobal pbtsize-1"
                        >
                          <span className="headingtext fwglobal nline0">
                            Cần góp ý nội dung? Gửi cho nhóm mình nhé.
                          </span>
                        </h4>

                        <div
                          className="mb2-pb-listicon"
                          style={{ marginBottom: "30px" }}
                        >
                          <ul
                            className="theme-listicon mb2-pb-sortable-subelements iconbg0 horizontal0 border0 fwglobal alignnone"
                            style={{
                              "--mb2-pb-listicon-fs": "1rem",
                              "--mb2-pb-listicon-isize": "2.31rem",
                              "--mb2-pb-listicon-space": "0.34rem",
                            }}
                          >
                            <li className="mb2-pb-listicon_item">
                              <div className="item-content">
                                <span
                                  className="iconel d-inline-flex justify-content-center align-items-center"
                                  style={{ color: "rgb(255, 178, 0)" }}
                                >
                                  <i className="bi bi-envelope-at"></i>
                                </span>
                                <span className="list-text">
                                  tranduytrung251105@gmail.com
                                </span>
                              </div>
                            </li>
                            <li className="mb2-pb-listicon_item">
                              <div className="item-content">
                                <span
                                  className="iconel d-inline-flex justify-content-center align-items-center"
                                  style={{ color: "rgb(255, 178, 0)" }}
                                >
                                  <i className="bi bi-telephone"></i>
                                </span>
                                <span className="list-text">
                                  0822777349
                                </span>
                              </div>
                            </li>
                          </ul>
                        </div>

                        <h4
                          style={{
                            marginTop: "50px",
                            marginBottom: "27px",
                            maxWidth: "2000px",
                            marginLeft: "auto",
                            marginRight: "auto",
                            fontSize: "1.4rem",
                            "--mb2-pb-heading-thshadow": "0.06em",
                            "--mb2-pb-heading-tvshadow": "0.04em",
                            "--mb2-pb-heading-tbshadow": "0px",
                            "--mb2-pb-heading-tcshadow": "transparent",
                          }}
                          id="typed_69724aa5463a7"
                          className="heading heading-none upper0 fwglobal lhglobal pbtsize-1"
                        >
                          <span className="headingtext fwglobal nline0">
                            Theo dõi nhóm tại đây
                          </span>
                        </h4>

                        <div
                          className="mb2-pb-social sizel rounded1 type2"
                          style={{
                            marginTop: "0px",
                            marginBottom: "30px",
                            "--mb2-social-space": "11px",
                            "--mb2-social-color": "rgb(0, 180, 216)",
                            "--mb2-social-borcolor": "rgb(0, 180, 216)",
                            "--mb2-social-hcolor": "rgb(255, 255, 255)",
                            "--mb2-social-hbgcolor": "rgb(0, 180, 216)",
                            "--mb2-social-hborcolor": "rgb(0, 180, 216)",
                          }}
                        >
                          <ul className="social-list">
                            {[
                              {
                                name: "Facebook",
                                icon: "facebook",
                                class: "bi bi-facebook",
                                link: "https://www.facebook.com/trung.tran.678726?mibextid=wwXIfr",
                              },
                            ].map((social, idx) => (
                              <li key={idx} className={`li-${social.icon}`}>
                                <a
                                  className="social-link"
                                  href={social.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  data-toggle="tooltip"
                                  data-bs-toggle="tooltip"
                                  data-placement="top"
                                  title={social.name}
                                  aria-label={social.name}
                                >
                                  <i className={social.class}></i>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom Row */}
          <div
            className="mb2-pb-row pre-bg0 dark bgfixed0 wave-none va1 bgfixed0 wavefliph0 wavepos0 colgutter-s parallax0 heroimg0 herovcenter herogradl0 herogradr0 bgtextmob0 waveover1 heroonsmall1 bordert0 borderb0 borderfw1 obgimg1 heroisvideo isfw0 isbg rowpt-0 rowpb-0"
            style={{
              marginTop: "0px",
              "--mb-pb-row_bgcolor": "rgb(16, 29, 66)",
              "--mb-pb-row_btcolor": "rgba(255, 255, 255, 0.451)",
              "--mb-pb-row_bbcolor": "#dddddd",
              "--mb-pb-row_btw": "1px",
              "--mb-pb-row_bbw": "1px",
              "--mb-pb-row_pt": "40px",
              "--mb-pb-row_pb": "0px",
            }}
          >
            <div className="section-inner mb2-pb-row-inner">
              <div className="row-topgap w-100"></div>
              <div className="container-fluid">
                <div className="row">
                  <div className="mb2-pb-column col-lg-6 noempty light align-none aligncnone mobcenter1 moborder0">
                    <div
                      className="column-inner"
                      style={{ paddingBottom: "30px", maxWidth: "2000px" }}
                    >
                      <div className="clearfix">
                        <div
                          className="mb2-pb-date"
                          style={{
                            marginTop: "0px",
                            marginBottom: "10px",
                            fontSize: "1rem",
                          }}
                        >
                          <span className="before">© 2026</span>
                          <span className="after">
                            Nhóm 2 - Website học tập Triết học Mác - Lênin.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb2-pb-column col-lg-6 noempty light align-none aligncnone mobcenter1 moborder0">
                    <div
                      className="column-inner"
                      style={{ paddingBottom: "30px", maxWidth: "2000px" }}
                    >
                      <div className="clearfix">
                        <ul
                          className="theme-list mb2-pb-list list1 horizontal1 list-right list-none fwglobal lhglobal upper0"
                          style={{
                            marginBottom: "10px",
                            "--mb2-pb-listcolor": "rgb(255, 255, 255)",
                            "--mb2-pb-listhcolor": "rgb(255, 178, 0)",
                            "--mb2-pb-listgap": "2.03rem",
                            "--mb2-pb-listpl": "0rem",
                            fontSize: "1rem",
                          }}
                        >
                          {["Giới thiệu", "Bài học", "Liên hệ"].map((item, idx) => (
                            <li key={idx}>
                              <a className="llink" href="#">
                                {item}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
