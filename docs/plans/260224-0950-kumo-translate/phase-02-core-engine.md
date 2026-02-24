# Phase 02: Core Translator Engine (DOM Parser)

## Objective
Nghe sự kiện trong `content_script.js` để tìm ra tất cả các "Text Node" chứa chữ tiếng Nhật mà không phá vỡ (break) HTML gốc. Quản lý trạng thái khi Dịch/Huỷ Dịch.

## Implementation Steps
- [ ] Hàm `walkDOM`: duyệt đệ quy (recursively) toàn bộ body, lọc ra các text nodes hợp lệ (loại bỏ SCRIPT, STYLE).
- [ ] Regex nhận diện tiếng Nhật (`\p{Script=Hiragana}|\p{Script=Katakana}|\p{Script=Han}`).
- [ ] Hàm `replaceText`: Gửi text chứa tiếng Nhật sang Background, nhận text Tiếng Việt và thay vào Node gốc.
- [ ] Thêm tuỳ chọn `MutationObserver`: Lắng nghe AJAX load như trên Google Drive để dịch tiếp nội dung mới sinh ra.
