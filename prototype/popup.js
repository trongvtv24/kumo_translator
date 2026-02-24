document.addEventListener('DOMContentLoaded', () => {
    const mainPower = document.getElementById('main-power');
    const statusLabel = document.getElementById('status-label');
    const targetSelector = document.getElementById('target-selector');
    const translateNowBtn = document.getElementById('translate-now-btn');
    const radioInputs = document.querySelectorAll('input[name="translation_mode"]');

    mainPower.addEventListener('change', (e) => {
        const isActive = e.target.checked;
        const statusCard = document.querySelector('.status-card');
        const dotElement = document.querySelector('.dot');
        
        if(isActive) {
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
    });

    targetSelector.addEventListener('click', () => {
        const langCode = targetSelector.querySelector('.lang-code');
        const langName = targetSelector.querySelector('.lang-name');
        if (langCode.textContent === 'VI') {
            langCode.textContent = 'EN';
            langName.textContent = 'Tiếng Anh';
        } else {
            langCode.textContent = 'VI';
            langName.textContent = 'Tiếng Việt';
        }
    });

    translateNowBtn.addEventListener('click', () => {
        const originalText = translateNowBtn.textContent;
        translateNowBtn.textContent = 'Đang Quét...';
        translateNowBtn.style.opacity = '0.8';
        
        setTimeout(() => {
            translateNowBtn.textContent = 'Đã quét xong (34 nodes)';
            translateNowBtn.style.backgroundColor = 'var(--accent-green)';
            
            setTimeout(() => {
                translateNowBtn.textContent = originalText;
                translateNowBtn.style.backgroundColor = 'var(--accent-blue)';
                translateNowBtn.style.opacity = '1';
            }, 2000);
        }, 1500);
    });
});
