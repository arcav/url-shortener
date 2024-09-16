import { NextResponse } from 'next/server';
import { AppDataSource } from '@/app/lib/ormconfig'; // Asegúrate de que la conexión a la base de datos está aquí
import { Url } from '@/app/entities/Url'; // La entidad de URL
import { connectToDatabase } from '@/app/db'; // Método para conectar a la base de datos



export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        await connectToDatabase();
        const urlRepository = AppDataSource.getRepository(Url);
        const urlId = parseInt(params.id);

        // Buscar la URL por ID
        const url = await urlRepository.findOne({ where: { id: urlId } });

        if (!url) {
            return NextResponse.json({ error: 'URL no encontrada' }, { status: 404 });
        }

        return NextResponse.json(url, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Error al obtener la URL' }, { status: 500 });
    }
}




export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        await connectToDatabase();
        const urlRepository = AppDataSource.getRepository(Url);
        const urlId = parseInt(params.id);

        // Buscar la URL por ID
        const urlToDelete = await urlRepository.findOne({ where: { id: urlId } });

        if (!urlToDelete) {
            return NextResponse.json({ error: 'URL no encontrada' }, { status: 404 });
        }

        // Eliminar la URL
        await urlRepository.remove(urlToDelete);

        return NextResponse.json({ message: 'URL eliminada con éxito' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Error eliminando la URL' }, { status: 500 });
    }
}
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
      await connectToDatabase();
      const urlRepository = AppDataSource.getRepository(Url);
      const urlId = parseInt(params.id);
  
      // Extraer los datos del cuerpo de la solicitud
      const { originalUrl } = await request.json();
  
      if (!originalUrl) {
        return NextResponse.json({ error: 'El campo originalUrl es obligatorio' }, { status: 400 });
      }
  
      // Buscar la URL por ID
      const urlToUpdate = await urlRepository.findOne({ where: { id: urlId } });
  
      if (!urlToUpdate) {
        return NextResponse.json({ error: 'URL no encontrada' }, { status: 404 });
      }
  
      // Actualizar el originalUrl
      urlToUpdate.originalUrl = originalUrl;
      await urlRepository.save(urlToUpdate);
  
      return NextResponse.json({ message: 'URL actualizada con éxito', data: urlToUpdate }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Error actualizando la URL' }, { status: 500 });
    }
  }