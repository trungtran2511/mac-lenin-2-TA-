# Kế hoạch thực hiện: Chuyển đổi sang Triết 2 (Chương 4) và Loại bỏ Live Quiz (Cập Nhật)

**Nhánh Git**: `001-phi2-chapter4-redesign` | **Ngày lập**: 2026-07-19 | **Đặc tả**: [spec.md](file:///D:/DemoCodeTriet/my-mln-learning2-TuanAnh/specs/009-integrate-ai-planners/spec.md)

Kế hoạch này chi tiết hóa việc chuyển đổi ứng dụng từ môn "Triết học Mác-Lênin 1" sang "Triết học Mác-Lênin 2" (cụ thể là Chương 4: *Cạnh tranh và độc quyền trong nền kinh tế thị trường*, từ trang 80 đến trang 101 của giáo trình). 

## Các điểm bổ sung quan trọng từ người dùng:
1. **Bộ câu hỏi trắc nghiệm**: Tạo đúng **100 câu hỏi trắc nghiệm** phong phú và chi tiết cho riêng Chương 4.
2. **Các chức năng giữ lại**: Đảm bảo tất cả chức năng cốt lõi hoạt động hoàn hảo với nội dung Chương 4:
   - **Trang chủ (Home)**
   - **Bài học (Lessons/Courses)**
   - **Quiz ôn tập**
   - **Memory Lab (Thẻ lật/Flip Card)**
3. **Giữ nguyên giao diện**: Giữ nguyên bố cục giao diện hiện tại của ứng dụng, chỉ thay đổi các tiêu đề, văn bản, và nhãn hiển thị để phù hợp với Chương 4 (không thay đổi cấu trúc CSS hay layout).
4. **Loại bỏ Live Quiz**: Loại bỏ hoàn toàn tính năng Live Quiz khỏi menu và mã nguồn.

---

## Extension Hooks (Tùy chọn tự động hóa)

**Mã lệnh (Tùy chọn)**: git
Lệnh chạy: `/speckit-git-commit`
Mô tả: Tự động commit các thay đổi sau khi lập kế hoạch xong

Câu hỏi: Commit plan changes?
Cách thực hiện: Gõ `/speckit-git-commit`

---

## Tóm tắt các thay đổi dữ liệu (Chương 4: Trang 80-101)

Chúng ta chia nội dung Chương 4 thành 3 chủ đề tương tự như cấu trúc giáo trình để hiển thị trên trang bài học và phân loại câu hỏi:
- **Chủ đề 1**: Quan hệ giữa cạnh tranh và độc quyền trong nền kinh tế thị trường (Trang 80-87)
  - Khái niệm độc quyền, độc quyền nhà nước.
  - Nguyên nhân hình thành độc quyền.
  - Tác động của độc quyền.
  - Quan hệ cạnh tranh ở trạng thái độc quyền.
- **Chủ đề 2**: Lý luận của V.I.Lênin về độc quyền và độc quyền nhà nước (Trang 87-95)
  - 5 đặc điểm kinh tế cơ bản của độc quyền (tích tụ sản xuất, tư bản tài chính, xuất khẩu tư bản, phân chia thế giới về kinh tế, phân chia thế giới về lãnh thổ).
  - Sự hình thành và đặc điểm của độc quyền nhà nước.
- **Chủ đề 3**: Biểu hiện mới của độc quyền và vai trò lịch sử của chủ nghĩa tư bản (Trang 95-101)
  - Các biểu hiện mới của độc quyền (Conglomerate, Consortium...) và độc quyền nhà nước.
  - Vai trò lịch sử tích cực của chủ nghĩa tư bản (giải phóng lực lượng sản xuất, xã hội hóa sản xuất).

---

## Các thay đổi đề xuất trong mã nguồn

### 1. Cập nhật dữ liệu (Data)

#### [MODIFY] [coursesData.js](file:///D:/DemoCodeTriet/my-mln-learning2-TuanAnh/src/data/coursesData.js)
- Cập nhật danh sách chủ đề bài học để thể hiện 3 chủ đề lớn của Chương 4 (thay thế 12 chủ đề của Triết 1).

#### [MODIFY] [textbookTopics.js](file:///D:/DemoCodeTriet/my-mln-learning2-TuanAnh/src/data/textbookTopics.js)
- Ghi đè bằng nội dung lý thuyết chi tiết Chương 4 trích xuất trực tiếp từ trang 80-101 của giáo trình.

#### [MODIFY] [quizData.js](file:///D:/DemoCodeTriet/my-mln-learning2-TuanAnh/src/data/quizData.js)
- **Tạo mới 100 câu hỏi trắc nghiệm** bám sát lý thuyết Chương 4 (trang 80-101). Các câu hỏi sẽ có đầy đủ các mức độ khó dễ và phân chia đều theo 3 chủ đề của chương.

#### [MODIFY] [textbookExplanations.js](file:///D:/DemoCodeTriet/my-mln-learning2-TuanAnh/src/data/textbookExplanations.js)
- Ghi đè bằng phần giải thích chi tiết trích dẫn từ giáo trình cho cả 100 câu hỏi mới này.

#### [MODIFY] [philosophyQuotes.js](file:///D:/DemoCodeTriet/my-mln-learning2-TuanAnh/src/data/philosophyQuotes.js)
- Cập nhật các câu trích dẫn nổi tiếng về kinh tế, cạnh tranh và độc quyền từ Mác, Ăng-ghen, Lênin.

#### [MODIFY] [classifyQuestions.js](file:///D:/DemoCodeTriet/my-mln-learning2-TuanAnh/src/data/classifyQuestions.js)
- Cập nhật quy tắc phân loại dựa trên từ khóa của Chương 4 (phần 4.I, 4.II, 4.III).

---

### 2. Bộ định tuyến & Giao diện trang chủ (UI)

#### [MODIFY] [App.jsx](file:///D:/DemoCodeTriet/my-mln-learning2-TuanAnh/src/App.jsx)
- Xóa các định tuyến (Route) của Live Quiz.

#### [MODIFY] [CinematicHero.jsx](file:///D:/DemoCodeTriet/my-mln-learning2-TuanAnh/src/components/home/CinematicHero.jsx)
- Xóa mục điều hướng "Live Quiz" khỏi `NAV_ITEMS`.

#### [MODIFY] [MainContent.jsx](file:///D:/DemoCodeTriet/my-mln-learning2-TuanAnh/src/components/home/MainContent.jsx)
- Giữ nguyên bố cục trang chủ nhưng cập nhật phần giới thiệu "Triết Profile" và các nhãn chữ để phù hợp với nội dung kinh tế chính trị Chương 4.

---

### 3. Xóa bỏ các tệp Live Quiz dư thừa

#### [DELETE] [HostRoomPage.jsx](file:///D:/DemoCodeTriet/my-mln-learning2-TuanAnh/src/pages/liveQuiz/HostRoomPage.jsx)
#### [DELETE] [LiveQuizHomePage.jsx](file:///D:/DemoCodeTriet/my-mln-learning2-TuanAnh/src/pages/liveQuiz/LiveQuizHomePage.jsx)
#### [DELETE] [PlayerQuizPage.jsx](file:///D:/DemoCodeTriet/my-mln-learning2-TuanAnh/src/pages/liveQuiz/PlayerQuizPage.jsx)
#### [DELETE] [liveQuizService.js](file:///D:/DemoCodeTriet/my-mln-learning2-TuanAnh/src/services/liveQuizService.js)
#### [DELETE] [liveQuiz.css](file:///D:/DemoCodeTriet/my-mln-learning2-TuanAnh/src/styles/liveQuiz.css)
#### [DELETE] [liveQuiz.js](file:///D:/DemoCodeTriet/my-mln-learning2-TuanAnh/src/utils/liveQuiz.js)
#### [DELETE] [live_quiz_schema.sql](file:///D:/DemoCodeTriet/my-mln-learning2-TuanAnh/supabase/live_quiz_schema.sql)

---

## Kế hoạch kiểm thử & Xác thực

### Kiểm thử tự động
- Chạy `npm run build` để kiểm tra biên dịch không có lỗi.
- Chạy `npm run lint` to check format.

### Kiểm thử thủ công
- Xác thực xem toàn bộ 100 câu hỏi trong Quiz hoạt động mượt mà.
- Kiểm tra nội dung bài học ở mục bài học `/courses` và thẻ lật `/flip`.
