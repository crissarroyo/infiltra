# 🎭 INFILTRA

> El juego de deducción social

INFILTRA es un juego multijugador de deducción social donde los jugadores deben identificar al infiltrado entre ellos antes de que sea demasiado tarde.

![Version](https://img.shields.io/badge/beta-0.9.0-blue)

---

## 🎮 Cómo Jugar

1. **Crear o Unirse**: Un jugador crea una sala y comparte el código de 4 letras
2. **Recibir Rol**: Cada jugador recibe secretamente un rol:
   - 🔍 **Ciudadano**: Conoce la palabra secreta
   - 🎭 **Infiltrado**: Solo conoce la categoría
   - 🃏 **Charlatán**: Tiene una palabra falsa
3. **Dar Pistas**: Por turnos, da pistas sobre la palabra sin revelarla
4. **Votar**: Discute y vota por quien creas que es el infiltrado
5. **Ganar**: Ciudadanos ganan eliminando infiltrados; Infiltrados ganan si igualan en número

---

## 📊 Sistema de Puntos

| Acción | Puntos |
|--------|--------|
| Ciudadano sobrevive la partida | +15 |
| Votar correctamente al infiltrado | +7 |
| Votar incorrectamente (ciudadano) | -3 |
| Infiltrado gana la partida | +30 |
| Infiltrado sobrevive una ronda | +5 |
| Charlatán sobrevive la partida | +25 |

---

## 🚀 Instalación

### Opción 1: GitHub Pages (Recomendado)

1. Haz fork de este repositorio
2. Ve a Settings > Pages
3. Selecciona la rama `main` y carpeta `/ (root)`
4. Tu juego estará en `https://tu-usuario.github.io/infiltra`

### Opción 2: Servidor Local

```bash
# Clona el repositorio
git clone https://github.com/tu-usuario/infiltra.git
cd infiltra

# Opción A: Con Python
python -m http.server 8000

# Opción B: Con Node.js
npx serve

# Abre http://localhost:8000
```

---

## 📁 Estructura del Proyecto

```
infiltra/
├── index.html          # Landing page
├── game.html           # Página del juego
├── css/
│   └── styles.css      # Estilos
├── js/
│   └── game.js         # Lógica del juego
├── assets/
│   ├── avatars/        # Imágenes de avatares
│   ├── frames/         # Marcos para avatares
│   └── sounds/         # Efectos de sonido
└── docs/
    └── ASSETS-GUIDE.md # Guía para agregar assets
```

---

## 🎨 Personalización

### Agregar Avatares, Marcos o Sonidos

Consulta la [Guía de Assets](docs/ASSETS-GUIDE.md) para instrucciones detalladas sobre cómo:
- Agregar nuevos avatares de detective
- Crear marcos personalizados
- Añadir efectos de sonido

### Modificar Categorías de Palabras

Edita el objeto `DB` en `js/game.js`:

```javascript
const DB = {
    "Nueva Categoría 🆕": ["Palabra1", "Palabra2", "Palabra3"],
    // ... más categorías
};
```

---

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Comunicación**: PubNub (tiempo real)
- **QR Codes**: qrcode-generator
- **Hosting**: GitHub Pages (estático)

---

## 📱 Compatibilidad

- ✅ Chrome (Desktop & Mobile)
- ✅ Firefox
- ✅ Safari (Desktop & iOS)
- ✅ Edge
- ✅ Samsung Internet

---

## 🔧 Configuración Avanzada

### Usar PubNub con Claves Propias

Por defecto, INFILTRA usa las claves demo de PubNub. Para producción:

1. Crea una cuenta en [PubNub](https://www.pubnub.com/)
2. Crea un nuevo proyecto y obtén tus claves
3. Actualiza en `js/game.js`:

```javascript
const CONFIG = {
    PUBNUB_PUB_KEY: 'tu-publish-key',
    PUBNUB_SUB_KEY: 'tu-subscribe-key',
    // ...
};
```

---

## 🤝 Contribuir

1. Haz fork del proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

---

## 📬 Contacto

- **Email**: soporte@infiltra.game
- **GitHub Issues**: Para reportar bugs o sugerir mejoras

---

Hecho con ❤️ para noches de juegos con amigos
