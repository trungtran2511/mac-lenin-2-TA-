import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { allQuizQuestions } from "../data/quizBank";

const ANSWER_LABELS = ["A", "B", "C", "D"];
const DIFFICULTY_LABEL = { 0: "Dễ", 1: "Trung bình", 2: "Khó" };

function QuizPrintPage() {
  const chapters = useMemo(
    () => [...new Set(allQuizQuestions.map((q) => q.chapter))].sort((a, b) => a - b),
    []
  );
// Mapping subchapter codes to readable titles (based on textbook TOC)
  const subChapterTitles = {
    "1.I": "I. TRIẾT HỌC VÀ VẤN ĐỀ CƠ BẢN CỦA TRIẾT HỌC",
    "1.II": "II. TRIẾT HỌC MÁC – LÊNIN VÀ VAI TRÒ CỦA TRIẾT HỌC MÁC – LÊNIN",
    "2.I": "I. VẬT CHẤT VÀ Ý THỨC",
    "2.II": "II. PHÉP BIỆN CHỨNG DUY VẬT",
    "2.III": "III. LÝ LUẬN NHẬN THỨC",
    "3.I": "I. HỌC THUYẾT HÌNH THÁI KINH TẾ – XÃ HỘI",
    "3.II": "II. GIAI CẤP VÀ DÂN TỘC",
    "3.III": "III. NHÀ NƯỚC VÀ CÁCH MẠNG XÃ HỘI",
    "3.IV": "IV. Ý THỨC XÃ HỘI",
    "3.V": "V. TRIẾT HỌC VỀ CON NGƯỜI",
  };


  const [filterChapter, setFilterChapter] = useState("all");
  const [showAnswers, setShowAnswers] = useState(true);
  const [showIndex, setShowIndex] = useState(true);
  const [pageSize, setPageSize] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPrinting, setIsPrinting] = useState(false);

  // Bộ lọc chương
  const filteredQuestions = useMemo(() => {
    if (filterChapter === "all") return allQuizQuestions;
    return allQuizQuestions.filter((q) => q.chapter === Number(filterChapter));
  }, [filterChapter]);

  // Extract distinct subchapters from filtered questions
  const subChapters = useMemo(() => {
    const set = new Set();
    filteredQuestions.forEach((q) => {
      if (q.subChapter) set.add(q.subChapter);
    });
    return Array.from(set).sort((a, b) => {
      const [aCh, aSec] = a.split('.');
      const [bCh, bSec] = b.split('.');
      if (aCh !== bCh) return Number(aCh) - Number(bCh);
      return Number(aSec) - Number(bSec);
    });
  }, [filteredQuestions]);

  // Tổng số trang
  const totalPages = useMemo(() => {
    if (pageSize === "all") return 1;
    return Math.ceil(filteredQuestions.length / pageSize);
  }, [filteredQuestions, pageSize]);

  // Dữ liệu hiển thị (phân trang khi không in)
  const displayed = useMemo(() => {
    if (isPrinting || pageSize === "all") return filteredQuestions;
    const start = (currentPage - 1) * pageSize;
    return filteredQuestions.slice(start, start + pageSize);
  }, [filteredQuestions, currentPage, pageSize, isPrinting]);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 300);
  };

  return (
    <div className="qp-wrap">
      {/* ===== TOOLBAR (ẩn khi in) ===== */}
      <div className="qp-toolbar no-print">
        <div className="qp-toolbar-left">
          <Link to="/quiz" className="qp-back-btn">
            <i className="bi bi-arrow-left" />
            <span>Quay lại</span>
          </Link>
          <div className="qp-divider" />
          <h1 className="qp-title">
            <i className="bi bi-journal-text" />
            <span>Ngân hàng câu hỏi</span>
          </h1>
        </div>
        <div className="qp-toolbar-right">
          <span className="qp-count">
            <strong>{filteredQuestions.length}</strong> câu
          </span>

          {/* Filter chapter */}
          <select
            className="qp-select"
            value={filterChapter}
            onChange={(e) => {
              setFilterChapter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Tất cả chương</option>
            {chapters.map((c) => (
              <option key={c} value={c}>Chương {c}</option>
            ))}
          </select>

          {/* Page Size Select */}
          <select
            className="qp-select"
            value={pageSize}
            onChange={(e) => {
              const val = e.target.value;
              setPageSize(val === "all" ? "all" : Number(val));
              setCurrentPage(1);
            }}
          >
            <option value={50}>50 câu / trang</option>
            <option value={100}>100 câu / trang</option>
            <option value="all">Hiển thị tất cả</option>
          </select>

          {/* Toggle show answers */}
          <button
            type="button"
            className={`qp-toggle-btn ${showAnswers ? "active" : ""}`}
            onClick={() => setShowAnswers(!showAnswers)}
            title={showAnswers ? "Ẩn đáp án" : "Hiện đáp án"}
          >
            <i className={`bi ${showAnswers ? "bi-eye-fill" : "bi-eye-slash-fill"}`} />
            <span>Hiện đáp án</span>
          </button>

          {/* Toggle show numbering */}
          <button
            type="button"
            className={`qp-toggle-btn ${showIndex ? "active" : ""}`}
            onClick={() => setShowIndex(!showIndex)}
            title={showIndex ? "Ẩn số thứ tự" : "Hiện số thứ tự"}
          >
            <i className="bi bi-hash" />
            <span>Số thứ tự</span>
          </button>

          <button className="qp-print-btn" onClick={handlePrint}>
            <i className="bi bi-printer-fill" />
            <span>In / PDF</span>
          </button>
        </div>
      </div>

      {/* ===== PRINT HEADER (chỉ hiện khi in) ===== */}
      <div className="qp-print-header print-only">
        <h1>Bộ câu hỏi Triết học Mác–Lênin</h1>
        <p>Tổng: {filteredQuestions.length} câu · {filterChapter === "all" ? "Tất cả chương" : `Chương ${filterChapter}`}</p>
      </div>

      {/* ===== QUESTION LIST ===== */}
      <div className="qp-list">
        {subChapters.map((sub) => {
        const subQs = displayed.filter((q) => q.subChapter === sub);
        if (!subQs.length) return null;
        const title = subChapterTitles[sub] || `Mục ${sub}`;
        return (
          <section key={sub} className="qp-subchapter-section">
            <h2 className="qp-subchapter-heading">
              <span className="qp-subchapter-badge">{title}</span>
            </h2>
            <div className="qp-questions">
              {subQs.map((q) => {
                return (
                  <article key={q.id} className="qp-card">
                    <p className="qp-question">
                      {q.question}
                      <span className={`qp-diff qp-diff--${q.difficulty}`}>{DIFFICULTY_LABEL[q.difficulty] ?? ""}</span>
                    </p>
                    <ul className="qp-options">
                      {q.options.map((opt, i) => (
                        <li key={i} className={`qp-option ${showAnswers && i === q.correctAnswer ? 'qp-option--correct' : ''}`}>
                          <span className="qp-opt-key">{ANSWER_LABELS[i]}.</span>
                          <span className="qp-opt-text">{opt}</span>
                          {showAnswers && i === q.correctAnswer && <span className="qp-correct-mark">✓</span>}
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}

        {/* ===== PAGINATION ===== */}
        {totalPages > 1 && !isPrinting && (
          <div className="qp-pagination no-print">
            <button
              type="button"
              className="qp-page-btn"
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((prev) => Math.max(prev - 1, 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <i className="bi bi-chevron-left" /> Trước
            </button>

            <div className="qp-page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                if (totalPages > 8) {
                  const isNearCurrent = Math.abs(p - currentPage) <= 1;
                  const isEdges = p === 1 || p === totalPages;
                  if (!isNearCurrent && !isEdges) {
                    if (p === 2 && currentPage > 3) {
                      return <span key={p} className="qp-page-dots">...</span>;
                    }
                    if (p === totalPages - 1 && currentPage < totalPages - 2) {
                      return <span key={p} className="qp-page-dots">...</span>;
                    }
                    return null;
                  }
                }
                return (
                  <button
                    key={p}
                    type="button"
                    className={`qp-page-num-btn ${currentPage === p ? "active" : ""}`}
                    onClick={() => {
                      setCurrentPage(p);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="qp-page-btn"
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Sau <i className="bi bi-chevron-right" />
            </button>
          </div>
        )}
      </div>

      {/* ===== PRINT FOOTER ===== */}
      <div className="qp-print-footer print-only">
        <p>Nhóm 2 — Không gian học Triết học Mác–Lênin</p>
      </div>

      {/* ===== STYLES ===== */}
      <style>{`
        /* ========== LAYOUT ========== */
        .qp-wrap {
          min-height: 100vh;
          background: #f1f5f9;
          font-family: 'Inter', 'Segoe UI', sans-serif;
          color: #1e293b;
        }

        /* ========== TOOLBAR ========== */
        .qp-toolbar {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 12px 28px;
          background: #0f172a;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }
        .qp-toolbar-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .qp-toolbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .qp-divider {
          width: 1px;
          height: 20px;
          background: rgba(255, 255, 255, 0.15);
        }
        .qp-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 600;
          transition: color .2s;
        }
        .qp-back-btn:hover { color: #f8fafc; }
        .qp-title {
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .qp-title i { color: #f59e0b; }
        .qp-count {
          color: #94a3b8;
          font-size: 0.85rem;
          white-space: nowrap;
        }
        .qp-count strong { color: #f59e0b; }
        .qp-select {
          background: #1e293b;
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #f1f5f9;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.8rem;
          cursor: pointer;
          outline: none;
          transition: border-color 0.2s;
        }
        .qp-select:hover {
          border-color: rgba(255, 255, 255, 0.25);
        }
        .qp-toggle-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .qp-toggle-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }
        .qp-toggle-btn.active {
          background: rgba(245, 158, 11, 0.12);
          border-color: rgba(245, 158, 11, 0.4);
          color: #f59e0b;
        }
        .qp-print-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #f59e0b;
          color: #0f172a;
          border: none;
          padding: 6px 16px;
          border-radius: 8px;
          font-weight: 750;
          font-size: 0.82rem;
          cursor: pointer;
          transition: background .2s, transform .1s;
          white-space: nowrap;
        }
        .qp-print-btn:hover { background: #d97706; transform: translateY(-1px); }

        /* ========== LIST ========== */
        .qp-list {
          max-width: 1000px;
          margin: 0 auto;
          padding: 24px 20px 48px;
        }

        /* ========== CHAPTER SECTION ========== */
        .qp-chapter-section { margin-bottom: 32px; }
        .qp-chapter-heading {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 2px solid #cbd5e1;
        }
        .qp-chapter-badge {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: #fff;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 700;
          box-shadow: 0 4px 10px rgba(124, 58, 237, 0.15);
        }
        .qp-chapter-count {
          color: #64748b;
          font-size: 0.82rem;
        }

        /* ========== QUESTION CARD ========== */
        .qp-questions { display: flex; flex-direction: column; gap: 12px; }
        .qp-card {
          background: #ffffff;
          border-radius: 12px;
          padding: 16px 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.02);
          border: 1px solid #e2e8f0;
          transition: all 0.2s;
          page-break-inside: avoid;
        }
        .qp-card:hover { 
          box-shadow: 0 4px 12px rgba(0,0,0,0.08); 
          border-color: #cbd5e1;
        }

        /* Question text */
        .qp-question {
          font-weight: 650;
          font-size: 0.95rem;
          color: #0f172a;
          margin: 0 0 12px;
          display: flex;
          align-items: flex-start;
          gap: 6px;
          flex-wrap: wrap;
          line-height: 1.5;
        }
        .qp-num {
          color: #4f46e5;
          font-weight: 700;
          min-width: 24px;
        }
        .qp-diff {
          font-size: 0.68rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 10px;
          margin-left: auto;
          white-space: nowrap;
          align-self: center;
        }
        .qp-diff--0 { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
        .qp-diff--1 { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
        .qp-diff--2 { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }

        /* Options */
        .qp-options {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        @media (max-width: 768px) {
          .qp-options { grid-template-columns: 1fr; }
        }
        .qp-option {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 0.88rem;
          color: #334155;
          transition: all 0.15s;
        }
        .qp-option--correct {
          background: #ecfdf5;
          border-color: #10b981;
          color: #065f46;
          font-weight: 600;
        }
        .qp-opt-key {
          font-weight: 700;
          min-width: 18px;
          color: #4f46e5;
        }
        .qp-option--correct .qp-opt-key { color: #10b981; }
        .qp-opt-text { flex: 1; line-height: 1.45; }
        .qp-correct-mark {
          color: #10b981;
          font-size: 0.95rem;
          margin-left: auto;
          align-self: center;
          display: inline-flex;
        }

        /* ========== PAGINATION ========== */
        .qp-pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 32px;
          padding-top: 16px;
          border-top: 1px solid #cbd5e1;
        }
        .qp-page-btn {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #4f46e5;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        .qp-page-btn:hover:not(:disabled) {
          background: #f1f5f9;
          border-color: #cbd5e1;
          color: #312e81;
        }
        .qp-page-btn:disabled {
          color: #94a3b8;
          cursor: not-allowed;
          opacity: 0.6;
        }
        .qp-page-numbers {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .qp-page-num-btn {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #334155;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .qp-page-num-btn:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }
        .qp-page-num-btn.active {
          background: #4f46e5;
          border-color: #4f46e5;
          color: #ffffff;
          box-shadow: 0 4px 10px rgba(79, 70, 229, 0.2);
        }
        .qp-page-dots {
          color: #64748b;
          font-weight: 600;
          width: 20px;
          text-align: center;
        }

        /* ========== PRINT STYLES ========== */
        .print-only { display: none; }
        .qp-print-header {
          text-align: center;
          padding: 20px 0 10px;
          border-bottom: 2px solid #333;
          margin-bottom: 20px;
        }
        .qp-print-header h1 { font-size: 1.4rem; margin: 0 0 4px; }
        .qp-print-header p { font-size: 0.85rem; color: #555; margin: 0; }
        .qp-print-footer {
          text-align: center;
          padding: 16px 0 0;
          border-top: 1px solid #ccc;
          font-size: 0.8rem;
          color: #666;
          margin-top: 30px;
        }

        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .qp-wrap { background: #fff; color: #000; }
          .qp-list { padding: 0; max-width: 100%; }
          .qp-card {
            box-shadow: none;
            border: 1px solid #ddd;
            margin-bottom: 10px;
            padding: 12px 16px;
            border-radius: 6px;
            background: #fff;
            color: #000;
          }
          .qp-question { color: #000; }
          .qp-num { color: #000; }
          .qp-diff { border: 1px solid #000; color: #000; background: transparent; }
          .qp-chapter-heading { page-break-after: avoid; border-bottom: 2px solid #000; color: #000; }
          .qp-chapter-badge { background: transparent; color: #000; border: 1px solid #000; box-shadow: none; }
          .qp-options { grid-template-columns: 1fr 1fr; }
          .qp-option { border: 1px solid #ccc; background: #fff; color: #000; }
          .qp-option--correct { border-color: #000; font-weight: bold; }
          .qp-opt-key { color: #000; }
          .qp-option--correct .qp-opt-key { color: #000; }
          .qp-correct-mark { color: #000; }
          body { font-size: 12px; background: #fff; color: #000; }
        }
      `}</style>
    </div>
  );
}

export default QuizPrintPage;
