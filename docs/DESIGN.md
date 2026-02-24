# 🎨 DESIGN: KumoTranslate

**Ngày tạo:** 24/02/2026
**Dựa trên:** `docs/BRIEF.md` và `docs/plans/260224-0950-kumo-translate/plan.md`

---

## 1. MÔ PHỎNG KIẾN TRÚC EXTENSION (Lưu Text/Cache)

Mặc dù Extension không có "Database" to như một dự án phần mềm có sẵn DB Server, nhưng chúng ta cần lưu trữ dữ kiện ở 2 nơi: Cache cục bộ của bản dịch và Setting mà người dùng cấu hình:

```mermaid
graph TD
    A[Người Dùng Bấm Nút] -->|Bật/Tắt Extension| B(chrome.storage.local)
    B -->|Lưu Tuỳ Chọn Ngôn Ngữ, Chế Độ| C{Cấu Hình}
    
    D[Google Translate API / Free API] -->|Bản dịch Text| E(Cache Lục Bộ)
    E -->|Map: Hash(OriginalText) = TranslatedText| F(Content Script)
```

**Mô tả:**
- **Chrome Storage:** Lưu xem người dùng dịch qua Tiếng Anh hay Tiếng Việt (VN/EN), chọn chế độ "Đè văn bản" hay "Lớp phủ màn hình" (Overlay).
- **API Cache map:** Để hạn chế tối đa việc gọi API bị chặn, sau khi dịch xong cụm `こんにちは` thành `Xin chào`, hệ thống tự lưu lại. Lần sau trình duyệt tự hiện luôn chữ `Xin chào` mà không gọi API nữa.

---

## 2. LUỒNG HOẠT ĐỘNG (DOM PARSER ENGINE)

Đây là hành trình kĩ thuật dưới nền của **KumoTranslate**, đặc biệt khi phân tích file trên màn hình của Google Drive.

📍 **Luồng Dưới Nền (Hoạt động hoàn toàn tự động):**
1️⃣ **DOM Loading:** Khi Google Drive tải trang (Ví dụ: tên folder "カレー202504" xuất hiện), MutationObserver trong `content_script.js` phát hiện một phần tử mới xuất hiện.
2️⃣ **Quét & Lọc (Traverse Filter):** 
   - Nó chạy xuyên qua các node. Nếu là ảnh, thẻ `<style>`, `<script>`: Đi qua.
   - Nếu là "TextNode", dùng Regex: (Kana/Kanji) xem có tiếng Nhật không.
3️⃣ **Gửi Text (Messaging):** Text node tiếng Nhật được bọc lại và phân mảnh, gửi sang `background.js` (nơi xử lý gọi API).
4️⃣ **Background Service gọi API:** 
   - Kiểm tra xem câu này dịch chưa (Cache)?
   - Nếu chưa: Gửi Request qua Server Dịch Thuật.
   - Nếu đã dịch: Lấy luôn chữ Tiếng Việt.
5️⃣ **Thay Thế Thông Minh:** 
   - Chế độ **Replace (Thay thế):** TextNode góc bị trỏ bởi câu Tiếng Việt mới.
   - Chế độ **Overlay (Lớp Phủ):** Original Node được gắn CSS hover. Khi lia chuột, Popup dịch hiện lên.

---

## 3. CHECKLIST KIỂM TRA (ACCEPTANCE CRITERIA)

Dưới đây là các tiêu chí đánh giá KumoTranslate đã hoạt động tốt hay chưa:

### Tính năng: Dịch Động (Mutation Observer Translate)
✅ **Cơ bản:**
- [ ] Mở Popup bật Status "Đang dịch", tên thư mục/file có chữ tiếng Nhật trên màn hình phải biến thành Tiếng Việt.
- [ ] Chuyển sang trang khác, Extension vẫn hoạt động.

✅ **Nâng cao (Chống nát giao diện):**
- [ ] Việc xoá chữ tiếng nhật và thay bằng Tiếng Việt không được làm vỡ khối (Box) Button hoặc Link.
- [ ] Khi kéo cuộn chuột (Lazy load trên Google Drive), thư mục xuất hiện lần 2 tự động được dịch ngay mà không chờ F5 trang web.

### Tính năng: UI Popup (Giao diện người dùng)
✅ **Chức năng thao tác:**
- [ ] Bấm Nút Nguồn: Trạng thái Text thay đổi giữa "Đang dịch toàn trang" và "Tạm dừng".
- [ ] Bấm vào Nút chọn ngôn ngữ đích: Chữ 'VI' thành 'EN' (Tiếng Việt đổi sang Tiếng Anh).

---

## 4. TEST CASES (Kế Hoạch Kiểm Thử)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**TC-01: Auto Translate Web Content**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Given: Người dùng truy cập Google Drive tiếng Nhật, Nút Nguồn Extension = BẬT.
When:  Trang HTML render xong các thẻ chứa chữ tiếng Nhật.
Then:  ✓ Chữ "エビフライカレー" tự động biến thành "Cà ri tôm chiên".
       ✓ Size icon file và màu sắc font chữ file. không bị biến đổi CSS.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**TC-02: Change Overlay Mode (Lớp phủ Tooltip)**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Given: Người dùng bật chế độ Overlay Mode ở Popup và F5 lại trang Drive.
When:  Di chuột vào chữ "チーズカレー".
Then:  ✓ Chữ gốc trên Drive giữ nguyên tiếng Nhật.
       ✓ Xuất hiện một Popup bóng kính nhỏ ở gần con trỏ chuột hiện nội dung "Ca-ri Phô Mai".

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**TC-03: Offline Action Prevention**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Given: User Load trang web trong lúc bị rớt cáp mạng.
When:  Text node gọi hàm API lên Background.
Then:  ✓ Cố gắng bắt Try-Catch trên Background và không làm treo Chrome.
       ✓ Hiển thị lại đúng chữ tiếng Nhật gốc như cũ.
