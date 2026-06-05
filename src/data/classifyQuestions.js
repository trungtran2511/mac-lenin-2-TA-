import { quizQuestions } from "./quizData.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function normalize(str) {
  if (!str) return "";
  return str.toLowerCase()
    .replace(/á|à|ả|ã|ạ|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/g, "a")
    .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/g, "e")
    .replace(/i|í|ì|ỉ|ĩ|ị/g, "i")
    .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/g, "o")
    .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/g, "u")
    .replace(/y|ý|ỳ|ỷ|ỹ|ỵ/g, "y")
    .replace(/đ/g, "d");
}

// Định nghĩa từ khóa cho 10 phần chi tiết của 3 chương
const subChapterKeywords = {
  // CHƯƠNG I: TRIẾT HỌC VÀ VAI TRÒ CỦA TRIẾT HỌC TRONG ĐỜI SỐNG XÃ HỘI
  "1.I": [
    "the gioi quan", "phuong phap luan", "van de co ban cua triet hoc", "bien chung va sieu hinh",
    "chuc nang cua triet hoc", "nguon goc cua triet hoc", "doi tuong cua triet hoc",
    "Platon", "Aristoteles", "Hy Lap co dai", "than hoc", "phap hoc", "nhan sinh quan", 
    "khai luoc ve triet hoc", "bien chung sieu hinh", "y nghia phuong phap luan"
  ],
  "1.II": [
    "triet hoc mac", "triet hoc mac - lenin", "su ra doi va phat trien", "doi tuong va chuc nang",
    "Hegel", "Feuerbach", "Kant", "tien de ly luan", "tien de khoa hoc", "bo phan cau thanh", 
    "Angghen", "Lenin", "Mac", "doi moi o viet nam", "giai doan lenin"
  ],
  // CHƯƠNG II: CHỦ NGHĨA DUY VẬT BIỆN CHỨNG
  "2.I": [
    "vat chat", "y thuc", "dung im", "van dong", "khong gian", "thoi gian", 
    "nao nguoi", "nao bo", "phan anh", "dinh nghia vat chat", "nguon goc tu nhien",
    "nguon goc xa hoi", "thuoc tinh cua vat chat", "ton tai khach quan", "quan he giua vat chat va y thuc",
    "the gioi vat chat", "ton tai doc lap", "thuoc tinh pho bien", "hinh thuc ton tai", "phuong thuc ton tai"
  ],
  "2.II": [
    "mau thuan", "quy luat", "cai rieng", "cai chung", "cai don nhat", 
    "nguyen nhan", "ket qua", "tat nhien", "ngau nhien", "noi dung", "hinh thuc", 
    "ban chat", "hien tuong", "kha nang", "hien thuc", "luong", "chat", "phu dinh", 
    "buoc nhay", "diem nut", "do", "phu dinh cua phu dinh", "moi lien he pho bien",
    "nguyen ly", "bien chung duy vat", "phuong phap bien chung", "quy luat mau thuan",
    "luong va chat", "lien he pho bien", "su phat trien", "nguyen ly ve moi lien he"
  ],
  "2.III": [
    "nhan thuc", "thuc tien", "chan ly", "cam giac", "tri giac", "bieu toung", 
    "khai niem", "phan doan", "suy luan", "nhan thuc cam tinh", "nhan thuc ly tinh",
    "truc quan sinh dong", "tu duy truu tuong", "tieu chuan cua chan ly", "khach the nhan thuc",
    "chu the nhan thuc", "thuc tien la co so", "vai tro cua thuc tien"
  ],
  // CHƯƠNG III: CHỦ NGHĨA DUY VẬT LỊCH SỬ
  "3.I": [
    "luc luong san xuat", "quan he san xuat", "phuong thuc san xuat", "co so ha tang", 
    "kien truc thuong tang", "hinh thai kinh te", "hinh thai kinh te - xa hoi", 
    "san xuat vat chat la co so", "bien chung giua luc luong", "bien chung giua co so ha tang", 
    "lich su - tu nhien", "tien trinh lich su", "san xuat vat chat"
  ],
  "3.II": [
    "giai cap", "dau tranh giai cap", "dan toc", "bo toc", "bo lac", "gia dinh", "nhan loai",
    "quan he giai cap", "xoa bo giai cap", "lien minh giai cap"
  ],
  "3.III": [
    "nha nuoc", "cach mang xa hoi", "kieu nha nuoc", "chuc nang cua nha nuoc", "ban chat nha nuoc",
    "tien de cach mang", "co hoi cach mang", "nha nuoc chu nô", "nha nuoc phong kien", "nha nuoc tu san"
  ],
  "3.IV": [
    "ton tai xa hoi", "y thuc xa hoi", "tam ly xa hoi", "he tu tuong", "kieu he tu tuong", 
    "y thuc phap quyen", "y thuc dao duc", "y thuc tham my", "y thuc ton giao", "y thuc triet hoc", 
    "tinh doc lap tuong doi cua y thuc"
  ],
  "3.V": [
    "con nguoi", "ban chat con nguoi", "tha hoa", "giai phong con nguoi", "quan he ca nhan va xa hoi",
    "quan chung nhan dan", "lanh tu", "vai tro cua quan chung", "vi tri cua con nguoi"
  ]
};

const classified = quizQuestions.map((q) => {
  const qText = normalize(q.question + " " + q.options.join(" "));
  
  let scores = {};
  Object.keys(subChapterKeywords).forEach(key => {
    scores[key] = 0;
  });
  
  // Chấm điểm theo từ khóa nội dung
  Object.keys(subChapterKeywords).forEach((subCh) => {
    subChapterKeywords[subCh].forEach((kw) => {
      const normKw = normalize(kw);
      if (qText.includes(normKw)) {
        scores[subCh] += 10;
        const regex = new RegExp(normKw, "g");
        const matches = qText.match(regex);
        if (matches) {
          scores[subCh] += matches.length * 5;
        }
      }
    });
  });

  // Chấm điểm phụ theo source (nếu có khớp với các đề mục chuẩn)
  const sourceNorm = normalize(q.source || "");
  
  // 1.I
  if (sourceNorm.includes("khai luoc ve triet hoc") || sourceNorm.includes("van de co ban cua triet hoc") || sourceNorm.includes("bien chung va sieu hinh")) {
    scores["1.I"] += 45;
  }
  // 1.II
  if (sourceNorm.includes("triet hoc mac - lenin va vai tro") || sourceNorm.includes("su ra doi va phat trien cua triet hoc mac") || sourceNorm.includes("doi tuong va chuc nang cua triet hoc mac")) {
    scores["1.II"] += 45;
  }
  // 2.I
  if (sourceNorm.includes("vat chat va y thuc")) {
    scores["2.I"] += 45;
  }
  // 2.II
  if (sourceNorm.includes("phep bien chung duy vat") || sourceNorm.includes("cac quy luat") || sourceNorm.includes("cac pham tru")) {
    scores["2.II"] += 45;
  }
  // 2.III
  if (sourceNorm.includes("ly luan nhan thuc")) {
    scores["2.III"] += 45;
  }
  // 3.I
  if (sourceNorm.includes("hoc thuyet hinh thai") || sourceNorm.includes("san xuat vat chat") || sourceNorm.includes("luc luong san xuat") || sourceNorm.includes("co so ha tang")) {
    scores["3.I"] += 45;
  }
  // 3.II
  if (sourceNorm.includes("giai cap va dan toc")) {
    scores["3.II"] += 45;
  }
  // 3.III
  if (sourceNorm.includes("nha nuoc va cach mang")) {
    scores["3.III"] += 45;
  }
  // 3.IV
  if (sourceNorm.includes("y thuc xa hoi") || sourceNorm.includes("ton tai xa hoi va y thuc xa hoi")) {
    scores["3.IV"] += 45;
  }
  // 3.V
  if (sourceNorm.includes("triet hoc ve con nguoi") || sourceNorm.includes("ban chat con nguoi")) {
    scores["3.V"] += 45;
  }

  // Phân bổ dựa trên điểm số cao nhất
  let maxSubChapter = "1.I";
  let maxScore = -1;
  Object.keys(scores).forEach((subCh) => {
    if (scores[subCh] > maxScore) {
      maxScore = scores[subCh];
      maxSubChapter = subCh;
    }
  });

  // Nếu điểm số quá thấp (bằng 0), gán theo ID hoặc giữ nguyên phân bổ cũ
  if (maxScore <= 0) {
    // Dự phòng dựa trên chapter cũ của câu hỏi
    if (q.chapter === 1) maxSubChapter = "1.I";
    else if (q.chapter === 2) maxSubChapter = "2.I";
    else if (q.chapter === 3) maxSubChapter = "3.I";
    else maxSubChapter = "1.I";
  }

  // Xác định chương lớn (chapter) dựa trên subChapter
  const majorChapter = parseInt(maxSubChapter.split(".")[0]);

  return {
    ...q,
    chapter: majorChapter,
    subChapter: maxSubChapter
  };
});

// Thống kê phân bố
const stats = {};
classified.forEach((q) => {
  stats[q.subChapter] = (stats[q.subChapter] || 0) + 1;
});
console.log("Phân bố subChapters chi tiết:", stats);

// Ghi đè lại file quizData.js
const fileContent = `// Rebuilt and redistributed into 3 chapters and 10 detailed sections based on textbook table of contents.
export const quizQuestions = ${JSON.stringify(classified, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, "quizData.js"), fileContent, "utf8");
console.log("Đã cập nhật thành công quizData.js với subChapter!");
