# Specification: Redesign MLN Learning Platform to Philosophy 2 (Chapter 4) and Remove Live Quiz

## Requirements

1. **Course Transition**:
   - Change the application from Philosophy 1 (MLN111) to Philosophy 2 / Political Economy (MLN121/122).
   - The core content will focus on **Chapter 4: Cạnh tranh và độc quyền trong nền kinh tế thị trường** (from page 80 to page 101 of the textbook).

2. **Detailed Content Extraction (Pages 80-101)**:
   - Extract theory details from the textbook (`tmp_giao_trinh_full_utf8.txt` pages 80 to 101, corresponding to pages 86 to 107 of the split array).
   - Divide this content into structured topics for `/courses` page:
     - **Chủ đề 1**: Quan hệ giữa cạnh tranh và độc quyền trong nền kinh tế thị trường (Pages 80-87).
     - **Chủ đề 2**: Lý luận của V.I.Lênin về độc quyền và độc quyền nhà nước (Pages 87-95).
     - **Chủ đề 3**: Biểu hiện mới của độc quyền và vai trò lịch sử của chủ nghĩa tư bản (Pages 95-101).
   - Populate `src/data/coursesData.js` and `src/data/textbookTopics.js` with this extracted text.

3. **Question Bank (Quiz)**:
   - Populate `src/data/quizData.js` with a comprehensive set of multiple-choice questions (MCQs) covering pages 80 to 101 of Chapter 4.
   - Include correct answers, options, and explanations.
   - Update `src/data/textbookExplanations.js` and `src/data/classifyQuestions.js` to match the new chapter structure (Chapter 4).
   - Update the UI where chapter/section filters are displayed to reflect Chapter 4 topics.

4. **Live Quiz Removal**:
   - Completely remove the "Live Quiz" feature to simplify the application.
   - Remove references and components from the codebase:
     - Delete `src/pages/liveQuiz/` directory.
     - Delete `src/services/liveQuizService.js`.
     - Delete `src/styles/liveQuiz.css`.
     - Delete `src/utils/liveQuiz.js`.
     - Remove Live Quiz routes and imports from `src/App.jsx`.
     - Remove navigation links and CTA buttons from `src/components/home/CinematicHero.jsx`.
