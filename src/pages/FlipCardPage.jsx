import { useEffect, useState } from "react";
import $ from "jquery";
import "../styles/flip/flip.css";
import { Link, useNavigate } from "react-router-dom";

// Database câu hỏi cho Monopoly Matcher (Phân Loại Tài Phiệt)
const matcherPool = [
  {
    text: "Các doanh nghiệp ký thỏa thuận cam kết giữ sản lượng và giá bán không thấp hơn mức quy định, nhưng độc lập về sản xuất và thương mại.",
    answer: "Các-ten",
    ex: "Các-ten (Cartel) là liên minh độc quyền sơ khai nhất, các thành viên chỉ cam kết về giá và sản lượng, vẫn độc lập sản xuất và tiêu thụ."
  },
  {
    text: "Một công ty phân phối chung được thành lập để bán toàn bộ đường của 10 nhà máy mía đường lớn nhằm đè bẹp các xí nghiệp nhỏ lẻ.",
    answer: "Xanh-đi-ca",
    ex: "Xanh-đi-ca (Syndicate) thống nhất đầu mối phân phối sản phẩm hoặc thu mua nguyên liệu, thành viên độc lập về sản xuất."
  },
  {
    text: "Các xí nghiệp dệt thỏa thuận chỉ mua bông thông qua một văn phòng thu mua duy nhất để đè giá nguyên liệu đầu vào.",
    answer: "Xanh-đi-ca",
    ex: "Xanh-đi-ca (Syndicate) tập trung đầu mối thương mại để ép giá nguyên liệu đầu vào có lợi nhất."
  },
  {
    text: "Các hãng xe hơi lớn hợp nhất toàn bộ nhà xưởng, nhân viên và bộ máy quản trị dưới sự chỉ đạo của một ban giám đốc chung, chủ cũ nhận cổ tức.",
    answer: "Tờ-rớt",
    ex: "Tờ-rớt (Trust) sáp nhập hoàn toàn sản xuất, lưu thông và quản trị thành một ban quản trị chung."
  },
  {
    text: "Liên minh độc quyền đa ngành khổng lồ kết hợp hàng chục xí nghiệp công nghiệp và ngân hàng lớn làm trung tâm điều phối vốn.",
    answer: "Công-soóc-xi-om",
    ex: "Công-soóc-xi-om (Consortium) liên kết đa ngành từ sản xuất, thương mại đến tài chính ngân hàng."
  },
  {
    text: "Một tập đoàn tài phiệt kiểm soát từ mỏ dầu, nhà máy lọc dầu, mạng lưới đường ống, trạm xăng, xí nghiệp bảo hiểm đến ngân hàng đầu tư.",
    answer: "Công-soóc-xi-om",
    ex: "Công-soóc-xi-om (Consortium) kết hợp sản xuất công nghiệp dọc-ngang và tư bản tài chính ngân hàng làm hạt nhân."
  },
  {
    text: "Chính phủ trực tiếp đầu tư ngân sách để nắm giữ độc quyền ngành Điện lực, Đường sắt và Sản xuất vũ khí quốc phòng.",
    answer: "Độc quyền Nhà nước",
    ex: "Nhà nước nắm độc quyền các ngành then chốt thông qua quốc hữu hóa hoặc đầu tư công."
  },
  {
    text: "Ngân hàng lớn bắt tay với các tập đoàn công nghiệp chế tạo máy bay để cùng đầu tư sản xuất và xuất khẩu tư bản ra nước ngoài.",
    answer: "Công-soóc-xi-om",
    ex: "Sự thâm nhập lẫn nhau giữa độc quyền ngân hàng và độc quyền công nghiệp tạo thành tài phiệt tài chính."
  },
  {
    text: "Chính phủ ban hành gói cứu trợ tài chính trị giá hàng tỷ USD để giải cứu các ngân hàng thương mại độc quyền tư nhân khỏi nguy cơ sụp đổ.",
    answer: "Độc quyền Nhà nước",
    ex: "Độc quyền nhà nước dùng nguồn lực công để cứu trợ hoặc bảo hiểm cho các thế lực độc quyền tư nhân."
  },
  {
    text: "Các công ty dầu mỏ phân chia khu vực tiêu thụ miền Nam và miền Bắc để độc chiếm thị trường mà không xâm phạm lãnh thổ của nhau.",
    answer: "Các-ten",
    ex: "Phân chia thị trường tiêu thụ là một dạng thỏa hiệp thị phần điển hình của Các-ten."
  },
  {
    text: "Các công ty dược phẩm lớn sáp nhập toàn bộ văn phòng nghiên cứu phát triển và hệ thống kinh doanh dưới một ban chỉ đạo chung.",
    answer: "Tờ-rớt",
    ex: "Việc sáp nhập hoàn toàn cả nghiên cứu, sản xuất, tiêu thụ dưới ban quản trị chung là đặc thù của Tờ-rớt (Trust)."
  },
  {
    text: "Nhà nước ban hành các đạo luật chống độc quyền độc chiếm, áp đặt trần giá bán điện hoặc điều tiết hoạt động của các tập đoàn tư nhân khổng lồ.",
    answer: "Độc quyền Nhà nước",
    ex: "Nhà nước sử dụng pháp luật để điều tiết kinh tế vĩ mô, xoa dịu mâu thuẫn xã hội có lợi cho chế độ độc quyền."
  }
];

const categoryMap = {
  "Các-ten": "cartel",
  "Xanh-đi-ca": "syndicate",
  "Tờ-rớt": "trust",
  "Công-soóc-xi-om": "consortium",
  "Độc quyền Nhà nước": "state-monopoly"
};

export default function FlipCardPage() {
  const [activeTab, setActiveTab] = useState("flip");
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const navigate = useNavigate();

  // --- MONOPOLY MATCHER STATE ---
  const [matcherScore, setMatcherScore] = useState(0);
  const [matcherTimeLeft, setMatcherTimeLeft] = useState(60);
  const [matcherState, setMatcherState] = useState("intro"); // 'intro', 'playing', 'ended'
  const [matcherQuestions, setMatcherQuestions] = useState([]);
  const [matcherCurrentIndex, setMatcherCurrentIndex] = useState(0);
  const [matcherFeedback, setMatcherFeedback] = useState(null);
  const [fallingWords, setFallingWords] = useState([]);
  const [matcherHighScore, setMatcherHighScore] = useState(() => {
    return parseInt(localStorage.getItem("matcher_highscore")) || 0;
  });
  const [matcherHistory, setMatcherHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("matcher_history")) || [];
    } catch {
      return [];
    }
  });

  // --- MEMORY FLIP GAME JQUERY EFFECT ---
  useEffect(() => {
    if (activeTab !== "flip") return;

    // localStorage functions
    function set(key, value) {
      localStorage.setItem(key, value);
    }
    function get(key) {
      return localStorage.getItem(key);
    }
    function increase(el) {
      set(el, parseInt(get(el)) + 1);
    }
    function decrease(el) {
      set(el, parseInt(get(el)) - 1);
    }

    var toTime = function (nr) {
      if (nr == "-:-") return nr;
      else {
        var n = " " + nr / 1000 + " ";
        return n.substr(0, n.length - 1) + "s";
      }
    };

    function updateStats() {
      $("#stats").html(
        '<div class="padded"><h2>Thống kê: <span>' +
          "<b>" +
          get("flip_won") +
          "</b><i>Thắng</i>" +
          "<b>" +
          get("flip_lost") +
          "</b><i>Thua</i>" +
          "<b>" +
          get("flip_abandoned") +
          "</b><i>Bỏ ván</i></span></h2>" +
          "<ul><li><b>Dễ nhanh nhất:</b> <span>" +
          toTime(get("flip_casual")) +
          "</span></li>" +
          "<li><b>Vừa nhanh nhất:</b> <span>" +
          toTime(get("flip_medium")) +
          "</span></li>" +
          "<li><b>Khó nhanh nhất:</b> <span>" +
          toTime(get("flip_hard")) +
          "</span></li></ul>" +
          "<ul><li><b>Tổng lượt lật:</b> <span>" +
          parseInt(
            (parseInt(get("flip_matched")) + parseInt(get("flip_wrong"))) * 2,
          ) +
          "</span></li>" +
          "<li><b>Lật đúng:</b> <span>" +
          get("flip_matched") +
          "</span></li>" +
          "<li><b>Lật sai:</b> <span>" +
          get("flip_wrong") +
          "</span></li></ul></div>",
      );
    }

    function shuffle(array) {
      var currentIndex = array.length,
        temporaryValue,
        randomIndex;
      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      return array;
    }

    function createCardFallback(index) {
      const symbols = [
        "CT", "DQ", "TB", "NH", "LN", "MC", "TC", "TP", "XK", "TD", "NN", "CN",
        "CG", "VT", "EU", "BM", "LS", "XH", "SH", "QH", "LN", "GC", "TH", "KH",
        "TD", "TT", "TP", "SX", "LD", "TD", "CTD", "DQNN"
      ];
      const hue = (index * 41) % 360;
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320">
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(${hue}, 72%, 38%)"/>
              <stop offset="100%" stop-color="hsl(${(hue + 44) % 360}, 78%, 22%)"/>
            </linearGradient>
          </defs>
          <rect width="320" height="320" rx="34" fill="url(#g)"/>
          <circle cx="244" cy="72" r="42" fill="rgba(255,255,255,.16)"/>
          <path d="M52 220 C98 154, 130 246, 174 174 S244 122, 270 88" fill="none" stroke="#f2b441" stroke-width="14" stroke-linecap="round"/>
          <rect x="70" y="72" width="180" height="176" rx="24" fill="rgba(247,248,243,.9)"/>
          <text x="160" y="168" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="72" font-weight="900" fill="#172026">${symbols[index] || index + 1}</text>
          <text x="160" y="220" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#007d84">TRIET 2 - CH4</text>
        </svg>`;

      return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
    }

    function startScreen(text) {
      $(".game-area").removeAttr("class").addClass("game-area").empty();
      $(".game-intro-wrapper").fadeIn(250);

      const statusMap = {
        flip: {
          label: "Sẵn sàng",
          detail: "Chọn cấp độ trong ô Play để bắt đầu ván mới.",
        },
        nice: {
          label: "Thắng rồi",
          detail: "Bạn đã ghép hết các cặp. Chọn cấp độ để chơi tiếp.",
        },
        fail: {
          label: "Hết giờ",
          detail: "Thử lại với cấp độ thấp hơn hoặc ghi nhớ theo cụm màu.",
        },
      };
      const status = statusMap[text] || statusMap.flip;

      $(".memory-status")
        .removeClass("is-win is-fail is-ready")
        .addClass(
          text === "nice" ? "is-win" : text === "fail" ? "is-fail" : "is-ready",
        );
      $(".memory-status-title").text(status.label);
      $(".memory-status-detail").text(status.detail);

      if (text == "nice") {
        increase("flip_won");
        decrease("flip_abandoned");
      } else if (text == "fail") {
        increase("flip_lost");
        decrease("flip_abandoned");
      }
      updateStats();
    }

    // Init localStorage
    if (!get("flip_won") && !get("flip_lost") && !get("flip_abandoned")) {
      set("flip_won", 0);
      set("flip_lost", 0);
      set("flip_abandoned", 0);
      set("flip_casual", "-:-");
      set("flip_medium", "-:-");
      set("flip_hard", "-:-");
      set("flip_matched", 0);
      set("flip_wrong", 0);
    }

    if (
      get("flip_won") > 0 ||
      get("flip_lost") > 0 ||
      get("flip_abandoned") > 0
    ) {
      updateStats();
    }

    $('.game-intro-wrapper .game-card:not(".twist")').on("click", function (e) {
      $(this)
        .toggleClass("active")
        .siblings()
        .not(".twist")
        .removeClass("active");
      if ($(e.target).is(".playnow")) {
        $(".game-intro-wrapper .game-card").last().addClass("active");
      }
    });

    $(".play").on("click", function (e) {
      e.preventDefault();
      increase("flip_abandoned");
      $(".game-info").fadeOut();

      var difficulty = "",
        timer = 1000,
        level = $(this).data("level");

      if (level == 8) {
        difficulty = "casual";
        timer *= level * 4;
      } else if (level == 18) {
        difficulty = "medium";
        timer *= level * 5;
      } else if (level == 32) {
        difficulty = "hard";
        timer *= level * 6;
      }

      $(".flip-game-container")
        .removeClass("casual-mode medium-mode hard-mode")
        .addClass(difficulty + "-mode");
      $(".game-area").addClass(difficulty);

      $(".game-intro-wrapper").fadeOut(250, function () {
        var startGame = Date.now(),
          obj = [];

        for (var i = 0; i < level; i++) {
          obj.push(i);
        }

        var shu = shuffle($.merge(obj, obj)),
          gridSize = Math.sqrt(shu.length);

        $(".game-area").css("--game-cols", gridSize);

        for (var cardIndex = 0; cardIndex < shu.length; cardIndex++) {
          var imageIndex = shu[cardIndex];
          var fallbackUrl = createCardFallback(imageIndex);

          var card = $(
            '<div class="game-card">' +
              '<div class="game-flipper">' +
              '<div class="game-front"></div>' +
              '<div class="game-back">' +
              '<img class="game-card-img" alt="Thẻ triết học" />' +
              "</div>" +
              "</div>" +
              "</div>",
          );

          card
            .find(".game-back")
            .css({
              "--card-image": "url(" + fallbackUrl + ")",
              "background-image": "url(" + fallbackUrl + ")",
              "background-size": "cover",
              "background-position": "center",
              "background-repeat": "no-repeat",
            })
            .attr("data-img", fallbackUrl);

          card
            .find(".game-card-img")
            .attr("src", fallbackUrl)
            .on("error", function () {
              $(this).attr("src", fallbackUrl);
            });

          card.appendTo(".flip-game-container .game-area");
        }

        $(".game-area .game-card").on({
          mousedown: function () {
            if ($(".game-area").attr("data-paused") == 1) {
              return;
            }

            var $this = $(this).addClass("active");
            var data = $this.find(".game-back").attr("data-img");

            if ($(".game-area").find(".game-card.active").length > 1) {
              setTimeout(function () {
                var thisCard = $(
                  ".game-area .active .game-back[data-img='" + data + "']",
                );

                if (thisCard.length > 1) {
                  thisCard
                    .parents(".game-card")
                    .toggleClass("active game-card found")
                    .empty();
                  increase("flip_matched");

                  if (!$(".game-area .game-card").length) {
                    var time = Date.now() - startGame;
                    if (
                      get("flip_" + difficulty) == "-:-" ||
                      get("flip_" + difficulty) > time
                    ) {
                      set("flip_" + difficulty, time);
                    }
                    startScreen("nice");
                  }
                } else {
                  $(".game-area .game-card.active").removeClass("active");
                  increase("flip_wrong");
                }
              }, 401);
            }
          },
        });

        $('<i class="game-timer"></i>')
          .prependTo(".game-area")
          .css({
            animation: "timer " + timer + "ms linear",
          })
          .one(
            "webkitAnimationEnd oanimationend msAnimationEnd animationend",
            function () {
              startScreen("fail");
            },
          );

        $(window)
          .off()
          .on("keyup", function (e) {
            if (e.keyCode == 80) {
              if ($(".game-area").attr("data-paused") == 1) {
                $(".game-area").attr("data-paused", "0");
                $(".game-timer").css("animation-play-state", "running");
                $(".game-pause").remove();
              } else {
                $(".game-area").attr("data-paused", "1");
                $(".game-timer").css("animation-play-state", "paused");
                $('<div class="game-pause"></div>').appendTo(
                  ".flip-game-container",
                );
              }
            }
            if (e.keyCode == 27) {
              startScreen("flip");
              if ($(".game-area").attr("data-paused") == 1) {
                $(".game-area").attr("data-paused", "0");
                $(".game-pause").remove();
              }
              $(window).off();
            }
          });
      });
    });

    $(".share-click").on("click", function () {
      $(this).toggleClass("open");
      $(".share-box-wrapper").slideToggle("fast");
    });

    return () => {
      $(window).off();
      $(".play").off();
      $(".share-click").off();
      $('.game-intro-wrapper .game-card:not(".twist")').off();
      $(".game-area").empty();
    };
  }, [activeTab]);

  // --- MONOPOLY MATCHER GAME TIMER ---
  useEffect(() => {
    let interval = null;
    if (activeTab === "matcher" && matcherState === "playing") {
      interval = setInterval(() => {
        setMatcherTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            endMatcherGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTab, matcherState]);

  // --- MONOPOLY MATCHER SPAWN TRIGGERS ---
  useEffect(() => {
    if (activeTab === "matcher" && matcherState === "playing" && matcherQuestions.length > 0) {
      spawnFallingWords();
    }
  }, [matcherCurrentIndex, matcherState, matcherQuestions]);

  const startMatcherGame = () => {
    const shuffled = [...matcherPool].sort(() => Math.random() - 0.5);
    setMatcherQuestions(shuffled);
    setMatcherScore(0);
    setMatcherTimeLeft(60);
    setMatcherCurrentIndex(0);
    setMatcherFeedback(null);
    setMatcherState("playing");
  };

  const spawnFallingWords = () => {
    const categories = ["Các-ten", "Xanh-đi-ca", "Tờ-rớt", "Công-soóc-xi-om", "Độc quyền Nhà nước"];
    
    // Shuffle channels to prevent words from falling in the same vertical column
    const channels = [8, 26, 44, 62, 80].sort(() => Math.random() - 0.5);
    
    // Spawn delays to spread the falling elements over time
    const delays = [0, 0.8, 1.6, 2.4, 3.2].sort(() => Math.random() - 0.5);
    
    const words = categories.map((cat, index) => {
      const duration = 5.0 + Math.random() * 1.5; // Random fall duration (5s - 6.5s)
      return {
        id: `${cat}-${Date.now()}-${index}`,
        text: cat,
        x: channels[index],
        delay: delays[index],
        duration: duration
      };
    });
    
    setFallingWords(words);
  };

  const endMatcherGame = (finalScore = null) => {
    setMatcherState("ended");
    setFallingWords([]);
    const scoreToSave = finalScore !== null ? finalScore : matcherScore;

    if (scoreToSave > matcherHighScore) {
      setMatcherHighScore(scoreToSave);
      localStorage.setItem("matcher_highscore", scoreToSave);
    }

    const newHistory = [
      { score: scoreToSave, date: new Date().toLocaleDateString("vi-VN") },
      ...matcherHistory
    ].slice(0, 5);
    setMatcherHistory(newHistory);
    localStorage.setItem("matcher_history", JSON.stringify(newHistory));
  };

  const handleWordClick = (word) => {
    if (matcherFeedback) return;

    const currentQuestion = matcherQuestions[matcherCurrentIndex];
    const isCorrect = word.text === currentQuestion.answer;

    let newScore = matcherScore;
    if (isCorrect) {
      newScore += 10;
      setMatcherScore(newScore);
      setMatcherFeedback({
        type: "success",
        message: "Chính xác! +10 điểm 🎉",
        explanation: currentQuestion.ex
      });
      setFallingWords([]); // Clear remaining falling words immediately
    } else {
      newScore = Math.max(0, newScore - 5);
      setMatcherScore(newScore);
      setMatcherFeedback({
        type: "error",
        message: `Sai rồi! -5 điểm (Bạn chọn: ${word.text}) ❌`,
        explanation: `Đáp án đúng là: ${currentQuestion.answer}. ${currentQuestion.ex}`
      });
      // Remove only this wrong word bubble
      setFallingWords((prev) => prev.filter((w) => w.id !== word.id));
    }
  };

  const handleWordAnimationEnd = (word) => {
    if (matcherFeedback) return; // Ignore if feedback is already showing

    const currentQuestion = matcherQuestions[matcherCurrentIndex];
    if (word.text === currentQuestion.answer) {
      // Missed the correct answer!
      const newScore = Math.max(0, matcherScore - 5);
      setMatcherScore(newScore);
      setMatcherFeedback({
        type: "error",
        message: "Bạn đã bỏ lỡ đáp án đúng! -5 điểm ⚠️",
        explanation: `Đáp án đúng là: ${currentQuestion.answer}. ${currentQuestion.ex}`
      });
      setFallingWords([]); // Clear words immediately
    } else {
      // If a wrong answer bubble reaches the bottom, just filter it out
      setFallingWords((prev) => prev.filter((w) => w.id !== word.id));
    }
  };

  const handleNextQuestion = () => {
    setMatcherFeedback(null);
    if (matcherCurrentIndex < matcherQuestions.length - 1) {
      setMatcherCurrentIndex((prev) => prev + 1);
    } else {
      endMatcherGame();
    }
  };

  // Helper render tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMatcherState("intro");
    setFallingWords([]);
  };

  return (
    <div className="flip-game-container">
      {/* QUIT MODAL */}
      {showQuitConfirm && (
        <div className="game-quit-modal">
          <div className="game-quit-box">
            <h3>Thoát phòng game?</h3>
            <p>Tiến trình hiện tại sẽ không được lưu nếu bạn rời đi.</p>
            <div className="game-quit-actions">
              <button type="button" onClick={() => setShowQuitConfirm(false)}>
                Chơi tiếp
              </button>
              <button
                type="button"
                className="danger"
                onClick={() => navigate("/")}
              >
                Xác nhận thoát
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GAME SELECTION TABS */}
      <div className="game-selector-container">
        <button
          type="button"
          className={`game-selector-tab ${activeTab === "flip" ? "active" : ""}`}
          onClick={() => handleTabChange("flip")}
        >
          <i className="bi bi-grid-3x3-gap-fill"></i>
          Lật thẻ ghi nhớ
        </button>
        <button
          type="button"
          className={`game-selector-tab ${activeTab === "matcher" ? "active" : ""}`}
          onClick={() => handleTabChange("matcher")}
        >
          <i className="bi bi-shuffle"></i>
          Phân loại Tài phiệt
        </button>
      </div>

      {/* RENDER ACTIVE TAB */}
      {activeTab === "flip" ? (
        <div className="game-full-outer">
          <div id="g" className="game-area"></div>
          <div className="game-intro-wrapper">
            <div className="common-header">
              <div className="common-logo">
                <Link to="/" className="back-home-btn">
                  <i className="bi bi-house-door-fill"></i>
                  <span className="back-text">Trang chủ</span>
                </Link>
              </div>
            </div>
            <div className="game-header">
              <div className="game-name">
                <h1 data-text="MEMORY LAB">MEMORY LAB</h1>
              </div>
            </div>
            <div className="game-box-outer">
              <div className="game-logo">
                <div className="logo-inner">
                  <div className="game-card memory-status-card active twist">
                    <div className="game-flipper">
                      <div className="game-back game-front memory-status is-ready">
                        <div className="memory-status-eyebrow">
                          Bảng điều khiển
                        </div>
                        <div className="memory-status-title">Sẵn sàng</div>
                        <div className="memory-status-detail">
                          Chọn cấp độ để bắt đầu ván mới.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="game-card memory-info-card">
                    <div className="game-flipper">
                      <div className="game-front memory-module">
                        <div className="memory-module-icon">
                          <i className="bi bi-bar-chart-line" aria-hidden="true"></i>
                        </div>
                        <div className="memory-module-copy">
                          <span>Thống kê</span>
                          <small>Theo dõi số ván và lượt lật</small>
                        </div>
                      </div>
                      <div className="game-back content-box stats-container" id="stats">
                        <div className="padded">
                          <h2>Thống kê</h2>
                          Bạn chưa chơi ván nào trong phiên này.
                          <a href="javascript:void(0);" className="playnow">
                            Chơi ngay
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="game-card memory-info-card">
                    <div className="game-flipper">
                      <div className="game-front memory-module">
                        <div className="memory-module-icon">
                          <i className="bi bi-info-circle" aria-hidden="true"></i>
                        </div>
                        <div className="memory-module-copy">
                          <span>Luật chơi</span>
                          <small>Lật hai thẻ và tìm cặp giống nhau</small>
                        </div>
                      </div>
                      <div className="game-back content-box instructions">
                        <div className="padded">
                          <h2>Cách chơi</h2>
                          <p>Nhấn [p] để tạm dừng, hoặc [ESC] để bỏ ván.</p>
                          <p>
                            Lật hai thẻ bất kỳ, quan sát thuật ngữ phía sau và tìm đúng cặp tương ứng.
                          </p>
                          <p>
                            Ghép đúng thì cặp thẻ biến mất; ghép sai thì thẻ úp lại.
                          </p>
                          <p>
                            Xóa hết thẻ càng nhanh càng tốt để phá kỷ lục.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="game-card memory-level-card">
                    <div className="game-flipper">
                      <div className="game-back content-box levels">
                        <div className="levels-heading">
                          <i className="bi bi-play-fill" aria-hidden="true"></i>
                          <span>Chọn cấp độ</span>
                        </div>
                        <a href="javascript:void(0);" data-level="8" className="play">Dễ</a>
                        <a href="javascript:void(0);" data-level="18" className="play">Vừa</a>
                        <a href="javascript:void(0);" data-level="32" className="play">Khó</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <footer className="footer-wrapper">
              &copy; Copyright {new Date().getFullYear()} Nhóm 4-SE1919. All rights reserved.
            </footer>

            <div className="social-media-main">
              <div className="share-box-wrapper">
                <div className="share-box-inner">
                  <div
                    title="facebook share"
                    className="social-media-icon facebook-color"
                    id="fb_share"
                  ></div>
                </div>
              </div>
              <div className="share-title share-click" title="Share"></div>
            </div>
          </div>
        </div>
      ) : (
        /* MONOPOLY MATCHER GAME VIEW */
        <div className="matcher-game-outer">
          {/* HEADER STATS */}
          <div className="matcher-header-stats">
            <div className="matcher-stat-item">
              <span className="matcher-stat-label">Điểm</span>
              <span className="matcher-stat-value">{matcherScore}</span>
            </div>
            <div className="matcher-stat-item">
              <span className="matcher-stat-label">Thời gian</span>
              <span className="matcher-stat-value">{matcherTimeLeft}s</span>
            </div>
            <div className="matcher-stat-item">
              <span className="matcher-stat-label">Kỷ lục</span>
              <span className="matcher-stat-value">{matcherHighScore}</span>
            </div>
          </div>

          {/* TIMER PROGRESS BAR */}
          {matcherState === "playing" && (
            <div className="matcher-timer-container">
              <div
                className="matcher-timer-fill"
                style={{ width: `${(matcherTimeLeft / 60) * 100}%` }}
              ></div>
            </div>
          )}

          {/* GAME CONTENT CONTAINER */}
          {matcherState === "intro" && (
            <div className="matcher-card">
              <div className="matcher-card-glow"></div>
              <span className="matcher-question-counter">Minigame</span>
              <h2 className="matcher-title-large">PHÂN LOẠI TÀI PHIỆT</h2>
              <p className="matcher-intro-copy">
                Các định nghĩa hoặc ví dụ thực tế liên quan đến các mô hình độc quyền của <strong>Chương 4 (Triết học Mác - Lênin)</strong> sẽ xuất hiện ở phía dưới.
                Nhiệm vụ của bạn là click chọn đúng đáp án tương ứng đang rơi từ trên xuống trước khi hết thời gian!
              </p>
              <button
                type="button"
                className="matcher-btn-primary"
                onClick={startMatcherGame}
              >
                Bắt đầu ngay
              </button>
            </div>
          )}

          {matcherState === "playing" && (
            <>
              {/* FALLING ZONE (TOP/MIDDLE) */}
              <div className="matcher-falling-zone">
                <div className="matcher-channel-line" style={{ left: "15%" }}></div>
                <div className="matcher-channel-line" style={{ left: "33%" }}></div>
                <div className="matcher-channel-line" style={{ left: "51%" }}></div>
                <div className="matcher-channel-line" style={{ left: "69%" }}></div>
                <div className="matcher-channel-line" style={{ left: "87%" }}></div>

                {/* SPAWN FALLING BUBBLES */}
                {fallingWords.map((word) => (
                  <div
                    key={word.id}
                    className={`falling-word-bubble ${categoryMap[word.text]}`}
                    style={{
                      left: `${word.x}%`,
                      animationDelay: `${word.delay}s`,
                      animationDuration: `${word.duration}s`,
                      animationPlayState: matcherFeedback ? "paused" : "running"
                    }}
                    onClick={() => handleWordClick(word)}
                    onAnimationEnd={() => handleWordAnimationEnd(word)}
                  >
                    <span className="bubble-glow-dot"></span>
                    {word.text}
                  </div>
                ))}

                {/* FEEDBACK OVERLAY */}
                {matcherFeedback && (
                  <div className={`matcher-feedback-overlay ${matcherFeedback.type}`}>
                    <h3 className="matcher-feedback-title">
                      {matcherFeedback.type === "success" ? (
                        <>
                          <i className="bi bi-check-circle-fill me-2"></i>
                          {matcherFeedback.message}
                        </>
                      ) : (
                        <>
                          <i className="bi bi-exclamation-triangle-fill me-2"></i>
                          {matcherFeedback.message}
                        </>
                      )}
                    </h3>
                    <p className="matcher-feedback-explanation">
                      {matcherFeedback.explanation}
                    </p>
                    <button
                      type="button"
                      className="matcher-next-btn"
                      onClick={handleNextQuestion}
                    >
                      Tiếp tục
                    </button>
                  </div>
                )}
              </div>

              {/* QUESTION CARD (BOTTOM) */}
              {matcherQuestions.length > 0 && (
                <div className="matcher-question-card-bottom">
                  <span className="matcher-question-counter">
                    Câu hỏi {matcherCurrentIndex + 1} / {matcherQuestions.length}
                  </span>
                  <p className="matcher-question-text">
                    "{matcherQuestions[matcherCurrentIndex].text}"
                  </p>
                  <div className="matcher-question-help">
                    <i className="bi bi-arrow-down-short animate-bounce"></i>
                    Nhấp chọn đáp án đúng đang rơi phía trên!
                  </div>
                </div>
              )}
            </>
          )}

          {matcherState === "ended" && (
            <div className="matcher-card">
              <div className="matcher-card-glow"></div>
              <span className="matcher-question-counter">Hoàn thành</span>
              <h2 className="matcher-title-large">KẾT THÚC VÁN ĐẤU</h2>
              
              <div className="matcher-ended-summary">
                <p className="matcher-intro-copy">
                  Bạn đã đạt được <strong>{matcherScore}</strong> điểm!
                  {matcherScore >= matcherHighScore && matcherScore > 0 ? (
                    <span style={{ display: "block", color: "#4caf50", fontWeight: "bold", marginTop: "0.5rem" }}>
                      🎉 KỶ LỤC MỚI CỦA BẠN!
                    </span>
                  ) : null}
                </p>

                <button
                  type="button"
                  className="matcher-btn-primary"
                  onClick={startMatcherGame}
                >
                  Chơi lại
                </button>

                {/* HISTORY LEADERBOARD */}
                {matcherHistory.length > 0 && (
                  <div className="matcher-history-section">
                    <h3 className="matcher-history-title">Lịch sử lượt chơi gần đây</h3>
                    <table className="matcher-history-table">
                      <thead>
                        <tr>
                          <th>Ngày chơi</th>
                          <th>Điểm đạt được</th>
                        </tr>
                      </thead>
                      <tbody>
                        {matcherHistory.map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.date}</td>
                            <td>{item.score} điểm</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* QUIT BUTTON */}
      <button
        type="button"
        className="quit-game-btn"
        onClick={() => setShowQuitConfirm(true)}
        aria-label="Thoát game"
      >
        <i className="bi bi-box-arrow-left" aria-hidden="true"></i>
        Thoát
      </button>
    </div>
  );
}
