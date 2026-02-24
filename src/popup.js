document.addEventListener('DOMContentLoaded', () => {
    const mainPower = document.getElementById('main-power');
    const statusLabel = document.getElementById('status-label');
    const targetSelector = document.getElementById('target-selector');
    const langCode = targetSelector.querySelector('.lang-code');
    const langName = targetSelector.querySelector('.lang-name');
    const translateNowBtn = document.getElementById('translate-now-btn');
    const statusCard = document.querySelector('.status-card');
    const dotElement = document.querySelector('.dot');
    const radioInputs = document.querySelectorAll('input[name="translation_mode"]');

    // MỘT CHÚT HELPER: Hàm gửi sự kiện "Thay đổi thông số" để Web reload lại quét
    function notifyContentScriptToReload() {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs && tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "settingUpdated" });
            }
        });
    }

    // 1. NGAY LÚC USER BẬT POPUP LÊN: Tải dữ liệu đệm ra
    chrome.storage.local.get(['isActive', 'targetLanguage', 'translationMode'], (settings) => {
        // Cập nhật CÔNG TẮC CHÍNH
        const isActive = settings.isActive !== undefined ? settings.isActive : true;
        mainPower.checked = isActive;
        updatePowerUI(isActive);

        // Cập nhật NGÔN NGỮ ĐÍCH
        const tLang = settings.targetLanguage || 'vi'; // vi hoặc en
        if (tLang === 'vi') {
            langCode.textContent = 'VI';
            langName.textContent = 'Tiếng Việt';
        } else {
            langCode.textContent = 'EN';
            langName.textContent = 'Tiếng Anh';
        }

        // Cập nhật RADIO MODE (Replace / Overlay)
        const tMode = settings.translationMode || 'replace';
        radioInputs.forEach(radio => {
            if (radio.value === tMode) radio.checked = true;
        });
    });

    // Hàm đổi mầu giao diện CSS (Để tái sử dụng)
    function updatePowerUI(isActive) {
        if (isActive) {
            statusCard.style.opacity = '1';
            dotElement.classList.add('pulse');
            dotElement.style.backgroundColor = 'var(--accent-green)';
            statusLabel.textContent = 'Đang dịch toàn trang';
            statusLabel.style.color = 'var(--accent-green)';
        } else {
            statusCard.style.opacity = '0.6';
            dotElement.classList.remove('pulse');
            dotElement.style.backgroundColor = '#666';
            statusLabel.textContent = 'Đã tạm dừng';
            statusLabel.style.color = '#A0A0A0';
        }
    }

    // 2. KHI TƯƠNG TÁC BẬT TẮT NÚT NGUỒN CHÍNH
    mainPower.addEventListener('change', (e) => {
        const isActive = e.target.checked;
        updatePowerUI(isActive);

        // Lưu lại ngay!
        chrome.storage.local.set({ isActive: isActive }, () => {
            // Khi lưu xong báo Content Script F5 phát cho mượt
            notifyContentScriptToReload();
        });
    });

    // 3. KHI CLICK ĐỔI NGÔN NGỮ
    targetSelector.addEventListener('click', () => {
        let newLang = 'vi';
        if (langCode.textContent === 'VI') { // Hiện đang là tiếng Việt thì qua Anh
            newLang = 'en';
            langCode.textContent = 'EN';
            langName.textContent = 'Tiếng Anh';
        } else {
            newLang = 'vi';
            langCode.textContent = 'VI';
            langName.textContent = 'Tiếng Việt';
        }

        // Lưu lại thay đổi
        chrome.storage.local.set({ targetLanguage: newLang });
    });

    // 4. CHUYỂN ĐỔI KIỂU DỊCH "GHI ĐÈ" HAY LÀ "LỚP PHỦ"
    radioInputs.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const newMode = e.target.value;
            chrome.storage.local.set({ translationMode: newMode }, () => {
                notifyContentScriptToReload();
            });
        });
    });

    // 5. NÚT TRIGGER "Rescan" 
    translateNowBtn.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            // Nếu có trang web được mở hiện tại
            if (tabs && tabs[0]) {
                const originalText = translateNowBtn.textContent;
                translateNowBtn.textContent = 'Lệnh quét phát đi...';
                translateNowBtn.style.opacity = '0.8';

                // Bắn pháo sáng yêu cầu quét lại DOM
                chrome.tabs.sendMessage(tabs[0].id, { action: "forceScan" }, (response) => {
                    // Update UI hoàn tất cho ảo dịu
                    setTimeout(() => {
                        translateNowBtn.textContent = 'Đã ép quét lại!';
                        translateNowBtn.style.backgroundColor = 'var(--accent-green)';

                        setTimeout(() => {
                            translateNowBtn.textContent = originalText;
                            translateNowBtn.style.backgroundColor = 'var(--accent-blue)';
                            translateNowBtn.style.opacity = '1';
                        }, 2000);
                    }, 500);
                });
            }
        });
    });
});
