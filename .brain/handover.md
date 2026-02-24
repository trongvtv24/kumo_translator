━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 HANDOVER DOCUMENT (LƯU TRỮ VĨNH VIỄN)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Dự Án: KumoTranslate (Chrome Extension)
🔢 Trạng thái: ĐÃ HOÀN THIỆN MVP (Version 1.0.0)

✅ ĐÃ XONG (6/6 PHASES):
   - Phase 01: Setup Environment & Manifest V3
   - Phase 02: Develop Popup UI (Settings Panel)
   - Phase 03: Core Translator Engine (DOM Parser)
   - Phase 04: Background API Handler
   - Phase 05: Integration & Overlay Mode
   - Phase 06: Testing on SPA (Google Drive, v.v)

⏳ CÒN LẠI (CHO TƯƠNG LAI):
   - Thay thế Google Translate Free (gtx) bằng API tính phí/xịn hơn (DeepL, Azure) nếu Google chặn IP.
   - Thêm tính năng "Blacklist" (Danh sách ngoại trừ các web không muốn dịch).
   - Tối ưu lại Regex tiếng Nhật (nếu cần lọc gắt hơn).
   - Xử lý mảng trả về của Google API cho các câu quá dài (đôi khi mảng bị cắt nhỏ, hiện tại đã nối bằng vòng lặp).

🔧 QUYẾT ĐỊNH QUAN TRỌNG:
   - Dùng Google Translate Free API (endpoint `client=gtx`) để không cần xin API Key.
   - Không đè CSS gốc của Web: Thay vì thay đổi Node, chế độ Overlay chỉ dùng class cấp cao (`.kumo-overlay-wrapper`).
   - Storage Sync: Dùng `chrome.storage.local` để lưu settings tức thời, khi thay đổi sẽ Message tới Content Script để cập nhật biến `currentMode` hoặc quét lại bằng `forceScan`.

⚠️ LƯU Ý CHO SESSION SAU (NẾU CÓ BUG):
   - Cờ `isTranslating` trong `src/content_script.js` RẤT QUAN TRỌNG để chặn `MutationObserver` gọi gọi vòng lặp sập RAM, cẩn thận khi chỉnh sửa delay `setTimeout`.
   - Hàm `containsJapanese` cố tình loại bỏ Text rỗng và Số 123 để giảm Spam WebRequest bắt API Google.
   - Cẩn thận CSS z-index (`2147483647` ở bóng Tooltip Overlay) được đặt max cấu hình chống chèn khung (Overflow:Hidden) trên các Form Web.

📁 FILES QUAN TRỌNG:
   - `docs/BRIEF.md` (Scope + Cốt truyện chính của App)
   - `docs/DESIGN.md` (Luồng Architecture + Case Testing)
   - `.brain/brain.json` (Knowledge vĩnh viễn)
   - `.brain/session.json` (Progress task)
   - `CHANGELOG.md` (Lịch sử sửa code)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Đã lưu! Để tiếp tục với App này: Gõ /recap
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
