# Group2-AI1901 - Triết học và đời sống

Ứng dụng học tập React/Vite cho môn **Triết học Mác - Lênin**, gồm:

- 📚 Trang nội dung kiến thức theo chủ đề (`/courses`)
- ✅ Quiz luyện tập trắc nghiệm (`/quiz`)
- 🃏 Flip Card Game ôn khái niệm (`/flip`)
- 🔮 Tử vi vui tích hợp Gemini AI (`/tuvi`)
- 🧠 Trắc nghiệm tính cách triết học (`/philosophy-profile`)
- 🎮 **Live Quiz** - chơi quiz real-time nhiều người (`/live-quiz`)

---

## Mục lục

- [Chạy dự án](#chạy-dự-án)
- [Cấu hình API Keys](#cấu-hình-api-keys)
  - [Gemini API Key](#1-gemini-api-key)
  - [Supabase (Realtime Database)](#2-supabase-realtime-database)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Hệ thống Live Quiz](#hệ-thống-live-quiz)
  - [Cách hoạt động](#cách-hoạt-động)
  - [Hệ thống Buff](#hệ-thống-buff)
  - [Database Schema](#database-schema)
  - [Bật Realtime trên Supabase](#bật-realtime-trên-supabase)
- [Deploy](#deploy)
- [Liên hệ](#liên-hệ)

---

## Chạy dự án

```bash
npm install
npm run dev
```

Mở trình duyệt tại `http://localhost:5173`

---

## Cấu hình API Keys

Tạo file `.env` ở thư mục gốc dự án (copy từ `.env.example`):

```bash
cp .env.example .env
```

File `.env` cần 3 biến:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key_here
```

> **Lưu ý**: Sau khi thay đổi `.env`, phải **dừng dev server** rồi chạy lại `npm run dev` để Vite nạp biến mới.

---

### 1. Gemini API Key

**Dùng cho**: Trang Tử vi (`/tuvi`) — gọi Google Gemini AI để sinh nội dung tử vi.

**Cách lấy key**:

1. Vào [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Nhấn **"Create API key"**
3. Chọn hoặc tạo project → copy key dạng `AIzaSy...`
4. Dán vào `.env`:

```env
VITE_GEMINI_API_KEY=AIzaSyC6Cxre.....
```

**Model sử dụng** (tự động fallback nếu model bị quá tải):

| Thứ tự | Model |
|--------|-------|
| 1 | `gemini-2.5-flash-lite` |
| 2 | `gemini-2.5-flash` |
| 3 | `gemini-2.0-flash-lite` |
| 4 | `gemini-2.0-flash` |

**File liên quan**:
- `src/services/geminiService.js` — Service class gọi Gemini API
- `src/pages/Tuvipage.jsx` — Trang sử dụng Gemini

**Lưu ý bảo mật**: Đây là app frontend nên key có thể bị lộ khi deploy public. Nếu dùng lâu dài, nên:
- Đưa phần gọi Gemini qua backend/serverless function
- Giới hạn key theo domain trong Google Cloud Console
- Theo dõi quota trên [Google AI Studio](https://aistudio.google.com/)

---

### 2. Supabase (Realtime Database)

**Dùng cho**: Tính năng **Live Quiz** — lưu phòng chơi, người chơi, đồng bộ real-time qua WebSocket.

**Cách tạo project Supabase**:

1. Vào [Supabase Dashboard](https://supabase.com/dashboard)
2. Nhấn **"New Project"** → chọn tên + mật khẩu database + region
3. Đợi project tạo xong

**Cách lấy key**:

1. Vào project → **Settings** → **API**
2. Copy 2 giá trị:

| Tên | Giá trị | Ghi chú |
|-----|---------|---------|
| **Project URL** | `https://xxxxx.supabase.co` | Dán vào `VITE_SUPABASE_URL` |
| **anon / public key** | `eyJhbGci...` hoặc `sb_publishable_...` | Dán vào `VITE_SUPABASE_PUBLISHABLE_KEY` |

```env
VITE_SUPABASE_URL=https://irfvehdoxnehqgtdmdcy.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_MpTo6P9_NBPov1XKRY6N-Q_c7zk8Ezf
```

> **Quan trọng**: Key `anon/public` là key công khai, an toàn để dùng ở frontend. Bảo mật thực sự nằm ở **Row Level Security (RLS)** policies trên Supabase.

**Tạo bảng database**: Chạy file SQL trong Supabase SQL Editor:

1. Vào Supabase Dashboard → **SQL Editor**
2. Copy nội dung file `supabase/live_quiz_schema.sql`
3. Nhấn **Run** để tạo bảng + policies + realtime

**File liên quan**:
- `src/utils/supabase.js` — Khởi tạo Supabase client
- `src/services/liveQuizService.js` — CRUD + Realtime subscription
- `supabase/live_quiz_schema.sql` — Schema SQL cho database

---

### Bật Realtime trên Supabase

Live Quiz sử dụng **Supabase Realtime** (postgres_changes) để đồng bộ dữ liệu giữa host và player. File SQL đã tự bật, nhưng nếu cần kiểm tra thủ công:

1. Vào Supabase Dashboard → **Database** → **Replication**
2. Bật **Realtime** cho 2 bảng:
   - `live_quiz_rooms`
   - `live_quiz_players`
3. Hoặc chạy SQL:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_quiz_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_quiz_players;
```

Nếu không bật Realtime, Live Quiz vẫn chạy nhưng **không tự đồng bộ** — player phải refresh trang để thấy thay đổi.

---

## Cấu trúc thư mục

```
my-mln-learning/
├── .env                          # API keys (không commit lên git!)
├── .env.example                  # Mẫu file .env
├── index.html                    # HTML entry point
├── vite.config.js                # Cấu hình Vite + proxy
├── vercel.json                   # Config deploy Vercel (SPA rewrite)
├── package.json                  # Dependencies
├── supabase/
│   └── live_quiz_schema.sql      # SQL tạo bảng cho Live Quiz
├── src/
│   ├── App.jsx                   # Router chính
│   ├── main.jsx                  # Entry point React
│   ├── assets/                   # Ảnh, media
│   ├── components/               # Components tái sử dụng
│   ├── data/                     # Dữ liệu câu hỏi, bài học
│   ├── hooks/                    # Custom React hooks
│   ├── layouts/                  # Layout wrappers
│   ├── pages/                    # Trang chính
│   │   ├── HomePage.jsx
│   │   ├── Courses.jsx
│   │   ├── QuizPage.jsx
│   │   ├── QuizResultsPage.jsx
│   │   ├── FlipCardPage.jsx
│   │   ├── Tuvipage.jsx          # Tử vi (dùng Gemini)
│   │   ├── PhilosophyProfilePage.jsx
│   │   └── liveQuiz/             # Live Quiz module
│   │       ├── LiveQuizHomePage.jsx
│   │       ├── HostRoomPage.jsx   # Host tạo + điều khiển phòng
│   │       └── PlayerQuizPage.jsx # Player làm quiz + nhận buff
│   ├── services/
│   │   ├── geminiService.js      # Gọi Google Gemini API
│   │   └── liveQuizService.js    # CRUD + Realtime Supabase
│   ├── styles/                   # CSS files
│   └── utils/
│       ├── supabase.js           # Khởi tạo Supabase client
│       ├── liveQuiz.js           # Logic buff, room, scoring
│       └── quizText.js           # Normalize quiz data
└── dist/                         # Build output
```

---

## Hệ thống Live Quiz

### Cách hoạt động

1. **Host** tạo phòng → nhận mã phòng 6 ký tự (VD: `ABC123`)
2. **Player** nhập mã phòng → vào lobby chờ
3. Host nhấn **Bắt đầu** → tất cả player bắt đầu làm quiz cùng lúc
4. Mỗi câu có **timer đếm ngược** — hết giờ tự chuyển câu
5. Player có thể nhận **buff** ngẫu nhiên trong quá trình chơi
6. Khi tất cả nộp bài hoặc host kết thúc → hiện **bảng xếp hạng**

### Routes

| Route | Mô tả |
|-------|--------|
| `/live-quiz` | Trang chủ — tạo/vào phòng |
| `/live-quiz/host/:roomCode` | Trang host điều khiển |
| `/live-quiz/play/:roomCode` | Trang player làm quiz |

---

### Hệ thống Buff

Buff là các power-up ngẫu nhiên giúp player có lợi thế khi chơi quiz.

#### Các loại buff

| Icon | Tên | ID | Hiệu ứng |
|------|------|-----|-----------|
| 🎯 | Gợi ý 50/50 | `fifty_fifty` | Ẩn 2 đáp án sai trong câu hiện tại |
| ⭐ | Nhân đôi điểm | `double_score` | x2 điểm nếu trả lời đúng câu này |
| ⏰ | Cộng giờ | `time_plus` | Cộng thêm 15 giây cho câu hiện tại |
| 🔄 | Gỡ sai | `retry_wrong` | Cho phép chọn lại nếu trả lời sai câu này |
| 😌 | Bình tĩnh | `skip_pressure` | Cộng thêm 20 giây cho câu hiện tại |
| 🔀 | Đổi gió | `focus_jump` | Nhảy tới một câu chưa trả lời bất kỳ |

#### Quy tắc buff

- **Buff xuất hiện ngay khi vào câu hỏi** (không phải sau khi chọn đáp án)
- **Buff chỉ có hiệu lực ở câu hiện tại** — chuyển câu thì buff mất
- User được thông báo: _"⚠️ Buff chỉ có hiệu lực ở câu hiện tại. Chuyển câu sẽ mất buff!"_

#### Tỉ lệ xuất hiện buff

| Lần nhận buff | Tỉ lệ |
|---------------|--------|
| Lần 1 | **100%** (đảm bảo mỗi người ít nhất 1 buff) |
| Lần 2 | 40% |
| Lần 3 | 10% |
| Lần 4+ | **0%** (tối đa 3 buff/bài) |

#### Logic kỹ thuật

- File: `src/utils/liveQuiz.js` → hàm `maybeCreateBuff(enabled, currentBuff, questionIndex, buffCount)`
- File: `src/pages/liveQuiz/PlayerQuizPage.jsx` → `useEffect` theo dõi `currentIndex` để roll buff
- Buff data lưu trong `player.active_buff` (buff hiện tại) và `player.buffs` (lịch sử buff)

---

### Database Schema

#### Bảng `live_quiz_rooms`

| Cột | Kiểu | Mô tả |
|-----|------|--------|
| `id` | uuid | Primary key |
| `room_code` | text | Mã phòng 6 ký tự (unique) |
| `room_name` | text | Tên phòng |
| `host_name` | text | Tên host |
| `host_token` | text | Token xác thực host |
| `status` | text | `lobby` / `playing` / `ended` |
| `config` | jsonb | Cấu hình (số câu, thời gian, chương...) |
| `question_set` | jsonb | Danh sách câu hỏi |
| `buffs_enabled` | boolean | Bật/tắt hệ thống buff |
| `started_at` | timestamptz | Thời điểm bắt đầu |
| `ended_at` | timestamptz | Thời điểm kết thúc |

#### Bảng `live_quiz_players`

| Cột | Kiểu | Mô tả |
|-----|------|--------|
| `id` | uuid | Primary key |
| `room_code` | text | FK → rooms.room_code |
| `player_token` | text | Token xác thực player |
| `name` | text | Tên player |
| `status` | text | `lobby` / `playing` / `submitted` / `disconnected` |
| `question_order` | jsonb | Thứ tự câu hỏi (shuffle riêng) |
| `answers` | jsonb | `{ questionId: answerIndex }` |
| `score` | integer | Tổng điểm |
| `correct_count` | integer | Số câu đúng |
| `answered_count` | integer | Số câu đã trả lời |
| `total_questions` | integer | Tổng số câu |
| `active_buff` | jsonb | Buff đang active |
| `buffs` | jsonb | Lịch sử tất cả buff nhận được |

---

## Kiểm tra

```bash
npm run lint     # Lint code
npm run build    # Build production
```

---

## Deploy

### Build production

```bash
npm run build
npm run preview
```

Thư mục xuất bản là `dist`.

### Deploy lên Vercel

1. Import repository vào Vercel
2. Framework preset: `Vite`
3. Build command: `npm run build`
4. Output directory: `dist`
5. **Environment Variables** — thêm 3 biến:
   - `VITE_GEMINI_API_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`

### Deploy lên Netlify

1. Import repository vào Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Environment variables: thêm 3 biến như trên
5. Cấu hình SPA rewrite về `index.html` (cho các route `/quiz`, `/live-quiz`...)

---

## Liên hệ

- **Nhóm**: Group2-AI1901
- **Email**: tranduytrung251105@gmail.com
- **Điện thoại**: 0822777349
- **Facebook**: https://www.facebook.com/trung.tran.678726?mibextid=wwXIfr
