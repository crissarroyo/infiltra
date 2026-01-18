/**
 * INFILTRA - Game Logic v0.9.8.7 (Corregido: defaults, bug btn-help, palomitas)
 * Fix: Selección por defecto de avatar y marco, palomita negra, bug botón ayuda
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
    soundOff: 'assets/icons/icon-sound-off.png'
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
    "Animales": ["León", "Tigre", "Elefante", "Cebra", "Delfín", "Lobo", "Gorila", "Águila", "Jirafa", "Oso", "Zorro", "Panda", "Tiburón", "Canguro", "Hipopótamo", "Serpiente", "Cocodrilo", "Pájaro", "Mono", "Tortuga"],
    "Comida": ["Pizza", "Tacos", "Sushi", "Hamburguesa", "Pasta", "Ensalada", "Helado", "Pollo", "Pescado", "Chocolate", "Empanadas", "Ramen", "Curry", "Paella", "Burrito", "Croissant", "Queso", "Arroz", "Sopa", "Tarta"],
    "Países": ["México", "Japón", "Brasil", "España", "Francia", "Italia", "Alemania", "Australia", "Argentina", "Canadá", "China", "India", "Rusia", "Estados Unidos", "Reino Unido", "Sudáfrica", "Egipto", "Nueva Zelanda", "Corea del Sur", "Turquía"],
    "Profesiones": ["Médico", "Abogado", "Ingeniero", "Profesor", "Chef", "Piloto", "Arquitecto", "Programador", "Fotógrafo", "Enfermero", "Diseñador", "Periodista", "Músico", "Actor", "Científico", "Veterinario", "Contador", "Psicólogo", "Bombero", "Policía"],
    "Deportes": ["Fútbol", "Baloncesto", "Tenis", "Natación", "Boxeo", "Golf", "Voleibol", "Surf", "Ciclismo", "Atletismo", "Esquí", "Karate", "Béisbol", "Rugby", "Gimnasia", "Escalada", "Patinaje", "Hockey"],
    "Ciudades": ["París", "Tokio", "Nueva York", "Londres", "Roma", "Berlín", "Madrid", "Dubai", "Barcelona", "México DF", "Sídney", "Río de Janeiro", "Los Ángeles", "Toronto", "Estambul", "Singapur", "Ámsterdam", "Seúl"],
    "Frutas": ["Manzana", "Banana", "Naranja", "Uva", "Fresa", "Piña", "Mango", "Sandía", "Kiwi", "Melón", "Pera", "Durazno", "Cereza", "Limón", "Papaya", "Granada", "Coco", "Mora"],
    "Vehículos": ["Coche", "Bicicleta", "Avión", "Barco", "Tren", "Helicóptero", "Motocicleta", "Camión", "Submarino", "Cohete", "Autobús", "Patineta", "Tractor", "Yate"],
    "Instrumentos": ["Guitarra", "Piano", "Batería", "Violín", "Flauta", "Trompeta", "Saxofón", "Arpa", "Bajo", "Ukelele", "Acordeón", "Cello", "Clarinete", "Órgano"],
    "Películas": ["Titanic", "Star Wars", "Avatar", "Frozen", "Shrek", "Batman", "Avengers", "Coco", "Inception", "The Matrix", "Jurassic Park", "Harry Potter", "Toy Story"],
    "Colores": ["Rojo", "Azul", "Verde", "Amarillo", "Naranja", "Morado", "Rosa", "Negro", "Blanco", "Gris", "Turquesa", "Violeta", "Dorado", "Plateado"],
    "Superhéroes": ["Superman", "Batman", "Spider-Man", "Wonder Woman", "Iron Man", "Captain America", "Thor", "Hulk", "Flash", "Aquaman", "Wolverine", "Deadpool"]
};

const AVATARS = [
    { id: 'avatar-11', image: 'assets/avatars/avatar-11.svg' },
    { id: 'avatar-12', image: 'assets/avatars/avatar-12.svg' },
    { id: 'avatar-13', image: 'assets/avatars/avatar-13.svg' },
    { id: 'avatar-16', image: 'assets/avatars/avatar-16.svg' },
    { id: 'avatar-17', image: 'assets/avatars/avatar-17.svg' }
];

const FRAMES = [
    { id: 'fr-basic', color: '#4a5568', locked: false },
    { id: 'fr-gold', color: '#c9a227', locked: false },
    { id: 'fr-red', color: '#8b2635', locked: false },
    { id: 'fr-purple', color: '#7c3aed', locked: false }
];

const RESULT_DISPLAY_TIME = 5000;

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
    screenStack: [], // FIX: Stack real para evitar loops en botón ayuda
    roleRevealed: false,
    isFirstRound: true
};

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
    loadProfile();
    initAvatars();
    initFrames();
    initCategories();
    initParticles();
    bindEvents();
    checkURLParams();
    updateProfilePreview(); // Llamado inmediato para forzar preview con defaults
    console.log('INFILTRA v0.9.8.7 iniciado');
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
    // FIX: Si no hay avatar/frame guardado, usar el primero por defecto y forzar selección visual
    if (avatar && AVATARS.find(a => a.id === avatar)) {
        G.avatar = avatar;
    } else {
        G.avatar = AVATARS[0].id;
    }
    if (frame && FRAMES.find(f => f.id === frame)) {
        G.frame = frame;
    } else {
        G.frame = FRAMES[0].id;
    }
    // Forzar update para que defaults se vean inmediatamente
    updateProfilePreview();
    saveProfile(); // Guardar defaults si no existían
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
    previewAvatar.innerHTML = '<img src="' + avatar.image + '" alt="avatar">';
    
    const frame = FRAMES.find(f => f.id === G.frame);
    if (frame) {
        previewWrapper.style.border = '4px solid ' + frame.color;
        previewWrapper.style.boxShadow = '0 0 15px ' + frame.color + '40';
    }
    
    if (previewName) {
        previewName.textContent = document.getElementById('input-name')?.value || 'Tu Nombre';
    }
}

function initAvatars() {
    const grid = document.getElementById('avatar-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    // FIX: Asegurar que siempre haya un avatar seleccionado y agregar 'selected' class
    if (!G.avatar || !AVATARS.find(a => a.id === G.avatar)) {
        G.avatar = AVATARS[0].id;
    }
    
    AVATARS.forEach(avatar => {
        const div = document.createElement('div');
        div.className = 'avatar-option' + (avatar.id === G.avatar ? ' selected' : '');
        div.innerHTML = '<img src="' + avatar.image + '" alt="' + avatar.id + '">' +
                '<div class="avatar-check">✓</div>'; // Palomita implementada (estilizada en CSS como black en yellow)
        div.onclick = function() {
            G.avatar = avatar.id;
            grid.querySelectorAll('.avatar-option').forEach(el => el.classList.remove('selected'));
            div.classList.add('selected');
            updateProfilePreview();
            saveProfile(); // Guardar al seleccionar
        };
        grid.appendChild(div);
    });
    // Forzar visual si default
    const defaultEl = grid.querySelector(`.avatar-option:has(img[alt="${G.avatar}"])`);
    if (defaultEl) defaultEl.classList.add('selected');
}

function initFrames() {
    const grid = document.getElementById('frame-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    // FIX: Asegurar que siempre haya un marco seleccionado y agregar 'selected' class
    if (!G.frame || !FRAMES.find(f => f.id === G.frame)) {
        G.frame = FRAMES[0].id;
    }
    
    FRAMES.forEach(frame => {
        const div = document.createElement('div');
        div.className = 'frame-option-new' + (frame.id === G.frame ? ' selected' : '') + (frame.locked ? ' locked' : '');
        
        const preview = document.createElement('div');
        preview.className = 'frame-preview';
        preview.style.border = '4px solid ' + frame.color;
        preview.style.boxShadow = '0 0 10px ' + frame.color + '60';
        preview.innerHTML = '<img src="' + ICONS.citizen + '" alt="" class="frame-preview-img">';
        div.appendChild(preview);
        
        // Agregar palomita de selección (estilizada en CSS como black en yellow)
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
                saveProfile(); // Guardar al seleccionar
            };
        }
        grid.appendChild(div);
    });
    // Forzar visual si default
    const defaultEl = grid.querySelector(`.frame-option-new:has(.frame-preview[style*=" ${FRAMES.find(f => f.id === G.frame).color}"])`);
    if (defaultEl) defaultEl.classList.add('selected');
}

function initCategories() {
    const list = document.getElementById('categories-list');
    if (!list) return;
    list.innerHTML = '';
    Object.keys(DB).forEach(cat => {
        const div = document.createElement('div');
        div.className = 'category-item';
        div.innerHTML = '<input type="checkbox" id="cat-' + cat + '" checked>' +
            '<label for="cat-' + cat + '">' + cat + '</label>';
        list.appendChild(div);
    });
}

function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
        container.appendChild(particle);
    }
}

function bindEvents() {
    // Inputs
    const inputName = document.getElementById('input-name');
    if (inputName) inputName.addEventListener('input', function() {
        G.playerName = this.value.trim();
        updateProfilePreview();
    });

    // Botones home
    const btnShowConfig = document.getElementById('btn-show-config');
    if (btnShowConfig) btnShowConfig.addEventListener('click', showConfigScreen);

    const btnJoin = document.getElementById('btn-join-room');
    if (btnJoin) btnJoin.addEventListener('click', joinRoom);

    // Config
    const btnCreate = document.getElementById('btn-create-room');
    if (btnCreate) btnCreate.addEventListener('click', createRoom);

    const btnBackHome = document.getElementById('btn-back-home');
    if (btnBackHome) btnBackHome.addEventListener('click', function() { showScreen('screen-home'); });

    const btnCatAll = document.getElementById('btn-cat-all');
    if (btnCatAll) btnCatAll.addEventListener('click', function() {
        document.querySelectorAll('#categories-list input').forEach(cb => cb.checked = true);
    });

    const btnCatNone = document.getElementById('btn-cat-none');
    if (btnCatNone) btnCatNone.addEventListener('click', function() {
        document.querySelectorAll('#categories-list input').forEach(cb => cb.checked = false);
    });

    // Lobby
    const btnDistribute = document.getElementById('btn-distribute');
    if (btnDistribute) btnDistribute.addEventListener('click', distributeRoles);

    const btnLeaveRoom = document.getElementById('btn-leave-room');
    if (btnLeaveRoom) btnLeaveRoom.addEventListener('click', leaveRoom);

    // Rol
    const roleCard = document.getElementById('role-card');
    if (roleCard) roleCard.addEventListener('click', revealRole);

    const btnStartRound = document.getElementById('btn-start-round');
    if (btnStartRound) btnStartRound.addEventListener('click', startRound);

    const btnSkipWord = document.getElementById('btn-skip-word');
    if (btnSkipWord) btnSkipWord.addEventListener('click', skipWord);

    const btnLeaveRole = document.getElementById('btn-leave-role');
    if (btnLeaveRole) btnLeaveRole.addEventListener('click', leaveRoom);

    // Votación
    const btnLeaveVoting = document.getElementById('btn-leave-voting');
    if (btnLeaveVoting) btnLeaveVoting.addEventListener('click', leaveRoom);

    // Resultados
    const btnNextRound = document.getElementById('btn-next-round');
    if (btnNextRound) btnNextRound.addEventListener('click', function() { if (G.isHost) handleNextRound(); });

    const btnBackLobby = document.getElementById('btn-back-lobby');
    if (btnBackLobby) btnBackLobby.addEventListener('click', backToLobby);

    const btnLeaveResults = document.getElementById('btn-leave-results');
    if (btnLeaveResults) btnLeaveResults.addEventListener('click', leaveRoom);

    // Game Over
    const btnBackToLobby = document.getElementById('btn-back-to-lobby');
    if (btnBackToLobby) btnBackToLobby.addEventListener('click', backToLobby);

    const btnExitGame = document.getElementById('btn-exit-game');
    if (btnExitGame) btnExitGame.addEventListener('click', exitGame);

    // Espectador
    const btnSpecNext = document.getElementById('btn-spectator-next');
    if (btnSpecNext) btnSpecNext.addEventListener('click', function() { if (G.isHost) handleNextRound(); });

    const btnSpecLobby = document.getElementById('btn-spectator-lobby');
    if (btnSpecLobby) btnSpecLobby.addEventListener('click', backToLobby);

    const btnLeaveSpec = document.getElementById('btn-leave-spectator');
    if (btnLeaveSpec) btnLeaveSpec.addEventListener('click', leaveRoom);

    // Ayuda (FIX: Bug corregido con stack real)
    const btnHelp = document.getElementById('btn-help');
    if (btnHelp) btnHelp.addEventListener('click', function() {
        const current = document.querySelector('.screen.active').id;
        if (current !== 'screen-help') { // Solo push si no estás ya en help
            G.screenStack.push(current);
        }
        showScreen('screen-help');
    });

    const btnHelpBack = document.getElementById('btn-help-back');
    if (btnHelpBack) btnHelpBack.addEventListener('click', function() {
        const previous = G.screenStack.pop() || 'screen-home';
        showScreen(previous);
    });

    // Sonido
    const btnSound = document.getElementById('btn-sound');
    if (btnSound) btnSound.addEventListener('click', toggleSound);
}

function checkURLParams() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
        document.getElementById('input-join-code').value = code.toUpperCase();
        joinRoom();
    }
}

// ============================================
// FUNCIONES DE PANTALLAS
// ============================================

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(screenId);
    if (screen) screen.classList.add('active');
    if (screenId === 'screen-role') {
        document.getElementById('role-card').classList.add('blurred');
        document.getElementById('role-instruction').textContent = 'Toca la carta para revelar';
        document.getElementById('btn-start-round').style.display = 'none';
        document.getElementById('btn-skip-word').style.display = 'none';
        document.getElementById('points-box').style.display = 'none';
        document.getElementById('timer').style.display = 'none';
        document.getElementById('wait-message').textContent = 'Espera a que el host inicie la ronda...';
        document.getElementById('starter-info').style.display = 'none';
    }
}

function showConfigScreen() {
    if (!G.playerName) {
        toast('Ingresa tu nombre primero', 'error');
        return;
    }
    saveProfile();
    showScreen('screen-config');
    document.getElementById('config-max-players').value = G.maxPlayers;
    document.getElementById('config-time').value = G.roundTime;
    document.getElementById('config-impostors').value = 1;
    document.getElementById('config-charlatans').value = 0;
}

// ============================================
// PUBNUB Y SALAS
// ============================================

function initPubNub() {
    if (G.pubnub) return;
    G.pubnub = new PubNub({
        publishKey: 'pub-c-bd83ef12-a0c7-4330-bfc6-5a8436f957d4',
        subscribeKey: 'sub-c-84e92f70-a06c-48bc-8672-4b75dfe6f460',
        uuid: G.myId
    });
    G.pubnub.addListener({
        message: handleMessage,
        presence: handlePresence
    });
}

function createRoom() {
    initPubNub();
    G.channel = 'R-' + Math.random().toString(36).substr(2, 4).toUpperCase();
    G.isHost = true;
    G.hostId = G.myId;
    G.maxPlayers = parseInt(document.getElementById('config-max-players').value) || 10;
    G.roundTime = parseInt(document.getElementById('config-time').value) || 60;
    const impostors = parseInt(document.getElementById('config-impostors').value) || 1;
    const charlatans = parseInt(document.getElementById('config-charlatans').value) || 0;
    G.selectedCategories = Array.from(document.querySelectorAll('#categories-list input:checked')).map(cb => cb.id.replace('cat-', ''));
    if (G.selectedCategories.length === 0) {
        toast('Selecciona al menos una categoría', 'error');
        return;
    }
    G.pubnub.subscribe({ channels: [G.channel], withPresence: true });
    G.pubnub.publish({
        channel: G.channel,
        message: {
            type: 'config',
            maxPlayers: G.maxPlayers,
            roundTime: G.roundTime,
            impostors: impostors,
            charlatans: charlatans,
            categories: G.selectedCategories,
            hostId: G.hostId
        }
    });
    joinPlayer();
    showLobby();
}

function joinRoom() {
    const code = document.getElementById('input-join-code').value.toUpperCase().trim();
    if (!code || code.length !== 4) {
        toast('Código inválido', 'error');
        return;
    }
    if (!G.playerName) {
        toast('Ingresa tu nombre primero', 'error');
        return;
    }
    saveProfile();
    G.channel = 'R-' + code;
    initPubNub();
    G.pubnub.subscribe({ channels: [G.channel], withPresence: true });
    G.pubnub.hereNow({ channels: [G.channel], includeUUIDs: true }).then(res => {
        if (res.totalOccupancy >= G.maxPlayers) {
            toast('Sala llena', 'error');
            exitGame();
            return;
        }
        joinPlayer();
        showLobby();
    }).catch(err => {
        toast('Error al unirte', 'error');
        console.error(err);
    });
}

function joinPlayer() {
    G.pubnub.publish({
        channel: G.channel,
        message: {
            type: 'player_join',
            id: G.myId,
            name: G.playerName,
            avatar: G.avatar,
            frame: G.frame
        }
    });
}

function showLobby() {
    showScreen('screen-lobby');
    document.getElementById('display-room-code').textContent = G.channel.split('-')[1];
    generateQR();
    G.refreshInterval = setInterval(refreshPlayers, 3000);
    refreshPlayers();
}

function generateQR() {
    const qr = document.getElementById('qr-container');
    if (!qr) return;
    qr.innerHTML = '';
    const qrcode = new QRCode(qr, {
        text: window.location.origin + '/game.html?code=' + G.channel.split('-')[1],
        width: 128,
        height: 128,
        colorDark : "#0a0a0f",
        colorLight : "#e8e8e8"
    });
}

// ============================================
// PRESENCIA Y JUGADORES
// ============================================

function handlePresence(event) {
    if (event.action === 'leave' || event.action === 'timeout') {
        delete G.players[event.uuid];
        if (event.uuid === G.hostId) {
            toast('Host desconectado', 'error');
            if (G.myId === Object.keys(G.players)[0]) {
                G.isHost = true;
                G.hostId = G.myId;
                G.pubnub.publish({ channel: G.channel, message: { type: 'new_host', hostId: G.myId } });
            }
        }
        refreshPlayers();
    }
}

function refreshPlayers() {
    if (!G.pubnub || !G.channel) return;
    G.pubnub.hereNow({ channels: [G.channel], includeUUIDs: true }).then(res => {
        const online = res.channels[G.channel].occupants.map(o => o.uuid);
        Object.keys(G.players).forEach(id => {
            if (!online.includes(id)) delete G.players[id];
        });
        updatePlayerList();
    });
}

function updatePlayerList() {
    const list = document.getElementById('player-list');
    if (!list) return;
    list.innerHTML = '';
    Object.entries(G.players).forEach(([id, p]) => {
        const div = document.createElement('div');
        div.className = 'player-item';
        div.innerHTML = '<div class="player-avatar">' + renderPlayerAvatar(id) + '</div>' +
            '<div class="player-name">' + p.name + (id === G.hostId ? ' (Host)' : '') + '</div>';
        list.appendChild(div);
    });
    const count = document.getElementById('player-count');
    if (count) count.textContent = Object.keys(G.players).length + '/' + G.maxPlayers;
    const btn = document.getElementById('btn-distribute');
    if (btn) btn.style.display = G.isHost && Object.keys(G.players).length >= 3 ? 'block' : 'none';
}

function renderPlayerAvatar(id, size = 40) {
    const p = G.players[id];
    if (!p) return '';
    const avatar = AVATARS.find(a => a.id === p.avatar) || AVATARS[0];
    const frame = FRAMES.find(f => f.id === p.frame) || FRAMES[0];
    return '<div style="width:' + size + 'px; height:' + size + 'px; border:4px solid ' + frame.color + '; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 0 10px ' + frame.color + '40;">' +
        '<img src="' + avatar.image + '" alt="" style="width:' + (size-8) + 'px; height:' + (size-8) + 'px;"></div>';
}

// ============================================
// MENSAJES
// ============================================

function handleMessage(msg) {
    const data = msg.message;
    switch (data.type) {
        case 'config':
            G.maxPlayers = data.maxPlayers;
            G.roundTime = data.roundTime;
            G.selectedCategories = data.categories;
            G.hostId = data.hostId;
            G.isHost = (G.myId === G.hostId);
            break;
        case 'player_join':
            G.players[data.id] = { name: data.name, avatar: data.avatar, frame: data.frame };
            refreshPlayers();
            break;
        case 'new_host':
            G.hostId = data.hostId;
            G.isHost = (G.myId === G.hostId);
            refreshPlayers();
            break;
        case 'host_disconnect':
            if (G.myId === Object.keys(G.players)[0]) {
                G.isHost = true;
                G.hostId = G.myId;
                G.pubnub.publish({ channel: G.channel, message: { type: 'new_host', hostId: G.myId } });
            }
            break;
        case 'distribute_roles':
            G.activePlayers = data.activePlayers;
            G.fullRoles = data.fullRoles;
            G.myRole = G.fullRoles[G.myId];
            G.starterPlayerId = data.starter;
            G.currentCategory = data.category;
            G.usedWords = data.usedWords || G.usedWords;
            showScreen('screen-role');
            break;
        case 'start_round':
            startRoundTimer();
            break;
        case 'skip_word':
            G.currentSecretWord = data.secretWord;
            G.currentFakeWord = data.fakeWord;
            if (G.myRole) {
                G.myRole.word = G.myRole.role === 'CHARLATÁN' ? G.currentFakeWord : 
                    G.myRole.role === 'INFILTRADO' ? G.currentCategory : G.currentSecretWord;
                document.getElementById('role-word').textContent = G.myRole.word;
            }
            break;
        case 'start_voting':
            startVoting();
            break;
        case 'vote':
            G.votes[data.target] = (G.votes[data.target] || 0) + 1;
            G.votedPlayers.add(data.voter);
            G.voteTargets[data.voter] = data.target;
            if (G.gamePhase === 'voting') updateVotingList();
            if (G.isSpectator) updateSpectatorVotes();
            break;
        case 'results':
            showResults(data.eliminated, data.votes, data.correct);
            break;
        case 'next_round':
            handleNextRound(data);
            break;
        case 'game_over':
            handleGameOver(data);
            break;
        case 'back_to_lobby':
            handleBackToLobby(data);
            break;
    }
}

// ============================================
// ROLES Y RONDA
// ============================================

function distributeRoles() {
    if (!G.isHost) return;
    const players = Object.keys(G.players);
    if (players.length < 3) {
        toast('Mínimo 3 jugadores', 'error');
        return;
    }
    const impostorsNum = parseInt(document.getElementById('config-impostors').value) || 1;
    const charlatansNum = parseInt(document.getElementById('config-charlatans').value) || 0;
    const totalSpecial = impostorsNum + charlatansNum;
    if (totalSpecial >= players.length) {
        toast('Demasiados infiltrados/charlatanes', 'error');
        return;
    }
    G.activePlayers = [...players];
    G.eliminated = [];
    G.impostors = [];
    G.charlatans = [];
    G.citizens = [];
    G.scores = {};
    G.usedWords = [];
    G.fullRoles = {};
    G.votes = {};
    G.votedPlayers = new Set();
    G.voteTargets = {};
    G.isFirstRound = true;
    
    // Asignar roles
    const shuffled = players.sort(() => Math.random() - 0.5);
    G.impostors = shuffled.slice(0, impostorsNum);
    G.charlatans = shuffled.slice(impostorsNum, totalSpecial);
    G.citizens = shuffled.slice(totalSpecial);
    
    G.impostors.forEach(id => {
        G.fullRoles[id] = { role: 'INFILTRADO', word: '', icon: ICONS.impostor };
    });
    G.charlatans.forEach(id => {
        G.fullRoles[id] = { role: 'CHARLATÁN', word: '', icon: ICONS.charlatan };
    });
    G.citizens.forEach(id => {
        G.fullRoles[id] = { role: 'CIUDADANO', word: '', icon: ICONS.citizen };
    });
    
    selectNewWord();
    G.starterPlayerId = players[Math.floor(Math.random() * players.length)];
    
    G.pubnub.publish({
        channel: G.channel,
        message: {
            type: 'distribute_roles',
            activePlayers: G.activePlayers,
            fullRoles: G.fullRoles,
            category: G.currentCategory,
            starter: G.starterPlayerId,
            usedWords: G.usedWords
        }
    });
    
    showScreen('screen-role');
}

function selectNewWord() {
    const cat = G.selectedCategories[Math.floor(Math.random() * G.selectedCategories.length)];
    let words = DB[cat].filter(w => !G.usedWords.includes(w));
    if (words.length < 2) {
        G.usedWords = [];
        words = DB[cat];
    }
    const index = Math.floor(Math.random() * words.length);
    G.currentSecretWord = words[index];
    words.splice(index, 1);
    G.currentFakeWord = words[Math.floor(Math.random() * words.length)];
    G.usedWords.push(G.currentSecretWord);
    G.currentCategory = cat;
    
    Object.entries(G.fullRoles).forEach(([id, role]) => {
        if (role.role === 'CHARLATÁN') role.word = G.currentFakeWord;
        else if (role.role === 'INFILTRADO') role.word = cat;
        else role.word = G.currentSecretWord;
    });
}

function revealRole() {
    if (G.roleRevealed) return;
    G.roleRevealed = true;
    const card = document.getElementById('role-card');
    card.classList.remove('blurred');
    const roleClass = G.myRole.role === 'INFILTRADO' ? 'impostor' : G.myRole.role === 'CHARLATÁN' ? 'charlatan' : 'citizen';
    card.className = 'role-card ' + roleClass;
    document.getElementById('role-icon').innerHTML = '<img src="' + G.myRole.icon + '" alt="" class="role-icon-img">';
    document.getElementById('role-title').textContent = G.myRole.role;
    document.getElementById('role-word').textContent = G.myRole.word;
    document.getElementById('role-instruction').textContent = 'Tu rol (conocido)';
    if (G.isHost) document.getElementById('btn-skip-word').style.display = 'block';
    document.getElementById('points-box').style.display = 'block';
    updatePointsList();
    if (G.isHost) document.getElementById('btn-start-round').style.display = 'block';
    if (G.starterPlayerId === G.myId) {
        document.getElementById('starter-info').style.display = 'block';
        document.getElementById('starter-info').textContent = '¡Eres el starter! Comienza la ronda.';
    }
}

function updatePointsList() {
    const list = document.getElementById('points-list');
    if (!list) return;
    list.innerHTML = '';
    const pointsData = G.myRole.role === 'CIUDADANO' ? [
        { value: POINTS.CITIZEN_SURVIVE, desc: 'Sobrevivir la partida', positive: true },
        { value: POINTS.CITIZEN_CORRECT_VOTE, desc: 'Votar correctamente', positive: true },
        { value: POINTS.CITIZEN_WRONG_VOTE, desc: 'Votar incorrectamente', positive: false }
    ] : G.myRole.role === 'INFILTRADO' ? [
        { value: POINTS.IMPOSTOR_WIN, desc: 'Ganar la partida', positive: true },
        { value: POINTS.IMPOSTOR_SURVIVE_ROUND, desc: 'Sobrevivir ronda', positive: true }
    ] : [
        { value: POINTS.CHARLATAN_SURVIVE, desc: 'Sobrevivir la partida', positive: true }
    ];
    pointsData.forEach(p => {
        const li = document.createElement('li');
        li.innerHTML = p.desc + '<span class="points-value ' + (p.positive ? 'positive' : 'negative') + '">' + (p.positive ? '+' : '') + p.value + '</span>';
        list.appendChild(li);
    });
}

function skipWord() {
    if (!G.isHost || G.gamePhase !== 'roles') return;
    selectNewWord();
    G.pubnub.publish({
        channel: G.channel,
        message: {
            type: 'skip_word',
            secretWord: G.currentSecretWord,
            fakeWord: G.currentFakeWord
        }
    });
}

function startRound() {
    if (!G.isHost) return;
    G.pubnub.publish({
        channel: G.channel,
        message: { type: 'start_round' }
    });
    startRoundTimer();
}

function startRoundTimer() {
    G.gamePhase = 'round';
    document.getElementById('btn-start-round').style.display = 'none';
    document.getElementById('btn-skip-word').style.display = 'none';
    document.getElementById('wait-message').style.display = 'none';
    const timer = document.getElementById('timer');
    timer.style.display = 'block';
    let timeLeft = G.roundTime;
    timer.textContent = formatTime(timeLeft);
    clearInterval(G.timerInterval);
    G.timerInterval = setInterval(function() {
        timeLeft--;
        timer.textContent = formatTime(timeLeft);
        if (timeLeft <= 10) timer.classList.add('warning');
        if (timeLeft <= 0) {
            clearInterval(G.timerInterval);
            if (G.isHost) startVotingPhase();
        }
    }, 1000);
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return (min < 10 ? '0' : '') + min + ':' + (sec < 10 ? '0' : '') + sec;
}

// ============================================
// VOTACIÓN
// ============================================

function startVotingPhase() {
    if (!G.isHost) return;
    G.pubnub.publish({
        channel: G.channel,
        message: { type: 'start_voting' }
    });
}

function startVoting() {
    clearAllTimers();
    G.gamePhase = 'voting';
    showScreen('screen-voting');
    updateVotingList();
    let timeLeft = 30;
    const timer = document.getElementById('vote-timer');
    timer.textContent = formatTime(timeLeft);
    clearInterval(G.voteTimerInterval);
    G.voteTimerInterval = setInterval(function() {
        timeLeft--;
        timer.textContent = formatTime(timeLeft);
        if (timeLeft <= 10) timer.classList.add('warning');
        if (timeLeft <= 0) {
            clearInterval(G.voteTimerInterval);
            if (G.isHost) processVotes();
        }
    }, 1000);
    G.voteTimeout = setTimeout(function() {
        if (G.isHost) processVotes();
    }, 30000);
}

function updateVotingList() {
    const list = document.getElementById('voting-list');
    if (!list) return;
    list.innerHTML = '';
    G.activePlayers.forEach(id => {
        if (id === G.myId) return;
        const p = G.players[id];
        const div = document.createElement('div');
        div.className = 'vote-item';
        div.innerHTML = '<div class="player-avatar">' + renderPlayerAvatar(id, 48) + '</div>' +
            '<div class="player-name">' + (p?.name || id) + '</div>' +
            '<button class="btn-vote" data-id="' + id + '">Votar</button>';
        list.appendChild(div);
    });
    document.querySelectorAll('.btn-vote').forEach(btn => {
        btn.addEventListener('click', votePlayer);
        if (G.votedPlayers.has(G.myId)) btn.disabled = true;
    });
    document.getElementById('vote-status').textContent = G.votedPlayers.has(G.myId) ? 'Has votado. Espera resultados...' : 'Selecciona un jugador para votar';
}

function votePlayer(e) {
    const target = e.target.dataset.id;
    G.pubnub.publish({
        channel: G.channel,
        message: { type: 'vote', voter: G.myId, target: target }
    });
    e.target.classList.add('voted');
    e.target.textContent = 'Votado';
    e.target.disabled = true;
    document.getElementById('vote-status').textContent = 'Has votado. Espera resultados...';
}

// ============================================
// RESULTADOS
// ============================================

function processVotes() {
    if (!G.isHost) return;
    let maxVotes = 0;
    const voteCounts = {};
    G.activePlayers.forEach(id => voteCounts[id] = G.votes[id] || 0);
    Object.values(voteCounts).forEach(v => { if (v > maxVotes) maxVotes = v; });
    const eliminatedCandidates = Object.keys(voteCounts).filter(id => voteCounts[id] === maxVotes);
    let eliminated = null;
    let isTie = eliminatedCandidates.length > 1;
    if (!isTie) eliminated = eliminatedCandidates[0];
    
    // Puntuación
    Object.entries(G.voteTargets).forEach(([voter, target]) => {
        const isCorrect = G.impostors.includes(target);
        const voterRole = G.fullRoles[voter].role;
        if (voterRole === 'CIUDADANO' || voterRole === 'CHARLATÁN') {
            G.scores[voter] = (G.scores[voter] || 0) + (isCorrect ? POINTS.CITIZEN_CORRECT_VOTE : POINTS.CITIZEN_WRONG_VOTE);
        }
    });
    G.impostors.forEach(id => {
        if (G.activePlayers.includes(id)) {
            G.scores[id] = (G.scores[id] || 0) + POINTS.IMPOSTOR_SURVIVE_ROUND;
        }
    });
    
    if (!isTie && eliminated) {
        G.activePlayers = G.activePlayers.filter(id => id !== eliminated);
        G.eliminated.push(eliminated);
        if (G.impostors.includes(eliminated)) G.impostors = G.impostors.filter(id => id !== eliminated);
        if (G.charlatans.includes(eliminated)) G.charlatans = G.charlatans.filter(id => id !== eliminated);
        if (G.citizens.includes(eliminated)) G.citizens = G.citizens.filter(id => id !== eliminated);
    }
    
    const correct = G.impostors.includes(eliminated);
    G.pubnub.publish({
        channel: G.channel,
        message: {
            type: 'results',
            eliminated: eliminated,
            votes: voteCounts,
            correct: correct,
            tie: isTie,
            scores: G.scores
        }
    });
    
    setTimeout(function() {
        checkGameOver();
        if (G.gamePhase !== 'gameover') {
            G.pubnub.publish({
                channel: G.channel,
                message: {
                    type: 'next_round',
                    activePlayers: G.activePlayers,
                    fullRoles: G.fullRoles // Mantener roles para espectadores
                }
            });
        }
    }, RESULT_DISPLAY_TIME);
}

function showResults(eliminated, votes, correct) {
    clearAllTimers();
    G.gamePhase = 'results';
    showScreen('screen-results');
    const list = document.getElementById('results-list');
    list.innerHTML = '';
    Object.entries(votes).sort((a,b) => b[1] - a[1]).forEach(([id, count]) => {
        const p = G.players[id];
        const div = document.createElement('div');
        div.className = 'result-item';
        div.innerHTML = '<div class="result-header">' +
            '<span class="result-name">' + (p?.name || id) + '</span>' +
            '<span class="result-votes">' + count + '</span>' +
        '</div>' +
        '<div class="result-bar"><div class="result-bar-fill" style="width:' + (count / G.activePlayers.length * 100) + '%"></div></div>';
        list.appendChild(div);
    });
    
    const box = document.getElementById('eliminated-box');
    if (votes && Object.keys(votes).some(k => votes[k] > 0)) {
        if (eliminated) {
            const p = G.players[eliminated];
            const role = G.fullRoles[eliminated];
            box.innerHTML = '<img src="' + (correct ? ICONS.celebrate : ICONS.warning) + '" alt="" class="eliminated-icon">' +
                '<h3 class="eliminated-name">' + (p?.name || eliminated) + '</h3>' +
                '<p class="eliminated-role">' + role.role + ' eliminado' + (correct ? ' correctamente!' : ' por error!') + '</p>';
        } else {
            box.innerHTML = '<img src="' + ICONS.tie + '" alt="" class="eliminated-icon">' +
                '<h3>¡EMPATE!</h3>' +
                '<p>Nadie eliminado esta ronda</p>';
        }
    } else {
        box.innerHTML = '<img src="' + ICONS.pending + '" alt="" class="eliminated-icon">' +
            '<h3>SIN VOTOS</h3>' +
            '<p>Nadie eliminado</p>';
    }
    
    const btnNext = document.getElementById('btn-next-round');
    btnNext.style.display = G.isHost ? 'block' : 'none';
    const btnLobby = document.getElementById('btn-back-lobby');
    btnLobby.style.display = G.isHost ? 'block' : 'none';
}

function clearAllTimers() {
    clearInterval(G.timerInterval);
    clearInterval(G.voteTimerInterval);
    clearTimeout(G.voteTimeout);
    clearInterval(G.spectatorTimerInterval);
}

// ============================================
// SIGUIENTE RONDA Y GAME OVER
// ============================================

function handleNextRound(msg) {
    clearAllTimers();
    G.votes = {};
    G.votedPlayers = new Set();
    G.voteTargets = {};
    G.isFirstRound = false;
    G.gamePhase = 'roles';
    
    if (msg && msg.activePlayers) G.activePlayers = msg.activePlayers;
    if (msg && msg.fullRoles) {
        G.fullRoles = msg.fullRoles;
        if (G.fullRoles[G.myId]) G.myRole = G.fullRoles[G.myId];
    }
    
    if (G.isSpectator) {
        document.getElementById('spectator-status').textContent = 'Esperando inicio...';
        const btnSpecNext = document.getElementById('btn-spectator-next');
        if (btnSpecNext) btnSpecNext.style.display = 'none';
        if (G.isHost && btnSpecNext) {
            btnSpecNext.textContent = 'Iniciar Ronda';
            btnSpecNext.style.display = 'block';
            btnSpecNext.disabled = false;
        }
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
    const timer = document.getElementById('timer');
    timer.style.display = 'none';
    timer.classList.remove('warning');
    document.getElementById('wait-message').style.display = 'block';
    document.getElementById('starter-info').style.display = 'none';
    
    if (btnStart) {
        btnStart.style.display = G.isHost ? 'block' : 'none';
        btnStart.disabled = false;
    }
    if (btnSkip) btnSkip.style.display = G.isHost ? 'block' : 'none';
    
    showScreen('screen-role');
}

function checkGameOver() {
    if (!G.isHost || !G.pubnub) return;
    
    let winner = null;
    let reason = '';
    
    if (G.impostors.length === 0) {
        winner = 'CIUDADANOS';
        reason = 'Infiltrados eliminados';
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
        reason = 'Infiltrados dominan';
        G.impostors.forEach(id => {
            G.scores[id] = (G.scores[id] || 0) + POINTS.IMPOSTOR_WIN;
        });
    }
    
    if (winner) {
        G.pubnub.publish({
            channel: G.channel,
            message: { type: 'game_over', winner: winner, reason: reason, scores: G.scores, roles: G.fullRoles }
        });
    }
}

function handleGameOver(msg) {
    clearAllTimers();
    G.gamePhase = 'gameover';
    G.scores = msg.scores || G.scores;
    G.fullRoles = msg.roles || G.fullRoles;
    
    showScreen('screen-gameover');
    document.getElementById('gameover-title').textContent = '¡' + msg.winner + ' GANAN!';
    document.getElementById('gameover-reason').textContent = msg.reason;
    document.getElementById('gameover-icon').src = msg.winner === 'INFILTRADOS' ? ICONS.impostor : ICONS.celebrate;
    
    const scoresList = document.getElementById('final-scores');
    const sorted = Object.entries(G.scores).sort((a, b) => b[1] - a[1]);
    
    scoresList.innerHTML = sorted.map(function([id, score], idx) {
        const p = G.players[id];
        const role = G.fullRoles[id];
        let medalHtml = '';
        if (idx === 0) medalHtml = '<img src="' + ICONS.medalGold + '" alt="1">';
        else if (idx === 1) medalHtml = '<img src="' + ICONS.medalSilver + '" alt="2">';
        else if (idx === 2) medalHtml = '<img src="' + ICONS.medalBronze + '" alt="3">';
        else medalHtml = (idx + 1);
        
        return '<div class="score-item">' +
            '<div class="score-rank">' + medalHtml + '</div>' +
            '<div class="score-info">' +
                '<div class="score-name">' + (p?.name || id) + '</div>' +
                '<div class="score-role">' + (role?.role || '') + '</div>' +
            '</div>' +
            '<div class="score-points">' + score + '</div>' +
        '</div>';
    }).join('');
}

// ============================================
// LOBBY Y SALIDA
// ============================================

function backToLobby() {
    if (G.isHost && G.pubnub) {
        G.pubnub.publish({
            channel: G.channel,
            message: { type: 'back_to_lobby', scores: G.scores, hostId: G.hostId, usedWords: G.usedWords }
        });
    }
    resetGameState();
    showScreen('screen-lobby');
    const btn = document.getElementById('btn-distribute');
    if (btn) btn.style.display = G.isHost ? 'block' : 'none';
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
    const btn = document.getElementById('btn-distribute');
    if (btn) btn.style.display = G.isHost ? 'block' : 'none';
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
    if (!list || !G.fullRoles) return;
    
    list.innerHTML = Object.entries(G.fullRoles).map(function([id, role]) {
        const p = G.players[id];
        const isActive = G.activePlayers.includes(id);
        const statusIcon = isActive ? ICONS.active : ICONS.eliminated;
        return '<div class="player-item" style="opacity:' + (isActive ? 1 : 0.5) + '">' +
            '<div class="player-avatar">' + renderPlayerAvatar(id, 36) + '</div>' +
            '<div class="player-info">' +
                '<div class="player-name">' + (p?.name || id) + '</div>' +
                '<div class="player-tag">' + role.role + ' - ' + role.word + '</div>' +
            '</div>' +
            '<img src="' + statusIcon + '" alt="" class="player-status-icon">' +
        '</div>';
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
        return '<div class="player-item">' +
            '<div class="player-avatar">' + renderPlayerAvatar(id, 36) + '</div>' +
            '<div class="player-info">' +
                '<div class="player-name">' + (p?.name || id) + '</div>' +
                '<div class="player-tag">' + (hasVoted ? 'Ha votado' : 'Pendiente') + '</div>' +
            '</div>' +
            '<span>' + votes + ' votos</span>' +
        '</div>';
    }).join('');
}

// ============================================
// UTILIDADES
// ============================================

function toggleSound() {
    G.soundEnabled = !G.soundEnabled;
    const btn = document.getElementById('btn-sound');
    btn.querySelector('img').src = G.soundEnabled ? ICONS.soundOn : ICONS.soundOff;
    if (!G.soundEnabled) btn.classList.add('muted');
    else btn.classList.remove('muted');
}

function leaveRoom() {
    if (confirm('¿Abandonar?')) exitGame();
}

function exitGame() {
    clearAllTimers();
    clearInterval(G.refreshInterval);
    if (G.isHost && G.pubnub) {
        G.pubnub.publish({ channel: G.channel, message: { type: 'host_disconnect' } });
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

function toast(message, type) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const t = document.createElement('div');
    t.className = 'toast ' + (type || 'info');
    t.textContent = message;
    container.appendChild(t);
    setTimeout(function() { t.remove(); }, 3000);
}

// Exponer G globalmente para debugging
window.G = G;
console.log('INFILTRA v0.9.8.7 cargado completamente');
