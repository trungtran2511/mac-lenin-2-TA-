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

// SubChapter keywords for Philosophy 2 - Chapter 4 (pages 80-101)
const subChapterKeywords = {
  "4.I": [
    "canh tranh", "doc quyen", "nguyen nhan hinh thanh", "loi nhuan doc quyen", 
    "gia ca doc quyen", "quan he canh tranh", "thau tom", "ap dat", "loi nhuan cao",
    "nguyen nhan", "mac", "angghen", "khung hoang 1873", "tin dung"
  ],
  "4.II": [
    "lenin", "cartel", "cac-ten", "syndicate", "xanh-di-ca", "trust", "ta-rat",
    "consortium", "cong-xooc-xi-om", "tai phiet", "dau so tai chinh", "che do tham du",
    "xuat khau tu ban", "fdi", "dau tu truc tiep", "dau tu gian tiep", "phan chia the gioi",
    "thuoc dia", "chien tranh the gioi", "doc quyen nha nuoc", "cong sinh", "tai san"
  ],
  "4.III": [
    "concern", "consan", "conglomerate", "cong-ga-lo-me-ret", "ve tinh", "gia cong",
    "uy nhiem", "bot", "bt", "toan cau hoa", "khu vuc hoa", "eu", "nafta", "fta",
    "opec", "mercosus", "bien gioi mem", "bien gioi kinh te", "da nguyen", "giai cuu",
    "citigroup", "aig", "vai tro lich su", "tich cuc", "luc luong san xuat",
    "xa hoi hoa", "han che", "chien tranh", "phan hoa giau ngheo", "gioi han lich su",
    "mau thuan co ban", "chu nghia xa hoi"
  ]
};

const classified = quizQuestions.map((q) => {
  const qText = normalize(q.question + " " + q.options.join(" "));
  
  let scores = {};
  Object.keys(subChapterKeywords).forEach(key => {
    scores[key] = 0;
  });
  
  // Scoring based on keywords
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

  // Scoring based on source
  const sourceNorm = normalize(q.source || "");
  if (sourceNorm.includes("4.i") || sourceNorm.includes("muc i")) {
    scores["4.I"] += 45;
  }
  if (sourceNorm.includes("4.ii") || sourceNorm.includes("muc ii")) {
    scores["4.II"] += 45;
  }
  if (sourceNorm.includes("4.iii") || sourceNorm.includes("muc iii")) {
    scores["4.III"] += 45;
  }

  // Distribution based on highest score
  let maxSubChapter = "4.I";
  let maxScore = -1;
  Object.keys(scores).forEach((subCh) => {
    if (scores[subCh] > maxScore) {
      maxScore = scores[subCh];
      maxSubChapter = subCh;
    }
  });

  // If score is too low, keep the default subChapter from generate script
  if (maxScore <= 0 && q.subChapter) {
    maxSubChapter = q.subChapter;
  }

  return {
    ...q,
    chapter: 4,
    subChapter: maxSubChapter
  };
});

// Stats
const stats = {};
classified.forEach((q) => {
  stats[q.subChapter] = (stats[q.subChapter] || 0) + 1;
});
console.log("Phân bố subChapters chi tiết cho Chương 4:", stats);

// Rewrite quizData.js
const fileContent = `export const quizQuestions = ${JSON.stringify(classified, null, 2)};\n`;

fs.writeFileSync(path.join(__dirname, "quizData.js"), fileContent, "utf8");
console.log("Đã cập nhật thành công quizData.js với subChapter phân loại Chương 4!");
