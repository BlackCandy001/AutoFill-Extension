document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('toggleExtension');
    const statusLabel = document.getElementById('statusLabel');
    const dataCount = document.getElementById('dataCount');
    const clearBtn = document.getElementById('clearData');

    // Load trạng thái hiện tại
    chrome.storage.local.get(['extensionEnabled', 'autoFillData'], (result) => {
        const isEnabled = result.extensionEnabled !== false;
        toggle.checked = isEnabled;
        updateLabel(isEnabled);

        const data = result.autoFillData || {};
        dataCount.textContent = Object.keys(data).length;
    });

    // Xử lý bật/tắt
    toggle.addEventListener('change', () => {
        const isEnabled = toggle.checked;
        chrome.storage.local.set({ extensionEnabled: isEnabled }, () => {
            updateLabel(isEnabled);
            
            // Gửi tin nhắn tới content script của tab hiện tại để cập nhật tức thì
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0]) {
                    chrome.tabs.sendMessage(tabs[0].id, { 
                        action: "updateStatus", 
                        enabled: isEnabled 
                    });
                }
            });
        });
    });

    // Xóa dữ liệu
    clearBtn.addEventListener('click', () => {
        if (confirm('Bạn có chắc chắn muốn xóa toàn bộ dữ liệu đã lưu?')) {
            chrome.storage.local.set({ autoFillData: {} }, () => {
                dataCount.textContent = '0';
                alert('Đã xóa toàn bộ dữ liệu.');
            });
        }
    });

    // Xem & Quản lý dữ liệu
    document.getElementById('viewData').addEventListener('click', () => {
        chrome.tabs.create({ url: chrome.runtime.getURL('data.html') });
    });

    // Điền dữ liệu ngẫu nhiên
    document.getElementById('fillFake').addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "fillFakeData" }, () => {
                    // Đợi tin nhắn được gửi đi rồi mới đóng popup
                    window.close();
                });
            }
        });
    });

    function updateLabel(isEnabled) {
        statusLabel.innerHTML = `Trạng thái: <strong>${isEnabled ? 'Bật' : 'Tắt'}</strong>`;
    }
});
