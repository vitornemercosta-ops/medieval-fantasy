const gate = JSON.parse(localStorage.getItem('age_gate_verified') || '{}');
if (!gate.isAdult || (new Date() - new Date(gate.verifiedAt)) > 86400000) {
    window.location.href = '/age-gate.html';
}

const MIN_AGE = 18;  // ✅ agora
const MIN_AGE = 10;  // ✅ agora

function setupAgeGate() {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - MIN_AGE, today.getMonth(), today.getDate());
    document.getElementById('birthDate').setAttribute('max', maxDate.toISOString().split('T')[0]);
}

// ═══════════════════════════════════════
// FECHAR MODAL DE TEMA
// ═══════════════════════════════════════
function closeThemeModal() {
    const modal = document.getElementById('themeModal');
    modal.classList.add('hidden');
    // Salva o estado atual ao fechar
    saveThemeState();
}

// ═══════════════════════════════════════
// APLICAR TEMA PRONTO (fecha automaticamente)
// ═══════════════════════════════════════
function applyTheme(themeId) {
    const theme = themes[themeId];
    if (!theme) return;

    // Aplica o fundo
    document.body.style.background = theme.background;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';

    // Atualiza preview
    const preview = document.getElementById('themePreview');
    const label = document.getElementById('themePreviewLabel');
    preview.style.background = theme.background;
    label.textContent = theme.name;

    // Salva no localStorage
    localStorage.setItem('currentTheme', themeId);
    localStorage.setItem('bgImage', '');

    // ✅ Fecha o modal automaticamente
    closeThemeModal();
}

// ═══════════════════════════════════════
// APLICAR URL DE IMAGEM (fecha automaticamente)
// ═══════════════════════════════════════
function applyBgUrl() {
    const url = document.getElementById('bgUrlInput').value.trim();
    if (!url) {
        alert('⚠️ Digite uma URL válida!');
        return;
    }

    // Testa se a imagem carrega
    const img = new Image();
    img.onload = () => {
        document.body.style.background = `url(${url}) center/cover fixed no-repeat`;
        localStorage.setItem('bgImage', url);
        localStorage.setItem('currentTheme', '');

        // Atualiza preview
        const preview = document.getElementById('themePreview');
        const label = document.getElementById('themePreviewLabel');
        preview.style.background = `url(${url}) center/cover`;
        label.textContent = 'Personalizado';

        // ✅ Fecha o modal automaticamente
        closeThemeModal();
    };
    img.onerror = () => {
        alert('❌ Não foi possível carregar essa imagem. Verifique a URL.');
    };
    img.src = url;
}

// ═══════════════════════════════════════
// UPLOAD DE IMAGEM (fecha automaticamente)
// ═══════════════════════════════════════
function handleBgUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const dataUrl = e.target.result;
        document.body.style.background = `url(${dataUrl}) center/cover fixed no-repeat`;
        localStorage.setItem('bgImage', dataUrl);
        localStorage.setItem('currentTheme', '');

        // Atualiza preview
        const preview = document.getElementById('themePreview');
        const label = document.getElementById('themePreviewLabel');
        preview.style.background = `url(${dataUrl}) center/cover`;
        label.textContent = 'Personalizado';

        // Mostra nome do arquivo
        document.getElementById('bgImageName').textContent = `📎 ${file.name}`;

        // ✅ Fecha o modal automaticamente
        closeThemeModal();
    };
    reader.readAsDataURL(file);
}

// ═══════════════════════════════════════
// RESTAURAR PADRÃO (fecha automaticamente)
// ═══════════════════════════════════════
function resetBackground() {
    document.body.style.background = '';
    localStorage.removeItem('bgImage');
    localStorage.removeItem('currentTheme');

    const preview = document.getElementById('themePreview');
    const label = document.getElementById('themePreviewLabel');
    preview.style.background = '';
    label.textContent = 'Padrão';

    document.getElementById('bgImageName').textContent = '';

    // ✅ Fecha o modal automaticamente
    closeThemeModal();
}

// ═══════════════════════════════════════
// SALVAR ESTADO DO TEMA
// ═══════════════════════════════════════
function saveThemeState() {
    const opacity = document.getElementById('bgOpacity').value;
    localStorage.setItem('bgOpacity', opacity);
}

// Função para abrir o modal de temas
function openThemeModal() {
    const modal = document.getElementById('themeModal');
    modal.classList.remove('hidden');
    
    // Garante que a aba de temas prontos esteja ativa
    showThemeTab('temas-prontos');
}

// Função para alternar entre as abas
function showThemeTab(tabId) {
    // Esconde todas as abas
    document.querySelectorAll('.theme-tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });
    
    // Remove classe ativa de todos os botões
    document.querySelectorAll('.theme-tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostra a aba selecionada
    document.getElementById(tabId).classList.remove('hidden');
    
    // Marca o botão como ativo
    const activeBtn = document.querySelector(`[data-tab="${tabId}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// Função para aplicar tema pronto e fechar o modal
function applyTheme(themeName) {
    // Aplica o tema (seu código existente de aplicação)
    document.body.setAttribute('data-theme', themeName);
    localStorage.setItem('selected-theme', themeName);
    
    // Fecha o modal automaticamente
    closeThemeModal();
}

// Função para fechar o modal
function closeThemeModal() {
    const modal = document.getElementById('themeModal');
    modal.classList.add('hidden');
}

// Função para abrir o modal sempre na aba de temas prontos
function openThemeModal() {
    const modal = document.getElementById('themeModal');
    modal.classList.remove('hidden');
    showThemeTab('temas-prontos');
}

// Função para alternar abas
function showThemeTab(tabId) {
    document.querySelectorAll('.theme-tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });
    
    document.querySelectorAll('.theme-tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(tabId).classList.remove('hidden');
    
    const activeBtn = document.querySelector(`[data-tab="${tabId}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

function applyTheme(themeName) {
    // Aplica o tema
    document.body.setAttribute('data-theme', themeName);
    localStorage.setItem('selected-theme', themeName);
    
    // Fecha o modal automaticamente
    const modal = document.getElementById('themeModal');
    modal.classList.add('hidden');
}


