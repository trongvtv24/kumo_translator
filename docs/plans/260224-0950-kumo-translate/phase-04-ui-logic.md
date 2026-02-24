# Phase 04: Cầu Mạng (Nối Extension UI với Logic Web)

## Objective
Biến giao diện HTML của Popup (tạo ở Phase trước) thành một bảng điều khiển thật sự có tác dụng. Khi người dùng gạt công tắc hay đổi ngôn ngữ, Extension phải lưu lại cấu hình đó bằng Chrome Storage và ra lệnh cho Content Script (đang chạy trên trang Web) thực thi ngay lập tức.

## Implementation Steps
- [x] Hàm khởi tạo: Lấy trạng thái lưu đệm từ `chrome.storage.local` để điều chỉnh hiện trạng các nút bật/tắt trên Popup.
- [x] Bắt sự kiện OnChange: Update lại `storage` khi người dùng nhấn nút Switch Power.
- [x] Bắt sự kiện Toggle: Chuyển đổi ngôn ngữ dịch (Từ Tiếng Việt sang Tiếng Anh) và nhớ lại vào Cache.
- [x] Thiết lập Message Trigger: Bấm quét toàn trang ở Popup sẽ bắn tín hiệu bắt buộc quét lại tất cả chữ Nhật.
