// Content Script - Bộ phận hoạt động của Translator Engine.
console.log("KumoTranslate Engine: Đã Load lên trang web!");

// ==== BIẾN CẤU HÌNH VÀ GLOBAL ====
let currentMode = "replace";
let extensionActive = true;
let isTranslating = false; // Ngăn chặn loop vô hạn của MutationObserver

// Hệ thống lưu trữ đệm Local (Lịch sử dịch)
const LocalDict = new Map();

// Hàm nhận diện Kanji / Kata / Hira của tiếng Nhật
function containsJapanese(str) {
    if (!str || typeof str !== 'string' || str.trim().length === 0) return false;
    // Lọc ra các cụm từ chỉ có số hoặc kí tự la-tinh để giảm tải API
    const regex = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/;
    return regex.test(str);
}

// ==== GIAI ĐOẠN 1: QUÉT DOM (DOM WALKER) ====
// Hàm đệ quy duyệt qua các Node và tìm Text Node chứa chữ Nhật
function walkDOM(node) {
    // Bỏ qua các thẻ ẩn hoặc script, style, text area (để tránh lỗi edit của người dùng)
    const forbiddenTags = ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'NOSCRIPT', 'CODE'];

    if (node.nodeType === 1 && (forbiddenTags.includes(node.tagName) || (node.classList && node.classList.contains('kumo-overlay-wrapper')))) {
        return;
    }

    // Nếu Node này là 1 khối Text thuần -> Kiểm tra xem có chữ Nhật không
    if (node.nodeType === 3) {
        // Chỉ lấy các text hiển thị, loại trừ whitespace liên tục
        const text = node.nodeValue.trim();

        // 🎯 LỖI TIỀM ẨN CẦN CHÚ Ý: Chống thay đổi Text Rỗng
        if (text.length > 0 && containsJapanese(text)) {
            // Nếu có text và có tiếng Nhật
            processTextNode(node, text);
        }
    } else {
        // Đệ quy chui vào các node con
        const children = node.childNodes;
        for (let i = 0; i < children.length; i++) {
            // Kiểm tra node hợp lệ trong vòng lặp đệ quy lớn (Deep DOM tree)
            walkDOM(children[i]);
        }
    }
}

// Hàm gửi gói tin cho Background xử lý
function processTextNode(textNode, originalText) {
    // 1. Kiểm tra Local Cache trước để chạy nhanh (Tránh Spam API)
    if (LocalDict.has(originalText)) {
        textNode.nodeValue = LocalDict.get(originalText);
        return;
    }

    // 2. Gửi qua Service Background (Message Flow)
    chrome.runtime.sendMessage({ action: "translate", text: originalText }, (response) => {

        // Callback nhận kết quả: Đã nhận dữ liệu từ Background Web Worker chưa?
        if (response && response.translatedText && extensionActive) {

            // Xử lý chống đè Loop của MutationObserver (tắt cờ khi update DOM)
            isTranslating = true;

            // Ghi đè chữ (Mode: Mặc định / Replace)
            if (currentMode === 'replace') {
                // Ghi đè chữ (TextNode) vào trong DOM. Không đụng class và style của HTML Element
                textNode.nodeValue = response.translatedText;
            } else if (currentMode === 'overlay') {
                // Thay vì ghi đè chữ, ta bọc chữ gốc bằng thẻ Nhựa HTML để gắn CSS hiệu ứng (Tooltip)
                const wrapper = document.createElement('span');
                wrapper.className = 'kumo-overlay-wrapper';
                wrapper.textContent = originalText;
                wrapper.setAttribute('data-kumo-translated', response.translatedText);

                // Móc vào DOM thay thế đoạn TextNode cũ
                if (textNode.parentNode) {
                    textNode.parentNode.replaceChild(wrapper, textNode);
                }
            }

            // Lưu vào mảng Dict cache để nhỡ chỗ khác có chữ này thì tái sử dụng
            LocalDict.set(originalText, response.translatedText);

            // setTimeout cực nhỏ (10ms) để nhường luồng render xử lý giao diện xong mới bật cờ quét lại
            setTimeout(() => { isTranslating = false; }, 10);
        }
    });
}

// Khởi chạy Dịch Thuật Đầu Tiên
function initTranslation() {
    if (!extensionActive) return;
    console.log("KumoTranslate: Bắt đầu quét trang...");
    walkDOM(document.body);
}


// ==== GIAI ĐOẠN 2: LẮNG NGHE SỰ THAY ĐỔI TRÊN TRANG MẠNG (Google Drive / SPA) ====
// Dùng MutationObserver để quét DOM mới xuất hiện khi user LoadAjax hoặc Cuộn Chuột (Scrolling)

const observer = new MutationObserver((mutations) => {
    // Flag báo "Tạm ngưng Dịch" do extensionActive đang bị Tắt!
    // Flag isTranslating dùng để chặn vòng lặp (Khi ta thay text DOM, DOM Observer sẽ tự Fire lại mình, gây Loop chết máy)
    if (!extensionActive || isTranslating) return;

    for (let mutation of mutations) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {

                // Quét những thẻ div/li... vừa được render vào body (VD: User tạo folder mới, hoặc lướt xuống dưới trang)
                if (node.nodeType === 1 || node.nodeType === 3) {
                    walkDOM(node);
                }
            });
        }
    }
});


// Cập nhật State từ Chrome Storage ban đầu
// Khi truy cập Extension: Popup/User setting State
// Service Worker Background + Content Script: Read State Sync...
chrome.storage.local.get(['isActive', 'translationMode'], (result) => {
    extensionActive = result.isActive !== undefined ? result.isActive : true;
    currentMode = result.translationMode || "replace";
    console.log(`Cấu hình Kumo: Chế độ [${currentMode}] - Bật [${extensionActive}]`);

    if (extensionActive) {
        // Bắt đầu chạy quét khi vào web
        initTranslation();

        // Bật màn hình theo dõi sự thay đổi DOM Realtime cho Web động SPA:
        observer.observe(document.body, { childList: true, subtree: true });
    }
});

// ==== GIAI ĐOẠN 3: NHẬN TIN NHẮN TỪ POPUP UI BẬT TẮT ====
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "settingUpdated") {
        // Cập nhật lại config ngay khi user đổi nút gạt ở Popup (Chưa Force Scan)
        chrome.storage.local.get(['isActive', 'translationMode'], (result) => {
            extensionActive = result.isActive !== undefined ? result.isActive : true;
            currentMode = result.translationMode || "replace";
            console.log(`[Cập nhật Nóng] Kumo: ${currentMode} - Bật: ${extensionActive}`);
        });
        sendResponse({ status: "ok" });
    } else if (request.action === "forceScan") {
        console.log("KumoTranslate: Ép quét lại toàn trang web!");
        initTranslation();
        sendResponse({ status: "ok" });
    }
    return true; // Báo hiệu luồng Async
});
