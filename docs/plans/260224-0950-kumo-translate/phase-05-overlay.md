# Phase 05: Tính Năng Lớp Phủ (Tooltip Overlay)

## Objective
Hiện thực hóa tính năng "Overlay Mode" - Khi người dùng di chuột vào chữ tiếng Nhật, bản dịch sẽ hiện lên dưới dạng một Tooltip (bóng kính) nhỏ, giữ nguyên chữ gốc của trang web.

## Implementation Steps
- [x] Cập nhật `content_script.js` để có thể ghi đè TextNode bằng thẻ `<span>` chứa class phục vụ Hover Tooltip (thay vì ghi đè chữ thô như cũ).
- [x] Thêm file CSS (`content_style.css`) để trang trí cho bóng kính tooltip hiện lên sao cho thật đẹp và không bị vỡ bố cục gốc.
- [x] Cập nhật `manifest.json` để load file CSS vào mọi trang web.
- [x] Xử lý Message Lắng Năng Hành Động từ Popup gạt nút "Ép quét lại web" (`forceScan`).
