import { useEffect, useState } from "react";
import $ from "jquery";
import "../styles/flip/flip.css";
import { Link, useNavigate } from "react-router-dom";
import { flipImages } from "../data/flipImagesData";

export default function FlipCardPage() {
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
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
        "CT", // Cạnh tranh
        "DQ", // Độc quyền
        "TB", // Tư bản
        "NH", // Ngân hàng
        "LN", // Lênin
        "MC", // Mác
        "TC", // Tài chính
        "TP", // Tài phiệt
        "XK", // Xuất khẩu
        "TD", // Thu thuộc địa
        "NN", // Nhà nước
        "CN", // Concern
        "CG", // Conglomerate
        "VT", // Vệ tinh
        "EU", // Liên minh châu Âu
        "BM", // Biên giới mềm
        "LS", // Lịch sử
        "XH", // Xã hội hóa
        "SH", // Sở hữu
        "QH", // Quan hệ
        "LN", // Lợi nhuận
        "GC", // Giá cả
        "TH", // Thỏa hiệp
        "KH", // Khủng hoảng
        "TD", // Tín dụng
        "TT", // Tích tụ
        "TP", // Tập trung
        "SX", // Sản xuất
        "LD", // Lao động
        "TD", // Thặng dư
        "CTD", // Cạnh tranh tự do
        "DQNN", // Độc quyền nhà nước
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

      // If won game
      if (text == "nice") {
        increase("flip_won");
        decrease("flip_abandoned");
      }

      // If lost game
      else if (text == "fail") {
        increase("flip_lost");
        decrease("flip_abandoned");
      }

      // Update stats
      updateStats();
    }

    /* LOAD GAME ACTIONS */

    // Init localStorage
    if (!get("flip_won") && !get("flip_lost") && !get("flip_abandoned")) {
      //Overall Game stats
      set("flip_won", 0);
      set("flip_lost", 0);
      set("flip_abandoned", 0);
      //Best times
      set("flip_casual", "-:-");
      set("flip_medium", "-:-");
      set("flip_hard", "-:-");
      //Cards stats
      set("flip_matched", 0);
      set("flip_wrong", 0);
    }

    // Fill stats
    if (
      get("flip_won") > 0 ||
      get("flip_lost") > 0 ||
      get("flip_abandoned") > 0
    ) {
      updateStats();
    }

    // Toggle start screen cards
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

    // Start game
    $(".play").on("click", function (e) {
      e.preventDefault();
      increase("flip_abandoned");
      $(".game-info").fadeOut();

      var difficulty = "",
        timer = 1000,
        level = $(this).data("level");

      // Set game timer and difficulty
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

      // Add difficulty class to container
      $(".flip-game-container")
        .removeClass("casual-mode medium-mode hard-mode")
        .addClass(difficulty + "-mode");
      $(".game-area").addClass(difficulty);

      $(".game-intro-wrapper").fadeOut(250, function () {
        var startGame = Date.now(),
          obj = [];

        // Create and add shuffled cards to game
        for (var i = 0; i < level; i++) {
          obj.push(i);
        }

        var shu = shuffle($.merge(obj, obj)),
          gridSize = Math.sqrt(shu.length);

        $(".game-area").css("--game-cols", gridSize);

        for (var cardIndex = 0; cardIndex < shu.length; cardIndex++) {
          var imageIndex = shu[cardIndex];
          var imageUrl = flipImages[imageIndex] || flipImages[0];
          var fallbackUrl = createCardFallback(imageIndex);

          // Tạo card element
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

          // Set background image cho game-back
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
            .attr("data-remote-src", imageUrl)
            .on("error", function () {
              $(this).attr("src", fallbackUrl);
            });

          card.appendTo(".flip-game-container .game-area");
        }

        // Set card actions
        $(".game-area .game-card").on({
          mousedown: function () {
            if ($(".game-area").attr("data-paused") == 1) {
              return;
            }

            var $this = $(this).addClass("active");
            var data = $this.find(".game-back").attr("data-img"); // Đổi từ data-f sang data-img

            if ($(".game-area").find(".game-card.active").length > 1) {
              setTimeout(function () {
                var thisCard = $(
                  ".game-area .active .game-back[data-img='" + data + "']", // Đổi data-f sang data-img
                );

                if (thisCard.length > 1) {
                  thisCard
                    .parents(".game-card")
                    .toggleClass("active game-card found")
                    .empty();
                  increase("flip_matched");

                  // Win game
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

        // Add timer bar
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

        // Set keyboard (p)ause and [esc] actions
        $(window)
          .off()
          .on("keyup", function (e) {
            // Pause game. (p)
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
            // Abandon game. (ESC)
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

    // Share button toggle
    $(".share-click").on("click", function () {
      $(this).toggleClass("open");
      $(".share-box-wrapper").slideToggle("fast");
    });

    // Cleanup on unmount
    return () => {
      $(window).off();
      $(".play").off();
      $(".share-click").off();
      $('.game-intro-wrapper .game-card:not(".twist")').off();
    };
  }, []);

  return (
    <div className="flip-game-container">
      {showQuitConfirm && (
        <div className="game-quit-modal">
          <div className="game-quit-box">
            <h3>Thoát Memory Game?</h3>
            <p>Tiến trình ván hiện tại sẽ không được lưu nếu bạn thoát.</p>
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
              <h1 data-text="MEMORY GAME">MEMORY GAME</h1>
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
                        <i
                          className="bi bi-bar-chart-line"
                          aria-hidden="true"
                        ></i>
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
                          Lật hai thẻ bất kỳ, quan sát hình phía sau và tìm
                          đúng cặp giống nhau.
                        </p>
                        <p>
                          Ghép đúng thì cặp thẻ biến mất; ghép sai thì thẻ úp
                          lại.
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
                      <a
                        href="javascript:void(0);"
                        data-level="8"
                        className="play"
                      >
                        Dễ
                      </a>
                      <a
                        href="javascript:void(0);"
                        data-level="18"
                        className="play"
                      >
                        Vừa
                      </a>
                      <a
                        href="javascript:void(0);"
                        data-level="32"
                        className="play"
                      >
                        Khó
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer className="footer-wrapper">
            &copy; Copyright {new Date().getFullYear()} Group4-SE1919. All
            rights reserved.
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
