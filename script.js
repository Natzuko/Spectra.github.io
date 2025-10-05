// ===== CONFIGURACIÓN =====
const API_KEYS = [
    "LQ0BWLsTkObLc1qqahwOR4BenZEQvVsWttCGqMPK",
    "DEMO_KEY"
];

const NASA_APIS = {
    EPIC: 'https://api.nasa.gov/EPIC/api/natural/images',
    APOD: 'https://api.nasa.gov/planetary/apod'
};

// ===== ESTADO DE LA APLICACIÓN =====
let appState = {
    currentDataSource: null,
    lastUpdate: null,
    errorCount: 0,
    apiStatus: 'unknown'
};

// ===== ELEMENTOS DEL DOM =====
const statusEl = document.getElementById('status');
const imageContainer = document.getElementById('image-container');
const apiStatusEl = document.getElementById('api-status');
const nasaEmbedEl = document.getElementById('nasa-embed');
const debugDataEl = document.getElementById('debug-data');
const currentTimeEl = document.getElementById('current-time');
const dataSourceEl = document.getElementById('data-source');
const lastUpdateEl = document.getElementById('last-update');
const systemStatusEl = document.getElementById('system-status');

// ===== FUNCIONES DE UTILIDAD =====

function updateCurrentTime() {
    const now = new Date();
    currentTimeEl.textContent = now.toLocaleString();
}

function updateDataSourceInfo(source) {
    dataSourceEl.textContent = source;
    lastUpdateEl.textContent = new Date().toLocaleString();
}

function updateSystemStatus(status) {
    const statusConfig = {
        'working': { color: '#4CAF50', text: 'System Operational' },
        'warning': { color: '#FF9800', text: 'Limited Functionality' },
        'error': { color: '#F44336', text: 'System Impaired' },
        'unknown': { color: '#12A7B8', text: 'Initializing' }
    };

    const config = statusConfig[status] || statusConfig.unknown;
    systemStatusEl.style.color = config.color;
    apiStatusEl.textContent = config.text;
}

function updateDebugInfo(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const typeIcon = {
        'info': '🔹',
        'success': '✅',
        'warning': '⚠️',
        'error': '❌'
    }[type] || '🔸';

    const messageDiv = document.createElement('div');
    messageDiv.className = 'debug-entry';
    messageDiv.innerHTML = `<span style="opacity:0.7">[${timestamp}]</span> ${typeIcon} ${message}`;
    debugDataEl.appendChild(messageDiv);
    debugDataEl.scrollTop = debugDataEl.scrollHeight;
}

function clearDebug() {
    debugDataEl.innerHTML = '<div class="debug-entry">Debug log cleared</div>';
    updateDebugInfo('System monitor initialized', 'info');
}

function updateStatusCard(message, type = 'loading') {
    const statusConfig = {
        'loading': { icon: '⏳', class: 'loading' },
        'success': { icon: '✅', class: 'success' },
        'error': { icon: '❌', class: 'error' },
        'warning': { icon: '⚠️', class: 'warning' }
    };

    const config = statusConfig[type] || statusConfig.loading;

    statusEl.innerHTML = `
        <div class="status-icon">${config.icon}</div>
        <div class="status-text">${message}</div>
    `;
    statusEl.className = `status-card ${config.class}`;
}

// ===== FUNCIONES PRINCIPALES =====

async function loadData(sourceType) {
    appState.currentDataSource = sourceType;
    nasaEmbedEl.style.display = 'none';
    imageContainer.innerHTML = '';

    const sourceNames = {
        'api': 'NASA LIVE API',
        'mock': 'DEMO DATA',
        'embed': 'NASA EMBED'
    };

    updateDataSourceInfo(sourceNames[sourceType]);

    switch (sourceType) {
        case 'api':
            await fetchEPICData();
            break;
        case 'mock':
            await loadMockData();
            break;
        default:
            updateStatusCard('Please select a data source', 'warning');
    }
}

function showNASAEmbed() {
    appState.currentDataSource = 'embed';
    imageContainer.innerHTML = '';
    updateStatusCard('Displaying NASA embedded content', 'success');
    nasaEmbedEl.style.display = 'block';
    updateDataSourceInfo('NASA EMBED');
    updateSystemStatus('working');
    updateDebugInfo('Switched to NASA embedded content', 'info');
}

// ===== MOCK DATA FALLBACK =====
async function loadMockData() {
    updateStatusCard('Loading demonstration data...', 'loading');
    updateSystemStatus('warning');

    try {
        const response = await fetch('./mock-data.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

        const data = await response.json();
        appState.lastUpdate = new Date();

        displayEPICImages(data, true);
        updateDebugInfo('Demo data loaded successfully', 'success');

    } catch (error) {
        updateStatusCard(`Error loading demo data: ${error.message}`, 'error');
        updateDebugInfo(`Demo data error: ${error.message}`, 'error');

        // Fallback a datos mock embebidos
        const fallbackMockData = getFallbackMockData();
        displayEPICImages(fallbackMockData, true);
        updateDebugInfo('Using embedded fallback demo data', 'warning');
    }
}

function getFallbackMockData() {
    return [
        {
            "identifier": "20241011011347",
            "caption": "Spectra Demo - Earth observation from DSCOVR satellite",
            "image": "epic_1b_20241011011347",
            "version": "03",
            "centroid_coordinates": {
                "lat": 15.2,
                "lon": -45.8
            },
            "dscovr_j2000_position": {
                "x": 1256894.321,
                "y": -654321.123,
                "z": 298456.789
            },
            "date": "2024-10-11 01:13:47"
        }
    ];
}

// ===== NASA API =====
async function fetchEPICData() {
    updateStatusCard('Connecting to NASA EPIC API...', 'loading');
    updateSystemStatus('unknown');

    let lastError = null;

    // Probar todas las API keys
    for (let i = 0; i < API_KEYS.length; i++) {
        const apiKey = API_KEYS[i];
        const apiUrl = `${NASA_APIS.EPIC}?api_key=${apiKey}`;

        try {
            updateDebugInfo(`Testing API connection ${i + 1}...`, 'info');

            const response = await fetch(apiUrl);

            if (response.status === 429) {
                updateDebugInfo(`Rate limit exceeded (429) - Trying next key`, 'warning');
                continue;
            }

            if (response.status === 503) {
                updateDebugInfo(`Service unavailable (503)`, 'warning');
                continue;
            }

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data || data.length === 0) {
                throw new Error('No imagery data available');
            }

            // Éxito!
            appState.lastUpdate = new Date();
            appState.errorCount = 0;
            appState.apiStatus = 'working';

            updateSystemStatus('working');
            displayEPICImages(data, false);
            updateDebugInfo(`API connection successful. Loaded ${data.length} images`, 'success');
            return;

        } catch (error) {
            lastError = error;
            updateDebugInfo(`API attempt ${i + 1} failed: ${error.message}`, 'error');
        }
    }

    // Si todas las keys fallan
    appState.apiStatus = 'error';
    updateSystemStatus('error');
    handleAPIError(lastError);
}

function displayEPICImages(images, isMockData) {
    const imagesToShow = images.slice(0, 3);

    updateStatusCard(
        `Loaded ${imagesToShow.length} EPIC images ${isMockData ? '(Demo Data)' : '(Live NASA Data)'}`,
        isMockData ? 'warning' : 'success'
    );

    imageContainer.innerHTML = imagesToShow.map((image, index) => {
        const date = new Date(image.date);
        const imageName = image.image;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        // Para mock data, usar placeholder
        let imageUrl;
        if (isMockData) {
            imageUrl = 'https://via.placeholder.com/600x400/1D2833/D4E5DE?text=SPECTRA+DEMO+IMAGE';
        } else {
            imageUrl = `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/png/${imageName}.png`;
        }

        return `
            <div class="image-card">
                <div class="image-header">
                    <h3>EPIC Image ${index + 1} - ${date.toLocaleDateString()} ${isMockData ? '🔸 DEMO' : '🛰️ LIVE'}</h3>
                </div>
                <img src="${imageUrl}" 
                    alt="EPIC Earth Image from ${date.toLocaleDateString()}" 
                    class="epic-image"
                    onerror="this.onerror=null; this.src='https://via.placeholder.com/600x400/1D2833/12A7B8?text=IMAGE+UNAVAILABLE'">
                <div class="image-details">
                    <p><strong>Caption:</strong> ${image.caption || 'No caption available'}</p>
                    <div class="data-panel">
                        <pre>${JSON.stringify({
            date: image.date,
            coordinates: image.centroid_coordinates,
            data_quality: isMockData ? 'Demonstration data for testing' : 'Live from NASA EPIC API',
            resolution: isMockData ? 'Simulated' : 'Actual satellite data'
        }, null, 2)}</pre>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function handleAPIError(error) {
    appState.errorCount++;

    updateStatusCard(`NASA API unavailable: ${error.message}`, 'error');
    updateDebugInfo(`All API attempts failed. Last error: ${error.message}`, 'error');

    // Sugerir alternativas
    imageContainer.innerHTML = `
        <div class="image-card" style="text-align: center; padding: var(--space-xl);">
            <div class="image-header">
                <h3>🌌 NASA EPIC API Currently Unavailable</h3>
            </div>
            <div class="image-details">
                <p>Common issues: Rate limiting, service maintenance, or network connectivity.</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: var(--space-md); margin: var(--space-lg) 0;">
                    <button class="control-btn secondary" onclick="loadData('mock')">
                        <span class="btn-icon">🔸</span>
                        Use Demo Data
                    </button>
                    <button class="control-btn tertiary" onclick="showNASAEmbed()">
                        <span class="btn-icon">🌐</span>
                        NASA Website
                    </button>
                    <button class="control-btn primary" onclick="fetchEPICData()">
                        <span class="btn-icon">🔄</span>
                        Retry API
                    </button>
                </div>
                <div style="font-size: 0.9rem; opacity: 0.7;">
                    <p>Error details: ${error.message}</p>
                    <p>Failed connection attempts: ${appState.errorCount}</p>
                </div>
            </div>
        </div>
    `;
}

// ===== DIAGNÓSTICO INICIAL =====
async function runInitialDiagnostics() {
    updateDebugInfo('SPECTRA System Initialization', 'info');
    updateDebugInfo(`User Agent: ${navigator.userAgent.split(' ')[0]}`, 'info');
    updateDebugInfo(`Available API endpoints: ${Object.keys(NASA_APIS).length}`, 'info');

    // Test básico de conectividad
    try {
        const testResponse = await fetch('https://httpbin.org/status/200');
        if (testResponse.ok) {
            updateDebugInfo('Network connectivity: OK', 'success');
        }
    } catch (error) {
        updateDebugInfo('Network connectivity: Check internet connection', 'error');
    }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function () {
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);

    // Ejecutar diagnóstico inicial
    runInitialDiagnostics();

    // Auto-carga después de breve delay
    setTimeout(() => {
        updateDebugInfo('Attempting automatic connection to NASA API...', 'info');
        fetchEPICData().catch(() => {
            updateDebugInfo('Automatic connection failed, ready for manual selection', 'warning');
            updateStatusCard('Select a data source to begin', 'warning');
        });
    }, 2000);
});

// ===== FUNCIONES GLOBALES =====
window.reloadEPICData = function () {
    if (appState.currentDataSource === 'api') {
        fetchEPICData();
    } else if (appState.currentDataSource === 'mock') {
        loadMockData();
    }
};

window.loadData = loadData;
window.showNASAEmbed = showNASAEmbed;
window.clearDebug = clearDebug;