# KumoTranslate Changelog

Tất cả những thay đổi nổi bật về hệ thống KumoTranslate được note tại đây.

## [2026-02-24] Mạch Nối Cốt Lõi và Tooltip (V1.0.0-MVP)
### Added
- **Core Engine (Content Script):** Xây dựng bộ quét DOM với `walkDOM` đệ quy để bắt những Node văn bản chứa "Chữ Nhật" và né thẻ nguy hiểm (Script/Style). Cấu hình thêm `MutationObserver` cho Web động như Google Drive.
- **Background API (Service Worker):** Viết module Async/Await fetch từ Google Translate Free API, bọc Error handler và Message Bridge nối Popup và Tab Web. Trả JSON array Data từ Google.
- **Overlay Tooltip (Lớp phủ CSS):** Gắn thuộc tính `data-kumo-translated` bọc bên ngoài văn bản Tiếng Nhật. Thêm CSS Glassmorphism làm bóng kính khi rê chuột Tooltip Tiếng Việt.
- **Popup UI Dashboard:** Sửa UI prototype liên kết `chrome.storage.local` điều hướng Môi trường Dịch/Đích và Bật/Tắt Cờ báo (`initTranslation`/`forceScan`). Cập nhật `manifest.json` load V3 Scripts.
