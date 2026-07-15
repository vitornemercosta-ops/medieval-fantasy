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

// ============================================
// 📜 EXPORTAÇÃO DE PDF CRIPTOGRAFADO
// ============================================

const PDF_EXPORT = {
  /**
   * Gera um PDF criptografado com o grimório completo
   * @param {Object} grimorio - Dados do grimório (usuário, fichas, etc.)
   * @param {string} senhaPDF - Senha para proteger o PDF
   * @returns {Promise<Uint8Array>} - Bytes do PDF pronto
   */
  gerar: async (grimorio, senhaPDF) => {
    const { PDFDocument, StandardEncryption, EncryptionAlgorithm } = PDFLib;

    // Cria documento PDF
    const pdfDoc = await PDFDocument.create();

    // ============================================
    // PÁGINA 1: CAPA DO GRIMÓRIO
    // ============================================
    const capa = pdfDoc.addPage([595, 842]); // A4

    // Fundo escuro
    capa.drawRectangle({
      x: 0, y: 0,
      width: 595, height: 842,
      color: PDFLib.rgb(0.08, 0.06, 0.12),
    });

    // Moldura decorativa
    capa.drawRectangle({
      x: 30, y: 30,
      width: 535, height: 782,
      borderColor: PDFLib.rgb(0.7, 0.55, 0.2),
      borderWidth: 4,
    });
    capa.drawRectangle({
      x: 40, y: 40,
      width: 515, height: 762,
      borderColor: PDFLib.rgb(0.55, 0.4, 0.15),
      borderWidth: 2,
    });

    // Título
    capa.drawText('⚝ GRIMÓRIO ARCANO ⚝', {
      x: 100, y: 650,
      size: 36,
      color: PDFLib.rgb(0.85, 0.7, 0.25),
    });

    capa.drawText('Livro de Sombras & Fichas', {
      x: 160, y: 610,
      size: 16,
      color: PDFLib.rgb(0.65, 0.5, 0.2),
    });

    // Linha decorativa
    capa.drawLine({
      start: { x: 150, y: 590 },
      end: { x: 445, y: 590 },
      thickness: 1,
      color: PDFLib.rgb(0.7, 0.55, 0.2),
    });

    // Info do usuário
    const nome = grimorio?.usuario?.nome || 'Mago Anônimo';
    capa.drawText(`Pertence a: ${nome}`, {
      x: 100, y: 530,
      size: 18,
      color: PDFLib.rgb(0.8, 0.75, 0.6),
    });

    const dataGeracao = new Date().toLocaleDateString('pt-BR');
    capa.drawText(`Gerado em: ${dataGeracao}`, {
      x: 100, y: 500,
      size: 14,
      color: PDFLib.rgb(0.5, 0.45, 0.35),
    });

    capa.drawText('🔒 Este PDF é protegido por senha', {
      x: 100, y: 440,
      size: 12,
      color: PDFLib.rgb(0.6, 0.3, 0.2),
    });

    capa.drawText('Somente quem possui a senha mestra poderá abri-lo.', {
      x: 100, y: 418,
      size: 11,
      color: PDFLib.rgb(0.5, 0.3, 0.2),
    });

    // Símbolos decorativos nos cantos
    const simbolos = ['☽', '☀', '✧', '⚝'];
    const posicoes = [
      { x: 55, y: 780 },
      { x: 510, y: 780 },
      { x: 55, y: 55 },
      { x: 510, y: 55 },
    ];
    simbolos.forEach((sim, i) => {
      capa.drawText(sim, {
        x: posicoes[i].x, y: posicoes[i].y,
        size: 22,
        color: PDFLib.rgb(0.7, 0.55, 0.2),
      });
    });

    // ============================================
    // PÁGINAS DE CONTEÚDO
    // ============================================
    const fichas = grimorio?.fichas || [];
    if (fichas.length > 0) {
      const tituloPag = pdfDoc.addPage([595, 842]);
      tituloPag.drawText('📋 FICHAS ARCANAS', {
        x: 50, y: 780,
        size: 24,
        color: PDFLib.rgb(0.85, 0.7, 0.25),
      });

      let yPos = 730;
      fichas.forEach((ficha, idx) => {
        if (yPos < 80) {
          const novaPag = pdfDoc.addPage([595, 842]);
          yPos = 780;
        }

        tituloPag.drawText(`${idx + 1}. ${ficha.nome || 'Sem Nome'}`, {
          x: 50, y: yPos,
          size: 14,
          color: PDFLib.rgb(0.8, 0.75, 0.6),
        });
        yPos -= 20;

        if (ficha.classe) {
          tituloPag.drawText(`   Classe: ${ficha.classe}  |  Raça: ${ficha.raca || 'N/A'}  |  Nível: ${ficha.nivel || 1}`, {
            x: 50, y: yPos,
            size: 11,
            color: PDFLib.rgb(0.6, 0.55, 0.45),
          });
          yPos -= 18;
        }

        if (ficha.atributos) {
          tituloPag.drawText(`   Atributos: ${JSON.stringify(ficha.atributos)}`, {
            x: 50, y: yPos,
            size: 10,
            color: PDFLib.rgb(0.5, 0.45, 0.4),
          });
          yPos -= 16;
        }

        yPos -= 12;
      });
    }

    // Página de notas
    if (grimorio?.notas) {
      const notasPag = pdfDoc.addPage([595, 842]);
      notasPag.drawText('📝 NOTAS DO GRIMÓRIO', {
        x: 50, y: 780,
        size: 22,
        color: PDFLib.rgb(0.85, 0.7, 0.25),
      });

      const linhas = grimorio.notas.split('\n');
      let y = 730;
      linhas.forEach(linha => {
        if (y < 60) {
          const novaPag = pdfDoc.addPage([595, 842]);
          y = 780;
        }
        notasPag.drawText(linha || ' ', {
          x: 50, y: y,
          size: 11,
          color: PDFLib.rgb(0.7, 0.65, 0.55),
        });
        y -= 16;
      });
    }

    // ============================================
    // APLICA CRIPTOGRAFIA NO PDF
    // ============================================
    const pdfBytes = await pdfDoc.encrypt({
      userPassword: senhaPDF,
      ownerPassword: `${senhaPDF}_owner_mestre`,
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

    return pdfBytes;
  },

  /**
   * Dispara o download do PDF criptografado
   */
  baixar: async (grimorio, senhaPDF, nomeArquivo = 'Grimorio_Arcano') => {
    try {
      const pdfBytes = await PDF_EXPORT.gerar(grimorio, senhaPDF);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${nomeArquivo}_${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return { sucesso: true };
    } catch (erro) {
      console.error('Erro ao gerar PDF:', erro);
      return { sucesso: false, erro: erro.message };
    }
  },
};

async function exportarGrimorioPDF() {
  // Carrega os dados salvos
  const senha = prompt('🔐 Digite sua senha mestra para descriptografar os dados:');
  if (!senha) return alert('❌ Senha necessária!');

  try {
    const dadosEnc = localStorage.getItem('dados_test'); // ⚠️ ajuste para sua chave real
    if (!dadosEnc) return alert('⚠️ Nenhum grimório salvo encontrado!');

    const grimorio = await carregaDados(dadosEnc, senha);

    // Pergunta a senha do PDF (pode ser a mesma ou diferente)
    const senhaPDF = prompt('🔒 Defina a senha para proteger o PDF (ou use a mesma senha mestra):', senha);
    if (!senhaPDF) return alert('❌ O PDF precisa de uma senha!');

    alert('⏳ Gerando PDF criptografado... Isso pode levar alguns segundos.');

    const resultado = await PDF_EXPORT.baixar(grimorio, senhaPDF, `Grimorio_${grimorio.usuario?.nome || 'Arcano'}`);

    if (resultado.sucesso) {
      alert('✅ Grimório exportado com sucesso! O PDF está protegido com senha.');
    } else {
      alert(`❌ Erro ao exportar: ${resultado.erro}`);
    }
  } catch (e) {
    alert(`❌ Erro: ${e.message}\nVerifique sua senha mestra.`);
  }
}

// ============================================
// 📜 PDF CRIPTOGRAFADO – GRIMÓRIO COMPLETO
// ============================================

const PDF_EXPORT = {

  /**
   * Gera o PDF com TUDO que está no grimório
   * @param {Object} grimorio - Objeto completo descriptografado
   * @param {string} senhaPDF - Senha que travará o PDF
   * @returns {Promise<Uint8Array>}
   */
  gerar: async (grimorio, senhaPDF) => {
    const { PDFDocument, rgb, StandardEncryption, EncryptionAlgorithm } = PDFLib;

    const pdf = await PDFDocument.create();
    const A4 = [595, 842];

    // ============================================
    // 📖 CAPA
    // ============================================
    let page = pdf.addPage(A4);
    const { width, height } = page.getSize();

    // Fundo
    page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(0.06, 0.04, 0.10) });

    // Molduras
    page.drawRectangle({ x: 25, y: 25, width: width - 50, height: height - 50, borderColor: rgb(0.75, 0.60, 0.22), borderWidth: 3 });
    page.drawRectangle({ x: 35, y: 35, width: width - 70, height: height - 70, borderColor: rgb(0.50, 0.35, 0.12), borderWidth: 1.5 });

    page.drawText('⚝  GRIMÓRIO ARCANO  ⚝', { x: 100, y: 650, size: 34, color: rgb(0.88, 0.72, 0.28) });
    page.drawText('Livro de Sombras & Fichas', { x: 165, y: 610, size: 15, color: rgb(0.60, 0.48, 0.18) });

    page.drawLine({ start: { x: 140, y: 590 }, end: { x: 455, y: 590 }, thickness: 1, color: rgb(0.70, 0.55, 0.20) });

    const nome = grimorio?.usuario?.nome || 'Mago Anônimo';
    page.drawText(`Pertence a: ${nome}`, { x: 110, y: 530, size: 18, color: rgb(0.82, 0.78, 0.62) });
    page.drawText(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, { x: 110, y: 500, size: 13, color: rgb(0.45, 0.40, 0.32) });
    page.drawText('🔒 PDF protegido por senha', { x: 110, y: 445, size: 12, color: rgb(0.65, 0.30, 0.18) });

    ['☽', '☀', '✧', '⚝'].forEach((s, i) => {
      const pos = [[45, 790], [520, 790], [45, 45], [520, 45]];
      page.drawText(s, { x: pos[i][0], y: pos[i][1], size: 22, color: rgb(0.72, 0.58, 0.20) });
    });

    // ============================================
    // 📋 FICHAS (cada ficha em detalhes)
    // ============================================
    const fichas = grimorio?.fichas || [];
    if (fichas.length > 0) {
      fichas.forEach((ficha, i) => {
        page = pdf.addPage(A4);
        let y = 790;

        page.drawText(`📋 Ficha #${i + 1}: ${ficha.nome || 'Sem Nome'}`, { x: 45, y, size: 22, color: rgb(0.88, 0.72, 0.28) });
        y -= 35;

        const campos = [
          ['Classe', ficha.classe],
          ['Raça', ficha.raca],
          ['Nível', ficha.nivel],
          ['Alinhamento', ficha.alinhamento],
          ['Antecedente', ficha.antecedente],
          ['XP', ficha.xp],
        ];

        campos.forEach(([label, val]) => {
          if (val !== undefined && val !== null && val !== '') {
            page.drawText(`${label}: ${val}`, { x: 55, y, size: 12, color: rgb(0.78, 0.74, 0.58) });
            y -= 20;
          }
        });

        // Atributos
        if (ficha.atributos && Object.keys(ficha.atributos).length > 0) {
          y -= 8;
          page.drawText('Atributos:', { x: 55, y, size: 13, color: rgb(0.85, 0.70, 0.25) });
          y -= 20;
          Object.entries(ficha.atributos).forEach(([attr, val]) => {
            page.drawText(`  ${attr}: ${val}`, { x: 65, y, size: 11, color: rgb(0.65, 0.60, 0.50) });
            y -= 17;
          });
        }

        // Perícias
        if (ficha.pericias && ficha.pericias.length > 0) {
          y -= 8;
          page.drawText('Perícias:', { x: 55, y, size: 13, color: rgb(0.85, 0.70, 0.25) });
          y -= 20;
          ficha.pericias.forEach(p => {
            page.drawText(`  • ${p}`, { x: 65, y, size: 11, color: rgb(0.65, 0.60, 0.50) });
            y -= 17;
          });
        }

        // Magias
        if (ficha.magias && ficha.magias.length > 0) {
          y -= 8;
          page.drawText('Magias:', { x: 55, y, size: 13, color: rgb(0.85, 0.70, 0.25) });
          y -= 20;
          ficha.magias.forEach(m => {
            page.drawText(`  ✦ ${m}`, { x: 65, y, size: 11, color: rgb(0.55, 0.50, 0.60) });
            y -= 17;
          });
        }

        // Inventário
        if (ficha.inventario && ficha.inventario.length > 0) {
          if (y < 120) { page = pdf.addPage(A4); y = 790; }
          y -= 8;
          page.drawText('Inventário:', { x: 55, y, size: 13, color: rgb(0.85, 0.70, 0.25) });
          y -= 20;
          ficha.inventario.forEach(item => {
            page.drawText(`  🎒 ${item}`, { x: 65, y, size: 11, color: rgb(0.60, 0.55, 0.45) });
            y -= 17;
          });
        }

        // Anotações da ficha
        if (ficha.anotacoes) {
          if (y < 120) { page = pdf.addPage(A4); y = 790; }
          y -= 8;
          page.drawText('Anotações:', { x: 55, y, size: 13, color: rgb(0.85, 0.70, 0.25) });
          y -= 20;
          ficha.anotacoes.split('\n').forEach(linha => {
            page.drawText(linha || ' ', { x: 65, y, size: 10, color: rgb(0.55, 0.50, 0.45) });
            y -= 15;
          });
        }
      });
    } else {
      // Nenhuma ficha
      page = pdf.addPage(A4);
      page.drawText('📭 Nenhuma ficha encontrada no grimório.', { x: 60, y: 750, size: 16, color: rgb(0.60, 0.55, 0.40) });
    }

    // ============================================
    // 📝 NOTAS GERAIS
    // ============================================
    if (grimorio?.notas && grimorio.notas.trim()) {
      page = pdf.addPage(A4);
      let y = 790;
      page.drawText('📝 Notas do Grimório', { x: 45, y, size: 22, color: rgb(0.88, 0.72, 0.28) });
      y -= 35;

      grimorio.notas.split('\n').forEach(linha => {
        if (y < 60) { page = pdf.addPage(A4); y = 790; }
        page.drawText(linha || ' ', { x: 55, y, size: 11, color: rgb(0.68, 0.62, 0.52) });
        y -= 16;
      });
    }

    // ============================================
    // 📊 RESUMO FINAL (metadados)
    // ============================================
    page = pdf.addPage(A4);
    page.drawText('📊 Resumo do Grimório', { x: 45, y: 790, size: 20, color: rgb(0.88, 0.72, 0.28) });
    page.drawText(`Total de fichas: ${fichas.length}`, { x: 55, y: 745, size: 13, color: rgb(0.78, 0.74, 0.58) });
    page.drawText(`Usuário: ${nome}`, { x: 55, y: 720, size: 13, color: rgb(0.78, 0.74, 0.58) });
    page.drawText(`Exportado em: ${new Date().toLocaleString('pt-BR')}`, { x: 55, y: 695, size: 12, color: rgb(0.50, 0.45, 0.38) });
    page.drawText('🔒 Este documento é criptografado. Apenas quem possui a senha pode abri-lo.', { x: 55, y: 650, size: 10, color: rgb(0.60, 0.30, 0.20) });

    // ============================================
    // 🔐 CRIPTOGRAFA O PDF
    // ============================================
    const pdfBytes = await pdf.encrypt({
      userPassword: senhaPDF,
      ownerPassword: `${senhaPDF}_mestre_arcano`,
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

    return pdfBytes;
  },

  /**
   * Dispara o download
   */
  baixar: async (grimorio, senhaPDF, nomeArquivo = 'Grimorio_Arcano') => {
    const pdfBytes = await PDF_EXPORT.gerar(grimorio, senhaPDF);
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${nomeArquivo.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return { sucesso: true };
  },
};

async function exportarTudoPDF() {
  // 1. Pede a senha mestra
  const senhaMestra = prompt('🔐 Digite sua senha mestra para acessar o grimório:');
  if (!senhaMestra) return;

  // 2. Puxa os dados criptografados do localStorage
  // ⚠️ Ajuste a chave abaixo para a que você usa!
  const dadosCriptografados = localStorage.getItem('grimorio_dados');
  if (!dadosCriptografados) {
    alert('⚠️ Nenhum grimório salvo encontrado!');
    return;
  }

  try {
    // 3. Descriptografa (usa SUA função existente)
    const grimorio = await carregaDados(dadosCriptografados, senhaMestra);

    // 4. Define a senha do PDF
    const senhaPDF = prompt(
      '🔒 Defina a senha do PDF (deixe em branco para usar a mesma senha mestra):',
      senhaMestra
    ) || senhaMestra;

    alert('⏳ Gerando PDF criptografado... Aguarde.');

    // 5. Gera e baixa
    const resultado = await PDF_EXPORT.baixar(
      grimorio,
      senhaPDF,
      `Grimorio_${grimorio.usuario?.nome || 'Completo'}`
    );

    if (resultado.sucesso) {
      alert('✅ PDF exportado com sucesso! O arquivo está protegido por senha.');
    }
  } catch (erro) {
    console.error(erro);
    alert(`❌ Falha ao exportar: ${erro.message}\nVerifique se a senha está correta.`);
  }
}

// ============================================
// ⚙️ CONFIGURAÇÃO
// ============================================
const CONFIG = {
  STORAGE_KEY: 'grimorio_arcano_dados', // chave do localStorage
};

// ============================================
// 🔐 CRIPTOGRAFIA / DESCRIPTOGRAFIA
// ============================================
const CRYPTO = {
  // Gera chave a partir da senha
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

  // Criptografa objeto → string base64
  encrypt: async (obj, password) => {
    const enc = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await CRYPTO.deriveKey(password, salt);
    const data = enc.encode(JSON.stringify(obj));
    const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);

    // Junta salt + iv + ciphertext
    const combined = new Uint8Array(salt.length + iv.length + cipher.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(cipher), salt.length + iv.length);
    return btoa(String.fromCharCode(...combined));
  },

  // Descriptografa string base64 → objeto
  decrypt: async (encryptedStr, password) => {
    const enc = new TextEncoder();
    const combined = Uint8Array.from(atob(encryptedStr), c => c.charCodeAt(0));
    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const ciphertext = combined.slice(28);
    const key = await CRYPTO.deriveKey(password, salt);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
    return JSON.parse(new TextDecoder().decode(decrypted));
  },
};

// ============================================
// 📥 COLETA OS DADOS DO FORMULÁRIO
// ============================================
function coletarDados() {
  // ⚠️ Ajuste os seletores conforme seus campos!
  const fichas = [];
  const containerFichas = document.querySelectorAll('.ficha-item'); // container de cada ficha

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
    usuario: {
      nome: document.querySelector('#usuario-nome')?.value || 'Mago Anônimo',
    },
    fichas: fichas,
    notas: document.querySelector('#notas-gerais')?.value || '',
    ultimaAlteracao: new Date().toISOString(),
  };
}

// ============================================
// 📤 PREENCHE O FORMULÁRIO COM DADOS
// ============================================
function preencherFormulario(dados) {
  // Nome do usuário
  const campoNome = document.querySelector('#usuario-nome');
  if (campoNome) campoNome.value = dados.usuario?.nome || '';

  // Notas gerais
  const campoNotas = document.querySelector('#notas-gerais');
  if (campoNotas) campoNotas.value = dados.notas || '';

  // Fichas – remove existentes e recria
  const container = document.querySelector('#fichas-container');
  if (container && dados.fichas) {
    container.innerHTML = '';
    dados.fichas.forEach(ficha => {
      // ⚠️ Essa parte depende da sua estrutura HTML de ficha
      // Se tiver uma função criarFicha(), chame ela aqui
      if (typeof criarFicha === 'function') {
        criarFicha(ficha); // preenche com os dados
      }
    });
  }
}

// ============================================
// 💾 BOTÃO: SALVAR
// ============================================
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

// ============================================
// 📂 BOTÃO: CARREGAR
// ============================================
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

// ============================================
// 📜 BOTÃO: EXPORTAR PDF
// ============================================
async function botaoExportarPDF() {
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

// ============================================
// 🗑️ BOTÃO: LIMPAR TUDO
// ============================================
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

// ============================================
// 📜 PDF EXPORT (versão simplificada para o sistema)
// ============================================
const PDF_EXPORT = {
  gerar: async (grimorio, senhaPDF) => {
    const { PDFDocument, rgb, EncryptionAlgorithm } = PDFLib;
    const pdf = await PDFDocument.create();
    const A4 = [595, 842];
    let page = pdf.addPage(A4);

    // Capa
    page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: rgb(0.06, 0.04, 0.10) });
    page.drawRectangle({ x: 25, y: 25, width: 545, height: 792, borderColor: rgb(0.75, 0.60, 0.22), borderWidth: 3 });

    page.drawText('⚝  GRIMÓRIO ARCANO  ⚝', { x: 100, y: 650, size: 34, color: rgb(0.88, 0.72, 0.28) });
    page.drawText(`Pertence a: ${grimorio.usuario?.nome || 'Mago Anônimo'}`, { x: 110, y: 540, size: 16, color: rgb(0.82, 0.78, 0.62) });
    page.drawText(`Fichas: ${grimorio.fichas?.length || 0}`, { x: 110, y: 510, size: 14, color: rgb(0.65, 0.60, 0.50) });
    page.drawText(`Exportado: ${new Date().toLocaleString('pt-BR')}`, { x: 110, y: 485, size: 12, color: rgb(0.50, 0.45, 0.38) });
    page.drawText('🔒 PDF protegido por senha', { x: 110, y: 440, size: 12, color: rgb(0.65, 0.30, 0.18) });

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
      permissions: { printing: 'highResolution', copying: false, modifying: false, annotating: true, fillingForms: true, contentAccessibility: true, documentAssembly: false },
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

// ============================================
// 🩺 VERIFICA SE HÁ DADOS SALVOS (ao carregar a página)
// ============================================
window.addEventListener('DOMContentLoaded', () => {
  const salvo = localStorage.getItem(CONFIG.STORAGE_KEY);
  const statusEl = document.querySelector('#status-salvamento');
  if (statusEl) {
    statusEl.textContent = salvo ? '🟢 Grimório salvo (criptografado)' : '🔴 Nenhum grimório salvo';
  }
});

async function exportarTudoPDF() {
  // 1. Pede a senha mestra
  const senhaMestra = prompt('🔐 Digite sua senha mestra para acessar o grimório:');
  if (!senhaMestra) return;

  // 2. Puxa os dados criptografados do localStorage
  // ⚠️ Ajuste a chave abaixo para a que você usa!
  const dadosCriptografados = localStorage.getItem('grimorio_dados');
  if (!dadosCriptografados) {
    alert('⚠️ Nenhum grimório salvo encontrado!');
    return;
  }

  try {
    // 3. Descriptografa (usa SUA função existente)
    const grimorio = await carregaDados(dadosCriptografados, senhaMestra);

    // 4. Define a senha do PDF
    const senhaPDF = prompt(
      '🔒 Defina a senha do PDF (deixe em branco para usar a mesma senha mestra):',
      senhaMestra
    ) || senhaMestra;

    alert('⏳ Gerando PDF criptografado... Aguarde.');

    // 5. Gera e baixa
    const resultado = await PDF_EXPORT.baixar(
      grimorio,
      senhaPDF,
      `Grimorio_${grimorio.usuario?.nome || 'Completo'}`
    );

    if (resultado.sucesso) {
      alert('✅ PDF exportado com sucesso! O arquivo está protegido por senha.');
    }
  } catch (erro) {
    console.error(erro);
    alert(`❌ Falha ao exportar: ${erro.message}\nVerifique se a senha está correta.`);
  }
}

<button onclick="exportarTudoPDF()"
        style="background:#1a1025; color:#d4af37; padding:12px 24px;
               border:2px solid #d4af37; border-radius:8px; cursor:pointer;
               font-size:16px; font-weight:bold; transition:0.3s;"
        onmouseover="this.style.background='#2d1a3d'"
        onmouseout="this.style.background='#1a1025'">
  📜 Baixar Grimório Completo (PDF)
</button>

// ============================================
// ⚙️ CONFIGURAÇÃO
// ============================================
const CONFIG = {
  STORAGE_KEY: 'grimorio_arcano_dados', // chave do localStorage
};

// ============================================
// 🔐 CRIPTOGRAFIA / DESCRIPTOGRAFIA
// ============================================
const CRYPTO = {
  // Gera chave a partir da senha
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

  // Criptografa objeto → string base64
  encrypt: async (obj, password) => {
    const enc = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await CRYPTO.deriveKey(password, salt);
    const data = enc.encode(JSON.stringify(obj));
    const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);

    // Junta salt + iv + ciphertext
    const combined = new Uint8Array(salt.length + iv.length + cipher.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(cipher), salt.length + iv.length);
    return btoa(String.fromCharCode(...combined));
  },

  // Descriptografa string base64 → objeto
  decrypt: async (encryptedStr, password) => {
    const enc = new TextEncoder();
    const combined = Uint8Array.from(atob(encryptedStr), c => c.charCodeAt(0));
    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const ciphertext = combined.slice(28);
    const key = await CRYPTO.deriveKey(password, salt);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
    return JSON.parse(new TextDecoder().decode(decrypted));
  },
};

// ============================================
// 📥 COLETA OS DADOS DO FORMULÁRIO
// ============================================
function coletarDados() {
  // ⚠️ Ajuste os seletores conforme seus campos!
  const fichas = [];
  const containerFichas = document.querySelectorAll('.ficha-item'); // container de cada ficha

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
    usuario: {
      nome: document.querySelector('#usuario-nome')?.value || 'Mago Anônimo',
    },
    fichas: fichas,
    notas: document.querySelector('#notas-gerais')?.value || '',
    ultimaAlteracao: new Date().toISOString(),
  };
}

// ============================================
// 📤 PREENCHE O FORMULÁRIO COM DADOS
// ============================================
function preencherFormulario(dados) {
  // Nome do usuário
  const campoNome = document.querySelector('#usuario-nome');
  if (campoNome) campoNome.value = dados.usuario?.nome || '';

  // Notas gerais
  const campoNotas = document.querySelector('#notas-gerais');
  if (campoNotas) campoNotas.value = dados.notas || '';

  // Fichas – remove existentes e recria
  const container = document.querySelector('#fichas-container');
  if (container && dados.fichas) {
    container.innerHTML = '';
    dados.fichas.forEach(ficha => {
      // ⚠️ Essa parte depende da sua estrutura HTML de ficha
      // Se tiver uma função criarFicha(), chame ela aqui
      if (typeof criarFicha === 'function') {
        criarFicha(ficha); // preenche com os dados
      }
    });
  }
}

// ============================================
// 💾 BOTÃO: SALVAR
// ============================================
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

// ============================================
// 📂 BOTÃO: CARREGAR
// ============================================
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

// ============================================
// 📜 BOTÃO: EXPORTAR PDF
// ============================================
async function botaoExportarPDF() {
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

// ============================================
// 🗑️ BOTÃO: LIMPAR TUDO
// ============================================
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

// ============================================
// 📜 PDF EXPORT (versão simplificada para o sistema)
// ============================================
const PDF_EXPORT = {
  gerar: async (grimorio, senhaPDF) => {
    const { PDFDocument, rgb, EncryptionAlgorithm } = PDFLib;
    const pdf = await PDFDocument.create();
    const A4 = [595, 842];
    let page = pdf.addPage(A4);

    // Capa
    page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: rgb(0.06, 0.04, 0.10) });
    page.drawRectangle({ x: 25, y: 25, width: 545, height: 792, borderColor: rgb(0.75, 0.60, 0.22), borderWidth: 3 });

    page.drawText('⚝  GRIMÓRIO ARCANO  ⚝', { x: 100, y: 650, size: 34, color: rgb(0.88, 0.72, 0.28) });
    page.drawText(`Pertence a: ${grimorio.usuario?.nome || 'Mago Anônimo'}`, { x: 110, y: 540, size: 16, color: rgb(0.82, 0.78, 0.62) });
    page.drawText(`Fichas: ${grimorio.fichas?.length || 0}`, { x: 110, y: 510, size: 14, color: rgb(0.65, 0.60, 0.50) });
    page.drawText(`Exportado: ${new Date().toLocaleString('pt-BR')}`, { x: 110, y: 485, size: 12, color: rgb(0.50, 0.45, 0.38) });
    page.drawText('🔒 PDF protegido por senha', { x: 110, y: 440, size: 12, color: rgb(0.65, 0.30, 0.18) });

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
      permissions: { printing: 'highResolution', copying: false, modifying: false, annotating: true, fillingForms: true, contentAccessibility: true, documentAssembly: false },
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

// ============================================
// 🩺 VERIFICA SE HÁ DADOS SALVOS (ao carregar a página)
// ============================================
window.addEventListener('DOMContentLoaded', () => {
  const salvo = localStorage.getItem(CONFIG.STORAGE_KEY);
  const statusEl = document.querySelector('#status-salvamento');
  if (statusEl) {
    statusEl.textContent = salvo ? '🟢 Grimório salvo (criptografado)' : '🔴 Nenhum grimório salvo';
  }
});

async function baixarPDF() {
  const { PDFDocument, rgb } = PDFLib;
  const pdf = await PDFDocument.create();
  const A4 = [595, 842];

  // ⚠️ Ajuste os seletores abaixo para os seus campos!
  const valor = (id) => document.getElementById(id)?.value || '';

  const nome = valor('nome-personagem') || 'Sem Nome';
  const classe = valor('classe') || 'N/A';
  const raca = valor('raca') || 'N/A';
  const nivel = valor('nivel') || '1';
  const xp = valor('xp') || '0';
  const anotacoes = valor('anotacoes') || '';

  // ============ CAPA ============
  let page = pdf.addPage(A4);
  page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: rgb(0.06, 0.04, 0.10) });
  page.drawRectangle({ x: 25, y: 25, width: 545, height: 792, borderColor: rgb(0.75, 0.60, 0.22), borderWidth: 3 });

  page.drawText('GRIMORIO ARCANO', { x: 140, y: 650, size: 32, color: rgb(0.88, 0.72, 0.28) });
  page.drawText(`Personagem: ${nome}`, { x: 110, y: 540, size: 16, color: rgb(0.82, 0.78, 0.62) });
  page.drawText(`Classe: ${classe}  |  Raca: ${raca}`, { x: 110, y: 510, size: 13, color: rgb(0.65, 0.60, 0.50) });
  page.drawText(`Nivel: ${nivel}  |  XP: ${xp}`, { x: 110, y: 485, size: 13, color: rgb(0.65, 0.60, 0.50) });
  page.drawText(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, { x: 110, y: 455, size: 12, color: rgb(0.50, 0.45, 0.38) });

  // ============ PÁGINA DE ANOTAÇÕES ============
  if (anotacoes.trim()) {
    page = pdf.addPage(A4);
    page.drawText('Anotacoes', { x: 45, y: 790, size: 22, color: rgb(0.88, 0.72, 0.28) });
    let y = 750;
    anotacoes.split('\n').forEach(linha => {
      if (y < 60) { page = pdf.addPage(A4); y = 790; }
      page.drawText(linha || ' ', { x: 55, y, size: 11, color: rgb(0.68, 0.62, 0.52) });
      y -= 16;
    });
  }

  // ============ DOWNLOAD ============
  const pdfBytes = await pdf.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Ficha_${nome.replace(/\s+/g, '_')}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

const nome = valor('nome-personagem') || 'Sem Nome';  // ← coloque o ID real
const classe = valor('classe') || 'N/A';              // ← coloque o ID real
const raca = valor('raca') || 'N/A';                  // ← coloque o ID real
// ... etc

// ============================================
// 🔓 DESCRIPTOGRAFIA
// ============================================

async function descriptografarDados(dadosCriptografados, senha) {
  const enc = new TextEncoder();
  const dec = new TextDecoder();

  // 1. Converte a string base64 para Uint8Array
  const combined = Uint8Array.from(atob(dadosCriptografados), c => c.charCodeAt(0));

  // 2. Extrai as partes: salt (16 bytes) + iv (12 bytes) + ciphertext (o resto)
  const salt = combined.slice(0, 16);
  const iv = combined.slice(16, 28);
  const ciphertext = combined.slice(28);

  // 3. Deriva a chave a partir da senha
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(senha),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 200000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  // 4. Descriptografa
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    ciphertext
  );

  // 5. Converte para texto e depois para objeto JSON
  return JSON.parse(dec.decode(decrypted));
}

async function carregarGrimorio() {
  const dadosCriptografados = localStorage.getItem('grimorio_arcano_dados');

  if (!dadosCriptografados) {
    alert('⚠️ Nenhum grimório salvo encontrado!');
    return null;
  }

  const senha = prompt('🔐 Digite a senha mestra:');
  if (!senha) return null;

  try {
    const dados = await descriptografarDados(dadosCriptografados, senha);
    console.log('✅ Dados descriptografados:', dados);
    alert('✅ Grimório carregado com sucesso!');
    return dados; // ← objeto com tudo (fichas, notas, usuário, etc.)
  } catch (erro) {
    console.error(erro);
    alert('❌ Senha incorreta ou dados corrompidos!');
    return null;
  }
}

// ═══════ Sistema de Modo: Mestre / Jogador ═══════
const ROLE_KEY = 'grimorio_role';

function getUserRoleKey() {
    const session = getSession();
    if (!session) return ROLE_KEY;
    return ROLE_KEY + '_' + btoa(session.email).replace(/[^a-zA-Z0-9]/g,'');
}

function setRole(role) {
    if (role !== 'mestre' && role !== 'jogador') return;
    localStorage.setItem(getUserRoleKey(), role);
    applyRole(role);
    showToast(role === 'mestre' ? '👑 Modo Mestre ativado!' : '⚔️ Modo Jogador ativado!');
}

function applyRole(role) {
    document.body.classList.remove('modo-mestre', 'modo-jogador');
    document.body.classList.add('modo-' + role);
    document.querySelectorAll('#roleToggle button').forEach(btn => {
        btn.classList.remove('active-mestre', 'active-jogador');
        if (btn.dataset.role === role) {
            btn.classList.add('active-' + role);
        }
    });
}

function getCurrentRole() {
    return localStorage.getItem(getUserRoleKey()) || 'jogador';
}

// Chamar ao iniciar o grimório (dentro de initGrimoire ou após login):
// applyRole(getCurrentRole());

applyRole(getCurrentRole());

const modo = getCurrentRole() === 'mestre' ? '👑 MESTRE' : '⚔️ JOGADOR';
page.drawText(`Modo: ${modo}  |  Geração: ${new Date().toLocaleDateString('pt-BR')}`, 
    { x:80, y:425, size:12, color:rgb(0.50,0.45,0.38) });

    // ═══════ Modo Mestre / Jogador ═══════
function setRole(role) {
    localStorage.setItem('grimorio_role', role);
    applyRole(role);
    showToast(role === 'mestre' ? '👑 Modo Mestre!' : '⚔️ Modo Jogador!');
}

function applyRole(role) {
    document.body.classList.remove('modo-mestre', 'modo-jogador');
    document.body.classList.add('modo-' + role);
    
    document.getElementById('btnMestre').classList.remove('ativo');
    document.getElementById('btnJogador').classList.remove('ativo');
    
    if (role === 'mestre') {
        document.getElementById('btnMestre').classList.add('ativo');
    } else {
        document.getElementById('btnJogador').classList.add('ativo');
    }
}

function getCurrentRole() {
    return localStorage.getItem('grimorio_role') || 'jogador';
}

applyRole(getCurrentRole());

// ═══════ Troca de abas (suporta ambos os grupos) ═══════
function showTab(tabId, btn, grupoId) {
    const grupo = document.getElementById(grupoId);
    const todasTabs = grupo.parentElement.querySelectorAll('.tab-content');
    todasTabs.forEach(t => {
        if (t.closest('#stageGrimoire') || t.parentElement === grupo.parentElement) {
            // esconde só as do grupo atual
        }
    });
    // Esconde todas as tab-content do stage
    document.querySelectorAll('#stageGrimoire > .tab-content').forEach(t => t.style.display = 'none');
    document.getElementById(tabId).style.display = 'block';
    // Ativa botão
    grupo.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

// ═══════ Alternar entre modo Mestre e Jogador ═══════
function setRole(role) {
    localStorage.setItem('grimorio_role', role);
    applyRole(role);
    showToast(role === 'mestre' ? '👑 Modo Mestre!' : '⚔️ Modo Jogador!');
}

function applyRole(role) {
    document.body.classList.remove('modo-mestre', 'modo-jogador');
    document.body.classList.add('modo-' + role);
    
    const btnM = document.getElementById('btnMestre');
    const btnJ = document.getElementById('btnJogador');
    if (btnM) btnM.classList.toggle('ativo', role === 'mestre');
    if (btnJ) btnJ.classList.toggle('ativo', role === 'jogador');
    
    // Alterna abas
    document.getElementById('abasJogador').style.display = (role === 'jogador') ? 'flex' : 'none';
    document.getElementById('abasMestre').style.display = (role === 'mestre') ? 'flex' : 'none';
    
    // Esconde tudo e mostra a primeira do grupo ativo
    document.querySelectorAll('#stageGrimoire > .tab-content').forEach(t => t.style.display = 'none');
    if (role === 'mestre') {
        document.getElementById('tabNPCs').style.display = 'block';
    } else {
        document.getElementById('tabPersonagem').style.display = 'block';
    }
}

function getCurrentRole() {
    return localStorage.getItem('grimorio_role') || 'jogador';
}

// ═══════ NPCs ═══════
function addNPC() {
    const nome = document.getElementById('npcNome').value.trim();
    const funcao = document.getElementById('npcFuncao').value.trim();
    if (!nome) return showToast('⚠️ Informe o nome');
    const lista = JSON.parse(localStorage.getItem('grimorio_npcs') || '[]');
    lista.push({ nome, funcao, id: Date.now() });
    localStorage.setItem('grimorio_npcs', JSON.stringify(lista));
    document.getElementById('npcNome').value = '';
    document.getElementById('npcFuncao').value = '';
    renderNPCs();
    showToast('✅ NPC adicionado');
}
function renderNPCs() {
    const lista = JSON.parse(localStorage.getItem('grimorio_npcs') || '[]');
    document.getElementById('listaNPCs').innerHTML = lista.length
        ? lista.map(n => `<div class="item-card"><div><strong>${n.nome}</strong><small>${n.funcao||''}</small></div><button class="btn-sm" style="background:var(--danger);" onclick="delNPC(${n.id})">×</button></div>`).join('')
        : '<p style="color:var(--text-muted);text-align:center;padding:20px;">Nenhum NPC cadastrado</p>';
}
function delNPC(id) {
    let lista = JSON.parse(localStorage.getItem('grimorio_npcs') || '[]');
    lista = lista.filter(n => n.id !== id);
    localStorage.setItem('grimorio_npcs', JSON.stringify(lista));
    renderNPCs();
}

// ═══════ ENCONTROS ═══════
function addEncontro() {
    const nome = document.getElementById('encNome').value.trim();
    const nd = document.getElementById('encND').value;
    const detalhes = document.getElementById('encDetalhes').value.trim();
    if (!nome) return showToast('⚠️ Informe o nome');
    const lista = JSON.parse(localStorage.getItem('grimorio_encontros') || '[]');
    lista.push({ nome, nd, detalhes, id: Date.now() });
    localStorage.setItem('grimorio_encontros', JSON.stringify(lista));
    document.getElementById('encNome').value = '';
    document.getElementById('encND').value = '';
    document.getElementById('encDetalhes').value = '';
    renderEncontros();
}
function renderEncontros() {
    const lista = JSON.parse(localStorage.getItem('grimorio_encontros') || '[]');
    document.getElementById('listaEncontros').innerHTML = lista.length
        ? lista.map(e => `<div class="item-card"><div><strong>${e.nome}</strong><small>ND ${e.nd||'?'} — ${e.detalhes||''}</small></div><button class="btn-sm" style="background:var(--danger);" onclick="delEncontro(${e.id})">×</button></div>`).join('')
        : '<p style="color:var(--text-muted);text-align:center;padding:20px;">Nenhum encontro cadastrado</p>';
}
function delEncontro(id) {
    let l = JSON.parse(localStorage.getItem('grimorio_encontros') || '[]');
    l = l.filter(e => e.id !== id);
    localStorage.setItem('grimorio_encontros', JSON.stringify(l));
    renderEncontros();
}

// ═══════ SESSÕES ═══════
function addSessao() {
    const data = document.getElementById('sessData').value;
    const titulo = document.getElementById('sessTitulo').value.trim();
    const notas = document.getElementById('sessNotas').value.trim();
    if (!titulo) return showToast('⚠️ Informe o título');
    const lista = JSON.parse(localStorage.getItem('grimorio_sessoes') || '[]');
    lista.push({ data, titulo, notas, id: Date.now() });
    localStorage.setItem('grimorio_sessoes', JSON.stringify(lista));
    document.getElementById('sessTitulo').value = '';
    document.getElementById('sessNotas').value = '';
    renderSessoes();
}
function renderSessoes() {
    const lista = JSON.parse(localStorage.getItem('grimorio_sessoes') || '[]');
    document.getElementById('listaSessoes').innerHTML = lista.length
        ? lista.map(s => `<div class="item-card"><div><strong>${s.data||'—'} • ${s.titulo}</strong><small>${s.notas||''}</small></div><button class="btn-sm" style="background:var(--danger);" onclick="delSessao(${s.id})">×</button></div>`).join('')
        : '<p style="color:var(--text-muted);text-align:center;padding:20px;">Nenhuma sessão registrada</p>';
}
function delSessao(id) {
    let l = JSON.parse(localStorage.getItem('grimorio_sessoes') || '[]');
    l = l.filter(s => s.id !== id);
    localStorage.setItem('grimorio_sessoes', JSON.stringify(l));
    renderSessoes();
}

// ═══════ MUNDO ═══════
function addMundo() {
    const tipo = document.getElementById('mundoTipo').value;
    const nome = document.getElementById('mundoNome').value.trim();
    const desc = document.getElementById('mundoDesc').value.trim();
    if (!nome) return showToast('⚠️ Informe o nome');
    const lista = JSON.parse(localStorage.getItem('grimorio_mundo') || '[]');
    lista.push({ tipo, nome, desc, id: Date.now() });
    localStorage.setItem('grimorio_mundo', JSON.stringify(lista));
    document.getElementById('mundoNome').value = '';
    document.getElementById('mundoDesc').value = '';
    renderMundo();
}
function renderMundo() {
    const icones = { local:'📍', faccao:'⚜️', historia:'📖', regra:'📜' };
    const lista = JSON.parse(localStorage.getItem('grimorio_mundo') || '[]');
    document.getElementById('listaMundo').innerHTML = lista.length
        ? lista.map(m => `<div class="item-card"><div><strong>${icones[m.tipo]||''} ${m.nome}</strong><small>${m.tipo} — ${m.desc||''}</small></div><button class="btn-sm" style="background:var(--danger);" onclick="delMundo(${m.id})">×</button></div>`).join('')
        : '<p style="color:var(--text-muted);text-align:center;padding:20px;">Nada cadastrado</p>';
}
function delMundo(id) {
    let l = JSON.parse(localStorage.getItem('grimorio_mundo') || '[]');
    l = l.filter(m => m.id !== id);
    localStorage.setItem('grimorio_mundo', JSON.stringify(l));
    renderMundo();
}

// ═══════ GERADORES ═══════
const GEN = {
    nomesNPC: ['Aldric','Berenice','Caelum','Dahlia','Eldrin','Fiora','Garrick','Helena','Isolde','Jarek','Kael','Lyra','Morden','Nimue','Oswin','Petra','Quinn','Ravenna','Soren','Thalia','Ulric','Vesper','Wren','Xander','Yara','Zephyr'],
    tavernas: ['O Dragão Bêbado','A Caneca Quebrada','Pé do Grifo','Lua de Prata','Coroa Torta','Lobo Manco','Estrela Cadente','Cervo Dourado','Rato Esperto','Martelo Partido','Pomba Negra','Sol Poente'],
    encontros: ['3 goblins emboscando a estrada','Um mercador ferido pede ajuda','Dragão jovem sobrevoa a região','Bando de lobos famintos','Caravana saqueada por bandidos','Estranho mago oferece poção','Ruínas antigas com armadilhas','Fada perdida na floresta','Cadáver com carta misteriosa','Troll de pedra bloqueia ponte'],
    tesouros: ['50 moedas de ouro e uma adaga élfica','Pergaminho de bola de fogo','Anel de proteção +1','Gema de safira (100po)','Poção de cura maior','Mapa para um tesouro perdido','Espada longa com runas','Amuleto misterioso','Pó de desaparecimento','Livro de feitiços antigo'],
    personalidades: ['Gentil mas covarde','Arrogante e orgulhoso','Misterioso e silencioso','Alegre e barulhento','Paranoico e desconfiado','Honrado até demais','Astuto e manipulador','Melancólico e sábio','Impulsivo e corajoso','Excêntrico e distraído'],
    locais: ['Vale das Somras','Pico do Trovão','Floresta Sussurrante','Pântano Negro','Cidadela de Cristal','Porto dos Naufrágios','Deserto de Cinzas','Catarata Prateada','Cripta dos Reis','Torre do Feiticeiro']
};
function pick(arr) { return arr[Math.floor(Math.random()*arr.length)]; }
function gerarNomeNPC(){ document.getElementById('genNomeNPC').textContent = pick(GEN.nomesNPC); }
function gerarTaverna(){ document.getElementById('genTaverna').textContent = pick(GEN.tavernas); }
function gerarEncontro(){ document.getElementById('genEncontro').textContent = pick(GEN.encontros); }
function gerarTesouro(){ document.getElementById('genTesouro').textContent = pick(GEN.tesouros); }
function gerarPersonalidade(){ document.getElementById('genPersonalidade').textContent = pick(GEN.personalidades); }
function gerarLocal(){ document.getElementById('genLocal').textContent = pick(GEN.locais); }

// ═══════ Inicializa tudo ao carregar ═══════
function initModoMestre() {
    renderNPCs();
    renderEncontros();
    renderSessoes();
    renderMundo();
}

applyRole(getCurrentRole());
initModoMestre();

// ═══════════════════════════════════════
// CONFIGURAÇÃO
// ═══════════════════════════════════════
const CONFIG = {
  STORAGE_KEY: 'grimorio_arcano_dados',
};

const ROLE_KEY = 'grimorio_role';
const MIN_AGE = 18;

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
    document.getElementById('birthDate').setAttribute('max', maxDate.toISOString().split('T')[0]);
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
// PDF EXPORT (com criptografia)
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

    page.drawText('⚝  GRIMÓRIO ARCANO  ⚝', { x: 100, y: 650, size: 34, color: rgb(0.88, 0.72, 0.28) });
    page.drawText(`Pertence a: ${grimorio.usuario?.nome || 'Mago Anônimo'}`, { x: 110, y: 540, size: 16, color: rgb(0.82, 0.78, 0.62) });
    page.drawText(`Fichas: ${grimorio.fichas?.length || 0}`, { x: 110, y: 510, size: 14, color: rgb(0.65, 0.60, 0.50) });
    page.drawText(`Exportado: ${new Date().toLocaleString('pt-BR')}`, { x: 110, y: 485, size: 12, color: rgb(0.50, 0.45, 0.38) });
    page.drawText('🔒 PDF protegido por senha', { x: 110, y: 440, size: 12, color: rgb(0.65, 0.30, 0.18) });

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
      permissions: { printing: 'highResolution', copying: false, modifying: false, annotating: true, fillingForms: true, contentAccessibility: true, documentAssembly: false },
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

  // Capa
  let page = pdf.addPage(A4);
  page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: rgb(0.06, 0.04, 0.10) });
  page.drawRectangle({ x: 25, y: 25, width: 545, height: 792, borderColor: rgb(0.75, 0.60, 0.22), borderWidth: 3 });

  page.drawText('GRIMÓRIO ARCANO', { x: 140, y: 650, size: 32, color: rgb(0.88, 0.72, 0.28) });
  page.drawText(`Personagem: ${nome}`, { x: 110, y: 540, size: 16, color: rgb(0.82, 0.78, 0.62) });
  page.drawText(`Classe: ${classe}  |  Raça: ${raca}`, { x: 110, y: 510, size: 13, color: rgb(0.65, 0.60, 0.50) });
  page.drawText(`Nível: ${nivel}  |  XP: ${xp}`, { x: 110, y: 485, size: 13, color: rgb(0.65, 0.60, 0.50) });
  page.drawText(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, { x: 110, y: 455, size: 12, color: rgb(0.50, 0.45, 0.38) });

  // Anotações
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
  modal.classList.remove('hidden');
  showThemeTab('temas-prontos');
}

function closeThemeModal() {
  const modal = document.getElementById('themeModal');
  modal.classList.add('hidden');
  saveThemeState();
}

function showThemeTab(tabId) {
  document.querySelectorAll('.theme-tab-content').forEach(tab => tab.classList.add('hidden'));
  document.querySelectorAll('.theme-tab-button').forEach(btn => btn.classList.remove('active'));
  document.getElementById(tabId).classList.remove('hidden');
  const activeBtn = document.querySelector(`[data-tab="${tabId}"]`);
  if (activeBtn) activeBtn.classList.add('active');
}

function applyTheme(themeName) {
  document.body.setAttribute('data-theme', themeName);
  localStorage.setItem('selected-theme', themeName);
  closeThemeModal();
}

function applyBgUrl() {
  const url = document.getElementById('bgUrlInput').value.trim();
  if (!url) return alert('⚠️ Digite uma URL válida!');
  const img = new Image();
  img.onload = () => {
    document.body.style.background = `url(${url}) center/cover fixed no-repeat`;
    localStorage.setItem('bgImage', url);
    localStorage.setItem('currentTheme', '');
    const preview = document.getElementById('themePreview');
    const label = document.getElementById('themePreviewLabel');
    preview.style.background = `url(${url}) center/cover`;
    label.textContent = 'Personalizado';
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
    preview.style.background = `url(${dataUrl}) center/cover`;
    label.textContent = 'Personalizado';
    document.getElementById('bgImageName').textContent = `📎 ${file.name}`;
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
  preview.style.background = '';
  label.textContent = 'Padrão';
  document.getElementById('bgImageName').textContent = '';
  closeThemeModal();
}

function saveThemeState() {
  const opacity = document.getElementById('bgOpacity').value;
  localStorage.setItem('bgOpacity', opacity);
}

// ═══════════════════════════════════════
// MODO MESTRE / JOGADOR
// ═══════════════════════════════════════
function setRole(role) {
  localStorage.setItem('grimorio_role', role);
  applyRole(role);
  showToast(role === 'mestre' ? '👑 Modo Mestre!' : '⚔️ Modo Jogador!');
}

function applyRole(role) {
  document.body.classList.remove('modo-mestre', 'modo-jogador');
  document.body.classList.add('modo-' + role);

  const btnM = document.getElementById('btnMestre');
  const btnJ = document.getElementById('btnJogador');
  if (btnM) btnM.classList.toggle('ativo', role === 'mestre');
  if (btnJ) btnJ.classList.toggle('ativo', role === 'jogador');

  // Alterna abas
  const abasJ = document.getElementById('abasJogador');
  const abasM = document.getElementById('abasMestre');
  if (abasJ) abasJ.style.display = (role === 'jogador') ? 'flex' : 'none';
  if (abasM) abasM.style.display = (role === 'mestre') ? 'flex' : 'none';

  // Mostra primeira tab do grupo ativo
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
  document.getElementById(tabId).style.display = 'block';
  const grupo = document.getElementById(grupoId);
  grupo.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// ═══════════════════════════════════════
// NPCs
// ═══════════════════════════════════════
function addNPC() {
  const nome = document.getElementById('npcNome').value.trim();
  const funcao = document.getElementById('npcFuncao').value.trim();
  if (!nome) return showToast('⚠️ Informe o nome');
  const lista = JSON.parse(localStorage.getItem('grimorio_npcs') || '[]');
  lista.push({ nome, funcao, id: Date.now() });
  localStorage.setItem('grimorio_npcs', JSON.stringify(lista));
  document.getElementById('npcNome').value = '';
  document.getElementById('npcFuncao').value = '';
  renderNPCs();
  showToast('✅ NPC adicionado');
}
function renderNPCs() {
  const lista = JSON.parse(localStorage.getItem('grimorio_npcs') || '[]');
  document.getElementById('listaNPCs').innerHTML = lista.length
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
  const nome = document.getElementById('encNome').value.trim();
  const nd = document.getElementById('encND').value;
  const detalhes = document.getElementById('encDetalhes').value.trim();
  if (!nome) return showToast('⚠️ Informe o nome');
  const lista = JSON.parse(localStorage.getItem('grimorio_encontros') || '[]');
  lista.push({ nome, nd, detalhes, id: Date.now() });
  localStorage.setItem('grimorio_encontros', JSON.stringify(lista));
  document.getElementById('encNome').value = '';
  document.getElementById('encND').value = '';
  document.getElementById('encDetalhes').value = '';
  renderEncontros();
}
function renderEncontros() {
  const lista = JSON.parse(localStorage.getItem('grimorio_encontros') || '[]');
  document.getElementById('listaEncontros').innerHTML = lista.length
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
  const data = document.getElementById('sessData').value;
  const titulo = document.getElementById('sessTitulo').value.trim();
  const notas = document.getElementById('sessNotas').value.trim();
  if (!titulo) return showToast('⚠️ Informe o título');
  const lista = JSON.parse(localStorage.getItem('grimorio_sessoes') || '[]');
  lista.push({ data, titulo, notas, id: Date.now() });
  localStorage.setItem('grimorio_sessoes', JSON.stringify(lista));
  document.getElementById('sessTitulo').value = '';
  document.getElementById('sessNotas').value = '';
  renderSessoes();
}
function renderSessoes() {
  const lista = JSON.parse(localStorage.getItem('grimorio_sessoes') || '[]');
  document.getElementById('listaSessoes').innerHTML = lista.length
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
  const tipo = document.getElementById('mundoTipo').value;
  const nome = document.getElementById('mundoNome').value.trim();
  const desc = document.getElementById('mundoDesc').value.trim();
  if (!nome) return showToast('⚠️ Informe o nome');
  const lista = JSON.parse(localStorage.getItem('grimorio_mundo') || '[]');
  lista.push({ tipo, nome, desc, id: Date.now() });
  localStorage.setItem('grimorio_mundo', JSON.stringify(lista));
  document.getElementById('mundoNome').value = '';
  document.getElementById('mundoDesc').value = '';
  renderMundo();
}
function renderMundo() {
  const icones = { local: '📍', faccao: '⚜️', historia: '📖', regra: '📜' };
  const lista = JSON.parse(localStorage.getItem('grimorio_mundo') || '[]');
  document.getElementById('listaMundo').innerHTML = lista.length
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
function gerarNomeNPC() { document.getElementById('genNomeNPC').textContent = pick(GEN.nomesNPC); }
function gerarTaverna() { document.getElementById('genTaverna').textContent = pick(GEN.tavernas); }
function gerarEncontro() { document.getElementById('genEncontro').textContent = pick(GEN.encontros); }
function gerarTesouro() { document.getElementById('genTesouro').textContent = pick(GEN.tesouros); }
function gerarPersonalidade() { document.getElementById('genPersonalidade').textContent = pick(GEN.personalidades); }
function gerarLocal() { document.getElementById('genLocal').textContent = pick(GEN.locais); }

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

// Cole no console do navegador:
setRole('mestre');  // deve trocar tudo para modo mestre
setRole('jogador'); // deve voltar para modo jogador

const MASTER_DEFAULT_PASS = 'mestre123'; // mude aqui


