/**
 * INFILTRA - Game Logic v0.9.8.3
 * 
 * Cambios en v0.9.8.3:
 * - Límite de jugadores máximo: 10
 * - Fix botón kick (aparece desde el inicio en lobby)
 * - Fix botón cambiar palabra (aparece correctamente)
 * - Botón "Abandonar" en todas las pantallas de juego
 * - Nueva vista previa de perfil con avatar + marco
 * - Marcos rediseñados más grandes y claros
 */

// ============================================
// CONSTANTES
// ============================================

const POINTS = {
    CITIZEN_SURVIVE: 15,
    CITIZEN_CORRECT_VOTE: 7,
    CITIZEN_WRONG_VOTE: -3,
    IMPOSTOR_WIN: 30,
    IMPOSTOR_SURVIVE_ROUND: 5,
    CHARLATAN_SURVIVE: 25
};

const DB = {
    "Animales": ["León", "Tigre", "Elefante", "Cebra", "Delfín", "Lobo", "Gorila", "Águila", "Jirafa", "Oso", "Zorro", "Panda", "Tiburón", "Canguro", "Hipopótamo", "Serpiente", "Cocodrilo", "Pájaro", "Mono", "Tortuga", "Rinoceronte", "Pingüino"],
    "Comida": ["Pizza", "Tacos", "Sushi", "Hamburguesa", "Pasta", "Ensalada", "Helado", "Pollo", "Pescado", "Chocolate", "Empanadas", "Ramen", "Curry", "Paella", "Burrito", "Croissant", "Queso", "Arroz", "Sopa", "Frutas secas", "Tarta"],
    "Países": ["México", "Japón", "Brasil", "España", "Francia", "Italia", "Alemania", "Australia", "Argentina", "Canadá", "China", "India", "Rusia", "Estados Unidos", "Reino Unido", "Sudáfrica", "Egipto", "Nueva Zelanda", "Corea del Sur", "Turquía"],
    "Profesiones": ["Médico", "Abogado", "Ingeniero", "Profesor", "Chef", "Piloto", "Arquitecto", "Programador", "Fotógrafo", "Enfermero", "Diseñador", "Periodista", "Músico", "Actor", "Científico", "Veterinario", "Contador", "Psicólogo", "Bombero", "Policía"],
    "Deportes": ["Fútbol", "Baloncesto", "Tenis", "Natación", "Boxeo", "Golf", "Voleibol", "Surf", "Ciclismo", "Atletismo", "Esquí", "Karate", "Béisbol", "Rugby", "Gimnasia", "Escalada", "Patinaje", "Hockey", "Fútbol americano", "Taekwondo"],
    "Ciudades": ["París", "Tokio", "Nueva York", "Londres", "Roma", "Berlín", "Madrid", "Dubai", "Barcelona", "México DF", "Sídney", "Río de Janeiro", "Los Ángeles", "Toronto", "Estambul", "Singapur", "Ámsterdam", "Seúl", "Viena", "Buenos Aires"],
    "Frutas": ["Manzana", "Banana", "Naranja", "Uva", "Fresa", "Piña", "Mango", "Sandía", "Kiwi", "Melón", "Pera", "Durazno", "Cereza", "Limón", "Papaya", "Granada", "Coco", "Higo", "Mora", "Frambuesa"],
    "Vehículos": ["Coche", "Bicicleta", "Avión", "Barco", "Tren", "Helicóptero", "Motocicleta", "Camión", "Submarino", "Cohete", "Autobús", "Patineta", "Tractor", "Yate", "Monopatín eléctrico", "Caravana", "Todoterreno", "Furgoneta", "Globo aerostático", "Kayak"],
    "Instrumentos": ["Guitarra", "Piano", "Batería", "Violín", "Flauta", "Trompeta", "Saxofón", "Arpa", "Bajo", "Ukelele", "Acordeón", "Cello", "Clarinete", "Órgano", "Tambor", "Armónica", "Xilófono", "Tuba", "Gaita", "Sitar"],
    "Películas": ["Titanic", "Star Wars", "Avatar", "Frozen", "Shrek", "Batman", "Avengers", "Coco", "Inception", "The Matrix", "Jurassic Park", "Harry Potter", "The Lion King", "Pulp Fiction", "Forrest Gump", "Interstellar", "Parasite", "Toy Story", "Black Panther", "La La Land"],
    "Colores": ["Rojo", "Azul", "Verde", "Amarillo", "Naranja", "Morado", "Rosa", "Negro", "Blanco", "Gris", "Café", "Turquesa", "Violeta", "Índigo", "Celeste", "Magenta", "Dorado", "Plateado", "Beige", "Lavanda"],
    "Planetas": ["Mercurio", "Venus", "Tierra", "Marte", "Júpiter", "Saturno", "Urano", "Neptuno", "Plutón", "Luna (satélite)"],
    "Elementos Químicos": ["Hidrógeno", "Oxígeno", "Carbono", "Nitrógeno", "Helio", "Hierro", "Oro", "Plata", "Calcio", "Sodio", "Potasio", "Cloro", "Fósforo", "Azufre", "Magnesio", "Aluminio", "Cobre", "Zinc", "Plomo", "Uranio"],
    "Idiomas": ["Español", "Inglés", "Chino", "Francés", "Árabe", "Ruso", "Alemán", "Japonés", "Portugués", "Hindi", "Italiano", "Coreano", "Turco", "Sueco", "Holandés", "Polaco", "Griego", "Hebreo", "Swahili", "Quechua"],
    "Superhéroes": ["Superman", "Batman", "Spider-Man", "Wonder Woman", "Iron Man", "Captain America", "Thor", "Hulk", "Black Widow", "Flash", "Aquaman", "Green Lantern", "Doctor Strange", "Black Panther", "Wolverine", "Deadpool", "Captain Marvel", "Ant-Man", "Shazam", "Supergirl"]
};

const AVATARS = [
    { id: 'avatar-11', emoji: '🔎', image: 'assets/avatars/avatar-11.svg' },
    { id: 'avatar-12', emoji: '🔎', image: 'assets/avatars/avatar-12.svg' },
    { id: 'avatar-13', emoji: '🔎', image: 'assets/avatars/avatar-13.svg' },
    { id: 'avatar-16', emoji: '🔎', image: 'assets/avatars/avatar-16.svg' },
    { id: 'avatar-17', emoji: '🔎', image: 'assets/avatars/avatar-17.svg' }
];

const FRAMES = [
    { id: 'fr-basic', color: '#4a5568', locked: false },
    { id: 'fr-gold', color: '#c9a227', locked: false },
    { id: 'fr-red', color: '#8b2635', locked: false },
    { id: 'fr-purple', color: '#7c3aed', locked: false }
];

const RESULT_DISPLAY_TIME = 5000;

// ============================================
// ESTADO GLOBAL
// ============================================

let G = {
    pubnub: null,
    channel: null,
    myId: null,
    playerName: '',
    avatar: 'avatar-11',
    frame: 'fr-basic',
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
    previousScreen: 'screen-home',
    roleRevealed: false,
    isFirstRound: true
};

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', init);

function init() {
    console.log('Iniciando INFILTRA v0.9.8.3...');
    
    G.myId = sessionStorage.getItem('infiltra_myId');
    if (!G.myId) {
        G.myId = 'P-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
        sessionStorage.setItem('infiltra_myId', G.myId);
    }

    loadProfile();
    initAvatars();
    initFrames();
    initCategories();
    initParticles();
    bindEvents();
    checkURLParams();
    updateProfilePreview();
    
    console.log('INFILTRA v0.9.8.3 iniciado correctamente');
}

function loadProfile() {
    const name = localStorage.getItem('infiltra_name');
    const avatar = localStorage.getItem('infiltra_avatar');
    const frame = localStorage.getItem('infiltra_frame');
    
    if (name) {
        const input = document.getElementById('input-name');
        if (input) input.value = name;
        G.playerName = name;
    }
    if (avatar) G.avatar = avatar;
    if (frame) G.frame = frame;
}

function saveProfile() {
    localStorage.setItem('infiltra_name', G.playerName);
    localStorage.setItem('infiltra_avatar', G.avatar);
    localStorage.setItem('infiltra_frame', G.frame);
}

// ============================================
// VISTA PREVIA DEL PERFIL
// ============================================

function updateProfilePreview() {
    const previewAvatar = document.getElementById('preview-avatar');
    const previewWrapper = document.getElementById('preview-avatar-wrapper');
    const previewName = document.getElementById('preview-name');
    
    if (!previewAvatar || !previewWrapper) return;
    
    const avatar = AVATARS.find(a => a.id === G.avatar) || AVATARS[0];
    if (avatar.image) {
        previewAvatar.innerHTML = '<img src="' + avatar.image + '" alt="avatar" onerror="this.outerHTML=\'' + avatar.emoji + '\'">';
    } else {
        previewAvatar.textContent = avatar.emoji;
    }
    
    const frame = FRAMES.find(f => f.id === G.frame);
    if (frame) {
        previewWrapper.style.border = '4px solid ' + frame.color;
        previewWrapper.style.boxShadow = '0 0 15px ' + frame.color + '40';
    }
    
    const nameInput = document.getElementById('input-name');
    if (previewName && nameInput) {
        previewName.textContent = nameInput.value || 'Tu Nombre';
    }
}

function initAvatars() {
    const grid = document.getElementById('avatar-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    AVATARS.forEach(avatar => {
        const div = document.createElement('div');
        div.className = 'avatar-option' + (avatar.id === G.avatar ? ' selected' : '');
        div.dataset.id = avatar.id;
        
        if (avatar.image) {
            const img = document.createElement('img');
            img.src = avatar.image;
            img.alt = avatar.id;
            img.onerror = function() { this.parentElement.textContent = avatar.emoji; };
            div.appendChild(img);
        } else {
            div.textContent = avatar.emoji;
        }
        
        div.onclick = function() {
            G.avatar = avatar.id;
            grid.querySelectorAll('.avatar-option').forEach(el => el.classList.remove('selected'));
            div.classList.add('selected');
            updateProfilePreview();
        };
        
        grid.appendChild(div);
    });
}

function initFrames() {
    const grid = document.getElementById('frame-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    FRAMES.forEach(frame => {
        const div = document.createElement('div');
        div.className = 'frame-option-new' + (frame.id === G.frame ? ' selected' : '') + (frame.locked ? ' locked' : '');
        div.dataset.id = frame.id;
        div.dataset.color = frame.color;
        
        const preview = document.createElement('div');
        preview.className = 'frame-preview';
        preview.style.border = '4px solid ' + frame.color;
        preview.style.boxShadow = '0 0 10px ' + frame.color + '60';
        preview.textContent = '👤';
        
        div.appendChild(preview);
        
        if (!frame.locked) {
            div.onclick = function() {
                G.frame = frame.id;
                grid.querySelectorAll('.frame-option-new').forEach(el => el.classList.remove('selected'));
                div.classList.add('selected');
                updateProfilePreview();
            };
        }
        
        grid.appendChild(div);
    });
}

function initCategories() {
    const list = document.getElementById('categories-list');
    if (!list) return;
    
    list.innerHTML = Object.keys(DB).map(cat => 
        '<div class="category-item"><input type="checkbox" id="cat-' + cat + '" value="' + cat + '" checked><label for="cat-' + cat + '">' + cat + '</label></div>'
    ).join('');
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
        p.style.animationDuration = (Math.random() * 3 + 2) + 's';
        container.appendChild(p);
    }
}

function bindEvents() {
    const bind = (id, fn) => { const el = document.getElementById(id); if (el) el.onclick = fn; };
    
    bind('btn-show-config', showConfig);
    bind('btn-back-home', () => showScreen('screen-home'));
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
    bind('role-card', revealRole);
    
    // Botones de abandonar en todas las pantallas
    bind('btn-leave-role', leaveRoom);
    bind('btn-leave-voting', leaveRoom);
    bind('btn-leave-results', leaveRoom);
    bind('btn-leave-spectator', leaveRoom);
    
    bind('btn-cat-all', () => { document.querySelectorAll('.category-item input').forEach(cb => cb.checked = true); updateSelectedCategories(); });
    bind('btn-cat-none', () => { document.querySelectorAll('.category-item input').forEach(cb => cb.checked = false); updateSelectedCategories(); });

    bind('btn-sound', () => {
        G.soundEnabled = !G.soundEnabled;
        const btn = document.getElementById('btn-sound');
        if (btn) { btn.textContent = G.soundEnabled ? '🔊' : '🔇'; btn.classList.toggle('muted', !G.soundEnabled); }
    });

    bind('btn-help', () => { G.previousScreen = document.querySelector('.screen.active')?.id || 'screen-home'; showScreen('screen-help'); });
    bind('btn-help-back', () => { showScreen(G.previousScreen || 'screen-home'); });
    
    const nameInput = document.getElementById('input-name');
    if (nameInput) nameInput.addEventListener('input', updateProfilePreview);
}

function checkURLParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('room')) {
        const input = document.getElementById('input-join-code');
        if (input) { input.value = params.get('room').toUpperCase(); toast('Código detectado. Ingresa tu nombre y únete.'); }
    }
}

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(id);
    if (screen) screen.classList.add('active');
}

function showConfig() {
    G.playerName = document.getElementById('input-name')?.value.trim() || '';
    if (!G.playerName) { toast('Ingresa tu nombre', 'error'); return; }
    saveProfile();
    showScreen('screen-config');
}

// ============================================
// CONEXIÓN
// ============================================

function createRoom() {
    updateSelectedCategories();
    if (G.selectedCategories.length === 0) { toast('Selecciona al menos una categoría', 'error'); return; }

    G.isHost = true;
    G.hostId = G.myId;
    G.maxPlayers = Math.min(parseInt(document.getElementById('config-max-players')?.value) || 10, 10);
    G.roundTime = parseInt(document.getElementById('config-time')?.value) || 60;
    G.channel = generateCode();
    G.scores = {};
    G.usedWords = [];
    G.isFirstRound = true;
    G.gamePhase = 'lobby';
    
    initPubNub();
}

function joinRoom() {
    G.playerName = document.getElementById('input-name')?.value.trim() || '';
    if (!G.playerName) { toast('Ingresa tu nombre', 'error'); return; }

    const code = (document.getElementById('input-join-code')?.value || '').toUpperCase().trim();
    if (code.length !== 4) { toast('El código debe tener 4 letras', 'error'); return; }

    saveProfile();
    G.isHost = false;
    G.channel = code;
    G.gamePhase = 'lobby';
    initPubNub();
}

function generateCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 4; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    return code;
}

function initPubNub() {
    clearAllTimers();
    if (G.pubnub) { G.pubnub.unsubscribeAll(); G.pubnub = null; }

    G.pubnub = new PubNub({ publishKey: 'demo', subscribeKey: 'demo', userId: G.myId });
    G.pubnub.addListener({ status: onStatus, message: onMessage, presence: onPresence });
    G.pubnub.subscribe({ channels: [G.channel], withPresence: true });
}

function onStatus(status) {
    if (status.category === 'PNConnectedCategory') {
        console.log('Conectado:', G.myId);
        setPlayerState();
        
        const codeDisplay = document.getElementById('display-room-code');
        if (codeDisplay) codeDisplay.textContent = G.channel;
        showScreen('screen-lobby');

        if (G.isHost) {
            const btnDistribute = document.getElementById('btn-distribute');
            if (btnDistribute) btnDistribute.style.display = 'block';
            generateQR();
            setTimeout(() => publishConfig(), 300);
        } else {
            setTimeout(() => requestSync(), 500);
        }

        setTimeout(refreshPlayers, 500);
        G.refreshInterval = setInterval(refreshPlayers, 3000);
        
    } else if (status.error) {
        console.error('Error PubNub:', status);
        toast('Error de conexión', 'error');
    }
}

function onMessage(event) {
    const msg = event.message;
    const sender = event.publisher;

    switch (msg.type) {
        case 'config':
            G.maxPlayers = Math.min(msg.maxPlayers, 10);
            G.roundTime = msg.roundTime;
            G.hostId = msg.hostId;
            G.isHost = (G.myId === G.hostId);
            if (msg.usedWords) G.usedWords = msg.usedWords;
            if (msg.scores) G.scores = msg.scores;
            renderPlayerList();
            break;
        case 'player_state':
            G.players[sender] = { name: msg.name, avatar: msg.avatar, frame: msg.frame };
            if (G.scores[sender] === undefined) G.scores[sender] = 0;
            renderPlayerList();
            break;
        case 'assign': handleAssign(msg); break;
        case 'start_round': handleStartRound(msg); break;
        case 'vote': handleVote(sender, msg.target); break;
        case 'vote_update':
            G.votes = msg.votes;
            G.votedPlayers = new Set(msg.voted);
            if (G.isSpectator) updateSpectatorVotes();
            break;
        case 'results': showResults(msg); break;
        case 'next_round': handleNextRound(msg); break;
        case 'back_to_lobby': handleBackToLobby(msg); break;
        case 'game_over': handleGameOver(msg); break;
        case 'spectator_roles':
            if (G.isSpectator) { G.fullRoles = msg.roles; G.activePlayers = msg.activePlayers || G.activePlayers; updateSpectatorRoles(); }
            break;
        case 'sync_scores': G.scores = msg.scores; renderPlayerList(); break;
        case 'host_disconnect': toast('El host se desconectó', 'error'); setTimeout(exitGame, 2000); break;
        case 'kick_player':
            if (msg.targetId === G.myId) { toast('Has sido expulsado de la sala', 'error'); setTimeout(exitGame, 1500); }
            else { delete G.players[msg.targetId]; delete G.scores[msg.targetId]; renderPlayerList(); toast(msg.targetName + ' fue expulsado', 'info'); }
            break;
        case 'skip_word': handleSkipWord(msg); break;
        case 'request_sync': if (G.isHost) publishFullSync(); break;
        case 'full_sync': handleFullSync(msg); break;
    }
}

function onPresence(event) {
    console.log('Presencia:', event.action, event.uuid);
    
    if (event.action === 'join' && G.isHost && event.uuid !== G.myId) setTimeout(() => publishConfig(), 500);
    
    if (event.action === 'leave' || event.action === 'timeout') {
        if (G.gamePhase === 'lobby' || G.gamePhase === 'home') delete G.players[event.uuid];
        if (G.gamePhase !== 'lobby' && G.gamePhase !== 'home') {
            G.activePlayers = G.activePlayers.filter(id => id !== event.uuid);
            if (!G.eliminated.includes(event.uuid)) G.eliminated.push(event.uuid);
        }
        renderPlayerList();
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
    G.pubnub.publish({ channel: G.channel, message: { type: 'config', maxPlayers: G.maxPlayers, roundTime: G.roundTime, hostId: G.hostId, usedWords: G.usedWords, scores: G.scores } });
}

function requestSync() {
    if (!G.pubnub || G.isHost) return;
    G.pubnub.publish({ channel: G.channel, message: { type: 'request_sync' } });
}

function publishFullSync() {
    if (!G.pubnub || !G.isHost) return;
    G.pubnub.publish({ channel: G.channel, message: { type: 'full_sync', maxPlayers: G.maxPlayers, roundTime: G.roundTime, hostId: G.hostId, usedWords: G.usedWords, scores: G.scores, gamePhase: G.gamePhase, activePlayers: G.activePlayers, eliminated: G.eliminated, fullRoles: G.fullRoles, impostors: G.impostors, charlatans: G.charlatans, citizens: G.citizens } });
}

function handleFullSync(msg) {
    if (G.isHost) return;
    G.maxPlayers = Math.min(msg.maxPlayers || G.maxPlayers, 10);
    G.roundTime = msg.roundTime || G.roundTime;
    G.hostId = msg.hostId || G.hostId;
    G.isHost = (G.myId === G.hostId);
    G.usedWords = msg.usedWords || G.usedWords;
    G.scores = msg.scores || G.scores;
    
    if (msg.gamePhase && msg.gamePhase !== 'lobby' && msg.gamePhase !== 'home') {
        G.gamePhase = msg.gamePhase;
        G.activePlayers = msg.activePlayers || [];
        G.eliminated = msg.eliminated || [];
        G.fullRoles = msg.fullRoles || {};
        G.impostors = msg.impostors || [];
        G.charlatans = msg.charlatans || [];
        G.citizens = msg.citizens || [];
        if (G.eliminated.includes(G.myId)) G.isSpectator = true;
        if (G.fullRoles[G.myId]) G.myRole = G.fullRoles[G.myId];
    }
    renderPlayerList();
}

function generateQR() {
    const container = document.getElementById('qr-container');
    if (!container || typeof qrcode === 'undefined') return;
    const qr = qrcode(0, 'M');
    const url = window.location.href.split('?')[0] + '?room=' + G.channel;
    qr.addData(url);
    qr.make();
    container.innerHTML = qr.createImgTag(4);
}

function refreshPlayers() {
    if (!G.pubnub) return;
    
    G.pubnub.hereNow({ channels: [G.channel], includeState: true }, (status, response) => {
        if (response && response.channels && response.channels[G.channel]) {
            const occupants = response.channels[G.channel].occupants;
            const currentIds = occupants.map(o => o.uuid);
            
            Object.keys(G.players).forEach(id => { if (!currentIds.includes(id)) delete G.players[id]; });

            occupants.forEach(o => {
                if (!G.players[o.uuid]) {
                    G.players[o.uuid] = { name: o.state?.name || o.uuid.substring(0, 8), avatar: o.state?.avatar || 'avatar-11', frame: o.state?.frame || 'fr-basic' };
                } else if (o.state) {
                    G.players[o.uuid].name = o.state.name || G.players[o.uuid].name;
                    G.players[o.uuid].avatar = o.state.avatar || G.players[o.uuid].avatar;
                    G.players[o.uuid].frame = o.state.frame || G.players[o.uuid].frame;
                }
                if (G.scores[o.uuid] === undefined) G.scores[o.uuid] = 0;
            });
            renderPlayerList();
        }
    });
}

// ============================================
// RENDERIZADO
// ============================================

function renderAvatar(avatar, size, frameId) {
    size = size || 40;
    const frame = frameId ? FRAMES.find(f => f.id === frameId) : null;
    const frameStyle = frame ? 'border: 3px solid ' + frame.color + ';' : '';
    
    if (avatar.image) {
        return '<img src="' + avatar.image + '" alt="' + avatar.id + '" style="width:' + size + 'px;height:' + size + 'px;border-radius:50%;object-fit:cover;' + frameStyle + '" onerror="this.outerHTML=\'' + avatar.emoji + '\'">';
    }
    if (frame) {
        return '<span style="display:inline-flex;align-items:center;justify-content:center;width:' + size + 'px;height:' + size + 'px;border-radius:50%;' + frameStyle + 'font-size:' + (size * 0.6) + 'px;">' + avatar.emoji + '</span>';
    }
    return '<span style="font-size:' + (size * 0.6) + 'px;">' + avatar.emoji + '</span>';
}

function renderPlayerAvatar(playerId, size) {
    size = size || 40;
    const p = G.players[playerId];
    const avatar = AVATARS.find(a => a.id === p?.avatar) || AVATARS[0];
    const frameId = p?.frame || 'fr-basic';
    return renderAvatar(avatar, size, frameId);
}

function renderPlayerList() {
    const list = document.getElementById('player-list');
    const countEl = document.getElementById('player-count');
    if (!list) return;
    
    const playerIds = Object.keys(G.players);
    if (countEl) countEl.textContent = playerIds.length + '/' + G.maxPlayers;

    list.innerHTML = playerIds.map(id => {
        const p = G.players[id];
        const isMe = id === G.myId;
        const isHostPlayer = id === G.hostId;
        const score = G.scores[id] || 0;

        // FIX: Mostrar botón kick siempre en lobby (no solo después de un juego)
        const kickBtn = (G.isHost && !isMe && (G.gamePhase === 'lobby' || G.gamePhase === 'home')) 
            ? '<button class="btn-kick" onclick="kickPlayer(\'' + id + '\')" title="Expulsar">✕</button>' 
            : '';

        return '<div class="player-item">' +
            '<div class="player-avatar">' + renderPlayerAvatar(id, 40) + '</div>' +
            '<div class="player-info">' +
            '<div class="player-name">' + p.name + (isMe ? ' (Tú)' : '') + '</div>' +
            (isHostPlayer ? '<div class="player-tag">Host</div>' : '') +
            '</div>' +
            '<div class="player-score">' + score + '</div>' +
            kickBtn +
            '</div>';
    }).join('');
    
    const btnDistribute = document.getElementById('btn-distribute');
    if (btnDistribute) btnDistribute.style.display = G.isHost ? 'block' : 'none';
}

function kickPlayer(playerId) {
    if (!G.isHost || !G.pubnub) return;
    const playerName = G.players[playerId]?.name || 'Jugador';
    if (confirm('¿Expulsar a ' + playerName + ' de la sala?')) {
        G.pubnub.publish({ channel: G.channel, message: { type: 'kick_player', targetId: playerId, targetName: playerName } });
    }
}
window.kickPlayer = kickPlayer;

// ============================================
// LÓGICA DEL JUEGO
// ============================================

function selectNewWord() {
    updateSelectedCategories();
    
    let availableWords = [];
    G.selectedCategories.forEach(cat => {
        DB[cat].forEach(word => { if (!G.usedWords.includes(word)) availableWords.push({ category: cat, word: word }); });
    });

    if (availableWords.length < 2) {
        G.usedWords = [];
        availableWords = [];
        G.selectedCategories.forEach(cat => { DB[cat].forEach(word => { availableWords.push({ category: cat, word: word }); }); });
        toast('Palabras reiniciadas - todas fueron usadas');
    }

    const secretIdx = Math.floor(Math.random() * availableWords.length);
    const secretData = availableWords[secretIdx];
    G.currentCategory = secretData.category;
    G.currentSecretWord = secretData.word;
    G.usedWords.push(G.currentSecretWord);

    const fakeOptions = availableWords.filter(w => w.word !== G.currentSecretWord);
    if (fakeOptions.length > 0) {
        const fakeIdx = Math.floor(Math.random() * fakeOptions.length);
        G.currentFakeWord = fakeOptions[fakeIdx].word;
        G.usedWords.push(G.currentFakeWord);
    } else {
        G.currentFakeWord = "???";
    }

    return { category: G.currentCategory, secretWord: G.currentSecretWord, fakeWord: G.currentFakeWord };
}

function distributeRoles() {
    if (!G.pubnub) return;
    
    const playerIds = Object.keys(G.players);
    if (playerIds.length < 3) { toast('Se necesitan al menos 3 jugadores', 'error'); return; }

    const numImp = Math.min(parseInt(document.getElementById('config-impostors')?.value) || 1, Math.floor(playerIds.length / 2));
    const numChar = Math.min(parseInt(document.getElementById('config-charlatans')?.value) || 0, playerIds.length - numImp - 1);

    updateSelectedCategories();
    if (G.selectedCategories.length === 0) { toast('Selecciona al menos una categoría', 'error'); return; }

    const wordData = selectNewWord();
    let roles = {};
    let pool = [...playerIds];
    
    G.impostors = [];
    G.charlatans = [];
    G.citizens = [];

    for (let i = 0; i < numImp && pool.length; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        const id = pool.splice(idx, 1)[0];
        roles[id] = { role: 'INFILTRADO', icon: '🎭', word: 'Categoría: ' + wordData.category };
        G.impostors.push(id);
    }

    for (let i = 0; i < numChar && pool.length; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        const id = pool.splice(idx, 1)[0];
        roles[id] = { role: 'CHARLATÁN', icon: '🃏', word: wordData.fakeWord };
        G.charlatans.push(id);
    }

    pool.forEach(id => {
        roles[id] = { role: 'CIUDADANO', icon: '🔍', word: wordData.secretWord };
        G.citizens.push(id);
    });

    G.activePlayers = [...playerIds];
    G.eliminated = [];
    G.fullRoles = roles;
    G.gamePhase = 'roles';
    G.isFirstRound = true;
    G.starterPlayerId = G.activePlayers[Math.floor(Math.random() * G.activePlayers.length)];

    G.pubnub.publish({ channel: G.channel, message: { type: 'assign', roles: roles, activePlayers: G.activePlayers, impostors: G.impostors, charlatans: G.charlatans, citizens: G.citizens, hostId: G.hostId, starterPlayerId: G.starterPlayerId, usedWords: G.usedWords, isFirstRound: true } });
}

function skipWord() {
    if (!G.isHost || !G.pubnub) return;

    const wordData = selectNewWord();

    Object.keys(G.fullRoles).forEach(id => {
        const role = G.fullRoles[id];
        if (role.role === 'CIUDADANO') role.word = wordData.secretWord;
        else if (role.role === 'CHARLATÁN') role.word = wordData.fakeWord;
        else if (role.role === 'INFILTRADO') role.word = 'Categoría: ' + wordData.category;
    });

    G.starterPlayerId = G.activePlayers[Math.floor(Math.random() * G.activePlayers.length)];

    G.pubnub.publish({ channel: G.channel, message: { type: 'skip_word', roles: G.fullRoles, activePlayers: G.activePlayers, impostors: G.impostors, charlatans: G.charlatans, citizens: G.citizens, hostId: G.hostId, starterPlayerId: G.starterPlayerId, usedWords: G.usedWords } });
}

function handleSkipWord(msg) {
    G.fullRoles = msg.roles;
    G.starterPlayerId = msg.starterPlayerId;
    G.usedWords = msg.usedWords || G.usedWords;
    if (G.fullRoles[G.myId]) G.myRole = G.fullRoles[G.myId];
    G.roleRevealed = false;
    
    const card = document.getElementById('role-card');
    if (card) card.className = 'role-card blurred';
    
    const roleIcon = document.getElementById('role-icon');
    const roleTitle = document.getElementById('role-title');
    const roleWord = document.getElementById('role-word');
    const roleInst = document.getElementById('role-instruction');
    const starterInfo = document.getElementById('starter-info');
    
    if (roleIcon) roleIcon.textContent = '❓';
    if (roleTitle) roleTitle.textContent = 'SECRETO';
    if (roleWord) roleWord.textContent = '???';
    if (roleInst) roleInst.textContent = 'Toca la carta para revelar';
    
    if (starterInfo) {
        const starterName = G.players[G.starterPlayerId]?.name || 'Alguien';
        starterInfo.textContent = 'Inicia: ' + starterName;
        starterInfo.style.display = 'block';
    }
    
    toast('El host cambió la palabra', 'info');
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

    const myRoleData = msg.roles[G.myId];
    if (myRoleData) {
        G.myRole = myRoleData;

        const card = document.getElementById('role-card');
        const roleIcon = document.getElementById('role-icon');
        const roleTitle = document.getElementById('role-title');
        const roleWord = document.getElementById('role-word');
        const roleInst = document.getElementById('role-instruction');
        const pointsBox = document.getElementById('points-box');
        const timer = document.getElementById('timer');
        const waitMsg = document.getElementById('wait-message');
        const btnStart = document.getElementById('btn-start-round');
        const btnSkip = document.getElementById('btn-skip-word');
        const starterInfo = document.getElementById('starter-info');
        
        if (G.isFirstRound) {
            if (card) card.className = 'role-card blurred';
            if (roleIcon) roleIcon.textContent = '❓';
            if (roleTitle) roleTitle.textContent = 'SECRETO';
            if (roleWord) roleWord.textContent = '???';
            if (roleInst) roleInst.textContent = 'Toca la carta para revelar';
        } else {
            G.roleRevealed = true;
            if (card) {
                card.classList.remove('blurred');
                const roleClass = G.myRole.role === 'INFILTRADO' ? 'impostor' : G.myRole.role === 'CHARLATÁN' ? 'charlatan' : 'citizen';
                card.className = 'role-card ' + roleClass;
            }
            if (roleIcon) roleIcon.textContent = G.myRole.icon;
            if (roleTitle) roleTitle.textContent = G.myRole.role;
            if (roleWord) roleWord.textContent = G.myRole.word;
            if (roleInst) roleInst.textContent = 'Tu rol (ya revelado)';
        }
        
        if (pointsBox) pointsBox.style.display = 'none';
        if (timer) timer.style.display = 'none';
        if (waitMsg) waitMsg.style.display = 'block';
        
        // FIX: Mostrar botones correctamente para el host
        if (btnStart) { btnStart.style.display = G.isHost ? 'block' : 'none'; btnStart.disabled = false; btnStart.textContent = '▶ Iniciar Ronda'; }
        if (btnSkip) btnSkip.style.display = G.isHost ? 'block' : 'none';

        if (starterInfo) {
            const starterName = G.players[G.starterPlayerId]?.name || 'Alguien';
            starterInfo.textContent = 'Inicia: ' + starterName;
            starterInfo.style.display = 'block';
        }

        showScreen('screen-role');
        clearInterval(G.refreshInterval);
    }
}

function revealRole() {
    if (G.roleRevealed) return;
    G.roleRevealed = true;

    const card = document.getElementById('role-card');
    if (card) card.classList.remove('blurred');

    const roleIcon = document.getElementById('role-icon');
    const roleTitle = document.getElementById('role-title');
    const roleWord = document.getElementById('role-word');
    const roleInst = document.getElementById('role-instruction');
    
    if (roleIcon) roleIcon.textContent = G.myRole.icon;
    if (roleTitle) roleTitle.textContent = G.myRole.role;
    if (roleWord) roleWord.textContent = G.myRole.word;
    if (roleInst) roleInst.textContent = 'Memoriza tu información';

    const roleClass = G.myRole.role === 'INFILTRADO' ? 'impostor' : G.myRole.role === 'CHARLATÁN' ? 'charlatan' : 'citizen';
    if (card) card.classList.add(roleClass);

    showPointsReminder();
}

function showPointsReminder() {
    const box = document.getElementById('points-box');
    const list = document.getElementById('points-list');
    if (!box || !list) return;

    let html = '';
    if (G.myRole.role === 'CIUDADANO') {
        html = '<li><span class="points-value positive">+' + POINTS.CITIZEN_SURVIVE + '</span> Sobrevivir la partida</li><li><span class="points-value positive">+' + POINTS.CITIZEN_CORRECT_VOTE + '</span> Votar correctamente</li><li><span class="points-value negative">' + POINTS.CITIZEN_WRONG_VOTE + '</span> Votar incorrectamente</li>';
    } else if (G.myRole.role === 'INFILTRADO') {
        html = '<li><span class="points-value positive">+' + POINTS.IMPOSTOR_WIN + '</span> Ganar la partida</li><li><span class="points-value positive">+' + POINTS.IMPOSTOR_SURVIVE_ROUND + '</span> Sobrevivir cada ronda</li>';
    } else {
        html = '<li><span class="points-value positive">+' + POINTS.CHARLATAN_SURVIVE + '</span> Sobrevivir la partida</li><li><span class="points-value positive">+' + POINTS.CITIZEN_CORRECT_VOTE + '</span> Votar correctamente</li>';
    }
    list.innerHTML = html;
    box.style.display = 'block';
}

// ============================================
// RONDAS Y TIMER
// ============================================

function startRound() {
    if (!G.pubnub || !G.isHost) return;
    if (G.activePlayers.length === 0) { toast('Error: No hay jugadores activos', 'error'); return; }
    
    const btnStart = document.getElementById('btn-start-round');
    const btnSkip = document.getElementById('btn-skip-word');
    const btnSpecNext = document.getElementById('btn-spectator-next');
    
    if (btnStart) { btnStart.disabled = true; btnStart.textContent = '⏳ Iniciando...'; }
    if (btnSkip) btnSkip.style.display = 'none';
    if (btnSpecNext) { btnSpecNext.disabled = true; btnSpecNext.textContent = '⏳ Iniciando...'; }
    
    const newStarter = G.activePlayers[Math.floor(Math.random() * G.activePlayers.length)];
    G.pubnub.publish({ channel: G.channel, message: { type: 'start_round', time: G.roundTime, starterPlayerId: newStarter } });
}

function handleStartRound(msg) {
    clearAllTimers();
    G.starterPlayerId = msg.starterPlayerId;
    G.gamePhase = 'round';
    
    const btnStart = document.getElementById('btn-start-round');
    const btnSkip = document.getElementById('btn-skip-word');
    const btnSpecNext = document.getElementById('btn-spectator-next');
    
    if (btnStart) { btnStart.style.display = 'none'; btnStart.disabled = false; btnStart.textContent = '▶ Iniciar Ronda'; }
    if (btnSkip) btnSkip.style.display = 'none';
    if (btnSpecNext) { btnSpecNext.style.display = 'none'; btnSpecNext.disabled = false; }
    
    const starterName = G.players[G.starterPlayerId]?.name || 'Alguien';
    
    if (G.isSpectator) {
        const specStatus = document.getElementById('spectator-status');
        if (specStatus) specStatus.textContent = '¡' + starterName + ' inicia! Preparando...';
        setTimeout(() => { startSpectatorTimer(msg.time); }, 2000);
        return;
    }
    
    const starterInfo = document.getElementById('starter-info');
    if (starterInfo) { starterInfo.textContent = '¡' + starterName + ' inicia!'; starterInfo.style.display = 'block'; }
    
    setTimeout(() => { if (starterInfo) starterInfo.style.display = 'none'; startTimer(msg.time); }, 2000);
}

function clearAllTimers() {
    if (G.timerInterval) { clearInterval(G.timerInterval); G.timerInterval = null; }
    if (G.voteTimerInterval) { clearInterval(G.voteTimerInterval); G.voteTimerInterval = null; }
    if (G.voteTimeout) { clearTimeout(G.voteTimeout); G.voteTimeout = null; }
    if (G.spectatorTimerInterval) { clearInterval(G.spectatorTimerInterval); G.spectatorTimerInterval = null; }
}

function startTimer(duration) {
    if (G.timerInterval) { clearInterval(G.timerInterval); G.timerInterval = null; }
    
    const timer = document.getElementById('timer');
    const waitMsg = document.getElementById('wait-message');
    const pointsBox = document.getElementById('points-box');
    
    if (timer) { timer.style.display = 'block'; timer.classList.remove('warning'); }
    if (waitMsg) waitMsg.style.display = 'none';
    if (pointsBox) pointsBox.style.display = 'none';

    let remaining = duration;
    updateTimerDisplay(remaining);

    G.timerInterval = setInterval(() => {
        remaining--;
        if (remaining < 0) { clearInterval(G.timerInterval); G.timerInterval = null; return; }
        updateTimerDisplay(remaining);
        if (remaining <= 10 && timer) timer.classList.add('warning');
        if (remaining <= 0) {
            clearInterval(G.timerInterval);
            G.timerInterval = null;
            if (timer) timer.textContent = '¡TIEMPO!';
            if (navigator.vibrate) navigator.vibrate([500, 200, 500]);
            startVoting();
        }
    }, 1000);
}

function startSpectatorTimer(duration) {
    if (G.spectatorTimerInterval) { clearInterval(G.spectatorTimerInterval); G.spectatorTimerInterval = null; }
    
    let remaining = duration;
    const specStatus = document.getElementById('spectator-status');
    
    const updateDisplay = () => {
        const mins = Math.floor(remaining / 60);
        const secs = remaining % 60;
        const timeStr = mins.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0');
        if (specStatus) specStatus.textContent = remaining <= 10 ? '⚠️ Ronda: ' + timeStr : '🎮 Ronda en curso: ' + timeStr;
    };
    
    updateDisplay();
    
    G.spectatorTimerInterval = setInterval(() => {
        remaining--;
        if (remaining < 0) { clearInterval(G.spectatorTimerInterval); G.spectatorTimerInterval = null; if (specStatus) specStatus.textContent = '🗳️ Votación en curso...'; return; }
        updateDisplay();
        if (remaining <= 0) { clearInterval(G.spectatorTimerInterval); G.spectatorTimerInterval = null; if (specStatus) specStatus.textContent = '🗳️ Votación en curso...'; }
    }, 1000);
}

function updateTimerDisplay(seconds) {
    if (seconds < 0) seconds = 0;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const timer = document.getElementById('timer');
    if (timer) timer.textContent = mins.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0');
}

// ============================================
// VOTACIÓN
// ============================================

function startVoting() {
    if (G.timerInterval) { clearInterval(G.timerInterval); G.timerInterval = null; }
    
    if (G.isSpectator) {
        const specStatus = document.getElementById('spectator-status');
        if (specStatus) specStatus.textContent = '🗳️ Votación en curso...';
        showScreen('screen-spectator');
        return;
    }

    G.gamePhase = 'voting';
    G.votes = {};
    G.votedPlayers = new Set();
    G.voteTargets = {};

    showScreen('screen-voting');
    renderVotingList();
    startVoteTimer(30);

    if (G.isHost) {
        if (G.voteTimeout) clearTimeout(G.voteTimeout);
        G.voteTimeout = setTimeout(() => publishResults(), 32000);
    }
}

function renderVotingList() {
    const list = document.getElementById('voting-list');
    if (!list) return;
    
    const votable = G.activePlayers.filter(id => id !== G.myId && !G.eliminated.includes(id));

    list.innerHTML = votable.map(id => {
        const p = G.players[id];
        return '<div class="vote-item"><div class="player-avatar">' + renderPlayerAvatar(id, 40) + '</div><div class="player-info"><div class="player-name">' + (p?.name || id) + '</div></div><button class="btn-vote" data-target="' + id + '">Votar</button></div>';
    }).join('');

    list.querySelectorAll('.btn-vote').forEach(btn => { btn.onclick = () => sendVote(btn.dataset.target, btn); });
}

function startVoteTimer(seconds) {
    if (G.voteTimerInterval) { clearInterval(G.voteTimerInterval); G.voteTimerInterval = null; }
    
    let remaining = seconds;
    const display = document.getElementById('vote-timer');
    if (display) display.textContent = '00:' + remaining.toString().padStart(2, '0');

    G.voteTimerInterval = setInterval(() => {
        remaining--;
        if (remaining < 0) { clearInterval(G.voteTimerInterval); G.voteTimerInterval = null; return; }
        if (display) display.textContent = '00:' + remaining.toString().padStart(2, '0');
        if (remaining <= 0) { clearInterval(G.voteTimerInterval); G.voteTimerInterval = null; }
    }, 1000);
}

function sendVote(targetId, button) {
    if (!G.pubnub) return;
    if (G.eliminated.includes(targetId) || !G.activePlayers.includes(targetId)) { toast('Jugador no válido', 'error'); return; }

    G.pubnub.publish({ channel: G.channel, message: { type: 'vote', target: targetId } });

    button.classList.add('voted');
    button.textContent = 'Votado ✓';
    button.disabled = true;
    document.querySelectorAll('.btn-vote').forEach(btn => btn.disabled = true);
    
    const voteStatus = document.getElementById('vote-status');
    if (voteStatus) voteStatus.textContent = 'Voto registrado. Esperando...';
}

function handleVote(voterId, targetId) {
    if (!G.activePlayers.includes(targetId) || G.eliminated.includes(targetId)) return;
    if (!G.activePlayers.includes(voterId)) return;
    if (G.votedPlayers.has(voterId)) return;
    if (voterId === targetId) return;

    G.votes[targetId] = (G.votes[targetId] || 0) + 1;
    G.votedPlayers.add(voterId);
    G.voteTargets[voterId] = targetId;

    if (G.isHost && G.pubnub) {
        G.pubnub.publish({ channel: G.channel, message: { type: 'vote_update', votes: G.votes, voted: Array.from(G.votedPlayers) } });
        if (G.votedPlayers.size >= G.activePlayers.length) {
            if (G.voteTimeout) { clearTimeout(G.voteTimeout); G.voteTimeout = null; }
            setTimeout(() => publishResults(), 500);
        }
    }
    if (G.isSpectator) updateSpectatorVotes();
}

function publishResults() {
    if (!G.pubnub) return;
    clearAllTimers();

    let maxVotes = 0;
    let mostVoted = [];

    Object.entries(G.votes).forEach(([id, count]) => {
        if (count > maxVotes) { maxVotes = count; mostVoted = [id]; }
        else if (count === maxVotes) mostVoted.push(id);
    });

    const isTie = mostVoted.length > 1 || maxVotes === 0;
    let eliminatedId = null;
    let eliminatedRole = null;

    if (!isTie) {
        eliminatedId = mostVoted[0];
        G.eliminated.push(eliminatedId);
        G.activePlayers = G.activePlayers.filter(id => id !== eliminatedId);

        if (G.impostors.includes(eliminatedId)) { eliminatedRole = 'INFILTRADO'; G.impostors = G.impostors.filter(id => id !== eliminatedId); }
        else if (G.charlatans.includes(eliminatedId)) { eliminatedRole = 'CHARLATÁN'; G.charlatans = G.charlatans.filter(id => id !== eliminatedId); }
        else { eliminatedRole = 'CIUDADANO'; G.citizens = G.citizens.filter(id => id !== eliminatedId); }

        Object.entries(G.voteTargets).forEach(([voterId, targetId]) => {
            if (targetId === eliminatedId) {
                if (eliminatedRole === 'INFILTRADO') G.scores[voterId] = (G.scores[voterId] || 0) + POINTS.CITIZEN_CORRECT_VOTE;
                else if (!G.impostors.includes(voterId)) G.scores[voterId] = (G.scores[voterId] || 0) + POINTS.CITIZEN_WRONG_VOTE;
            }
        });
        G.impostors.forEach(id => { G.scores[id] = (G.scores[id] || 0) + POINTS.IMPOSTOR_SURVIVE_ROUND; });
    }

    G.pubnub.publish({ channel: G.channel, message: { type: 'results', votes: G.votes, eliminatedId: eliminatedId, eliminatedName: eliminatedId ? G.players[eliminatedId]?.name : null, eliminatedRole: eliminatedRole, isTie: isTie, scores: G.scores, activePlayers: G.activePlayers, impostors: G.impostors, fullRoles: G.fullRoles } });
    G.pubnub.publish({ channel: G.channel, message: { type: 'spectator_roles', roles: G.fullRoles, activePlayers: G.activePlayers } });

    setTimeout(() => checkGameOver(), RESULT_DISPLAY_TIME);
}

function showResults(msg) {
    clearAllTimers();
    G.votes = msg.votes;
    G.scores = msg.scores || G.scores;
    G.activePlayers = msg.activePlayers;
    G.impostors = msg.impostors;

    if (msg.eliminatedId && !G.eliminated.includes(msg.eliminatedId)) G.eliminated.push(msg.eliminatedId);

    if (msg.eliminatedId === G.myId) {
        G.isSpectator = true;
        G.fullRoles = msg.fullRoles || G.fullRoles;
        showScreen('screen-spectator');
        const specStatus = document.getElementById('spectator-status');
        if (specStatus) specStatus.textContent = 'Fuiste eliminado (' + msg.eliminatedRole + '). Ahora observas.';
        updateSpectatorRoles();
        if (G.isHost) {
            const btnNext = document.getElementById('btn-spectator-next');
            const btnLobby = document.getElementById('btn-spectator-lobby');
            if (btnNext) { btnNext.style.display = 'block'; btnNext.disabled = false; btnNext.textContent = '▶ Siguiente Ronda'; }
            if (btnLobby) btnLobby.style.display = 'block';
        }
        return;
    }

    if (G.isSpectator) {
        const specStatus = document.getElementById('spectator-status');
        if (specStatus) specStatus.textContent = msg.isTie ? 'Empate - nadie eliminado' : msg.eliminatedName + ' eliminado (' + msg.eliminatedRole + ')';
        updateSpectatorRoles();
        if (G.isHost) {
            const btnNext = document.getElementById('btn-spectator-next');
            if (btnNext) { btnNext.style.display = 'block'; btnNext.disabled = false; btnNext.textContent = '▶ Siguiente Ronda'; }
        }
        return;
    }

    showScreen('screen-results');
    G.gamePhase = 'results';

    const resultsList = document.getElementById('results-list');
    if (resultsList) {
        const voteEntries = Object.entries(msg.votes);
        const maxVotes = voteEntries.length > 0 ? Math.max(...Object.values(msg.votes), 1) : 1;

        resultsList.innerHTML = voteEntries.map(([id, count]) => {
            const name = G.players[id]?.name || id;
            const pct = (count / maxVotes) * 100;
            return '<div class="result-item"><div class="result-header"><span class="result-name">' + name + '</span><span class="result-votes">' + count + ' votos</span></div><div class="result-bar"><div class="result-bar-fill" style="width: ' + pct + '%"></div></div></div>';
        }).join('');
    }

    const elimBox = document.getElementById('eliminated-box');
    if (elimBox) {
        if (msg.isTie) {
            elimBox.innerHTML = '<div class="eliminated-icon">⚖️</div><div class="eliminated-name">EMPATE</div><div class="eliminated-role">Nadie fue eliminado</div>';
        } else {
            const icon = msg.eliminatedRole === 'INFILTRADO' ? '🎭' : msg.eliminatedRole === 'CHARLATÁN' ? '🃏' : '🔍';
            elimBox.innerHTML = '<div class="eliminated-icon">' + icon + '</div><div class="eliminated-name">' + msg.eliminatedName + '</div><div class="eliminated-role">Era ' + msg.eliminatedRole + '</div>';
        }
    }

    const btnNext = document.getElementById('btn-next-round');
    const btnLobby = document.getElementById('btn-back-lobby');
    if (btnNext) { btnNext.style.display = 'none'; btnNext.disabled = false; btnNext.textContent = '▶ Siguiente Ronda'; }
    if (btnLobby) btnLobby.style.display = 'none';
    
    if (G.isHost) setTimeout(() => { if (btnNext) btnNext.style.display = 'block'; }, RESULT_DISPLAY_TIME);
}

// ============================================
// SIGUIENTE RONDA
// ============================================

function nextRound() {
    if (!G.pubnub || !G.isHost) return;
    
    const btnNext = document.getElementById('btn-next-round');
    const btnSpecNext = document.getElementById('btn-spectator-next');
    
    if (btnNext) { btnNext.disabled = true; btnNext.textContent = '⏳ Preparando...'; }
    if (btnSpecNext) { btnSpecNext.disabled = true; btnSpecNext.textContent = '⏳ Preparando...'; }

    G.pubnub.publish({ channel: G.channel, message: { type: 'next_round', activePlayers: G.activePlayers, fullRoles: G.fullRoles } });
}

function spectatorNextAction() {
    const btnSpecNext = document.getElementById('btn-spectator-next');
    if (!btnSpecNext || !G.isHost) return;
    
    const btnText = btnSpecNext.textContent;
    if (btnText.includes('Iniciar')) startRound();
    else nextRound();
}

function handleNextRound(msg) {
    clearAllTimers();
    G.votes = {};
    G.votedPlayers = new Set();
    G.voteTargets = {};
    G.isFirstRound = false;
    G.gamePhase = 'roles';
    
    if (msg && msg.activePlayers) G.activePlayers = msg.activePlayers;
    if (msg && msg.fullRoles) { G.fullRoles = msg.fullRoles; if (G.fullRoles[G.myId]) G.myRole = G.fullRoles[G.myId]; }

    if (G.isSpectator) {
        const specStatus = document.getElementById('spectator-status');
        const btnSpecNext = document.getElementById('btn-spectator-next');
        if (specStatus) specStatus.textContent = 'Esperando que el host inicie la ronda...';
        if (btnSpecNext) { btnSpecNext.style.display = 'none'; btnSpecNext.disabled = false; }
        if (G.isHost && btnSpecNext) { btnSpecNext.textContent = '▶ Iniciar Ronda'; btnSpecNext.style.display = 'block'; btnSpecNext.disabled = false; }
        showScreen('screen-spectator');
        updateSpectatorRoles();
        return;
    }

    const card = document.getElementById('role-card');
    const roleIcon = document.getElementById('role-icon');
    const roleTitle = document.getElementById('role-title');
    const roleWord = document.getElementById('role-word');
    const roleInst = document.getElementById('role-instruction');
    const pointsBox = document.getElementById('points-box');
    const timer = document.getElementById('timer');
    const waitMsg = document.getElementById('wait-message');
    const starterInfo = document.getElementById('starter-info');
    const btnStart = document.getElementById('btn-start-round');
    const btnSkip = document.getElementById('btn-skip-word');
    
    G.roleRevealed = true;
    
    if (card) {
        const roleClass = G.myRole.role === 'INFILTRADO' ? 'impostor' : G.myRole.role === 'CHARLATÁN' ? 'charlatan' : 'citizen';
        card.className = 'role-card ' + roleClass;
    }
    if (roleIcon) roleIcon.textContent = G.myRole.icon;
    if (roleTitle) roleTitle.textContent = G.myRole.role;
    if (roleWord) roleWord.textContent = G.myRole.word;
    if (roleInst) roleInst.textContent = 'Tu rol (ya conocido)';
    if (pointsBox) pointsBox.style.display = 'none';
    if (timer) { timer.style.display = 'none'; timer.classList.remove('warning'); }
    if (waitMsg) waitMsg.style.display = 'block';
    if (starterInfo) starterInfo.style.display = 'none';
    if (btnStart) { btnStart.style.display = G.isHost ? 'block' : 'none'; btnStart.disabled = false; btnStart.textContent = '▶ Iniciar Ronda'; }
    if (btnSkip) btnSkip.style.display = G.isHost ? 'block' : 'none';

    showScreen('screen-role');
}

function checkGameOver() {
    if (!G.isHost || !G.pubnub) return;

    let winner = null;
    let reason = '';

    if (G.impostors.length === 0) {
        winner = 'CIUDADANOS';
        reason = 'Todos los infiltrados eliminados';
        G.citizens.forEach(id => { if (G.activePlayers.includes(id)) G.scores[id] = (G.scores[id] || 0) + POINTS.CITIZEN_SURVIVE; });
        G.charlatans.forEach(id => { if (G.activePlayers.includes(id)) G.scores[id] = (G.scores[id] || 0) + POINTS.CHARLATAN_SURVIVE; });
    } else if (G.activePlayers.length - G.impostors.length <= G.impostors.length) {
        winner = 'INFILTRADOS';
        reason = 'Los infiltrados dominan';
        G.impostors.forEach(id => { G.scores[id] = (G.scores[id] || 0) + POINTS.IMPOSTOR_WIN; });
    }

    if (winner) {
        G.pubnub.publish({ channel: G.channel, message: { type: 'game_over', winner: winner, reason: reason, scores: G.scores, roles: G.fullRoles } });
    }
}

function handleGameOver(msg) {
    clearAllTimers();
    G.gamePhase = 'gameover';
    G.scores = msg.scores || G.scores;
    G.fullRoles = msg.roles || G.fullRoles;

    showScreen('screen-gameover');

    const isImpostorWin = msg.winner === 'INFILTRADOS';
    const goTitle = document.getElementById('gameover-title');
    const goReason = document.getElementById('gameover-reason');
    const goIcon = document.getElementById('gameover-icon');
    
    if (goTitle) goTitle.textContent = '¡' + msg.winner + ' GANAN!';
    if (goReason) goReason.textContent = msg.reason;
    if (goIcon) goIcon.textContent = isImpostorWin ? '🎭' : '🔍';

    const scoresList = document.getElementById('final-scores');
    if (scoresList) {
        const sorted = Object.entries(G.scores).sort((a, b) => b[1] - a[1]);
        scoresList.innerHTML = sorted.map(([id, score], idx) => {
            const p = G.players[id];
            const role = G.fullRoles[id];
            const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '';
            return '<div class="score-item"><div class="score-rank">' + (medal || (idx + 1)) + '</div><div class="score-info"><div class="score-name">' + (p?.name || id) + '</div><div class="score-role">' + (role?.role || '') + '</div></div><div class="score-points">' + score + '</div></div>';
        }).join('');
    }

    const btnBackLobby = document.getElementById('btn-back-to-lobby');
    if (btnBackLobby) btnBackLobby.style.display = 'block';
}

// ============================================
// VOLVER AL LOBBY
// ============================================

function backToLobby() {
    if (G.isHost && G.pubnub) {
        G.pubnub.publish({ channel: G.channel, message: { type: 'back_to_lobby', scores: G.scores, hostId: G.hostId, usedWords: G.usedWords } });
    }
    resetGameState();
    showScreen('screen-lobby');
    const btnDistribute = document.getElementById('btn-distribute');
    if (btnDistribute) btnDistribute.style.display = G.isHost ? 'block' : 'none';
    G.refreshInterval = setInterval(refreshPlayers, 3000);
    refreshPlayers();
}

function handleBackToLobby(msg) {
    clearAllTimers();
    G.scores = msg.scores || G.scores;
    G.hostId = msg.hostId || G.hostId;
    G.isHost = (G.myId === G.hostId);
    G.usedWords = msg.usedWords || G.usedWords;
    resetGameState();
    showScreen('screen-lobby');
    const btnDistribute = document.getElementById('btn-distribute');
    if (btnDistribute) btnDistribute.style.display = G.isHost ? 'block' : 'none';
    G.refreshInterval = setInterval(refreshPlayers, 3000);
    refreshPlayers();
}

function resetGameState() {
    clearAllTimers();
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
}

// ============================================
// ESPECTADOR
// ============================================

function updateSpectatorRoles() {
    const list = document.getElementById('spectator-roles');
    if (!list) return;
    
    if (!G.fullRoles || Object.keys(G.fullRoles).length === 0) {
        list.innerHTML = '<div class="player-item"><div class="player-info"><div class="player-name">Cargando roles...</div></div></div>';
        return;
    }

    list.innerHTML = Object.entries(G.fullRoles).map(([id, role]) => {
        const p = G.players[id];
        const isActive = G.activePlayers.includes(id);
        return '<div class="player-item" style="opacity: ' + (isActive ? 1 : 0.5) + '"><div class="player-avatar">' + renderPlayerAvatar(id, 36) + '</div><div class="player-info"><div class="player-name">' + (p?.name || id) + '</div><div class="player-tag">' + role.role + ' - ' + role.word + '</div></div><span>' + (isActive ? '✅' : '❌') + '</span></div>';
    }).join('');
}

function updateSpectatorVotes() {
    const list = document.getElementById('spectator-votes');
    if (!list) return;

    list.innerHTML = G.activePlayers.map(id => {
        const p = G.players[id];
        const votes = G.votes[id] || 0;
        const hasVoted = G.votedPlayers.has(id);
        return '<div class="player-item"><div class="player-avatar">' + renderPlayerAvatar(id, 36) + '</div><div class="player-info"><div class="player-name">' + (p?.name || id) + '</div><div class="player-tag">' + (hasVoted ? 'Ha votado' : 'Pendiente') + '</div></div><span>' + votes + ' votos</span></div>';
    }).join('');
}

// ============================================
// UTILIDADES
// ============================================

function leaveRoom() {
    if (confirm('¿Abandonar la sala?')) exitGame();
}

function exitGame() {
    clearAllTimers();
    clearInterval(G.refreshInterval);
    G.refreshInterval = null;

    if (G.isHost && G.pubnub) G.pubnub.publish({ channel: G.channel, message: { type: 'host_disconnect' } });
    if (G.pubnub) { G.pubnub.unsubscribeAll(); G.pubnub = null; }

    G.channel = null;
    G.isHost = false;
    G.hostId = null;
    G.players = {};
    G.scores = {};
    G.usedWords = [];
    resetGameState();
    showScreen('screen-home');
}

function toast(message, type) {
    type = type || 'info';
    const container = document.getElementById('toast-container');
    if (!container) return;
    const t = document.createElement('div');
    t.className = 'toast ' + type;
    t.textContent = message;
    container.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

window.G = G;
console.log('game.js v0.9.8.3 cargado correctamente');
