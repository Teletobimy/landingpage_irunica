/**
 * Irunica Email Sender - Frontend JavaScript
 * Handles API calls and UI updates for Smartlead sending and AI processing
 */

// Configuration
const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8080'
    : 'https://email-sender-53995941986.asia-northeast3.run.app';

// State
let pollInterval = null;
let pipelinePollInterval = null;
let currentPipelineRunId = null;
let currentLogFilter = 'all';
let globalStats = null; // Global lead statistics
let isPipelineRunning = false; // Track pipeline running state

// DOM Elements - Global
const globalRefreshBtn = document.getElementById('global-refresh-btn');

// DOM Elements - Smartlead
const slElements = {
    pendingCount: document.getElementById('sl-pending-count'),
    uploadedCount: document.getElementById('sl-uploaded-count'),
    campaignId: document.getElementById('campaign-id'),
    uploadBtn: document.getElementById('sl-upload-btn'),
    refreshBtn: document.getElementById('sl-refresh-btn'),
    logsContainer: document.getElementById('sl-logs-container')
};

// DOM Elements - AI Research
const rsElements = {
    pendingCount: document.getElementById('rs-pending-count'),
    completedCount: document.getElementById('rs-completed-count'),
    startBtn: document.getElementById('rs-start-btn'),
    stopBtn: document.getElementById('rs-stop-btn'), // Added stop button
    refreshBtn: document.getElementById('rs-refresh-btn'),
    logsContainer: document.getElementById('rs-logs-container'),
    statusBadge: document.getElementById('rs-status-badge') // Added status badge
};

// DOM Elements - AI Generation
const agElements = {
    pendingCount: document.getElementById('ag-pending-count'),
    completedCount: document.getElementById('ag-completed-count'),
    startBtn: document.getElementById('ag-start-btn'),
    stopBtn: document.getElementById('ag-stop-btn'), // Added stop button
    refreshBtn: document.getElementById('ag-refresh-btn'),
    logsContainer: document.getElementById('ag-logs-container'),
    statusBadge: document.getElementById('ag-status-badge') // Added status badge
};

const agPreviewBtn = document.getElementById('ag-preview-btn');

// DOM Elements - Pipeline Dashboard
const plElements = {
    logsContainer: document.getElementById('pl-logs-container'),
    statusBadge: document.getElementById('pl-status-badge'),
    lastRun: document.getElementById('pl-last-run'),
    errorSection: document.getElementById('error-section'),
    // Stats
    scraped: document.getElementById('pl-scraped'),
    extracted: document.getElementById('pl-extracted'),
    researched: document.getElementById('pl-researched'),
    generated: document.getElementById('pl-generated'),
    completed: document.getElementById('pl-completed'),
    filtered: document.getElementById('pl-filtered'),
    errors: document.getElementById('pl-errors'),
    // Funnel
    funnelScraped: document.getElementById('funnel-scraped'),
    funnelExtracted: document.getElementById('funnel-extracted'),
    funnelResearched: document.getElementById('funnel-researched'),
    funnelCompleted: document.getElementById('funnel-completed'),
    funnelScrapedPct: document.getElementById('funnel-scraped-pct'),
    funnelExtractedPct: document.getElementById('funnel-extracted-pct'),
    funnelResearchedPct: document.getElementById('funnel-researched-pct'),
    funnelCompletedPct: document.getElementById('funnel-completed-pct')
};

// DOM Elements - Pipeline Control Bar
const pipelineControlElements = {
    startBtn: document.getElementById('pipeline-start-btn'),
    stopBtn: document.getElementById('pipeline-stop-btn'),
    statusIndicator: document.getElementById('pipeline-status-indicator'),
    statusText: document.querySelector('#pipeline-status-indicator .status-text')
};

// Preview Modal Elements
const modalElements = {
    modal: document.getElementById('preview-modal'),
    closeBtn: document.querySelector('.close-modal'),
    subject: document.getElementById('preview-subject'),
    body: document.getElementById('preview-body')
};

// Tab Elements
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initSmartleadButtons();
    initResearchButtons();
    initGenerationButtons();
    initPipelineControlButtons();
    initGlobalRefresh();
    initModal();
    initDetailModal();
    initDashboardCardClicks();
    initPipelineWorkflow();
    fetchStatus();
    fetchSmartleadStatus();
    fetchGlobalStats(); // Fetch global stats on load
    fetchPipelineStatus();

    // Auto-refresh global stats every 30 seconds
    setInterval(fetchGlobalStats, 30000);
});

// Modal Initialization
function initModal() {
    modalElements.closeBtn.addEventListener('click', () => {
        modalElements.modal.classList.remove('active');
    });

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modalElements.modal) {
            modalElements.modal.classList.remove('active');
        }
    });
}

// Open Preview Modal
function openPreview(subject, body) {
    modalElements.subject.textContent = subject;
    modalElements.body.textContent = body;
    modalElements.modal.classList.add('active');
}

// Global refresh button - refreshes all tabs
function initGlobalRefresh() {
    globalRefreshBtn.addEventListener('click', async () => {
        globalRefreshBtn.classList.add('spinning');
        globalRefreshBtn.disabled = true;

        try {
            // Refresh all data
            await Promise.all([
                fetchStatus(),
                fetchSmartleadStatus(),
                fetchGlobalStats(),
                fetchPipelineStatus()
            ]);

            // Show success in active tab's log
            const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
            let logFn = slShowLog;
            if (activeTab === 'pipeline') logFn = plShowLog;
            else if (activeTab === 'research') logFn = rsShowLog;
            else if (activeTab === 'aigen') logFn = agShowLog;

            logFn('🔄 모든 데이터를 새로고침했습니다', 'info');
        } catch (error) {
            console.error('Global refresh failed:', error);
        } finally {
            globalRefreshBtn.classList.remove('spinning');
            globalRefreshBtn.disabled = false;
        }
    });
}

// Tab Initialization
function initTabs() {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;

            // Update button states
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update content visibility
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `tab-${targetTab}`) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// Smartlead button initialization
function initSmartleadButtons() {
    slElements.uploadBtn.addEventListener('click', uploadToSmartlead);
    slElements.refreshBtn.addEventListener('click', fetchSmartleadStatus);
}

// AI Research button initialization
function initResearchButtons() {
    rsElements.startBtn.addEventListener('click', startResearch);
    if (rsElements.stopBtn) rsElements.stopBtn.addEventListener('click', stopResearch);
    rsElements.refreshBtn.addEventListener('click', fetchResearchStatus);
}

// AI Generation button initialization
function initGenerationButtons() {
    agElements.startBtn.addEventListener('click', startGeneration);
    if (agElements.stopBtn) agElements.stopBtn.addEventListener('click', stopGeneration);
    agElements.refreshBtn.addEventListener('click', fetchGenerationStatus);
    agPreviewBtn.addEventListener('click', previewLatestGeneration);
}

// Pipeline Control buttons initialization
function initPipelineControlButtons() {
    if (pipelineControlElements.startBtn) {
        pipelineControlElements.startBtn.addEventListener('click', startPipeline);
    }
    if (pipelineControlElements.stopBtn) {
        pipelineControlElements.stopBtn.addEventListener('click', stopPipeline);
    }
}

// Start Pipeline
async function startPipeline() {
    try {
        pipelineControlElements.startBtn.disabled = true;
        updatePipelineControlUI('starting');
        plShowLog('파이프라인 시작 요청 중...', 'info');

        const response = await fetch(`${API_BASE_URL}/pipeline/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();

        if (data.success) {
            plShowLog(`파이프라인이 시작되었습니다`, 'success');
            updatePipelineControlUI('running');
            fetchPipelineStatus(); // Refresh to get latest status
        } else {
            plShowLog(`시작 실패: ${data.error || '알 수 없는 오류'}`, 'error');
            updatePipelineControlUI('waiting');
            pipelineControlElements.startBtn.disabled = false;
        }
    } catch (error) {
        console.error('Failed to start pipeline:', error);
        plShowLog(`서버 연결 실패: ${error.message}`, 'error');
        updatePipelineControlUI('waiting');
        pipelineControlElements.startBtn.disabled = false;
    }
}

// Stop Pipeline
async function stopPipeline() {
    if (!confirm('파이프라인을 중지하시겠습니까?')) return;

    try {
        pipelineControlElements.stopBtn.disabled = true;
        plShowLog('파이프라인 중지 요청 중...', 'warning');

        const response = await fetch(`${API_BASE_URL}/pipeline/stop`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();

        if (data.success) {
            plShowLog('파이프라인이 중지되었습니다', 'success');
            updatePipelineControlUI('waiting');
        } else {
            plShowLog(`중지 실패: ${data.error || '알 수 없는 오류'}`, 'error');
        }
        pipelineControlElements.stopBtn.disabled = false;
    } catch (error) {
        console.error('Failed to stop pipeline:', error);
        plShowLog(`서버 연결 실패: ${error.message}`, 'error');
        pipelineControlElements.stopBtn.disabled = false;
    }
}

// Update Pipeline Control Bar UI
function updatePipelineControlUI(status) {
    const { startBtn, stopBtn, statusIndicator, statusText } = pipelineControlElements;

    if (!statusIndicator) return;

    // Remove all status classes
    statusIndicator.classList.remove('waiting', 'running', 'completed');

    switch (status) {
        case 'running':
        case 'starting':
            statusIndicator.classList.add('running');
            if (statusText) statusText.textContent = '실행중';
            if (startBtn) startBtn.style.display = 'none';
            if (stopBtn) stopBtn.style.display = 'inline-flex';
            break;
        case 'completed':
            statusIndicator.classList.add('completed');
            if (statusText) statusText.textContent = '완료';
            if (startBtn) {
                startBtn.style.display = 'inline-flex';
                startBtn.disabled = false;
            }
            if (stopBtn) stopBtn.style.display = 'none';
            break;
        case 'waiting':
        default:
            statusIndicator.classList.add('waiting');
            if (statusText) statusText.textContent = '대기중';
            if (startBtn) {
                startBtn.style.display = 'inline-flex';
                startBtn.disabled = false;
            }
            if (stopBtn) stopBtn.style.display = 'none';
            break;
    }
}

// ===========================================
// Status Functions
// ===========================================

// Fetch status from API
async function fetchStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/status`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            updateUI(data);
        } else {
            console.error(data.error || 'Unknown error');
        }
    } catch (error) {
        console.error('Failed to fetch status:', error);
    }
}

// Update UI with status data
function updateUI(data) {
    // Update AI Research stats if available
    if (data.research) {
        rsElements.pendingCount.textContent = data.research.pending;
        rsElements.completedCount.textContent = data.research.completed;

        if (data.research.is_running) {
            rsElements.startBtn.style.display = 'none';
            if (rsElements.stopBtn) rsElements.stopBtn.style.display = 'inline-block';
            if (rsElements.statusBadge) rsElements.statusBadge.textContent = '실행 중...';
            if (rsElements.statusBadge) rsElements.statusBadge.className = 'status-badge running';
        } else {
            rsElements.startBtn.style.display = 'inline-block';
            if (rsElements.stopBtn) rsElements.stopBtn.style.display = 'none';
            if (rsElements.statusBadge) rsElements.statusBadge.textContent = '대기 중';
            if (rsElements.statusBadge) rsElements.statusBadge.className = 'status-badge waiting';
        }

        // Update Research Logs
        if (data.research.logs) {
            updateResearchLogs(data.research.logs);
        }
    }

    // Update AI Generation stats if available
    if (data.generation) {
        agElements.pendingCount.textContent = data.generation.pending;
        agElements.completedCount.textContent = data.generation.completed;

        if (data.generation.is_running) {
            agElements.startBtn.style.display = 'none';
            if (agElements.stopBtn) agElements.stopBtn.style.display = 'inline-block';
            if (agElements.statusBadge) agElements.statusBadge.textContent = '실행 중...';
            if (agElements.statusBadge) agElements.statusBadge.className = 'status-badge running';
        } else {
            agElements.startBtn.style.display = 'inline-block';
            if (agElements.stopBtn) agElements.stopBtn.style.display = 'none';
            if (agElements.statusBadge) agElements.statusBadge.textContent = '대기 중';
            if (agElements.statusBadge) agElements.statusBadge.className = 'status-badge waiting';
        }

        // Update Generation Logs
        if (data.generation.logs) {
            updateGenerationLogs(data.generation.logs);
        }
    }

    // Auto-poll if any background task is running
    if (data.research?.is_running || data.generation?.is_running) {
        if (!pollInterval) {
            pollInterval = setTimeout(fetchStatus, 3000);
        }
    } else {
        if (pollInterval) {
            clearTimeout(pollInterval);
            pollInterval = null;
        }
    }
}

// ===========================================
// Smartlead Functions
// ===========================================

// Fetch Smartlead status
async function fetchSmartleadStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/smartlead/status`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            slElements.pendingCount.textContent = data.stats.pending;
            slElements.uploadedCount.textContent = data.stats.uploaded;
        } else {
            slElements.pendingCount.textContent = '-';
            slElements.uploadedCount.textContent = '-';
            slShowLog(`⚠️ ${data.error || '상태 조회 실패'}`, 'warning');
        }
    } catch (error) {
        console.error('Failed to fetch Smartlead status:', error);
        slElements.pendingCount.textContent = '-';
        slElements.uploadedCount.textContent = '-';
        // Don't show error for initial load - API might not be deployed yet
    }
}

// Upload to Smartlead
async function uploadToSmartlead() {
    const campaignId = slElements.campaignId.value.trim();

    if (!campaignId) {
        slShowLog('❌ 캠페인 ID를 입력하세요', 'error');
        return;
    }

    try {
        slElements.uploadBtn.disabled = true;
        slElements.uploadBtn.classList.add('loading');
        slShowLog('🚀 Smartlead 업로드 시작...', 'smartlead');

        const response = await fetch(`${API_BASE_URL}/smartlead/upload`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                campaign_id: campaignId
            })
        });

        const data = await response.json();

        if (data.success) {
            slShowLog(`✅ ${data.uploaded}건 업로드 완료!`, 'success');
            if (data.message) {
                slShowLog(`ℹ️ ${data.message}`, 'info');
            }
            fetchSmartleadStatus(); // Refresh counts
        } else {
            slShowLog(`❌ ${data.error || '업로드 실패'}`, 'error');
        }
    } catch (error) {
        console.error('Failed to upload to Smartlead:', error);
        slShowLog(`❌ 업로드 실패: ${error.message}`, 'error');
    } finally {
        slElements.uploadBtn.disabled = false;
        slElements.uploadBtn.classList.remove('loading');
    }
}

// Show log in Smartlead section
function slShowLog(message, type = '') {
    const timestamp = new Date().toLocaleTimeString('ko-KR', { hour12: false });
    const logEntry = `[${timestamp}] ${message}`;

    if (slElements.logsContainer.querySelector('.log-empty')) {
        slElements.logsContainer.innerHTML = '';
    }

    slElements.logsContainer.innerHTML += `<div class="log-entry ${type}">${escapeHtml(logEntry)}</div>`;
    slElements.logsContainer.scrollTop = slElements.logsContainer.scrollHeight;
}

// ===========================================
// AI Research & Generation Functions
// ===========================================

async function fetchResearchStatus() {
    return fetchStatus();
}

async function startResearch() {
    try {
        rsElements.startBtn.disabled = true;
        rsShowLog('🚀 AI 회사조사 백그라운드 작업 요청...', 'info');

        const response = await fetch(`${API_BASE_URL}/ai/research`, { method: 'POST' });
        const data = await response.json();

        if (data.success) {
            rsShowLog(`✅ ${data.message}`, 'success');
            fetchStatus(); // Update UI immediately
        } else {
            rsShowLog(`❌ 시작 실패: ${data.error}`, 'error');
            rsElements.startBtn.disabled = false;
        }
    } catch (error) {
        rsShowLog(`❌ 서버 연결 실패: ${error.message}`, 'error');
        rsElements.startBtn.disabled = false;
    }
}

async function stopResearch() {
    if (!confirm('회사 조사를 중단하시겠습니까?')) return;
    try {
        rsShowLog('🛑 중단 요청 중...', 'warning');
        const response = await fetch(`${API_BASE_URL}/ai/research/stop`, { method: 'POST' });
        const data = await response.json();
        if (data.success) {
            rsShowLog(`✅ ${data.message}`, 'success');
        }
    } catch (error) { rsShowLog(`❌ 중단 실패: ${error.message}`, 'error'); }
}

async function fetchGenerationStatus() {
    return fetchStatus();
}

async function startGeneration() {
    try {
        agElements.startBtn.disabled = true;
        agShowLog('🚀 AI 본문생성 백그라운드 작업 요청...', 'info');

        const response = await fetch(`${API_BASE_URL}/ai/generate`, { method: 'POST' });
        const data = await response.json();

        if (data.success) {
            agShowLog(`✅ ${data.message}`, 'success');
            fetchStatus();
        } else {
            agShowLog(`❌ 시작 실패: ${data.error}`, 'error');
            agElements.startBtn.disabled = false;
        }
    } catch (error) {
        agShowLog(`❌ 서버 연결 실패: ${error.message}`, 'error');
        agElements.startBtn.disabled = false;
    }
}

async function stopGeneration() {
    if (!confirm('본문 생성을 중단하시겠습니까?')) return;
    try {
        agShowLog('🛑 중단 요청 중...', 'warning');
        const response = await fetch(`${API_BASE_URL}/ai/generate/stop`, { method: 'POST' });
        const data = await response.json();
        if (data.success) {
            agShowLog(`✅ ${data.message}`, 'success');
        }
    } catch (error) { agShowLog(`❌ 중단 실패: ${error.message}`, 'error'); }
}

async function previewLatestGeneration() {
    try {
        agShowLog('🔍 최신 생성 본문 불러오는 중...', 'info');
        const response = await fetch(`${API_BASE_URL}/ai/generate/latest`);
        const data = await response.json();

        if (data.success) {
            openPreview(data.subject, data.body);
            agShowLog(`✅ ${data.company} 프리뷰 열림`, 'success');
        } else {
            agShowLog(`⚠️ ${data.error}`, 'warning');
        }
    } catch (error) {
        agShowLog(`❌ 프리뷰 불러오기 실패: ${error.message}`, 'error');
    }
}

function rsShowLog(message, type = '') {
    const timestamp = new Date().toLocaleTimeString('ko-KR', { hour12: false });
    const logEntry = `[${timestamp}] ${message}`;
    if (rsElements.logsContainer.querySelector('.log-empty')) rsElements.logsContainer.innerHTML = '';
    rsElements.logsContainer.innerHTML += `<div class="log-entry ${type}">${escapeHtml(logEntry)}</div>`;
    rsElements.logsContainer.scrollTop = rsElements.logsContainer.scrollHeight;
}

function agShowLog(message, type = '') {
    const timestamp = new Date().toLocaleTimeString('ko-KR', { hour12: false });
    const logEntry = `[${timestamp}] ${message}`;
    if (agElements.logsContainer.querySelector('.log-empty')) agElements.logsContainer.innerHTML = '';
    agElements.logsContainer.innerHTML += `<div class="log-entry ${type}">${escapeHtml(logEntry)}</div>`;
    agElements.logsContainer.scrollTop = agElements.logsContainer.scrollHeight;
}

// Update Research Logs from Backend
function updateResearchLogs(logs) {
    if (!logs || logs.length === 0) {
        if (!rsElements.logsContainer.querySelector('.log-entry')) {
            rsElements.logsContainer.innerHTML = '<div class="log-empty">로그가 없습니다</div>';
        }
        return;
    }

    // Check if we need to update (simple length check or content hash later, but for now strict replace)
    // To avoid flickering, we could diff, but standard innerHTML replace is fast enough for 50 lines.

    rsElements.logsContainer.innerHTML = logs.map(log => {
        let logClass = '';
        if (log.includes('✅')) logClass = 'success';
        else if (log.includes('❌')) logClass = 'error';
        else if (log.includes('⚠️')) logClass = 'warning';
        else if (log.includes('⏳') || log.includes('📧') || log.includes('🚀') || log.includes('🔍') || log.includes('✍️')) logClass = 'info';

        // Log is already formatted with [time] on backend
        return `<div class="log-entry ${logClass}">${escapeHtml(log)}</div>`;
    }).join('');

    rsElements.logsContainer.scrollTop = rsElements.logsContainer.scrollHeight;
}

// Update Generation Logs from Backend
function updateGenerationLogs(logs) {
    if (!logs || logs.length === 0) {
        if (!agElements.logsContainer.querySelector('.log-entry')) {
            agElements.logsContainer.innerHTML = '<div class="log-empty">로그가 없습니다</div>';
        }
        return;
    }

    agElements.logsContainer.innerHTML = logs.map(log => {
        let logClass = '';
        if (log.includes('✅')) logClass = 'success';
        else if (log.includes('❌')) logClass = 'error';
        else if (log.includes('⚠️')) logClass = 'warning';
        else if (log.includes('⏳') || log.includes('📧') || log.includes('🚀') || log.includes('🔍') || log.includes('✍️')) logClass = 'info';

        return `<div class="log-entry ${logClass}">${escapeHtml(log)}</div>`;
    }).join('');

    agElements.logsContainer.scrollTop = agElements.logsContainer.scrollHeight;
}

// ===========================================
// Pipeline Workflow Visualization Functions
// ===========================================

// Pipeline node configuration
const pipelineNodes = {
    scrape: { icon: '🔎', title: 'Scrape', subtitle: 'Google Maps 수집' },
    extract: { icon: '📧', title: 'Extract', subtitle: '이메일 추출' },
    research: { icon: '🤖', title: 'Research', subtitle: 'AI 회사조사' },
    generate: { icon: '✍️', title: 'Generate', subtitle: '이메일 생성' },
    upload: { icon: '🚀', title: 'Upload', subtitle: 'Smartlead 업로드' }
};

// Pipeline stage order for connector logic
const pipelineStageOrder = ['scrape', 'extract', 'research', 'generate', 'upload'];

// Initialize Pipeline Workflow
function initPipelineWorkflow() {
    const nodes = document.querySelectorAll('.pipeline-node[data-stage]');
    nodes.forEach(node => {
        node.addEventListener('click', () => {
            const stage = node.dataset.stage;
            // Map workflow stage to detail modal stage
            const stageMap = {
                'scrape': 'scraped',
                'extract': 'extracted',
                'research': 'researched',
                'generate': 'generated',
                'upload': 'completed'
            };
            const detailStage = stageMap[stage];
            if (detailStage && stageConfig[detailStage]) {
                openDetailModal(detailStage);
            }
        });
    });
}

// Update Pipeline Workflow based on workers status
function updatePipelineWorkflow(workers) {
    if (!workers) return;

    // Determine which stages are completed, running, or waiting
    const stageStatus = {};

    pipelineStageOrder.forEach(stage => {
        const worker = workers[stage];
        if (worker) {
            if (worker.status === 'running') {
                stageStatus[stage] = 'running';
            } else if (worker.status === 'completed') {
                stageStatus[stage] = 'completed';
            } else if (worker.status === 'error') {
                stageStatus[stage] = 'error';
            } else {
                stageStatus[stage] = 'waiting';
            }

            // Update node stats
            updateNodeStatus(
                stage,
                stageStatus[stage],
                worker.processed || 0,
                worker.current || '',
                worker.errors || 0
            );
        } else {
            stageStatus[stage] = 'waiting';
            updateNodeStatus(stage, 'waiting', 0, '', 0);
        }
    });

    // Update connectors
    updatePipelineConnectors(stageStatus);
}

// Update individual node status
function updateNodeStatus(stage, status, processed, current, errors) {
    const node = document.querySelector(`.pipeline-node[data-stage="${stage}"]`);
    if (!node) return;

    // Remove all status classes
    node.classList.remove('node-waiting', 'node-running', 'node-completed', 'node-error');

    // Add appropriate status class
    node.classList.add(`node-${status}`);

    // Update status badge
    const badge = node.querySelector('.node-status-badge');
    if (badge) {
        const statusText = {
            'waiting': '대기',
            'running': '실행중',
            'completed': '완료',
            'error': '오류'
        };
        badge.textContent = statusText[status] || '대기';
    }

    // Update stats
    const processedEl = node.querySelector('.stat-processed');
    if (processedEl) {
        processedEl.textContent = `${processed}건 처리`;
    }

    const currentEl = node.querySelector('.stat-current');
    if (currentEl) {
        if (current && status === 'running') {
            currentEl.textContent = current;
            currentEl.style.display = 'block';
        } else {
            currentEl.textContent = '';
            currentEl.style.display = 'none';
        }
    }
}

// Update pipeline connectors based on stage status
function updatePipelineConnectors(stageStatus) {
    const connectors = document.querySelectorAll('.pipeline-connector');

    // Row 1 connectors: scrape -> extract, extract -> research
    // Vertical connector: research -> generate
    // Row 2 connectors: generate -> upload

    connectors.forEach((connector, index) => {
        connector.classList.remove('connector-running', 'connector-completed');

        // Determine which connector this is based on index
        // Index 0: scrape -> extract
        // Index 1: extract -> research
        // Index 2: research -> generate (vertical)
        // Index 3: generate -> upload

        let sourceStage, targetStage;

        switch (index) {
            case 0:
                sourceStage = 'scrape';
                targetStage = 'extract';
                break;
            case 1:
                sourceStage = 'extract';
                targetStage = 'research';
                break;
            case 2:
                sourceStage = 'research';
                targetStage = 'generate';
                break;
            case 3:
                sourceStage = 'generate';
                targetStage = 'upload';
                break;
            default:
                return;
        }

        const sourceStatus = stageStatus[sourceStage];
        const targetStatus = stageStatus[targetStage];

        // Connector is running if source is completed and target is running
        if (sourceStatus === 'completed' && targetStatus === 'running') {
            connector.classList.add('connector-running');
        }
        // Connector is completed if both are completed
        else if (sourceStatus === 'completed' && (targetStatus === 'completed' || targetStatus === 'error')) {
            connector.classList.add('connector-completed');
        }
        // Also show running if source is running (data is flowing)
        else if (sourceStatus === 'running') {
            connector.classList.add('connector-running');
        }
    });
}

// Reset pipeline workflow to initial state
function resetPipelineWorkflow() {
    pipelineStageOrder.forEach(stage => {
        updateNodeStatus(stage, 'waiting', 0, '', 0);
    });

    const connectors = document.querySelectorAll('.pipeline-connector');
    connectors.forEach(connector => {
        connector.classList.remove('connector-running', 'connector-completed');
    });
}

// ===========================================
// Global Stats Functions (New API)
// ===========================================

// Fetch global lead statistics from /pipeline/stats
async function fetchGlobalStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/pipeline/stats`);
        const data = await response.json();

        if (data.success) {
            globalStats = data;
            updateDashboardWithGlobalStats(data);
        }
    } catch (error) {
        console.error('Failed to fetch global stats:', error);
    }
}

// Update dashboard with global statistics
function updateDashboardWithGlobalStats(data) {
    const byStatus = data.by_status || {};
    const scraped = byStatus.scraped || 0;
    const extracted = byStatus.extracted || 0;
    const researched = byStatus.researched || 0;
    const generated = byStatus.generated || 0;
    const completed = byStatus.completed || 0;
    const filtered = byStatus.filtered || 0;
    const errors = byStatus.error || 0;
    const total = data.total || 0;

    // Update stat cards with global stats
    if (plElements.scraped) plElements.scraped.textContent = scraped;
    if (plElements.extracted) plElements.extracted.textContent = extracted;
    if (plElements.researched) plElements.researched.textContent = researched;
    if (plElements.generated) plElements.generated.textContent = generated;
    if (plElements.completed) plElements.completed.textContent = completed;
    if (plElements.filtered) plElements.filtered.textContent = filtered;
    if (plElements.errors) plElements.errors.textContent = errors;

    // Update funnel based on global stats
    if (scraped > 0) {
        const extractedPct = Math.round((extracted / scraped) * 100);
        const researchedPct = Math.round((researched / scraped) * 100);
        const completedPct = Math.round((completed / scraped) * 100);

        if (plElements.funnelExtracted) plElements.funnelExtracted.style.width = `${extractedPct}%`;
        if (plElements.funnelResearched) plElements.funnelResearched.style.width = `${researchedPct}%`;
        if (plElements.funnelCompleted) plElements.funnelCompleted.style.width = `${completedPct}%`;

        if (plElements.funnelExtractedPct) plElements.funnelExtractedPct.textContent = `${extractedPct}%`;
        if (plElements.funnelResearchedPct) plElements.funnelResearchedPct.textContent = `${researchedPct}%`;
        if (plElements.funnelCompletedPct) plElements.funnelCompletedPct.textContent = `${completedPct}%`;
    }

    // Show/hide error section
    if (plElements.errorSection) {
        plElements.errorSection.style.display = errors > 0 ? 'block' : 'none';
    }

    // Update Pipeline Workflow with global stats
    updatePipelineWorkflowWithGlobalStats(byStatus);
}

// Update Pipeline Workflow based on global stats
function updatePipelineWorkflowWithGlobalStats(byStatus) {
    const scraped = byStatus.scraped || 0;
    const extracted = byStatus.extracted || 0;
    const researched = byStatus.researched || 0;
    const generated = byStatus.generated || 0;
    const completed = byStatus.completed || 0;

    // Stage mapping for workflow nodes
    const stageMapping = {
        'scrape': { processed: scraped },
        'extract': { processed: extracted },
        'research': { processed: researched },
        'generate': { processed: generated },
        'upload': { processed: completed }
    };

    // Determine status for each stage
    const stageStatus = {};
    pipelineStageOrder.forEach(stage => {
        const data = stageMapping[stage];
        if (data.processed > 0) {
            stageStatus[stage] = 'completed';
        } else {
            stageStatus[stage] = 'waiting';
        }

        // If pipeline is running, determine which stage is active
        if (isPipelineRunning) {
            // Find the stage that should be running
            if (stage === 'scrape' && scraped === 0) {
                stageStatus[stage] = 'running';
            } else if (stage === 'extract' && scraped > 0 && extracted === 0) {
                stageStatus[stage] = 'running';
            } else if (stage === 'research' && extracted > 0 && researched === 0) {
                stageStatus[stage] = 'running';
            } else if (stage === 'generate' && researched > 0 && generated === 0) {
                stageStatus[stage] = 'running';
            } else if (stage === 'upload' && generated > 0 && completed === 0) {
                stageStatus[stage] = 'running';
            }
        }

        // Update node with processed count
        updateNodeStatus(
            stage,
            stageStatus[stage],
            data.processed,
            '',
            0
        );
    });

    // Update connectors
    updatePipelineConnectors(stageStatus);
}

// ===========================================
// Pipeline Dashboard Functions
// ===========================================

// Fetch Pipeline Status (Dashboard) - for running state and logs
async function fetchPipelineStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/pipeline/status`);
        const data = await response.json();

        if (data.success) {
            currentPipelineRunId = data.run_id;
            isPipelineRunning = data.is_running || false;
            updatePipelineStatusUI(data);
        }
    } catch (error) {
        console.error('Failed to fetch pipeline status:', error);
    }
}

// Update Pipeline Status UI (status badge, logs, running state)
function updatePipelineStatusUI(data) {
    const status = data.run?.status;

    // Update status badge
    if (plElements.statusBadge) {
        if (data.is_running) {
            plElements.statusBadge.textContent = '실행 중...';
            plElements.statusBadge.className = 'status-badge running';
            updatePipelineControlUI('running');
        } else if (status === 'completed') {
            plElements.statusBadge.textContent = '완료';
            plElements.statusBadge.className = 'status-badge completed';
            updatePipelineControlUI('completed');
        } else {
            plElements.statusBadge.textContent = '대기 중';
            plElements.statusBadge.className = 'status-badge waiting';
            updatePipelineControlUI('waiting');
        }
    }

    // Update last run time
    if (plElements.lastRun && data.run?.created_at) {
        const date = new Date(data.run.created_at);
        plElements.lastRun.textContent = date.toLocaleString('ko-KR');
    }

    // Update logs
    if (data.logs && plElements.logsContainer) {
        renderDashboardLogs(data.logs);
    }

    // Re-update workflow with current global stats when running state changes
    if (globalStats) {
        updatePipelineWorkflowWithGlobalStats(globalStats.by_status || {});
    }

    // If running, poll more frequently for both status and stats
    if (data.is_running && !pipelinePollInterval) {
        pipelinePollInterval = setInterval(() => {
            fetchPipelineStatus();
            fetchGlobalStats();
        }, 3000);
    } else if (!data.is_running && pipelinePollInterval) {
        clearInterval(pipelinePollInterval);
        pipelinePollInterval = null;
    }
}

// Render recent logs for dashboard
function renderDashboardLogs(logs) {
    if (!logs || logs.length === 0) {
        plElements.logsContainer.innerHTML = '<div class="log-empty">로그가 없습니다</div>';
        return;
    }

    // Show only last 10 logs
    const recentLogs = logs.slice(-10);

    plElements.logsContainer.innerHTML = recentLogs.map(log => {
        const timestamp = log.timestamp ? new Date(log.timestamp).toLocaleTimeString('ko-KR', { hour12: false }) : '';
        const stageIcon = getStageIcon(log.stage);
        let logClass = log.level === 'error' ? 'error' : (log.level === 'warning' ? 'warning' : '');

        return `<div class="log-entry ${logClass}">[${timestamp}] ${stageIcon} ${escapeHtml(log.message)}</div>`;
    }).join('');

    plElements.logsContainer.scrollTop = plElements.logsContainer.scrollHeight;
}

// Get stage icon
function getStageIcon(stage) {
    const icons = {
        'scrape': '🔎',
        'extract': '📧',
        'research': '🤖',
        'generate': '✍️',
        'upload': '🚀',
        'orchestrator': '⚡'
    };
    return icons[stage] || '📋';
}

// Show log in Pipeline Dashboard section
function plShowLog(message, type = '') {
    const timestamp = new Date().toLocaleTimeString('ko-KR', { hour12: false });
    const logEntry = `[${timestamp}] ${message}`;

    if (plElements.logsContainer.querySelector('.log-empty')) {
        plElements.logsContainer.innerHTML = '';
    }

    plElements.logsContainer.innerHTML += `<div class="log-entry ${type}">${escapeHtml(logEntry)}</div>`;
    plElements.logsContainer.scrollTop = plElements.logsContainer.scrollHeight;
}

// ===========================================
// Utility Functions
// ===========================================

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===========================================
// Detail Modal Functions
// ===========================================

// Stage configuration for detail modal
const stageConfig = {
    'scraped': {
        title: '수집된 리드',
        columns: ['회사명', '웹사이트', '지역', '키워드'],
        fields: ['company_name', 'website', 'region', 'keyword']
    },
    'extracted': {
        title: '이메일 추출',
        columns: ['회사명', '웹사이트', '추출 이메일', '이메일 등급'],
        fields: ['company_name', 'website', 'final_email', 'email_grade']
    },
    'researched': {
        title: '검증 통과 (B2B 적합)',
        columns: ['회사명', '웹사이트', '이메일', '회사 요약'],
        fields: ['company_name', 'website', 'final_email', 'research_summary']
    },
    'filtered': {
        title: '필터링됨 (B2B 부적합)',
        columns: ['회사명', '웹사이트', '부적합 이유'],
        fields: ['company_name', 'website', 'research_reason']
    },
    'generated': {
        title: '이메일 생성 완료',
        columns: ['회사명', '이메일', '제목', '본문'],
        fields: ['company_name', 'final_email', 'email_subject', 'email_body']
    },
    'completed': {
        title: '발송 완료',
        columns: ['회사명', '웹사이트', '이메일', '지역', '제목', '본문', 'Smartlead'],
        fields: ['company_name', 'website', 'final_email', 'region', 'email_subject', 'email_body', 'smartlead_status']
    }
};

// Detail modal state
let detailModalState = {
    stage: null,
    currentPage: 1,
    totalPages: 1,
    limit: 50,
    totalCount: 0
};

// Detail modal DOM elements
const detailModalElements = {
    modal: null,
    title: null,
    count: null,
    closeBtn: null,
    loading: null,
    tableContainer: null,
    tableHead: null,
    tableBody: null,
    empty: null,
    prevBtn: null,
    nextBtn: null,
    pageInfo: null
};

// Initialize detail modal
function initDetailModal() {
    detailModalElements.modal = document.getElementById('detail-modal');
    detailModalElements.title = document.getElementById('detail-modal-title');
    detailModalElements.count = document.getElementById('detail-modal-count');
    detailModalElements.closeBtn = document.querySelector('.close-detail-modal');
    detailModalElements.loading = document.getElementById('detail-loading');
    detailModalElements.tableContainer = document.querySelector('.detail-table-container');
    detailModalElements.tableHead = document.getElementById('detail-table-head');
    detailModalElements.tableBody = document.getElementById('detail-table-body');
    detailModalElements.empty = document.getElementById('detail-empty');
    detailModalElements.prevBtn = document.getElementById('detail-prev-btn');
    detailModalElements.nextBtn = document.getElementById('detail-next-btn');
    detailModalElements.pageInfo = document.getElementById('detail-page-info');

    // Close button event
    if (detailModalElements.closeBtn) {
        detailModalElements.closeBtn.addEventListener('click', closeDetailModal);
    }

    // Close on outside click
    if (detailModalElements.modal) {
        detailModalElements.modal.addEventListener('click', (e) => {
            if (e.target === detailModalElements.modal) {
                closeDetailModal();
            }
        });
    }

    // Pagination events
    if (detailModalElements.prevBtn) {
        detailModalElements.prevBtn.addEventListener('click', () => {
            if (detailModalState.currentPage > 1) {
                detailModalState.currentPage--;
                fetchLeadsForStage(detailModalState.stage, detailModalState.currentPage);
            }
        });
    }

    if (detailModalElements.nextBtn) {
        detailModalElements.nextBtn.addEventListener('click', () => {
            if (detailModalState.currentPage < detailModalState.totalPages) {
                detailModalState.currentPage++;
                fetchLeadsForStage(detailModalState.stage, detailModalState.currentPage);
            }
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && detailModalElements.modal && detailModalElements.modal.classList.contains('active')) {
            closeDetailModal();
        }
    });
}

// Initialize dashboard card click events
function initDashboardCardClicks() {
    const clickableCards = document.querySelectorAll('.dashboard-card.clickable[data-stage]');

    clickableCards.forEach(card => {
        card.addEventListener('click', () => {
            const stage = card.dataset.stage;
            if (stage && stageConfig[stage]) {
                openDetailModal(stage);
            }
        });
    });
}

// Open detail modal
function openDetailModal(stage) {
    if (!detailModalElements.modal) return;

    const config = stageConfig[stage];
    if (!config) return;

    detailModalState.stage = stage;
    detailModalState.currentPage = 1;

    // Update title
    detailModalElements.title.textContent = config.title;
    detailModalElements.count.textContent = '0건';

    // Show modal
    detailModalElements.modal.classList.add('active');

    // Fetch data
    fetchLeadsForStage(stage, 1);
}

// Close detail modal
function closeDetailModal() {
    if (detailModalElements.modal) {
        detailModalElements.modal.classList.remove('active');
    }
    // Reset state
    detailModalState.stage = null;
    detailModalState.currentPage = 1;
    detailModalState.totalPages = 1;
}

// Fetch leads for a specific stage (using global API)
async function fetchLeadsForStage(stage, page = 1) {
    showDetailLoading(true);

    try {
        const offset = (page - 1) * detailModalState.limit;
        // Use global API: /pipeline/leads?status={stage}
        const url = `${API_BASE_URL}/pipeline/leads?status=${stage}&limit=${detailModalState.limit}&offset=${offset}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
            detailModalState.totalCount = data.total || 0;
            detailModalState.totalPages = Math.ceil(detailModalState.totalCount / detailModalState.limit) || 1;

            // Update count badge
            detailModalElements.count.textContent = `${detailModalState.totalCount}건`;

            if (data.leads && data.leads.length > 0) {
                renderDetailTable(stage, data.leads);
                showDetailEmpty(false);
            } else {
                showDetailEmpty('데이터가 없습니다.');
            }

            updatePagination();
        } else {
            showDetailEmpty(data.error || '데이터를 불러오는데 실패했습니다.');
        }
    } catch (error) {
        console.error('Failed to fetch leads:', error);
        showDetailEmpty('서버 연결에 실패했습니다.');
    } finally {
        showDetailLoading(false);
    }
}

// Render detail table
function renderDetailTable(stage, leads) {
    const config = stageConfig[stage];
    if (!config) return;

    // Render table header
    detailModalElements.tableHead.innerHTML = `
        <tr>
            ${config.columns.map(col => `<th>${escapeHtml(col)}</th>`).join('')}
        </tr>
    `;

    // Render table body
    detailModalElements.tableBody.innerHTML = leads.map(lead => {
        return `<tr>${config.fields.map(field => renderTableCell(field, lead[field], lead)).join('')}</tr>`;
    }).join('');

    // Show table
    if (detailModalElements.tableContainer) {
        detailModalElements.tableContainer.style.display = 'block';
    }
}

// Render individual table cell with special formatting
function renderTableCell(field, value, lead) {
    if (value === null || value === undefined || value === '') {
        value = '-';
    }

    switch (field) {
        case 'website':
            if (value && value !== '-') {
                const url = value.startsWith('http') ? value : `https://${value}`;
                return `<td><a href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(value)}</a></td>`;
            }
            return `<td>${escapeHtml(value)}</td>`;

        case 'is_b2b_suitable':
        case 'research_suitable':
            const isSuitable = value === true || value === 'true' || value === 'yes' || value === 'Y' || value === '적합';
            const badgeClass = isSuitable ? 'yes' : 'no';
            const badgeText = isSuitable ? '적합' : '부적합';
            return `<td><span class="badge-suitable ${badgeClass}">${badgeText}</span></td>`;

        case 'research_result':
        case 'research_reason':
        case 'research_summary':
        case 'body':
        case 'email_body':
            // Truncate long text and add title for hover
            const valueStr = String(value);
            const truncated = valueStr.length > 50 ? valueStr.substring(0, 50) + '...' : valueStr;
            return `<td class="wrap-text" title="${escapeHtml(valueStr)}">${escapeHtml(truncated)}</td>`;

        case 'email_subject':
            // Email subject - show full but with reasonable length
            const subjectStr = String(value);
            const truncSubject = subjectStr.length > 60 ? subjectStr.substring(0, 60) + '...' : subjectStr;
            return `<td title="${escapeHtml(subjectStr)}">${escapeHtml(truncSubject)}</td>`;

        case 'extracted_email':
        case 'final_email':
        case 'apify_email':
            if (value && value !== '-') {
                return `<td><a href="mailto:${escapeHtml(value)}">${escapeHtml(value)}</a></td>`;
            }
            return `<td>${escapeHtml(value)}</td>`;

        default:
            return `<td>${escapeHtml(String(value))}</td>`;
    }
}

// Show/hide loading state
function showDetailLoading(show) {
    if (detailModalElements.loading) {
        detailModalElements.loading.style.display = show ? 'flex' : 'none';
    }
    if (detailModalElements.tableContainer) {
        detailModalElements.tableContainer.style.display = show ? 'none' : 'block';
    }
}

// Show empty state
function showDetailEmpty(message) {
    if (typeof message === 'string') {
        if (detailModalElements.empty) {
            detailModalElements.empty.textContent = message;
            detailModalElements.empty.style.display = 'flex';
        }
        if (detailModalElements.tableContainer) {
            detailModalElements.tableContainer.style.display = 'none';
        }
    } else {
        // message is boolean false - hide empty state
        if (detailModalElements.empty) {
            detailModalElements.empty.style.display = 'none';
        }
    }
}

// Update pagination buttons
function updatePagination() {
    const { currentPage, totalPages } = detailModalState;

    if (detailModalElements.prevBtn) {
        detailModalElements.prevBtn.disabled = currentPage <= 1;
    }

    if (detailModalElements.nextBtn) {
        detailModalElements.nextBtn.disabled = currentPage >= totalPages;
    }

    if (detailModalElements.pageInfo) {
        detailModalElements.pageInfo.textContent = `${currentPage} / ${totalPages}`;
    }
}
