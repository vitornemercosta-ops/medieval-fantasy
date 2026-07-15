// ═══════════════════════════════════════
// CONFIGURAÇÃO
// ═══════════════════════════════════════
const CONFIG = {
  STORAGE_KEY: 'grimorio_arcano_dados',
};

const ROLE_KEY = 'grimorio_role';
const MIN_AGE = 18;
const MASTER_DEFAULT_PASS = 'mestre123';

// ═══════════════════════════════════════
// VERIFICAÇÃO DE IDADE
// ═══════════════════════════════════════
const gate = JSON.parse(localStorage.getItem('age_gate_verified') || '{}');
if (!gate.isAdult || (new Date() - new Date(gate.verifiedAt)) > 86400000) {
    window.location.href = '/age-gate.html';
}

function setupAgeGate() {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - MIN_AGE, today.getMonth(), today.getDate());
    const el = document.getElementById('birthDate');
    if (el) el.setAttribute('max', maxDate.toISOString().split('T')[0]);
}

// ═══════════════════════════════════════
// CRIPTOGRAFIA
// ═══════════════════════════════════════
const CRYPTO = {
  deriveKey: async (password, salt) => {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']
    );
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: 200000, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  },

  encrypt: async (obj, password) => {
    const enc = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await CRYPTO.deriveKey(password, salt);
    const data = enc.encode(JSON.stringify(obj));
    const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);
    const combined = new Uint8Array(salt.length + iv.length + cipher.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(cipher), salt.length + iv.length);
    return btoa(String.fromCharCode(...combined));
  },

  decrypt: async (encryptedStr, password) => {
    const combined = Uint8Array.from(atob(encryptedStr), c => c.charCodeAt(0));
    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const ciphertext = combined.slice(28);
    const key = await CRYPTO.deriveKey(password, salt);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
    return JSON.parse(new TextDecoder().decode(decrypted));
  },
};

// ═══════════════════════════════════════
// COLETA / PREENCHE DADOS
// ═══════════════════════════════════════
function coletarDados() {
  const fichas = [];
  const containerFichas = document.querySelectorAll('.ficha-item');
  containerFichas.forEach(el => {
    const get = (sel) => el.querySelector(sel)?.value || '';
    fichas.push({
      nome: get('.ficha-nome'),
      classe: get('.ficha-classe'),
      raca: get('.ficha-raca'),
      nivel: parseInt(get('.ficha-nivel')) || 1,
      alinhamento: get('.ficha-alinhamento'),
      antecedente: get('.ficha-antecedente'),
      xp: parseInt(get('.ficha-xp')) || 0,
      atributos: {
        forca: parseInt(get('.attr-forca')) || 10,
        destreza: parseInt(get('.attr-destreza')) || 10,
        constituicao: parseInt(get('.attr-constituicao')) || 10,
        inteligencia: parseInt(get('.attr-inteligencia')) || 10,
        sabedoria: parseInt(get('.attr-sabedoria')) || 10,
        carisma: parseInt(get('.attr-carisma')) || 10,
      },
      pericias: get('.ficha-pericias').split(',').map(s => s.trim()).filter(Boolean),
      magias: get('.ficha-magias').split(',').map(s => s.trim()).filter(Boolean),
      inventario: get('.ficha-inventario').split(',').map(s => s.trim()).filter(Boolean),
      anotacoes: get('.ficha-anotacoes'),
    });
  });
  return {
    usuario: { nome: document.querySelector('#usuario-nome')?.value || 'Mago Anônimo' },
    fichas,
    notas: document.querySelector('#notas-gerais')?.value || '',
    ultimaAlteracao: new Date().toISOString(),
  };
}

function preencherFormulario(dados) {
  const campoNome = document.querySelector('#usuario-nome');
  if (campoNome) campoNome.value = dados.usuario?.nome || '';
  const campoNotas = document.querySelector('#notas-gerais');
  if (campoNotas) campoNotas.value = dados.notas || '';
  const container = document.querySelector('#fichas-container');
  if (container && dados.fichas) {
    container.innerHTML = '';
    dados.fichas.forEach(ficha => {
      if (typeof criarFicha === 'function') criarFicha(ficha);
    });
  }
}

// ═══════════════════════════════════════
// BOTÕES: SALVAR / CARREGAR / LIMPAR
// ═══════════════════════════════════════
async function botaoSalvar() {
  const senha = prompt('🔐 Crie ou digite sua senha mestra para salvar:');
  if (!senha) return alert('❌ Salvamento cancelado — senha é obrigatória.');
  const confirmar = prompt('🔁 Confirme a senha:');
  if (senha !== confirmar) return alert('❌ As senhas não coincidem!');
  try {
    const dados = coletarDados();
    const criptografado = await CRYPTO.encrypt(dados, senha);
    localStorage.setItem(CONFIG.STORAGE_KEY, criptografado);
    alert('✅ Grimório salvo com sucesso e protegido com criptografia!');
  } catch (erro) {
    console.error(erro);
    alert(`❌ Erro ao salvar: ${erro.message}`);
  }
}

async function botaoCarregar() {
  const criptografado = localStorage.getItem(CONFIG.STORAGE_KEY);
  if (!criptografado) return alert('⚠️ Nenhum grimório salvo encontrado.');
  const senha = prompt('🔐 Digite sua senha mestra para carregar:');
  if (!senha) return;
  try {
    const dados = await CRYPTO.decrypt(criptografado, senha);
    preencherFormulario(dados);
    alert(`✅ Grimório carregado! Última alteração: ${new Date(dados.ultimaAlteracao).toLocaleString('pt-BR')}`);
  } catch (erro) {
    alert('❌ Senha incorreta ou dados corrompidos.');
  }
}

function botaoLimpar() {
  const senha = prompt('🔐 Digite a senha mestra para confirmar a exclusão:');
  if (!senha) return;
  const criptografado = localStorage.getItem(CONFIG.STORAGE_KEY);
  if (!criptografado) return alert('⚠️ Nada para excluir.');
  CRYPTO.decrypt(criptografado, senha)
    .then(() => {
      if (confirm('⚠️ Tem certeza que deseja APAGAR o grimório permanentemente?')) {
        localStorage.removeItem(CONFIG.STORAGE_KEY);
        alert('🗑️ Grimório apagado.');
      }
    })
    .catch(() => alert('❌ Senha incorreta. Exclusão cancelada.'));
}

// ═══════════════════════════════════════
// PDF EXPORT (criptografado)
// ═══════════════════════════════════════
const PDF_EXPORT = {
  gerar: async (grimorio, senhaPDF) => {
    const { PDFDocument, rgb, EncryptionAlgorithm } = PDFLib;
    const pdf = await PDFDocument.create();
    const A4 = [595, 842];
    let page = pdf.addPage(A4);

    // Capa
    page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: rgb(0.06, 0.04, 0.10) });
    page.drawRectangle({ x: 25, y: 25, width: 545, height: 792, borderColor: rgb(0.75, 0.60, 0.22), borderWidth: 3 });

    const modo = getCurrentRole() === 'mestre' ? '👑 MESTRE' : '⚔️ JOGADOR';
    page.drawText('⚝  GRIMÓRIO ARCANO  ⚝', { x: 100, y: 650, size: 34, color: rgb(0.88, 0.72, 0.28) });
    page.drawText(`Pertence a: ${grimorio.usuario?.nome || 'Mago Anônimo'}`, { x: 110, y: 540, size: 16, color: rgb(0.82, 0.78, 0.62) });
    page.drawText(`Fichas: ${grimorio.fichas?.length || 0}`, { x: 110, y: 510, size: 14, color: rgb(0.65, 0.60, 0.50) });
    page.drawText(`Exportado: ${new Date().toLocaleString('pt-BR')}`, { x: 110, y: 485, size: 12, color: rgb(0.50, 0.45, 0.38) });
    page.drawText(`Modo: ${modo}  |  Geração: ${new Date().toLocaleDateString('pt-BR')}`, { x: 80, y: 455, size: 12, color: rgb(0.50, 0.45, 0.38) });
    page.drawText('🔒 PDF protegido por senha', { x: 110, y: 425, size: 12, color: rgb(0.65, 0.30, 0.18) });

    // Fichas
    (grimorio.fichas || []).forEach((ficha, i) => {
      page = pdf.addPage(A4);
      let y = 790;
      page.drawText(`Ficha ${i + 1}: ${ficha.nome || 'Sem nome'}`, { x: 45, y, size: 20, color: rgb(0.88, 0.72, 0.28) });
      y -= 30;
      [
        `Classe: ${ficha.classe || 'N/A'}`,
        `Raça: ${ficha.raca || 'N/A'}`,
        `Nível: ${ficha.nivel || 1}`,
        `XP: ${ficha.xp || 0}`,
      ].forEach(txt => {
        page.drawText(txt, { x: 55, y, size: 12, color: rgb(0.78, 0.74, 0.58) });
        y -= 18;
      });
    });

    // Notas
    if (grimorio.notas?.trim()) {
      page = pdf.addPage(A4);
      page.drawText('📝 Notas', { x: 45, y: 790, size: 20, color: rgb(0.88, 0.72, 0.28) });
      let y = 750;
      grimorio.notas.split('\n').forEach(linha => {
        if (y < 60) { page = pdf.addPage(A4); y = 790; }
        page.drawText(linha || ' ', { x: 55, y, size: 11, color: rgb(0.68, 0.62, 0.52) });
        y -= 16;
      });
    }

    return pdf.encrypt({
      userPassword: senhaPDF,
      ownerPassword: senhaPDF + '_owner',
      encryptionAlgorithm: EncryptionAlgorithm.AES256,
      permissions: {
        printing: 'highResolution',
        copying: false,
        modifying: false,
        annotating: true,
        fillingForms: true,
        contentAccessibility: true,
        documentAssembly: false,
      },
    });
  },

  baixar: async (grimorio, senhaPDF) => {
    const bytes = await PDF_EXPORT.gerar(grimorio, senhaPDF);
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Grimorio_${new Date().toISOString().slice(0, 10)}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    return { sucesso: true };
  },
};

async function exportarTudoPDF() {
  const criptografado = localStorage.getItem(CONFIG.STORAGE_KEY);
  if (!criptografado) return alert('⚠️ Salve o grimório primeiro antes de exportar!');

  const senha = prompt('🔐 Digite sua senha mestra:');
  if (!senha) return;

  try {
    const grimorio = await CRYPTO.decrypt(criptografado, senha);
    const senhaPDF = prompt('🔒 Defina a senha do PDF (ou use a mesma):', senha) || senha;
    alert('⏳ Gerando PDF...');
    const resultado = await PDF_EXPORT.baixar(grimorio, senhaPDF);
    if (resultado.sucesso) alert('✅ PDF exportado com sucesso!');
  } catch (erro) {
    alert(`❌ Falha: ${erro.message}`);
  }
}

// ═══════════════════════════════════════
// PDF SIMPLES (ficha individual)
// ═══════════════════════════════════════
async function baixarPDF() {
  const { PDFDocument, rgb } = PDFLib;
  const pdf = await PDFDocument.create();
  const A4 = [595, 842];

  const valor = (id) => document.getElementById(id)?.value || '';
  const nome = valor('nome-personagem') || 'Sem Nome';
  const classe = valor('classe') || 'N/A';
  const raca = valor('raca') || 'N/A';
  const nivel = valor('nivel') || '1';
  const xp = valor('xp') || '0';
  const anotacoes = valor('anotacoes') || '';

  let page = pdf.addPage(A4);
  page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: rgb(0.06, 0.04, 0.10) });
  page.drawRectangle({ x: 25, y: 25, width: 545, height: 792, borderColor: rgb(0.75, 0.60, 0.22), borderWidth: 3 });

  page.drawText('GRIMÓRIO ARCANO', { x: 140, y: 650, size: 32, color: rgb(0.88, 0.72, 0.28) });
  page.drawText(`Personagem: ${nome}`, { x: 110, y: 540, size: 16, color: rgb(0.82, 0.78, 0.62) });
  page.drawText(`Classe: ${classe}  |  Raça: ${raca}`, { x: 110, y: 510, size: 13, color: rgb(0.65, 0.60, 0.50) });
  page.drawText(`Nível: ${nivel}  |  XP: ${xp}`, { x: 110, y: 485, size: 13, color: rgb(0.65, 0.60, 0.50) });
  page.drawText(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, { x: 110, y: 455, size: 12, color: rgb(0.50, 0.45, 0.38) });

  if (anotacoes.trim()) {
    page = pdf.addPage(A4);
    page.drawText('Anotações', { x: 45, y: 790, size: 22, color: rgb(0.88, 0.72, 0.28) });
    let y = 750;
    anotacoes.split('\n').forEach(linha => {
      if (y < 60) { page = pdf.addPage(A4); y = 790; }
      page.drawText(linha || ' ', { x: 55, y, size: 11, color: rgb(0.68, 0.62, 0.52) });
      y -= 16;
    });
  }

  const pdfBytes = await pdf.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Ficha_${nome.replace(/\s+/g, '_')}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

// ═══════════════════════════════════════
// MODAL DE TEMAS
// ═══════════════════════════════════════
function openThemeModal() {
  const modal = document.getElementById('themeModal');
  if (!modal) return;
  modal.classList.remove('hidden');
  showThemeTab('temas-prontos');
}

function closeThemeModal() {
  const modal = document.getElementById('themeModal');
  if (!modal) return;
  modal.classList.add('hidden');
  saveThemeState();
}

function showThemeTab(tabId) {
  document.querySelectorAll('.theme-tab-content').forEach(tab => tab.classList.add('hidden'));
  document.querySelectorAll('.theme-tab-button').forEach(btn => btn.classList.remove('active'));
  const target = document.getElementById(tabId);
  if (target) target.classList.remove('hidden');
  const activeBtn = document.querySelector(`[data-tab="${tabId}"]`);
  if (activeBtn) activeBtn.classList.add('active');
}

function applyTheme(themeName) {
  document.body.setAttribute('data-theme', themeName);
  localStorage.setItem('selected-theme', themeName);
  closeThemeModal();
}

function applyBgUrl() {
  const urlInput = document.getElementById('bgUrlInput');
  const url = urlInput?.value?.trim();
  if (!url) return alert('⚠️ Digite uma URL válida!');
  const img = new Image();
  img.onload = () => {
    document.body.style.background = `url(${url}) center/cover fixed no-repeat`;
    localStorage.setItem('bgImage', url);
    localStorage.setItem('currentTheme', '');
    const preview = document.getElementById('themePreview');
    const label = document.getElementById('themePreviewLabel');
    if (preview) preview.style.background = `url(${url}) center/cover`;
    if (label) label.textContent = 'Personalizado';
    closeThemeModal();
  };
  img.onerror = () => alert('❌ Não foi possível carregar essa imagem. Verifique a URL.');
  img.src = url;
}

function handleBgUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    document.body.style.background = `url(${dataUrl}) center/cover fixed no-repeat`;
    localStorage.setItem('bgImage', dataUrl);
    localStorage.setItem('currentTheme', '');
    const preview = document.getElementById('themePreview');
    const label = document.getElementById('themePreviewLabel');
    if (preview) preview.style.background = `url(${dataUrl}) center/cover`;
    if (label) label.textContent = 'Personalizado';
    const nameEl = document.getElementById('bgImageName');
    if (nameEl) nameEl.textContent = `📎 ${file.name}`;
    closeThemeModal();
  };
  reader.readAsDataURL(file);
}

function resetBackground() {
  document.body.style.background = '';
  localStorage.removeItem('bgImage');
  localStorage.removeItem('currentTheme');
  const preview = document.getElementById('themePreview');
  const label = document.getElementById('themePreviewLabel');
  if (preview) preview.style.background = '';
  if (label) label.textContent = 'Padrão';
  const nameEl = document.getElementById('bgImageName');
  if (nameEl) nameEl.textContent = '';
  closeThemeModal();
}

function saveThemeState() {
  const opacityEl = document.getElementById('bgOpacity');
  if (opacityEl) localStorage.setItem('bgOpacity', opacityEl.value);
}

// ═══════════════════════════════════════
// MODO MESTRE / JOGADOR
// ═══════════════════════════════════════
function setRole(role) {
  if (role !== 'mestre' && role !== 'jogador') return;
  localStorage.setItem('grimorio_role', role);
  applyRole(role);
  showToast(role === 'mestre' ? '👑 Modo Mestre ativado!' : '⚔️ Modo Jogador ativado!');
}

function applyRole(role) {
  document.body.classList.remove('modo-mestre', 'modo-jogador');
  document.body.classList.add('modo-' + role);

  const btnM = document.getElementById('btnMestre');
  const btnJ = document.getElementById('btnJogador');
  if (btnM) btnM.classList.toggle('ativo', role === 'mestre');
  if (btnJ) btnJ.classList.toggle('ativo', role === 'jogador');

  // Role toggle buttons alternativo
  document.querySelectorAll('#roleToggle button').forEach(btn => {
    btn.classList.remove('active-mestre', 'active-jogador');
    if (btn.dataset.role === role) {
      btn.classList.add('active-' + role);
    }
  });

  const abasJ = document.getElementById('abasJogador');
  const abasM = document.getElementById('abasMestre');
  if (abasJ) abasJ.style.display = (role === 'jogador') ? 'flex' : 'none';
  if (abasM) abasM.style.display = (role === 'mestre') ? 'flex' : 'none';

  document.querySelectorAll('#stageGrimoire > .tab-content').forEach(t => t.style.display = 'none');
  if (role === 'mestre') {
    const npcTab = document.getElementById('tabNPCs');
    if (npcTab) npcTab.style.display = 'block';
  } else {
    const persTab = document.getElementById('tabPersonagem');
    if (persTab) persTab.style.display = 'block';
  }
}

function getCurrentRole() {
  return localStorage.getItem('grimorio_role') || 'jogador';
}

// ═══════════════════════════════════════
// TROCA DE ABAS
// ═══════════════════════════════════════
function showTab(tabId, btn, grupoId) {
  document.querySelectorAll('#stageGrimoire > .tab-content').forEach(t => t.style.display = 'none');
  const target = document.getElementById(tabId);
  if (target) target.style.display = 'block';
  const grupo = document.getElementById(grupoId);
  if (grupo) {
    grupo.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
}

// ═══════════════════════════════════════
// NPCs
// ═══════════════════════════════════════
function addNPC() {
  const nome = document.getElementById('npcNome')?.value?.trim();
  const funcao = document.getElementById('npcFuncao')?.value?.trim();
  if (!nome) return showToast('⚠️ Informe o nome');
  const lista = JSON.parse(localStorage.getItem('grimorio_npcs') || '[]');
  lista.push({ nome, funcao, id: Date.now() });
  localStorage.setItem('grimorio_npcs', JSON.stringify(lista));
  const inpNome = document.getElementById('npcNome');
  const inpFuncao = document.getElementById('npcFuncao');
  if (inpNome) inpNome.value = '';
  if (inpFuncao) inpFuncao.value = '';
  renderNPCs();
  showToast('✅ NPC adicionado');
}

function renderNPCs() {
  const lista = JSON.parse(localStorage.getItem('grimorio_npcs') || '[]');
  const el = document.getElementById('listaNPCs');
  if (!el) return;
  el.innerHTML = lista.length
    ? lista.map(n => `<div class="item-card"><div><strong>${n.nome}</strong><small>${n.funcao || ''}</small></div><button class="btn-sm" style="background:var(--danger);" onclick="delNPC(${n.id})">×</button></div>`).join('')
    : '<p style="color:var(--text-muted);text-align:center;padding:20px;">Nenhum NPC cadastrado</p>';
}

function delNPC(id) {
  let lista = JSON.parse(localStorage.getItem('grimorio_npcs') || '[]');
  lista = lista.filter(n => n.id !== id);
  localStorage.setItem('grimorio_npcs', JSON.stringify(lista));
  renderNPCs();
}

// ═══════════════════════════════════════
// ENCONTROS
// ═══════════════════════════════════════
function addEncontro() {
  const nome = document.getElementById('encNome')?.value?.trim();
  const nd = document.getElementById('encND')?.value || '';
  const detalhes = document.getElementById('encDetalhes')?.value?.trim() || '';
  if (!nome) return showToast('⚠️ Informe o nome');
  const lista = JSON.parse(localStorage.getItem('grimorio_encontros') || '[]');
  lista.push({ nome, nd, detalhes, id: Date.now() });
  localStorage.setItem('grimorio_encontros', JSON.stringify(lista));
  ['encNome', 'encND', 'encDetalhes'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  renderEncontros();
}

function renderEncontros() {
  const lista = JSON.parse(localStorage.getItem('grimorio_encontros') || '[]');
  const el = document.getElementById('listaEncontros');
  if (!el) return;
  el.innerHTML = lista.length
    ? lista.map(e => `<div class="item-card"><div><strong>${e.nome}</strong><small>ND ${e.nd || '?'} — ${e.detalhes || ''}</small></div><button class="btn-sm" style="background:var(--danger);" onclick="delEncontro(${e.id})">×</button></div>`).join('')
    : '<p style="color:var(--text-muted);text-align:center;padding:20px;">Nenhum encontro cadastrado</p>';
}

function delEncontro(id) {
  let l = JSON.parse(localStorage.getItem('grimorio_encontros') || '[]');
  l = l.filter(e => e.id !== id);
  localStorage.setItem('grimorio_encontros', JSON.stringify(l));
  renderEncontros();
}

// ═══════════════════════════════════════
// SESSÕES
// ═══════════════════════════════════════
function addSessao() {
  const data = document.getElementById('sessData')?.value || '';
  const titulo = document.getElementById('sessTitulo')?.value?.trim() || '';
  const notas = document.getElementById('sessNotas')?.value?.trim() || '';
  if (!titulo) return showToast('⚠️ Informe o título');
  const lista = JSON.parse(localStorage.getItem('grimorio_sessoes') || '[]');
  lista.push({ data, titulo, notas, id: Date.now() });
  localStorage.setItem('grimorio_sessoes', JSON.stringify(lista));
  ['sessTitulo', 'sessNotas'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  renderSessoes();
}

function renderSessoes() {
  const lista = JSON.parse(localStorage.getItem('grimorio_sessoes') || '[]');
  const el = document.getElementById('listaSessoes');
  if (!el) return;
  el.innerHTML = lista.length
    ? lista.map(s => `<div class="item-card"><div><strong>${s.data || '—'} • ${s.titulo}</strong><small>${s.notas || ''}</small></div><button class="btn-sm" style="background:var(--danger);" onclick="delSessao(${s.id})">×</button></div>`).join('')
    : '<p style="color:var(--text-muted);text-align:center;padding:20px;">Nenhuma sessão registrada</p>';
}

function delSessao(id) {
  let l = JSON.parse(localStorage.getItem('grimorio_sessoes') || '[]');
  l = l.filter(s => s.id !== id);
  localStorage.setItem('grimorio_sessoes', JSON.stringify(l));
  renderSessoes();
}

// ═══════════════════════════════════════
// MUNDO
// ═══════════════════════════════════════
function addMundo() {
  const tipo = document.getElementById('mundoTipo')?.value || 'local';
  const nome = document.getElementById('mundoNome')?.value?.trim() || '';
  const desc = document.getElementById('mundoDesc')?.value?.trim() || '';
  if (!nome) return showToast('⚠️ Informe o nome');
  const lista = JSON.parse(localStorage.getItem('grimorio_mundo') || '[]');
  lista.push({ tipo, nome, desc, id: Date.now() });
  localStorage.setItem('grimorio_mundo', JSON.stringify(lista));
  ['mundoNome', 'mundoDesc'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  renderMundo();
}

function renderMundo() {
  const icones = { local: '📍', faccao: '⚜️', historia: '📖', regra: '📜' };
  const lista = JSON.parse(localStorage.getItem('grimorio_mundo') || '[]');
  const el = document.getElementById('listaMundo');
  if (!el) return;
  el.innerHTML = lista.length
    ? lista.map(m => `<div class="item-card"><div><strong>${icones[m.tipo] || ''} ${m.nome}</strong><small>${m.tipo} — ${m.desc || ''}</small></div><button class="btn-sm" style="background:var(--danger);" onclick="delMundo(${m.id})">×</button></div>`).join('')
    : '<p style="color:var(--text-muted);text-align:center;padding:20px;">Nada cadastrado</p>';
}

function delMundo(id) {
  let l = JSON.parse(localStorage.getItem('grimorio_mundo') || '[]');
  l = l.filter(m => m.id !== id);
  localStorage.setItem('grimorio_mundo', JSON.stringify(l));
  renderMundo();
}

// ═══════════════════════════════════════
// GERADORES
// ═══════════════════════════════════════
const GEN = {
  nomesNPC: ['Aldric','Berenice','Caelum','Dahlia','Eldrin','Fiora','Garrick','Helena','Isolde','Jarek','Kael','Lyra','Morden','Nimue','Oswin','Petra','Quinn','Ravenna','Soren','Thalia','Ulric','Vesper','Wren','Xander','Yara','Zephyr'],
  tavernas: ['O Dragão Bêbado','A Caneca Quebrada','Pé do Grifo','Lua de Prata','Coroa Torta','Lobo Manco','Estrela Cadente','Cervo Dourado','Rato Esperto','Martelo Partido','Pomba Negra','Sol Poente'],
  encontros: ['3 goblins emboscando a estrada','Um mercador ferido pede ajuda','Dragão jovem sobrevoa a região','Bando de lobos famintos','Caravana saqueada por bandidos','Estranho mago oferece poção','Ruínas antigas com armadilhas','Fada perdida na floresta','Cadáver com carta misteriosa','Troll de pedra bloqueia ponte'],
  tesouros: ['50 moedas de ouro e uma adaga élfica','Pergaminho de bola de fogo','Anel de proteção +1','Gema de safira (100po)','Poção de cura maior','Mapa para um tesouro perdido','Espada longa com runas','Amuleto misterioso','Pó de desaparecimento','Livro de feitiços antigo'],
  personalidades: ['Gentil mas covarde','Arrogante e orgulhoso','Misterioso e silencioso','Alegre e barulhento','Paranoico e desconfiado','Honrado até demais','Astuto e manipulador','Melancólico e sábio','Impulsivo e corajoso','Excêntrico e distraído'],
  locais: ['Vale das Somras','Pico do Trovão','Floresta Sussurrante','Pântano Negro','Cidadela de Cristal','Porto dos Naufrágios','Deserto de Cinzas','Catarata Prateada','Cripta dos Reis','Torre do Feiticeiro']
};

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function gerarNomeNPC() {
  const el = document.getElementById('genNomeNPC');
  if (el) el.textContent = pick(GEN.nomesNPC);
}
function gerarTaverna() {
  const el = document.getElementById('genTaverna');
  if (el) el.textContent = pick(GEN.tavernas);
}
function gerarEncontro() {
  const el = document.getElementById('genEncontro');
  if (el) el.textContent = pick(GEN.encontros);
}
function gerarTesouro() {
  const el = document.getElementById('genTesouro');
  if (el) el.textContent = pick(GEN.tesouros);
}
function gerarPersonalidade() {
  const el = document.getElementById('genPersonalidade');
  if (el) el.textContent = pick(GEN.personalidades);
}
function gerarLocal() {
  const el = document.getElementById('genLocal');
  if (el) el.textContent = pick(GEN.locais);
}

// ═══════════════════════════════════════
// BESTIÁRIO
// ═══════════════════════════════════════
let bestiaryFilter = '';
let pendingBestiaryImgId = null;

function getBestiary() {
  const ch = getCurrentChar();
  if (!ch) return [];
  if (!ch.bestiary) ch.bestiary = [];
  return ch.bestiary;
}

function filterBestiary(val) {
  bestiaryFilter = val;
  renderPanels();
}

function addCreature() {
  const list = getBestiary();
  list.push({
    id: 'cr_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    name: '', type: '', img: '', desc: '',
    ca: '', hp: '', nd: '', for: '', des: '', con: ''
  });
  markUnsaved();
  renderPanels();
}

function updCreature(id, field, value) {
  const c = getBestiary().find(x => x.id === id);
  if (c) { c[field] = value; markUnsaved(); }
}

function deleteCreature(id) {
  showConfirm('Excluir esta criatura do bestiário?', () => {
    const list = getBestiary();
    const idx = list.findIndex(x => x.id === id);
    if (idx >= 0) list.splice(idx, 1);
    markUnsaved();
    renderPanels();
    showToast('🗑️ Criatura excluída');
  });
}

function duplicateCreature(id) {
  const list = getBestiary();
  const orig = list.find(x => x.id === id);
  if (!orig) return;
  const copy = { ...orig, id: 'cr_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7), name: (orig.name || 'Criatura') + ' (cópia)' };
  list.push(copy);
  markUnsaved();
  renderPanels();
  showToast('📋 Duplicada!');
}

function uploadCreatureImg(id) {
  pendingBestiaryImgId = id;
  const inp = document.createElement('input');
  inp.type = 'file';
  inp.accept = 'image/*';
  inp.onchange = function(e) {
    const file = e.target.files[0];
    if (!file || !pendingBestiaryImgId) return;
    const reader = new FileReader();
    reader.onload = () => {
      const c = getBestiary().find(x => x.id === pendingBestiaryImgId);
      if (c) { c.img = reader.result; markUnsaved(); renderPanels(); }
      pendingBestiaryImgId = null;
    };
    reader.readAsDataURL(file);
  };
  inp.click();
}

function removeCreatureImg(id) {
  const c = getBestiary().find(x => x.id === id);
  if (c) { c.img = ''; markUnsaved(); renderPanels(); }
}

function renderBestiaryCards(list) {
  const filtered = bestiaryFilter
    ? list.filter(c => (c.name || '').toLowerCase().includes(bestiaryFilter.toLowerCase()) ||
                       (c.type || '').toLowerCase().includes(bestiaryFilter.toLowerCase()) ||
                       (c.desc || '').toLowerCase().includes(bestiaryFilter.toLowerCase()))
    : list;

  const countEl = document.getElementById('bestiaryCount');
  if (countEl) {
    countEl.textContent = `${list.length} criatura${list.length !== 1 ? 's' : ''}${filtered.length !== list.length ? ` (${filtered.length} exibindo)` : ''}`;
  }

  if (!filtered.length) {
    return `<div class="bestiary-empty" style="grid-column:1/-1;text-align:center;padding:40px 20px;color:var(--text-muted);font-style:italic"><div class="icon" style="font-size:4rem;opacity:0.3;margin-bottom:10px">🐉</div><p>${list.length ? 'Nenhuma criatura encontrada.' : 'Bestiário vazio. Clique em "Nova Criatura" para começar!'}</p></div>`;
  }

  return filtered.map(c => {
    const imgHtml = c.img
      ? `<img src="${c.img}" alt="${escapeHTML(c.name || '')}"><button class="remove-img" onclick="event.stopPropagation();removeCreatureImg('${c.id}')" style="position:absolute;top:6px;right:6px;width:26px;height:26px;background:rgba(192,57,107,0.9);border:none;border-radius:50%;color:#fff;font-size:0.85rem;cursor:pointer;display:flex;align-items:center;justify-content:center">✕</button>`
      : `<span class="placeholder" style="color:var(--text-muted);font-size:3rem;opacity:0.4">🐉</span>`;
    return `
    <div class="creature-card" data-id="${c.id}" style="background:var(--bg);border:2px solid var(--border);border-radius:10px;overflow:hidden;transition:all 0.25s;display:flex;flex-direction:column">
      <div class="creature-img" onclick="uploadCreatureImg('${c.id}')" style="aspect-ratio:16/10;background:#000;display:flex;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;position:relative">
        ${imgHtml}
      </div>
      <div class="creature-body" style="padding:10px;display:flex;flex-direction:column;gap:6px;flex:1">
        <input class="name" placeholder="Nome da criatura" value="${escapeHTML(c.name || '')}" oninput="updCreature('${c.id}','name',this.value)" style="width:100%;background:transparent;border:1px solid transparent;border-radius:4px;color:#d4af37;font-weight:700;font-size:1rem;letter-spacing:1px;font-family:inherit;padding:5px 8px;transition:all 0.2s" onfocus="this.style.borderColor='var(--border)';this.style.background='rgba(10,14,39,0.6)'" onblur="this.style.borderColor='transparent';this.style.background='transparent'">
        <input class="type" placeholder="Tipo (ex: Dragão, Undead...)" value="${escapeHTML(c.type || '')}" oninput="updCreature('${c.id}','type',this.value)" style="width:100%;background:transparent;border:1px solid transparent;border-radius:4px;color:var(--gold-light);font-size:0.78rem;font-style:italic;font-family:inherit;padding:5px 8px;transition:all 0.2s" onfocus="this.style.borderColor='var(--border)';this.style.background='rgba(10,14,39,0.6)'" onblur="this.style.borderColor='transparent';this.style.background='transparent'">
        <div class="creature-stats" style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;padding:6px 8px;background:rgba(26,36,86,0.4);border-radius:6px">
          ${['ca','hp','nd','for','des','con'].map(st => `
          <div class="stat" style="display:flex;flex-direction:column;align-items:center">
            <label style="color:var(--text-muted);font-size:0.6rem;letter-spacing:1px;text-transform:uppercase">${st.toUpperCase()}</label>
            <input value="${escapeHTML(c[st] || '')}" placeholder="—" oninput="updCreature('${c.id}','${st}',this.value)" style="width:100%;background:transparent;border:none;color:var(--text);font-family:'Courier New',monospace;font-weight:700;text-align:center;padding:2px;font-size:0.85rem" onfocus="this.style.background='rgba(10,14,39,0.6)';this.style.borderRadius='4px';this.style.outline='none'" onblur="this.style.background='transparent'">
          </div>`).join('')}
        </div>
        <textarea class="desc" placeholder="Descrição, ataques, habilidades..." oninput="updCreature('${c.id}','desc',this.value)" style="min-height:60px;resize:vertical;font-size:0.82rem;line-height:1.4;width:100%;background:transparent;border:1px solid transparent;border-radius:4px;color:var(--text);font-family:inherit;padding:5px 8px;transition:all 0.2s" onfocus="this.style.borderColor='var(--border)';this.style.background='rgba(10,14,39,0.6)'" onblur="this.style.borderColor='transparent';this.style.background='transparent'">${escapeHTML(c.desc || '')}</textarea>
      </div>
      <div class="creature-footer" style="display:flex;gap:4px;padding:8px;border-top:1px solid var(--border);justify-content:flex-end">
        <button onclick="duplicateCreature('${c.id}')" style="padding:4px 10px;background:transparent;border:1px solid var(--border);border-radius:4px;color:var(--text-muted);cursor:pointer;font-size:0.7rem;font-family:inherit;text-transform:uppercase;letter-spacing:1px;transition:all 0.2s" onmouseover="this.style.borderColor='var(--gold-light)';this.style.color='var(--gold-light)'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text-muted)'">📋 Duplicar</button>
        <button class="del" onclick="deleteCreature('${c.id}')" style="padding:4px 10px;background:transparent;border:1px solid var(--border);border-radius:4px;color:var(--text-muted);cursor:pointer;font-size:0.7rem;font-family:inherit;text-transform:uppercase;letter-spacing:1px;transition:all 0.2s" onmouseover="this.style.borderColor='var(--danger)';this.style.color='var(--danger)'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text-muted)'">🗑️ Excluir</button>
      </div>
    </div>`;
  }).join('');
}

function initModoMestre() {
  renderNPCs();
  renderEncontros();
  renderSessoes();
  renderMundo();
}

// ═══════════════════════════════════════
// INICIALIZAÇÃO
// ═══════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  const salvo = localStorage.getItem(CONFIG.STORAGE_KEY);
  const statusEl = document.querySelector('#status-salvamento');
  if (statusEl) {
    statusEl.textContent = salvo ? '🟢 Grimório salvo (criptografado)' : '🔴 Nenhum grimório salvo';
  }

  applyRole(getCurrentRole());
  initModoMestre();
});
