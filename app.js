document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'api.php';

    // State
    let rules = [];
    let header = '';
    let editIndex = -1;
    let deleteIndex = -1;

    // DOM Elements
    const rulesList = document.getElementById('rules-list');
    const searchInput = document.getElementById('search-input');
    const noResults = document.getElementById('no-results');

    // Modal elements
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    const modalTitle = document.getElementById('modal-title');
    const ruleInput = document.getElementById('rule-input');
    const extractHostCheck = document.getElementById('extract-host');
    const autoSyntaxCheck = document.getElementById('auto-syntax');
    const addImportantCheck = document.getElementById('add-important');
    const rulePreview = document.getElementById('rule-preview').querySelector('code');
    const modalError = document.getElementById('modal-error');
    const confirmBtn = document.getElementById('confirm-btn');

    // Delete Modal elements
    const deleteModal = document.getElementById('delete-modal');
    const deleteModalContent = document.getElementById('delete-modal-content');
    const deleteRuleText = document.getElementById('delete-rule-text');

    // --- DATA FETCHING ---
    async function loadRules() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            rules = data.rules || [];
            header = data.header || '';
            renderRules();
        } catch (error) {
            console.error('Error loading rules:', error);
            showError('Error al cargar las reglas.');
        }
    }

    async function sendRequest(body) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const result = await response.json();
            if (result.success) {
                rules = result.data.rules;
                header = result.data.header;
                renderRules();
                return true;
            } else {
                throw new Error(result.error || 'Unknown error');
            }
        } catch (error) {
            console.error('API Error:', error);
            showError(error.message);
            return false;
        }
    }

    // --- RENDERING ---
    function renderRules(filter = '') {
        rulesList.innerHTML = '';
        const filteredRules = rules.filter(rule => rule.toLowerCase().includes(filter.toLowerCase()));

        if (filteredRules.length === 0) {
            noResults.classList.remove('hidden');
            rulesList.classList.add('hidden');
        } else {
            noResults.classList.add('hidden');
            rulesList.classList.remove('hidden');
        }

        filteredRules.forEach((rule) => {
            const index = rules.indexOf(rule);
            const div = document.createElement('div');
            div.className = 'flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-gray-700';
            div.innerHTML = `
                <div class="flex items-center min-w-0">
                    <span class="text-gray-500 mr-4 text-sm">${index + 1}.</span>
                    <span class="text-white break-all truncate" title="${rule}">${rule}</span>
                </div>
                <div class="flex items-center gap-2 flex-shrink-0 ml-4">
                    <button class="edit-btn text-gray-400 hover:text-white transition" data-index="${index}" title="Editar">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"></path></svg>
                    </button>
                    <button class="delete-btn text-gray-400 hover:text-red-500 transition" data-index="${index}" title="Eliminar">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </div>
            `;
            rulesList.appendChild(div);
        });
    }

    // --- MODAL HANDLING ---
    function openModal(type, index = -1) {
        editIndex = index;
        modal.classList.remove('hidden');
        setTimeout(() => {
            modalContent.classList.remove('opacity-0', 'scale-95');
            ruleInput.focus();
        }, 10);

        if (type === 'add') {
            modalTitle.textContent = 'Agregar Nueva Regla';
            confirmBtn.textContent = 'Agregar';
            confirmBtn.className = 'bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition';
            ruleInput.value = '';
        } else {
            modalTitle.textContent = 'Editar Regla';
            confirmBtn.textContent = 'Guardar';
            confirmBtn.className = 'bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-4 py-2 rounded-lg transition';
            ruleInput.value = rules[index];
        }
        updatePreview();
        hideModalError();
    }

    function closeModal() {
        modalContent.classList.add('opacity-0', 'scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 200);
    }

    function openDeleteModal(index) {
        deleteIndex = index;
        deleteRuleText.textContent = rules[index];
        deleteModal.classList.remove('hidden');
        setTimeout(() => {
            deleteModalContent.classList.remove('opacity-0', 'scale-95');
        }, 10);
    }

    function closeDeleteModal() {
        deleteModalContent.classList.add('opacity-0', 'scale-95');
        setTimeout(() => {
            deleteModal.classList.add('hidden');
        }, 200);
    }

    // --- RULE LOGIC ---
    function formatRule(input) {
        let domain = input.trim();
        if (!domain) return '';

        if (extractHostCheck.checked) {
            try {
                let url;
                if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
                    url = new URL('https://' + domain);
                } else {
                    url = new URL(domain);
                }
                domain = url.hostname;
            } catch (e) {
                domain = domain.replace(/^https?:\/\//, '').split('/')[0].split('?')[0].split('#')[0];
            }
        }

        if (autoSyntaxCheck.checked && !domain.startsWith('@@')) {
            domain = domain.replace(/^www\./, '');
            const important = addImportantCheck.checked ? '$important,document' : '$document';
            return `@@||${domain}^${important}`;
        }
        
        return domain;
    }

    function updatePreview() {
        const formatted = formatRule(ruleInput.value || 'example.com');
        rulePreview.textContent = formatted;
    }

    function showModalError(message) {
        modalError.textContent = message;
        modalError.classList.remove('hidden');
    }

    function hideModalError() {
        modalError.classList.add('hidden');
    }

    async function handleConfirm() {
        const newRule = formatRule(ruleInput.value);

        if (!newRule) {
            showModalError('La regla no puede estar vacía.');
            return;
        }
        if (!newRule.startsWith('@@')) {
            showModalError('La sintaxis de la regla es inválida. Debe comenzar con @@.');
            return;
        }
        if (rules.includes(newRule) && (editIndex === -1 || rules[editIndex] !== newRule)) {
            showModalError('Esta regla ya existe en la lista.');
            return;
        }

        let success = false;
        if (editIndex === -1) { // Add mode
            success = await sendRequest({ action: 'add', rule: newRule });
        } else { // Edit mode
            success = await sendRequest({ action: 'edit', index: editIndex, rule: newRule });
        }

        if (success) {
            closeModal();
        }
    }

    async function handleDeleteConfirm() {
        const success = await sendRequest({ action: 'delete', index: deleteIndex });
        if (success) {
            closeDeleteModal();
        }
    }
    
    function showError(message) {
        // Simple alert for now, can be replaced with a more sophisticated notification system
        alert(message);
    }

    // --- EVENT LISTENERS ---
    document.getElementById('add-rule-btn').addEventListener('click', () => openModal('add'));
    document.getElementById('download-btn').addEventListener('click', () => window.location.href = 'whitelist.txt');
    document.getElementById('cancel-btn').addEventListener('click', closeModal);
    document.getElementById('confirm-btn').addEventListener('click', handleConfirm);
    
    document.getElementById('cancel-delete-btn').addEventListener('click', closeDeleteModal);
    document.getElementById('confirm-delete-btn').addEventListener('click', handleDeleteConfirm);

    rulesList.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.edit-btn');
        const deleteBtn = e.target.closest('.delete-btn');
        if (editBtn) {
            openModal('edit', parseInt(editBtn.dataset.index));
        }
        if (deleteBtn) {
            openDeleteModal(parseInt(deleteBtn.dataset.index));
        }
    });

    searchInput.addEventListener('input', () => renderRules(searchInput.value));
    
    [ruleInput, extractHostCheck, autoSyntaxCheck, addImportantCheck].forEach(el => {
        el.addEventListener('input', updatePreview);
        el.addEventListener('change', updatePreview);
    });

    // Close modals with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!modal.classList.contains('hidden')) closeModal();
            if (!deleteModal.classList.contains('hidden')) closeDeleteModal();
        }
    });

    // --- INITIALIZATION ---
    loadRules();
});
