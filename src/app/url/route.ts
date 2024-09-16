// app/api/shorten/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { AppDataSource } from '@/app/lib/ormconfig';
import { Url } from '@/app/entities/Url';
import { connectToDatabase } from '@/app/db';

export async function POST(request: NextRequest) {
  try {
    // Conectar la base de datos antes de realizar cualquier operación
    await connectToDatabase();
    const urlRepository = AppDataSource.getRepository(Url);
    const { originalUrl } = await request.json();

    // Valida que la URL no esté vacía
    if (!originalUrl) {
      return NextResponse.json({ error: 'URL original no puede estar vacía' }, { status: 400 });
    }

    // Generar una URL corta (lógica de generación de URL acortada)
    const generatedShortUrl = generateShortUrl();

    // Crea la nueva entrada de URL en la base de datos
    const newUrl = urlRepository.create({
      originalUrl,
      shortUrl: generatedShortUrl,
    });

    // Guarda la nueva URL en la base de datos
    await urlRepository.save(newUrl);

    // Responde con el objeto creado
    return NextResponse.json(newUrl, { status: 201 });
  } catch (error) {
    console.error('Error creating short URL:', error);
    return NextResponse.json({ error: 'Error creating short URL' }, { status: 500 });
  }
  
};



export async function GET() {

    try {
      await connectToDatabase();
      const urlRepository = AppDataSource.getRepository(Url);
      const urls = await urlRepository.find();
  
      return NextResponse.json(urls, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Error obteniendo las URLs' }, { status: 500 });
    }
  };


 

  
  
  

// Función auxiliar para generar una URL corta (esto es solo un ejemplo)
function generateShortUrl() {
  return Math.random().toString(36).substring(2, 8); // Genera un string corto aleatorio
}

