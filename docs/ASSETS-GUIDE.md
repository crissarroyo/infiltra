# INFILTRA - Guía de Assets

Esta guía explica cómo agregar avatares, marcos y sonidos al juego INFILTRA.

---

## 📁 Estructura de Carpetas

```
infiltra/
├── index.html              # Landing page
├── game.html               # Página del juego
├── css/
│   └── styles.css          # Estilos
├── js/
│   └── game.js             # Lógica del juego
└── assets/
    ├── avatars/            # Imágenes de avatares
    │   ├── avatar-1.svg
    │   ├── avatar-2.svg
    │   └── ...
    ├── frames/             # Imágenes de marcos
    │   ├── frame-basic.svg
    │   └── ...
    └── sounds/             # Efectos de sonido
        ├── click.mp3
        ├── notification.mp3
        └── ...
```

---

## 🎭 AVATARES

### Especificaciones para Diseño

| Propiedad | Valor |
|-----------|-------|
| Formato | SVG (preferido) o PNG |
| Tamaño | 200x200 px |
| Fondo | Transparente |
| Estilo | Detective/Espía minimalista |
| Variedad | 5 mujeres, 5 hombres, diversas etnias |

### Cómo Agregar un Avatar

1. **Crea o descarga la imagen** siguiendo las especificaciones
2. **Nombra el archivo** como `avatar-N.svg` (donde N es un número)
3. **Coloca el archivo** en `assets/avatars/`
4. **Actualiza el array AVATARS** en `js/game.js`:

```javascript
const AVATARS = [
    { id: 'avatar-1', emoji: '🕵️', name: 'Detective 1', image: 'assets/avatars/avatar-1.svg' },
    { id: 'avatar-2', emoji: '🕵️‍♀️', name: 'Detective 2', image: 'assets/avatars/avatar-2.svg' },
    // Agregar nuevos avatares aquí:
    { id: 'avatar-11', emoji: '👤', name: 'Nuevo Avatar', image: 'assets/avatars/avatar-11.svg' },
];
```

5. **Actualiza la función `initAvatars()`** para usar imágenes en lugar de emojis:

```javascript
function initAvatars() {
    const grid = document.getElementById('avatar-grid');
    grid.innerHTML = '';
    
    AVATARS.forEach(avatar => {
        const div = document.createElement('div');
        div.className = 'avatar-option' + (avatar.id === state.selectedAvatar ? ' selected' : '');
        
        // Usar imagen si existe, sino emoji
        if (avatar.image) {
            div.innerHTML = `<img src="${avatar.image}" alt="${avatar.name}">`;
        } else {
            div.innerHTML = `<span class="avatar-placeholder">${avatar.emoji}</span>`;
        }
        
        div.onclick = () => selectAvatar(avatar.id);
        div.dataset.id = avatar.id;
        grid.appendChild(div);
    });
}
```

---

## 🖼️ MARCOS (Frames)

### Especificaciones para Diseño

| Propiedad | Valor |
|-----------|-------|
| Formato | SVG (preferido) o PNG |
| Tamaño | 220x220 px (para envolver avatar de 200px) |
| Fondo | Transparente |
| Centro | Hueco circular de 200px para el avatar |

### Cómo Agregar un Marco

1. **Crea el marco** como SVG con un hueco circular en el centro
2. **Nombra el archivo** como `frame-nombre.svg`
3. **Coloca el archivo** en `assets/frames/`
4. **Actualiza el array FRAMES** en `js/game.js`:

```javascript
const FRAMES = [
    { id: 'frame-basic', name: 'Básico', color: '#4a5568', locked: false, image: 'assets/frames/frame-basic.svg' },
    { id: 'frame-gold', name: 'Dorado', color: '#c9a227', locked: true, image: 'assets/frames/frame-gold.svg' },
    // Agregar nuevos marcos:
    { id: 'frame-diamond', name: 'Diamante', color: '#00d4ff', locked: true, image: 'assets/frames/frame-diamond.svg' },
];
```

### Desbloquear Marcos

Para hacer que un marco bloqueado esté disponible, cambia `locked: true` a `locked: false`:

```javascript
{ id: 'frame-gold', name: 'Dorado', color: '#c9a227', locked: false }, // Ahora desbloqueado
```

---

## 🔊 SONIDOS

### Sonidos Requeridos

| Nombre | Uso | Duración Sugerida |
|--------|-----|-------------------|
| `click.mp3` | Clicks de UI | 0.1-0.2s |
| `notification.mp3` | Notificaciones generales | 0.3-0.5s |
| `reveal.mp3` | Revelar carta de rol | 0.5-1s |
| `start.mp3` | Inicio de ronda | 0.5-1s |
| `tick.mp3` | Últimos segundos del timer | 0.1-0.2s |
| `timeout.mp3` | Tiempo agotado | 0.5-1s |
| `vote.mp3` | Confirmar voto | 0.2-0.3s |
| `results.mp3` | Mostrar resultados | 0.5-1s |
| `win.mp3` | Victoria | 1-2s |
| `lose.mp3` | Derrota | 1-2s |

### Especificaciones de Audio

| Propiedad | Valor |
|-----------|-------|
| Formato | MP3 (mejor compatibilidad) |
| Calidad | 128kbps mínimo |
| Canales | Mono o Estéreo |
| Volumen | Normalizado |

### Cómo Agregar Sonidos

1. **Prepara los archivos de audio** en formato MP3
2. **Coloca los archivos** en `assets/sounds/`
3. **Actualiza la función `playSound()`** en `js/game.js`:

```javascript
// Objeto con rutas a los sonidos
const SOUNDS = {
    click: new Audio('assets/sounds/click.mp3'),
    notification: new Audio('assets/sounds/notification.mp3'),
    reveal: new Audio('assets/sounds/reveal.mp3'),
    start: new Audio('assets/sounds/start.mp3'),
    tick: new Audio('assets/sounds/tick.mp3'),
    timeout: new Audio('assets/sounds/timeout.mp3'),
    vote: new Audio('assets/sounds/vote.mp3'),
    results: new Audio('assets/sounds/results.mp3'),
    win: new Audio('assets/sounds/win.mp3'),
    lose: new Audio('assets/sounds/lose.mp3')
};

// Pre-cargar sonidos
Object.values(SOUNDS).forEach(sound => {
    sound.load();
    sound.volume = 0.5; // Volumen al 50%
});

function playSound(soundName) {
    if (!state.soundEnabled) return;
    
    const sound = SOUNDS[soundName];
    if (sound) {
        sound.currentTime = 0; // Reiniciar si ya estaba sonando
        sound.play().catch(e => console.log('Audio blocked:', e));
    }
}
```

### Agregar Nuevo Sonido

1. Coloca el archivo en `assets/sounds/nuevo-sonido.mp3`
2. Agrega al objeto SOUNDS:
```javascript
const SOUNDS = {
    // ... otros sonidos
    nuevoSonido: new Audio('assets/sounds/nuevo-sonido.mp3'),
};
```
3. Llámalo donde necesites:
```javascript
playSound('nuevoSonido');
```

---

## 📤 Subir Cambios a GitHub

### Desde la Terminal (Git)

```bash
# 1. Navega a la carpeta del proyecto
cd infiltra

# 2. Agrega los nuevos archivos
git add .

# 3. Crea un commit con descripción
git commit -m "Agregar nuevos avatares y sonidos"

# 4. Sube los cambios
git push origin main
```

### Desde GitHub Web

1. Ve a tu repositorio en github.com
2. Click en "Add file" > "Upload files"
3. Arrastra los archivos a la carpeta correcta
4. Click en "Commit changes"

---

## 🎨 Recursos Recomendados para Assets

### Avatares (Gratuitos)
- [Avataaars](https://avataaars.com/) - Generador de avatares
- [Open Peeps](https://www.openpeeps.com/) - Ilustraciones de personas
- [Humaaans](https://www.humaaans.com/) - Mix & match de ilustraciones

### Iconos/Ilustraciones
- [Undraw](https://undraw.co/) - Ilustraciones SVG gratuitas
- [Flaticon](https://www.flaticon.com/) - Iconos (con atribución)

### Sonidos (Gratuitos)
- [Freesound](https://freesound.org/) - Biblioteca de sonidos
- [Mixkit](https://mixkit.co/free-sound-effects/) - Efectos de sonido gratuitos
- [Zapsplat](https://www.zapsplat.com/) - Efectos de sonido

### Herramientas
- [Figma](https://figma.com) - Diseño de avatares
- [Audacity](https://www.audacityteam.org/) - Edición de audio
- [SVGOMG](https://jakearchibald.github.io/svgomg/) - Optimizar SVGs

---

## ❓ Preguntas Frecuentes

### ¿Por qué mis avatares no aparecen?
- Verifica que la ruta en el array AVATARS sea correcta
- Asegúrate de que el archivo exista en la carpeta
- Revisa la consola del navegador (F12) por errores

### ¿Por qué no se escuchan los sonidos?
- Los navegadores bloquean audio sin interacción del usuario
- El sonido se activa después del primer click
- Verifica que el botón de sonido no esté muteado

### ¿Cómo pruebo los cambios localmente?
Necesitas un servidor local. Opciones:
```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (npx)
npx serve

# Con VS Code
# Instala la extensión "Live Server"
```

Luego abre `http://localhost:8000` en tu navegador.

---

## 📋 Checklist para Nuevos Assets

### Avatar Nuevo
- [ ] Imagen en formato correcto (SVG/PNG)
- [ ] Tamaño 200x200px
- [ ] Fondo transparente
- [ ] Archivo en `assets/avatars/`
- [ ] Entrada agregada en array AVATARS
- [ ] Probado en navegador

### Marco Nuevo
- [ ] Imagen en formato correcto (SVG/PNG)
- [ ] Tamaño 220x220px con hueco central
- [ ] Fondo transparente
- [ ] Archivo en `assets/frames/`
- [ ] Entrada agregada en array FRAMES
- [ ] Definido si está bloqueado o no
- [ ] Probado en navegador

### Sonido Nuevo
- [ ] Audio en formato MP3
- [ ] Duración apropiada (<2s para efectos)
- [ ] Volumen normalizado
- [ ] Archivo en `assets/sounds/`
- [ ] Agregado al objeto SOUNDS
- [ ] Llamada playSound() donde corresponda
- [ ] Probado con sonido activado

---

¿Necesitas ayuda adicional? Revisa el código fuente o abre un issue en GitHub.
