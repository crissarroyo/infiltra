/**
 * INFILTRA - Game Logic v1.1.0 (Robust Edition)
 * 
 * CORRECCIONES v1.1.0:
 * ✓ Sistema de persistencia mejorado (votedPlayers Set → Array → Set)
 * ✓ Transferencia de host manual (long-press 800ms) y automática
 * ✓ Timer universal basado en timestamp (resistente a pantalla apagada)
 * ✓ Sistema de consenso por mayoría simple para resultados
 * ✓ Botón post-empate aparece después de TIE_BUTTON_DELAY
 * ✓ Charlatán se revela como "CHARLATÁN"
 * ✓ refreshInterval se reinicia al volver al lobby
 */

const ICONS = {
    citizen: 'assets/icons/icon-citizen.png',
    impostor: 'assets/icons/icon-impostor.png',
    charlatan: 'assets/icons/icon-charlatan.png',
    help: 'assets/icons/icon-help.png',
    check: 'assets/icons/icon-check.png',
    close: 'assets/icons/icon-close.png',
    kick: 'assets/icons/icon-kick.png',
    lock: 'assets/icons/icon-lock.png',
    active: 'assets/icons/icon-active.png',
    eliminated: 'assets/icons/icon-eliminated.png',
    voted: 'assets/icons/icon-voted.png',
    pending: 'assets/icons/icon-pending.png',
    tie: 'assets/icons/icon-tie.png',
    celebrate: 'assets/icons/icon-celebrate.png',
    medalGold: 'assets/icons/icon-medal-gold.png',
    medalSilver: 'assets/icons/icon-medal-silver.png',
    medalBronze: 'assets/icons/icon-medal-bronze.png',
    warning: 'assets/icons/icon-warning.png',
    soundOn: 'assets/icons/icon-sound-on.png',
    soundOff: 'assets/icons/icon-sound-off.png',
    play: 'assets/icons/icon-play.png'
};

const POINTS = {
    CITIZEN_SURVIVE: 15,
    CITIZEN_CORRECT_VOTE: 7,
    CITIZEN_WRONG_VOTE: -3,
    IMPOSTOR_WIN: 30,
    IMPOSTOR_SURVIVE_ROUND: 5,
    CHARLATAN_SURVIVE: 25
};

const DB = {
    "Animales": ["León", "Tigre", "Elefante", "Zebra", "Delfín", "Lobo", "Gorila", "Águila", "Jirafa", "Oso", "Zorro", "Panda", "Tiburón", "Canguro", "Hipopótamo", "Serpiente", "Cocodrilo", "Mono", "Tortuga", "Pulpo", "Rinoceronte"],
    "Comida": ["Pizza", "Tacos", "Sushi", "Hamburguesa", "Pasta", "Ensalada", "Helado", "Pollo", "Pescado", "Chocolate", "Empanadas", "Ramen", "Curry", "Paella", "Burrito", "Croissant", "Queso", "Arroz", "Sopa", "Tarta"],
    "Países": ["México", "Japón", "Brasil", "España", "Francia", "Italia", "Alemania", "Australia", "Argentina", "Canadá", "China", "India", "Rusia", "Estados Unidos", "Reino Unido", "Egipto", "Corea del Sur", "Turquía", "Chile", "Colombia"],
    "Profesiones": ["Médico", "Abogado", "Ingeniero", "Profesor", "Chef", "Piloto", "Arquitecto", "Programador", "Fotógrafo", "Enfermero", "Diseñador", "Periodista", "Músico", "Actor", "Científico", "Veterinario", "Contador", "Psicólogo", "Bombero", "Policía"],
    "Celebridades": ["Elon Musk", "Oprah Winfrey", "Kim Kardashian", "Cristiano Ronaldo", "Lionel Messi", "Taylor Swift", "Kanye West", "Shakira", "Dwayne Johnson", "Beyoncé", "Bill Gates", "Rihanna", "Jeff Bezos", "Bad Bunny", "MrBeast"],
    "Actores": ["Leonardo DiCaprio", "Brad Pitt", "Tom Cruise", "Johnny Depp", "Robert Downey Jr.", "Scarlett Johansson", "Natalie Portman", "Will Smith", "Keanu Reeves", "Ryan Gosling", "Margot Robbie", "Christian Bale", "Joaquin Phoenix"],
    "Cantantes": ["Michael Jackson", "Madonna", "Taylor Swift", "Adele", "Ed Sheeran", "Shakira", "Bad Bunny", "Drake", "The Weeknd", "Bruno Mars", "Beyoncé", "Justin Bieber", "Lady Gaga"],
    "Series": ["Breaking Bad", "Game of Thrones", "Stranger Things", "The Office", "Friends", "Dark", "The Walking Dead", "Narcos", "Black Mirror", "House of the Dragon"],
    "Videojuegos": ["Minecraft", "Fortnite", "The Legend of Zelda", "GTA V", "Call of Duty", "League of Legends", "Pokémon", "Elden Ring", "God of War", "Among Us"],
    "Personajes Ficticios": ["Harry Potter", "Darth Vader", "Spider-Man", "Batman", "Goku", "Homer Simpson", "Iron Man", "Sherlock Holmes", "Joker", "Link"],
    "Marcas": ["Apple", "Samsung", "Nike", "Adidas", "Coca-Cola", "Pepsi", "Amazon", "Google", "Microsoft", "Tesla"]
};

const AVATARS = [
    { id: 'avatar-01', image: 'assets/avatars/avatar-01.png' },
    { id: 'avatar-02', image: 'assets/avatars/avatar-02.png' },
    { id: 'avatar-03', image: 'assets/avatars/avatar-03.png' },
    { id: 'avatar-04', image: 'assets/avatars/avatar-04.png' },
    { id: 'avatar-11', image: 'assets/avatars/avatar-11.png' },
    { id: 'avatar-12', image: 'assets/avatars/avatar-12.png' },
    { id: 'avatar-13', image: 'assets/avatars/avatar-13.png' },
    { id: 'avatar-14', image: 'assets/avatars/avatar-14.png' }
];

const FRAMES = [
    { id: 'fr-none', color: 'transparent', name: 'Sin Marco', locked: false },
    { id: 'fr-silver', color: '#a8b5c4', name: 'Plata', locked: false },
    { id: 'fr-gold', color: '#f4c542', name: 'Oro', locked: false },
    { id: 'fr-bronze', color: '#cd7f32', name: 'Bronce', locked: false },
    { id: 'fr-ruby', color: '#e63946', name: 'Rubí', locked: false },
    { id: 'fr-emerald', color: '#2ecc71', name: 'Esmeralda', locked: false },
    { id: 'fr-sapphire', color: '#3498db', name: 'Zafiro', locked: false },
    { id: 'fr-amethyst', color: '#9b59b6', name: 'Amatista', locked: false },
    { id: 'fr-obsidian', color: '#2c3e50', name: 'Obsidiana', locked: false },
    { id: 'fr-flame', color: '#ff6b35', name: 'Llama', locked: false }
];

const RESULT_DISPLAY_TIME = 5000;
const ROUND_START_DISPLAY_TIME = 3500;
const VOTE_DURATION = 30000;
const TIE_BUTTON_DELAY = 2500;

let G = {
    pubnub: null,
    channel: null,
    myId: null,
    playerName: '',
    avatar: 'avatar-01',
    frame: 'fr-none',
    isHost: false,
    hostId: null,
    maxPlayers: 10,
    roundTime: 60,
    selectedCategories: Object.keys(DB),
    players: {},
    activePlayers: [],
    eliminated: [],
    impostors: [],
    charlatans: [],
    citizens: [],
    myRole: null,
    fullRoles: {},
    trueRoles: {},
    scores: {},
    usedWords: [],
    currentCategory: null,
    currentSecretWord: null,
    currentFakeWord: null,
    starterPlayerId: null,
    gamePhase: 'home',
    isSpectator: false,
    votes: {},
    votedPlayers: new Set(),
    voteTargets: {},
    timerInterval: null,
    voteTimerInterval: null,
    refreshInterval: null,
    voteTimeout: null,
    spectatorTimerInterval: null,
    soundEnabled: true,
    screenStack: [],
    roleRevealed: false,
    isFirstRound: true,
    roundStarting: false,
    roundInProgress: false,
    reconnecting: false,
    playerJoinOrder: [],
    voteEndTime: null,
    myVoteCalculation: null,
    receivedCalculations: {},
    consensusReached: false,
    hasVotedThisRound: false
};

// ============================================
// PERSISTENCIA
// ============================================

function saveGameState() {
    if (!G.channel) return;
    try {
        const state = {
            channel: G.channel, myId: G.myId, playerName: G.playerName, avatar: G.avatar, frame: G.frame,
            isHost: G.isHost, hostId: G.hostId, maxPlayers: G.maxPlayers, roundTime: G.roundTime,
            players: G.players, activePlayers: G.activePlayers, eliminated: G.eliminated,
            impostors: G.impostors, charlatans: G.charlatans, citizens: G.citizens,
            myRole: G.myRole, fullRoles: G.fullRoles, trueRoles: G.trueRoles, scores: G.scores,
            usedWords: G.usedWords, gamePhase: G.gamePhase, isSpectator: G.isSpectator,
            roleRevealed: G.roleRevealed, isFirstRound: G.isFirstRound, playerJoinOrder: G.playerJoinOrder,
            voteEndTime: G.voteEndTime, hasVotedThisRound: G.hasVotedThisRound,
            votedPlayers: Array.from(G.votedPlayers),
            voteTargets: G.voteTargets, votes: G.votes, timestamp: Date.now()
        };
        sessionStorage.setItem('infiltra_game_state', JSON.stringify(state));
    } catch (e) { console.error('Error guardando estado:', e); }
}

function loadGameState() {
    try {
        const saved = sessionStorage.getItem('infiltra_game_state');
        if (!saved) return null;
        const state = JSON.parse(saved);
        if (Date.now() - state.timestamp > 3600000) { sessionStorage.removeItem('infiltra_game_state'); return null; }
        return state;
    } catch (e) { return null; }
}

function clearGameState() { sessionStorage.removeItem('infiltra_game_state'); }

function restoreGameState(state) {
    if (!state) return false;
    Object.keys(state).forEach(key => {
        if (G.hasOwnProperty(key) && key !== 'timestamp' && key !== 'votedPlayers') G[key] = state[key];
    });
    G.votedPlayers = state.votedPlayers && Array.isArray(state.votedPlayers) ? new Set(state.votedPlayers) : new Set();
    return true;
}

// ============================================
// PROTECCIÓN Y RECONEXIÓN
// ============================================

function setupRefreshProtection() {
    let lastTouchY = 0, touchStartTime = 0;
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length !== 1) return;
        lastTouchY = e.touches[0].clientY;
        touchStartTime = Date.now();
    }, { passive: true });
    
    document.addEventListener('touchmove', function(e) {
        if (G.gamePhase === 'home' || window.scrollY !== 0) return;
        const deltaY = e.touches[0].clientY - lastTouchY;
        if (deltaY > 30 && Date.now() - touchStartTime > 100) e.preventDefault();
    }, { passive: false });
    
    document.addEventListener('keydown', function(e) {
        if (G.gamePhase !== 'home' && G.gamePhase !== 'lobby' && (e.key === 'F5' || (e.ctrlKey && e.key === 'r'))) {
            e.preventDefault();
            toast('Actualizar deshabilitado durante el juego', 'warning');
        }
    });
    
    window.addEventListener('beforeunload', function(e) {
        if (G.gamePhase !== 'home' && G.channel) { e.preventDefault(); e.returnValue = '¿Seguro?'; return e.returnValue; }
    });
    
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible' && G.channel && G.pubnub) {
            handleReconnection();
            if (G.gamePhase === 'voting' && G.voteEndTime) updateVoteTimerFromTimestamp();
        }
    });
    
    window.addEventListener('online', function() { if (G.channel) handleReconnection(); });
    
    const style = document.createElement('style');
    style.textContent = 'html,body{overscroll-behavior-y:contain}.player-item.long-press-active{background:rgba(255,255,255,0.1);transform:scale(0.98)}.host-transfer-menu{position:fixed;bottom:0;left:0;right:0;background:#1a1a2e;border-top:2px solid #4a4a6a;padding:20px;z-index:1000;animation:slideUp .3s ease}@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}.host-transfer-menu h3{margin:0 0 15px;color:#fff;text-align:center}.host-transfer-btn{width:100%;padding:12px;margin:5px 0;background:#2d2d4a;border:none;border-radius:8px;color:#fff;font-size:16px;cursor:pointer}.host-transfer-btn:hover{background:#3d3d5a}.host-transfer-btn.cancel{background:#4a2d2d}.counting-votes-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;z-index:999}.counting-votes-message{text-align:center;color:#fff}.counting-votes-message h2{font-size:28px}';
    document.head.appendChild(style);
}

function handleReconnection() {
    if (G.reconnecting) return;
    G.reconnecting = true;
    toast('Reconectando...', 'info');
    if (!G.pubnub || !G.channel) {
        const savedState = loadGameState();
        if (savedState && savedState.channel) { restoreGameState(savedState); initPubNub(true); }
    } else { requestSync(); }
    setTimeout(function() { G.reconnecting = false; }, 3000);
}

// ============================================
// TRANSFERENCIA DE HOST
// ============================================

function setupLongPressForHost(element, playerId) {
    if (!G.isHost || playerId === G.myId) return;
    let pressTimer = null;
    const startPress = function() {
        element.classList.add('long-press-active');
        pressTimer = setTimeout(function() { element.classList.remove('long-press-active'); showHostTransferMenu(playerId); }, 800);
    };
    const endPress = function() { element.classList.remove('long-press-active'); if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; } };
    element.addEventListener('mousedown', startPress);
    element.addEventListener('mouseup', endPress);
    element.addEventListener('mouseleave', endPress);
    element.addEventListener('touchstart', startPress, { passive: true });
    element.addEventListener('touchend', endPress);
    element.addEventListener('touchcancel', endPress);
    element.addEventListener('touchmove', endPress);
}

function showHostTransferMenu(playerId) {
    const existing = document.getElementById('host-transfer-menu');
    if (existing) existing.remove();
    const playerName = G.players[playerId]?.name || 'Jugador';
    const menu = document.createElement('div');
    menu.id = 'host-transfer-menu';
    menu.className = 'host-transfer-menu';
    menu.innerHTML = '<h3>¿Transferir host a ' + playerName + '?</h3><button class="host-transfer-btn" onclick="confirmHostTransfer(\'' + playerId + '\')">Sí, hacer host</button><button class="host-transfer-btn cancel" onclick="closeHostTransferMenu()">Cancelar</button>';
    document.body.appendChild(menu);
}

function closeHostTransferMenu() { const menu = document.getElementById('host-transfer-menu'); if (menu) menu.remove(); }

function confirmHostTransfer(newHostId) {
    closeHostTransferMenu();
    if (!G.isHost || !G.pubnub) return;
    G.hostId = newHostId;
    G.isHost = (G.myId === newHostId);
    G.pubnub.publish({ channel: G.channel, message: { type: 'host_transfer', newHostId: newHostId, oldHostId: G.myId } });
    toast('Host transferido a ' + (G.players[newHostId]?.name || 'Jugador'), 'success');
    updateHostUI();
    renderPlayerList();
    saveGameState();
}
window.confirmHostTransfer = confirmHostTransfer;
window.closeHostTransferMenu = closeHostTransferMenu;

function handleHostTransfer(msg) {
    const wasIHost = G.isHost;
    G.hostId = msg.newHostId;
    G.isHost = (G.myId === msg.newHostId);
    if (G.isHost && !wasIHost) toast('¡Ahora eres el host!', 'success');
    else if (!G.isHost && wasIHost) toast('Ya no eres el host', 'info');
    updateHostUI();
    renderPlayerList();
    saveGameState();
}

function autoTransferHost() {
    if (G.playerJoinOrder.length === 0) return null;
    for (const playerId of G.playerJoinOrder) {
        if (G.players[playerId] && playerId !== G.hostId) return playerId;
    }
    return null;
}

function handleHostDisconnect(msg) {
    const newHost = autoTransferHost();
    if (newHost && G.myId === newHost) {
        G.hostId = G.myId;
        G.isHost = true;
        toast('¡Ahora eres el host!', 'success');
        G.pubnub.publish({ channel: G.channel, message: { type: 'host_transfer', newHostId: G.myId, oldHostId: msg.oldHostId, auto: true } });
        updateHostUI();
        renderPlayerList();
        saveGameState();
    } else if (!newHost) {
        toast('Host desconectado', 'error');
        setTimeout(exitGame, 2000);
    }
}

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', init);

function init() {
    G.myId = sessionStorage.getItem('infiltra_myId');
    if (!G.myId) {
        G.myId = 'P-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
        sessionStorage.setItem('infiltra_myId', G.myId);
    }
    setupRefreshProtection();
    const savedState = loadGameState();
    if (savedState && savedState.channel && savedState.gamePhase !== 'home') {
        if (confirm('Se detectó una partida en progreso. ¿Deseas reconectarte?')) {
            restoreGameState(savedState);
            initPubNub(true);
            return;
        } else { clearGameState(); }
    }
    loadProfile();
    initAvatars();
    initFrames();
    initCategories();
    initParticles();
    bindEvents();
    checkURLParams();
    updateProfilePreview();
    createPlayersSidebar();
    createSpectatorControls();
    console.log('INFILTRA v1.1.0 (Robust Edition) iniciado');
}

function loadProfile() {
    const name = localStorage.getItem('infiltra_name');
    const avatar = localStorage.getItem('infiltra_avatar');
    const frame = localStorage.getItem('infiltra_frame');
    if (name) { document.getElementById('input-name').value = name; G.playerName = name; }
    G.avatar = (avatar && AVATARS.find(a => a.id === avatar)) ? avatar : AVATARS[0].id;
    G.frame = (frame && FRAMES.find(f => f.id === frame)) ? frame : FRAMES[0].id;
    updateProfilePreview();
    saveProfile();
}

function saveProfile() {
    localStorage.setItem('infiltra_name', G.playerName);
    localStorage.setItem('infiltra_avatar', G.avatar);
    localStorage.setItem('infiltra_frame', G.frame);
}

function updateProfilePreview() {
    const previewAvatar = document.getElementById('preview-avatar');
    const previewWrapper = document.getElementById('preview-avatar-wrapper');
    const previewName = document.getElementById('preview-name');
    if (!previewAvatar || !previewWrapper) return;
    const avatar = AVATARS.find(a => a.id === G.avatar) || AVATARS[0];
    const frame = FRAMES.find(f => f.id === G.frame);
    previewAvatar.innerHTML = '<img src="' + avatar.image + '" alt="avatar" class="hex-avatar-img">';
    if (frame && frame.color !== 'transparent') {
        previewWrapper.className = 'preview-avatar-wrapper hex-frame';
        previewWrapper.style.setProperty('--frame-color', frame.color);
    } else {
        previewWrapper.className = 'preview-avatar-wrapper hex-frame no-frame';
        previewWrapper.style.setProperty('--frame-color', 'transparent');
    }
    if (previewName) previewName.textContent = document.getElementById('input-name')?.value || 'Tu Nombre';
}

function initAvatars() {
    const grid = document.getElementById('avatar-grid');
    if (!grid) return;
    grid.innerHTML = '';
    if (!G.avatar || !AVATARS.find(a => a.id === G.avatar)) G.avatar = AVATARS[0].id;
    AVATARS.forEach(avatar => {
        const div = document.createElement('div');
        div.className = 'avatar-option hex-avatar-option' + (avatar.id === G.avatar ? ' selected' : '');
        div.innerHTML = '<img src="' + avatar.image + '" alt="' + avatar.id + '" class="hex-avatar-img"><div class="avatar-check">✓</div>';
        div.onclick = function() {
            G.avatar = avatar.id;
            grid.querySelectorAll('.avatar-option').forEach(el => el.classList.remove('selected'));
            div.classList.add('selected');
            updateProfilePreview();
            saveProfile();
        };
        grid.appendChild(div);
    });
}

function initFrames() {
    const grid = document.getElementById('frame-grid');
    if (!grid) return;
    grid.innerHTML = '';
    if (!G.frame || !FRAMES.find(f => f.id === G.frame)) G.frame = FRAMES[0].id;
    FRAMES.forEach(frame => {
        const div = document.createElement('div');
        div.className = 'frame-option-new hex-frame-option' + (frame.id === G.frame ? ' selected' : '') + (frame.locked ? ' locked' : '');
        const preview = document.createElement('div');
        preview.className = 'frame-preview hex-frame-preview';
        if (frame.color !== 'transparent') {
            preview.style.setProperty('--frame-color', frame.color);
            preview.innerHTML = '<div class="hex-frame-inner"><img src="' + ICONS.citizen + '" alt="" class="frame-preview-img"></div>';
        } else {
            preview.classList.add('no-frame');
            preview.innerHTML = '<div class="hex-frame-inner"><img src="' + ICONS.citizen + '" alt="" class="frame-preview-img"></div>';
        }
        div.appendChild(preview);
        const check = document.createElement('div');
        check.className = 'frame-check';
        check.textContent = '✓';
        div.appendChild(check);
        if (!frame.locked) {
            div.onclick = function() {
                G.frame = frame.id;
                grid.querySelectorAll('.frame-option-new').forEach(el => el.classList.remove('selected'));
                div.classList.add('selected');
                updateProfilePreview();
                saveProfile();
            };
        }
        grid.appendChild(div);
    });
}

function initCategories() {
    const list = document.getElementById('categories-list');
    if (!list) return;
    list.innerHTML = Object.keys(DB).map(cat => '<div class="category-item"><input type="checkbox" id="cat-' + cat + '" value="' + cat + '" checked><label for="cat-' + cat + '">' + cat + '</label></div>').join('');
}

function validateRoleConfiguration() {
    const maxPlayers = parseInt(document.getElementById('config-max-players')?.value) || 10;
    const impostors = parseInt(document.getElementById('config-impostors')?.value) || 1;
    const charlatans = parseInt(document.getElementById('config-charlatans')?.value) || 0;
    const specialRoles = impostors + charlatans;
    const citizens = maxPlayers - specialRoles;
    const summaryImpostors = document.getElementById('summary-impostors');
    const summaryCharlatans = document.getElementById('summary-charlatans');
    const summaryCitizens = document.getElementById('summary-citizens');
    const summaryTotal = document.getElementById('summary-total');
    const errorElement = document.getElementById('summary-error');
    const createButton = document.getElementById('btn-create-room');
    if (summaryImpostors) summaryImpostors.textContent = impostors;
    if (summaryCharlatans) summaryCharlatans.textContent = charlatans;
    if (summaryCitizens) summaryCitizens.textContent = Math.max(0, citizens);
    if (summaryTotal) summaryTotal.textContent = maxPlayers;
    if (specialRoles >= maxPlayers) {
        if (errorElement) { errorElement.textContent = '❌ Debe haber al menos 1 ciudadano'; errorElement.style.display = 'block'; errorElement.style.color = '#ff4757'; }
        if (createButton) { createButton.disabled = true; createButton.style.opacity = '0.5'; }
        return false;
    }
    if (citizens === 1) {
        if (errorElement) { errorElement.textContent = '⚠️ Se recomienda al menos 2 ciudadanos'; errorElement.style.display = 'block'; errorElement.style.color = '#ffa502'; }
    } else { if (errorElement) errorElement.style.display = 'none'; }
    if (createButton) { createButton.disabled = false; createButton.style.opacity = '1'; }
    return true;
}

function updateSelectedCategories() {
    G.selectedCategories = Array.from(document.querySelectorAll('.category-item input:checked')).map(cb => cb.value);
}

function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    for (let i = 0; i < 40; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(p);
    }
}

function createPlayersSidebar() {
    if (document.getElementById('players-sidebar')) return;
    const sidebar = document.createElement('div');
    sidebar.id = 'players-sidebar';
    sidebar.className = 'players-sidebar';
    sidebar.innerHTML = '<div class="players-sidebar-title">Jugadores</div><div class="players-sidebar-list" id="sidebar-players-list"></div>';
    document.body.appendChild(sidebar);
}

function createSpectatorControls() {
    const spectatorScreen = document.getElementById('screen-spectator');
    if (!spectatorScreen || document.getElementById('btn-spectator-skip')) return;
    const skipBtn = document.createElement('button');
    skipBtn.id = 'btn-spectator-skip';
    skipBtn.className = 'btn btn-secondary';
    skipBtn.textContent = 'Cambiar Palabra';
    skipBtn.style.display = 'none';
    skipBtn.onclick = skipWord;
    const controls = spectatorScreen.querySelector('.spectator-controls');
    if (controls) {
        const nextBtn = document.getElementById('btn-spectator-next');
        if (nextBtn) controls.insertBefore(skipBtn, nextBtn);
        else controls.appendChild(skipBtn);
    }
}

function updateRolePlayersList() {
    const list = document.getElementById('role-players-list');
    if (!list) return;
    const allPlayerIds = G.activePlayers.length > 0 ? G.activePlayers : Object.keys(G.players);
    list.innerHTML = allPlayerIds.map(id => {
        const p = G.players[id];
        const isEliminated = G.eliminated.includes(id);
        const isMe = id === G.myId;
        return '<div class="role-player-item' + (isEliminated ? ' eliminated' : '') + (isMe ? ' is-me' : '') + '"><div class="role-player-avatar">' + renderHexAvatar(id, 32) + '</div><span class="role-player-name">' + (p?.name || id.substring(0, 8)) + (isMe ? ' (Tú)' : '') + '</span></div>';
    }).join('');
}

function updatePlayersSidebar() {
    const list = document.getElementById('sidebar-players-list');
    if (!list) return;
    list.innerHTML = Object.keys(G.players).map(id => {
        const p = G.players[id];
        const isEliminated = G.eliminated.includes(id);
        const isHost = id === G.hostId;
        return '<div class="sidebar-player' + (isEliminated ? ' eliminated' : '') + '"><div class="sidebar-player-avatar">' + renderHexAvatar(id, 28) + '</div><span class="sidebar-player-name">' + (p?.name || id.substring(0, 8)) + (isHost ? ' ⭐' : '') + '</span></div>';
    }).join('');
}

function showPlayersSidebar() {
    const sidebar = document.getElementById('players-sidebar');
    if (sidebar && window.innerWidth > 768) { updatePlayersSidebar(); sidebar.classList.add('visible'); }
}

function hidePlayersSidebar() {
    const sidebar = document.getElementById('players-sidebar');
    if (sidebar) sidebar.classList.remove('visible');
}

// ============================================
// EVENTOS
// ============================================

function bindEvents() {
    const bind = (id, fn) => { const el = document.getElementById(id); if (el) el.onclick = fn; };
    bind('btn-show-config', showConfig);
    bind('btn-back-home', function() { showScreen('screen-home'); });
    bind('btn-join-room', joinRoom);
    bind('btn-create-room', createRoom);
    bind('btn-leave-room', leaveRoom);
    bind('btn-distribute', distributeRoles);
    bind('btn-start-round', startRound);
    bind('btn-skip-word', skipWord);
    bind('btn-next-round', nextRound);
    bind('btn-back-lobby', backToLobby);
    bind('btn-back-to-lobby', backToLobby);
    bind('btn-exit-game', exitGame);
    bind('btn-spectator-next', spectatorNextAction);
    bind('btn-spectator-lobby', backToLobby);
    bind('btn-spectator-skip', skipWord);
    bind('role-card', revealRole);
    bind('btn-leave-role', leaveRoom);
    bind('btn-leave-voting', leaveRoom);
    bind('btn-leave-results', leaveRoom);
    bind('btn-leave-spectator', leaveRoom);
    bind('btn-cat-all', function() { document.querySelectorAll('.category-item input').forEach(cb => cb.checked = true); updateSelectedCategories(); });
    bind('btn-cat-none', function() { document.querySelectorAll('.category-item input').forEach(cb => cb.checked = false); updateSelectedCategories(); });
    bind('btn-sound', function() {
        G.soundEnabled = !G.soundEnabled;
        const btn = document.getElementById('btn-sound');
        if (btn) { btn.querySelector('img').src = G.soundEnabled ? ICONS.soundOn : ICONS.soundOff; btn.classList.toggle('muted', !G.soundEnabled); }
    });
    bind('btn-help', function() {
        const current = document.querySelector('.screen.active')?.id || 'screen-home';
        if (current !== 'screen-help') G.screenStack.push(current);
        showScreen('screen-help');
    });
    bind('btn-help-back', function() { showScreen(G.screenStack.pop() || 'screen-home'); });

    const maxPlayersInput = document.getElementById('config-max-players');
    const impostorsInput = document.getElementById('config-impostors');
    const charlatansInput = document.getElementById('config-charlatans');
    if (maxPlayersInput) maxPlayersInput.addEventListener('input', function() {
        const maxPlayers = parseInt(this.value) || 3;
        if (impostorsInput) impostorsInput.max = maxPlayers - 1;
        if (charlatansInput) charlatansInput.max = maxPlayers - 1;
        validateRoleConfiguration();
    });
    if (impostorsInput) impostorsInput.addEventListener('input', function() {
        const maxPlayers = parseInt(maxPlayersInput?.value) || 10;
        const impostors = parseInt(this.value) || 1;
        if (charlatansInput) charlatansInput.max = Math.max(0, maxPlayers - impostors - 1);
        validateRoleConfiguration();
    });
    if (charlatansInput) charlatansInput.addEventListener('input', validateRoleConfiguration);
    const nameInput = document.getElementById('input-name');
    if (nameInput) nameInput.addEventListener('input', updateProfilePreview);
}

function checkURLParams() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code') || params.get('room');
    if (code) { const input = document.getElementById('input-join-code'); if (input) { input.value = code.toUpperCase(); toast('Código detectado'); } }
}

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(id);
    if (screen) screen.classList.add('active');
    if (id === 'screen-voting') showPlayersSidebar();
    else hidePlayersSidebar();
    saveGameState();
}

function showConfig() {
    G.playerName = document.getElementById('input-name')?.value.trim() || '';
    if (!G.playerName) { toast('Ingresa tu nombre', 'error'); return; }
    saveProfile();
    showScreen('screen-config');
    setTimeout(validateRoleConfiguration, 100);
}

function createRoom() {
    updateSelectedCategories();
    if (G.selectedCategories.length === 0) { toast('Selecciona categorías', 'error'); return; }
    G.isHost = true;
    G.hostId = G.myId;
    G.maxPlayers = Math.min(parseInt(document.getElementById('config-max-players')?.value) || 10, 10);
    G.roundTime = parseInt(document.getElementById('config-time')?.value) || 60;
    G.channel = generateCode();
    G.scores = {};
    G.usedWords = [];
    G.isFirstRound = true;
    G.gamePhase = 'lobby';
    G.playerJoinOrder = [G.myId];
    initPubNub(false);
}

function joinRoom() {
    G.playerName = document.getElementById('input-name')?.value.trim() || '';
    if (!G.playerName) { toast('Ingresa tu nombre', 'error'); return; }
    const code = (document.getElementById('input-join-code')?.value || '').toUpperCase().trim();
    if (code.length !== 4) { toast('Código de 4 letras', 'error'); return; }
    saveProfile();
    G.isHost = false;
    G.channel = code;
    G.gamePhase = 'lobby';
    initPubNub(false);
}

function generateCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 4; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    return code;
}

// ============================================
// PUBNUB
// ============================================

function initPubNub(isReconnection) {
    clearAllTimers();
    if (G.pubnub) { G.pubnub.unsubscribeAll(); G.pubnub = null; }
    G.pubnub = new PubNub({ publishKey: 'demo', subscribeKey: 'demo', userId: G.myId, restore: true, keepAlive: true });
    G.pubnub.addListener({ status: function(s) { onStatus(s, isReconnection); }, message: onMessage, presence: onPresence });
    G.pubnub.subscribe({ channels: [G.channel], withPresence: true });
}

function onStatus(status, isReconnection) {
    if (status.category === 'PNConnectedCategory') {
        setPlayerState();
        if (isReconnection) { toast('Reconectado', 'success'); restoreScreenForPhase(); }
        else { document.getElementById('display-room-code').textContent = G.channel; showScreen('screen-lobby'); generateQR(); }
        if (G.isHost) { document.getElementById('btn-distribute').style.display = 'block'; setTimeout(publishConfig, 300); }
        else { setTimeout(requestSync, 500); }
        setTimeout(refreshPlayers, 500);
        G.refreshInterval = setInterval(refreshPlayers, 3000);
        saveGameState();
    } else if (status.category === 'PNNetworkDownCategory') { toast('Conexión perdida...', 'warning'); }
    else if (status.category === 'PNNetworkUpCategory') { toast('Conexión restaurada', 'info'); handleReconnection(); }
    else if (status.error) { toast('Error de conexión', 'error'); }
}

function restoreScreenForPhase() {
    switch (G.gamePhase) {
        case 'lobby': showScreen('screen-lobby'); document.getElementById('display-room-code').textContent = G.channel; generateQR(); break;
        case 'roles': case 'round': if (G.isSpectator) { showScreen('screen-spectator'); updateSpectatorRoles(); } else { showScreen('screen-role'); restoreRoleScreen(); } break;
        case 'voting': if (G.isSpectator) showScreen('screen-spectator'); else { showScreen('screen-voting'); renderVotingList(); if (G.voteEndTime) updateVoteTimerFromTimestamp(); } break;
        case 'results': showScreen('screen-results'); break;
        case 'gameover': showScreen('screen-gameover'); break;
        default: showScreen('screen-lobby');
    }
    updateHostUI();
}

function restoreRoleScreen() {
    if (!G.myRole) return;
    const card = document.getElementById('role-card');
    if (G.roleRevealed) {
        const roleClass = G.myRole.role === 'INFILTRADO' ? 'impostor' : G.myRole.role === 'CHARLATÁN' ? 'charlatan' : 'citizen';
        if (card) card.className = 'role-card ' + roleClass;
        document.getElementById('role-icon').innerHTML = '<img src="' + G.myRole.icon + '" alt="" class="role-icon-img">';
        document.getElementById('role-title').textContent = G.myRole.role;
        document.getElementById('role-word').textContent = G.myRole.word;
        document.getElementById('role-instruction').textContent = 'Tu rol (ya revelado)';
    } else {
        if (card) card.className = 'role-card blurred';
        document.getElementById('role-icon').innerHTML = '<img src="' + ICONS.help + '" alt="?" class="role-icon-img">';
        document.getElementById('role-title').textContent = 'SECRETO';
        document.getElementById('role-word').textContent = '???';
        document.getElementById('role-instruction').textContent = 'Toca la carta para revelar';
    }
    updateRolePlayersList();
}

function onMessage(event) {
    const msg = event.message;
    const sender = event.publisher;
    switch (msg.type) {
        case 'config': handleConfig(msg); break;
        case 'player_state': handlePlayerState(sender, msg); break;
        case 'room_full': if (msg.targetId === G.myId) { toast('Sala llena', 'error'); setTimeout(exitGame, 1500); } break;
        case 'assign': handleAssign(msg); break;
        case 'start_round': handleStartRound(msg); break;
        case 'vote': handleVote(sender, msg.target); break;
        case 'vote_update': handleVoteUpdate(msg); break;
        case 'vote_calculation': handleVoteCalculation(sender, msg); break;
        case 'consensus_result': handleConsensusResult(msg); break;
        case 'results': showResults(msg); break;
        case 'next_round': handleNextRound(msg); break;
        case 'back_to_lobby': handleBackToLobby(msg); break;
        case 'game_over': handleGameOver(msg); break;
        case 'spectator_roles': if (G.isSpectator) { G.fullRoles = msg.roles; G.activePlayers = msg.activePlayers || G.activePlayers; updateSpectatorRoles(); } break;
        case 'host_transfer': handleHostTransfer(msg); break;
        case 'host_disconnect': handleHostDisconnect(msg); break;
        case 'kick_player': handleKickPlayer(msg); break;
        case 'skip_word': handleSkipWord(msg); break;
        case 'request_sync': if (G.isHost) publishFullSync(); break;
        case 'full_sync': handleFullSync(msg); break;
        case 'player_joined': handlePlayerJoined(msg); break;
    }
}

function handleConfig(msg) {
    G.maxPlayers = Math.min(msg.maxPlayers, 10);
    G.roundTime = msg.roundTime;
    G.hostId = msg.hostId;
    G.isHost = (G.myId === G.hostId);
    if (msg.usedWords) G.usedWords = msg.usedWords;
    if (msg.scores) G.scores = msg.scores;
    if (msg.playerJoinOrder) G.playerJoinOrder = msg.playerJoinOrder;
    renderPlayerList();
    saveGameState();
}

function handlePlayerState(sender, msg) {
    const currentCount = Object.keys(G.players).length;
    const isNewPlayer = !G.players[sender];
    if (isNewPlayer && currentCount >= G.maxPlayers && sender !== G.myId) {
        if (G.isHost) G.pubnub.publish({ channel: G.channel, message: { type: 'room_full', targetId: sender } });
        return;
    }
    G.players[sender] = { name: msg.name, avatar: msg.avatar, frame: msg.frame };
    if (G.scores[sender] === undefined) G.scores[sender] = 0;
    if (isNewPlayer && !G.playerJoinOrder.includes(sender)) {
        G.playerJoinOrder.push(sender);
        if (G.isHost) G.pubnub.publish({ channel: G.channel, message: { type: 'player_joined', playerId: sender, joinOrder: G.playerJoinOrder } });
    }
    renderPlayerList();
    saveGameState();
}

function handlePlayerJoined(msg) { if (msg.joinOrder) G.playerJoinOrder = msg.joinOrder; }

function handleKickPlayer(msg) {
    if (msg.targetId === G.myId) { toast('Fuiste expulsado', 'error'); setTimeout(exitGame, 1500); }
    else {
        delete G.players[msg.targetId];
        delete G.scores[msg.targetId];
        G.playerJoinOrder = G.playerJoinOrder.filter(id => id !== msg.targetId);
        G.activePlayers = G.activePlayers.filter(id => id !== msg.targetId);
        renderPlayerList();
        saveGameState();
    }
}

function onPresence(event) {
    if (event.action === 'join' && G.isHost && event.uuid !== G.myId) setTimeout(publishConfig, 500);
    if (event.action === 'leave' || event.action === 'timeout') {
        const leftPlayerId = event.uuid;
        if (leftPlayerId === G.hostId && leftPlayerId !== G.myId) {
            const newHost = autoTransferHost();
            if (newHost && G.myId === newHost) {
                G.hostId = G.myId; G.isHost = true;
                toast('El host se fue. ¡Ahora eres el host!', 'info');
                G.pubnub.publish({ channel: G.channel, message: { type: 'host_transfer', newHostId: G.myId, oldHostId: leftPlayerId, auto: true } });
                updateHostUI();
            }
        }
        if (G.gamePhase === 'lobby' || G.gamePhase === 'home') {
            delete G.players[leftPlayerId];
            G.playerJoinOrder = G.playerJoinOrder.filter(id => id !== leftPlayerId);
        } else {
            G.activePlayers = G.activePlayers.filter(id => id !== leftPlayerId);
            if (!G.eliminated.includes(leftPlayerId)) G.eliminated.push(leftPlayerId);
        }
        renderPlayerList();
        updatePlayersSidebar();
        saveGameState();
    }
    setTimeout(refreshPlayers, 500);
}

function setPlayerState() {
    if (!G.pubnub) return;
    G.pubnub.setState({ state: { name: G.playerName, avatar: G.avatar, frame: G.frame }, channels: [G.channel] });
    G.pubnub.publish({ channel: G.channel, message: { type: 'player_state', name: G.playerName, avatar: G.avatar, frame: G.frame } });
}

function publishConfig() {
    if (!G.pubnub || !G.isHost) return;
    G.pubnub.publish({ channel: G.channel, message: { type: 'config', maxPlayers: G.maxPlayers, roundTime: G.roundTime, hostId: G.hostId, usedWords: G.usedWords, scores: G.scores, playerJoinOrder: G.playerJoinOrder } });
}

function requestSync() { if (!G.pubnub || G.isHost) return; G.pubnub.publish({ channel: G.channel, message: { type: 'request_sync' } }); }

function publishFullSync() {
    if (!G.pubnub || !G.isHost) return;
    G.pubnub.publish({ channel: G.channel, message: {
        type: 'full_sync', maxPlayers: G.maxPlayers, roundTime: G.roundTime, hostId: G.hostId,
        usedWords: G.usedWords, scores: G.scores, gamePhase: G.gamePhase, activePlayers: G.activePlayers,
        eliminated: G.eliminated, fullRoles: G.fullRoles, impostors: G.impostors, charlatans: G.charlatans,
        citizens: G.citizens, playerJoinOrder: G.playerJoinOrder, voteEndTime: G.voteEndTime,
        votes: G.votes, votedPlayers: Array.from(G.votedPlayers)
    }});
}

function handleFullSync(msg) {
    if (G.isHost) return;
    G.maxPlayers = Math.min(msg.maxPlayers || 10, 10);
    G.roundTime = msg.roundTime || 60;
    G.hostId = msg.hostId;
    G.isHost = (G.myId === G.hostId);
    G.usedWords = msg.usedWords || [];
    G.scores = msg.scores || {};
    G.playerJoinOrder = msg.playerJoinOrder || [];
    if (msg.gamePhase && msg.gamePhase !== 'lobby') {
        G.gamePhase = msg.gamePhase;
        G.activePlayers = msg.activePlayers || [];
        G.eliminated = msg.eliminated || [];
        G.fullRoles = msg.fullRoles || {};
        G.impostors = msg.impostors || [];
        G.charlatans = msg.charlatans || [];
        G.citizens = msg.citizens || [];
        G.voteEndTime = msg.voteEndTime || null;
        G.votes = msg.votes || {};
        G.votedPlayers = new Set(msg.votedPlayers || []);
        if (G.eliminated.includes(G.myId)) G.isSpectator = true;
        if (G.fullRoles[G.myId]) G.myRole = G.fullRoles[G.myId];
        G.hasVotedThisRound = G.votedPlayers.has(G.myId);
    }
    renderPlayerList();
    saveGameState();
}

function generateQR() {
    const container = document.getElementById('qr-container');
    if (!container || typeof qrcode === 'undefined') return;
    const qr = qrcode(0, 'M');
    qr.addData('https://crissarroyo.github.io/infiltra/game.html?code=' + G.channel);
    qr.make();
    container.innerHTML = qr.createImgTag(4) + '<div class="qr-instructions"><strong>Comparte el código</strong> para que tus amigos se unan</div>';
}

function refreshPlayers() {
    if (!G.pubnub) return;
    G.pubnub.hereNow({ channels: [G.channel], includeState: true }, function(status, response) {
        if (response && response.channels && response.channels[G.channel]) {
            const occupants = response.channels[G.channel].occupants;
            const currentIds = occupants.map(o => o.uuid);
            Object.keys(G.players).forEach(id => {
                if (!currentIds.includes(id)) { delete G.players[id]; G.playerJoinOrder = G.playerJoinOrder.filter(pid => pid !== id); }
            });
            occupants.forEach(o => {
                if (!G.players[o.uuid]) {
                    G.players[o.uuid] = { name: o.state?.name || o.uuid.substring(0, 8), avatar: o.state?.avatar || 'avatar-01', frame: o.state?.frame || 'fr-none' };
                    if (!G.playerJoinOrder.includes(o.uuid)) G.playerJoinOrder.push(o.uuid);
                } else if (o.state) {
                    G.players[o.uuid].name = o.state.name || G.players[o.uuid].name;
                    G.players[o.uuid].avatar = o.state.avatar || G.players[o.uuid].avatar;
                    G.players[o.uuid].frame = o.state.frame || G.players[o.uuid].frame;
                }
                if (G.scores[o.uuid] === undefined) G.scores[o.uuid] = 0;
            });
            renderPlayerList();
            saveGameState();
        }
    });
}

function renderHexAvatar(playerId, size) {
    size = size || 40;
    const p = G.players[playerId];
    const avatar = AVATARS.find(a => a.id === p?.avatar) || AVATARS[0];
    const frame = FRAMES.find(f => f.id === p?.frame);
    const hasFrame = frame && frame.color !== 'transparent';
    return '<div class="hex-avatar-container" style="width:' + size + 'px;height:' + (size * 1.15) + 'px;--frame-color:' + (hasFrame ? frame.color : 'transparent') + '"><img src="' + avatar.image + '" alt="" class="hex-avatar-img">' + (hasFrame ? '<div class="hex-avatar-frame"></div>' : '') + '</div>';
}

function renderPlayerAvatar(playerId, size) { return renderHexAvatar(playerId, size); }

function renderPlayerList() {
    const list = document.getElementById('player-list');
    const countEl = document.getElementById('player-count');
    if (!list) return;
    const playerIds = Object.keys(G.players).sort((a, b) => (G.scores[b] || 0) - (G.scores[a] || 0));
    if (countEl) countEl.textContent = playerIds.length + '/' + G.maxPlayers;
    let headerHtml = '<div class="player-list-score-header"><span>Jugador</span><span>Puntos</span></div>';
    list.innerHTML = headerHtml + playerIds.map((id, index) => {
        const p = G.players[id];
        const isMe = id === G.myId;
        const isHostPlayer = id === G.hostId;
        const score = G.scores[id] || 0;
        let rankHtml = index === 0 ? '<div class="player-rank"><img src="' + ICONS.medalGold + '" alt="1"></div>' :
                       index === 1 ? '<div class="player-rank"><img src="' + ICONS.medalSilver + '" alt="2"></div>' :
                       index === 2 ? '<div class="player-rank"><img src="' + ICONS.medalBronze + '" alt="3"></div>' :
                       '<div class="player-rank"><span class="player-rank-number">' + (index + 1) + '</span></div>';
        const kickBtn = (G.isHost && !isMe && (G.gamePhase === 'lobby' || G.gamePhase === 'home')) ?
            '<button class="btn-kick" onclick="kickPlayer(\'' + id + '\')" title="Expulsar"><img src="' + ICONS.kick + '" alt="Kick"></button>' : '';
        return '<div id="player-item-' + id + '" class="player-item" data-player-id="' + id + '">' + rankHtml +
            '<div class="player-avatar">' + renderHexAvatar(id, 40) + '</div>' +
            '<div class="player-info"><div class="player-name">' + p.name + (isMe ? ' (Tú)' : '') + '</div>' +
            (isHostPlayer ? '<div class="player-tag">Host</div>' : '') + '</div>' +
            '<div class="player-score">' + score + '</div>' + kickBtn + '</div>';
    }).join('');
    if (G.isHost) playerIds.forEach(id => { if (id !== G.myId) { const el = document.getElementById('player-item-' + id); if (el) setupLongPressForHost(el, id); } });
    const btnDistribute = document.getElementById('btn-distribute');
    if (btnDistribute) btnDistribute.style.display = G.isHost ? 'block' : 'none';
}

function kickPlayer(playerId) {
    if (!G.isHost || !G.pubnub) return;
    const playerName = G.players[playerId]?.name || 'Jugador';
    if (confirm('¿Expulsar a ' + playerName + '?')) {
        delete G.players[playerId];
        delete G.scores[playerId];
        G.playerJoinOrder = G.playerJoinOrder.filter(id => id !== playerId);
        renderPlayerList();
        G.pubnub.publish({ channel: G.channel, message: { type: 'kick_player', targetId: playerId, targetName: playerName } });
        toast(playerName + ' expulsado', 'success');
        saveGameState();
    }
}
window.kickPlayer = kickPlayer;

function updateHostUI() {
    const btnDistribute = document.getElementById('btn-distribute');
    const btnStartRound = document.getElementById('btn-start-round');
    const btnSkipWord = document.getElementById('btn-skip-word');
    const btnNextRound = document.getElementById('btn-next-round');
    const btnBackLobby = document.getElementById('btn-back-lobby');
    if (btnDistribute) btnDistribute.style.display = G.isHost && G.gamePhase === 'lobby' ? 'block' : 'none';
    if (G.gamePhase === 'roles' && !G.isSpectator) {
        if (btnStartRound) btnStartRound.style.display = G.isHost ? 'block' : 'none';
        if (btnSkipWord) btnSkipWord.style.display = G.isHost ? 'block' : 'none';
    }
    if (G.gamePhase === 'results' && !G.isSpectator) {
        if (btnNextRound) btnNextRound.style.display = G.isHost ? 'block' : 'none';
        if (btnBackLobby) btnBackLobby.style.display = G.isHost ? 'block' : 'none';
    }
    if (G.isSpectator) updateSpectatorHostControls();
    renderPlayerList();
    saveGameState();
}

function updateSpectatorHostControls() {
    const btnNext = document.getElementById('btn-spectator-next');
    const btnLobby = document.getElementById('btn-spectator-lobby');
    const btnSkip = document.getElementById('btn-spectator-skip');
    if (G.isHost && G.isSpectator) {
        if (btnNext) { btnNext.style.display = 'block'; btnNext.disabled = false; btnNext.textContent = (G.gamePhase === 'results' || G.gamePhase === 'voting') ? 'Siguiente Ronda' : 'Iniciar Ronda'; }
        if (btnLobby) btnLobby.style.display = 'block';
        if (btnSkip) btnSkip.style.display = G.gamePhase === 'roles' ? 'block' : 'none';
    } else {
        if (btnNext) btnNext.style.display = 'none';
        if (btnLobby) btnLobby.style.display = 'none';
        if (btnSkip) btnSkip.style.display = 'none';
    }
}

// ============================================
// DISTRIBUCIÓN DE ROLES
// ============================================

function selectNewWord() {
    updateSelectedCategories();
    let availableWords = [];
    G.selectedCategories.forEach(cat => { DB[cat].forEach(word => { if (!G.usedWords.includes(word)) availableWords.push({ category: cat, word: word }); }); });
    if (availableWords.length < 2) {
        G.usedWords = [];
        availableWords = [];
        G.selectedCategories.forEach(cat => { DB[cat].forEach(word => { availableWords.push({ category: cat, word: word }); }); });
        toast('Palabras reiniciadas');
    }
    const secretIdx = Math.floor(Math.random() * availableWords.length);
    const secretData = availableWords[secretIdx];
    G.currentCategory = secretData.category;
    G.currentSecretWord = secretData.word;
    G.usedWords.push(G.currentSecretWord);
    const fakeOptions = availableWords.filter(w => w.word !== G.currentSecretWord);
    G.currentFakeWord = fakeOptions.length > 0 ? fakeOptions[Math.floor(Math.random() * fakeOptions.length)].word : '???';
    if (G.currentFakeWord !== '???') G.usedWords.push(G.currentFakeWord);
    return { category: G.currentCategory, secretWord: G.currentSecretWord, fakeWord: G.currentFakeWord };
}

function distributeRoles() {
    if (!G.pubnub) return;
    const playerIds = Object.keys(G.players);
    if (playerIds.length < 3) { toast('Mínimo 3 jugadores', 'error'); return; }
    const numImp = parseInt(document.getElementById('config-impostors')?.value) || 1;
    const numChar = parseInt(document.getElementById('config-charlatans')?.value) || 0;
    if (numImp + numChar >= playerIds.length) { toast('Configuración inválida', 'error'); return; }
    updateSelectedCategories();
    if (G.selectedCategories.length === 0) { toast('Selecciona categorías', 'error'); return; }
    
    const wordData = selectNewWord();
    let roles = {};
    let pool = [...playerIds];
    G.impostors = []; G.charlatans = []; G.citizens = []; G.trueRoles = {};
    
    for (let i = 0; i < numImp && pool.length; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        const id = pool.splice(idx, 1)[0];
        roles[id] = { role: 'INFILTRADO', icon: ICONS.impostor, word: 'Categoría: ' + wordData.category };
        G.trueRoles[id] = 'INFILTRADO';
        G.impostors.push(id);
    }
    for (let i = 0; i < numChar && pool.length; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        const id = pool.splice(idx, 1)[0];
        roles[id] = { role: 'CIUDADANO', icon: ICONS.citizen, word: wordData.fakeWord };
        G.trueRoles[id] = 'CHARLATÁN';
        G.charlatans.push(id);
    }
    pool.forEach(id => {
        roles[id] = { role: 'CIUDADANO', icon: ICONS.citizen, word: wordData.secretWord };
        G.trueRoles[id] = 'CIUDADANO';
        G.citizens.push(id);
    });
    
    G.activePlayers = [...playerIds];
    G.eliminated = [];
    G.fullRoles = roles;
    G.gamePhase = 'roles';
    G.isFirstRound = true;
    G.starterPlayerId = G.activePlayers[Math.floor(Math.random() * G.activePlayers.length)];
    G.pubnub.publish({ channel: G.channel, message: {
        type: 'assign', roles: roles, activePlayers: G.activePlayers, impostors: G.impostors,
        charlatans: G.charlatans, citizens: G.citizens, hostId: G.hostId,
        starterPlayerId: G.starterPlayerId, usedWords: G.usedWords, isFirstRound: true
    }});
    saveGameState();
}

function skipWord() {
    if (!G.isHost || !G.pubnub) return;
    const wordData = selectNewWord();
    Object.keys(G.fullRoles).forEach(id => {
        const trueRole = G.trueRoles[id];
        if (trueRole === 'INFILTRADO') G.fullRoles[id].word = 'Categoría: ' + wordData.category;
        else if (trueRole === 'CHARLATÁN') G.fullRoles[id].word = wordData.fakeWord;
        else G.fullRoles[id].word = wordData.secretWord;
    });
    G.starterPlayerId = G.activePlayers[Math.floor(Math.random() * G.activePlayers.length)];
    G.pubnub.publish({ channel: G.channel, message: { type: 'skip_word', roles: G.fullRoles, activePlayers: G.activePlayers, impostors: G.impostors, charlatans: G.charlatans, citizens: G.citizens, hostId: G.hostId, starterPlayerId: G.starterPlayerId, usedWords: G.usedWords }});
    toast('Palabra cambiada', 'info');
}

function handleSkipWord(msg) {
    G.fullRoles = msg.roles;
    G.starterPlayerId = msg.starterPlayerId;
    G.usedWords = msg.usedWords || G.usedWords;
    if (G.fullRoles[G.myId]) G.myRole = G.fullRoles[G.myId];
    if (!G.isSpectator) {
        G.roleRevealed = false;
        const card = document.getElementById('role-card');
        if (card) card.className = 'role-card blurred';
        document.getElementById('role-icon').innerHTML = '<img src="' + ICONS.help + '" alt="?" class="role-icon-img">';
        document.getElementById('role-title').textContent = 'SECRETO';
        document.getElementById('role-word').textContent = '???';
        document.getElementById('role-instruction').textContent = 'Toca la carta para revelar';
        const starterInfo = document.getElementById('starter-info');
        if (starterInfo) { starterInfo.textContent = 'Inicia: ' + (G.players[G.starterPlayerId]?.name || 'Alguien'); starterInfo.style.display = 'block'; }
    }
    toast('Palabra cambiada', 'info');
}

function handleAssign(msg) {
    G.activePlayers = msg.activePlayers;
    G.impostors = msg.impostors;
    G.charlatans = msg.charlatans;
    G.citizens = msg.citizens;
    G.fullRoles = msg.roles;
    G.hostId = msg.hostId || G.hostId;
    G.isHost = (G.myId === G.hostId);
    G.starterPlayerId = msg.starterPlayerId;
    G.usedWords = msg.usedWords || G.usedWords;
    G.gamePhase = 'roles';
    G.isSpectator = false;
    G.isFirstRound = msg.isFirstRound !== false;
    if (G.isFirstRound) G.roleRevealed = false;
    G.hasVotedThisRound = false;
    G.votes = {};
    G.votedPlayers = new Set();
    G.voteTargets = {};
    G.consensusReached = false;
    G.receivedCalculations = {};
    G.myVoteCalculation = null;
    
    const myRoleData = msg.roles[G.myId];
    if (!myRoleData) return;
    G.myRole = myRoleData;
    
    const card = document.getElementById('role-card');
    const btnStart = document.getElementById('btn-start-round');
    const btnSkip = document.getElementById('btn-skip-word');
    document.getElementById('starter-info').style.display = 'none';
    
    if (G.isFirstRound) {
        if (card) card.className = 'role-card blurred';
        document.getElementById('role-icon').innerHTML = '<img src="' + ICONS.help + '" alt="?" class="role-icon-img">';
        document.getElementById('role-title').textContent = 'SECRETO';
        document.getElementById('role-word').textContent = '???';
        document.getElementById('role-instruction').textContent = 'Toca la carta para revelar';
    } else {
        G.roleRevealed = true;
        const roleClass = G.myRole.role === 'INFILTRADO' ? 'impostor' : G.myRole.role === 'CHARLATÁN' ? 'charlatan' : 'citizen';
        if (card) card.className = 'role-card ' + roleClass;
        document.getElementById('role-icon').innerHTML = '<img src="' + G.myRole.icon + '" alt="" class="role-icon-img">';
        document.getElementById('role-title').textContent = G.myRole.role;
        document.getElementById('role-word').textContent = G.myRole.word;
        document.getElementById('role-instruction').textContent = 'Tu rol (ya revelado)';
    }
    
    document.getElementById('points-box').style.display = 'none';
    document.getElementById('timer').style.display = 'none';
    document.getElementById('wait-message').style.display = 'block';
    if (btnStart) { btnStart.style.display = G.isHost ? 'block' : 'none'; btnStart.disabled = false; btnStart.textContent = 'Iniciar Ronda'; }
    if (btnSkip) btnSkip.style.display = G.isHost ? 'block' : 'none';
    showScreen('screen-role');
    clearInterval(G.refreshInterval);
    updatePlayersSidebar();
    updateRolePlayersList();
    saveGameState();
}

function revealRole() {
    if (G.roleRevealed) return;
    G.roleRevealed = true;
    const card = document.getElementById('role-card');
    if (card) card.classList.remove('blurred');
    document.getElementById('role-icon').innerHTML = '<img src="' + G.myRole.icon + '" alt="" class="role-icon-img">';
    document.getElementById('role-title').textContent = G.myRole.role;
    document.getElementById('role-word').textContent = G.myRole.word;
    document.getElementById('role-instruction').textContent = 'Memoriza tu información';
    const roleClass = G.myRole.role === 'INFILTRADO' ? 'impostor' : G.myRole.role === 'CHARLATÁN' ? 'charlatan' : 'citizen';
    if (card) card.classList.add(roleClass);
    showPointsReminder();
    saveGameState();
}

function showPointsReminder() {
    const box = document.getElementById('points-box');
    const list = document.getElementById('points-list');
    if (!box || !list) return;
    let html = '';
    if (G.myRole.role === 'CIUDADANO') {
        html = '<li><span class="points-value positive">+' + POINTS.CITIZEN_SURVIVE + '</span> Sobrevivir</li><li><span class="points-value positive">+' + POINTS.CITIZEN_CORRECT_VOTE + '</span> Votar bien</li><li><span class="points-value negative">' + POINTS.CITIZEN_WRONG_VOTE + '</span> Votar mal</li>';
    } else if (G.myRole.role === 'INFILTRADO') {
        html = '<li><span class="points-value positive">+' + POINTS.IMPOSTOR_WIN + '</span> Ganar</li><li><span class="points-value positive">+' + POINTS.IMPOSTOR_SURVIVE_ROUND + '</span> Sobrevivir ronda</li>';
    } else {
        html = '<li><span class="points-value positive">+' + POINTS.CHARLATAN_SURVIVE + '</span> Sobrevivir</li><li><span class="points-value positive">+' + POINTS.CITIZEN_CORRECT_VOTE + '</span> Votar bien</li>';
    }
    list.innerHTML = html;
    box.style.display = 'block';
}

// ============================================
// RONDAS Y TIMERS
// ============================================

function startRound() {
    if (!G.pubnub || !G.isHost || G.roundStarting) return;
    G.roundStarting = true;
    const btnStart = document.getElementById('btn-start-round');
    const btnSkip = document.getElementById('btn-skip-word');
    const btnSpecNext = document.getElementById('btn-spectator-next');
    const btnSpecSkip = document.getElementById('btn-spectator-skip');
    if (btnStart) { btnStart.disabled = true; btnStart.textContent = 'Iniciando...'; }
    if (btnSkip) btnSkip.style.display = 'none';
    if (btnSpecNext) { btnSpecNext.disabled = true; btnSpecNext.textContent = 'Iniciando...'; }
    if (btnSpecSkip) btnSpecSkip.style.display = 'none';
    const newStarter = G.activePlayers[Math.floor(Math.random() * G.activePlayers.length)];
    G.pubnub.publish({ channel: G.channel, message: { type: 'start_round', time: G.roundTime, starterPlayerId: newStarter } });
    setTimeout(function() { G.roundStarting = false; }, 2000);
}

function showRoundStartOverlay(starterName, starterAvatar, starterFrame) {
    const existing = document.getElementById('round-start-overlay');
    if (existing) existing.remove();
    const avatar = AVATARS.find(a => a.id === starterAvatar) || AVATARS[0];
    const frame = FRAMES.find(f => f.id === starterFrame);
    const hasFrame = frame && frame.color !== 'transparent';
    const overlay = document.createElement('div');
    overlay.id = 'round-start-overlay';
    overlay.className = 'round-start-overlay';
    overlay.innerHTML = '<div class="round-start-message"><h2>¡COMIENZA LA RONDA!</h2><div class="round-start-avatar hex-avatar-container" style="width:100px;height:115px;--frame-color:' + (hasFrame ? frame.color : 'transparent') + '"><img src="' + avatar.image + '" alt="" class="hex-avatar-img">' + (hasFrame ? '<div class="hex-avatar-frame"></div>' : '') + '</div><p>Empieza: <span class="starter-name">' + starterName + '</span></p></div>';
    document.body.appendChild(overlay);
}

function hideRoundStartOverlay() { const overlay = document.getElementById('round-start-overlay'); if (overlay) overlay.remove(); }

function showStarterBanner(starterName) {
    const existing = document.getElementById('starter-banner');
    if (existing) existing.remove();
    const banner = document.createElement('div');
    banner.id = 'starter-banner';
    banner.className = 'starter-banner';
    banner.innerHTML = '<img src="' + ICONS.play + '" alt="">Inicia: ' + starterName;
    document.body.appendChild(banner);
}

function hideStarterBanner() { const banner = document.getElementById('starter-banner'); if (banner) banner.remove(); }

function handleStartRound(msg) {
    clearAllTimers();
    G.starterPlayerId = msg.starterPlayerId;
    G.gamePhase = 'round';
    G.roundStarting = false;
    const btnStart = document.getElementById('btn-start-round');
    const btnSkip = document.getElementById('btn-skip-word');
    if (btnStart) { btnStart.style.display = 'none'; btnStart.disabled = false; btnStart.textContent = 'Iniciar Ronda'; }
    if (btnSkip) btnSkip.style.display = 'none';
    const starterName = G.players[G.starterPlayerId]?.name || 'Alguien';
    if (G.isSpectator) {
        const btnSpecNext = document.getElementById('btn-spectator-next');
        const btnSpecSkip = document.getElementById('btn-spectator-skip');
        if (btnSpecNext) { btnSpecNext.style.display = 'none'; btnSpecNext.disabled = true; }
        if (btnSpecSkip) btnSpecSkip.style.display = 'none';
        document.getElementById('spectator-status').textContent = starterName + ' inicia!';
        setTimeout(function() { startSpectatorTimer(msg.time); }, ROUND_START_DISPLAY_TIME);
        saveGameState();
        return;
    }
    const starter = G.players[G.starterPlayerId] || {};
    showRoundStartOverlay(starterName, starter.avatar || 'avatar-01', starter.frame || 'fr-none');
    setTimeout(function() { hideRoundStartOverlay(); showStarterBanner(starterName); startTimer(msg.time); }, ROUND_START_DISPLAY_TIME);
    saveGameState();
}

function clearAllTimers() {
    if (G.timerInterval) { clearInterval(G.timerInterval); G.timerInterval = null; }
    if (G.voteTimerInterval) { clearInterval(G.voteTimerInterval); G.voteTimerInterval = null; }
    if (G.voteTimeout) { clearTimeout(G.voteTimeout); G.voteTimeout = null; }
    if (G.spectatorTimerInterval) { clearInterval(G.spectatorTimerInterval); G.spectatorTimerInterval = null; }
}

function startTimer(duration) {
    if (G.timerInterval) clearInterval(G.timerInterval);
    const timer = document.getElementById('timer');
    timer.style.display = 'block';
    timer.classList.remove('warning');
    document.getElementById('wait-message').style.display = 'none';
    document.getElementById('points-box').style.display = 'none';
    let remaining = duration;
    updateTimerDisplay(remaining);
    G.timerInterval = setInterval(function() {
        remaining--;
        if (remaining < 0) { clearInterval(G.timerInterval); return; }
        updateTimerDisplay(remaining);
        if (remaining <= 10) timer.classList.add('warning');
        if (remaining <= 0) { clearInterval(G.timerInterval); timer.textContent = '¡TIEMPO!'; if (navigator.vibrate) navigator.vibrate([500, 200, 500]); startVoting(); }
    }, 1000);
}

function startSpectatorTimer(duration) {
    if (G.spectatorTimerInterval) clearInterval(G.spectatorTimerInterval);
    let remaining = duration;
    const specStatus = document.getElementById('spectator-status');
    function updateDisplay() { const mins = Math.floor(remaining / 60); const secs = remaining % 60; specStatus.textContent = 'Ronda: ' + mins.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0'); }
    updateDisplay();
    G.spectatorTimerInterval = setInterval(function() { remaining--; if (remaining < 0) { clearInterval(G.spectatorTimerInterval); specStatus.textContent = 'Votación...'; return; } updateDisplay(); }, 1000);
}

function updateTimerDisplay(seconds) {
    if (seconds < 0) seconds = 0;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    document.getElementById('timer').textContent = mins.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0');
}

// ============================================
// VOTACIÓN CON TIMER UNIVERSAL Y CONSENSO
// ============================================

function startVoting() {
    if (G.timerInterval) clearInterval(G.timerInterval);
    hideStarterBanner();
    G.voteEndTime = Date.now() + VOTE_DURATION;
    G.hasVotedThisRound = false;
    G.consensusReached = false;
    G.receivedCalculations = {};
    G.myVoteCalculation = null;
    if (G.isSpectator) { document.getElementById('spectator-status').textContent = 'Votación...'; showScreen('screen-spectator'); return; }
    G.gamePhase = 'voting';
    G.votes = {};
    G.votedPlayers = new Set();
    G.voteTargets = {};
    showScreen('screen-voting');
    renderVotingList();
    startUniversalVoteTimer();
    saveGameState();
}

function startUniversalVoteTimer() {
    if (G.voteTimerInterval) clearInterval(G.voteTimerInterval);
    const display = document.getElementById('vote-timer');
    const voteStatus = document.getElementById('vote-status');
    const updateTimer = function() {
        const remaining = Math.max(0, Math.ceil((G.voteEndTime - Date.now()) / 1000));
        display.textContent = '00:' + remaining.toString().padStart(2, '0');
        if (remaining <= 0) {
            clearInterval(G.voteTimerInterval);
            G.voteTimerInterval = null;
            document.querySelectorAll('.btn-vote').forEach(btn => btn.disabled = true);
            if (voteStatus) voteStatus.textContent = 'Contando votos...';
            showCountingVotesOverlay();
            calculateAndSendMyResult();
        }
    };
    updateTimer();
    G.voteTimerInterval = setInterval(updateTimer, 250);
}

function updateVoteTimerFromTimestamp() {
    if (!G.voteEndTime) return;
    const remaining = Math.max(0, Math.ceil((G.voteEndTime - Date.now()) / 1000));
    const display = document.getElementById('vote-timer');
    if (display) display.textContent = '00:' + remaining.toString().padStart(2, '0');
    if (remaining <= 0 && !G.consensusReached) {
        document.querySelectorAll('.btn-vote').forEach(btn => btn.disabled = true);
        const voteStatus = document.getElementById('vote-status');
        if (voteStatus) voteStatus.textContent = 'Contando votos...';
        if (!G.myVoteCalculation) calculateAndSendMyResult();
    } else if (remaining > 0) { startUniversalVoteTimer(); }
}

function renderVotingList() {
    const list = document.getElementById('voting-list');
    if (!list) return;
    const votable = G.activePlayers.filter(id => id !== G.myId && !G.eliminated.includes(id));
    list.innerHTML = votable.map(id => {
        const hasVoted = G.hasVotedThisRound;
        return '<div class="vote-item"><div class="vote-avatar">' + renderHexAvatar(id, 48) + '</div><div class="player-info"><div class="player-name">' + (G.players[id]?.name || id) + '</div></div><button class="btn-vote' + (hasVoted ? ' voted' : '') + '" data-target="' + id + '"' + (hasVoted ? ' disabled' : '') + '>' + (hasVoted ? 'Votado' : 'Votar') + '</button></div>';
    }).join('');
    if (!G.hasVotedThisRound) list.querySelectorAll('.btn-vote').forEach(btn => { btn.onclick = function() { sendVote(btn.dataset.target, btn); }; });
    if (G.hasVotedThisRound) { const voteStatus = document.getElementById('vote-status'); if (voteStatus) voteStatus.textContent = 'Voto registrado. Esperando...'; }
}

function sendVote(targetId, button) {
    if (!G.pubnub || G.eliminated.includes(targetId) || !G.activePlayers.includes(targetId) || G.hasVotedThisRound) return;
    if (G.voteEndTime && Date.now() >= G.voteEndTime) { toast('Tiempo agotado', 'warning'); return; }
    G.hasVotedThisRound = true;
    G.pubnub.publish({ channel: G.channel, message: { type: 'vote', target: targetId } });
    button.classList.add('voted');
    button.textContent = 'Votado';
    button.disabled = true;
    document.querySelectorAll('.btn-vote').forEach(btn => btn.disabled = true);
    document.getElementById('vote-status').textContent = 'Voto registrado. Esperando...';
    saveGameState();
}

function handleVote(voterId, targetId) {
    if (!G.activePlayers.includes(targetId) || G.eliminated.includes(targetId)) return;
    if (!G.activePlayers.includes(voterId) || G.eliminated.includes(voterId)) return;
    if (G.votedPlayers.has(voterId) || voterId === targetId) return;
    G.votes[targetId] = (G.votes[targetId] || 0) + 1;
    G.votedPlayers.add(voterId);
    G.voteTargets[voterId] = targetId;
    if (G.isHost && G.pubnub) G.pubnub.publish({ channel: G.channel, message: { type: 'vote_update', votes: G.votes, voted: Array.from(G.votedPlayers), voteTargets: G.voteTargets } });
    if (G.isSpectator) updateSpectatorVotes();
    saveGameState();
}

function handleVoteUpdate(msg) {
    G.votes = msg.votes || {};
    G.votedPlayers = new Set(msg.voted || []);
    G.voteTargets = msg.voteTargets || {};
    if (G.votedPlayers.has(G.myId)) G.hasVotedThisRound = true;
    if (G.isSpectator) updateSpectatorVotes();
    saveGameState();
}

function calculateAndSendMyResult() {
    if (G.myVoteCalculation || G.consensusReached) return;
    let maxVotes = 0, mostVoted = [];
    Object.entries(G.votes).forEach(function([id, count]) {
        if (count > maxVotes) { maxVotes = count; mostVoted = [id]; }
        else if (count === maxVotes) mostVoted.push(id);
    });
    const isTie = mostVoted.length > 1 || maxVotes === 0;
    const eliminatedId = isTie ? null : mostVoted[0];
    G.myVoteCalculation = { eliminatedId: eliminatedId, isTie: isTie, maxVotes: maxVotes, totalVotes: Object.values(G.votes).reduce((a, b) => a + b, 0) };
    if (G.pubnub) G.pubnub.publish({ channel: G.channel, message: { type: 'vote_calculation', calculation: G.myVoteCalculation, timestamp: Date.now() } });
    G.receivedCalculations[G.myId] = G.myVoteCalculation;
    checkConsensus();
}

function handleVoteCalculation(senderId, msg) {
    if (G.consensusReached) return;
    G.receivedCalculations[senderId] = msg.calculation;
    checkConsensus();
}

function checkConsensus() {
    if (G.consensusReached) return;
    const calculations = Object.values(G.receivedCalculations);
    const totalActivePlayers = G.activePlayers.filter(id => !G.eliminated.includes(id)).length;
    const majorityNeeded = Math.ceil(totalActivePlayers / 2);
    const resultGroups = {};
    calculations.forEach(calc => {
        const key = calc.isTie ? 'TIE' : calc.eliminatedId;
        if (!resultGroups[key]) resultGroups[key] = [];
        resultGroups[key].push(calc);
    });
    for (const [key, calcs] of Object.entries(resultGroups)) {
        if (calcs.length >= majorityNeeded) {
            G.consensusReached = true;
            if (G.isHost) publishConsensusResult(calcs[0]);
            return;
        }
    }
    if (calculations.length >= totalActivePlayers && G.isHost) {
        G.consensusReached = true;
        publishConsensusResult(G.myVoteCalculation);
    }
}

function publishConsensusResult(consensusCalc) {
    if (!G.pubnub || !G.isHost) return;
    clearAllTimers();
    let eliminatedId = consensusCalc.eliminatedId;
    let eliminatedRole = null;
    const isTie = consensusCalc.isTie;
    if (!isTie && eliminatedId) {
        G.eliminated.push(eliminatedId);
        G.activePlayers = G.activePlayers.filter(id => id !== eliminatedId);
        if (G.impostors.includes(eliminatedId)) { eliminatedRole = 'INFILTRADO'; G.impostors = G.impostors.filter(id => id !== eliminatedId); }
        else if (G.charlatans.includes(eliminatedId)) { eliminatedRole = 'CHARLATÁN'; G.charlatans = G.charlatans.filter(id => id !== eliminatedId); }
        else { eliminatedRole = 'CIUDADANO'; G.citizens = G.citizens.filter(id => id !== eliminatedId); }
        Object.entries(G.voteTargets).forEach(function([voterId, targetId]) {
            if (targetId === eliminatedId) {
                if (eliminatedRole === 'INFILTRADO') G.scores[voterId] = (G.scores[voterId] || 0) + POINTS.CITIZEN_CORRECT_VOTE;
                else if (!G.impostors.includes(voterId)) G.scores[voterId] = (G.scores[voterId] || 0) + POINTS.CITIZEN_WRONG_VOTE;
            }
        });
        G.impostors.forEach(id => { G.scores[id] = (G.scores[id] || 0) + POINTS.IMPOSTOR_SURVIVE_ROUND; });
    }
    G.pubnub.publish({ channel: G.channel, message: { type: 'consensus_result', eliminatedId: eliminatedId, eliminatedName: eliminatedId ? G.players[eliminatedId]?.name : null, eliminatedRole: eliminatedRole, isTie: isTie, votes: G.votes, scores: G.scores, activePlayers: G.activePlayers, impostors: G.impostors, fullRoles: G.fullRoles }});
    G.pubnub.publish({ channel: G.channel, message: { type: 'spectator_roles', roles: G.fullRoles, activePlayers: G.activePlayers }});
    saveGameState();
}

function handleConsensusResult(msg) {
    hideCountingVotesOverlay();
    G.consensusReached = true;
    G.votes = msg.votes;
    G.scores = msg.scores || G.scores;
    G.activePlayers = msg.activePlayers;
    G.impostors = msg.impostors;
    if (msg.eliminatedId && !G.eliminated.includes(msg.eliminatedId)) G.eliminated.push(msg.eliminatedId);
    showResults(msg);
}

function showCountingVotesOverlay() {
    if (document.getElementById('counting-votes-overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'counting-votes-overlay';
    overlay.className = 'counting-votes-overlay';
    overlay.innerHTML = '<div class="counting-votes-message"><h2>Contando votos...</h2></div>';
    document.body.appendChild(overlay);
}

function hideCountingVotesOverlay() { const overlay = document.getElementById('counting-votes-overlay'); if (overlay) overlay.remove(); }

function showYouEliminatedOverlay(role) {
    const existing = document.getElementById('you-eliminated-overlay');
    if (existing) existing.remove();
    const overlay = document.createElement('div');
    overlay.id = 'you-eliminated-overlay';
    overlay.className = 'you-eliminated-overlay';
    overlay.innerHTML = '<div class="you-eliminated-message"><h1>HAS SIDO EXPULSADO</h1><p>Eras ' + role + '</p></div>';
    document.body.appendChild(overlay);
}

function hideYouEliminatedOverlay() { const overlay = document.getElementById('you-eliminated-overlay'); if (overlay) overlay.remove(); }

// ============================================
// RESULTADOS Y FIN DE JUEGO
// ============================================

function showResults(msg) {
    clearAllTimers();
    hideStarterBanner();
    hideCountingVotesOverlay();
    G.votes = msg.votes;
    G.scores = msg.scores || G.scores;
    G.activePlayers = msg.activePlayers;
    G.impostors = msg.impostors;
    if (msg.eliminatedId && !G.eliminated.includes(msg.eliminatedId)) G.eliminated.push(msg.eliminatedId);
    updatePlayersSidebar();
    updateRolePlayersList();
    
    if (msg.eliminatedId === G.myId) {
        G.isSpectator = true;
        G.fullRoles = msg.fullRoles || G.fullRoles;
        showYouEliminatedOverlay(msg.eliminatedRole);
        setTimeout(function() {
            hideYouEliminatedOverlay();
            showScreen('screen-spectator');
            document.getElementById('spectator-status').textContent = 'Eliminado (' + msg.eliminatedRole + ')';
            updateSpectatorRoles();
            updateSpectatorHostControls();
        }, 3000);
        saveGameState();
        return;
    }
    
    if (G.isSpectator) {
        document.getElementById('spectator-status').textContent = msg.isTie ? 'Empate' : msg.eliminatedName + ' eliminado';
        updateSpectatorRoles();
        updateSpectatorHostControls();
        saveGameState();
        return;
    }
    
    showScreen('screen-results');
    G.gamePhase = 'results';
    
    const resultsList = document.getElementById('results-list');
    if (resultsList) {
        const voteEntries = Object.entries(msg.votes);
        const maxVotes = voteEntries.length > 0 ? Math.max(...Object.values(msg.votes), 1) : 1;
        resultsList.innerHTML = voteEntries.map(function([id, count]) {
            return '<div class="result-item"><div class="result-header"><div class="result-player"><div class="result-avatar">' + renderHexAvatar(id, 36) + '</div><span class="result-name">' + (G.players[id]?.name || id) + '</span></div><span class="result-votes">' + count + ' votos</span></div><div class="result-bar"><div class="result-bar-fill" style="width:' + (count / maxVotes * 100) + '%"></div></div></div>';
        }).join('');
    }
    
    const elimBox = document.getElementById('eliminated-box');
    if (elimBox) {
        if (msg.isTie) {
            elimBox.innerHTML = '<div class="eliminated-message">Empate en la votación</div><div class="eliminated-name">NADIE ELIMINADO</div><div class="eliminated-role-container"><img src="' + ICONS.tie + '" alt="" class="eliminated-role-icon"></div>';
        } else {
            const iconSrc = msg.eliminatedRole === 'INFILTRADO' ? ICONS.impostor : msg.eliminatedRole === 'CHARLATÁN' ? ICONS.charlatan : ICONS.citizen;
            elimBox.innerHTML = '<div class="eliminated-message">Ha sido expulsado</div><div class="eliminated-name">' + msg.eliminatedName + '</div><div class="eliminated-role-container"><img src="' + iconSrc + '" alt="" class="eliminated-role-icon"><span class="eliminated-role">Era <strong>' + msg.eliminatedRole + '</strong></span></div>';
        }
    }
    
    const btnNext = document.getElementById('btn-next-round');
    const btnBackLobby = document.getElementById('btn-back-lobby');
    if (btnBackLobby) btnBackLobby.style.display = 'none';
    if (btnNext) { btnNext.style.display = 'none'; btnNext.disabled = false; btnNext.className = 'btn btn-next-round'; }
    
    if (G.isHost) {
        const delay = msg.isTie ? TIE_BUTTON_DELAY : RESULT_DISPLAY_TIME;
        setTimeout(function() { if (btnNext) btnNext.style.display = 'block'; if (btnBackLobby) btnBackLobby.style.display = 'block'; }, delay);
        if (!msg.isTie) setTimeout(checkGameOver, RESULT_DISPLAY_TIME);
    }
    saveGameState();
}

function nextRound() {
    if (!G.pubnub || !G.isHost) return;
    const btnNext = document.getElementById('btn-next-round');
    if (btnNext) btnNext.disabled = true;
    G.pubnub.publish({ channel: G.channel, message: { type: 'next_round', activePlayers: G.activePlayers, fullRoles: G.fullRoles }});
}

function handleNextRound(msg) {
    clearAllTimers();
    hideStarterBanner();
    G.votes = {};
    G.votedPlayers = new Set();
    G.voteTargets = {};
    G.isFirstRound = false;
    G.gamePhase = 'roles';
    G.hasVotedThisRound = false;
    G.consensusReached = false;
    G.receivedCalculations = {};
    G.myVoteCalculation = null;
    if (msg && msg.activePlayers) G.activePlayers = msg.activePlayers;
    if (msg && msg.fullRoles) { G.fullRoles = msg.fullRoles; if (G.fullRoles[G.myId]) G.myRole = G.fullRoles[G.myId]; }
    
    if (G.isSpectator) {
        document.getElementById('spectator-status').textContent = 'Esperando inicio...';
        const btnSpecNext = document.getElementById('btn-spectator-next');
        if (btnSpecNext) btnSpecNext.style.display = 'none';
        if (G.isHost && btnSpecNext) { btnSpecNext.textContent = 'Iniciar Ronda'; btnSpecNext.style.display = 'block'; btnSpecNext.disabled = false; btnSpecNext.className = 'btn btn-start-round'; }
        showScreen('screen-spectator');
        updateSpectatorRoles();
        return;
    }
    
    const card = document.getElementById('role-card');
    const btnStart = document.getElementById('btn-start-round');
    const btnSkip = document.getElementById('btn-skip-word');
    G.roleRevealed = true;
    const roleClass = G.myRole.role === 'INFILTRADO' ? 'impostor' : G.myRole.role === 'CHARLATÁN' ? 'charlatan' : 'citizen';
    if (card) card.className = 'role-card ' + roleClass;
    document.getElementById('role-icon').innerHTML = '<img src="' + G.myRole.icon + '" alt="" class="role-icon-img">';
    document.getElementById('role-title').textContent = G.myRole.role;
    document.getElementById('role-word').textContent = G.myRole.word;
    document.getElementById('role-instruction').textContent = 'Tu rol (conocido)';
    document.getElementById('points-box').style.display = 'none';
    document.getElementById('timer').style.display = 'none';
    document.getElementById('wait-message').style.display = 'block';
    document.getElementById('starter-info').style.display = 'none';
    if (btnStart) { btnStart.style.display = G.isHost ? 'block' : 'none'; btnStart.disabled = false; btnStart.className = 'btn btn-start-round'; btnStart.textContent = 'Iniciar Ronda'; }
    if (btnSkip) btnSkip.style.display = G.isHost ? 'block' : 'none';
    showScreen('screen-role');
    updatePlayersSidebar();
    updateRolePlayersList();
}

function spectatorNextAction() {
    if (!G.isHost) return;
    const btn = document.getElementById('btn-spectator-next');
    if (btn && btn.textContent.includes('Iniciar')) startRound();
    else nextRound();
}

function checkGameOver() {
    if (!G.isHost || !G.pubnub) return;
    let winner = null, reason = '';
    if (G.impostors.length === 0) {
        winner = 'CIUDADANOS';
        reason = 'Infiltrados eliminados';
        G.citizens.forEach(id => { if (G.activePlayers.includes(id)) G.scores[id] = (G.scores[id] || 0) + POINTS.CITIZEN_SURVIVE; });
        G.charlatans.forEach(id => { if (G.activePlayers.includes(id)) G.scores[id] = (G.scores[id] || 0) + POINTS.CHARLATAN_SURVIVE; });
    } else if (G.activePlayers.length - G.impostors.length <= G.impostors.length) {
        winner = 'INFILTRADOS';
        reason = 'Infiltrados dominan';
        G.impostors.forEach(id => { G.scores[id] = (G.scores[id] || 0) + POINTS.IMPOSTOR_WIN; });
    }
    if (winner) G.pubnub.publish({ channel: G.channel, message: { type: 'game_over', winner: winner, reason: reason, scores: G.scores, roles: G.fullRoles }});
}

function handleGameOver(msg) {
    clearAllTimers();
    hideStarterBanner();
    hidePlayersSidebar();
    G.gamePhase = 'gameover';
    G.scores = msg.scores || G.scores;
    G.fullRoles = msg.roles || G.fullRoles;
    showScreen('screen-gameover');
    document.getElementById('gameover-title').textContent = '¡' + msg.winner + ' GANAN!';
    document.getElementById('gameover-reason').textContent = msg.reason;
    document.getElementById('gameover-icon').src = msg.winner === 'INFILTRADOS' ? ICONS.impostor : ICONS.celebrate;
    const scoresList = document.getElementById('final-scores');
    const sorted = Object.entries(G.scores).sort((a, b) => b[1] - a[1]);
    scoresList.innerHTML = '<div class="final-scores-list">' + sorted.map(function([id, score], idx) {
        const p = G.players[id];
        const role = G.fullRoles[id];
        let rankHtml = idx === 0 ? '<div class="score-rank"><img src="' + ICONS.medalGold + '" alt="1"></div>' :
                       idx === 1 ? '<div class="score-rank"><img src="' + ICONS.medalSilver + '" alt="2"></div>' :
                       idx === 2 ? '<div class="score-rank"><img src="' + ICONS.medalBronze + '" alt="3"></div>' :
                       '<div class="score-rank"><span class="score-rank-number">' + (idx + 1) + '</span></div>';
        return '<div class="score-item">' + rankHtml + '<div class="score-avatar">' + renderHexAvatar(id, 44) + '</div><div class="score-info"><div class="score-name">' + (p?.name || id) + '</div><div class="score-role">' + (role?.role || '') + '</div></div><div class="score-points">' + score + '</div></div>';
    }).join('') + '</div>';
}

function backToLobby() {
    if (G.isHost && G.pubnub) G.pubnub.publish({ channel: G.channel, message: { type: 'back_to_lobby', scores: G.scores, hostId: G.hostId, usedWords: G.usedWords, playerJoinOrder: G.playerJoinOrder }});
    resetGameState();
    showScreen('screen-lobby');
    const btn = document.getElementById('btn-distribute');
    if (btn) btn.style.display = G.isHost ? 'block' : 'none';
    G.refreshInterval = setInterval(refreshPlayers, 3000);
    refreshPlayers();
    saveGameState();
}

function handleBackToLobby(msg) {
    clearAllTimers();
    hideStarterBanner();
    hideCountingVotesOverlay();
    G.scores = msg.scores || G.scores;
    G.hostId = msg.hostId || G.hostId;
    G.isHost = (G.myId === G.hostId);
    G.usedWords = msg.usedWords || G.usedWords;
    G.playerJoinOrder = msg.playerJoinOrder || G.playerJoinOrder;
    resetGameState();
    showScreen('screen-lobby');
    const btn = document.getElementById('btn-distribute');
    if (btn) btn.style.display = G.isHost ? 'block' : 'none';
    G.refreshInterval = setInterval(refreshPlayers, 3000);
    refreshPlayers();
    saveGameState();
}

function resetGameState() {
    clearAllTimers();
    hideStarterBanner();
    hidePlayersSidebar();
    hideCountingVotesOverlay();
    G.gamePhase = 'lobby';
    G.isSpectator = false;
    G.activePlayers = [];
    G.eliminated = [];
    G.impostors = [];
    G.charlatans = [];
    G.citizens = [];
    G.myRole = null;
    G.fullRoles = {};
    G.votes = {};
    G.votedPlayers = new Set();
    G.voteTargets = {};
    G.roleRevealed = false;
    G.starterPlayerId = null;
    G.isFirstRound = true;
    G.roundStarting = false;
    G.hasVotedThisRound = false;
    G.consensusReached = false;
    G.receivedCalculations = {};
    G.myVoteCalculation = null;
    G.voteEndTime = null;
}

// ============================================
// ESPECTADOR
// ============================================

function updateSpectatorRoles() {
    const list = document.getElementById('spectator-roles');
    if (!list || !G.fullRoles) return;
    list.innerHTML = Object.entries(G.fullRoles).map(function([id, role]) {
        const p = G.players[id];
        const isActive = G.activePlayers.includes(id);
        const statusIcon = isActive ? ICONS.active : ICONS.eliminated;
        return '<div class="player-item" style="opacity:' + (isActive ? 1 : 0.5) + '"><div class="player-avatar">' + renderHexAvatar(id, 36) + '</div><div class="player-info"><div class="player-name">' + (p?.name || id) + '</div><div class="player-tag">' + role.role + ' - ' + role.word + '</div></div><img src="' + statusIcon + '" alt="" class="player-status-icon"></div>';
    }).join('');
}

function updateSpectatorVotes() {
    const list = document.getElementById('spectator-votes');
    if (!list) return;
    list.innerHTML = G.activePlayers.map(function(id) {
        const p = G.players[id];
        const votes = G.votes[id] || 0;
        const hasVoted = G.votedPlayers.has(id);
        const statusIcon = hasVoted ? ICONS.voted : ICONS.pending;
        return '<div class="player-item"><div class="player-avatar">' + renderHexAvatar(id, 36) + '</div><div class="player-info"><div class="player-name">' + (p?.name || id) + '</div><div class="player-tag">' + (hasVoted ? 'Ha votado' : 'Pendiente') + '</div></div><span>' + votes + ' votos</span></div>';
    }).join('');
}

// ============================================
// SALIR
// ============================================

function leaveRoom() { if (confirm('¿Abandonar?')) exitGame(); }

function exitGame() {
    clearAllTimers();
    clearInterval(G.refreshInterval);
    hideStarterBanner();
    hidePlayersSidebar();
    if (G.isHost && G.pubnub) G.pubnub.publish({ channel: G.channel, message: { type: 'host_disconnect' }});
    if (G.pubnub) { G.pubnub.unsubscribeAll(); G.pubnub = null; }
    G.channel = null;
    G.isHost = false;
    G.hostId = null;
    G.players = {};
    G.scores = {};
    G.usedWords = [];
    resetGameState();
    clearGameState();
    showScreen('screen-home');
}

function toast(message, type) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const t = document.createElement('div');
    t.className = 'toast ' + (type || 'info');
    t.textContent = message;
    container.appendChild(t);
    setTimeout(function() { t.remove(); }, 3000);
}

window.G = G;
console.log('INFILTRA v1.1.0 (Robust Edition) cargado completamente');
