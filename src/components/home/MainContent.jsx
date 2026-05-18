import { useEffect, useRef } from "react";
import demoCert from "../../assets/images/demo_certificates.png";
import { Link } from "react-router-dom";

const heroImage =
  "https://commons.wikimedia.org/wiki/Special:FilePath/Marx%20and%20Engels.jpg";
const philosophyImage =
  "https://commons.wikimedia.org/wiki/Special:FilePath/The%20School%20of%20Athens%20by%20Raffaello%20Sanzio%20da%20Urbino.jpg?width=1280";
const quizImage =
  "https://commons.wikimedia.org/wiki/Special:FilePath/Test%20%28student%20assessment%29.jpeg?width=1280";
const flashcardImage =
  "https://commons.wikimedia.org/wiki/Special:FilePath/Quizkaart%20test%20Normen.png";
const thinkingImage =
  "https://commons.wikimedia.org/wiki/Special:FilePath/Part%20of%20a%20bookshelf%20containing%20books%20about%20ancient%20philosophy%20%281%29.jpg?width=1280";

const MainContent = () => {
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

  useEffect(() => {
    const initVanta = () => {
      if (window.VANTA && window.VANTA.NET && vantaRef.current) {
        try {
          vantaEffect.current = window.VANTA.NET({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            color: 0xf2b441,
            backgroundColor: 0x0c1f24,
            points: 11.0,
            maxDistance: 22.0,
            spacing: 18.0,
          });
        } catch (err) {
          console.error("Vanta error:", err);
        }
      }
    };

    // Đợi một chút để đảm bảo DOM đã render
    const timer = setTimeout(initVanta, 500);

    return () => {
      clearTimeout(timer);
      if (vantaEffect.current) vantaEffect.current.destroy();
    };
  }, []);

  return (
    <div className="pagelayout-content d-flex flex-column">
      {/* Page Header */}
      <div id="page-header" className="nobg">
        <div className="inner">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <div className="page-heading flexcols">
                  <div className="page-header-left position-relative">
                    <h1 className="heding h2 iscurse maincoursepage">
                      <a
                        className="d-inline-block w-100"
                        href="/courses"
                        tabIndex="-1"
                      >
                        <span className="course-backtext">Course</span>
                        Không gian học tập nhóm 2
                      </a>
                    </h1>
                  </div>
                  <div className="page-header-right position-relative d-flex flex-wrap align-items-end"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="page-breadcrumb position-relative breadcrumb_modern">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <div className="flexcols">
                  <div className="breadcrumb">
                    <nav aria-label="Navigation bar">
                      <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                          <a href="/">
                            Trang chủ
                          </a>
                        </li>
                        <li className="breadcrumb-item">
                          <a href="/courses">
                            Bài học
                          </a>
                        </li>
                        <li className="breadcrumb-item">
                          <a href="/quiz">
                            Ôn tập
                          </a>
                        </li>
                        <li className="breadcrumb-item">
                          <a
                            href="/courses"
                            aria-current="page"
                            title="Triết học Mác - Lênin"
                          >
                            Bản đồ kiến thức
                          </a>
                        </li>
                      </ol>
                    </nav>
                  </div>
                  <div className="actions d-flex flex-wrap align-items-center"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Navigation */}
      <div className="page-secnav position-relative">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="secondary-navigation"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="page-b">
        <div className="mb2notices"></div>
        <div id="main-content">
          <div className="container-fluid">
            <div id="theme-main-content" className="row">
              <section className="content-col col-lg-12">
                <div id="region-main">
                  <div id="page-content">
                    <span
                      className="notifications"
                      id="user-notifications"
                    ></span>
                    <span id="maincontent"></span>

                    {/* Page Context Header */}
                    <div className="page-context-header m-0 p-0">
                      <h2 className="activity-name">Bản đồ học tập</h2>
                    </div>

                    {/* Activity Header */}
                    <div
                      className="activity-header d-flex justify-content-between align-items-center"
                      data-for="page-activity-header"
                    >
                      <div className="activity-header-moo">
                        <span className="sr-only">Completion requirements</span>
                        <div
                          data-region="activity-information"
                          data-activityname="Bản đồ học tập"
                          className="activity-information"
                        ></div>
                      </div>
                    </div>

                    {/* Main Content Role */}
                    <div role="main">
                      <div className="box py-3 generalbox center clearfix">
                        <div className="no-overflow"></div>
                      </div>
                    </div>

                    {/* Page Builder Content */}
                    <div className="mb2-pb-fpsection position-relative pre-bg0 hidden0 light">
                      <div
                        className="section-inner"
                        style={{ paddingTop: "0px", paddingBottom: "0px" }}
                      >
                        {/* Hero Section */}
                        <div
                          ref={vantaRef}
                          className="mb2-pb-row pre-bg0 dark bgfixed0 wave-none va0 bgfixed0 wavefliph1 wavepos0 colgutter-s parallax0 heroimg1 herovbottom herogradl0 herogradr0 bgtextmob0 waveover1 heroonsmall0 bordert0 borderb0 borderfw1 obgimg1 heroisimg isfw0 isbg rowpt-150 rowpb-100"
                          style={{
                            marginTop: "0px",
                            "--mb-pb-row_btcolor": "#dddddd",
                            "--mb-pb-row_bbcolor": "#dddddd",
                            "--mb-pb-row_btw": "1px",
                            "--mb-pb-row_bbw": "1px",
                            "--mb-pb-row_pt": "170px",
                            "--mb-pb-row_pb": "110px",
                          }}
                        >
                          <div className="section-inner mb2-pb-row-inner">
                            <div className="row-topgap w-100"></div>
                            <div className="container-fluid">
                              <div className="row">
                                <div className="mb2-pb-column col-lg-12 noempty light align-none aligncnone mobcenter1 moborder0">
                                  <div
                                    className="column-inner"
                                    style={{
                                      paddingBottom: "30px",
                                      maxWidth: "622px",
                                    }}
                                  >
                                    <div className="clearfix">
                                      <h4
                                        style={{
                                          marginTop: "0px",
                                          marginBottom: "45px",
                                          maxWidth: "2000px",
                                          marginLeft: "auto",
                                          marginRight: "auto",
                                          fontSize: "2.9rem",
                                          "--mb2-pb-heading-thshadow": "0.06em",
                                          "--mb2-pb-heading-tvshadow": "0.04em",
                                          "--mb2-pb-heading-tbshadow": "0px",
                                          "--mb2-pb-heading-tcshadow":
                                            "transparent",
                                        }}
                                        id="typed_69724aa5441fb"
                                        className="heading heading-none upper0 fwglobal lhglobal pbtsize-2"
                                      >
                                        <span className="btext fwglobal">
                                          Khám phá Triết học Mác - Lênin
                                        </span>
                                        <span
                                          className="headingtext fwglobal nline0"
                                          style={{ color: "rgb(255, 180, 0)" }}
                                        >
                                          {" "}
                                          Cùng Group2-AI1901
                                        </span>
                                      </h4>

                                      {/* Hero intro */}
                                      <div
                                        id="select_69724aa54422f"
                                        className="hero-intro-block"
                                        style={{
                                          marginTop: "0px",
                                          marginBottom: "45px",
                                          "--mb-pb-selecth": "51px",
                                          "--mb-pb-selectmh": "80",
                                          "--mb-pb-selectfs": "1.18rem",
                                          "--mb-pb-swidth": "287px",
                                        }}
                                        data-target="0"
                                      >
                                        <p className="hero-quote">
                                          <span className="labeltext">
                                            “Học triết không làm bạn giàu –
                                            nhưng làm bạn đặt câu hỏi vì sao
                                            mình nghèo.”
                                          </span>
                                        </p>
                                        <p className="hero-tagline">Học cùng nhau nhé</p>
                                          <div className="hero-cta-wrap">
                                            <Link
                                              to="/courses"
                                              className="mb2-pb-btn lhsmall rounded-1 btnborder1 fwglobal typeprimary hero-cta-btn"
                                              style={{
                                                "--mb2-pb-btn-color":
                                                  "rgb(255, 178, 0)",
                                                "--mb2-pb-btn-bghcolor":
                                                  "rgb(255, 178, 0)",
                                                "--mb2-pb-btn-hcolor":
                                                  "rgb(36, 32, 39)",
                                                "--mb2-pb-btn-borcolor":
                                                  "rgb(255, 178, 0)",
                                              }}
                                            >
                                              Xem Kiến thức
                                            </Link>
                                          </div>
                                      </div>

                                      {/* Feature List */}
                                      <div
                                        className="mb2-pb-listicon"
                                        style={{ marginBottom: "30px" }}
                                      >
                                        <ul
                                          className="theme-listicon mb2-pb-sortable-subelements iconbg1 horizontal1 border0 fwbold alignnone"
                                          style={{
                                            "--mb2-pb-listicon-fs": "1rem",
                                            "--mb2-pb-listicon-isize":
                                              "2.74rem",
                                            "--mb2-pb-listicon-space":
                                              "1.87rem",
                                          }}
                                        >
                                          <li className="mb2-pb-listicon_item">
                                            <div className="item-content">
                                              <span
                                                className="iconel d-inline-flex justify-content-center align-items-center"
                                                style={{
                                                  backgroundColor:
                                                    "rgb(255, 178, 0)",
                                                  color: "rgb(54, 38, 178)",
                                                }}
                                              >
                                                <i className="bi bi-check-lg"></i>
                                              </span>
                                              <span
                                                className="list-text"
                                                style={{
                                                  color: "rgb(0, 180, 216)",
                                                }}
                                              >
                                                Khám phá Triết học Mác - Lênin
                                              </span>
                                            </div>
                                          </li>
                                          <li className="mb2-pb-listicon_item">
                                            <div className="item-content">
                                              <span
                                                className="iconel d-inline-flex justify-content-center align-items-center"
                                                style={{
                                                  backgroundColor:
                                                    "rgb(255, 178, 0)",
                                                  color: "rgb(54, 38, 178)",
                                                }}
                                              >
                                                <i className="bi bi-check-lg"></i>
                                              </span>
                                              <span
                                                className="list-text"
                                                style={{
                                                  color: "rgb(0, 164, 197)",
                                                }}
                                              >
                                                Tử Vi đẩu số - "Hiểu mệnh - Biết
                                                vận - Làm chủ tương lai"
                                              </span>
                                            </div>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Hero Image */}
                            <div className="hero-img-wrap" aria-hidden="true">
                              <div className="hero-img-wrap2">
                                <div
                                  className="hero-img-wrap3"
                                  style={{
                                    width: "663px",
                                    left: "48%",
                                    "--mb2-pb-herovm": "-4px",
                                  }}
                                >
                                  <img
                                    className="hero-img lazy"
                                    src={heroImage}
                                    data-src={heroImage}
                                    alt=""
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Trusted By Section */}
                        <div
                          className="mb2-pb-row pre-bg0 light bgfixed0 wave-none va0 bgfixed0 wavefliph0 wavepos0 colgutter-s parallax0 heroimg0 herovcenter herogradl0 herogradr0 bgtextmob0 waveover1 heroonsmall1 bordert0 borderb0 borderfw1 obgimg1 heroisvideo isfw0 nobg rowpt-50 rowpb-0"
                          style={{
                            marginTop: "0px",
                            "--mb-pb-row_btcolor": "#dddddd",
                            "--mb-pb-row_bbcolor": "#dddddd",
                            "--mb-pb-row_btw": "1px",
                            "--mb-pb-row_bbw": "1px",
                            "--mb-pb-row_pt": "60px",
                            "--mb-pb-row_pb": "0px",
                          }}
                        >
                          <div className="section-inner mb2-pb-row-inner">
                            <div className="row-topgap w-100"></div>
                            <div className="container-fluid">
                              <div className="row">
                                <div className="mb2-pb-column col-lg-12 noempty light align-none aligncnone mobcenter0 moborder0">
                                  <div
                                    className="column-inner"
                                    style={{
                                      paddingBottom: "30px",
                                      maxWidth: "2000px",
                                    }}
                                  >
                                    <div className="clearfix">
                                      <h4
                                        style={{
                                          marginTop: "0px",
                                          marginBottom: "30px",
                                          maxWidth: "2000px",
                                          marginLeft: "auto",
                                          marginRight: "auto",
                                          fontSize: "1.25rem",
                                          "--mb2-pb-heading-thshadow": "0.06em",
                                          "--mb2-pb-heading-tvshadow": "0.04em",
                                          "--mb2-pb-heading-tbshadow": "0px",
                                          "--mb2-pb-heading-tcshadow":
                                            "transparent",
                                        }}
                                        id="typed_69724aa544346"
                                        className="heading heading-center upper0 fwglobal lhglobal pbtsize-1"
                                      >
                                        <span
                                          className="headingtext fwglobal nline0"
                                          style={{ color: "#00B4D8" }}
                                        >
                                          Không học thuộc lòng khô cứng; hãy nối
                                          mỗi phạm trù với một vấn đề thật mà bạn
                                          đang thấy quanh mình.
                                        </span>
                                      </h4>
                                      <div
                                        className="mb2-image align-none center1"
                                        style={{
                                          marginBottom: "30px",
                                          width: "450px",
                                          maxWidth: "100%",
                                        }}
                                      >
                                        <img
                                          className="lazy"
                                          src={philosophyImage}
                                          data-src={philosophyImage}
                                          alt=""
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div
                            className="mb2-pb-row pre-bg0 light bgfixed0 wave-none va0 bgfixed0 wavefliph0 wavepos0 colgutter-s parallax0 heroimg0 herovcenter herogradl0 herogradr0 bgtextmob0 waveover1 heroonsmall1 bordert0 borderb0 borderfw1 obgimg1 heroisvideo isfw0 nobg rowpt-0 rowpb-0"
                            style={{
                              "--mb-pb-row_bbcolor": "#dddddd",
                              "--mb-pb-row_bbw": "1px",
                              "--mb-pb-row_btcolor": "#dddddd",
                              "--mb-pb-row_btw": "1px",
                              "--mb-pb-row_pb": "0px",
                              "--mb-pb-row_pt": "0px",
                              marginTop: "0px",
                            }}
                          >
                            <div className="section-inner mb2-pb-row-inner">
                              <div className="container-fluid">
                                <div className="row">
                                  <div className="mb2-pb-column col-lg-12 noempty light align-none aligncnone mobcenter0 moborder0">
                                    <div
                                      className="column-inner"
                                      style={{
                                        maxWidth: "4000px",
                                        paddingBottom: "30px",
                                      }}
                                    >
                                      <div className="clearfix">
                                        <div
                                          className="theme-text"
                                          style={{
                                            marginLeft: "auto",
                                            marginRight: "auto",
                                            maxWidth: "2000px",
                                          }}
                                        >
                                          <div
                                            className="theme-text-inner align-none text-rgb(0, 180, 216) rounded0 gradient0 light"
                                            style={{
                                              "--mb2-pb-graddeg": "180deg",
                                            }}
                                          >
                                            <div
                                              className="theme-text-text upper0 fwbold lhglobal"
                                              style={{
                                                color: "rgb(0, 180, 216)",
                                                fontSize: "1rem",
                                              }}
                                            >
                                              <p>Vào học thôi</p>
                                            </div>
                                          </div>
                                        </div>
                                        <h4
                                          className="heading heading-none upper0 fwglobal lhglobal pbtsize-2"
                                          id="typed_69724aa54461f"
                                          style={{
                                            "--mb2-pb-heading-tbshadow": "0px",
                                            "--mb2-pb-heading-tcshadow":
                                              "transparent",
                                            "--mb2-pb-heading-thshadow":
                                              "0.06em",
                                            "--mb2-pb-heading-tvshadow":
                                              "0.04em",
                                            fontSize: "2.3rem",
                                            marginBottom: "15px",
                                            marginLeft: "auto",
                                            marginRight: "auto",
                                            marginTop: "0px",
                                            maxWidth: "2000px",
                                          }}
                                        >
                                          <span
                                            className="headingtext fwglobal nline0"
                                            style={{ color: "#00B4D8" }}
                                          >
                                            Chọn cách học hợp với bạn
                                          </span>
                                        </h4>
                                        <div
                                          className="theme-text"
                                          style={{
                                            marginBottom: "50px",
                                            marginLeft: "auto",
                                            marginRight: "auto",
                                            maxWidth: "1994px",
                                          }}
                                        >
                                          <div
                                            className="theme-text-inner align-none text- rounded0 gradient0 light"
                                            style={{
                                              "--mb2-pb-graddeg": "180deg",
                                            }}
                                          >
                                            <div
                                              className="theme-text-text upper0 fwglobal lhglobal"
                                              style={{
                                                fontSize: "1rem",
                                              }}
                                            >
                                              <p>
                                                Mỗi phần được thiết kế để học
                                                nhanh hơn: đọc ý chính, tự làm
                                                câu hỏi, lật thẻ ghi nhớ và xem
                                                lại phần còn yếu trước khi vào
                                                bài tiếp theo.
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                        <div
                                          className="theme-boxes theme-boxesimg type-4 gutter-normal theme-col-3 smtitle1 rounded0 wave0 paddingm linkbtn2 btnhor0 theme-boxesimg shadow1 itemlink0 tcenter0 boxcolor-primary center1 clearfix"
                                          style={{
                                            "--mb2-pb-bxbgcolor":
                                              "rgba(                                                  54,                                                  38,                                                  178,                                                  0.05                                                )",
                                            "--mb2-pb-bxbocolor":
                                              "rgb(                                                  54,                                                  38,                                                  178                                                )",
                                          }}
                                        >
                                          <div className="theme-box el_onmobile1">
                                            <div
                                              className="theme-boximg position-relative"
                                              style={{
                                                "--mb2-pb-bxbgcolor":
                                                  "rgba(                                                      0,                                                      180,                                                      216,                                                      0.05                                                    )",
                                                "--mb2-pb-bxbocolor":
                                                  "rgb(                                                      0,                                                      180,                                                      216                                                    )",
                                                "--mb2-pb-bxborder": "2px",
                                              }}
                                            >
                                              <div className="box-allcontent">
                                                <div className="box-image">
                                                  <img
                                                    alt="Cloud playgrounds"
                                                    className="theme-boximg-img lazy"
                                                    data-src={quizImage}
                                                    src={quizImage}
                                                    style={{
                                                      maxWidth: "800px",
                                                    }}
                                                  />
                                                </div>
                                                <div className="vtable-wrapp">
                                                  <div className="vtable">
                                                    <div className="vtable-cell">
                                                      <div className="box-content">
                                                        <h4
                                                          className="box-title pbtsize-1 fwglobal lhglobal"
                                                          style={{
                                                            fontSize: "1.4rem",
                                                          }}
                                                        >
                                                          <span className="box-title-text">
                                                            Quiz nhanh
                                                          </span>
                                                        </h4>
                                                        <div className="box-desc">
                                                          Trả lời từng câu ngắn,
                                                          xem giải thích ngay và
                                                          biết mình đang vướng ở
                                                          chủ đề nào.
                                                        </div>
                                                        <span className="theme-boximg-color" />
                                                        <div className="box-readmore">
                                                          <Link
                                                            className="boxlink mb2-pb-btn typeprimary sizenormal rounded-1 btnborder0 fwglobal"
                                                            to="/quiz"
                                                            style={{
                                                              "--mb2-pb-btn-bgcolor":
                                                                "rgb(0, 180, 216)",
                                                              "--mb2-pb-btn-bghcolor":
                                                                "rgb(0, 167, 203)",
                                                            }}
                                                          >
                                                            Làm quiz
                                                          </Link>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="theme-boximg-color" />
                                              <div
                                                className="theme-boximg-imgel lazy"
                                                data-bg={quizImage}
                                              >
                                                <div
                                                  className="gradient-el gradient-left"
                                                  style={{
                                                    backgroundImage:
                                                      "linear-gradient(                                                          to right,                                                          rgba(                                                            0,                                                            180,                                                            216,                                                            0.05                                                          ),                                                          rgba(255, 255, 255, 0)                                                        )",
                                                  }}
                                                />
                                                <div
                                                  className="gradient-el gradient-right"
                                                  style={{
                                                    backgroundImage:
                                                      "linear-gradient(                                                          to right,                                                          rgba(                                                            255,                                                            255,                                                            255,                                                            0                                                          ),                                                          rgba(                                                            0,                                                            180,                                                            216,                                                            0.05                                                          )                                                        )",
                                                  }}
                                                />
                                              </div>
                                            </div>
                                          </div>
                                          <div className="theme-box el_onmobile1">
                                            <div
                                              className="theme-boximg position-relative"
                                              style={{
                                                "--mb2-pb-bxborder": "2px",
                                              }}
                                            >
                                              <div className="box-allcontent">
                                                <div className="box-image">
                                                  <img
                                                    alt="Professional certificates"
                                                    className="theme-boximg-img lazy"
                                                    data-src={flashcardImage}
                                                    src={flashcardImage}
                                                    style={{
                                                      maxWidth: "800px",
                                                    }}
                                                  />
                                                </div>
                                                <div className="vtable-wrapp">
                                                  <div className="vtable">
                                                    <div className="vtable-cell">
                                                      <div className="box-content">
                                                        <h4
                                                          className="box-title pbtsize-1 fwglobal lhglobal"
                                                          style={{
                                                            fontSize: "1.4rem",
                                                          }}
                                                        >
                                                          <span className="box-title-text">
                                                            Memory Lab
                                                          </span>
                                                        </h4>
                                                        <div className="box-desc">
                                                          Lật cặp hình, ghép ý
                                                          tương ứng và luyện ghi
                                                          nhớ khái niệm bằng nhịp
                                                          chơi nhanh.
                                                        </div>
                                                        <span className="theme-boximg-color" />
                                                        <div className="box-readmore">
                                                          <Link
                                                            className="boxlink mb2-pb-btn typeprimary sizenormal rounded-1 btnborder0 fwglobal"
                                                            to="/flip"
                                                            style={{
                                                              "--mb2-pb-btn-bgcolor":
                                                                "rgb(54, 38, 178)",
                                                              "--mb2-pb-btn-bghcolor":
                                                                "rgb(41, 25, 165)",
                                                            }}
                                                          >
                                                            Chơi ngay
                                                          </Link>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="theme-boximg-color" />
                                              <div
                                                className="theme-boximg-imgel lazy"
                                                data-bg={flashcardImage}
                                              >
                                                <div
                                                  className="gradient-el gradient-left"
                                                  style={{
                                                    backgroundImage:
                                                      "linear-gradient(                                                          to right,                                                          ,                                                          rgba(255, 255, 255, 0)                                                        )",
                                                  }}
                                                />
                                                <div
                                                  className="gradient-el gradient-right"
                                                  style={{
                                                    backgroundImage:
                                                      "linear-gradient(                                                          to right,                                                          rgba(255, 255, 255, 0)                                                        )",
                                                  }}
                                                />
                                              </div>
                                            </div>
                                          </div>
                                          <div className="theme-box el_onmobile1">
                                            <div
                                              className="theme-boximg position-relative"
                                              style={{
                                                "--mb2-pb-bxbgcolor":
                                                  "rgba(                                                      255,                                                      178,                                                      0,                                                      0.05                                                    )",
                                                "--mb2-pb-bxbocolor":
                                                  "rgb(                                                      255,                                                      178,                                                      0                                                    )",
                                                "--mb2-pb-bxborder": "2px",
                                              }}
                                            >
                                              <div className="box-allcontent">
                                                <div className="box-image">
                                                  <img
                                                    alt="Learn with experts"
                                                    className="theme-boximg-img lazy"
                                                    data-src={thinkingImage}
                                                    src={thinkingImage}
                                                    style={{
                                                      maxWidth: "800px",
                                                    }}
                                                  />
                                                </div>
                                                <div className="vtable-wrapp">
                                                  <div className="vtable">
                                                    <div className="vtable-cell">
                                                      <div className="box-content">
                                                        <h4
                                                          className="box-title pbtsize-1 fwglobal lhglobal"
                                                          style={{
                                                            fontSize: "1.4rem",
                                                          }}
                                                        >
                                                          <span className="box-title-text">
                                                            Lá số vui cùng AI
                                                          </span>
                                                        </h4>
                                                        <div className="box-desc">
                                                          Một góc giải trí nhẹ:
                                                          lập lá số, đọc luận
                                                          giải tham khảo và xem
                                                          AI diễn đạt theo cách
                                                          dễ hiểu.
                                                        </div>
                                                        <span className="theme-boximg-color" />
                                                        <div className="box-readmore">
                                                          <Link
                                                            className="boxlink mb2-pb-btn typeprimary sizenormal rounded-1 btnborder0 fwglobal"
                                                            to="/tuvi"
                                                            style={{
                                                              "--mb2-pb-btn-bgcolor":
                                                                "rgb(                                                                    255,                                                                    178,                                                                    0                                                                  )",
                                                              "--mb2-pb-btn-bghcolor":
                                                                "rgb(                                                                    242,                                                                    165,                                                                    0                                                                  )",
                                                              "--mb2-pb-btn-color":
                                                                "rgb(                                                                    36,                                                                    32,                                                                    39                                                                  )",
                                                              "--mb2-pb-btn-hcolor":
                                                                "rgb(                                                                    36,                                                                    32,                                                                    39                                                                  )",
                                                            }}
                                                          >
                                                            Thử lá số
                                                          </Link>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="theme-boximg-color" />
                                              <div
                                                className="theme-boximg-imgel lazy"
                                                data-bg={thinkingImage}
                                              >
                                                <div
                                                  className="gradient-el gradient-left"
                                                  style={{
                                                    backgroundImage:
                                                      "linear-gradient(                                                          to right,                                                          rgba(                                                            255,                                                            178,                                                            0,                                                            0.05                                                          ),                                                          rgba(255, 255, 255, 0)                                                        )",
                                                  }}
                                                />
                                                <div
                                                  className="gradient-el gradient-right"
                                                  style={{
                                                    backgroundImage:
                                                      "linear-gradient(                                                          to right,                                                          rgba(                                                            255,                                                            255,                                                            255,                                                            0                                                          ),                                                          rgba(                                                            255,                                                            178,                                                            0,                                                            0.05                                                          )                                                        )",
                                                  }}
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="mb2-pb-row pre-bg0 light bgfixed0 wave-none va0 bgfixed0 wavefliph0 wavepos0 colgutter-s parallax0 heroimg0 herovcenter herogradl0 herogradr0 bgtextmob0 waveover1 heroonsmall1 bordert0 borderb0 borderfw1 obgimg1 heroisvideo isfw0 nobg rowpt-50 rowpb-0"
                            style={{
                              "--mb-pb-row_bbcolor": "#dddddd",
                              "--mb-pb-row_bbw": "1px",
                              "--mb-pb-row_btcolor": "#dddddd",
                              "--mb-pb-row_btw": "1px",
                              "--mb-pb-row_pb": "0px",
                              "--mb-pb-row_pt": "50px",
                              marginTop: "0px",
                            }}
                          >
                            <div className="section-inner mb2-pb-row-inner">
                              <div className="row-topgap w-100" />
                              <div className="container-fluid">
                                <div className="row">
                                  <div className="mb2-pb-column col-lg-12 noempty light align-none aligncnone mobcenter1 moborder0">
                                    <div
                                      className="column-inner"
                                      style={{
                                        maxWidth: "2000px",
                                        paddingBottom: "30px",
                                      }}
                                    >
                                      <div className="clearfix">
                                        <div
                                          className="mb2-pb-ba position-relative align-items-end imgpos-left iscontent1 imgcrop0 imgvalignend imgonsm0 rounded0 shadow1 paddingnormal d-flex flex-column justify-content-center"
                                          style={{
                                            "--mb-pb-ba_bgcolor":
                                              "rgb(                                                  211,                                                  235,                                                  240                                                )",
                                            "--mb-pb-ba_color":
                                              "rgb(                                                  79,                                                  76,                                                  81                                                )",
                                            "--mb-pb-ba_cwidth": "610px",
                                            "--mb-pb-ba_imghpos": "-3%",
                                            "--mb-pb-ba_tcolor":
                                              "rgb(                                                  36,                                                  32,                                                  39                                                )",
                                            backgroundImage:
                                              `url("${philosophyImage}")`,
                                            marginBottom: "30px",
                                            minHeight: "477px",
                                          }}
                                        >
                                          <div className="mb2-pb-ba_inner position-relative">
                                            <div className="mb2-pb-ba_title">
                                              <h4
                                                className="ba_title title mb-0 pbtsize-2 fwglobal lhglobal"
                                                style={{
                                                  fontSize: "2.3rem",
                                                }}
                                              >
                                                <span className="title-text">
                                                  Bản đồ kiến thức gọn để ôn
                                                  trước giờ kiểm tra
                                                </span>
                                              </h4>
                                            </div>
                                            <div
                                              className="mb2-pb-ba_content fwglobal lhglobal"
                                              style={{
                                                fontSize: "1rem",
                                                marginTop: "1.9rem",
                                              }}
                                            >
                                              <p>
                                                Nội dung được chia thành từng
                                                mục nhỏ, có ý chính, ví dụ và
                                                câu hỏi kiểm tra để bạn tự ôn
                                                mà không phải lướt qua quá nhiều
                                                đoạn dài.
                                              </p>
                                              <img
                                                alt="demo_certificates.png"
                                                src={demoCert}
                                                style={{
                                                  marginTop: "0.9rem",
                                                }}
                                                width="280"
                                              />
                                            </div>
                                            <div
                                              className="mb2-pb-ba_btn"
                                              style={{
                                                marginTop: "2.1rem",
                                              }}
                                            >
                                              <Link
                                                className="mb2-pb-btn sizexlg rounded-1 btnborder0"
                                                to="/courses"
                                                style={{
                                                  "--mb2-pb-btn-bgcolor":
                                                    "rgb(                                                        54,                                                        38,                                                        178                                                      )",
                                                  "--mb2-pb-btn-bghcolor":
                                                    "rgb(                                                        41,                                                        25,                                                        165                                                      )",
                                                }}
                                              >
                                                Mở tài liệu
                                              </Link>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Page Date */}
                    <span className="mb2-pb-pagedate sr-only">
                      Không gian học tập nhóm 2
                    </span>

                    {/* Course Navigation */}
                    <div className="theme-coursenav flexcols"></div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
        <div className="mb2notices"></div>
      </div>
    </div>
  );
};

export default MainContent;
