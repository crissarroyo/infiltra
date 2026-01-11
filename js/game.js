
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

window.G = G;
