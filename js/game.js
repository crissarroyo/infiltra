/**
 * INFILTRA - Game Logic v2.0
 * Con correcciones de bugs y puntuación histórica
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
    "Animales 🦁": ["León", "Tigre", "Elefante", "Cebra", "Delfín", "Lobo", "Gorila", "Águila", "Jirafa", "Oso", "Zorro", "Panda"],
    "Comida 🍕": ["Pizza", "Tacos", "Sushi", "Hamburguesa", "Pasta", "Ensalada", "Helado", "Pollo", "Pescado", "Chocolate"],
    "Países 🌎": ["México", "Japón", "Brasil", "España", "Francia", "Italia", "Alemania", "Australia", "Argentina", "Canadá"],
    "Profesiones 👨‍⚕️": ["Médico", "Abogado", "Ingeniero", "Profesor", "Chef", "Piloto", "Arquitecto", "Programador", "Fotógrafo"],
    "Deportes ⚽": ["Fútbol", "Baloncesto", "Tenis", "Natación", "Boxeo", "Golf", "Voleibol", "Surf", "Ciclismo"],
    "Ciudades 🏙️": ["París", "Tokio", "Nueva York", "Londres", "Roma", "Berlín", "Madrid", "Dubai", "Barcelona"],
    "Frutas 🍎": ["Manzana", "Banana", "Naranja", "Uva", "Fresa", "Piña", "Mango", "Sandía", "Kiwi"],
    "Vehículos 🚗": ["Coche", "Bicicleta", "Avión", "Barco", "Tren", "Helicóptero", "Motocicleta", "Camión"],
    "Instrumentos 🎸": ["Guitarra", "Piano", "Batería", "Violín", "Flauta", "Trompeta", "Saxofón", "Arpa"],
    "Películas 🎥": ["Titanic", "Star Wars", "Avatar", "Frozen", "Shrek", "Batman", "Avengers", "Coco"]
};

const AVATARS = [
    { id: 'av-1', emoji: '🕵️' }, { id: 'av-2', emoji: '🕵️‍♀️' },
    { id: 'av-3', emoji: '👤' }, { id: 'av-4', emoji: '👩' },
    { id: 'av-5', emoji: '🧑' }, { id: 'av-6', emoji: '👨' },
    { id: 'av-7', emoji: '👩‍💼' }, { id: 'av-8', emoji: '👨‍💼' },
    { id: 'av-9', emoji: '🥷' }, { id: 'av-10', emoji: '🦸' }
];

const FRAMES = [
    { id: 'fr-basic', color: '#4a5568', locked: false },
    { id: 'fr-gold', color: '#c9a227', locked: true },
    { id: 'fr-red', color: '#8b2635', locked: true },
    { id: 'fr-purple', color: '#7c3aed', locked: true }
];

// ============================================
// ESTADO GLOBAL
// ============================================

let G = {
    pubnub: null,
    channel: null,
    myId: null,
    playerName: '',
    avatar: 'av-1',
    frame: 'fr-basic',
    isHost: false,
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
    
    gamePhase: 'home',
    isSpectator: false,
    votes: {},
    votedPlayers: new Set(),
    voteTargets: {},
    
    timerInterval: null,
    voteTimerInterval: null,
    refreshInterval: null,
    voteTimeout: null,
    
    soundEnabled: true,
    previousScreen: 'screen-home',
    roleRevealed: false
};

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', init);

function init() {
    // ID único persistente por sesión de navegador
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
}

function loadProfile() {
    const name = localStorage.getItem('infiltra_name');
    const avatar = localStorage.getItem('infiltra_avatar');
    const frame = localStorage.getItem('infiltra_frame');
    
    if (name) {
        document.getElementById('input-name').value = name;
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

function initAvatars() {
    const grid = document.getElementById('avatar-grid');
    grid.innerHTML = AVATARS.map(a => 
        `<div class="avatar-option ${a.id === G.avatar ? 'selected' : ''}" data-id="${a.id}">${a.emoji}</div>`
    ).join('');

    grid.addEventListener('click', e => {
        const opt = e.target.closest('.avatar-option');
        if (opt) {
            G.avatar = opt.dataset.id;
            grid.querySelectorAll('.avatar-option').forEach(el => el.classList.remove('selected'));
            opt.classList.add('selected');
        }
    });
}

function initFrames() {
    const grid = document.getElementById('frame-grid');
    grid.innerHTML = FRAMES.map(f => 
        `<div class="frame-option ${f.id === G.frame ? 'selected' : ''} ${f.locked ? 'locked' : ''}" 
             data-id="${f.id}" style="border-color: ${f.color}">
            ${!f.locked ? `<div style="width:24px;height:24px;border-radius:50%;border:3px solid ${f.color}"></div>` : ''}
        </div>`
    ).join('');

    grid.addEventListener('click', e => {
        const opt = e.target.closest('.frame-option');
        if (opt && !opt.classList.contains('locked')) {
            G.frame = opt.dataset.id;
            grid.querySelectorAll('.frame-option').forEach(el => el.classList.remove('selected'));
            opt.classList.add('selected');
        }
    });
}

function initCategories() {
    const list = document.getElementById('categories-list');
    list.innerHTML = Object.keys(DB).map(cat => 
        `<div class="category-item">
            <input type="checkbox" id="cat-${cat}" value="${cat}" checked>
            <label for="cat-${cat}">${cat}</label>
        </div>`
    ).join('');
}

function updateSelectedCategories() {
    G.selectedCategories = Array.from(
        document.querySelectorAll('.category-item input:checked')
    ).map(cb => cb.value);
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
    // Navegación
    document.getElementById('btn-show-config').onclick = showConfig;
    document.getElementById('btn-back-home').onclick = () => showScreen('screen-home');
    document.getElementById('btn-join-room').onclick = joinRoom;
    document.getElementById('btn-create-room').onclick = createRoom;
    document.getElementById('btn-leave-room').onclick = leaveRoom;
    document.getElementById('btn-distribute').onclick = distributeRoles;
    document.getElementById('btn-start-round').onclick = startRound;
    document.getElementById('btn-next-round').onclick = nextRound;
    document.getElementById('btn-back-lobby').onclick = backToLobby;
    document.getElementById('btn-back-to-lobby').onclick = backToLobby;
    document.getElementById('btn-exit-game').onclick = exitGame;
    document.getElementById('btn-spectator-next').onclick = nextRound;
    document.getElementById('btn-spectator-lobby').onclick = backToLobby;
    
    // Carta de rol
    document.getElementById('role-card').onclick = revealRole;
    
    // Categorías
    document.getElementById('btn-cat-all').onclick = () => {
        document.querySelectorAll('.category-item input').forEach(cb => cb.checked = true);
        updateSelectedCategories();
    };
    document.getElementById('btn-cat-none').onclick = () => {
        document.querySelectorAll('.category-item input').forEach(cb => cb.checked = false);
        updateSelectedCategories();
    };

    // Sonido
    document.getElementById('btn-sound').onclick = () => {
        G.soundEnabled = !G.soundEnabled;
        document.getElementById('btn-sound').textContent = G.soundEnabled ? '🔊' : '🔇';
        document.getElementById('btn-sound').classList.toggle('muted', !G.soundEnabled);
    };

    // Ayuda - CORREGIDO
    document.getElementById('btn-help').onclick = () => {
        G.previousScreen = document.querySelector('.screen.active').id;
        showScreen('screen-help');
    };
    document.getElementById('btn-help-back').onclick = () => {
        showScreen(G.previousScreen || 'screen-home');
    };
}

function checkURLParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('room')) {
        document.getElementById('input-join-code').value = params.get('room').toUpperCase();
        toast('Código detectado. Ingresa tu nombre y únete.');
    }
}

// ============================================
// NAVEGACIÓN
// ============================================

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function showConfig() {
    G.playerName = document.getElementById('input-name').value.trim();
    if (!G.playerName) {
        toast('Ingresa tu nombre', 'error');
        return;
    }
    saveProfile();
    showScreen('screen-config');
}

// ============================================
// CONEXIÓN
// ============================================

function createRoom() {
    updateSelectedCategories();
    if (G.selectedCategories.length === 0) {
        toast('Selecciona al menos una categoría', 'error');
        return;
    }

    G.isHost = true;
    G.maxPlayers = parseInt(document.getElementById('config-max-players').value) || 10;
    G.roundTime = parseInt(document.getElementById('config-time').value) || 60;
    G.channel = generateCode();
    G.scores = {}; // Reset scores para nueva sala
    
    initPubNub();
}

function joinRoom() {
    G.playerName = document.getElementById('input-name').value.trim();
    if (!G.playerName) {
        toast('Ingresa tu nombre', 'error');
        return;
    }

    const code = document.getElementById('input-join-code').value.toUpperCase().trim();
    if (code.length !== 4) {
        toast('El código debe tener 4 letras', 'error');
        return;
    }

    saveProfile();
    G.isHost = false;
    G.channel = code;
    initPubNub();
}

function generateCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

function initPubNub() {
    // Limpiar conexión anterior
    if (G.pubnub) {
        G.pubnub.unsubscribeAll();
        G.pubnub = null;
    }

    G.pubnub = new PubNub({
        publishKey: 'demo',
        subscribeKey: 'demo',
        userId: G.myId
    });

    G.pubnub.addListener({
        status: onStatus,
        message: onMessage,
        presence: onPresence
    });

    G.pubnub.subscribe({
        channels: [G.channel],
        withPresence: true
    });
}

function onStatus(status) {
    if (status.category === 'PNConnectedCategory') {
        console.log('Conectado:', G.myId);
        setPlayerState();
        
        document.getElementById('display-room-code').textContent = G.channel;
        showScreen('screen-lobby');

        if (G.isHost) {
            document.getElementById('btn-distribute').style.display = 'block';
            generateQR();
            publishConfig();
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
            if (!G.isHost) {
                G.maxPlayers = msg.maxPlayers;
                G.roundTime = msg.roundTime;
            }
            break;

        case 'player_state':
            G.players[sender] = {
                name: msg.name,
                avatar: msg.avatar,
                frame: msg.frame
            };
            if (G.scores[sender] === undefined) {
                G.scores[sender] = 0;
            }
            renderPlayerList();
            break;

        case 'assign':
            handleAssign(msg);
            break;

        case 'start_round':
            if (!G.isSpectator) {
                startTimer(msg.time);
                G.gamePhase = 'round';
            }
            break;

        case 'vote':
            handleVote(sender, msg.target);
            break;

        case 'vote_update':
            G.votes = msg.votes;
            G.votedPlayers = new Set(msg.voted);
            if (G.isSpectator) updateSpectatorVotes();
            break;

        case 'results':
            showResults(msg);
            break;

        case 'next_round':
            handleNextRound();
            break;

        case 'back_to_lobby':
            handleBackToLobby(msg);
            break;

        case 'game_over':
            handleGameOver(msg);
            break;

        case 'spectator_roles':
            if (G.isSpectator) {
                G.fullRoles = msg.roles;
                updateSpectatorRoles();
            }
            break;

        case 'sync_scores':
            G.scores = msg.scores;
            renderPlayerList();
            break;

        case 'host_disconnect':
            toast('El host se desconectó', 'error');
            setTimeout(exitGame, 2000);
            break;
    }
}

function onPresence(event) {
    console.log('Presencia:', event.action, event.uuid);
    
    if (event.action === 'leave' || event.action === 'timeout') {
        delete G.players[event.uuid];
        
        if (G.gamePhase !== 'lobby' && G.gamePhase !== 'home') {
            G.activePlayers = G.activePlayers.filter(id => id !== event.uuid);
            if (!G.eliminated.includes(event.uuid)) {
                G.eliminated.push(event.uuid);
            }
        }
        
        renderPlayerList();
    }

    setTimeout(refreshPlayers, 500);
}

function setPlayerState() {
    G.pubnub.setState({
        state: {
            name: G.playerName,
            avatar: G.avatar,
            frame: G.frame
        },
        channels: [G.channel]
    });

    G.pubnub.publish({
        channel: G.channel,
        message: {
            type: 'player_state',
            name: G.playerName,
            avatar: G.avatar,
            frame: G.frame
        }
    });
}

function publishConfig() {
    G.pubnub.publish({
        channel: G.channel,
        message: {
            type: 'config',
            maxPlayers: G.maxPlayers,
            roundTime: G.roundTime
        }
    });
}

function generateQR() {
    const container = document.getElementById('qr-container');
    const qr = qrcode(0, 'M');
    const url = window.location.href.split('?')[0] + '?room=' + G.channel;
    qr.addData(url);
    qr.make();
    container.innerHTML = qr.createImgTag(4);
}

function refreshPlayers() {
    G.pubnub.hereNow({
        channels: [G.channel],
        includeState: true
    }, (status, response) => {
        if (response && response.channels && response.channels[G.channel]) {
            const occupants = response.channels[G.channel].occupants;
            
            // Obtener IDs actuales
            const currentIds = occupants.map(o => o.uuid);
            
            // Remover jugadores que ya no están
            Object.keys(G.players).forEach(id => {
                if (!currentIds.includes(id)) {
                    delete G.players[id];
                }
            });

            // Actualizar jugadores
            occupants.forEach(o => {
                if (!G.players[o.uuid]) {
                    G.players[o.uuid] = {
                        name: o.state?.name || o.uuid.substring(0, 8),
                        avatar: o.state?.avatar || 'av-1',
                        frame: o.state?.frame || 'fr-basic'
                    };
                } else if (o.state) {
                    G.players[o.uuid].name = o.state.name || G.players[o.uuid].name;
                    G.players[o.uuid].avatar = o.state.avatar || G.players[o.uuid].avatar;
                }

                if (G.scores[o.uuid] === undefined) {
                    G.scores[o.uuid] = 0;
                }
            });

            renderPlayerList();
        }
    });
}

function renderPlayerList() {
    const list = document.getElementById('player-list');
    const countEl = document.getElementById('player-count');
    const playerIds = Object.keys(G.players);

    countEl.textContent = `${playerIds.length}/${G.maxPlayers}`;

    // Determinar host
    const hostId = G.isHost ? G.myId : playerIds[0];

    list.innerHTML = playerIds.map(id => {
        const p = G.players[id];
        const avatar = AVATARS.find(a => a.id === p.avatar) || AVATARS[0];
        const isMe = id === G.myId;
        const isHostPlayer = id === hostId;
        const score = G.scores[id] || 0;

        return `
            <div class="player-item">
                <div class="player-avatar">${avatar.emoji}</div>
                <div class="player-info">
                    <div class="player-name">${p.name}${isMe ? ' (Tú)' : ''}</div>
                    ${isHostPlayer ? '<div class="player-tag">Host</div>' : ''}
                </div>
                <div class="player-score">${score}</div>
            </div>
        `;
    }).join('');
}

// ============================================
// LÓGICA DEL JUEGO
// ============================================

function distributeRoles() {
    const playerIds = Object.keys(G.players);
    
    if (playerIds.length < 3) {
        toast('Se necesitan al menos 3 jugadores', 'error');
        return;
    }

    const numImp = Math.min(
        parseInt(document.getElementById('config-impostors').value) || 1,
        Math.floor(playerIds.length / 2)
    );
    const numChar = Math.min(
        parseInt(document.getElementById('config-charlatans').value) || 0,
        playerIds.length - numImp - 1
    );

    updateSelectedCategories();
    if (G.selectedCategories.length === 0) {
        toast('Selecciona al menos una categoría', 'error');
        return;
    }

    const category = G.selectedCategories[Math.floor(Math.random() * G.selectedCategories.length)];
    const words = [...DB[category]];
    const secretWord = words.splice(Math.floor(Math.random() * words.length), 1)[0];
    const fakeWord = words[Math.floor(Math.random() * words.length)];

    let roles = {};
    let pool = [...playerIds];
    
    G.impostors = [];
    G.charlatans = [];
    G.citizens = [];

    for (let i = 0; i < numImp && pool.length; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        const id = pool.splice(idx, 1)[0];
        roles[id] = { role: 'INFILTRADO', icon: '🎭', word: `Categoría: ${category}` };
        G.impostors.push(id);
    }

    for (let i = 0; i < numChar && pool.length; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        const id = pool.splice(idx, 1)[0];
        roles[id] = { role: 'CHARLATÁN', icon: '🃏', word: fakeWord };
        G.charlatans.push(id);
    }

    pool.forEach(id => {
        roles[id] = { role: 'CIUDADANO', icon: '🔍', word: secretWord };
        G.citizens.push(id);
    });

    G.activePlayers = [...playerIds];
    G.eliminated = [];
    G.fullRoles = roles;
    G.gamePhase = 'roles';

    G.pubnub.publish({
        channel: G.channel,
        message: {
            type: 'assign',
            roles: roles,
            activePlayers: G.activePlayers,
            impostors: G.impostors,
            charlatans: G.charlatans,
            citizens: G.citizens
        }
    });
}

function handleAssign(msg) {
    G.activePlayers = msg.activePlayers;
    G.impostors = msg.impostors;
    G.charlatans = msg.charlatans;
    G.citizens = msg.citizens;
    G.fullRoles = msg.roles;
    G.gamePhase = 'roles';
    G.isSpectator = false;
    G.roleRevealed = false;

    const myRoleData = msg.roles[G.myId];
    if (myRoleData) {
        G.myRole = myRoleData;

        const card = document.getElementById('role-card');
        card.className = 'role-card blurred';
        document.getElementById('role-icon').textContent = '❓';
        document.getElementById('role-title').textContent = 'SECRETO';
        document.getElementById('role-word').textContent = '???';
        document.getElementById('role-instruction').textContent = 'Toca la carta para revelar';
        document.getElementById('points-box').style.display = 'none';
        document.getElementById('timer').style.display = 'none';
        document.getElementById('wait-message').style.display = 'block';
        document.getElementById('btn-start-round').style.display = G.isHost ? 'block' : 'none';

        showScreen('screen-role');
        clearInterval(G.refreshInterval);
    }
}

function revealRole() {
    if (G.roleRevealed) return;
    G.roleRevealed = true;

    const card = document.getElementById('role-card');
    card.classList.remove('blurred');

    document.getElementById('role-icon').textContent = G.myRole.icon;
    document.getElementById('role-title').textContent = G.myRole.role;
    document.getElementById('role-word').textContent = G.myRole.word;
    document.getElementById('role-instruction').textContent = 'Memoriza tu información';

    const roleClass = G.myRole.role === 'INFILTRADO' ? 'impostor' :
                     G.myRole.role === 'CHARLATÁN' ? 'charlatan' : 'citizen';
    card.classList.add(roleClass);

    showPointsReminder();
}

function showPointsReminder() {
    const box = document.getElementById('points-box');
    const list = document.getElementById('points-list');

    let html = '';
    if (G.myRole.role === 'CIUDADANO') {
        html = `
            <li><span class="points-value positive">+${POINTS.CITIZEN_SURVIVE}</span> Sobrevivir la partida</li>
            <li><span class="points-value positive">+${POINTS.CITIZEN_CORRECT_VOTE}</span> Votar correctamente</li>
            <li><span class="points-value negative">${POINTS.CITIZEN_WRONG_VOTE}</span> Votar incorrectamente</li>
        `;
    } else if (G.myRole.role === 'INFILTRADO') {
        html = `
            <li><span class="points-value positive">+${POINTS.IMPOSTOR_WIN}</span> Ganar la partida</li>
            <li><span class="points-value positive">+${POINTS.IMPOSTOR_SURVIVE_ROUND}</span> Sobrevivir cada ronda</li>
        `;
    } else {
        html = `
            <li><span class="points-value positive">+${POINTS.CHARLATAN_SURVIVE}</span> Sobrevivir la partida</li>
            <li><span class="points-value positive">+${POINTS.CITIZEN_CORRECT_VOTE}</span> Votar correctamente</li>
        `;
    }

    list.innerHTML = html;
    box.style.display = 'block';
}

function startRound() {
    const newStarter = G.activePlayers[Math.floor(Math.random() * G.activePlayers.length)];
    
    G.pubnub.publish({
        channel: G.channel,
        message: { 
            type: 'start_round', 
            time: G.roundTime,
            starterPlayerId: newStarter
        }
    });
    document.getElementById('btn-start-round').style.display = 'none';
    document.getElementById('btn-skip-word').style.display = 'none';
}

function handleStartRound(msg) {
    if (G.isSpectator) return;
    
    G.starterPlayerId = msg.starterPlayerId;
    const starterName = G.players[G.starterPlayerId]?.name || 'Alguien';
    
    document.getElementById('starter-info').textContent = `¡${starterName} inicia!`;
    document.getElementById('starter-info').style.display = 'block';
    
    setTimeout(() => {
        document.getElementById('starter-info').style.display = 'none';
        startTimer(msg.time);
        G.gamePhase = 'round';
    }, 2000);
}

function startTimer(duration) {
    document.getElementById('timer').style.display = 'block';
    document.getElementById('wait-message').style.display = 'none';
    document.getElementById('points-box').style.display = 'none';

    let remaining = duration;
    updateTimerDisplay(remaining);

    G.timerInterval = setInterval(() => {
        remaining--;
        updateTimerDisplay(remaining);

        if (remaining <= 10) {
            document.getElementById('timer').classList.add('warning');
        }

        if (remaining <= 0) {
            clearInterval(G.timerInterval);
            document.getElementById('timer').textContent = '¡TIEMPO!';
            if (navigator.vibrate) navigator.vibrate([500, 200, 500]);
            startVoting();
        }
    }, 1000);
}

function updateTimerDisplay(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    document.getElementById('timer').textContent =
        `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function startVoting() {
    if (G.isSpectator) {
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
        G.voteTimeout = setTimeout(() => publishResults(), 30000);
    }
}

function renderVotingList() {
    const list = document.getElementById('voting-list');
    const votable = G.activePlayers.filter(id => id !== G.myId && !G.eliminated.includes(id));

    list.innerHTML = votable.map(id => {
        const p = G.players[id];
        const avatar = AVATARS.find(a => a.id === p?.avatar) || AVATARS[0];

        return `
            <div class="vote-item">
                <div class="player-avatar">${avatar.emoji}</div>
                <div class="player-info">
                    <div class="player-name">${p?.name || id}</div>
                </div>
                <button class="btn-vote" data-target="${id}">Votar</button>
            </div>
        `;
    }).join('');

    list.querySelectorAll('.btn-vote').forEach(btn => {
        btn.onclick = () => sendVote(btn.dataset.target, btn);
    });
}

function startVoteTimer(seconds) {
    let remaining = seconds;
    const display = document.getElementById('vote-timer');

    G.voteTimerInterval = setInterval(() => {
        remaining--;
        display.textContent = `00:${remaining.toString().padStart(2, '0')}`;

        if (remaining <= 0) {
            clearInterval(G.voteTimerInterval);
        }
    }, 1000);
}

function sendVote(targetId, button) {
    if (G.eliminated.includes(targetId) || !G.activePlayers.includes(targetId)) {
        toast('Jugador no válido', 'error');
        return;
    }

    G.pubnub.publish({
        channel: G.channel,
        message: { type: 'vote', target: targetId }
    });

    button.classList.add('voted');
    button.textContent = 'Votado ✓';
    button.disabled = true;

    document.querySelectorAll('.btn-vote').forEach(btn => btn.disabled = true);
    document.getElementById('vote-status').textContent = 'Voto registrado. Esperando...';
}

function handleVote(voterId, targetId) {
    if (!G.activePlayers.includes(targetId) || G.eliminated.includes(targetId)) {
        return;
    }

    G.votes[targetId] = (G.votes[targetId] || 0) + 1;
    G.votedPlayers.add(voterId);
    G.voteTargets[voterId] = targetId;

    if (G.isHost) {
        G.pubnub.publish({
            channel: G.channel,
            message: {
                type: 'vote_update',
                votes: G.votes,
                voted: Array.from(G.votedPlayers)
            }
        });

        if (G.votedPlayers.size >= G.activePlayers.length) {
            clearTimeout(G.voteTimeout);
            setTimeout(() => publishResults(), 500);
        }
    }

    if (G.isSpectator) {
        updateSpectatorVotes();
    }
}

function publishResults() {
    clearInterval(G.voteTimerInterval);
    clearTimeout(G.voteTimeout);

    let maxVotes = 0;
    let mostVoted = [];

    Object.entries(G.votes).forEach(([id, count]) => {
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
        G.eliminated.push(eliminatedId);
        G.activePlayers = G.activePlayers.filter(id => id !== eliminatedId);

        if (G.impostors.includes(eliminatedId)) {
            eliminatedRole = 'INFILTRADO';
            G.impostors = G.impostors.filter(id => id !== eliminatedId);
        } else if (G.charlatans.includes(eliminatedId)) {
            eliminatedRole = 'CHARLATÁN';
            G.charlatans = G.charlatans.filter(id => id !== eliminatedId);
        } else {
            eliminatedRole = 'CIUDADANO';
            G.citizens = G.citizens.filter(id => id !== eliminatedId);
        }

        Object.entries(G.voteTargets).forEach(([voterId, targetId]) => {
            if (targetId === eliminatedId) {
                if (eliminatedRole === 'INFILTRADO') {
                    G.scores[voterId] = (G.scores[voterId] || 0) + POINTS.CITIZEN_CORRECT_VOTE;
                } else if (!G.impostors.includes(voterId)) {
                    G.scores[voterId] = (G.scores[voterId] || 0) + POINTS.CITIZEN_WRONG_VOTE;
                }
            }
        });

        G.impostors.forEach(id => {
            G.scores[id] = (G.scores[id] || 0) + POINTS.IMPOSTOR_SURVIVE_ROUND;
        });
    }

    G.pubnub.publish({
        channel: G.channel,
        message: {
            type: 'results',
            votes: G.votes,
            eliminatedId,
            eliminatedName: eliminatedId ? G.players[eliminatedId]?.name : null,
            eliminatedRole,
            isTie,
            scores: G.scores,
            activePlayers: G.activePlayers,
            impostors: G.impostors
        }
    });

    G.pubnub.publish({
        channel: G.channel,
        message: { type: 'spectator_roles', roles: G.fullRoles }
    });

    setTimeout(() => checkGameOver(), RESULT_DISPLAY_TIME);
}

function showResults(msg) {
    G.votes = msg.votes;
    G.scores = msg.scores || G.scores;
    G.activePlayers = msg.activePlayers;
    G.impostors = msg.impostors;

    if (msg.eliminatedId && !G.eliminated.includes(msg.eliminatedId)) {
        G.eliminated.push(msg.eliminatedId);
    }

    if (msg.eliminatedId === G.myId) {
        G.isSpectator = true;
        showScreen('screen-spectator');
        document.getElementById('spectator-status').textContent =
            `Fuiste eliminado (${msg.eliminatedRole}). Ahora observas.`;
        
        if (G.isHost) {
            document.getElementById('btn-spectator-next').style.display = 'block';
            document.getElementById('btn-spectator-lobby').style.display = 'block';
        }
        return;
    }

    if (G.isSpectator) {
        document.getElementById('spectator-status').textContent = msg.isTie ?
            'Empate - nadie eliminado' :
            `${msg.eliminatedName} eliminado (${msg.eliminatedRole})`;
        
        if (G.isHost) {
            document.getElementById('btn-spectator-next').style.display = 'block';
        }
        return;
    }

    showScreen('screen-results');
    G.gamePhase = 'results';

    const resultsList = document.getElementById('results-list');
    const maxVotes = Math.max(...Object.values(msg.votes), 1);

    resultsList.innerHTML = Object.entries(msg.votes).map(([id, count]) => {
        const name = G.players[id]?.name || id;
        const pct = (count / maxVotes) * 100;

        return `
            <div class="result-item">
                <div class="result-header">
                    <span class="result-name">${name}</span>
                    <span class="result-votes">${count} votos</span>
                </div>
                <div class="result-bar">
                    <div class="result-bar-fill" style="width: ${pct}%"></div>
                </div>
            </div>
        `;
    }).join('');

    const elimBox = document.getElementById('eliminated-box');
    if (msg.isTie) {
        elimBox.innerHTML = `
            <div class="eliminated-icon">⚖️</div>
            <div class="eliminated-name">EMPATE</div>
            <div class="eliminated-role">Nadie fue eliminado</div>
        `;
    } else {
        const icon = msg.eliminatedRole === 'INFILTRADO' ? '🎭' :
                    msg.eliminatedRole === 'CHARLATÁN' ? '🃏' : '🔍';
        elimBox.innerHTML = `
            <div class="eliminated-icon">${icon}</div>
            <div class="eliminated-name">${msg.eliminatedName}</div>
            <div class="eliminated-role">Era ${msg.eliminatedRole}</div>
        `;
    }

    document.getElementById('btn-next-round').style.display = 'none';
    document.getElementById('btn-back-lobby').style.display = 'none';
    
    if (G.isHost) {
        setTimeout(() => {
            document.getElementById('btn-next-round').style.display = 'block';
        }, RESULT_DISPLAY_TIME);
    }
}

function nextRound() {
    document.getElementById('btn-next-round').style.display = 'none';
    document.getElementById('btn-spectator-next').style.display = 'none';

    G.pubnub.publish({
        channel: G.channel,
        message: { type: 'next_round' }
    });
}

function handleNextRound() {
    G.votes = {};
    G.votedPlayers = new Set();
    G.voteTargets = {};
    G.roleRevealed = false;

    clearInterval(G.timerInterval);
    clearInterval(G.voteTimerInterval);

    if (G.isSpectator) {
        document.getElementById('spectator-status').textContent = 'Nueva ronda en progreso...';
        document.getElementById('btn-spectator-next').style.display = 'none';
        
        if (G.isHost) {
            document.getElementById('btn-spectator-next').textContent = '⏱ Iniciar Ronda';
            document.getElementById('btn-spectator-next').style.display = 'block';
            document.getElementById('btn-spectator-next').onclick = startRound;
        }
        return;
    }

    const card = document.getElementById('role-card');
    card.className = 'role-card blurred';
    document.getElementById('role-icon').textContent = '❓';
    document.getElementById('role-title').textContent = 'SECRETO';
    document.getElementById('role-word').textContent = '???';
    document.getElementById('role-instruction').textContent = 'Toca la carta para revelar';
    document.getElementById('points-box').style.display = 'none';
    document.getElementById('timer').style.display = 'none';
    document.getElementById('timer').classList.remove('warning');
    document.getElementById('wait-message').style.display = 'block';
    document.getElementById('starter-info').style.display = 'none';
    document.getElementById('btn-start-round').style.display = G.isHost ? 'block' : 'none';
    document.getElementById('btn-skip-word').style.display = G.isHost ? 'block' : 'none';

    G.gamePhase = 'roles';
    showScreen('screen-role');
}

function checkGameOver() {
    if (!G.isHost) return;

    let winner = null;
    let reason = '';

    if (G.impostors.length === 0) {
        winner = 'CIUDADANOS';
        reason = 'Todos los infiltrados eliminados';

        G.citizens.forEach(id => {
            if (G.activePlayers.includes(id)) {
                G.scores[id] = (G.scores[id] || 0) + POINTS.CITIZEN_SURVIVE;
            }
        });
        G.charlatans.forEach(id => {
            if (G.activePlayers.includes(id)) {
                G.scores[id] = (G.scores[id] || 0) + POINTS.CHARLATAN_SURVIVE;
            }
        });

    } else if (G.activePlayers.length - G.impostors.length <= G.impostors.length) {
        winner = 'INFILTRADOS';
        reason = 'Los infiltrados dominan';

        G.impostors.forEach(id => {
            G.scores[id] = (G.scores[id] || 0) + POINTS.IMPOSTOR_WIN;
        });
    }

    if (winner) {
        G.pubnub.publish({
            channel: G.channel,
            message: {
                type: 'game_over',
                winner,
                reason,
                scores: G.scores,
                roles: G.fullRoles
            }
        });
    }
}

function handleGameOver(msg) {
    G.gamePhase = 'gameover';
    G.scores = msg.scores || G.scores;
    G.fullRoles = msg.roles || G.fullRoles;

    showScreen('screen-gameover');

    const isImpostorWin = msg.winner === 'INFILTRADOS';
    document.getElementById('gameover-title').textContent = `¡${msg.winner} GANAN!`;
    document.getElementById('gameover-reason').textContent = msg.reason;
    document.getElementById('gameover-icon').textContent = isImpostorWin ? '🎭' : '🔍';

    const scoresList = document.getElementById('final-scores');
    const sorted = Object.entries(G.scores).sort((a, b) => b[1] - a[1]);

    scoresList.innerHTML = sorted.map(([id, score], idx) => {
        const p = G.players[id];
        const role = G.fullRoles[id];
        const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '';

        return `
            <div class="score-item">
                <div class="score-rank">${medal || (idx + 1)}</div>
                <div class="score-info">
                    <div class="score-name">${p?.name || id}</div>
                    <div class="score-role">${role?.role || ''}</div>
                </div>
                <div class="score-points">${score}</div>
            </div>
        `;
    }).join('');

    document.getElementById('btn-back-to-lobby').style.display = 'block';
}

function backToLobby() {
    if (G.isHost) {
        G.pubnub.publish({
            channel: G.channel,
            message: {
                type: 'back_to_lobby',
                scores: G.scores,
                hostId: G.hostId,
                usedWords: G.usedWords
            }
        });
    }
    
    resetGameState();
    showScreen('screen-lobby');
    
    document.getElementById('btn-distribute').style.display = G.isHost ? 'block' : 'none';
    
    G.refreshInterval = setInterval(refreshPlayers, 3000);
    refreshPlayers();
}

function handleBackToLobby(msg) {
    G.scores = msg.scores || G.scores;
    G.hostId = msg.hostId || G.hostId;
    G.isHost = (G.myId === G.hostId);
    G.usedWords = msg.usedWords || G.usedWords;
    resetGameState();
    showScreen('screen-lobby');
    
    document.getElementById('btn-distribute').style.display = G.isHost ? 'block' : 'none';
    
    G.refreshInterval = setInterval(refreshPlayers, 3000);
    refreshPlayers();
}

function resetGameState() {
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

    clearInterval(G.timerInterval);
    clearInterval(G.voteTimerInterval);
    clearTimeout(G.voteTimeout);
}

function updateSpectatorRoles() {
    const list = document.getElementById('spectator-roles');

    list.innerHTML = Object.entries(G.fullRoles).map(([id, role]) => {
        const p = G.players[id];
        const isActive = G.activePlayers.includes(id);

        return `
            <div class="player-item" style="opacity: ${isActive ? 1 : 0.5}">
                <div class="player-info">
                    <div class="player-name">${p?.name || id}</div>
                    <div class="player-tag">${role.role} - ${role.word}</div>
                </div>
                <span>${isActive ? '✅' : '❌'}</span>
            </div>
        `;
    }).join('');
}

function updateSpectatorVotes() {
    const list = document.getElementById('spectator-votes');

    list.innerHTML = G.activePlayers.map(id => {
        const p = G.players[id];
        const votes = G.votes[id] || 0;
        const hasVoted = G.votedPlayers.has(id);

        return `
            <div class="player-item">
                <div class="player-info">
                    <div class="player-name">${p?.name || id}</div>
                    <div class="player-tag">${hasVoted ? 'Ha votado' : 'Pendiente'}</div>
                </div>
                <span>${votes} votos</span>
            </div>
        `;
    }).join('');
}

function leaveRoom() {
    if (confirm('¿Abandonar la sala?')) {
        exitGame();
    }
}

function exitGame() {
    clearInterval(G.timerInterval);
    clearInterval(G.voteTimerInterval);
    clearInterval(G.refreshInterval);
    clearTimeout(G.voteTimeout);

    if (G.isHost && G.pubnub) {
        G.pubnub.publish({
            channel: G.channel,
            message: { type: 'host_disconnect' }
        });
    }

    if (G.pubnub) {
        G.pubnub.unsubscribeAll();
        G.pubnub = null;
    }

    G.channel = null;
    G.isHost = false;
    G.hostId = null;
    G.players = {};
    G.scores = {};
    G.usedWords = [];
    resetGameState();

    showScreen('screen-home');
}

function toast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = message;
    container.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

// Debug
window.G = G;