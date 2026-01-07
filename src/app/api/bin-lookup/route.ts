import { NextResponse } from 'next/server';

// Esta función maneja las peticiones GET a /api/bin-lookup
export async function GET(request: Request) {
  // 1. Extraemos los parámetros de la URL (ej: ?bin=123456)
  const { searchParams } = new URL(request.url);
  const bin = searchParams.get('bin');

  // 2. Validamos que el parámetro 'bin' exista y tenga una longitud mínima
  if (!bin || bin.length < 6) {
    return NextResponse.json({ error: 'Valid BIN is required' }, { status: 400 });
  }

  try {
    // 3. Hacemos la llamada a la API externa DESDE EL SERVIDOR
    // Esto evita los errores de CORS y 'Forbidden' que tenías antes.
    const apiResponse = await fetch(`https://lookup.binlist.net/${bin}`, {
      headers: {
        // Algunas APIs requieren cabeceras específicas, es bueno incluirla.
        'Accept-Version': '3',
      },
    });

    // 4. Si la API externa responde con un error, lo pasamos a nuestro frontend
    if (!apiResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch bank info from external API' },
        { status: apiResponse.status } // Usamos el mismo código de error (ej. 404 si el BIN no existe)
      );
    }

    // 5. Si todo sale bien, tomamos la respuesta JSON y la enviamos a nuestro frontend
    const data = await apiResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    // 6. Si hay un error de red al intentar conectar con la API externa, devolvemos un error 500
    console.error('Error in bin-lookup API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
