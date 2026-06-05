import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getLivePlayer,
  getLivePlayers,
  getLiveRoom,
  joinLiveRoom,
  subscribeLiveRoom,
  updateLivePlayer,
} from "../../services/liveQuizService";
import {
  LIVE_QUIZ_PLAYER_KEY,
  LIVE_QUIZ_MAX_PLAYERS,
  calculateLeaderboard,
  createQuestionOrder,
  generateToken,
  getStoredToken,
  maybeCreateBuff,
  storeToken,
} from "../../utils/liveQuiz";
import "../../styles/liveQuiz.css";

function PlayerQuizPage() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const normalizedRoomCode = roomCode?.toUpperCase();
  const [room, setRoom] = useState(null);
  const [player, setPlayer] = useState(null);
  const [players, setPlayers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionStartedAt, setQuestionStartedAt] = useState(Date.now());
  const [nowTick, setNowTick] = useState(Date.now());
  const [joinName, setJoinName] = useState("");
  const [error, setError] = useState("");
  const [extraSeconds, setExtraSeconds] = useState(0);
  const [hiddenOptions, setHiddenOptions] = useState([]);

  // Buff notification state
  const [buffNotification, setBuffNotification] = useState(null);
  const [showBuffNotify, setShowBuffNotify] = useState(false);
  const buffNotifyTimer = useRef(null);
  const autoAdvanceTimer = useRef(null);
  const prevIndexRef = useRef(null);

  const playerToken = getStoredToken(LIVE_QUIZ_PLAYER_KEY, normalizedRoomCode);
  const leaderboard = useMemo(() => calculateLeaderboard(players), [players]);
  const orderedQuestions = useMemo(() => {
    if (!room || !player?.question_order?.length) return [];
    return player.question_order.map((index) => room.question_set[index]).filter(Boolean);
  }, [player, room]);
  const currentQuestion = orderedQuestions[currentIndex];
  const answers = player?.answers || {};
  const selectedAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const hasAnsweredCurrent = selectedAnswer !== undefined;
  const isCurrentCorrect =
    hasAnsweredCurrent && selectedAnswer === currentQuestion?.correctAnswer;

  // retry_wrong: chỉ cho phép retry tại câu hiện tại nếu buff active + đã trả lời sai
  const activeBuff = player?.active_buff;
  const canRetryCurrentQuestion =
    (activeBuff?.id === "retry_wrong" ||
      activeBuff?.id === "retry_previous_wrong") &&
    activeBuff?.used &&
    !activeBuff?.completedRetry &&
    activeBuff?.appliedQuestionIndex === currentIndex &&
    hasAnsweredCurrent &&
    !isCurrentCorrect;

  const markBuffUsed = (buff, extra = {}) => {
    if (!buff) return buff;
    return { ...buff, ...extra, used: true, usedAt: new Date().toISOString() };
  };

  const syncUsedBuff = (buffs = [], usedBuff) => {
    if (!usedBuff) return buffs;
    return buffs.map((buff) =>
      buff.receivedAt === usedBuff.receivedAt && buff.id === usedBuff.id
        ? usedBuff
        : buff,
    );
  };

  const calculateStats = (updatedAnswers, usedBuffs, pendingDoubleQuestionId) => {
    const doubledQuestionIds = new Set(
      usedBuffs
        .filter((buff) => buff.id === "double_score" && buff.appliedQuestionId)
        .map((buff) => buff.appliedQuestionId),
    );
    if (pendingDoubleQuestionId) doubledQuestionIds.add(pendingDoubleQuestionId);
    const specialRetryBonus = usedBuffs.some(
      (buff) => buff.id === "retry_previous_wrong" && buff.bonusAwarded,
    )
      ? 200
      : 0;

    const baseStats = orderedQuestions.reduce(
      (stats, question) => {
        const selected = updatedAnswers[question.id];
        if (selected === undefined) return stats;
        if (selected === question.correctAnswer) {
          return {
            score: stats.score + (doubledQuestionIds.has(question.id) ? 200 : 100),
            correctCount: stats.correctCount + 1,
          };
        }
        return stats;
      },
      { score: 0, correctCount: 0 },
    );

    return {
      ...baseStats,
      score: baseStats.score + specialRetryBonus,
    };
  };

  const resetQuestionEffects = () => {
    setHiddenOptions([]);
    setExtraSeconds(0);
    setQuestionStartedAt(Date.now());
    setNowTick(Date.now());
  };

  const moveToQuestion = (index) => {
    resetQuestionEffects();
    setCurrentIndex(index);
  };

  const scheduleNextQuestion = () => {
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    autoAdvanceTimer.current = setTimeout(() => {
      if (currentIndex < orderedQuestions.length - 1) {
        moveToQuestion(currentIndex + 1);
      }
    }, 700);
  };

  // --- Show buff notification toast ---
  const showBuffToast = useCallback((buff) => {
    if (!buff) return;
    // Clear old timer
    if (buffNotifyTimer.current) clearTimeout(buffNotifyTimer.current);
    setBuffNotification(buff);
    setShowBuffNotify(true);
    buffNotifyTimer.current = setTimeout(() => {
      setShowBuffNotify(false);
    }, 2200);
  }, []);

  useEffect(() => {
    return () => {
      if (buffNotifyTimer.current) clearTimeout(buffNotifyTimer.current);
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    };
  }, []);

  // --- Roll buff khi chuyển câu hỏi ---
  useEffect(() => {
    if (!room || room.status !== "playing" || !player || player.status === "submitted") return;
    if (prevIndexRef.current === currentIndex) return;
    prevIndexRef.current = currentIndex;

    // Expire buff cũ nếu chưa dùng (chuyển câu = buff hết hiệu lực)
    const currentBuff = player.active_buff;
    const shouldExpire = currentBuff && !currentBuff.used && currentBuff.questionIndex !== currentIndex;

    // Roll buff mới cho câu hiện tại
    const expiredBuff = shouldExpire ? { ...currentBuff, used: true, expired: true } : currentBuff;
    const receivedBuffCount = (player.buffs || []).filter((b) => !b.expired).length;
    const lastBuffQuestionIndex = (player.buffs || []).reduce((latest, buff) => {
      if (!Number.isInteger(buff.questionIndex)) return latest;
      return Math.max(latest, buff.questionIndex);
    }, -1);
    const newBuff = maybeCreateBuff(
      room.buffs_enabled,
      expiredBuff,
      currentIndex,
      receivedBuffCount,
      lastBuffQuestionIndex >= 0 ? lastBuffQuestionIndex : null,
    );

    if (newBuff) {
      showBuffToast(newBuff);
      const updatedBuffs = [...(player.buffs || [])];
      if (shouldExpire) {
        // Sync expired buff
        const idx = updatedBuffs.findIndex(
          (b) => b.receivedAt === currentBuff.receivedAt && b.id === currentBuff.id,
        );
        if (idx >= 0) updatedBuffs[idx] = expiredBuff;
      }
      let appliedBuff = newBuff;

      if (newBuff.id === "time_plus") {
        setExtraSeconds((seconds) => seconds + 15);
        appliedBuff = markBuffUsed(newBuff);
      }

      if (newBuff.id === "skip_pressure") {
        setExtraSeconds((seconds) => seconds + 20);
        appliedBuff = markBuffUsed(newBuff);
      }

      if (newBuff.id === "fifty_fifty" && currentQuestion) {
        const wrongIndexes = currentQuestion.options
          .map((_, index) => index)
          .filter((index) => index !== currentQuestion.correctAnswer)
          .slice(0, 2);
        setHiddenOptions(wrongIndexes);
        appliedBuff = markBuffUsed(newBuff);
      }

      if (newBuff.id === "retry_wrong") {
        appliedBuff = markBuffUsed(newBuff, { appliedQuestionIndex: currentIndex });
      }

      updatedBuffs.push(appliedBuff);

      updateLivePlayer(player.id, {
        active_buff: appliedBuff,
        buffs: updatedBuffs,
      }).then(setPlayer).catch(console.warn);
    } else if (shouldExpire) {
      const updatedBuffs = syncUsedBuff(player.buffs || [], expiredBuff);
      updateLivePlayer(player.id, {
        active_buff: expiredBuff,
        buffs: updatedBuffs,
      }).then(setPlayer).catch(console.warn);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, room?.status, room?.buffs_enabled]);

  const roomStatusRef = useRef("lobby");
  const playerStatusRef = useRef("lobby");

  useEffect(() => {
    if (room) {
      roomStatusRef.current = room.status;
    }
  }, [room]);

  useEffect(() => {
    if (player) {
      playerStatusRef.current = player.status;
    }
  }, [player]);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const roomData = await getLiveRoom(normalizedRoomCode);
        const playerData = playerToken
          ? await getLivePlayer(normalizedRoomCode, playerToken).catch(() => null)
          : null;
        const playerList = await getLivePlayers(normalizedRoomCode);

        if (!isMounted) return;
        setRoom(roomData);
        setPlayer(playerData);
        setPlayers(playerList);
      } catch (err) {
        setError(err.message || "Không tải được phòng.");
      }
    }

    load();
    const unsubscribe = subscribeLiveRoom(normalizedRoomCode, {
      onRoomChange: (payload) => setRoom(payload.new),
      // Bỏ onPlayersChange ở đây để tránh Player nhận broadcast cập nhật điểm/buff của các người chơi khác,
      // giảm 97%+ lượng tin nhắn Realtime trên gói Free.
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [normalizedRoomCode, playerToken]);

  // Polling lấy danh sách người chơi/bảng xếp hạng định kỳ ở màn hình Chờ (Lobby) và Kết quả (Result)
  // Trong quá trình làm bài thi (playing), effect này hoàn toàn tắt để tránh tốn tài nguyên.
  useEffect(() => {
    if (!room || !player) return;
    const shouldPoll = room.status === "lobby" || room.status === "ended" || player.status === "submitted";
    if (!shouldPoll) return;

    const fetchPlayers = () => {
      getLivePlayers(normalizedRoomCode)
        .then((playerList) => {
          setPlayers(playerList);
          const self = playerList.find((item) => item.player_token === playerToken);
          if (self) setPlayer(self);
        })
        .catch(console.warn);
    };

    fetchPlayers(); // Fetch immediately on status transition

    const interval = setInterval(fetchPlayers, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [room?.status, player?.status, normalizedRoomCode, playerToken]);



  useEffect(() => {
    if (room?.status !== "playing") return;
    setExtraSeconds(0);
    setQuestionStartedAt(Date.now());
    setNowTick(Date.now());
  }, [room?.status]);

  const perQuestionSeconds = room?.config?.perQuestionSeconds || 30;
  const remainingSeconds = useMemo(() => {
    if (room?.status !== "playing") return perQuestionSeconds;
    const elapsed = Math.floor((nowTick - questionStartedAt) / 1000);
    return Math.max(perQuestionSeconds + extraSeconds - elapsed, 0);
  }, [extraSeconds, nowTick, perQuestionSeconds, questionStartedAt, room?.status]);

  const handleSubmit = useCallback(async () => {
    if (!player || player.status === "submitted") return;
    const updatedPlayer = await updateLivePlayer(player.id, {
      status: "submitted",
      submitted_at: new Date().toISOString(),
    });
    setPlayer(updatedPlayer);
  }, [player]);

  useEffect(() => {
    if (room?.status !== "playing" || !player || player.status === "submitted") return;

    const timer = window.setInterval(() => {
      setNowTick(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  });

  useEffect(() => {
    if (room?.status !== "playing" || player?.status === "submitted") return;
    if (remainingSeconds > 0) return;

    if (
      activeBuff?.id === "retry_previous_wrong" &&
      !activeBuff?.completedRetry &&
      activeBuff?.appliedQuestionIndex === currentIndex
    ) {
      handleSubmit();
      return;
    }

    if (currentIndex >= orderedQuestions.length - 1) {
      handleSubmit();
      return;
    }

    setHiddenOptions([]);
    setExtraSeconds(0);
    setQuestionStartedAt(Date.now());
    setNowTick(Date.now());
    setCurrentIndex((index) => Math.min(orderedQuestions.length - 1, index + 1));
  }, [
    currentIndex,
    handleSubmit,
    orderedQuestions.length,
    player?.status,
    remainingSeconds,
    room?.status,
    activeBuff?.id,
    activeBuff?.completedRetry,
    activeBuff?.appliedQuestionIndex,
  ]);

  const handleJoinInline = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const roomData = room || (await getLiveRoom(normalizedRoomCode));
      if (roomData.status === "ended") {
        throw new Error("Phòng này đã kết thúc.");
      }

      const playerList = await getLivePlayers(normalizedRoomCode);
      if (playerList.length >= LIVE_QUIZ_MAX_PLAYERS) {
        throw new Error(`Phòng đã đủ ${LIVE_QUIZ_MAX_PLAYERS} người.`);
      }

      const newToken = generateToken("player");
      const newPlayer = await joinLiveRoom({
        room_code: normalizedRoomCode,
        player_token: newToken,
        name: joinName.trim() || `Người chơi ${playerList.length + 1}`,
        status: roomData.status === "playing" ? "playing" : "lobby",
        question_order: createQuestionOrder(roomData.question_set.length, newToken),
        answers: {},
        score: 0,
        correct_count: 0,
        answered_count: 0,
        total_questions: roomData.question_set.length,
        buffs: [],
      });

      storeToken(LIVE_QUIZ_PLAYER_KEY, normalizedRoomCode, newToken);
      setPlayer(newPlayer);
      navigate(`/live-quiz/play/${normalizedRoomCode}`, { replace: true });
    } catch (err) {
      setError(err.message || "Không vào được phòng.");
    }
  };

  const handleAnswer = async (answerIndex) => {
    if (!player || !currentQuestion || player.status === "submitted") return;
    if (hasAnsweredCurrent && !canRetryCurrentQuestion) return;

    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: answerIndex,
    };

    // Apply double_score buff nếu active cho câu hiện tại
    const shouldUseDouble =
      activeBuff?.id === "double_score" &&
      !activeBuff?.used &&
      activeBuff?.questionIndex === currentIndex;

    // Kết thúc retry nếu đang retry câu này
    const isRetryBuffArmed =
      (activeBuff?.id === "retry_wrong" ||
        activeBuff?.id === "retry_previous_wrong") &&
      activeBuff?.used &&
      !activeBuff?.completedRetry &&
      activeBuff?.appliedQuestionIndex === currentIndex;
    const isRetryAttempt = hasAnsweredCurrent && isRetryBuffArmed;
    const isSpecialRetryAttempt =
      isRetryAttempt && activeBuff?.id === "retry_previous_wrong";
    const shouldHoldForRetry =
      !hasAnsweredCurrent &&
      isRetryBuffArmed &&
      answerIndex !== currentQuestion.correctAnswer;

    const usedBuff = shouldUseDouble
      ? markBuffUsed(activeBuff, { appliedQuestionId: currentQuestion.id })
      : isRetryAttempt
        ? markBuffUsed(activeBuff, {
          completedRetry: true,
          bonusAwarded:
            isSpecialRetryAttempt &&
            answerIndex === currentQuestion.correctAnswer,
          appliedQuestionId: currentQuestion.id,
        })
        : activeBuff;
    const syncedBuffs = syncUsedBuff(player.buffs || [], usedBuff);
    const { score, correctCount } = calculateStats(
      updatedAnswers,
      syncedBuffs,
      shouldUseDouble ? currentQuestion.id : null,
    );

    const answeredCount = Object.keys(updatedAnswers).length;
    const isFinished = answeredCount >= orderedQuestions.length;
    const hasFinalRetryBonus = (player.buffs || []).some(
      (buff) => buff.id === "retry_previous_wrong",
    );
    const firstWrongIndex = orderedQuestions.findIndex((question) => {
      const selected = updatedAnswers[question.id];
      return selected !== undefined && selected !== question.correctAnswer;
    });
    const shouldOfferFinalRetry =
      isFinished &&
      !isRetryAttempt &&
      !hasFinalRetryBonus &&
      firstWrongIndex >= 0;

    if (shouldOfferFinalRetry) {
      const retryQuestion = orderedQuestions[firstWrongIndex];
      const specialBuff = markBuffUsed(
        {
          id: "retry_previous_wrong",
          name: "Bonus sửa sai đặc biệt",
          icon: "bi-arrow-counterclockwise",
          description: "Chọn lại câu sai đầu tiên. Nếu đúng, cộng thêm 200 điểm.",
          questionIndex: currentIndex,
          receivedAt: new Date().toISOString(),
        },
        {
          appliedQuestionIndex: firstWrongIndex,
          appliedQuestionId: retryQuestion.id,
          specialFinalRetry: true,
        },
      );
      const updatedPlayer = await updateLivePlayer(player.id, {
        answers: updatedAnswers,
        score,
        correct_count: correctCount,
        answered_count: answeredCount,
        active_buff: specialBuff,
        buffs: [...(player.buffs || []), specialBuff],
        status: "playing",
      });

      setPlayer(updatedPlayer);
      showBuffToast(specialBuff);
      moveToQuestion(firstWrongIndex);
      return;
    }

    const updatedPlayer = await updateLivePlayer(player.id, {
      answers: updatedAnswers,
      score,
      correct_count: correctCount,
      answered_count: answeredCount,
      active_buff: usedBuff,
      buffs: syncedBuffs,
      status: isFinished && !isSpecialRetryAttempt ? "submitted" : "playing",
      submitted_at:
        isFinished && !isSpecialRetryAttempt
          ? new Date().toISOString()
          : player.submitted_at,
    });

    setPlayer(updatedPlayer);
    if (isSpecialRetryAttempt) {
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = setTimeout(async () => {
        const submittedPlayer = await updateLivePlayer(updatedPlayer.id, {
          status: "submitted",
          submitted_at: new Date().toISOString(),
        });
        setPlayer(submittedPlayer);
      }, 2400);
      return;
    }
    if (!isFinished && !shouldHoldForRetry) {
      scheduleNextQuestion();
    }
  };

  const useBuff = async () => {
    if (!activeBuff || activeBuff.used || !currentQuestion) return;
    const buff = activeBuff;

    if (buff.id === "time_plus") {
      setExtraSeconds((seconds) => seconds + 15);
    }

    if (buff.id === "skip_pressure") {
      setExtraSeconds((seconds) => seconds + 20);
    }

    if (buff.id === "fifty_fifty") {
      const wrongIndexes = currentQuestion.options
        .map((_, index) => index)
        .filter((index) => index !== currentQuestion.correctAnswer)
        .slice(0, 2);
      setHiddenOptions(wrongIndexes);
    }

    if (buff.id === "retry_wrong") {
      // Chỉ gắn cho câu hiện tại - nếu sai sẽ cho phép chọn lại
      const usedB = markBuffUsed(buff, { appliedQuestionIndex: currentIndex });
      const updatedPlayer = await updateLivePlayer(player.id, {
        active_buff: usedB,
        buffs: syncUsedBuff(player.buffs || [], usedB),
      });
      setPlayer(updatedPlayer);
      return;
    }

    if (buff.id === "double_score") {
      // Không mark used ngay - sẽ được apply khi trả lời đúng trong handleAnswer
      return;
    }

    // Cho các buff khác (time_plus, skip_pressure, fifty_fifty) - mark used ngay
    const usedBuff = markBuffUsed(buff);
    const updatedPlayer = await updateLivePlayer(player.id, {
      active_buff: usedBuff,
      buffs: syncUsedBuff(player.buffs || [], usedBuff),
    });
    setPlayer(updatedPlayer);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // --- Buff active display logic ---
  const isBuffActiveForCurrentQuestion =
    activeBuff &&
    !activeBuff.used &&
    !activeBuff.expired &&
    activeBuff.questionIndex === currentIndex;

  // Special: retry_wrong shows as active even after used (waiting for retry answer)
  const isRetryWaiting =
    activeBuff?.id === "retry_wrong" &&
    activeBuff?.used &&
    !activeBuff?.completedRetry &&
    activeBuff?.appliedQuestionIndex === currentIndex;
  const isSpecialFinalRetry =
    activeBuff?.id === "retry_previous_wrong" &&
    activeBuff?.used &&
    !activeBuff?.completedRetry &&
    activeBuff?.appliedQuestionIndex === currentIndex;
  const isSpecialFinalRetryResolved =
    activeBuff?.id === "retry_previous_wrong" &&
    activeBuff?.completedRetry &&
    activeBuff?.appliedQuestionIndex === currentIndex;
  const isSpecialFinalRetryCorrect =
    isSpecialFinalRetryResolved && activeBuff?.bonusAwarded;
  const displaySelectedAnswer = isSpecialFinalRetry ? undefined : selectedAnswer;

  // Special: double_score shows as active (auto-applies on answer)
  const isDoubleActive = false;

  const showBuffButton = false;

  if (error) {
    return (
      <main className="live-quiz-page">
        <div className="live-quiz-shell">
          <div className="live-error">{error}</div>
          <Link className="live-primary-btn" to="/live-quiz">
            Quay lại
          </Link>
        </div>
      </main>
    );
  }

  if (!room) {
    return <main className="live-quiz-page live-loading">Đang tải phòng...</main>;
  }

  if (!player) {
    return (
      <main className="live-quiz-page">
        <div className="live-quiz-shell live-join-inline">
          <Link to="/live-quiz" className="live-home-link">
            <i className="bi bi-arrow-left-circle-fill"></i>
            Live Quiz
          </Link>
          <section className="live-panel">
            <h1>Vào phòng {normalizedRoomCode}</h1>
            <form className="live-form" onSubmit={handleJoinInline}>
              <label>
                Tên của bạn
                <input
                  value={joinName}
                  onChange={(event) => setJoinName(event.target.value)}
                  placeholder="Nhập tên để vào phòng"
                />
              </label>
              <button className="live-primary-btn" type="submit">
                Vào phòng
              </button>
            </form>
          </section>
        </div>
      </main>
    );
  }

  if (room.status === "lobby") {
    return (
      <main className="live-quiz-page">
        <div className="live-quiz-shell">
          <Link to="/live-quiz" className="live-home-link">
            <i className="bi bi-arrow-left-circle-fill"></i>
            Live Quiz
          </Link>
          <section className="live-panel live-waiting">
            <p className="live-eyebrow">Lobby</p>
            <h1>Đang chờ host bắt đầu</h1>
            <p>
              Phòng <strong>{normalizedRoomCode}</strong> hiện có{" "}
              <strong>
                {players.length}/{LIVE_QUIZ_MAX_PLAYERS}
              </strong>{" "}
              người chơi.
            </p>
          </section>
        </div>
      </main>
    );
  }

  if (room.status === "ended" || player.status === "submitted") {
    const myRank = leaderboard.findIndex((item) => item.id === player.id) + 1;

    return (
      <main className="live-quiz-page">
        <div className="live-quiz-shell">
          <section className="live-panel live-result">
            <p className="live-eyebrow">Kết quả</p>
            <h1>Hạng #{myRank || "-"}</h1>
            <p>
            {player.name}: <strong>{player.score || 0} điểm</strong> ·{" "}
              {player.correct_count || 0}/{player.total_questions || 0} câu đúng
            </p>
            <div className="live-leaderboard">
              {leaderboard.map((item, index) => (
                <article key={item.id} className="live-rank-row">
                  <span>#{index + 1}</span>
                  <strong>{item.name}</strong>
                  <small>
                    {item.score || 0}đ · {item.correct_count || 0} đúng
                  </small>
                </article>
              ))}
            </div>
            <Link className="live-primary-btn" to="/live-quiz">
              Về Live Quiz
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="live-quiz-page">
      <div className="live-quiz-shell">
        <section className="live-player-topbar">
          <div>
            <p className="live-eyebrow">{room.room_name}</p>
            <h1>{player.name}</h1>
          </div>
          <div className="live-timer">{formatTime(remainingSeconds)}</div>
        </section>

        {/* === BUFF NOTIFICATION TOAST === */}
        {buffNotification && showBuffNotify && (
          <div
            className={`live-buff-notification ${
              buffNotification.id === "retry_previous_wrong"
                ? "special-final-retry"
                : ""
            }`}
          >
            <div className="live-buff-notification-icon">
              <i className={`bi ${buffNotification.icon}`}></i>
            </div>
            <div className="live-buff-notification-content">
              <strong>🎁 Bạn nhận được Buff!</strong>
              <span>
                <strong>{buffNotification.name}</strong> — {buffNotification.description}
              </span>
              <small className="live-buff-warning">
                ⚠️ Buff chỉ có hiệu lực ở câu hiện tại. Chuyển câu sẽ mất buff!
              </small>
            </div>
          </div>
        )}

        {/* === BUFF ACTIVE BUTTON === */}
        {showBuffButton && (
          <button
            type="button"
            className={`live-buff-toast ${isRetryWaiting ? "retry-waiting" : ""}`}
            onClick={isRetryWaiting ? undefined : useBuff}
            disabled={isRetryWaiting}
          >
            <i className={`bi ${activeBuff.icon}`}></i>
            <span>
              <strong>{activeBuff.name}</strong>
              {isRetryWaiting
                ? "Chọn lại đáp án cho câu này!"
                : activeBuff.description}
              {!isRetryWaiting && (
                <small className="live-buff-warning">
                  Chỉ dùng được ở câu này!
                </small>
              )}
            </span>
            {!isRetryWaiting && (
              <span className="live-buff-use-label">Dùng ngay</span>
            )}
          </button>
        )}

        {/* Double score indicator (auto-apply, no click needed) */}
        {isDoubleActive && (
          <div className="live-buff-indicator double-score">
            <i className="bi bi-stars"></i>
            <span>
              x2 điểm sẽ tự động áp dụng khi bạn trả lời đúng câu này!
              <small className="live-buff-warning">Chỉ áp dụng cho câu hiện tại.</small>
            </span>
          </div>
        )}

        {isSpecialFinalRetryResolved && (
          <div className="live-special-bonus-modal" role="status">
            <div className="live-special-bonus-card">
              <div className="live-special-bonus-badge">
                <i
                  className={`bi ${
                    isSpecialFinalRetryCorrect
                      ? "bi-stars"
                      : "bi-emoji-expressionless-fill"
                  }`}
                ></i>
              </div>
              <p className="live-special-bonus-kicker">Bonus đặc biệt</p>
              <h3>
                {isSpecialFinalRetryCorrect
                  ? "waoo giỏi thế +10đ"
                  : "waooo bạn giỏi quá 1 câu mà sai tận 2 lần"}
              </h3>
              <p className="live-special-bonus-answer">
                Đáp án đúng là{" "}
                <strong>
                  {String.fromCharCode(65 + currentQuestion.correctAnswer)}.{" "}
                  {currentQuestion.options[currentQuestion.correctAnswer]}
                </strong>
              </p>
            </div>
          </div>
        )}

        <section
          className={`live-panel live-question-panel ${
            isSpecialFinalRetry ? "live-special-retry-panel" : ""
          }`}
        >
          <div className="live-question-head">
            <span>
              Câu {currentIndex + 1}/{orderedQuestions.length}
            </span>
            <strong>{player.score || 0} điểm</strong>
          </div>
          <h2>{currentQuestion?.question}</h2>
          {hasAnsweredCurrent && !canRetryCurrentQuestion && !isSpecialFinalRetryResolved && (
            <div
              className={`live-answer-feedback ${
                isCurrentCorrect ? "correct" : "wrong"
              }`}
            >
              <i
                className={`bi ${
                  isCurrentCorrect ? "bi-check-circle-fill" : "bi-x-circle-fill"
                }`}
              ></i>
              <span>
                {isCurrentCorrect ? "Chính xác!" : "Chưa đúng."} Đáp án đúng là{" "}
                <strong>
                  {String.fromCharCode(65 + currentQuestion.correctAnswer)}.{" "}
                  {currentQuestion.options[currentQuestion.correctAnswer]}
                </strong>
              </span>
            </div>
          )}
          {isSpecialFinalRetryResolved && (
            <div
              className={`live-answer-feedback special-retry-result ${
                isSpecialFinalRetryCorrect ? "correct" : "wrong"
              }`}
            >
              <i
                className={`bi ${
                  isSpecialFinalRetryCorrect
                    ? "bi-stars"
                    : "bi-emoji-expressionless-fill"
                }`}
              ></i>
              <span>
                <strong>
                  {isSpecialFinalRetryCorrect
                    ? "waoo giỏi thế +10đ"
                    : "waooo bạn giỏi quá 1 câu mà sai tận 2 lần"}
                </strong>{" "}
                Đáp án đúng là{" "}
                <strong>
                  {String.fromCharCode(65 + currentQuestion.correctAnswer)}.{" "}
                  {currentQuestion.options[currentQuestion.correctAnswer]}
                </strong>
              </span>
            </div>
          )}
          {canRetryCurrentQuestion && (
            <div className="live-answer-feedback retry">
              <i className="bi bi-arrow-counterclockwise"></i>
              <span>
                <strong>
                  {isSpecialFinalRetry ? "Bonus đặc biệt!" : "Gỡ sai!"}
                </strong>{" "}
                {isSpecialFinalRetry
                  ? "Sửa lại câu sai đầu tiên. Trả lời đúng được cộng thêm 200 điểm."
                  : "Hãy chọn lại đáp án cho câu này."}
              </span>
            </div>
          )}
          <div className="live-answer-grid">
            {currentQuestion?.options.map((option, index) => (
              <button
                key={option}
                type="button"
                className={`live-answer-btn ${
                  displaySelectedAnswer === index ? "selected" : ""
                } ${
                  hasAnsweredCurrent &&
                  !canRetryCurrentQuestion &&
                  !isSpecialFinalRetry &&
                  index === currentQuestion.correctAnswer
                    ? "correct"
                    : ""
                } ${
                  hasAnsweredCurrent &&
                  !canRetryCurrentQuestion &&
                  !isSpecialFinalRetry &&
                  displaySelectedAnswer === index &&
                  index !== currentQuestion.correctAnswer
                    ? "wrong"
                    : ""
                }`}
                disabled={
                  hiddenOptions.includes(index) ||
                  (hasAnsweredCurrent && !canRetryCurrentQuestion)
                }
                onClick={() => handleAnswer(index)}
              >
                <span>{String.fromCharCode(65 + index)}</span>
                {hiddenOptions.includes(index) ? "Đã bị ẩn bởi 50/50" : option}
              </button>
            ))}
          </div>
          <div className="live-player-actions">
            <button
              type="button"
              className="live-secondary-btn"
              disabled={currentIndex === 0}
              onClick={() => {
                setHiddenOptions([]);
                setExtraSeconds(0);
                setQuestionStartedAt(Date.now());
                setNowTick(Date.now());
                setCurrentIndex((index) => Math.max(0, index - 1));
              }}
            >
              Câu trước
            </button>
            <button
              type="button"
              className="live-primary-btn"
              onClick={() => {
                setHiddenOptions([]);
                setExtraSeconds(0);
                setQuestionStartedAt(Date.now());
                setNowTick(Date.now());
                setCurrentIndex((index) =>
                  Math.min(orderedQuestions.length - 1, index + 1),
                );
              }}
            >
              Câu tiếp
            </button>
            <button type="button" className="live-danger-btn" onClick={handleSubmit}>
              Nộp bài
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default PlayerQuizPage;
