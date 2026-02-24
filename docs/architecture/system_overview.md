# Kiến Trúc Hệ Thống (System Architecture) - KumoTranslate

- **Ngày cập nhật:** 24/02/2026

## 1. Mối Quan Hệ Core Components (Cấu trúc Thư Mục)

KumoTranslate (V3 Manifest Framework):

- `manifest.json`: Tổ chức quyền (`storage`, `activeTab`, `scripting`)
- `src/popup.html + js + css`: Bảng điều khiển Settings (Glassmorphism), đọc/lưu cài đặt bằng `chrome.storage.local`.
- `src/background.js`: Dịch vụ chạy ngầm của Chrome (Service Worker/WebWorker). Giữ trọng trách điều phối việc gửi URL request (fetch data JSON) sang server của Google Translate API (Tránh để trang Web chính phải Fetch API gây lỗi CORS/ CSP chặn kết nối).
- `src/content_script.js + content_style.css`: Bộ não Bot trực tiếp nằm đè lên trang web của nạn nhân (Drive / Amazon JP / v.v). Làm nhiệm vụ duyệt Node HTML, tìm chữ Nhật và sửa giao diện (Replace/ Overlay Tooltip).


## 2. Luồng Xử Lý (Data Flow Dịch Thuật)

1. **Khởi Chạy:** Khi user mở 1 website như `yahoo.jp`, Content Script của Extension lập tức chạy bộ `initTranslation()`.
2. **Dò DOM (Parser):** Hàm đệ quy `walkDOM` cày xới từ ngóc ngách của `<body>`, lấy các Text Node (không lấy Tag), vứt qua bộ lọc Regex (chỉ nhận Hiragana / Katakana / Kanji).
3. **Nối Kênh Giao Tiếp (Message Bridge):** Script gửi message chứa nguyên gốc cụm tiếng Nhật sang Background dưới dạng Promise/Async (`chrome.runtime.sendMessage`). Trạng thái luồng bị khóa nhẹ bằng Cờ `isTranslating` để Observer không bị Loop.
4. **Google Translate Service:** Background lấy data và bắn Fetch GET sang URL của Google (`client=gtx`).
5. **Render (Trả Kết Quả):**
   - **Giữ Giao Diện Rẻ/Mặc định (Replace):** Xoá chữ Kanji, điền Tiếng Việt vào. Bố cục có thể thụt/giãn nhưng Icon và Frame không nát.
   - **Lớp Phủ Nổi Bật (Overlay CSS):** Bổ sung 1 Thẻ bọc `<span class="kumo-overlay-wrapper" data-kumo-translated="Tiếng Việt"> Chữ Nhựt Bổn </span>`. CSS của CSS File sẽ đè Animation 3D bóng kính lên khi Hover. 
6. **Mắt Thần AJAX (MutationObserver):** Khi user cuộn chuột liên tục để SPA (Single Page Application - như Drive) load thêm ảnh và thư mục mới. `MutationObserver` sẽ tự báo Hàm `walkDOM` quét lại đúng các Block vừa sinh ra thay vì Toàn Bộ Web (Tiết kiệm CPU).
