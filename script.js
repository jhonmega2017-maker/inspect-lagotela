/* ============================================
   INSPEÇÃO DE PRODUTOS - SCRIPT CORRIGIDO
   ============================================ */

// Constantes
const TABS = ['identificacao', 'fotos', 'medidas', 'qualidade'];
const STORAGE_KEY = 'inspecao_data';
const STORAGE_MEDIDAS_KEY = 'inspecao_medidas';
const STORAGE_SIGNATURES_KEY = 'inspecao_signatures';
const STORAGE_PHOTOS_KEY = 'inspecao_photos';

let currentTabIndex = 0;
let photos = [];
let signatures = {};
let medidas = [];

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Iniciando aplicação...');
    setupEventListeners();
    
    // Pequeno delay para garantir que o DOM está pronto
    setTimeout(() => {
        setupSignatureCanvases();
        loadFromLocalStorage();
        setDateToToday();
        updateProgressBar();
        setupCustomCursor();
        console.log('✅ Aplicação iniciada com sucesso!');
    }, 100);
});

function setDateToToday() {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('data-inspecao');
    if (dateInput) {
        dateInput.value = today;
    }
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
    console.log('Configurando event listeners...');
    
    // Tab buttons - CORRIGIDO
    const tabBtns = document.querySelectorAll('.tab-btn');
    console.log('Botões de aba encontrados:', tabBtns.length);
    
    tabBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            console.log('Clicou na aba:', index);
            switchTab(index);
        });
    });

    // Navigation buttons
    const btnProximo = document.getElementById('btn-proximo');
    const btnVoltar = document.getElementById('btn-voltar');
    const btnLimpar = document.getElementById('btn-limpar');

    if (btnProximo) {
        btnProximo.addEventListener('click', nextTab);
        console.log('Botão próximo configurado');
    }
    if (btnVoltar) {
        btnVoltar.addEventListener('click', prevTab);
        console.log('Botão voltar configurado');
    }
    if (btnLimpar) {
        btnLimpar.addEventListener('click', resetAllForm);
        console.log('Botão limpar configurado');
    }

    // Camera input
    const cameraInput = document.getElementById('camera-input');
    if (cameraInput) {
        cameraInput.addEventListener('change', handlePhotoCapture);
    }

    // Action buttons
    const btnExportar = document.getElementById('btn-exportar');
    const btnWhatsapp = document.getElementById('btn-whatsapp');
    const btnEmail = document.getElementById('btn-email');
    const btnNovaInspecao = document.getElementById('btn-nova-inspecao');

    if (btnExportar) btnExportar.addEventListener('click', exportRelatorio);
    if (btnWhatsapp) btnWhatsapp.addEventListener('click', shareWhatsApp);
    if (btnEmail) btnEmail.addEventListener('click', shareEmail);
    if (btnNovaInspecao) btnNovaInspecao.addEventListener('click', novaInspecao);

    // Adicionar painel
    const btnAdicionarPainel = document.getElementById('btn-adicionar-painel');
    if (btnAdicionarPainel) {
        btnAdicionarPainel.addEventListener('click', addMedidaPanel);
    }

    // Modal close
    const modalClose = document.getElementById('modal-close');
    const modalFoto = document.getElementById('modal-foto');
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modalFoto) {
        modalFoto.addEventListener('click', (e) => {
            if (e.target.id === 'modal-foto') closeModal();
        });
    }

    // Auto-save em mudanças
    const allInputs = document.querySelectorAll('input, textarea, select');
    allInputs.forEach(input => {
        input.addEventListener('change', () => {
            saveToLocalStorage();
        });
    });

    // QR Code Scanner
    const btnQrScanner = document.getElementById('btn-qr-scanner');
    const qrModal = document.getElementById('qrModal');
    const closeQrModal = document.getElementById('closeQrModal');

    if (btnQrScanner) {
        btnQrScanner.addEventListener('click', openQrScanner);
    }

    if (closeQrModal) {
        closeQrModal.addEventListener('click', closeQrScanner);
    }

    if (qrModal) {
        qrModal.addEventListener('click', (e) => {
            if (e.target.id === 'qrModal') closeQrScanner();
        });
    }
    
    console.log('✅ Event listeners configurados com sucesso!');
}

// ============================================
// NAVEGAÇÃO DE ABAS
// ============================================
function switchTab(index) {
    console.log('switchTab chamado com index:', index);
    
    if (index >= 0 && index < TABS.length) {
        currentTabIndex = index;
        updateTabsUI();
        updateProgressBar();
        console.log('Aba mudou para:', index);
    } else {
        console.error('Índice de aba inválido:', index);
    }
}

function nextTab() {
    console.log('nextTab chamado, currentTabIndex:', currentTabIndex);
    
    if (currentTabIndex < TABS.length - 1) {
        currentTabIndex++;
        updateTabsUI();
        updateProgressBar();
        console.log('Próxima aba:', currentTabIndex);
    } else if (currentTabIndex === TABS.length - 1) {
        console.log('Última aba, mostrando botões de ação');
        showActionButtons();
    }
}

function prevTab() {
    if (currentTabIndex > 0) {
        currentTabIndex--;
        updateTabsUI();
        updateProgressBar();
    }
}

function updateTabsUI() {
    console.log('updateTabsUI - atualizando interface, tab:', currentTabIndex);
    
    // Update tab buttons
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach((btn, index) => {
        if (index === currentTabIndex) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update tab panes
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabPanes.forEach((pane, index) => {
        if (index === currentTabIndex) {
            pane.classList.add('active');
        } else {
            pane.classList.remove('active');
        }
    });

    // Update navigation buttons
    const btnVoltar = document.getElementById('btn-voltar');
    const btnProximo = document.getElementById('btn-proximo');
    
    if (btnVoltar) {
        btnVoltar.style.display = currentTabIndex > 0 ? 'inline-flex' : 'none';
    }
    
    if (btnProximo) {
        if (currentTabIndex === TABS.length - 1) {
            btnProximo.innerHTML = 'Finalizar<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px; margin-left: 0.5rem;"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        } else {
            btnProximo.innerHTML = 'Próximo<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px; margin-left: 0.5rem;"><polyline points="9 18 15 12 9 6"></polyline></svg>';
        }
    }

    // Scroll suave
    const tabsSection = document.querySelector('.tabs-section');
    if (tabsSection) {
        tabsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function updateProgressBar() {
    const percentage = ((currentTabIndex + 1) / TABS.length) * 100;
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        progressFill.style.width = percentage + '%';
    }
}

// ============================================
// FOTOS
// ============================================
function handlePhotoCapture(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const photoData = event.target.result;
            photos.push(photoData);
            renderGallery();
            saveToLocalStorage();
        };
        reader.readAsDataURL(file);
    }
    e.target.value = ''; // Reset input
}

function renderGallery() {
    const gallery = document.getElementById('gallery');
    
    if (!gallery) return;
    
    if (photos.length === 0) {
        gallery.innerHTML = '<p class="empty-gallery">Nenhuma foto capturada ainda</p>';
        return;
    }

    gallery.innerHTML = photos.map((photo, index) => `
        <div class="gallery-item">
            <img src="${photo}" alt="Foto ${index + 1}" style="width: 100%; height: 100%; object-fit: cover;">
            <div class="gallery-item-actions">
                <button class="gallery-item-btn" onclick="viewPhoto(${index})" title="Visualizar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                </button>
                <button class="gallery-item-btn" onclick="deletePhoto(${index})" title="Deletar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 4 21 4"></polyline>
                        <path d="M19 4v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4m3 0V3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1"></path>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
}

function viewPhoto(index) {
    const modal = document.getElementById('modal-foto');
    const img = document.getElementById('modal-foto-img');
    img.src = photos[index];
    modal.classList.add('active');
}

function deletePhoto(index) {
    if (confirm('Deseja remover esta foto?')) {
        photos.splice(index, 1);
        renderGallery();
        saveToLocalStorage();
    }
}

function closeModal() {
    document.getElementById('modal-foto').classList.remove('active');
}

// ============================================
// MEDIDAS
// ============================================
function addMedidaPanel() {
    const panelIndex = medidas.length;
    medidas.push({
        numero: panelIndex + 1,
        altura: '',
        largura: '',
        bitola: '',
        observacoes: ''
    });

    renderMedidasList();
    saveToLocalStorage();
}

function renderMedidasList() {
    const container = document.getElementById('medidas-list');
    
    if (medidas.length === 0) {
        container.innerHTML = '<p style="color: var(--text-gray); text-align: center; padding: 2rem;">Nenhum painel adicionado. Clique em "Adicionar Painel" para começar.</p>';
        return;
    }

    container.innerHTML = medidas.map((medida, index) => `
        <div class="medida-card">
            <div class="medida-header">
                <h4 class="medida-title">Painel ${medida.numero}</h4>
                <button class="medida-remove" onclick="removeMedida(${index})" title="Remover painel">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 4 21 4"></polyline>
                        <path d="M19 4v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4m3 0V3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1"></path>
                    </svg>
                </button>
            </div>
            <div class="medida-form">
                <div>
                    <label style="display: block; font-size: 0.85rem; margin-bottom: 0.25rem; color: var(--text-gray);">Altura (m)</label>
                    <input type="text" placeholder="Ex: 2,5 ou 2.5" value="${medida.altura}" onchange="updateMedida(${index}, 'altura', this.value)">
                </div>
                <div>
                    <label style="display: block; font-size: 0.85rem; margin-bottom: 0.25rem; color: var(--text-gray);">Largura (m)</label>
                    <input type="text" placeholder="Ex: 1,2 ou 1.2" value="${medida.largura}" onchange="updateMedida(${index}, 'largura', this.value)">
                </div>
                <div>
                    <label style="display: block; font-size: 0.85rem; margin-bottom: 0.25rem; color: var(--text-gray);">Bitola (mm)</label>
                    <input type="text" placeholder="Ex: 3,0 ou 4,5" value="${medida.bitola}" onchange="updateMedida(${index}, 'bitola', this.value)">
                </div>
                <div style="grid-column: 1 / -1;">
                    <label style="display: block; font-size: 0.85rem; margin-bottom: 0.25rem; color: var(--text-gray);">Observações</label>
                    <textarea placeholder="Detalhes específicos deste painel..." onchange="updateMedida(${index}, 'observacoes', this.value)" style="width: 100%; padding: 0.5rem; border: 1px solid var(--border-gray); border-radius: 8px; min-height: 70px;">${medida.observacoes}</textarea>
                </div>
            </div>
        </div>
    `).join('');
}

function updateMedida(index, field, value) {
    // Normalizar vírgula/ponto para números
    if (field !== 'observacoes') {
        value = normalizeMeasurement(value);
    }
    medidas[index][field] = value;
    saveToLocalStorage();
}

function removeMedida(index) {
    if (confirm('Deseja remover este painel?')) {
        medidas.splice(index, 1);
        // Renumerar painéis
        medidas.forEach((m, i) => m.numero = i + 1);
        renderMedidasList();
        saveToLocalStorage();
    }
}

function normalizeMeasurement(value) {
    // Aceita tanto ponto quanto vírgula
    return value.toString().replace(',', '.');
}

// ============================================
// ASSINATURA DIGITAL
// ============================================
function setupSignatureCanvases() {
    const canvasIds = ['canvas-qualidade', 'canvas-arame', 'canvas-eletrofusao', 'canvas-dobra'];
    
    canvasIds.forEach(id => {
        const canvas = document.getElementById(id);
        if (!canvas) {
            console.warn(`Canvas ${id} não encontrado`);
            return;
        }
        
        const ctx = canvas.getContext('2d');
        
        // Definir dimensões do canvas
        canvas.width = canvas.offsetWidth || 300;
        canvas.height = canvas.offsetHeight || 150;
        
        console.log(`Canvas ${id} inicializado: ${canvas.width}x${canvas.height}`);
        
        // Preencher com branco
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Configurar estilos de desenho
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#C41E3A';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        let isDrawing = false;
        
        // Mouse DOWN
        canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            console.log(`Desenhar em ${id}: mousedown em (${x}, ${y})`);
            ctx.beginPath();
            ctx.moveTo(x, y);
        });
        
        // Mouse MOVE
        canvas.addEventListener('mousemove', (e) => {
            if (!isDrawing) return;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            ctx.lineTo(x, y);
            ctx.stroke();
        });
        
        // Mouse UP
        canvas.addEventListener('mouseup', () => {
            isDrawing = false;
        });
        
        // Mouse LEAVE
        canvas.addEventListener('mouseleave', () => {
            isDrawing = false;
        });
        
        // Touch START
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            const touch = e.touches[0];
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            console.log(`Desenhar em ${id}: touch start em (${x}, ${y})`);
            ctx.beginPath();
            ctx.moveTo(x, y);
        }, { passive: false });
        
        // Touch MOVE
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!isDrawing) return;
            const rect = canvas.getBoundingClientRect();
            const touch = e.touches[0];
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            ctx.lineTo(x, y);
            ctx.stroke();
        }, { passive: false });
        
        // Touch END
        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            isDrawing = false;
        }, { passive: false });
        
        // Botão LIMPAR
        const keyPart = id.split('-')[1];
        const clearBtn = document.getElementById(`btn-clear-${keyPart}`);
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                if (signatures[id]) delete signatures[id];
                saveToLocalStorage();
                console.log(`Canvas ${id} limpo`);
            });
        }
        
        // Botão SALVAR
        const saveBtn = document.getElementById(`btn-save-${keyPart}`);
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                signatures[id] = canvas.toDataURL();
                saveToLocalStorage();
                saveBtn.style.backgroundColor = '#10b981';
                saveBtn.style.color = 'white';
                setTimeout(() => {
                    saveBtn.style.backgroundColor = '';
                    saveBtn.style.color = '';
                }, 1500);
                console.log(`Assinatura ${id} salva`);
            });
        }
        
        // Recarregar assinatura salva
        if (signatures[id]) {
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
                console.log(`Assinatura ${id} carregada`);
            };
            img.src = signatures[id];
        }
    });
}

// ============================================
// LOCAL STORAGE
// ============================================
function saveToLocalStorage() {
    const formData = {
        inspetor: document.getElementById('inspetor').value,
        obra: document.getElementById('obra').value,
        numeroOp: document.getElementById('numero-op').value,
        obsIdentificacao: document.getElementById('obs-identificacao').value,
        dataInspecao: document.getElementById('data-inspecao').value,
        obsFotos: document.getElementById('obs-fotos').value,
        obsMedidas: document.getElementById('obs-medidas').value,
        conformidade: document.querySelector('input[name="conformidade"]:checked')?.value || '',
        obsFinais: document.getElementById('obs-finais').value
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    localStorage.setItem(STORAGE_MEDIDAS_KEY, JSON.stringify(medidas));
    localStorage.setItem(STORAGE_SIGNATURES_KEY, JSON.stringify(signatures));
    localStorage.setItem(STORAGE_PHOTOS_KEY, JSON.stringify(photos));
}

function loadFromLocalStorage() {
    // Load form data
    const formData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (formData.inspetor) document.getElementById('inspetor').value = formData.inspetor;
    if (formData.obra) document.getElementById('obra').value = formData.obra;
    if (formData.numeroOp) document.getElementById('numero-op').value = formData.numeroOp;
    if (formData.obsIdentificacao) document.getElementById('obs-identificacao').value = formData.obsIdentificacao;
    if (formData.dataInspecao) document.getElementById('data-inspecao').value = formData.dataInspecao;
    if (formData.obsFotos) document.getElementById('obs-fotos').value = formData.obsFotos;
    if (formData.obsMedidas) document.getElementById('obs-medidas').value = formData.obsMedidas;
    if (formData.conformidade) {
        const radio = document.querySelector(`input[name="conformidade"][value="${formData.conformidade}"]`);
        if (radio) radio.checked = true;
    }
    if (formData.obsFinais) document.getElementById('obs-finais').value = formData.obsFinais;

    // Load medidas
    medidas = JSON.parse(localStorage.getItem(STORAGE_MEDIDAS_KEY) || '[]');
    if (medidas.length > 0) {
        renderMedidasList();
    }

    // Load signatures
    signatures = JSON.parse(localStorage.getItem(STORAGE_SIGNATURES_KEY) || '{}');
    Object.keys(signatures).forEach(id => {
        if (signatures[id]) {
            const canvas = document.getElementById(id);
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
            };
            img.src = signatures[id];
        }
    });

    // Load photos
    photos = JSON.parse(localStorage.getItem(STORAGE_PHOTOS_KEY) || '[]');
    if (photos.length > 0) {
        renderGallery();
    }
}

function clearAllLocalStorage() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_MEDIDAS_KEY);
    localStorage.removeItem(STORAGE_SIGNATURES_KEY);
    localStorage.removeItem(STORAGE_PHOTOS_KEY);
}

// ============================================
// AÇÕES
// ============================================
function resetAllForm() {
    if (!confirm('Isso limpará TODOS os dados. Tem certeza?')) return;

    // Clear all inputs
    document.querySelectorAll('input[type="text"], input[type="date"], textarea, select').forEach(input => {
        input.value = '';
    });

    // Clear all canvases
    document.querySelectorAll('.signature-canvas').forEach(canvas => {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Clear radios
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });

    // Reset data
    photos = [];
    medidas = [];
    signatures = {};
    renderGallery();
    renderMedidasList();
    clearAllLocalStorage();

    // Reset tab
    currentTabIndex = 0;
    updateTabsUI();
    updateProgressBar();

    // Hide action buttons
    document.getElementById('action-buttons').style.display = 'none';
    document.querySelector('.navigation-buttons').style.display = 'flex';

    setDateToToday();
}

function showActionButtons() {
    document.querySelector('.navigation-buttons').style.display = 'none';
    document.getElementById('action-buttons').style.display = 'grid';
}

function novaInspecao() {
    resetAllForm();
    document.querySelector('.navigation-buttons').style.display = 'flex';
}

// ============================================
// EXPORTAR RELATÓRIO
// ============================================
function exportRelatorio() {
    // Validar dados básicos
    const inspetor = document.getElementById('inspetor').value;
    const obra = document.getElementById('obra').value;
    const numeroOp = document.getElementById('numero-op').value;

    if (!inspetor || !obra || !numeroOp) {
        alert('Por favor, preencha todos os campos obrigatórios na aba de Identificação');
        return;
    }

    // Criar conteúdo HTML do relatório
    let relatorioHTML = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Relatório de Inspeção</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Arial', sans-serif; color: #1f2937; line-height: 1.6; background: white; }
            .header { background: linear-gradient(135deg, #E50914 0%, #ff3d46 100%); color: white; padding: 2rem; text-align: center; }
            .logo { font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem; }
            .content { padding: 2rem; max-width: 900px; margin: 0 auto; }
            .section { margin-bottom: 2rem; border: 1px solid #d1d5db; padding: 1.5rem; border-radius: 8px; }
            .section-title { font-size: 1.25rem; font-weight: bold; color: #E50914; margin-bottom: 1rem; border-bottom: 2px solid #E50914; padding-bottom: 0.5rem; }
            .info-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
            .info-row.full { grid-template-columns: 1fr; }
            .info-item label { font-weight: 600; color: #6b7280; display: block; margin-bottom: 0.25rem; font-size: 0.9rem; }
            .info-item { background: #f9fafb; padding: 0.75rem; border-radius: 6px; }
            .gallery-preview { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-top: 1rem; }
            .gallery-preview img { width: 100%; border-radius: 6px; border: 1px solid #d1d5db; }
            .table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
            .table th, .table td { border: 1px solid #d1d5db; padding: 0.75rem; text-align: left; }
            .table th { background-color: #E50914; color: white; font-weight: 600; }
            .table tbody tr:nth-child(even) { background-color: #f9fafb; }
            .signature-section { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; margin-top: 2rem; }
            .signature-box { border: 2px solid #d1d5db; border-radius: 6px; padding: 1rem; min-height: 150px; }
            .signature-box h4 { font-size: 0.9rem; margin-bottom: 0.75rem; color: #6b7280; }
            .signature-img { width: 100%; border: 1px dashed #d1d5db; border-radius: 4px; min-height: 120px; }
            .conformidade { font-size: 1.1rem; font-weight: bold; padding: 1rem; border-radius: 6px; text-align: center; margin-top: 1rem; }
            .conformidade.conforme { background: #d1fae5; color: #065f46; }
            .conformidade.nao-conforme { background: #fee2e2; color: #991b1b; }
            .footer { background: #f9fafb; padding: 1rem; text-align: center; color: #6b7280; font-size: 0.9rem; margin-top: 2rem; border-top: 1px solid #d1d5db; }
            @media print { body { background: white; } .no-print { display: none; } }
            @page { margin: 1cm; }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="logo">Lagotela - Relatório de Inspeção</div>
            <div>Cercamento Inteligente</div>
        </div>
        
        <div class="content">
            <!-- IDENTIFICAÇÃO -->
            <div class="section">
                <div class="section-title">📋 Identificação da Inspeção</div>
                <div class="info-row">
                    <div class="info-item">
                        <label>Inspetor</label>
                        <div>${inspetor.charAt(0).toUpperCase() + inspetor.slice(1)}</div>
                    </div>
                    <div class="info-item">
                        <label>Data</label>
                        <div>${new Date(document.getElementById('data-inspecao').value).toLocaleDateString('pt-BR')}</div>
                    </div>
                </div>
                <div class="info-row">
                    <div class="info-item">
                        <label>Obra / Cliente</label>
                        <div>${obra}</div>
                    </div>
                    <div class="info-item">
                        <label>Número da OP</label>
                        <div>${numeroOp}</div>
                    </div>
                </div>
                ${document.getElementById('obs-identificacao').value ? `
                <div class="info-row full">
                    <div class="info-item">
                        <label>Observações</label>
                        <div>${document.getElementById('obs-identificacao').value}</div>
                    </div>
                </div>
                ` : ''}
            </div>

            <!-- FOTOS -->
            ${photos.length > 0 ? `
            <div class="section">
                <div class="section-title">📸 Fotos Capturadas</div>
                <div class="gallery-preview">
                    ${photos.map((photo, idx) => `<img src="${photo}" alt="Foto ${idx + 1}">`).join('')}
                </div>
                ${document.getElementById('obs-fotos').value ? `
                <p style="margin-top: 1rem; color: #6b7280;"><strong>Observações:</strong> ${document.getElementById('obs-fotos').value}</p>
                ` : ''}
            </div>
            ` : ''}

            <!-- MEDIDAS -->
            ${medidas.length > 0 ? `
            <div class="section">
                <div class="section-title">📏 Medidas dos Painéis</div>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Painel</th>
                            <th>Altura (m)</th>
                            <th>Largura (m)</th>
                            <th>Bitola (mm)</th>
                            <th>Observações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${medidas.map(m => `
                        <tr>
                            <td>#${m.numero}</td>
                            <td>${m.altura || '-'}</td>
                            <td>${m.largura || '-'}</td>
                            <td>${m.bitola || '-'}</td>
                            <td>${m.observacoes || '-'}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
                ${document.getElementById('obs-medidas').value ? `
                <p style="margin-top: 1rem; color: #6b7280;"><strong>Observações:</strong> ${document.getElementById('obs-medidas').value}</p>
                ` : ''}
            </div>
            ` : ''}

            <!-- QUALIDADE -->
            <div class="section">
                <div class="section-title">✓ Avaliação de Qualidade</div>
                
                <div class="signature-section">
                    ${['canvas-qualidade', 'canvas-arame', 'canvas-eletrofusao', 'canvas-dobra'].map(canvasId => {
                        const title = canvasId === 'canvas-qualidade' ? 'Qualidade' :
                                    canvasId === 'canvas-arame' ? 'Corte do Arame' :
                                    canvasId === 'canvas-eletrofusao' ? 'Eletrofusão' : 'Dobra';
                        const signature = signatures[canvasId];
                        return `
                        <div class="signature-box">
                            <h4>${title}</h4>
                            ${signature ? `<img src="${signature}" class="signature-img">` : '<div class="signature-img" style="background: #f9fafb;"></div>'}
                        </div>
                        `;
                    }).join('')}
                </div>

                ${(() => {
                    const conformidade = document.querySelector('input[name="conformidade"]:checked')?.value;
                    if (conformidade) {
                        const isConforme = conformidade === 'conforme';
                        return `
                        <div class="conformidade ${isConforme ? 'conforme' : 'nao-conforme'}">
                            ${isConforme ? '✓ Produto Conforme' : '✗ Produto Não Conforme'}
                        </div>
                        `;
                    }
                    return '';
                })()}

                ${document.getElementById('obs-finais').value ? `
                <p style="margin-top: 1rem; color: #6b7280;"><strong>Observações Finais:</strong> ${document.getElementById('obs-finais').value}</p>
                ` : ''}
            </div>
        </div>

        <div class="footer">
            Relatório gerado em ${new Date().toLocaleString('pt-BR')} - Lagotela Cercamento Inteligente
        </div>
    </body>
    </html>
    `;

    // Abrir em nova janela e imprimir
    const newWindow = window.open('', '_blank');
    newWindow.document.write(relatorioHTML);
    newWindow.document.close();
    
    // Dar tempo para carregar e depois chamar print
    setTimeout(() => {
        newWindow.print();
    }, 250);
}

// ============================================
// COMPARTILHAMENTO
// ============================================
function shareWhatsApp() {
    const inspetor = document.getElementById('inspetor').value || 'Não informado';
    const obra = document.getElementById('obra').value || 'Não informado';
    const numeroOp = document.getElementById('numero-op').value || 'Não informado';
    const conformidade = document.querySelector('input[name="conformidade"]:checked')?.value || 'Não informado';

    const message = `
📋 *Inspeção de Produtos*

👤 *Inspetor:* ${inspetor.charAt(0).toUpperCase() + inspetor.slice(1)}
🏢 *Obra/Cliente:* ${obra}
📌 *OP:* ${numeroOp}
✓ *Status:* ${conformidade === 'conforme' ? 'Conforme ✓' : 'Não Conforme ✗'}

Para ver o relatório completo, gere o PDF através do sistema.

Horário da inspeção: ${new Date().toLocaleString('pt-BR')}
    `.trim();

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
}

function shareEmail() {
    const inspetor = document.getElementById('inspetor').value || 'Não informado';
    const obra = document.getElementById('obra').value || 'Não informado';
    const numeroOp = document.getElementById('numero-op').value || 'Não informado';

    const subject = `Relatório de Inspeção - OP: ${numeroOp}`;
    const body = `
Prezado,

Segue em anexo o relatório da inspeção de produtos realizada.

Dados:
- Inspetor: ${inspetor}
- Obra/Cliente: ${obra}
- Número da OP: ${numeroOp}
- Data: ${new Date().toLocaleDateString('pt-BR')}

Atenciosamente,
Sistema de Inspeção QualityScan
    `.trim();

    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// ============================================
// CUSTOM CURSOR
// ============================================
function setupCustomCursor() {
    const cursor = document.querySelector('.cursor-glow');
    if (!cursor) return; // Mobile

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = (e.clientX - 10) + 'px';
        cursor.style.top = (e.clientY - 10) + 'px';
    });

    // Magnetic hover on buttons
    const buttons = document.querySelectorAll('button, a, .btn-camera');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.borderColor = 'var(--primary-light)';
        });
        btn.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = 'var(--primary-color)';
        });
    });
}

// ============================================
// QR CODE SCANNER - CIGAM
// ============================================
let qrScannerActive = false;
let qrScanStream = null;

async function openQrScanner() {
    console.log('Abrindo leitor de QR Code...');
    
    const qrModal = document.getElementById('qrModal');
    if (!qrModal) return;

    qrModal.style.display = 'flex';
    
    try {
        // Solicita acesso à câmera
        qrScanStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment', // Câmera traseira em mobile
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });

        const video = document.getElementById('qr-video');
        video.srcObject = qrScanStream;
        
        qrScannerActive = true;
        scanQrCode();
        console.log('✅ Câmera iniciada com sucesso!');
    } catch (err) {
        console.error('Erro ao acessar câmera:', err);
        alert('Permissão de câmera negada. Por favor, permitir acesso à câmera nas configurações.');
        qrModal.style.display = 'none';
    }
}

function closeQrScanner() {
    console.log('Fechando leitor de QR Code...');
    
    qrScannerActive = false;

    // Para o stream de vídeo
    if (qrScanStream) {
        qrScanStream.getTracks().forEach(track => track.stop());
        qrScanStream = null;
    }

    const qrModal = document.getElementById('qrModal');
    if (qrModal) {
        qrModal.style.display = 'none';
    }

    // Limpa resultado anterior
    document.getElementById('qr-result').style.display = 'none';
    document.getElementById('qr-error').style.display = 'none';
}

function scanQrCode() {
    const video = document.getElementById('qr-video');
    const canvas = document.getElementById('qr-canvas');
    const ctx = canvas.getContext('2d');

    // Ajusta tamanho do canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    if (!qrScannerActive) return;

    // Desenha o frame atual do vídeo no canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Obtém dados da imagem
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Decodifica QR Code usando a biblioteca jsQR
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code && code.data) {
        console.log('QR Code detectado:', code.data);
        processQrCode(code.data);
        qrScannerActive = false; // Para o scanner
    } else {
        // Continua digitalizando
        requestAnimationFrame(scanQrCode);
    }
}

function processQrCode(qrData) {
    console.log('Processando QR Code:', qrData);

    // Limpa mensagens anteriores
    document.getElementById('qr-error').style.display = 'none';

    try {
        // Tenta parsear como JSON (formato CIGAM)
        let data = {};
        
        // Verifica se é URL
        if (qrData.startsWith('http')) {
            // Extrai parâmetros da URL
            const url = new URL(qrData);
            data = {
                op: url.searchParams.get('op') || url.searchParams.get('OP') || '',
                obra: url.searchParams.get('cliente') || url.searchParams.get('obra') || url.searchParams.get('cliente') || '',
                cliente: url.searchParams.get('cliente') || url.searchParams.get('nome') || '',
                url: qrData
            };
        } 
        // Verifica se é JSON
        else if (qrData.startsWith('{')) {
            data = JSON.parse(qrData);
        }
        // Trata como número de OP simples
        else {
            data = {
                op: qrData.trim()
            };
        }

        // Preenche os campos do formulário com os dados extraídos
        const numeroOp = document.getElementById('numero-op');
        const obra = document.getElementById('obra');

        if (numeroOp && data.op) {
            numeroOp.value = data.op;
            console.log('✅ Número da OP preenchido:', data.op);
        }

        if (obra && (data.obra || data.cliente)) {
            obra.value = data.obra || data.cliente || '';
            console.log('✅ Obra/Cliente preenchido:', obra.value);
        }

        // Exibe resultado
        displayQrResult(data);

        // Salva os dados
        saveToLocalStorage();

        // Fecha o scanner após 2 segundos
        setTimeout(() => {
            closeQrScanner();
        }, 2000);

    } catch (err) {
        console.error('Erro ao processar QR Code:', err);
        
        // Se não conseguir parsear, trata como número de OP simples
        const numeroOp = document.getElementById('numero-op');
        if (numeroOp) {
            numeroOp.value = qrData.trim();
            displayQrResult({ op: qrData.trim() });
            saveToLocalStorage();
            setTimeout(() => {
                closeQrScanner();
            }, 2000);
        }
    }
}

function displayQrResult(data) {
    const resultDiv = document.getElementById('qr-result');
    const resultContent = document.getElementById('qr-result-content');

    let html = '';

    if (data.op) {
        html += `<p><strong>Número OP:</strong> ${data.op}</p>`;
    }

    if (data.obra) {
        html += `<p><strong>Obra:</strong> ${data.obra}</p>`;
    }

    if (data.cliente) {
        html += `<p><strong>Cliente:</strong> ${data.cliente}</p>`;
    }

    if (data.url) {
        html += `<p><strong>Origem:</strong> QR Code CIGAM</p>`;
    }

    if (html === '') {
        html = `<p><strong>Dados:</strong> ${JSON.stringify(data)}</p>`;
    }

    resultContent.innerHTML = html;
    resultDiv.style.display = 'block';
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
window.scrollToTop = () => {
    window.scrollTo(0, 0);
};

// Previne zoom em inputs no iOS
document.addEventListener('touchmove', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        // Allow scroll on inputs
    }
}, { passive: true });

console.log('Script carregado com sucesso!');
