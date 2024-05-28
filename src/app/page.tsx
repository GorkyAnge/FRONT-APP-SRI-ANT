'use client'
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function Home() {
  const [cedula, setCedula] = useState('');
  const [contribuyente, setContribuyente] = useState(null);
  const [puntos, setPuntos] = useState(0);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cedulaConCodigo = `${cedula}`;

    // Mostrar la alerta de "Cargando"
    const loadingAlert = Swal.fire({
      title: "Cargando",
      html: "Estamos buscando la información...",
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      // Verificar si es contribuyente del SRI
      const resContribuyente = await fetch(`http://localhost:8083/sri/contribuyente?cedula=${cedulaConCodigo}001`);
      const isContribuyente = await resContribuyente.json();
      setContribuyente(isContribuyente);

      if (isContribuyente) {
        // Obtener puntos de la licencia
        const resPuntos = await fetch(`/puntos/${cedulaConCodigo}`);
        const puntosResponse = await resPuntos.text();
        const puntos = parseFloat(puntosResponse.replace(',', '.'));
        setPuntos(puntos);
      } else {
        setPuntos(0);
      }

      // Cerrar la alerta de "Cargando" y mostrar la alerta de éxito
      loadingAlert.close();
      Swal.fire({
        icon: "success",
        title: "¡Búsqueda exitosa!",
        text: "Los datos han sido cargados correctamente.",
      });
    } catch (error) {
      // Cerrar la alerta de "Cargando" y mostrar el mensaje de error
      loadingAlert.close();
      setError('Hubo un problema con la solicitud. Intenta nuevamente.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-slate-600">
      <h1 className="text-3xl font-bold mb-4">Verificación de Contribuyente y Puntos de Licencia</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
        <input
          type="text"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
          placeholder="Ingrese su cédula"
          className="border p-2 rounded text-black"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Verificar</button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {contribuyente !== null && (
        <div className="mt-4">
          {contribuyente ? (
            <p>Es un contribuyente del SRI.</p>
          ) : (
            <p>No es un contribuyente del SRI.</p>
          )}
          {puntos !== null && <p>Puntos de la licencia: {puntos}</p>}
        </div>
      )}
    </div>
  );
}
