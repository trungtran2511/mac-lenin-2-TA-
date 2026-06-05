import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { allQuizQuestions } from "../data/quizBank";
import { normalizeQuizQuestion } from "../utils/quizText";
import { textbookExplanations } from "../data/textbookExplanations";
import logoImg from "../assets/images/logo/logo.png";
import bgImg from "../assets/images/background/bg_0.png";
import clockImg from "../assets/images/clock/clock.png";

const QuizPage = () => {
  const quizTimeLimits = {
    10: 5 * 60,
    30: 15 * 60,
    50: 30 * 60,
  };

  // ============ STATE ============
  const [showModal, setShowModal] = useState(true);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [quizConfig, setQuizConfig] = useState({
    numberOfQuestions: 10,
    chapter: "random",
    difficulty: "random",
  });
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [progress, setProgress] = useState(25);
  const [timeLeft, setTimeLeft] = useState(300);

  const navigate = useNavigate();

  // Get unique chapters from allQuizQuestions
  const chapters = [...new Set(allQuizQuestions.map((q) => q.chapter))].sort(
    (a, b) => a - b,
  );

  // ============ FILTER QUESTIONS ============
  const handleStartQuiz = () => {
    let filtered = [...allQuizQuestions];

    // Filter by chapter
    if (quizConfig.chapter !== "random") {
      filtered = filtered.filter(
        (q) => q.chapter === parseInt(quizConfig.chapter),
      );
    }

    // Filter by difficulty
    if (quizConfig.difficulty !== "random") {
      filtered = filtered.filter(
        (q) => q.difficulty === parseInt(quizConfig.difficulty),
      );
    }

    // Shuffle and limit questions
    const shuffled = filtered.sort(() => Math.random() - 0.5);
    const limited = shuffled
      .slice(0, parseInt(quizConfig.numberOfQuestions))
      .map(normalizeQuizQuestion);

    if (limited.length === 0) {
      alert("Không tìm thấy câu hỏi phù hợp với cấu hình đã chọn!");
      return;
    }

    setFilteredQuestions(limited);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setTimeLeft(quizTimeLimits[parseInt(quizConfig.numberOfQuestions)] || 300);
    setShowFinishConfirm(false);
    setShowModal(false);
    setProgress((1 / limited.length) * 100);
  };

  const totalQuestions = filteredQuestions.length;
  const currentData = filteredQuestions[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];

  // ============ SUBMIT QUIZ ============
  const handleSubmit = useCallback(() => {
    let score = 0;
    const review = filteredQuestions.map((question, index) => {
      const selectedIndex = selectedAnswers[index];
      const correctIndex = question.correctAnswer;
      const isCorrect = selectedIndex === correctIndex;
      const textbookRecord = textbookExplanations[question.id];
      const textbookExplanation =
        typeof textbookRecord === "string"
          ? textbookRecord
          : textbookRecord?.explanation;
      const textbookSource =
        typeof textbookRecord === "string" ? "" : textbookRecord?.source;

      if (isCorrect) {
        score++;
      }

      return {
        id: question.id,
        chapter: question.chapter,
        question: question.question,
        options: question.options,
        selectedAnswer: selectedIndex ?? null,
        correctAnswer: correctIndex,
        isCorrect,
        explanation:
          textbookExplanation ||
          question.explanation ||
          `Đáp án đúng là "${question.options[correctIndex]}". Nội dung này khớp trực tiếp với khái niệm hoặc luận điểm được hỏi; các phương án còn lại không phản ánh đúng trọng tâm của câu hỏi.`,
        source: textbookSource || "Giáo trình Triết học Mác - Lênin",
      };
    });

    navigate("/quiz/results", {
      state: {
        score,
        total: totalQuestions,
        percentage: totalQuestions ? (score / totalQuestions) * 100 : 0,
        review,
      },
    });
  }, [filteredQuestions, navigate, selectedAnswers, totalQuestions]);

  const handleRequestFinish = () => {
    setShowFinishConfirm(true);
  };

  // ============ TIMER COUNTDOWN ============
  useEffect(() => {
    if (showModal || !filteredQuestions.length) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showModal, filteredQuestions, handleSubmit]);

  // Format time MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // ============ HANDLE SELECT ANSWER ============
  const handleSelectAnswer = (index) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: index,
    });
  };

  // ============ NAVIGATION ============
  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      const newProgress = ((currentQuestion + 2) / totalQuestions) * 100;
      setProgress(newProgress);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      const newProgress = (currentQuestion / totalQuestions) * 100;
      setProgress(newProgress);
    }
  };

  // ============ RENDER ============
  return (
    <div className="wrapper overflow-hidden position-relative">
      {/* ========== CONFIGURATION MODAL ========== */}
      {showModal && (
        <div className="quiz-config-modal">
          <div className="modal-content-custom position-relative" style={{ paddingTop: "2.5rem" }}>
            <Link
              to="/"
              className="position-absolute"
              style={{ top: "1.2rem", left: "1.5rem", color: "#172026", fontSize: "1.8rem", lineHeight: 1 }}
              title="Quay lại trang chủ"
            >
              <i className="bi bi-arrow-left-short"></i>
            </Link>
            <h2 className="modal-title-custom">Quizz</h2>

            <div>
              {/* Number of Questions */}
              <div className="config-label">
                <i className="bi bi-list-ol me-2"></i>
                Số lượng câu hỏi
              </div>
              <select
                id="select-1"
                className="config-select"
                value={quizConfig.numberOfQuestions}
                onChange={(e) =>
                  setQuizConfig({
                    ...quizConfig,
                    numberOfQuestions: e.target.value,
                  })
                }
              >
                <option value="10">10 câu</option>
                <option value="30">30 câu</option>
                <option value="50">50 câu</option>
              </select>

              {/* Chapter Selection */}
              <div className="config-label">
                <i className="bi bi-book me-2"></i>
                Chương
              </div>
              <select
                id="select-2"
                className="config-select"
                value={quizConfig.chapter}
                onChange={(e) =>
                  setQuizConfig({
                    ...quizConfig,
                    chapter: e.target.value,
                  })
                }
              >
                <option value="random">Random (Tất cả chương)</option>
                {chapters.map((chapter) => (
                  <option key={chapter} value={chapter}>
                    Chương {chapter}
                  </option>
                ))}
              </select>

              {/* Difficulty Selection */}
              <div className="config-label">
                <i className="bi bi-speedometer2 me-2"></i>
                Độ khó
              </div>
              <select
                id="select-3"
                className="config-select"
                value={quizConfig.difficulty}
                onChange={(e) =>
                  setQuizConfig({
                    ...quizConfig,
                    difficulty: e.target.value,
                  })
                }
              >
                <option value="random">Random (Tất cả độ khó)</option>
                <option value="0">Dễ</option>
                <option value="1">Trung bình</option>
                <option value="2">Khó</option>
              </select>

              {/* Start Button */}
              <button className="start-quiz-btn" onClick={handleStartQuiz}>
                <i className="bi bi-play-fill"></i>
                Bắt Đầu Quiz
              </button>
              <div className="quiz-bank-note">
                Ngân hàng hiện có 504 câu. 10 câu / 5
                phút, 30 câu / 15 phút, 50 câu / 30 phút.
              </div>
              <div className="d-flex flex-column gap-1 mt-3">
                <Link to="/quiz/print" className="quiz-view-all-link mt-0">
                  <i className="bi bi-journal-text"></i>
                  Xem toàn bộ câu hỏi &amp; đáp án
                </Link>
                <Link to="/" className="quiz-view-all-link mt-0 text-secondary" style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                  <i className="bi bi-house-door"></i>
                  Quay lại trang chủ
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {showFinishConfirm && (
        <div className="quiz-confirm-modal">
          <div className="quiz-confirm-box">
            <h3>Kết thúc quiz sớm?</h3>
            <p>
              Bài làm sẽ được chấm ngay. Câu chưa chọn đáp án sẽ được tính là
              sai.
            </p>
            <div className="quiz-confirm-actions">
              <button
                type="button"
                className="confirm-secondary"
                onClick={() => setShowFinishConfirm(false)}
              >
                Tiếp tục làm
              </button>
              <button
                type="button"
                className="confirm-danger"
                onClick={handleSubmit}
              >
                Xác nhận kết thúc
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== QUIZ CONTENT ========== */}
      {!showModal && filteredQuestions.length > 0 && (
        <div
          style={{
            width: "100%",
            paddingRight: "var(--bs-gutter-x, 0.75rem)",
            paddingLeft: "var(--bs-gutter-x, 0.75rem)",
            marginRight: "auto",
            marginLeft: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              marginLeft: "-0.75rem",
              marginRight: "-0.75rem",
            }}
          >
            {/* ========== LEFT SIDEBAR ========== */}
            <div className="col-lg-4">
              <div className="steps_area step_area_fixed">
                {/* Logo */}
                <div className="form_logo position-absolute ps-5 pt-5">
                  <img className="d-none d-lg-block" src={logoImg} alt="logo" />
                </div>

                {/* Background Image */}
                <div className="image_holder">
                  <img
                    className="overflow-hidden d-none d-lg-block"
                    src={currentData?.image || bgImg}
                    alt="background"
                  />
                </div>

                {/* Navigation Buttons */}
                <div className="form_btn position-absolute z-3">
                  <a
                    className="prev_btn border-0 text-uppercase overflow-hidden rounded-pill text-white me-3 d-inline-flex align-items-center"
                    style={{
                      display: currentQuestion === 0 ? "none" : "inline-flex",
                    }}
                    onClick={handlePrev}
                    role="button"
                  >
                    <span>
                      <i className="bi bi-arrow-left-circle-fill rounded-pill"></i>
                    </span>
                    Last Question
                  </a>

                  <a
                    className="next_btn border-0 text-uppercase overflow-hidden rounded-pill text-white d-inline-flex align-items-center"
                    onClick={handleNext}
                    role="button"
                  >
                    {currentQuestion === totalQuestions - 1 ? (
                      <>
                        {"\u00A0".repeat(8)}Submit{"\u00A0".repeat(7)}
                        <span>
                          <i className="bi bi-check-circle-fill rounded-pill"></i>
                        </span>
                      </>
                    ) : (
                      <>
                        Next Question
                        <span>
                          <i className="bi bi-arrow-right-circle-fill rounded-pill"></i>
                        </span>
                      </>
                    )}
                  </a>
                </div>
              </div>
            </div>

            {/* ========== RIGHT CONTENT ========== */}
            <div className="col-lg-8 pt-5 form_wrapper overflow-hidden">
              {/* Timer */}
              <div className="step_content text-center pt-3">
                <div className="count_clock">
                  <img src={clockImg} alt="clock" />
                </div>
                <div className="count_number countdown_timer pt-1">
                  <span>{formatTime(timeLeft)}</span>
                </div>
                <button
                  type="button"
                  className="finish-early-btn"
                  onClick={handleRequestFinish}
                >
                  <i className="bi bi-stop-circle-fill"></i>
                  Kết thúc quiz
                </button>
              </div>

              {/* Question */}
              <div className="form_content">
                <div className="question_title py-5 text-white">
                  <p className="question-meta">
                    Câu {currentQuestion + 1}/{totalQuestions}
                  </p>
                  <h1 className="question-text">{currentData.question}</h1>
                </div>

                {/* Options */}
                <div className="row text-center form_items">
                  {currentData.options.map((option, index) => (
                    <div key={index} className="col-md-6 py-3">
                      <label
                        className={`bg-white answer-option ${selectedAnswer === index ? "active" : ""
                          }`}
                        onClick={() => handleSelectAnswer(index)}
                      >
                        <span className="answer-key">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="answer-text">{option}</span>
                        {selectedAnswer === index && (
                          <span className="selected-mark">
                            <i className="bi bi-check-lg"></i>
                          </span>
                        )}
                        <input
                          type="radio"
                          name={`question_${currentQuestion}`}
                          value={option}
                          checked={selectedAnswer === index}
                          onChange={() => { }}
                          style={{ display: "none" }}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="row justify-content-center align-items-center pt-5">
                <div className="col-md-8">
                  {/* Progress */}
                  <div className="step_progress_bar">
                    <div className="progress rounded-pill">
                      <div
                        className="progress-bar rounded-pill overflow-hidden"
                        role="progressbar"
                        style={{ width: `${progress}%` }}
                        aria-valuenow={progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        {Math.round(progress)}%
                      </div>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="steps_number d-flex justify-content-around">
                    {filteredQuestions.map((_, index) => (
                      <div
                        key={index}
                        className="step d-flex flex-column align-items-center position-relative text-center"
                      >
                        <span
                          className={`text-white position-absolute rounded-pill ${index <= currentQuestion ? "active" : ""
                            } ${index < currentQuestion ? "finish" : ""}`}
                        >
                          {index + 1}
                        </span>
                        <p
                          className={`pt-4 ${index <= currentQuestion ? "active" : ""
                            } ${index < currentQuestion ? "finish" : ""}`}
                        >
                          Question
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
