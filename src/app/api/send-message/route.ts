import { NextResponse } from 'next/server';

// **FUNCIÓN MODIFICADA: Ahora devuelve el texto original (texto plano)**
function escapeMarkdownV2(text: string): string {
  if (!text) {
    return '';
  }
  // Ya no se necesita escapar, simplemente devolvemos el texto.
  return text;
}

export async function POST(request: Request) {
  try {
    const { text, keyboard, message_id } = await request.json();
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.error('ERROR: TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID no están configurados en .env.local');
      return NextResponse.json({ error: 'Configuración de servidor faltante' }, { status: 500 });
    }

    // 1. EDITAR MENSAJE ANTERIOR (Opcional)
    if (message_id) {
      const editResponse = await fetch(`https://api.telegram.org/bot${token}/editMessageReplyMarkup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              chat_id: chatId,
              message_id: message_id,
              reply_markup: { inline_keyboard: [] } // Quitar botones anteriores
          }),
      });
      // Importante: No verificamos el éxito de la edición, ya que puede fallar si es el primer mensaje.
    }

    // 2. ENVIAR EL NUEVO MENSAJE
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: escapeMarkdownV2(text), // Usa la función (que ahora no hace escape)
        reply_markup: keyboard,
        // **CAMBIO CLAVE: parse_mode: 'MarkdownV2' FUE ELIMINADO**
      }),
    });

    const data = await response.json();
    
    // --- LÍNEA DE DEPURACIÓN CLAVE ---
    console.log("Respuesta de Telegram (sendMessage):", data); 
    // ------------------------------------
    
    // 3. Verificar si Telegram aceptó el mensaje
    if (!data.ok) {
        console.error("Telegram error:", data.description);
        return NextResponse.json({ error: `Fallo de Telegram: ${data.description}` }, { status: 500 });
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error al procesar la API Route /send-message:', error);
    return NextResponse.json({ error: 'Error interno en la API Route' }, { status: 500 });
  }
}