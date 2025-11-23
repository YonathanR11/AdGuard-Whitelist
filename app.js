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
    const rulePreview = document.querySelector('#rule-preview code');
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

        // Update stats
        document.getElementById('total-rules').textContent = rules.length;
        document.getElementById('filtered-rules').textContent = filteredRules.length;

        if (filteredRules.length === 0) {
            noResults.classList.remove('hidden');
        } else {
            noResults.classList.add('hidden');
        }

        filteredRules.forEach((rule) => {
            const index = rules.indexOf(rule);
            const div = document.createElement('div');
            div.className = 'px-4 py-3 flex items-center justify-between hover:bg-neutral-900 transition-colors';
            div.innerHTML = `
                <div class="flex items-center gap-3 flex-1 min-w-0">
                    <span class="text-xs font-medium text-neutral-600 w-8 flex-shrink-0">#${index + 1}</span>
                    <code class="text-sm text-white mono truncate" title="${rule}">${rule}</code>
                </div>
                <div class="flex items-center gap-1 flex-shrink-0 ml-4">
                    <button class="edit-btn icon-btn p-2 rounded-md hover:bg-neutral-800" data-index="${index}" title="Editar">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path>
                        </svg>
                    </button>
                    <button class="delete-btn icon-btn danger p-2 rounded-md hover:bg-red-950" data-index="${index}" title="Eliminar">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path>
                        </svg>
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
            modalTitle.textContent = 'Agregar regla';
            confirmBtn.textContent = 'Agregar';
            confirmBtn.className = 'btn btn-primary px-4 py-2 rounded-md text-sm';
            ruleInput.value = '';
        } else {
            modalTitle.textContent = 'Editar regla';
            confirmBtn.textContent = 'Guardar';
            confirmBtn.className = 'btn btn-primary px-4 py-2 rounded-md text-sm';
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
    document.getElementById('cancel-btn-2').addEventListener('click', closeModal);
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
