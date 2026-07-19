import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { lapDiaBan } from "../utils/lapDiaBan";
import {
  thienCan,
  diaChi,
  canChiNgay,
  ngayThangNam,
  nguHanhNapAm,
  jdFromDate,
  timCuc,
  nguHanh,
} from "../utils/tuviCalculations";
import "../styles/tuvi/TuviPage.css";
import { createGeminiService } from "../services/geminiService";

const TuviPage = () => {
  const [formData, setFormData] = useState({
    hoten: "",
    gioitinh: "nam",
    ngaysinh: new Date().getDate(),
    thangsinh: new Date().getMonth() + 1,
    namsinh: new Date().getFullYear(),
    giosinh: 1,
    muigio: 7,
    amlich: false,
  });

  const [laSo, setLaSo] = useState(null);
  const [luanGiai, setLuanGiai] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

  const geminiServiceRef = useRef(null);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    geminiServiceRef.current = createGeminiService(GEMINI_API_KEY);

  }, [GEMINI_API_KEY]);

  // Khởi tạo Vanta.js effect
  useEffect(() => {
    if (!vantaEffect.current && vantaRef.current && window.VANTA) {
      const isMobile = window.innerWidth <= 768;

      vantaEffect.current = window.VANTA.NET({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: isMobile ? 100.0 : 600.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0x3f51b5,
        backgroundColor: 0x23153c,
        points: 10.0,
        maxDistance: 20.0,
        spacing: 15.0,
      });
    }

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    try {
      const gioiTinh = formData.gioitinh === "nam" ? 1 : -1;
      const duongLich = !formData.amlich;

      const diaBan = lapDiaBan(
        parseInt(formData.ngaysinh),
        parseInt(formData.thangsinh),
        parseInt(formData.namsinh),
        parseInt(formData.giosinh),
        gioiTinh,
        duongLich,
        parseInt(formData.muigio),
      );

      let ngayAm = parseInt(formData.ngaysinh);
      let thangAm = parseInt(formData.thangsinh);
      let namAm = parseInt(formData.namsinh);
      let thangNhuan = 0;

      if (duongLich) {
        const lunar = ngayThangNam(
          ngayAm,
          thangAm,
          namAm,
          duongLich,
          parseInt(formData.muigio),
        );
        ngayAm = lunar[0];
        thangAm = lunar[1];
        namAm = lunar[2];
        thangNhuan = lunar[3];
      }

      const [canNgay, chiNgay] = canChiNgay(
        parseInt(formData.ngaysinh),
        parseInt(formData.thangsinh),
        parseInt(formData.namsinh),
        duongLich,
        parseInt(formData.muigio),
        thangNhuan,
      );

      const chiGioSinh = diaChi[parseInt(formData.giosinh)];
      const jd = jdFromDate(
        parseInt(formData.ngaysinh),
        parseInt(formData.thangsinh),
        parseInt(formData.namsinh),
      );
      let canGioSinh =
        ((((jd - 1) * 2) % 10) + parseInt(formData.giosinh)) % 10;
      if (canGioSinh === 0) canGioSinh = 10;

      const canNam = ((namAm + 6) % 10) + 1;
      const chiNam = ((namAm + 8) % 12) + 1;
      const canThang = ((namAm * 12 + thangAm + 3) % 10) + 1;

      const banMenh = nguHanhNapAm(chiNam, canNam, true);

      const hanhCuc = timCuc(diaBan.cungMenh, canNam);
      const cuc = nguHanh(hanhCuc);

      const menhChu = diaChi[chiNam]?.menhChu || "";
      const thanChu = diaChi[chiNam]?.thanChu || "";

      const thienBanData = {
        ten: formData.hoten,
        today: new Date().toLocaleDateString("vi-VN"),
        ngayDuong: formData.ngaysinh,
        thangDuong: formData.thangsinh,
        namDuong: formData.namsinh,
        ngayAm,
        thangAm,
        namAm,
        thangNhuan,
        canNgay: thienCan[canNgay]?.tenCan || "",
        chiNgay: diaChi[chiNgay]?.tenChi || "",
        canThang: thienCan[canThang]?.tenCan || "",
        chiThang: diaChi[((thangAm + 1) % 12) + 1]?.tenChi || "",
        canNamTen: thienCan[canNam]?.tenCan || "",
        chiNamTen: diaChi[chiNam]?.tenChi || "",
        gioSinh: `${thienCan[canGioSinh]?.tenCan || ""} ${chiGioSinh?.tenChi || ""}`,
        namNu: formData.gioitinh === "nam" ? "Nam" : "Nữ",
        amDuongNamSinh: chiNam % 2 === 1 ? "Dương" : "Âm",
        amDuongMenh: "",
        banMenh: banMenh || "",
        tenCuc: cuc.tenCuc || "",
        menhChu,
        thanChu,
        sinhKhac: "",
      };

      setLaSo({
        thapNhiCung: diaBan.thapNhiCung,
        thienBan: thienBanData,
      });

      setLuanGiai(null); // Clear luận giải cũ
      setError(null); // Clear lỗi cũ
    } catch (error) {
      console.error("Lỗi khi lập lá số:", error);
      alert("Có lỗi xảy ra khi lập lá số. Vui lòng kiểm tra lại thông tin!");
    }
  };

  const createPrompt = () => {
    const tb = laSo.thienBan;
    const cungData = Object.values(laSo.thapNhiCung)
      .filter((c) => c && c.cungSo !== 0)
      .map((cung) => {
        const chinhTinh = cung.cungSao
          .filter((s) => s.saoLoai === 1)
          .map((s) => `${s.saoTen}${s.saoDacTinh ? ` (${s.saoDacTinh})` : ""}`)
          .join(", ");

        return `- ${cung.cungTen} (${cung.cungChu}): ${chinhTinh || "Không có sao chính"}`;
      })
      .join("\n");

    return `Bạn là chuyên gia tử vi Tử Vi Đẩu Số kết hợp cố vấn kinh tế và quản trị chiến lược doanh nghiệp/cá nhân. Hãy đóng vai trò là "Cố vấn Kinh tế & Quản trị rủi ro Cạnh tranh", sử dụng kiến thức Tử Vi và các lý thuyết kinh tế học trong "Chương 4: Cạnh tranh và độc quyền trong nền kinh tế thị trường" (Triết học Mác - Lênin) để phân tích, luận giải chi tiết lá số sau cho người xem là sinh viên hoặc người đi làm:

**THÔNG TIN BÁT TỰ:**
- Họ tên: ${tb.ten}
- Giới tính: ${tb.namNu}
- Năm sinh: ${tb.canNamTen} ${tb.chiNamTen} (${tb.amDuongNamSinh})
- Tháng sinh: ${tb.canThang} ${tb.chiThang}${tb.thangNhuan === 1 ? " (nhuận)" : ""}
- Ngày sinh: ${tb.canNgay} ${tb.chiNgay}
- Giờ sinh: ${tb.gioSinh}
- Bản mệnh: ${tb.banMenh}
- Cục: ${tb.tenCuc}
- Mệnh chủ: ${tb.menhChu}
- Thân chủ: ${tb.thanChu}

**12 CUNG VÀ SAO CHÍNH:**
${cungData}

Hãy luận giải theo đúng cấu trúc sau (viết bằng tiếng Việt, kết hợp khéo léo thuật ngữ tử vi và thuật ngữ kinh tế học Chương 4 như: quy luật giá trị, giá trị thặng dư, cạnh tranh tự do, độc quyền, lợi thế so sánh, trì trệ độc quyền, thị phần năng lực, v.v.):

## 1. TỔNG QUAN XU HƯỚNG CẠNH TRANH CỦA BẢN MỆNH
Dựa trên Bản mệnh, Cục và các cung Mệnh/Thân, hãy phân tích xu hướng hành vi của người này trong môi trường làm việc: Họ có xu hướng năng động thích ứng cạnh tranh tự do (luôn cải tiến bản thân, học hỏi nhanh) hay có xu hướng xây dựng vị thế độc quyền riêng biệt (tập trung vào chuyên môn hóa sâu, nắm giữ bí quyết độc quyền để chiếm ưu thế)?

## 2. LỢI THẾ CẠNH TRANH TRÊN THỊ TRƯỜNG LAO ĐỘNG
Dựa vào cung Mệnh và cung Quan Lộc (sự nghiệp), hãy phân tích "sức lao động" và "giá trị thặng dư" cá nhân. Đâu là "lợi thế so sánh" (vũ khí cạnh tranh cốt lõi) giúp người này chiếm lĩnh "thị phần" lớn trong ngành nghề của họ?

## 3. NHẬN DIỆN NGUY CƠ ĐỘC QUYỀN VÀ SỰ TRÌ TRỆ
Dựa vào cung Tài Bạch (tài lộc) và cung Tật Ách (rủi ro/yếu điểm), hãy cảnh báo những thói quen hay điểm yếu có thể dẫn đến sự trì trệ độc quyền cá nhân (ví dụ: tự mãn khi đạt vị thế an toàn, bảo thủ không chịu đổi mới công nghệ bản thân, hoặc bị chèn ép bởi các thế lực độc quyền lớn hơn).

## 4. CHIẾN LƯỢC TỐI ƯU HÓA LỢI NHUẬN & TÍCH LŨY CÁ NHÂN
Đưa ra lời khuyên chiến lược cụ thể dựa trên Quy luật giá trị và Quy luật cạnh tranh của Chương 4. Làm thế nào để họ liên tục đổi mới, phát huy thế mạnh của lá số, vượt qua các rào cản độc quyền thị trường để tối đa hóa hiệu quả tích lũy tài sản và sự nghiệp vững chắc.

Lưu ý: 
- Viết văn phong chuyên nghiệp, vừa học thuật vừa thực tế, mang tính khuyến khích và hướng nghiệp cao.
- Độ dài khoảng 1000-1200 từ.
- Tránh các giải thích huyền bí mê tín dị đoan quá đà, tập trung liên kết với hành vi thực tế và tư duy kinh tế.`;
  };

  const createLocalLuanGiai = (
    reason = "Gemini API key chưa được cấu hình",
  ) => {
    const tb = laSo.thienBan;
    const allCung = Object.values(laSo.thapNhiCung);
    const findCung = (name) => allCung.find((cung) => cung?.cungTen === name);
    const topStars = (cung) =>
      cung?.cungSao
        ?.filter((sao) => sao.saoLoai === 1)
        .map((sao) => sao.saoTen)
        .slice(0, 4)
        .join(", ") || "không có chính tinh nổi bật";

    return `## 1. TỔNG QUAN XU HƯỚNG CẠNH TRANH CỦA BẢN MỆNH
Lá số của ${tb.ten || "người xem"} có bản mệnh ${tb.banMenh || "chưa xác định"} và cục ${tb.tenCuc || "chưa xác định"}. Bản mệnh này cho thấy xu hướng hành vi mang tính thích ứng, sẵn sàng đối diện với sức ép cạnh tranh của thị trường lao động. Tuy nhiên, mức độ sẵn sàng cạnh tranh tự do hay hướng tới xây dựng rào cản độc quyền cá nhân phụ thuộc lớn vào việc tự rèn luyện kỹ năng cốt lõi. Đây là bản luận giải cục bộ vì lý do: ${reason}.

## 2. LỢI THẾ CẠNH TRANH TRÊN THỊ TRƯỜNG LAO ĐỘNG
Cung Mệnh có các sao chính: ${topStars(findCung("Mệnh"))}. Cung Quan Lộc sở hữu: ${topStars(findCung("Quan Lộc"))}. Sức lao động cá nhân của bạn chứa đựng những giá trị tiềm năng lớn. Để chiếm lĩnh "thị phần lao động", bạn cần cụ thể hóa lợi thế từ các sao này thành các kỹ năng thực tế chuyên sâu nhằm tạo ra năng suất vượt trội so với mức trung bình xã hội.

## 3. NHẬN DIỆN NGUY CƠ ĐỘC QUYỀN VÀ SỰ TRÌ TRỆ
Cung Tài Bạch có: ${topStars(findCung("Tài Bạch"))}. Ở góc độ kinh tế học Chương 4, độc quyền không kiểm soát sẽ sinh ra sự trì trệ kỹ thuật và bảo thủ. Rủi ro của bạn là việc dễ bằng lòng với vị trí hiện tại hoặc thiếu chủ động học tập các công nghệ mới, dẫn đến việc hao hụt sức cạnh tranh trước những nhân sự trẻ trung, năng động hơn.

## 4. CHIẾN LƯỢC TỐI ƯU HÓA LỢI NHUẬN & TÍCH LŨY CÁ NHÂN
Bạn nên vận dụng Quy luật giá trị để liên tục tiết kiệm thời gian lao động cá biệt, gia tăng hàm lượng trí tuệ trong công việc. Thay vì trốn tránh cạnh tranh hoặc mong chờ một môi trường độc quyền bảo hộ, hãy chủ động liên kết, đổi mới phương thức làm việc và không ngừng nâng cấp bản thân để vượt qua các rào cản từ thị trường.`;
  };

  const isGeminiFallbackError = (message = "") => {
    const normalizedMessage = message.toLowerCase();
    return (
      normalizedMessage.includes("quá tải") ||
      normalizedMessage.includes("chạm giới hạn") ||
      normalizedMessage.includes("quota") ||
      normalizedMessage.includes("429") ||
      normalizedMessage.includes("503")
    );
  };

  const generateLuanGiai = async () => {
    if (!laSo) {
      return;
    }

    const apiStatus = geminiServiceRef.current?.getApiKeyStatus();
    if (!geminiServiceRef.current || !apiStatus?.isValid) {
      setLuanGiai(createLocalLuanGiai("Gemini API key chưa được cấu hình"));
      setError(null);
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const prompt = createPrompt();

      const response = await geminiServiceRef.current.generateResponse(prompt);

      setLuanGiai(response);
    } catch (err) {
      console.error("❌ Lỗi:", err);
      if (isGeminiFallbackError(err.message)) {
        setLuanGiai(
          createLocalLuanGiai(
            "Gemini đang quá tải hoặc API key đã chạm giới hạn sử dụng",
          ),
        );
        setError(
          "Gemini đang quá tải hoặc hết quota, nên hệ thống đang hiển thị bản luận giải cục bộ. Bạn có thể thử lại sau ít phút.",
        );
        return;
      }
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderCung = (cung) => {
    if (!cung || cung.cungSo === 0) return null;

    const chinhTinh = cung.cungSao.filter((s) => s.saoLoai === 1);
    const saoTot = cung.cungSao.filter(
      (s) => s.vongTrangSinh === 0 && s.saoLoai !== 1 && s.saoLoai < 10,
    );
    const saoXau = cung.cungSao.filter(
      (s) => s.vongTrangSinh === 0 && s.saoLoai !== 1 && s.saoLoai > 10,
    );
    const trangSinh = cung.cungSao.find((s) => s.vongTrangSinh === 1);

    return (
      <>
        <div className="grid cung-top">
          <div
            className="col col-2 tooltips"
            title={`Địa chi cung ${cung.cungTen}`}
          >
            {cung.cungTen}
          </div>
          <div className="col col-8" style={{ whiteSpace: "nowrap" }}>
            <span className="cungChu">{cung.cungChu}</span>
            {cung.cungThan && <span className="cungThan label">Thân</span>}
          </div>
          <div
            className="col col-2 tooltips"
            title={`Đại hạn ${cung.cungDaiHan} - ${cung.cungDaiHan + 9}`}
          >
            {cung.cungDaiHan}
          </div>
        </div>

        <div className="grid cung-middle">
          <div className="chinhTinh">
            <ul>
              {chinhTinh.map((sao, idx) => (
                <li key={idx} className={sao.cssSao}>
                  {sao.saoTen} {sao.saoDacTinh && `(${sao.saoDacTinh})`}
                </li>
              ))}
            </ul>
          </div>

          <div className="phuTinh">
            <div className="saotot">
              {saoTot.map((sao, idx) => (
                <div key={idx} className="grid">
                  <div className={`col ${sao.cssSao}`}>
                    {sao.saoTen} {sao.saoDacTinh && `(${sao.saoDacTinh})`}
                  </div>
                </div>
              ))}
            </div>
            <div className="saoxau">
              {saoXau.map((sao, idx) => (
                <div key={idx} className="grid">
                  <div className={sao.cssSao}>
                    {sao.saoTen} {sao.saoDacTinh && `(${sao.saoDacTinh})`}
                  </div>
                </div>
              ))}
            </div>
            <div className="tuanTriet">
              {cung.trietLo && <span className="label label-triet">Triệt</span>}
              {cung.tuanTrung && <span className="label label-tuan">Tuần</span>}
            </div>
          </div>
        </div>

        <div className="grid cung-bottom">
          <div
            className="col col-3 tooltips"
            title={`Tiểu hạn của năm ${cung.cungTieuHan}`}
          >
            {cung.cungTieuHan}
          </div>
          {trangSinh && (
            <div className={`col col-6 ${trangSinh.cssSao}`}>
              {trangSinh.saoTen}
            </div>
          )}
          <div
            className="col col-3 tooltips"
            title={`Cung (${cung.cungAmDuong === -1 ? "âm" : "dương"}), ngũ hành ${cung.hanhCung}`}
          >
            {cung.cungAmDuong === -1 ? "-" : "+"}
            {cung.hanhCung}
          </div>
        </div>
      </>
    );
  };

  const renderThienBan = () => {
    if (!laSo) return null;
    const tb = laSo.thienBan;

    return (
      <div className="noidung">
        <div className="header">Ngày xem: {tb.today}</div>

        <div className="grid">
          <div className="col col-3 cotTrai">Họ tên</div>
          <div className="col col-9 cotPhai">{tb.ten}</div>
        </div>

        <div className="grid">
          <div className="col col-3 cotTrai">Bát tự</div>
          <div className="col col-9 cotPhai">
            Năm {tb.canNamTen} {tb.chiNamTen}, tháng {tb.canThang} {tb.chiThang}
            {tb.thangNhuan === 1 && " (nhuận)"}, ngày {tb.canNgay} {tb.chiNgay},
            giờ {tb.gioSinh}
          </div>
        </div>

        <div className="grid">
          <div className="col col-3 cotTrai">Tuổi</div>
          <div className="col col-9 cotPhai">
            {tb.amDuongNamSinh} {tb.namNu} ({tb.amDuongMenh})
          </div>
        </div>

        <div className="grid">
          <div className="col col-3 cotTrai">Ngày sinh</div>
          <div className="col col-9 cotPhai">
            <div>
              {tb.ngayDuong}/{tb.thangDuong}/{tb.namDuong} (Dương lịch)
            </div>
            <div>
              {tb.ngayAm}/{tb.thangAm}/{tb.canNamTen} {tb.chiNamTen} (Âm lịch)
            </div>
          </div>
        </div>

        <div className="grid">
          <div className="col col-3 cotTrai">Bản mệnh</div>
          <div className="col col-9 cotPhai">{tb.banMenh}</div>
        </div>

        <div className="grid">
          <div className="col col-3 cotTrai">Cục</div>
          <div className="col col-9 cotPhai">{tb.tenCuc}</div>
        </div>

        <div className="grid">
          <div className="col col-3 cotTrai">Mệnh chủ</div>
          <div className="col col-9 cotPhai">{tb.menhChu}</div>
        </div>

        <div className="grid">
          <div className="col col-3 cotTrai">Thân chủ</div>
          <div className="col col-9 cotPhai">{tb.thanChu}</div>
        </div>

        <div className="grid sinhkhac">{tb.sinhKhac}</div>

        <div className="mausac">
          <div className="grid">
            <span className="col col-2">Màu sắc</span>
            <span className="col col-2 hanhKim gioithieuhanh">Kim</span>
            <span className="col col-2 hanhThuy gioithieuhanh">Thủy</span>
            <span className="col col-2 hanhHoa gioithieuhanh">Hỏa</span>
            <span className="col col-2 hanhTho gioithieuhanh">Thổ</span>
            <span className="col col-2 hanhMoc gioithieuhanh">Mộc</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="tuvi-container-wrapper" ref={vantaRef}>
      <div className="masthead">
        <div className="container-2">
          <Link to="/">
            <button className="back-home">
              <span className="text">Quay trở lại </span>
            </button>
          </Link>
          <h1 className="wordmark">Mời bạn Lập lá số tử vi</h1>
          <div className="formborder tuvi-form-panel">
            <form
              id="lstv"
              className="tuvi-lookup-form"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="tuvi-form-topline">
                <span>Thông tin lá số</span>
                <strong>Đẩu số tham khảo</strong>
              </div>

              <div className="tuvi-form-grid">
                <div className="tuvi-field tuvi-field-wide">
                  <span className="tuvi-field-label">Họ tên</span>
                  <input
                    type="text"
                    name="hoten"
                    id="hoten"
                    aria-label="Họ tên"
                    value={formData.hoten}
                    onChange={handleChange}
                  />
                </div>

                <div className="tuvi-field">
                  <span className="tuvi-field-label">Giới tính</span>
                  <select
                    name="gioitinh"
                    id="gioitinh"
                    aria-label="Giới tính"
                    value={formData.gioitinh}
                    onChange={handleChange}
                  >
                    <option value="nam">Nam</option>
                    <option value="nu">Nữ</option>
                  </select>
                </div>

                <div className="tuvi-field tuvi-field-date">
                  <span className="tuvi-field-label">Ngày tháng năm sinh</span>
                  <div className="tuvi-date-grid">
                    <select
                      name="ngaysinh"
                      id="ngaysinh"
                      aria-label="Ngày sinh"
                      value={formData.ngaysinh}
                      onChange={handleChange}
                    >
                      {[...Array(31)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    <select
                      name="thangsinh"
                      id="thangsinh"
                      aria-label="Tháng sinh"
                      value={formData.thangsinh}
                      onChange={handleChange}
                    >
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    <select
                      name="namsinh"
                      id="namsinh"
                      aria-label="Năm sinh"
                      value={formData.namsinh}
                      onChange={handleChange}
                    >
                      {Array.from(
                        { length: 100 },
                        (_, i) => new Date().getFullYear() - i,
                      ).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="tuvi-field tuvi-check-field">
                  <input
                    type="checkbox"
                    name="amlich"
                    aria-label="Âm lịch"
                    checked={formData.amlich}
                    onChange={handleChange}
                  />
                  <span>Âm lịch</span>
                </div>

                <div className="tuvi-field">
                  <span className="tuvi-field-label">Giờ sinh</span>
                  <select
                    name="giosinh"
                    id="giosinh"
                    aria-label="Giờ sinh"
                    value={formData.giosinh}
                    onChange={handleChange}
                  >
                    <option value="1">Tí (23g - 1g)</option>
                    <option value="2">Sửu (1g - 3g)</option>
                    <option value="3">Dần (3g - 5g)</option>
                    <option value="4">Mão (5g - 7g)</option>
                    <option value="5">Thìn (7g - 9g)</option>
                    <option value="6">Tị (9g - 11g)</option>
                    <option value="7">Ngọ (11g - 13g)</option>
                    <option value="8">Mùi (13g - 15g)</option>
                    <option value="9">Thân (15g - 17g)</option>
                    <option value="10">Dậu (17g - 19g)</option>
                    <option value="11">Tuất (19g - 21g)</option>
                    <option value="12">Hợi (21g - 23g)</option>
                  </select>
                </div>

                <div className="tuvi-field">
                  <span className="tuvi-field-label">Múi giờ</span>
                  <select
                    name="muigio"
                    id="muigio"
                    aria-label="Múi giờ"
                    value={formData.muigio}
                    onChange={handleChange}
                  >
                    <option value="-12">-12</option>
                    <option value="-11">-11</option>
                    <option value="-10">-10</option>
                    <option value="-9">-9</option>
                    <option value="-8">-8</option>
                    <option value="-7">-7</option>
                    <option value="-6">-6</option>
                    <option value="-5">-5</option>
                    <option value="-4">-4</option>
                    <option value="-3">-3</option>
                    <option value="-2">-2</option>
                    <option value="-1">-1</option>
                    <option value="0">0</option>
                    <option value="1">+1</option>
                    <option value="2">+2</option>
                    <option value="3">+3</option>
                    <option value="4">+4</option>
                    <option value="5">+5</option>
                    <option value="6">+6</option>
                    <option value="7">+7 (Vietnam)</option>
                    <option value="8">+8</option>
                    <option value="9">+9</option>
                    <option value="10">+10</option>
                    <option value="11">+11</option>
                  </select>
                </div>
              </div>

              <div className="tuvi-submit-row">
                <input
                  type="button"
                  className="button primary"
                  value="Lập lá số"
                  id="laplaso"
                  onClick={handleSubmit}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
      {laSo && (
        <div className="container my-5 tuvi-result-container">
          <div className="card shadow-lg rounded-4 tuvi-chart-card">
            <div
              className="card-body p-5 rounded-4 tuvi-chart-body"
              style={{
                boxShadow: `
                  0 0 10px rgba(255,255,255,.6),
                  0 0 25px rgba(120,150,255,.8),
                  0 0 50px rgba(120,150,255,1),
                  0 0 80px rgba(120,150,255,1)
                `,
              }}
            >
              <div
                className="anlaso laso"
                id="laso"
                style={{ display: "block" }}
              >
                <div className="grid">
                  <div className="col col-3">
                    <div className="container-2">
                      <div
                        className="grid diaCung border-bottom"
                        data-cung-id="6"
                        id="cungTy5"
                      >
                        {renderCung(laSo.thapNhiCung[6])}
                      </div>
                      <div
                        className="grid diaCung border-bottom"
                        data-cung-id="5"
                        id="cungThin"
                      >
                        {renderCung(laSo.thapNhiCung[5])}
                      </div>
                      <div
                        className="grid diaCung border-bottom inset-border"
                        data-cung-id="4"
                        id="cungMao"
                      >
                        {renderCung(laSo.thapNhiCung[4])}
                      </div>
                      <div
                        className="grid diaCung"
                        data-cung-id="3"
                        id="cungDan"
                      >
                        {renderCung(laSo.thapNhiCung[3])}
                      </div>
                    </div>
                  </div>

                  <div className="col col-6">
                    <div className="container-2">
                      <div className="grid">
                        <div
                          className="col col-6 diaCung border-left"
                          data-cung-id="7"
                          id="cungNgo"
                        >
                          {renderCung(laSo.thapNhiCung[7])}
                        </div>
                        <div
                          className="col col-6 diaCung border-left"
                          data-cung-id="8"
                          id="cungMui"
                        >
                          {renderCung(laSo.thapNhiCung[8])}
                        </div>
                      </div>

                      <div
                        className="grid thienBan border-top border-left border-bottom border-right"
                        id="thienBan"
                      >
                        {renderThienBan()}
                      </div>

                      <div className="grid">
                        <div
                          className="col col-6 diaCung border-left"
                          data-cung-id="2"
                          id="cungSuu"
                        >
                          {renderCung(laSo.thapNhiCung[2])}
                        </div>
                        <div
                          className="col col-6 diaCung border-left"
                          data-cung-id="1"
                          id="cungTy1"
                        >
                          {renderCung(laSo.thapNhiCung[1])}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col col-3">
                    <div className="container-2">
                      <div
                        className="grid diaCung border-left border-bottom"
                        data-cung-id="9"
                        id="cungThan"
                      >
                        {renderCung(laSo.thapNhiCung[9])}
                      </div>
                      <div
                        className="grid diaCung border-bottom"
                        data-cung-id="10"
                        id="cungDau"
                      >
                        {renderCung(laSo.thapNhiCung[10])}
                      </div>
                      <div
                        className="grid diaCung border-bottom"
                        data-cung-id="11"
                        id="cungTuat"
                      >
                        {renderCung(laSo.thapNhiCung[11])}
                      </div>
                      <div
                        className="grid diaCung border-left"
                        data-cung-id="12"
                        id="cungHoi"
                      >
                        {renderCung(laSo.thapNhiCung[12])}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* PHẦN MỚI: Luận giải tự động */}
          <div className="tuvi-reading-panel mt-4">
            <div className="tuvi-reading-header">
              <div>
                <p className="tuvi-reading-kicker">Luận giải Cạnh tranh & Độc quyền (Chương 4)</p>
                <h3>
                  <i className="bi bi-briefcase-fill me-2"></i>
                  Cố vấn Kinh tế & Năng lực Cạnh tranh
                </h3>
              </div>
            </div>
            <div className="tuvi-reading-body">
              {!luanGiai && !isAnalyzing && (
                <div className="tuvi-reading-empty">
                  <p>
                    Nhấn nút bên dưới để AI phân tích lá số của bạn dưới góc nhìn cạnh tranh và độc quyền kinh tế của Chương 4.
                  </p>
                  <button
                    className="tuvi-reading-btn"
                    onClick={generateLuanGiai}
                  >
                    <i className="bi bi-cpu me-2"></i> Tạo luận giải kinh tế
                  </button>
                </div>
              )}

              {isAnalyzing && (
                <div className="tuvi-reading-loading">
                                    <div
                    className="spinner-border"
                    role="status"
                  >
                    <span className="visually-hidden">Đang phân tích...</span>
                  </div>
                  <p>
                    <i className="bi bi-sparkles me-2"></i>
                    AI đang phân tích lá số và lập chiến lược cạnh tranh cho bạn, vui lòng chờ...
                  </p>
                </div>
              )}

              {error && (
                <div
                  className="tuvi-reading-error"
                  role="alert"
                >
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              {luanGiai && (
                <div className="luan-giai-content">
                  {luanGiai.split("\n").map((para, i) => {
                    // Xử lý heading (## )
                    if (para.startsWith("## ")) {
                      return (
                        <h4
                          key={i}
                          className="tuvi-reading-section-title"
                        >
                          {para.replace("## ", "")}
                        </h4>
                      );
                    }
                    // Xử lý paragraph bình thường
                    if (para.trim()) {
                      return (
                        <p
                          key={i}
                          className="tuvi-reading-paragraph"
                        >
                          {para}
                        </p>
                      );
                    }
                    return null;
                  })}

                  <div className="tuvi-reading-note">
                    <p>
                      <i className="bi bi-info-circle me-2"></i>
                      <strong>Lưu ý:</strong> Luận giải này được tích hợp góc nhìn lý thuyết Chương 4 Triết học 2 và phân tích lá số bởi AI. Kết quả mang tính chất gợi ý định hướng học tập, sự nghiệp và tư duy kinh tế.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TuviPage;
