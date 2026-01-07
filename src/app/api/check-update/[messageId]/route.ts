import { NextRequest, NextResponse } from 'next/server';

const LONG_POLLING_TIMEOUT = 1200; // Segundos (Telegram permite hasta 60)

/**
 * Esta es la ruta de Long Polling.
 * Se queda esperando una actualización (callback_query) de Telegram
 * que corresponda al messageId que se está consultando.
 */
export async function GET(
  request: NextRequest, // Corregido: de Request a NextRequest
  { params }: { params: Promise<{ messageId: string }> }
) {
  const { messageId } = await params;
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return NextResponse.json({ error: 'Configuración de servidor faltante' }, { status: 500 });
  }

  try {
    // Hacemos una petición de long polling a Telegram
    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/getUpdates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        offset: -1, // Obtener solo la última actualización
        timeout: LONG_POLLING_TIMEOUT,
        allowed_updates: ['callback_query'],
      }),
    });

    if (!telegramResponse.ok) {
      const errorData = await telegramResponse.json();
      console.error("Error en getUpdates de Telegram:", errorData);
      return NextResponse.json({ error: 'Fallo al contactar Telegram' }, { status: 502 });
    }

    const { result } = await telegramResponse.json();

    // Buscamos una acción (callback_query) que corresponda a nuestro message_id
    const relevantUpdate = result.find(
      (update: any) => update.callback_query?.message?.message_id.toString() === messageId
    );

    if (relevantUpdate) {
      const action = relevantUpdate.callback_query.data.split(':')[0];
      // Encontramos una acción, la devolvemos al cliente
      return NextResponse.json({ action });
    } else {
      // No se encontró una acción para este messageId, devolvemos timeout
      return new NextResponse('Timeout', { status: 408 });
    }

  } catch (error) {
    console.error('Error en la ruta de check-update:', error);
    return NextResponse.json({ error: 'Error interno en la API de check-update' }, { status: 500 });
  }
}
