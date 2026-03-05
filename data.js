document.addEventListener('DOMContentLoaded', () => {
    const dataBody = document.getElementById('dataBody');
    const noDataMessage = document.getElementById('noDataMessage');
    const searchInput = document.getElementById('searchInput');
    const refreshBtn = document.getElementById('refreshBtn');

    // Modal elements
    const editModal = document.getElementById('editModal');
    const editKeyInput = document.getElementById('editKey');
    const editValueInput = document.getElementById('editValue');
    const cancelEditBtn = document.getElementById('cancelEdit');
    const saveEditBtn = document.getElementById('saveEdit');

    let currentData = {};

    function loadData() {
        chrome.storage.local.get(['autoFillData'], (result) => {
            currentData = result.autoFillData || {};
            renderTable();
        });
    }

    function renderTable(filterText = '') {
        const keys = Object.keys(currentData);
        dataBody.innerHTML = '';

        if (keys.length === 0) {
            noDataMessage.classList.remove('hidden');
            return;
        }

        let hasVisibleRows = false;
        filterText = filterText.toLowerCase();

        keys.forEach(key => {
            const value = currentData[key];
            
            // Phân giải key (domain_id/name)
            const parts = key.split('_');
            const domain = parts[0];
            const field = parts.slice(1).join('_'); // Đề phòng field có chứa dấu gạch dưới

            if (key.toLowerCase().includes(filterText) || value.toLowerCase().includes(filterText)) {
                hasVisibleRows = true;
                const tr = document.createElement('tr');
                
                tr.innerHTML = `
                    <td>${domain}</td>
                    <td>${field}</td>
                    <td class="val-cell" title="${value}">${value}</td>
                    <td class="action-buttons">
                        <button class="btn-secondary edit-btn" data-key="${key}">Sửa</button>
                        <button class="btn-danger delete-btn" data-key="${key}">Xóa</button>
                    </td>
                `;
                dataBody.appendChild(tr);
            }
        });

        if (!hasVisibleRows) {
            noDataMessage.textContent = 'Không tìm thấy dữ liệu phù hợp.';
            noDataMessage.classList.remove('hidden');
        } else {
            noDataMessage.classList.add('hidden');
        }

        attachEventListeners();
    }

    function attachEventListeners() {
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const key = e.target.getAttribute('data-key');
                openEditModal(key, currentData[key]);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const key = e.target.getAttribute('data-key');
                if (confirm(`Bạn có chắc muốn xóa dữ liệu của [${key}]?`)) {
                    deleteItem(key);
                }
            });
        });
    }

    function deleteItem(key) {
        delete currentData[key];
        chrome.storage.local.set({ autoFillData: currentData }, () => {
            renderTable(searchInput.value);
        });
    }

    // Modal Logic
    function openEditModal(key, value) {
        editKeyInput.value = key;
        editValueInput.value = value;
        editModal.classList.remove('hidden');
    }

    function closeModal() {
        editModal.classList.add('hidden');
    }

    cancelEditBtn.addEventListener('click', closeModal);

    saveEditBtn.addEventListener('click', () => {
        const key = editKeyInput.value;
        const newValue = editValueInput.value;
        
        currentData[key] = newValue;
        chrome.storage.local.set({ autoFillData: currentData }, () => {
            renderTable(searchInput.value);
            closeModal();
        });
    });

    // Close modal on outside click
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeModal();
        }
    });

    // Search & Refresh
    searchInput.addEventListener('input', (e) => {
        renderTable(e.target.value);
    });

    refreshBtn.addEventListener('click', () => {
        searchInput.value = '';
        loadData();
    });

    // Khởi tạo
    loadData();
});
