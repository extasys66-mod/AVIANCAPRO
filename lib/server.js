// lib/server.js
// Importa los módulos necesarios
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

// Carga las variables de entorno desde el archivo .env
dotenv.config();

// Crea una instancia de la aplicación Express
const app = express();
const http = require('http');
// Creamos un servidor HTTP a partir del app para usar con socket.io
const server = http.createServer(app);

// Puerto configurable desde variable de entorno o 3000 por defecto
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON en el body de las peticiones
app.use(express.json());

// Nota: al estar en /lib, necesitamos apuntar a la carpeta public en la raíz del proyecto
const publicPath = path.join(__dirname, '..', 'public');

// Middleware para servir los archivos estáticos (HTML, CSS, JS) de la carpeta 'public'
app.use(express.static(publicPath));

// Endpoint para enviar mensajes a Telegram de forma segura
app.post('/api/send-message', async (req, res) => {
    // 'keyboard' se recibe correctamente del frontend
    const { text, keyboard } = req.body; 

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chat_id = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chat_id) {
        return res.status(500).json({ error: 'Las variables de entorno de Telegram no están configuradas en el servidor.' });
    }

    if (!text) {
        return res.status(400).json({ error: 'El texto del mensaje es requerido.' });
    }

    try {
        // Usamos fetch (disponible en Node.js 18+) para comunicarnos con la API de Telegram
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chat_id,
                text: text,
                // 'reply_markup' espera el objeto 'keyboard' que le mandaste
                reply_markup: keyboard, 
            }),
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Error al enviar mensaje a Telegram:', error);
        res.status(500).json({ error: 'Error interno del servidor al contactar a Telegram.' });
    }
});

// Endpoint seguro para verificar la respuesta (callback) de Telegram
app.get('/api/check-update/:messageId', async (req, res) => {
    const { messageId } = req.params;
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chat_id = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chat_id) {
        return res.status(500).json({ error: 'Variables de entorno de Telegram no configuradas.' });
    }

    let updateFound = false;
    const startTime = Date.now();
    const timeout = 60000; // 60 segundos de espera máxima

    // Variable para el offset de getUpdates
    let lastUpdateId = 0;

    // Bucle de "Long Polling"
    while (Date.now() - startTime < timeout && !updateFound) {
        try {
            // Usamos un offset para pedir a Telegram solo actualizaciones nuevas
            const response = await fetch(`https://api.telegram.org/bot${token}/getUpdates?offset=${lastUpdateId + 1}&limit=1`);
            const data = await response.json();

            if (data.ok && data.result.length > 0) {
                // Busca la actualización de callback que coincida con nuestro ID de mensaje
                const relevantUpdate = data.result.find(
                    (update) =>
                    update.callback_query &&
                    update.callback_query.message.message_id == messageId
                );

                // Actualizamos el offset para la próxima petición, incluso si no es nuestro mensaje
                lastUpdateId = data.result[data.result.length - 1].update_id;

                if (relevantUpdate) {
                    updateFound = true;
                    const callbackQuery = relevantUpdate.callback_query;
                    const action = callbackQuery.data.split(':')[0];
                    const user = callbackQuery.from;
                    const userName = user.username ? `@${user.username}` : `${user.first_name} ${user.last_name || ''}`.trim();

                    // Responde a Telegram para que sepa que recibimos el callback
                    await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ callback_query_id: callbackQuery.id })
                    });

                    // Eliminar los botones del mensaje en Telegram
                    await fetch(`https://api.telegram.org/bot${token}/editMessageReplyMarkup`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: chat_id,
                            message_id: messageId,
                            reply_markup: { inline_keyboard: [] } // Un teclado vacío
                        }),
                    });

                    // Enviar notificación al chat de Telegram
                    const notificationText = `${userName} eligió la acción: ${action}.`;
                    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: chat_id,
                            text: notificationText,
                        }),
                    });

                    // Enviar la acción al frontend
                    return res.json({ action });
                }
            }
        } catch (error) {
            console.error('Error durante el polling:', error);
            // Esperar antes de reintentar para no saturar en caso de error de red
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
        // Esperar 2 segundos antes de la siguiente verificación
        if (!updateFound) await new Promise(resolve => setTimeout(resolve, 2000));
    }
    // Si se agota el tiempo, enviar una respuesta de timeout
    return res.status(408).json({ error: 'Timeout: No se recibió respuesta del operador.' });
});

// --- Socket.IO: conteo de visitantes en tiempo real ---
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: { origin: '*' }
});

// Mapa con sockets conectados para información más detallada
const connected = new Map();
// Contador de visitas totales (en memoria). Reinicia al reiniciar el servidor.
let totalVisits = 0;
// Lista de las visitas recientes (máx 200)
const recentVisits = [];

io.on('connection', (socket) => {
    const now = Date.now();
    connected.set(socket.id, { connectedAt: now });

    // Nuevo "visitante" que carga la página / establece socket: incrementamos totalVisits
    totalVisits++;
    // Guardamos en historial de visitas (más reciente primero)
    recentVisits.unshift({ id: socket.id, at: now });
    if (recentVisits.length > 200) recentVisits.length = 200;

    const onlineCount = connected.size;
    // Emitimos estadísticas completas
    const stats = {
        online: onlineCount,
        totalVisits,
        recentVisits: recentVisits.slice(0, 100),
        clients: Array.from(connected.entries()).map(([id, info]) => ({ id, connectedAt: info.connectedAt }))
    };
    io.emit('stats', stats);
    io.emit('count', onlineCount);
    io.emit('details', { count: onlineCount, clients: stats.clients });

    // Permitir que un cliente solicite los detalles bajo demanda
    socket.on('request-details', () => {
        const current = connected.size;
        socket.emit('details', {
            count: current,
            clients: Array.from(connected.entries()).map(([id, info]) => ({ id, connectedAt: info.connectedAt }))
        });
    });

    socket.on('disconnect', () => {
        connected.delete(socket.id);
        const newCount = connected.size;
        const statsAfter = {
            online: newCount,
            totalVisits,
            recentVisits: recentVisits.slice(0, 100),
            clients: Array.from(connected.entries()).map(([id, info]) => ({ id, connectedAt: info.connectedAt }))
        };
        io.emit('stats', statsAfter);
        io.emit('count', newCount);
        io.emit('details', { count: newCount, clients: statsAfter.clients });
    });
});

// --- Ruta Catch-All para servir la SPA ---
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// Iniciar servidor
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
