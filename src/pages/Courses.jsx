import { useState } from "react";
import { textbookTopics } from "../data/textbookTopics";
import { philosophyQuotes } from "../data/philosophyQuotes";
import "../styles/courses/courses.css";
import { Link } from "react-router-dom";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const Courses = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);

  const handleTopicChange = (e) => {
    const topicId = e.target.value;
    if (topicId) {
      const topic = textbookTopics.find((t) => t.id === topicId);
      setSelectedTopic(topic);
    } else {
      setSelectedTopic(null);
    }
  };

  const renderContent = () => {
    if (!selectedTopic) {
      return (
        <div className="text-center py-5 text-muted">
          <i
            className="bi bi-book display-1"
            style={{ color: "var(--secondary-color)", opacity: 0.3 }}
          ></i>
          <h5 className="mt-3">
            Vui lòng chọn một chủ đề từ danh sách bên trên
          </h5>
        </div>
      );
    }

    const groupedItems = selectedTopic.items.reduce((groups, item) => {
      const lastGroup = groups[groups.length - 1];

      if (lastGroup?.heading === item.heading) {
        lastGroup.items.push(item);
      } else {
        groups.push({ heading: item.heading, items: [item] });
      }

      return groups;
    }, []);

    return (
      <div className="d-flex flex-column gap-3">
        {groupedItems.map((group, index) => (
          <div
            key={`${group.heading}-${index}`}
            className="question-item topic-section-card bg-light rounded-3 p-3"
          >
            <div className="d-flex align-items-start gap-3">
              <span
                className="badge rounded-pill text-white d-flex align-items-center justify-content-center"
                style={{
                  background: "var(--primary-color)",
                  width: "32px",
                  height: "32px",
                  fontSize: "14px",
                }}
              >
                {index + 1}
              </span>
              <div className="flex-grow-1">
                <h6
                  className="fw-bold mb-2"
                  style={{ color: "var(--secondary-color)" }}
                >
                  {group.heading}
                </h6>
                <div className="topic-section-body">
                  {group.items.map((item) => (
                    <p key={item.source} className="mb-2 text-secondary">
                      {item.text}
                    </p>
                  ))}
                </div>
                <small className="text-muted">
                  <i className="bi bi-bookmark-check me-1"></i>
                  {group.items[0].source}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const selectedQuote = selectedTopic
    ? philosophyQuotes[selectedTopic.id]
    : null;

  const renderMindmap = () => {
    if (!selectedTopic) {
      return (
        <div className="text-center">
          <i
            className="bi bi-diagram-3 display-1 text-muted opacity-25"
            style={{ color: "var(--secondary-color)" }}
          ></i>
          <p className="mt-3 text-muted mb-0 fw-semibold">Ảnh sơ đồ tư duy</p>
          <small className="text-muted">Sẽ hiển thị khi có dữ liệu</small>
        </div>
      );
    }

    if (selectedTopic.image && selectedTopic.image.trim() !== "") {
      return (
        <Zoom>
          <img
            src={selectedTopic.image}
            className="img-fluid rounded"
            alt={selectedTopic.title}
            style={{ cursor: "zoom-in" }}
          />
        </Zoom>
      );
    }

    return (
      <div className="text-center">
        <i
          className="bi bi-diagram-3 display-1 text-muted opacity-25"
          style={{ color: "var(--secondary-color)" }}
        ></i>
        <p className="mt-3 text-muted mb-0 fw-semibold">Ảnh sơ đồ tư duy</p>
        <small className="text-muted">Chưa có dữ liệu</small>
      </div>
    );
  };

  return (
    <div className="triet-hoc-wrapper container-fluid p-4">
      {/* Header */}
      <div
        className="position-relative rounded-4 shadow-lg p-4 mb-4 text-center"
        style={{ color: "#3626b2" }}
      >
        <Link to="/" className="back-home-btn">
          <i className="bi bi-house-door-fill"></i>
          <span className="back-text">Trang chủ</span>
        </Link>
        <h1 className="mb-2 fw-bold" style={{ color: "#3626b2" }}>
          <i className="bi bi-book"></i> Học theo giáo trình
        </h1>
        <p className="mb-0 fs-5">
          <i className="bi bi-lightbulb"></i> Nội dung bám theo Chương 4 - Giáo trình Kinh tế chính trị Mác - Lênin
        </p>
        <a
          className="download-textbook-btn"
          href="/docs/giao-trinh-triet-hoc-mac-lenin.docx"
          download
        >
          <i className="bi bi-download"></i>
          Tải giáo trình
        </a>
      </div>

      {/* Topic Dropdown Selector */}
      <div className="bg-white rounded-4 shadow p-4 mb-4">
        <div
          htmlFor="topicSelect"
          className="form-label fw-bold fs-5"
          style={{ color: "var(--secondary-color)" }}
        >
          <i className="bi bi-journal-text"></i> Chọn Chủ đề:
        </div>
        <select
          id="topicSelect"
          className="form-select form-select-lg"
          value={selectedTopic?.id || ""}
          onChange={handleTopicChange}
          style={{ borderColor: "var(--primary-color)" }}
        >
          <option value="">-- Vui lòng chọn một chủ đề --</option>
          {textbookTopics.map((topic, index) => (
            <option key={topic.id} value={topic.id}>
              Mục {index + 1}: {topic.title}
            </option>
          ))}
        </select>
      </div>

      {/* Content Area: 2 Columns */}
      <div className="row g-4">
        {/* Left Column - Nội dung bài học */}
        <div className="col-lg-7">
          <div
            className="bg-white rounded-4 shadow p-4"
            style={{ minHeight: "500px" }}
          >
            <div className="border-bottom pb-3 mb-4">
              <h3
                className="mb-0 fw-bold"
                style={{ color: "var(--secondary-color)" }}
              >
                <i className="bi bi-book-half"></i>{" "}
                {selectedTopic ? selectedTopic.title : "Nội dung giáo trình"}
              </h3>
            </div>
            <div>{renderContent()}</div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-lg-5">
          {/* Câu nói hay */}
          <div className="quote-box rounded-4 shadow p-4 mb-4">
            <h5
              className="mb-3 fw-bold"
              style={{ color: "var(--secondary-color)" }}
            >
              <i className="bi bi-quote"></i> Câu nói hay
            </h5>
            <p className="fst-italic mb-0">
              {selectedQuote
                ? `“${selectedQuote.text}”`
                : "Chọn một chủ đề để xem câu nói hay phù hợp..."}
            </p>
            {selectedQuote && (
              <div className="quote-source">
                <strong>{selectedQuote.author}</strong>
                <a
                  href={selectedQuote.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {selectedQuote.source}
                </a>
              </div>
            )}
          </div>

          {/* Ảnh sơ đồ tư duy */}
          <div className="mindmap-box rounded-4 shadow p-4 d-flex align-items-center justify-content-center">
            {renderMindmap()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
