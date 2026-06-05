import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { allQuizQuestions } from "../../data/quizBank";
import { createLiveRoom, getLiveRoom, getLivePlayers, joinLiveRoom } from "../../services/liveQuizService";
import {
  LIVE_QUIZ_HOST_KEY,
  LIVE_QUIZ_MAX_PLAYERS,
  LIVE_QUIZ_PLAYER_KEY,
  createQuestionOrder,
  generateRoomCode,
  generateToken,
  liveQuizTimeLimits,
  pickRoomQuestions,
  storeToken,
} from "../../utils/liveQuiz";
import "../../styles/liveQuiz.css";

const CREATE_ROOM_PASSWORD = "123456890";

function LiveQuizHomePage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("create");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [createForm, setCreateForm] = useState({
    hostName: "",
    hostPassword: "",
    roomName: "Đấu trường Triết học",
    numberOfQuestions: "10",
    perQuestionSeconds: "30",
    chapter: "random",
    difficulty: "random",
    buffsEnabled: true,
  });
  const [joinForm, setJoinForm] = useState({
    playerName: "",
    roomCode: "",
  });

  const chapters = useMemo(
    () => [...new Set(allQuizQuestions.map((q) => q.chapter))].sort((a, b) => a - b),
    [],
  );

  const handleCreate = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (createForm.hostPassword !== CREATE_ROOM_PASSWORD) {
        throw new Error("Mật khẩu tạo phòng không đúng.");
      }

      const questionSet = pickRoomQuestions(allQuizQuestions, createForm);
      if (!questionSet.length) {
        throw new Error("Không tìm thấy câu hỏi phù hợp với cấu hình này.");
      }

      const roomCode = generateRoomCode();
      const hostToken = generateToken("host");

      await createLiveRoom({
        room_code: roomCode,
        room_name: createForm.roomName.trim() || "Đấu trường Triết học",
        host_name: createForm.hostName.trim() || "Host",
        host_token: hostToken,
        status: "lobby",
        question_set: questionSet,
        config: {
          numberOfQuestions: Number(createForm.numberOfQuestions),
          chapter: createForm.chapter,
          difficulty: createForm.difficulty,
          perQuestionSeconds: Number(createForm.perQuestionSeconds),
          totalSeconds: liveQuizTimeLimits[Number(createForm.numberOfQuestions)] || 300,
        },
        buffs_enabled: createForm.buffsEnabled,
      });

      storeToken(LIVE_QUIZ_HOST_KEY, roomCode, hostToken);
      navigate(`/live-quiz/host/${roomCode}`);
    } catch (err) {
      setError(err.message || "Không tạo được phòng.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const roomCode = joinForm.roomCode.trim().toUpperCase();
      const room = await getLiveRoom(roomCode);
      if (room.status === "ended") {
        throw new Error("Phòng này đã kết thúc.");
      }

      const players = await getLivePlayers(roomCode);
      if (players.length >= LIVE_QUIZ_MAX_PLAYERS) {
        throw new Error(`Phòng đã đủ ${LIVE_QUIZ_MAX_PLAYERS} người.`);
      }

      const playerToken = generateToken("player");
      await joinLiveRoom({
        room_code: roomCode,
        player_token: playerToken,
        name: joinForm.playerName.trim() || `Người chơi ${players.length + 1}`,
        status: room.status === "playing" ? "playing" : "lobby",
        question_order: createQuestionOrder(room.question_set.length, playerToken),
        answers: {},
        score: 0,
        correct_count: 0,
        answered_count: 0,
        total_questions: room.question_set.length,
        buffs: [],
      });

      storeToken(LIVE_QUIZ_PLAYER_KEY, roomCode, playerToken);
      navigate(`/live-quiz/play/${roomCode}`);
    } catch (err) {
      setError(err.message || "Không vào được phòng.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="live-quiz-page">
      <div className="live-quiz-shell live-quiz-home">
        <Link to="/" className="live-home-link">
          <i className="bi bi-house-door-fill"></i>
          Trang chủ
        </Link>

        <section className="live-hero">
          <p className="live-eyebrow">Live Quiz Room</p>
          <h1>Mại zô mại zô</h1>
          <p>
            Random câu hỏi từ kho đề Triết, cho bạn bè vào bằng mã phòng, xem
            tiến độ và bảng xếp hạng ngay khi mọi người làm bài.
          </p>
        </section>

        <section className="live-panel">
          <div className="live-mode-tabs">
            <button
              type="button"
              className={mode === "create" ? "active" : ""}
              onClick={() => setMode("create")}
            >
              <i className="bi bi-plus-circle-fill"></i>
              Tạo phòng
            </button>
            <button
              type="button"
              className={mode === "join" ? "active" : ""}
              onClick={() => setMode("join")}
            >
              <i className="bi bi-door-open-fill"></i>
              Vào phòng
            </button>
          </div>

          {error && <div className="live-error">{error}</div>}

          {mode === "create" ? (
            <form className="live-form" onSubmit={handleCreate}>
              <label>
                Tên host
                <input
                  value={createForm.hostName}
                  onChange={(event) =>
                    setCreateForm({ ...createForm, hostName: event.target.value })
                  }
                  placeholder="Ví dụ: Trung"
                />
              </label>
              <label>
                Mật khẩu tạo phòng
                <input
                  type="password"
                  value={createForm.hostPassword}
                  onChange={(event) =>
                    setCreateForm({
                      ...createForm,
                      hostPassword: event.target.value,
                    })
                  }
                  placeholder="Nhập mật khẩu host"
                />
              </label>
              <label>
                Tên phòng
                <input
                  value={createForm.roomName}
                  onChange={(event) =>
                    setCreateForm({ ...createForm, roomName: event.target.value })
                  }
                />
              </label>
              <label>
                Số câu hỏi
                <select
                  value={createForm.numberOfQuestions}
                  onChange={(event) =>
                    setCreateForm({
                      ...createForm,
                      numberOfQuestions: event.target.value,
                    })
                  }
                >
                  <option value="10">10 câu / 5 phút</option>
                  <option value="20">20 câu / 10 phút</option>
                  <option value="30">30 câu / 15 phút</option>
                  <option value="50">50 câu / 30 phút</option>
                  <option value="100">100 câu / 60 phút</option>
                  <option value="200">200 câu / 120 phút</option>
                  <option value="504">Tất cả 504 câu</option>
                </select>
              </label>
              <label>
                Thời gian mỗi câu
                <select
                  value={createForm.perQuestionSeconds}
                  onChange={(event) =>
                    setCreateForm({
                      ...createForm,
                      perQuestionSeconds: event.target.value,
                    })
                  }
                >
                  <option value="15">15 giây/câu</option>
                  <option value="20">20 giây/câu</option>
                  <option value="30">30 giây/câu</option>
                  <option value="45">45 giây/câu</option>
                  <option value="60">60 giây/câu</option>
                </select>
              </label>
              <label>
                Chương
                <select
                  value={createForm.chapter}
                  onChange={(event) =>
                    setCreateForm({ ...createForm, chapter: event.target.value })
                  }
                >
                  <option value="random">Random tất cả chương</option>
                  {chapters.map((chapter) => (
                    <option key={chapter} value={chapter}>
                      Chương {chapter}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Độ khó
                <select
                  value={createForm.difficulty}
                  onChange={(event) =>
                    setCreateForm({ ...createForm, difficulty: event.target.value })
                  }
                >
                  <option value="random">Random tất cả độ khó</option>
                  <option value="0">Dễ</option>
                  <option value="1">Trung bình</option>
                  <option value="2">Khó</option>
                </select>
              </label>
              <label className="live-check">
                <input
                  type="checkbox"
                  checked={createForm.buffsEnabled}
                  onChange={(event) =>
                    setCreateForm({
                      ...createForm,
                      buffsEnabled: event.target.checked,
                    })
                  }
                />
                Bật buff hiệu ứng ngẫu nhiên
              </label>
              <button className="live-primary-btn" type="submit" disabled={isLoading}>
                <i className="bi bi-broadcast-pin"></i>
                {isLoading ? "Đang tạo..." : "Tạo phòng"}
              </button>
            </form>
          ) : (
            <form className="live-form" onSubmit={handleJoin}>
              <label>
                Tên của bạn
                <input
                  value={joinForm.playerName}
                  onChange={(event) =>
                    setJoinForm({ ...joinForm, playerName: event.target.value })
                  }
                  placeholder="Ví dụ: Thành viên nhóm 2"
                />
              </label>
              <label>
                Mã phòng
                <input
                  value={joinForm.roomCode}
                  onChange={(event) =>
                    setJoinForm({
                      ...joinForm,
                      roomCode: event.target.value.toUpperCase(),
                    })
                  }
                  placeholder="ABC123"
                  maxLength={6}
                />
              </label>
              <button className="live-primary-btn" type="submit" disabled={isLoading}>
                <i className="bi bi-box-arrow-in-right"></i>
                {isLoading ? "Đang vào..." : "Vào phòng"}
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}

export default LiveQuizHomePage;
