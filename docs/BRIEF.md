# 💡 BRIEF: KumoTranslate (Tiện ích Dịch tiếng Nhật Realtime)

**Ngày tạo:** 24/02/2026
**Loại sản phẩm:** Chrome Extension

---

## 1. VẤN ĐỀ CẦN GIẢI QUYẾT
Người dùng (đặc biệt là người truy cập các trang web, hệ thống web nội bộ toàn tiếng Nhật như Google Drive bản Nhật, các trang thương mại điện tử) gặp khó khăn trong việc hiểu nội dung. Việc copy-paste từng đoạn sang Google Dịch rất mất thời gian và làm gián đoạn luồng công việc.

## 2. GIẢI PHÁP ĐỀ XUẤT
Một Chrome Extension tự động nhận diện chữ tiếng Nhật trên trang web (bao gồm cả các thành phần DOM động) và thực hiện "dịch đè" nội dung ngay tại chỗ sang tiếng Việt hoặc tiếng Anh, giữ nguyên ngữ cảnh và bố cục (layout) của trang gốc.

## 3. ĐỐI TƯỢNG SỬ DỤNG
- **Primary:** Nhân viên văn phòng làm việc với hệ thống/đối tác Nhật Bản.
- **Secondary:** Người mua hàng trên các trang thương mại điện tử Nhật Bản, người học tiếng Nhật.

## 4. NGHIÊN CỨU THỊ TRƯỜNG & ĐIỂM KHÁC BIỆT
### Đối thủ:
| Tên | Điểm mạnh | Điểm yếu |
|-----|-----------|----------|
| Google Translate Extension | Tiện lợi, có sẵn, hỗ trợ dịch toàn trang. | Thường làm vỡ giao diện (layout) của các trang web phức tạp (như dashboard, Google Drive). |
| Rikaikun / Yomichan | Dịch từ vựng chính xác khi hover chuột. | Chỉ dịch từ/cụm từ ngắn, không hiểu toàn bộ câu hoặc văn cảnh, không dịch tự động toàn màn hình. |

### Điểm khác biệt của hệ thống (Unique Selling Points):
- **Smart DOM Replacement:** Chỉ dịch các node chứa văn bản (text nodes) tiếng Nhật, tôn trọng mã HTML xung quanh để hạn chế tối đa việc vỡ layout.
- **Hover-to-Original:** Di chuột (hover) vào cụm từ đã dịch để xem lại bản gốc tiếng Nhật.
- **Hybrid Translate:** Hỗ trợ dịch tự động toàn trang hoặc chỉ dịch vùng được quét (Overlay mode).

## 5. TÍNH NĂNG

### 🚀 Phase 1: MVP (Bắt buộc có để chạy):
- [ ] Bật/tắt trình dịch thuật toàn trang (On/Off Switch).
- [ ] Quét và nhận diện chữ tiếng Nhật (Kana, Kanji) trong DOM.
- [ ] Gọi API Dịch thuật (Google Translate API miễn phí hoặc Azure/DeepL).
- [ ] Ghi đè văn bản đã dịch lên giao diện (DOM Replacement) giữ nguyên cấu trúc HTML.
- [ ] Chọn ngôn ngữ đích (Tiếng Việt / Tiếng Anh).

### 🎁 Phase 2 (Nâng cao trải nghiệm):
- [ ] Tính năng "Hover để dịch": Di chuột vào vùng text tiếng Nhật sẽ hiện Popup nhỏ (Overlay) có chứa bản dịch, thay vì thay thế toàn bộ chữ trên web.
- [ ] Blacklist/Whitelist các trang web không cần dịch (Ví dụ: tắt trên trang youtube.com).
- [ ] Xem lại văn bản gốc khi hover vào đoạn đã dịch.

## 6. ƯỚC TÍNH SƠ BỘ & CÔNG NGHỆ
- **Độ phức tạp:** Trung bình (Khoảng 1 tuần để hoàn thiện bản MVP mượt mà).
- **Kiến trúc:** 
  - `popup.html/css/js`: Giao diện điều khiển.
  - `content_script.js`: Quét và chỉnh sửa DOM trực tiếp trên trang người dùng.
  - `background.js`: Quản lý API và duy trì trạng thái.
- **Rủi ro kỹ thuật:** 
  - Layout của một số trang (đặc biệt là Single Page Applications như Google Drive, React/Vue apps) thay đổi liên tục, cần dùng `MutationObserver` để bắt sự kiện thay đổi DOM và dịch ngay phần mới được load.
  - Giới hạn (Rate limit) của các API dịch thuật miễn phí.

## 7. BƯỚC TIẾP THEO
→ Chạy lệnh `/plan` để lên sơ đồ luồng dữ liệu (Flow) và cấu trúc thư mục Extension chi tiết.
