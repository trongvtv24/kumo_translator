# Phase 01: Thiết lập Extension (Manifest V3) 

## Objective
Tạo bộ khung cấu trúc thư mục chuẩn cho Chrome Extension V3 để có thể load vào Chrome và chạy thử nghiệm (Unpacked Extension).

## Implementation Steps
- [ ] Cấu hình `manifest.json`. Khai báo quyền (permissions) như `activeTab`, `storage`, `scripting`.
- [ ] Gắn file `popup.html`, `popup.css`, `popup.js` vào thư mục src.
- [ ] Tạo file `content_script.js` (chạy trên trang web đích) và `background.js` (service worker).
- [ ] Load extension thử lên Google Chrome để kiểm tra Icon và Popup hoạt động chưa.
