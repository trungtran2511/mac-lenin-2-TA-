import { useEffect, useState, useRef } from "react";
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
  },
  {
    text: "Thỏa thuận ngầm của các nước xuất khẩu dầu mỏ nhằm hạn chế nguồn cung và giữ giá bán dầu thô ở mức cao trên thị trường thế giới.",
    answer: "Các-ten",
    ex: "OPEC hoạt động như một dạng Các-ten (Cartel) quốc tế, nơi các quốc gia độc lập cùng thỏa thuận định giá và sản lượng."
  },
  {
    text: "Ba nhà cung cấp mạng viễn thông lớn ký cam kết không hạ giá cước thuê bao tháng dưới mức sàn tối thiểu đã thống nhất.",
    answer: "Các-ten",
    ex: "Cam kết giữ mức giá sàn chung là hành vi thỏa hiệp giá của Các-ten thương mại."
  },
  {
    text: "Các hãng sản xuất pin mặt trời ký thỏa thuận phân bổ hạn ngạch xuất khẩu sang thị trường Châu Âu để giữ tính ổn định giá bán lẻ.",
    answer: "Các-ten",
    ex: "Các-ten thỏa thuận chia nhỏ thị phần hoặc hạn ngạch để tránh cạnh tranh trực diện giữa các thành viên."
  },
  {
    text: "Năm nhà máy đường lớn thành lập một đầu mối bán hàng duy nhất chuyên ký hợp đồng tiêu thụ sản phẩm cho cả liên minh.",
    answer: "Xanh-đi-ca",
    ex: "Xanh-đi-ca (Syndicate) tước bỏ quyền tự chủ thương mại của thành viên bằng cách lập đầu mối phân phối chung."
  },
  {
    text: "Các lò khai thác than cam kết toàn bộ sản lượng khai thác phải bán trực tiếp cho văn phòng đại diện chung để điều phối giá cả thống nhất.",
    answer: "Xanh-đi-ca",
    ex: "Mọi hoạt động lưu thông hàng hóa của thành viên Xanh-đi-ca đều qua văn phòng điều phối chung để tối ưu hóa giá."
  },
  {
    text: "Các công ty chăn nuôi thỏa thuận chỉ mua thức ăn gia súc từ một tổng đại lý duy nhất đại diện cho liên minh để ép giá nhà sản xuất cám.",
    answer: "Xanh-đi-ca",
    ex: "Xanh-đi-ca thu mua nguyên liệu tập trung giúp tạo sức ép mua với giá rẻ nhất từ các bên cung ứng."
  },
  {
    text: "Tập đoàn Standard Oil mua đứt cổ phần chi phối của các đối thủ cạnh tranh ngành lọc dầu và đưa tất cả về chung một ban lãnh đạo tối cao.",
    answer: "Tờ-rớt",
    ex: "Tờ-rớt (Trust) sáp nhập các thực thể độc lập thành một tổ chức duy nhất dưới sự điều hành tối cao của một hội đồng."
  },
  {
    text: "Ba nhà máy cơ khí chế tạo bàn giao quyền quản trị tài sản và nhà xưởng cho một Hội đồng ủy thác chung, các chủ xí nghiệp cũ chỉ nhận cổ tức.",
    answer: "Tờ-rớt",
    ex: "Khi tham gia Tờ-rớt, các xí nghiệp mất hoàn toàn độc lập về sản xuất lẫn thương mại và chuyển thành cổ đông nhận cổ tức."
  },
  {
    text: "Hợp nhất hoàn toàn hệ thống thương hiệu, dây chuyền lắp ráp và nhân sự của các hãng sản xuất ô tô thành một tổng công ty thống nhất.",
    answer: "Tờ-rớt",
    ex: "Hợp nhất toàn diện các nguồn lực dưới một pháp nhân duy nhất là hình thức phát triển cao của Tờ-rớt sản xuất."
  },
  {
    text: "Tập đoàn công nghiệp nặng kết hợp ngân hàng lớn và công ty vận tải biển để tạo thành một tổ hợp độc quyền kiểm soát chuỗi giá trị đa ngành dọc.",
    answer: "Công-soóc-xi-om",
    ex: "Công-soóc-xi-om (Consortium) là liên kết đa ngành khổng lồ từ sản xuất đến tài chính, vận tải nhằm tối ưu hóa lợi nhuận."
  },
  {
    text: "Tổ chức tài chính ngân hàng đầu tư kết hợp các công ty viễn thông, sản xuất vũ khí, khai mỏ thành một mạng lưới tài phiệt đa quốc gia.",
    answer: "Công-soóc-xi-om",
    ex: "Sự thâm nhập chéo giữa tư bản công nghiệp và tư bản ngân hàng tạo thành giới tài phiệt vận hành Công-soóc-xi-om."
  },
  {
    text: "Siêu liên minh đa ngành khổng lồ chi phối từ các xí nghiệp nông nghiệp, chuỗi siêu thị bán lẻ cho tới ngân hàng thương mại cung ứng tín dụng.",
    answer: "Công-soóc-xi-om",
    ex: "Mô hình đa ngành khép kín kết hợp tài chính làm hạt nhân điều hành là đặc trưng của Công-soóc-xi-om."
  },
  {
    text: "Chính phủ sở hữu và vận hành độc quyền toàn bộ mạng lưới truyền tải điện cao thế 500kV để bảo đảm an ninh năng lượng quốc gia.",
    answer: "Độc quyền Nhà nước",
    ex: "Nhà nước trực tiếp sở hữu và vận hành các ngành xương sống của nền kinh tế quốc gia."
  },
  {
    text: "Nhà nước quy định duy nhất một tổng công ty thuộc Bộ Quốc phòng được phép sản xuất và cung ứng các trang thiết bị quân sự.",
    answer: "Độc quyền Nhà nước",
    ex: "Các lĩnh vực đặc thù liên quan đến an ninh quốc gia thường do Nhà nước độc quyền kiểm soát tuyệt đối."
  },
  {
    text: "Ngân hàng Trung ương độc quyền in và phát hành tiền pháp định, kiểm soát dòng tiền tệ vĩ mô toàn bộ nền kinh tế quốc gia.",
    answer: "Độc quyền Nhà nước",
    ex: "Phát hành tiền tệ là quyền độc quyền kinh tế tối cao của Nhà nước để quản lý vĩ mô."
  },
  {
    text: "Hãng sản xuất điện thoại thông minh sáp nhập toàn bộ mỏ khai thác đất hiếm, nhà máy bán dẫn và hệ thống cửa hàng phân phối trên toàn cầu.",
    answer: "Công-soóc-xi-om",
    ex: "Sự bành trướng đa lĩnh vực, kết nối chuỗi cung ứng dọc với nguồn vốn ngân hàng khổng lồ tạo nên Công-soóc-xi-om tài phiệt."
  },
  {
    text: "Năm công ty thép cam kết giữ nguyên tỷ lệ sản xuất thép hình hằng năm của mỗi bên để giữ giá thép trong nước không bị giảm.",
    answer: "Các-ten",
    ex: "Giới hạn sản lượng sản xuất của mỗi thành viên là cách Các-ten ngăn chặn tình trạng dư thừa hàng hóa gây tụt giá."
  },
  {
    text: "Nhà nước chi hàng tỷ USD từ ngân sách quốc gia để giải cứu một tập đoàn dầu khí nhà nước đang trên bờ vực vỡ nợ.",
    answer: "Độc quyền Nhà nước",
    ex: "Sử dụng tiền thuế của dân để hỗ trợ, bù lỗ hoặc cứu các thực thể kinh tế nhà nước phản ánh tính chất độc quyền nhà nước."
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
  const matcherScoreRef = useRef(0);
  useEffect(() => {
    matcherScoreRef.current = matcherScore;
  }, [matcherScore]);
  const [matcherTimeLeft, setMatcherTimeLeft] = useState(60);
  const [matcherState, setMatcherState] = useState("intro"); // 'intro', 'playing', 'ended'
  const [matcherQuestions, setMatcherQuestions] = useState([]);
  const [matcherCurrentIndex, setMatcherCurrentIndex] = useState(0);
  const [matcherFeedback, setMatcherFeedback] = useState(null);
  const [fallingWords, setFallingWords] = useState([]);
  const [matcherResults, setMatcherResults] = useState([]); // Track answers
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [answerKeyPassword, setAnswerKeyPassword] = useState("");
  const [answerKeyUnlocked, setAnswerKeyUnlocked] = useState(false);
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

  // --- CONTINUOUS SPAWN: Every 3 seconds, spawn a new batch ---
  useEffect(() => {
    if (activeTab !== "matcher" || matcherState !== "playing" || matcherQuestions.length === 0) return;
    spawnFallingWords();
    const spawnInterval = setInterval(() => {
      spawnFallingWords();
    }, 4500);
    return () => clearInterval(spawnInterval);
  }, [matcherState, matcherQuestions]);

  // --- AUTO-CLEAR TOAST FEEDBACK ---
  useEffect(() => {
    if (!matcherFeedback) return;
    const t = setTimeout(() => setMatcherFeedback(null), 1500);
    return () => clearTimeout(t);
  }, [matcherFeedback]);

  const startMatcherGame = () => {
    const shuffled = [...matcherPool].sort(() => Math.random() - 0.5);
    setMatcherQuestions(shuffled);
    setMatcherScore(0);
    setMatcherTimeLeft(60);
    setMatcherCurrentIndex(0);
    setMatcherFeedback(null);
    setFallingWords([]);
    setMatcherResults([]);
    setMatcherState("playing");
  };

  const spawnFallingWords = () => {
    const baseCategories = ["Các-ten", "Xanh-đi-ca", "Tờ-rớt", "Công-soóc-xi-om", "Độc quyền Nhà nước"];
    const extraCategories = [...baseCategories].sort(() => Math.random() - 0.5).slice(0, 2);
    const categories = [...baseCategories, ...extraCategories];
    const channels = [4, 16, 28, 40, 52, 64, 76].sort(() => Math.random() - 0.5);
    const delays = [0, 0.3, 0.6, 0.9, 1.2, 1.5, 1.8].sort(() => Math.random() - 0.5);
    const newWords = categories.map((cat, index) => {
      const duration = 6 + Math.random() * 2;
      return {
        id: `${cat}-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 6)}`,
        text: cat,
        x: channels[index],
        delay: delays[index],
        duration: duration
      };
    });
    setFallingWords((prev) => [...prev, ...newWords]);
  };

  const endMatcherGame = (finalScore = null) => {
    setMatcherState("ended");
    setFallingWords([]);
    setMatcherFeedback(null);
    const scoreToSave = finalScore !== null ? finalScore : matcherScoreRef.current;

    if (scoreToSave > matcherHighScore) {
      setMatcherHighScore(scoreToSave);
      localStorage.setItem("matcher_highscore", scoreToSave);
    }

    const dateTime = new Date().toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });

    const newHistory = [
      { score: scoreToSave, date: dateTime },
      ...matcherHistory
    ].slice(0, 5);
    setMatcherHistory(newHistory);
    localStorage.setItem("matcher_history", JSON.stringify(newHistory));
  };

  const advanceQuestion = () => {
    if (matcherCurrentIndex < matcherQuestions.length - 1) {
      setMatcherCurrentIndex((prev) => prev + 1);
    } else {
      const reshuffled = [...matcherPool].sort(() => Math.random() - 0.5);
      setMatcherQuestions(reshuffled);
      setMatcherCurrentIndex(0);
    }
  };

  const handleWordClick = (word) => {
    const currentQuestion = matcherQuestions[matcherCurrentIndex];
    const isCorrect = word.text === currentQuestion.answer;

    // Track this result
    setMatcherResults((prev) => [...prev, {
      question: currentQuestion.text,
      correctAnswer: currentQuestion.answer,
      userAnswer: word.text,
      isCorrect,
      explanation: currentQuestion.ex
    }]);

    let newScore = matcherScore;
    if (isCorrect) {
      newScore = matcherScore + 10;
      setMatcherScore(newScore);
    }

    // Remove clicked bubble
    setFallingWords((prev) => prev.filter((w) => w.id !== word.id));

    // Check if 30 questions reached
    if (matcherResults.length + 1 >= 30) {
      endMatcherGame(newScore);
    } else {
      advanceQuestion();
    }
  };

  const handleWordAnimationEnd = (word) => {
    setFallingWords((prev) => prev.filter((w) => w.id !== word.id));
  };

  const handleNextQuestion = () => {
    setMatcherFeedback(null);
    advanceQuestion();
  };

  const handleAnswerKeyCheck = () => {
    if (answerKeyPassword === "1234567A") {
      setAnswerKeyUnlocked(true);
    } else {
      alert("Sai mật khẩu!");
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
          {/* HEADER STATS (ONLY SHOW IN INTRO/ENDED STATE) */}
          {matcherState !== "playing" && (
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
          )}

          {/* GAME CONTENT CONTAINER */}
          {matcherState === "intro" && (
            <div className="matcher-card">
              <div className="matcher-card-glow"></div>
              <span className="matcher-question-counter">Minigame</span>
              <h2 className="matcher-title-large">PHÂN LOẠI TÀI PHIỆT</h2>
              <p className="matcher-intro-copy">
                Các định nghĩa hoặc ví dụ thực tế liên quan đến các mô hình độc quyền của <strong>Chương 4 (Triết học Mác - Lênin)</strong> sẽ xuất hiện ở phía bên phải.
                Nhiệm vụ của bạn là click chọn đúng đáp án tương ứng đang rơi từ trên xuống ở khung bên trái trước khi hết thời gian!
              </p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1rem" }}>
                <button
                  type="button"
                  className="matcher-btn-primary"
                  onClick={startMatcherGame}
                >
                  Bắt đầu ngay
                </button>
                <button
                  type="button"
                  onClick={() => setShowAnswerKey(true)}
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    color: "#fff",
                    padding: "0.75rem 2rem",
                    borderRadius: "9999px",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    lineHeight: "1.5",
                    cursor: "pointer"
                  }}
                >
                  Xem đáp án
                </button>
              </div>


            </div>
          )}

          {matcherState === "playing" && (
            <div className="matcher-dashboard-grid">
              {/* LEFT COLUMN: FALLING ZONE (60% width) */}
              <div className="matcher-left-col">
                <div className="matcher-falling-zone-fullscreen">
                  {/* Cyber grid and matrix glows */}
                  <div className="matcher-falling-matrix-grid"></div>
                  
                  {/* Channels */}
                  <div className="matcher-channel-line" style={{ left: "10%" }}></div>
                  <div className="matcher-channel-line" style={{ left: "28%" }}></div>
                  <div className="matcher-channel-line" style={{ left: "46%" }}></div>
                  <div className="matcher-channel-line" style={{ left: "64%" }}></div>
                  <div className="matcher-channel-line" style={{ left: "82%" }}></div>

                  {/* SPAWN FALLING BUBBLES */}
                  {fallingWords.map((word) => (
                    <div
                      key={word.id}
                      className={`falling-word-bubble ${categoryMap[word.text]}`}
                      style={{
                        left: `${word.x}%`,
                        animationDelay: `${word.delay}s`,
                        animationDuration: `${word.duration}s`,
                        animationPlayState: "running"
                      }}
                      onPointerDown={(e) => {
                        e.preventDefault(); // Prevent text selection/drag on click
                        handleWordClick(word);
                      }}
                      onAnimationEnd={() => handleWordAnimationEnd(word)}
                    >
                      <span className="bubble-glow-dot"></span>
                      {word.text}
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT COLUMN: ACTIVE QUESTION CARD & STATS (40% width) */}
              <div className="matcher-right-col">
                <div className="matcher-side-panel">
                  <div className="matcher-panel-header">
                    <span className="matcher-panel-title">BẢNG PHÂN TÍCH</span>
                    <div className="matcher-panel-neon-line"></div>
                  </div>

                  {/* Stats list */}
                  <div className="matcher-stats-vertical">
                    <div className="matcher-stat-card blue">
                      <span className="matcher-stat-lbl">ĐIỂM SỐ</span>
                      <span className="matcher-stat-val glow-blue">{matcherScore}</span>
                    </div>
                    <div className="matcher-stat-card cyan">
                      <span className="matcher-stat-lbl">THỜI GIAN MÀN CHƠI</span>
                      <span className="matcher-stat-val glow-cyan">{matcherTimeLeft}s</span>
                    </div>
                    <div className="matcher-stat-card purple">
                      <span className="matcher-stat-lbl">KỶ LỤC</span>
                      <span className="matcher-stat-val glow-purple">{matcherHighScore}</span>
                    </div>
                  </div>

                  {/* Active Question Box */}
                  {matcherQuestions.length > 0 && (
                    <div className="matcher-question-panel-card">
                      <div className="matcher-question-badge">
                        CÂU HỎI {matcherCurrentIndex + 1} / {matcherQuestions.length}
                      </div>
                      <div className="matcher-question-body-text">
                        "{matcherQuestions[matcherCurrentIndex].text}"
                      </div>
                      <div className="matcher-question-hint">
                        <i className="bi bi-arrow-left-short animate-bounce-horizontal"></i>
                        Click chọn bong bóng đáp án đang rơi bên trái!
                      </div>
                    </div>
                  )}

                  {/* Timer Progress Bar */}
                  <div className="matcher-progress-panel">
                    <div className="matcher-progress-title">NĂNG LƯỢNG HỆ THỐNG</div>
                    <div className="matcher-progress-bar-glow">
                      <div
                        className="matcher-progress-bar-fill"
                        style={{ width: `${(matcherTimeLeft / 60) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {matcherState === "ended" && (
            <div className="matcher-dashboard-grid" style={{ alignItems: "start", gridTemplateColumns: "4fr 6fr" }}>
              {/* LEFT SIDE: SCORE, BUTTON, HISTORY */}
              <div className="matcher-card" style={{ height: "auto", justifyContent: "flex-start", maxWidth: "100%" }}>
                <div className="matcher-card-glow"></div>
                <span className="matcher-question-counter">Hoàn thành</span>
                <h2 className="matcher-title-large">KẾT THÚC VÁN ĐẤU</h2>
                
                <div className="matcher-ended-summary" style={{ maxHeight: "40vh", overflowY: "auto", width: "100%", paddingRight: "0.5rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
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
                    <div className="matcher-history-section" style={{ marginTop: "2rem" }}>
                      <h3 className="matcher-history-title">Lịch sử lượt chơi gần đây</h3>
                      <table className="matcher-history-table">
                        <thead>
                          <tr>
                            <th>Thời gian</th>
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

              {/* RIGHT SIDE: DETAILED RESULTS */}
              <div className="matcher-card" style={{ height: "auto", justifyContent: "flex-start", maxWidth: "100%" }}>
                <h2 className="matcher-title-large" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>CHI TIẾT KẾT QUẢ</h2>
                {matcherResults.length > 0 ? (
                  <div style={{ textAlign: "left", width: "100%", maxHeight: "50vh", overflowY: "auto", paddingRight: "0.5rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      {matcherResults.map((res, idx) => (
                        <div key={idx} style={{ padding: "1rem", background: "rgba(255,255,255,0.05)", borderRadius: "8px", borderLeft: `4px solid ${res.isCorrect ? "#4caf50" : "#f44336"}` }}>
                          <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.95rem" }}>{res.question}</p>
                          <div style={{ display: "flex", gap: "1rem", fontSize: "0.85rem" }}>
                            <span style={{ color: res.isCorrect ? "#4caf50" : "#f44336" }}>
                              <strong>Bạn chọn:</strong> {res.userAnswer}
                            </span>
                            {!res.isCorrect && (
                              <span style={{ color: "#4caf50" }}>
                                <strong>Đáp án đúng:</strong> {res.correctAnswer}
                              </span>
                            )}
                          </div>
                          <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}>
                            <em>Giải thích: {res.explanation}</em>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p>Bạn chưa trả lời câu nào!</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* FULLSCREEN ANSWER KEY MODAL */}
      {showAnswerKey && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%", 
          background: "#0f172a", zIndex: 99999, display: "flex", 
          flexDirection: "column",
          fontSize: "1rem", lineHeight: "1.5",
          color: "#fff",
          overflowY: "auto",
          padding: "2rem"
        }}>
          {/* CLOSE BUTTON (X) TOP LEFT */}
          <button 
            type="button"
            onClick={(e) => { e.preventDefault(); setShowAnswerKey(false); setAnswerKeyUnlocked(false); setAnswerKeyPassword(""); }} 
            style={{
              position: "absolute", top: "1.5rem", left: "1.5rem",
              background: "transparent", color: "#fff", border: "none",
              fontSize: "3rem", cursor: "pointer", lineHeight: 1,
              padding: "0.5rem"
            }}
          >
            &times;
          </button>

          {!answerKeyUnlocked ? (
            <div style={{ margin: "auto", textAlign: "center", background: "rgba(255,255,255,0.05)", padding: "3rem", borderRadius: "16px", border: "1px solid rgba(0, 180, 216, 0.3)" }}>
              <h3 style={{ marginBottom: "1.5rem", fontSize: "1.8rem", color: "#fff" }}>Nhập mật khẩu để xem</h3>
              <input 
                type="password" 
                value={answerKeyPassword}
                onChange={(e) => setAnswerKeyPassword(e.target.value)}
                style={{ padding: "0.75rem", borderRadius: "8px", border: "none", width: "250px", outline: "none", color: "#000", fontSize: "1.1rem" }}
              />
              <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
                <button type="button" onClick={(e) => { e.preventDefault(); handleAnswerKeyCheck(); }} style={{ padding: "0.75rem 1.5rem", background: "#00b4d8", color: "#fff", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "1.1rem" }}>Xác nhận</button>
              </div>
            </div>
          ) : (
            <div style={{ maxWidth: "1200px", width: "100%", margin: "0 auto", padding: "2rem 0" }}>
              <h3 style={{ margin: "0 0 2rem 0", fontSize: "2rem", textAlign: "center", color: "#00b4d8" }}>Danh sách Câu hỏi & Đáp án</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr>
                    <th style={{ borderBottom: "2px solid rgba(255,255,255,0.2)", padding: "16px 12px", fontSize: "1.3rem", width: "70%", color: "#fff" }}>Câu hỏi</th>
                    <th style={{ borderBottom: "2px solid rgba(255,255,255,0.2)", padding: "16px 12px", fontSize: "1.3rem", width: "30%", color: "#fff" }}>Đáp án</th>
                  </tr>
                </thead>
                <tbody>
                  {matcherPool.map((item, idx) => (
                    <tr key={idx} style={{ background: idx % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                      <td style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "16px 12px", fontSize: "1.1rem", lineHeight: "1.6" }}>{item.text}</td>
                      <td style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "16px 12px", fontSize: "1.1rem", color: "#00b4d8", fontWeight: "bold", whiteSpace: "nowrap" }}>{item.answer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
