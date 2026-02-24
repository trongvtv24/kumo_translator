// Background Service cho Extension (Manifest V3)
console.log("KumoTranslate Background: Khởi động API Handler...");

// Lưu trữ trạng thái mặc định (Default Settings)
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        isActive: true,
        targetLanguage: 'vi', // vi hoặc en
        translationMode: 'replace',
        translationCache: {}
    });
    console.log("Cấu hình Storage mặc định đã được thiết lập.");
});

// ==== HÀM GỌI DỊCH THUẬT (GOOGLE TRANSLATE FREE API) ==== //
// Tránh spam API dồn dập, thiết lập hàng chờ nhẹ
const requestQueue = [];
let isProcessingQueue = false;

async function fetchTranslation(text, targetLang = 'vi') {
    // API Miễn phí (Translate URL) của Google. Dùng "client=gtx" để không cần Server Key
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Google API ngắt kết nối (Status: ${response.status})`);
        }

        const data = await response.json();
        // Google trả về 1 mảng lồng nhau. Lấy dữ liệu ở index [0][0][0] thường là kết quả
        let translatedText = "";

        // Cần nối các đoạn câu nếu Google phân tích nó là cụm dài
        if (data && data[0]) {
            data[0].forEach(item => {
                if (item[0]) translatedText += item[0];
            });
        }

        return translatedText || text; // Nếu rỗng thì trả lại text gốc (Tránh làm lỗi mảng HTML)

    } catch (error) {
        console.warn("Lỗi dịch thuật từ Background:", error);
        return text; // Fallback: Trả về chữ tiếng Nhật gốc nếu có sự cố
    }
}

// ==== XỬ LÝ LẮNG NGHE TỪ CONTENT SCRIPT ==== //
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "translate") {
        const originalText = request.text;

        // Lấy cấu hình ngôn ngữ đích (Ví dụ: Từ JP -> VI hay JP -> EN)
        chrome.storage.local.get(['targetLanguage'], async (settings) => {
            const targetLang = settings.targetLanguage || 'vi'; // Mặc định là Tiếng Việt

            // Xử lý Gọi API Đồng bộ
            const translatedResult = await fetchTranslation(originalText, targetLang);

            // Trả về cho Content Script
            sendResponse({ translatedText: translatedResult });
        });

        // QUAN TRỌNG NHẤT: Báo hiệu Chrome rằng `sendResponse` sẽ trả về giá trị ASYNC (Promise)
        // Nếu không có 'return true', Chrome sẽ ngắt luồng và không chờ kết quả từ Fetch API
        return true;
    }
});
