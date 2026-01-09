/**
 * INFILTRA - Game Logic
 * v1.0.0
 */

// ============================================
// CONFIGURACIÓN Y CONSTANTES
// ============================================

const CONFIG = {
    PUBNUB_PUB_KEY: 'demo',
    PUBNUB_SUB_KEY: 'demo',
    VOTE_TIME: 30,
    MIN_PLAYERS: 3
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
    "Animales 🦁": ["León", "Tigre", "Elefante", "Cebra", "Delfín", "Lobo", "Gorila", "Águila", "Jirafa", "Hipopótamo", "Rinoceronte", "Cocodrilo", "Serpiente", "Mono", "Tortuga", "Conejo", "Gato", "Perro", "Caballo", "Oso", "Zorro", "Panda", "Koala", "Canguro"],
    "Comida 🍕": ["Pizza", "Tacos", "Sushi", "Hamburguesa", "Pasta", "Ensalada", "Pastel", "Helado", "Sopa", "Arroz", "Pollo", "Carne", "Pescado", "Pan", "Queso", "Chocolate", "Galletas", "Cereal", "Tortilla", "Empanada"],
    "Países 🌎": ["México", "Japón", "Brasil", "España", "Francia", "Italia", "Canadá", "Egipto", "China", "India", "Alemania", "Australia", "Argentina", "Chile", "Perú", "Colombia", "Portugal", "Grecia", "Noruega", "Suecia"],
    "Profesiones 👨‍⚕️": ["Médico", "Abogado", "Ingeniero", "Profesor", "Policía", "Bombero", "Chef", "Actor", "Cantante", "Piloto", "Arquitecto", "Dentista", "Veterinario", "Electricista", "Mecánico", "Periodista", "Fotógrafo", "Diseñador", "Programador"],
    "Deportes ⚽": ["Fútbol", "Baloncesto", "Tenis", "Natación", "Boxeo", "Ciclismo", "Golf", "Voleibol", "Béisbol", "Surf", "Karate", "Gimnasia", "Hockey", "Patinaje", "Arquería", "Esquí", "Snowboard"],
    "Ciudades 🏙️": ["París", "Tokio", "Nueva York", "Londres", "Roma", "Berlín", "Madrid", "Sídney", "Dubai", "Singapur", "Toronto", "Los Ángeles", "Miami", "Barcelona", "Ámsterdam", "Viena", "Praga"],
    "Frutas 🍎": ["Manzana", "Banana", "Naranja", "Uva", "Fresa", "Piña", "Mango", "Sandía", "Melón", "Kiwi", "Pera", "Cereza", "Limón", "Durazno", "Papaya", "Coco", "Granada"],
    "Vehículos 🚗": ["Coche", "Bicicleta", "Motocicleta", "Avión", "Barco", "Tren", "Autobús", "Helicóptero", "Submarino", "Cohete", "Patineta", "Yate", "Camión", "Ambulancia"],
    "Instrumentos 🎸": ["Guitarra", "Piano", "Batería", "Violín", "Flauta", "Trompeta", "Saxofón", "Bajo", "Arpa", "Acordeón", "Ukelele", "Xilófono", "Tambor", "Órgano"],
    "Películas 🎥": ["Titanic", "Star Wars", "Avatar", "Frozen", "Toy Story", "Shrek", "Batman", "Spider-Man", "Avengers", "Joker", "Coco", "El Rey León", "Matrix", "Jurassic Park"]
};

// Avatares placeholder (se reemplazan con imágenes reales)
const AVATARS = [
    { id: 'avatar-1', emoji: '🕵️', name: 'Detective 1' },
    { id: 'avatar-2', emoji: '🕵️‍♀️', name: 'Detective 2' },
    { id: 'avatar-3', emoji: '👤', name: 'Agente 1' },
    { id: 'avatar-4', emoji: '👩', name: 'Agente 2' },
    { id: 'avatar-5', emoji: '🧑', name: 'Agente 3' },
    { id: 'avatar-6', emoji: '👨', name: 'Agente 4' },
    { id: 'avatar-7', emoji: '👩‍💼', name: 'Agente 5' },
    { id: 'avatar-8', emoji: '👨‍💼', name: 'Agente 6' },
    { id: 'avatar-9', emoji: '🥷', name: 'Ninja' },
    { id: 'avatar-10', emoji: '🦸', name: 'Héroe' }
];

const FRAMES = [
    { id: 'frame-basic', name: 'Básico', color: '#4a5568', locked: false },
    { id: 'frame-gold', name: 'Dorado', color: '#c9a227', locked: true },
    { id: 'frame-premium', name: 'Premium', color: '#8b2635', locked: true },
    { id: 'frame-special', name: 'Especial', color: '#7c3aed', locked: true }
];

// ============================================
// ESTADO DEL JUEGO
// ============================================

let state = {
    // Conexión
    pubnub: null,
    channel: null,
    myId: 'P-' + Math.floor(Math.random() * 999999),
    
    // Jugador
    playerName: '',
    selectedAvatar: 'avatar-1',
    selectedFrame: 'frame-basic',
    
    // Sala
    isHost: false,
    maxPlayers: 10,
    roomLocked: false,
    
    // Jugadores
    players: [],
    playersMap: {},
    playersData: {},
    activePlayers: [],
    eliminated: [],
    
    // Roles
    impostors: [],
    charlatans: [],
    citizens: [],
    myRole: null,
    fullRoles: {},
    
    // Configuración partida
    roundTime: 60,
    selectedCategories: Object.keys(DB),
    
    // Estado del juego
    gamePhase: 'lobby',
    isSpectator: false,
    votes: {},
    votedPlayers: new Set(),
    scores: {},
    
    // Timers
    timerInterval: null,
    voteTimerInterval: null,
    refreshInterval: null,
    voteTimeout: null,
    
    // Audio
    soundEnabled: true,
    
    // UI
    previousScreen: 'screen-home',
    roleRevealed: false
};

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    initAvatars();
    initFrames();
    initCategories();
    initSoundToggle();
    checkURLParams();
});

function loadProfile() {
    const savedName = localStorage.getItem('infiltra_name');
    const savedAvatar = localStorage.getItem('infiltra_avatar');
    const savedFrame = localStorage.getItem('infiltra_frame');
    
    if (savedName) {
        document.getElementById('input-name').value = savedName;
        state.playerName = savedName;
    }
    if (savedAvatar) state.selectedAvatar = savedAvatar;
    if (savedFrame) state.selectedFrame = savedFrame;
}

function saveProfile() {
    localStorage.setItem('infiltra_name', state.playerName);
    localStorage.setItem('infiltra_avatar', state.selectedAvatar);
    localStorage.setItem('infiltra_frame', state.selectedFrame);
}

function initAvatars() {
    const grid = document.getElementById('avatar-grid');
    grid.innerHTML = '';
    
    AVATARS.forEach(avatar => {
        const div = document.createElement('div');
        div.className = 'avatar-option' + (avatar.id === state.selectedAvatar ? ' selected' : '');
        div.innerHTML = `<span class="avatar-placeholder">${avatar.emoji}</span>`;
        div.onclick = () => selectAvatar(avatar.id);
        div.dataset.id = avatar.id;
        grid.appendChild(div);
    });
}

function selectAvatar(id) {
    state.selectedAvatar = id;
    document.querySelectorAll('.avatar-option').forEach(el => {
        el.classList.toggle('selected', el.dataset.id === id);
    });
    playSound('click');
}

function initFrames() {
    const grid = document.getElementById('frame-grid');
    grid.innerHTML = '';
    
    FRAMES.forEach(frame => {
        const div = document.createElement('div');
        div.className = 'frame-option' + 
            (frame.id === state.selectedFrame ? ' selected' : '') +
            (frame.locked ? ' locked' : '');
        div.style.borderColor = frame.color;
        div.innerHTML = frame.locked ? '' : `<div style="width:30px;height:30px;border-radius:50%;border:3px solid ${frame.color}"></div>`;
        div.onclick = () => !frame.locked && selectFrame(frame.id);
        div.dataset.id = frame.id;
        grid.appendChild(div);
    });
}

function selectFrame(id) {
    state.selectedFrame = id;
    document.querySelectorAll('.frame-option').forEach(el => {
        el.classList.toggle('selected', el.dataset.id === id);
    });
    playSound('click');
}

function initCategories() {
    const list = document.getElementById('categories-list');
    list.innerHTML = '';
    
    Object.keys(DB).forEach(cat => {
        const div = document.createElement('div');
        div.className = 'category-item';
        div.innerHTML = `
            <input type="checkbox" id="cat-${cat}" checked value="${cat}">
            <label for="cat-${cat}">${cat}</label>
        `;
        div.querySelector('input').onchange = updateSelectedCategories;
        list.appendChild(div);
    });
}

function toggleAllCategories(select) {
    document.querySelectorAll('.category-item input').forEach(cb => cb.checked = select);
    updateSelectedCategories();
}

function updateSelectedCategories() {
    state.selectedCategories = Array.from(
        document.querySelectorAll('.category-item input:checked')
    ).map(cb => cb.value);
}

function initSoundToggle() {
    const btn = document.getElementById('btn-sound');
    btn.onclick = () => {
        state.soundEnabled = !state.soundEnabled;
        btn.textContent = state.soundEnabled ? '🔊' : '🔇';
        btn.classList.toggle('muted', !state.soundEnabled);
    };
}

function checkURLParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('room')) {
        document.getElementById('input-join-code').value = params.get('room').toUpperCase();
        showToast('Código de sala detectado. Ingresa tu nombre y únete.');
    }
}

// ============================================
// NAVEGACIÓN
// ============================================

function showScreen(screenId) {
    state.previousScreen = document.querySelector('.screen.active')?.id || 'screen-home';
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function goBack() {
    showScreen(state.previousScreen);
}

function showHostConfig() {
    state.playerName = document.getElementById('input-name').value.trim();
    if (!state.playerName) {
        showToast('Ingresa tu nombre', 'error');
        return;
    }
    saveProfile();
    showScreen('screen-host-config');
}

// ============================================
// CONEXIÓN Y SALAS
// ============================================

function createRoom() {
    state.isHost = true;
    state.maxPlayers = parseInt(document.getElementById('config-max-players').value) || 10;
    state.roundTime = parseInt(document.getElementById('config-time').value) || 60;
    
    const numImp = parseInt(document.getElementById('config-impostors').value) || 1;
    const numChar = parseInt(document.getElementById('config-charlatans').value) || 0;
    
    if (state.selectedCategories.length === 0) {
        showToast('Selecciona al menos una categoría', 'error');
        return;
    }
    
    state.channel = generateRoomCode();
    initPubNub();
}

function joinRoom() {
    state.playerName = document.getElementById('input-name').value.trim();
    if (!state.playerName) {
        showToast('Ingresa tu nombre', 'error');
        return;
    }
    
    const code = document.getElementById('input-join-code').value.toUpperCase().trim();
    if (code.length !== 4) {
        showToast('El código debe tener 4 letras', 'error');
        return;
    }
    
    saveProfile();
    state.isHost = false;
    state.channel = code;
    initPubNub();
}

function generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

function initPubNub() {
    state.pubnub = new PubNub({
        publishKey: CONFIG.PUBNUB_PUB_KEY,
        subscribeKey: CONFIG.PUBNUB_SUB_KEY,
        userId: state.myId
    });

    state.pubnub.addListener({
        status: handlePubNubStatus,
        message: handlePubNubMessage,
        presence: handlePubNubPresence
    });

    state.pubnub.subscribe({
        channels: [state.channel],
        withPresence: true
    });
}

function handlePubNubStatus(status) {
    if (status.category === 'PNConnectedCategory') {
        console.log('Conectado a PubNub');
        setPlayerState();
        showScreen('screen-lobby');
        document.getElementById('display-room-code').textContent = state.channel;
        
        if (state.isHost) {
            document.getElementById('btn-start-game').style.display = 'block';
            generateQR();
            publishConfig();
        }
        
        setTimeout(updatePlayersList, 500);
        state.refreshInterval = setInterval(updatePlayersList, 3000);
        
    } else if (status.error) {
        console.error('Error PubNub:', status);
        showToast('Error de conexión', 'error');
    }
}

function handlePubNubMessage(event) {
    const msg = event.message;
    
    switch(msg.type) {
        case 'config':
            state.maxPlayers = msg.maxPlayers;
            state.roundTime = msg.roundTime;
            break;
            
        case 'assign':
            handleAssignRoles(msg);
            break;
            
        case 'start_round':
            if (!state.isSpectator) {
                startLocalTimer(msg.time);
                state.gamePhase = 'round';
            }
            break;
            
        case 'vote':
            handleVote(event.publisher, msg.target);
            break;
            
        case 'vote_update':
            if (state.isSpectator) {
                state.votes = msg.votes;
                state.votedPlayers = new Set(msg.votedPlayers);
                updateSpectatorVotes();
            }
            break;
            
        case 'results':
            showResults(msg);
            break;
            
        case 'next_round':
            handleNextRound();
            break;
            
        case 'game_over':
            handleGameOver(msg);
            break;
            
        case 'restart':
            location.reload();
            break;
            
        case 'player_left':
            handlePlayerLeft(msg.playerId);
            break;
            
        case 'spectator_roles':
            if (state.isSpectator) {
                state.fullRoles = msg.roles;
                updateSpectatorRoles();
            }
            break;
            
        case 'host_disconnect':
            showToast('El host se desconectó', 'error');
            setTimeout(exitGame, 2000);
            break;
    }
}

function handlePubNubPresence(event) {
    console.log('Presencia:', event.action, event.uuid);
    setTimeout(updatePlayersList, 300);
    
    if (event.action === 'leave' || event.action === 'timeout') {
        if (event.uuid !== state.myId) {
            handlePlayerLeft(event.uuid);
        }
    }
}

function setPlayerState() {
    state.pubnub.setState({
        state: { 
            name: state.playerName,
            avatar: state.selectedAvatar,
            frame: state.selectedFrame
        },
        channels: [state.channel]
    });
}

function publishConfig() {
    state.pubnub.publish({
        channel: state.channel,
        message: { 
            type: 'config', 
            maxPlayers: state.maxPlayers,
            roundTime: state.roundTime
        }
    });
}

function generateQR() {
    const container = document.getElementById('qr-container');
    const qr = qrcode(0, 'M');
    const url = window.location.origin + window.location.pathname.replace('game.html', '') + 'game.html?room=' + state.channel;
    qr.addData(url);
    qr.make();
    container.innerHTML = qr.createImgTag(4);
}

function updatePlayersList() {
    state.pubnub.hereNow({
        channels: [state.channel],
        includeState: true
    }, (status, response) => {
        if (response && response.channels && response.channels[state.channel]) {
            const occupants = response.channels[state.channel].occupants;
            
            state.players = occupants.map(o => o.uuid);
            state.playersMap = {};
            state.playersData = {};
            
            occupants.forEach(o => {
                state.playersMap[o.uuid] = o.state?.name || o.uuid;
                state.playersData[o.uuid] = {
                    name: o.state?.name || o.uuid,
                    avatar: o.state?.avatar || 'avatar-1',
                    frame: o.state?.frame || 'frame-basic'
                };
            });
            
            renderPlayerList();
        }
    });
}

function renderPlayerList() {
    const list = document.getElementById('player-list');
    const countEl = document.getElementById('player-count');
    
    countEl.textContent = `${state.players.length}/${state.maxPlayers}`;
    
    list.innerHTML = state.players.map(id => {
        const data = state.playersData[id] || { name: id, avatar: 'avatar-1' };
        const avatar = AVATARS.find(a => a.id === data.avatar) || AVATARS[0];
        const isMe = id === state.myId;
        const isHost = state.players[0] === id;
        
        return `
            <div class="player-item">
                <div class="player-avatar">
                    <span style="font-size: 1.5rem;">${avatar.emoji}</span>
                </div>
                <div class="player-info">
                    <div class="player-name">${data.name}${isMe ? ' (Tú)' : ''}</div>
                    ${isHost ? '<div class="player-tag">Host</div>' : ''}
                </div>
                ${state.scores[id] !== undefined ? `<div class="player-score">${state.scores[id]}</div>` : ''}
            </div>
        `;
    }).join('');
}

function handlePlayerLeft(playerId) {
    state.players = state.players.filter(id => id !== playerId);
    delete state.playersMap[playerId];
    delete state.playersData[playerId];
    
    if (state.gamePhase !== 'lobby') {
        if (state.activePlayers.includes(playerId)) {
            state.activePlayers = state.activePlayers.filter(id => id !== playerId);
            if (!state.eliminated.includes(playerId)) {
                state.eliminated.push(playerId);
            }
        }
    }
    
    renderPlayerList();
}

function leaveRoom() {
    if (confirm('¿Seguro que quieres abandonar la sala?')) {
        if (state.pubnub) {
            state.pubnub.publish({
                channel: state.channel,
                message: { type: 'player_left', playerId: state.myId }
            });
        }
        setTimeout(exitGame, 300);
    }
}

function exitGame() {
    clearAllIntervals();
    
    if (state.isHost && state.pubnub) {
        state.pubnub.publish({
            channel: state.channel,
            message: { type: 'host_disconnect' }
        });
    }
    
    if (state.pubnub) {
        state.pubnub.unsubscribeAll();
    }
    
    // Reset state
    state.pubnub = null;
    state.channel = null;
    state.isHost = false;
    state.gamePhase = 'lobby';
    state.isSpectator = false;
    state.players = [];
    state.activePlayers = [];
    state.eliminated = [];
    state.votes = {};
    state.votedPlayers = new Set();
    state.scores = {};
    state.roleRevealed = false;
    
    showScreen('screen-home');
}

// ============================================
// LÓGICA DEL JUEGO
// ============================================

function distributeRoles() {
    if (state.players.length < CONFIG.MIN_PLAYERS) {
        showToast(`Se necesitan al menos ${CONFIG.MIN_PLAYERS} jugadores`, 'error');
        return;
    }

    const numImp = parseInt(document.getElementById('config-impostors').value) || 1;
    const numChar = parseInt(document.getElementById('config-charlatans').value) || 0;

    if (numImp + numChar >= state.players.length) {
        showToast('Demasiados roles especiales para la cantidad de jugadores', 'error');
        return;
    }

    // Seleccionar categoría y palabras
    const category = state.selectedCategories[Math.floor(Math.random() * state.selectedCategories.length)];
    const words = [...DB[category]];
    const secretWord = words.splice(Math.floor(Math.random() * words.length), 1)[0];
    const fakeWord = words[Math.floor(Math.random() * words.length)];

    // Asignar roles
    let roles = {};
    let pool = [...state.players];
    
    state.impostors = [];
    state.charlatans = [];
    state.citizens = [];

    // Impostores
    for (let i = 0; i < numImp && pool.length; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        const id = pool.splice(idx, 1)[0];
        roles[id] = { role: 'INFILTRADO', icon: '🎭', word: `Categoría: ${category}` };
        state.impostors.push(id);
    }

    // Charlatanes
    for (let i = 0; i < numChar && pool.length; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        const id = pool.splice(idx, 1)[0];
        roles[id] = { role: 'CHARLATÁN', icon: '🃏', word: fakeWord };
        state.charlatans.push(id);
    }

    // Ciudadanos
    pool.forEach(id => {
        roles[id] = { role: 'CIUDADANO', icon: '🔍', word: secretWord };
        state.citizens.push(id);
    });

    state.activePlayers = [...state.players];
    state.fullRoles = roles;
    
    // Inicializar puntuaciones
    state.players.forEach(id => {
        if (state.scores[id] === undefined) {
            state.scores[id] = 0;
        }
    });

    state.pubnub.publish({
        channel: state.channel,
        message: { 
            type: 'assign', 
            roles: roles, 
            activePlayers: state.activePlayers,
            scores: state.scores
        }
    });

    playSound('notification');
}

function handleAssignRoles(msg) {
    state.activePlayers = msg.activePlayers || [];
    state.scores = msg.scores || {};
    
    const myRoleData = msg.roles[state.myId];
    if (myRoleData) {
        state.myRole = myRoleData;
        state.roleRevealed = false;
        state.gamePhase = 'roles';
        
        // Reset UI de la carta
        const card = document.getElementById('role-card');
        card.className = 'role-card-game';
        card.style.filter = 'blur(15px)';
        document.getElementById('role-icon').textContent = '❓';
        document.getElementById('role-title').textContent = 'SECRETO';
        document.getElementById('role-word').textContent = '???';
        document.getElementById('role-instruction').textContent = 'Toca para revelar tu rol';
        document.getElementById('points-reminder').style.display = 'none';
        document.getElementById('timer-display').style.display = 'none';
        
        // Botones
        document.getElementById('btn-start-round').style.display = state.isHost ? 'block' : 'none';
        document.getElementById('wait-message').style.display = state.isHost ? 'none' : 'block';
        
        showScreen('screen-role');
    }
}

function revealRole() {
    if (state.roleRevealed) return;
    state.roleRevealed = true;
    
    const card = document.getElementById('role-card');
    card.style.filter = 'none';
    
    document.getElementById('role-icon').textContent = state.myRole.icon;
    document.getElementById('role-title').textContent = state.myRole.role;
    document.getElementById('role-word').textContent = state.myRole.word;
    document.getElementById('role-instruction').textContent = 'Memoriza tu información';
    
    // Añadir clase según rol
    const roleClass = state.myRole.role === 'INFILTRADO' ? 'impostor' : 
                      state.myRole.role === 'CHARLATÁN' ? 'charlatan' : 'citizen';
    card.classList.add(roleClass, 'revealed');
    
    // Mostrar recordatorio de puntos
    showPointsReminder();
    
    playSound('reveal');
}

function showPointsReminder() {
    const container = document.getElementById('points-reminder');
    const list = document.getElementById('points-list');
    
    let pointsHTML = '';
    
    if (state.myRole.role === 'CIUDADANO') {
        pointsHTML = `
            <li><span class="points positive">+${POINTS.CITIZEN_SURVIVE}</span> Sobrevivir la partida</li>
            <li><span class="points positive">+${POINTS.CITIZEN_CORRECT_VOTE}</span> Votar correctamente al infiltrado</li>
            <li><span class="points negative">${POINTS.CITIZEN_WRONG_VOTE}</span> Votar a otro ciudadano</li>
        `;
    } else if (state.myRole.role === 'INFILTRADO') {
        pointsHTML = `
            <li><span class="points positive">+${POINTS.IMPOSTOR_WIN}</span> Ganar la partida</li>
            <li><span class="points positive">+${POINTS.IMPOSTOR_SURVIVE_ROUND}</span> Por cada ronda que sobrevivas</li>
        `;
    } else {
        pointsHTML = `
            <li><span class="points positive">+${POINTS.CHARLATAN_SURVIVE}</span> Sobrevivir la partida</li>
            <li><span class="points positive">+${POINTS.CITIZEN_CORRECT_VOTE}</span> Votar correctamente al infiltrado</li>
        `;
    }
    
    list.innerHTML = pointsHTML;
    container.style.display = 'block';
}

function startRound() {
    state.pubnub.publish({
        channel: state.channel,
        message: { type: 'start_round', time: state.roundTime }
    });
    
    document.getElementById('btn-start-round').style.display = 'none';
    playSound('start');
}

function startLocalTimer(duration) {
    document.getElementById('timer-display').style.display = 'block';
    document.getElementById('wait-message').style.display = 'none';
    document.getElementById('points-reminder').style.display = 'none';
    
    let remaining = duration;
    updateTimerDisplay(remaining);
    
    state.timerInterval = setInterval(() => {
        remaining--;
        updateTimerDisplay(remaining);
        
        if (remaining <= 10) {
            document.getElementById('timer-display').classList.add('warning');
            if (remaining <= 5) playSound('tick');
        }
        
        if (remaining <= 0) {
            clearInterval(state.timerInterval);
            document.getElementById('timer-display').textContent = '¡TIEMPO!';
            playSound('timeout');
            if (navigator.vibrate) navigator.vibrate([500, 200, 500]);
            startVoting();
        }
    }, 1000);
}

function updateTimerDisplay(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    document.getElementById('timer-display').textContent = 
        `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ============================================
// VOTACIÓN
// ============================================

function startVoting() {
    if (state.isSpectator) {
        showScreen('screen-spectator');
        return;
    }

    state.gamePhase = 'voting';
    state.votes = {};
    state.votedPlayers = new Set();
    
    showScreen('screen-voting');
    renderVotingList();
    startVoteTimer();
    
    if (state.isHost) {
        state.voteTimeout = setTimeout(publishResults, CONFIG.VOTE_TIME * 1000);
    }
}

function renderVotingList() {
    const list = document.getElementById('voting-list');
    const votable = state.activePlayers.filter(id => id !== state.myId && !state.eliminated.includes(id));
    
    list.innerHTML = votable.map(id => {
        const data = state.playersData[id] || { name: id };
        const avatar = AVATARS.find(a => a.id === data.avatar) || AVATARS[0];
        
        return `
            <div class="vote-item">
                <div class="player-avatar">
                    <span style="font-size: 1.5rem;">${avatar.emoji}</span>
                </div>
                <div class="player-info">
                    <div class="player-name">${data.name}</div>
                </div>
                <button class="btn-vote" data-target="${id}" onclick="sendVote('${id}', this)">
                    Votar
                </button>
            </div>
        `;
    }).join('');
}

function startVoteTimer() {
    let remaining = CONFIG.VOTE_TIME;
    const display = document.getElementById('vote-timer');
    
    state.voteTimerInterval = setInterval(() => {
        remaining--;
        display.textContent = `00:${remaining.toString().padStart(2, '0')}`;
        
        if (remaining <= 0) {
            clearInterval(state.voteTimerInterval);
        }
    }, 1000);
}

function sendVote(targetId, button) {
    if (state.eliminated.includes(targetId) || !state.activePlayers.includes(targetId)) {
        showToast('Jugador no válido', 'error');
        return;
    }
    
    state.pubnub.publish({
        channel: state.channel,
        message: { type: 'vote', target: targetId }
    });
    
    button.classList.add('voted');
    button.textContent = 'Votado ✓';
    button.disabled = true;
    
    document.querySelectorAll('.btn-vote').forEach(btn => btn.disabled = true);
    document.getElementById('vote-status').textContent = 'Voto registrado. Esperando resultados...';
    
    playSound('vote');
}

function handleVote(voterId, targetId) {
    if (!state.isHost && !state.isSpectator) return;
    
    if (!state.activePlayers.includes(targetId) || state.eliminated.includes(targetId)) {
        console.log('Voto inválido rechazado');
        return;
    }
    
    state.votes[targetId] = (state.votes[targetId] || 0) + 1;
    state.votedPlayers.add(voterId);
    
    if (state.isHost) {
        // Broadcast vote update
        state.pubnub.publish({
            channel: state.channel,
            message: { 
                type: 'vote_update', 
                votes: state.votes,
                votedPlayers: Array.from(state.votedPlayers)
            }
        });
        
        // Check if all voted
        if (state.votedPlayers.size >= state.activePlayers.length) {
            clearTimeout(state.voteTimeout);
            setTimeout(publishResults, 500);
        }
    }
    
    if (state.isSpectator) {
        updateSpectatorVotes();
    }
}

function publishResults() {
    clearInterval(state.voteTimerInterval);
    
    let maxVotes = 0;
    let mostVoted = [];
    
    Object.entries(state.votes).forEach(([id, count]) => {
        if (count > maxVotes) {
            maxVotes = count;
            mostVoted = [id];
        } else if (count === maxVotes) {
            mostVoted.push(id);
        }
    });
    
    const isTie = mostVoted.length > 1 || maxVotes === 0;
    let eliminatedId = null;
    let eliminatedRole = null;
    
    if (!isTie) {
        eliminatedId = mostVoted[0];
        state.eliminated.push(eliminatedId);
        state.activePlayers = state.activePlayers.filter(id => id !== eliminatedId);
        
        // Determinar rol y calcular puntos
        if (state.impostors.includes(eliminatedId)) {
            eliminatedRole = 'INFILTRADO';
            state.impostors = state.impostors.filter(id => id !== eliminatedId);
            
            // Puntos por votar correctamente
            state.votedPlayers.forEach(voterId => {
                if (state.votes[eliminatedId] && !state.impostors.includes(voterId)) {
                    // Verificar si este jugador votó al eliminado (simplificado)
                    state.scores[voterId] = (state.scores[voterId] || 0) + POINTS.CITIZEN_CORRECT_VOTE;
                }
            });
        } else if (state.charlatans.includes(eliminatedId)) {
            eliminatedRole = 'CHARLATÁN';
            state.charlatans = state.charlatans.filter(id => id !== eliminatedId);
        } else {
            eliminatedRole = 'CIUDADANO';
            state.citizens = state.citizens.filter(id => id !== eliminatedId);
            
            // Penalización por votar ciudadano
            state.votedPlayers.forEach(voterId => {
                if (!state.impostors.includes(voterId)) {
                    state.scores[voterId] = (state.scores[voterId] || 0) + POINTS.CITIZEN_WRONG_VOTE;
                }
            });
        }
        
        // Puntos para impostores que sobreviven
        state.impostors.forEach(id => {
            state.scores[id] = (state.scores[id] || 0) + POINTS.IMPOSTOR_SURVIVE_ROUND;
        });
    }
    
    state.pubnub.publish({
        channel: state.channel,
        message: {
            type: 'results',
            votes: state.votes,
            eliminatedId,
            eliminatedRole,
            eliminatedName: eliminatedId ? state.playersMap[eliminatedId] : null,
            isTie,
            scores: state.scores,
            activePlayers: state.activePlayers
        }
    });
    
    // Publicar roles a espectadores
    state.pubnub.publish({
        channel: state.channel,
        message: { type: 'spectator_roles', roles: state.fullRoles }
    });
    
    setTimeout(() => checkGameOver(), 1000);
}

function showResults(msg) {
    state.votes = msg.votes;
    state.scores = msg.scores || state.scores;
    state.activePlayers = msg.activePlayers || state.activePlayers;
    
    if (msg.eliminatedId && !state.eliminated.includes(msg.eliminatedId)) {
        state.eliminated.push(msg.eliminatedId);
    }
    
    // Verificar si yo fui eliminado
    if (msg.eliminatedId === state.myId) {
        state.isSpectator = true;
        showScreen('screen-spectator');
        document.getElementById('spectator-status').textContent = 
            `Has sido eliminado (${msg.eliminatedRole}). Ahora observas el juego.`;
        return;
    }
    
    if (state.isSpectator) {
        document.getElementById('spectator-status').textContent = msg.isTie ? 
            'Empate en la votación' : 
            `${msg.eliminatedName} fue eliminado (${msg.eliminatedRole})`;
        
        if (state.isHost) {
            document.getElementById('btn-spectator-next').style.display = 'block';
        }
        return;
    }
    
    // Mostrar pantalla de resultados
    showScreen('screen-results');
    state.gamePhase = 'results';
    
    // Renderizar resultados
    const resultsList = document.getElementById('results-list');
    const maxVotes = Math.max(...Object.values(msg.votes), 1);
    
    resultsList.innerHTML = Object.entries(msg.votes).map(([id, count]) => {
        const name = state.playersMap[id] || id;
        const percentage = (count / maxVotes) * 100;
        
        return `
            <div class="result-item">
                <div class="result-header">
                    <span class="result-name">${name}</span>
                    <span class="result-votes">${count} votos</span>
                </div>
                <div class="result-bar">
                    <div class="result-bar-fill" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    }).join('');
    
    // Mostrar eliminado
    const eliminatedDiv = document.getElementById('result-eliminated');
    if (msg.isTie) {
        eliminatedDiv.innerHTML = `
            <div style="font-size: 3rem;">⚖️</div>
            <div class="result-eliminated-name">EMPATE</div>
            <div class="result-eliminated-role">Nadie fue eliminado esta ronda</div>
        `;
    } else {
        const icon = msg.eliminatedRole === 'INFILTRADO' ? '🎭' : 
                    msg.eliminatedRole === 'CHARLATÁN' ? '🃏' : '🔍';
        eliminatedDiv.innerHTML = `
            <div style="font-size: 3rem;">${icon}</div>
            <div class="result-eliminated-name">${msg.eliminatedName}</div>
            <div class="result-eliminated-role">Era ${msg.eliminatedRole}</div>
        `;
    }
    
    // Mostrar botón siguiente ronda si es host
    document.getElementById('btn-next-round').style.display = state.isHost ? 'block' : 'none';
    
    playSound('results');
}

// ============================================
// CONTROL DE RONDAS Y FIN DE JUEGO
// ============================================

function nextRound() {
    document.getElementById('btn-next-round').style.display = 'none';
    document.getElementById('btn-spectator-next').style.display = 'none';
    
    state.pubnub.publish({
        channel: state.channel,
        message: { type: 'next_round' }
    });
}

function handleNextRound() {
    state.votes = {};
    state.votedPlayers = new Set();
    state.roleRevealed = false;
    
    clearInterval(state.timerInterval);
    clearInterval(state.voteTimerInterval);
    
    if (state.isSpectator) {
        document.getElementById('spectator-status').textContent = 'Nueva ronda en progreso...';
        document.getElementById('btn-spectator-next').style.display = 'none';
        
        if (state.isHost) {
            // Host espectador puede iniciar ronda
            // TODO: Agregar control para esto
        }
        return;
    }
    
    // Reset UI
    const card = document.getElementById('role-card');
    card.style.filter = 'blur(15px)';
    card.className = 'role-card-game';
    document.getElementById('role-icon').textContent = '❓';
    document.getElementById('role-title').textContent = 'SECRETO';
    document.getElementById('role-word').textContent = '???';
    document.getElementById('role-instruction').textContent = 'Toca para revelar tu rol';
    document.getElementById('points-reminder').style.display = 'none';
    document.getElementById('timer-display').style.display = 'none';
    document.getElementById('timer-display').classList.remove('warning');
    
    document.getElementById('btn-start-round').style.display = state.isHost ? 'block' : 'none';
    document.getElementById('wait-message').style.display = state.isHost ? 'none' : 'block';
    
    state.gamePhase = 'roles';
    showScreen('screen-role');
}

function checkGameOver() {
    let winner = null;
    let reason = '';
    
    if (state.impostors.length === 0) {
        winner = 'CIUDADANOS';
        reason = 'Todos los infiltrados han sido eliminados';
        
        // Puntos para ciudadanos sobrevivientes
        state.citizens.forEach(id => {
            state.scores[id] = (state.scores[id] || 0) + POINTS.CITIZEN_SURVIVE;
        });
        state.charlatans.forEach(id => {
            if (state.activePlayers.includes(id)) {
                state.scores[id] = (state.scores[id] || 0) + POINTS.CHARLATAN_SURVIVE;
            }
        });
    } else if (state.activePlayers.length - state.impostors.length <= state.impostors.length) {
        winner = 'INFILTRADOS';
        reason = 'Los infiltrados dominan la partida';
        
        // Puntos para impostores
        state.impostors.forEach(id => {
            state.scores[id] = (state.scores[id] || 0) + POINTS.IMPOSTOR_WIN;
        });
    }
    
    if (winner) {
        state.pubnub.publish({
            channel: state.channel,
            message: { 
                type: 'game_over', 
                winner, 
                reason,
                scores: state.scores,
                roles: state.fullRoles
            }
        });
    }
}

function handleGameOver(msg) {
    state.gamePhase = 'gameover';
    state.scores = msg.scores || state.scores;
    state.fullRoles = msg.roles || state.fullRoles;
    
    showScreen('screen-gameover');
    
    const isImpostorWin = msg.winner === 'INFILTRADOS';
    document.getElementById('gameover-title').textContent = 
        `¡${msg.winner} ganan!`;
    document.getElementById('gameover-subtitle').textContent = msg.reason;
    document.getElementById('gameover-icon').textContent = isImpostorWin ? '🎭' : '🔍';
    document.getElementById('gameover-reason').textContent = msg.reason;
    
    // Mostrar puntuaciones finales
    const scoresList = document.getElementById('final-scores');
    const sortedPlayers = Object.entries(state.scores)
        .sort((a, b) => b[1] - a[1]);
    
    scoresList.innerHTML = sortedPlayers.map(([id, score], index) => {
        const name = state.playersMap[id] || id;
        const role = state.fullRoles[id];
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
        
        return `
            <div class="player-item">
                <div class="player-info">
                    <div class="player-name">${medal} ${name}</div>
                    <div class="player-tag">${role?.role || 'Jugador'}</div>
                </div>
                <div class="player-score">${score}</div>
            </div>
        `;
    }).join('');
    
    document.getElementById('btn-restart').style.display = state.isHost ? 'block' : 'none';
    
    playSound(isImpostorWin ? 'lose' : 'win');
}

function restartGame() {
    state.pubnub.publish({
        channel: state.channel,
        message: { type: 'restart' }
    });
}

// ============================================
// ESPECTADOR
// ============================================

function updateSpectatorRoles() {
    const list = document.getElementById('spectator-roles');
    
    list.innerHTML = Object.entries(state.fullRoles).map(([id, role]) => {
        const name = state.playersMap[id] || id;
        const isActive = state.activePlayers.includes(id);
        
        return `
            <div class="player-item" style="opacity: ${isActive ? 1 : 0.5}">
                <div class="player-info">
                    <div class="player-name">${name}</div>
                    <div class="player-tag">${role.role} - ${role.word}</div>
                </div>
                <span>${isActive ? '✅' : '❌'}</span>
            </div>
        `;
    }).join('');
}

function updateSpectatorVotes() {
    const list = document.getElementById('spectator-votes');
    
    list.innerHTML = state.activePlayers.map(id => {
        const name = state.playersMap[id] || id;
        const votes = state.votes[id] || 0;
        const hasVoted = state.votedPlayers.has(id);
        
        return `
            <div class="player-item">
                <div class="player-info">
                    <div class="player-name">${name}</div>
                    <div class="player-tag">${hasVoted ? 'Ha votado' : 'Pendiente'}</div>
                </div>
                <span>${votes} votos</span>
            </div>
        `;
    }).join('');
}

// ============================================
// UTILIDADES
// ============================================

function clearAllIntervals() {
    clearInterval(state.timerInterval);
    clearInterval(state.voteTimerInterval);
    clearInterval(state.refreshInterval);
    clearTimeout(state.voteTimeout);
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}

function playSound(soundName) {
    if (!state.soundEnabled) return;
    
    // Los sonidos se cargarán desde assets/sounds/
    // Por ahora usamos Audio API básica
    const sounds = {
        click: 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgA',
        notification: null,
        reveal: null,
        start: null,
        tick: null,
        timeout: null,
        vote: null,
        results: null,
        win: null,
        lose: null
    };
    
    // Placeholder - implementar carga de sonidos reales
    console.log('Sound:', soundName);
}

// ============================================
// EXPORTAR PARA DEBUG
// ============================================

window.gameState = state;
window.showScreen = showScreen;
