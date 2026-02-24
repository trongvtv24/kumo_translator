# Phase 03: Background API Handler

## Objective
Kết nối Extension với dịch vụ Google Translate API (Free endpoint) để mô phỏng và trả về kết quả dịch thuật thực tế cho Content Script.

## Implementation Steps
- [x] Xây dựng hàm gọi Google Translate Free API (`https://translate.googleapis.com/translate_a/single`).
- [x] Xử lý JSON response phức tạp từ Google để trích xuất ra câu chữ Tiếng Việt dịch chuẩn.
- [x] Thêm Delay hoặc Rate Limit căn bản để tránh bị chặn IP khi spam API liên tục lúc cuộn chuột trang web.
- [x] Trả Message (Callback) về cho Content Script.
- [x] Bắt lỗi (Catch) mất mạng hoặc timeout.
