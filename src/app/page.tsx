'use client';
import { useEffect, useState } from 'react';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { GrUpdate } from 'react-icons/gr';

// Define la interfaz para los datos de URL
interface UrlData {
    id: number;
    originalUrl: string;
    shortUrl: string;
    clickCount: number;
}

export default function Home() {
    // Estados para manejar las URLs y el modal
    const [originalUrl, setOriginalUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [urls, setUrls] = useState<UrlData[]>([]);
    const [showTable, setShowTable] = useState(false); // Controla la visibilidad de la tabla
    const [showModal, setShowModal] = useState(false); // Controla la visibilidad del modal
    const [editUrl, setEditUrl] = useState<UrlData | null>(null); // URL que se está editando
    const [newOriginalUrl, setNewOriginalUrl] = useState('');

    // URL base para las peticiones a la API
    const URL = process.env.NEXT_PUBLIC_API_URL;

    // Obtiene la lista de URLs acortadas desde la API
    useEffect(() => {
        fetchUrls();
    }, []);

    const fetchUrls = async () => {
        try {
            const response = await fetch(`${URL}/url`);
            const data = await response.json();
            if (response.ok) {
                setUrls(data);
            } else {
                alert('Error al obtener URLs');
            }
        } catch (error) {
            console.error('Error al conectar con la API:', error);
        }
    };

    // Envía una nueva URL para acortarla
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`${URL}/url`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ originalUrl }),
            });

            const data = await response.json();
            if (response.ok) {
                setShortUrl(data.shortUrl);
                fetchUrls(); // Actualiza la lista de URLs después de acortar una
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error al conectar con la API:', error);
        }
    };

    // Elimina una URL acortada
    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`${URL}/url/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Elimina la URL del estado local
                setUrls(urls.filter((url) => url.id !== id));
            } else {
                console.error('Error al eliminar la URL');
            }
        } catch (error) {
            console.error('Error al conectar con la API:', error);
        }
    };

    // Actualiza una URL existente
    const handleUpdate = async (id: number, newOriginalUrl: string) => {
        try {
            // Primero, genera una nueva URL acortada

            // Actualiza la URL original y la URL acortada en la base de datos
            await fetch(`${URL}/url/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    originalUrl: newOriginalUrl,
                    shortUrl: shortUrl,
                }),
            });

            // Cierra el modal y actualiza el estado de las URLs
            setShowModal(false);
            fetchUrls(); // Función para obtener la lista de URLs actualizada
        } catch (error) {
            console.error('Error al actualizar la URL:', error);
        }
    };

    // Abre el modal para editar una URL
    const openModal = (url: UrlData) => {
        setEditUrl(url);
        setNewOriginalUrl(url.originalUrl);
        setShowModal(true);
    };

    return (
        <div className='w-screen h-screen bg-gray-50 flex flex-col items-center justify-center text-gray-800'>
            <h1 className='text-2xl font-semibold mb-6'>Acortador de URLs</h1>
            <form
                className='flex flex-col items-center space-y-4'
                onSubmit={handleSubmit}>
                <label className='flex flex-col text-sm'>
                    URL Original:
                    <input
                        type='url'
                        value={originalUrl}
                        onChange={(e) => setOriginalUrl(e.target.value)}
                        required
                        className='mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent'
                    />
                </label>
                <button
                    type='submit'
                    className='bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400'>
                    Acortar URL
                </button>
            </form>
            {shortUrl && (
                <div className='mt-6 text-center flex flex-row'>
                    <h2 className='text-lg font-medium'>URL Acortada:</h2>
                    <p className='text-blue-500'>
                        <a
                            href={`${originalUrl}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='underline'>
                            {URL}/{shortUrl}
                        </a>
                    </p>
                </div>
            )}
            <button
                onClick={() => setShowTable(!showTable)}
                className='mt-6 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400'>
                {showTable ? 'Ocultar URLs' : 'Mostrar URLs'}
            </button>
            {showTable && (
                <div className='mt-6 w-full max-w-4xl overflow-x-auto'>
                    <h2 className='text-xl font-semibold mb-4'>
                        URLs Acortadas
                    </h2>
                    <table className='min-w-full bg-white border border-gray-300 rounded-md'>
                        <thead>
                            <tr className='border-b'>
                                <th className='p-2 text-left'>URL Acortada</th>
                                <th className='p-2 text-left'>Clicks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {urls.map((url) => (
                                <tr key={url.id} className='border-b'>
                                    <td className='p-2 w-11/12 flex justify-end items-center'>
                                        <p className='text-blue-500 hover:text-blue-700 transition-colors duration-300'>
                                            <a
                                                href={`${url.originalUrl}`}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                className='underline hover:no-underline'>
                                                {URL}/{url.shortUrl}
                                            </a>
                                        </p>
                                        <div className='mx-2 flex items-center'>
                                            <button
                                                className='w-8 mx-4 bg-red-500 hover:bg-red-600 hover:scale-110 transition-transform duration-200 rounded-full p-1'
                                                onClick={() =>
                                                    handleDelete(url.id)
                                                }>
                                                <RiDeleteBin5Line className='text-white w-6 h-6' />
                                            </button>
                                            <button
                                                className='w-8 bg-green-500 hover:bg-green-600 hover:scale-110 transition-transform duration-200 rounded-full p-1'
                                                onClick={() => openModal(url)}>
                                                <GrUpdate className='text-white w-6 h-6' />
                                            </button>
                                        </div>
                                    </td>
                                    <td className='p-2 text-center'>
                                        {url.clickCount}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Modal para editar URL */}
                    {showModal && editUrl && (
                        <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center'>
                            <div className='bg-white p-6 rounded-md shadow-lg'>
                                <h2 className='text-xl font-semibold mb-4'>
                                    Editar URL
                                </h2>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleUpdate(
                                            editUrl.id,
                                            newOriginalUrl,
                                        );
                                    }}
                                    className='flex flex-col space-y-4'>
                                    <label className='flex flex-col text-sm'>
                                        <span className='font-medium mb-2'>
                                            URL Original
                                        </span>
                                        <input
                                            type='text'
                                            value={newOriginalUrl}
                                            onChange={(e) =>
                                                setNewOriginalUrl(
                                                    e.target.value,
                                                )
                                            }
                                            className='p-2 border border-gray-300 rounded-md'
                                            required
                                        />
                                    </label>
                                    <div className='flex justify-end space-x-4'>
                                        <button
                                            type='button'
                                            onClick={() => setShowModal(false)}
                                            className='px-4 py-2 bg-gray-300 text-gray-800 rounded-md'>
                                            Cancelar
                                        </button>
                                        <button
                                            type='submit'
                                            className='px-4 py-2 bg-blue-600 text-white rounded-md'>
                                            Actualizar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
