'use client'

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Política de Privacidad
          </h1>
          <p className="text-lg text-gray-600">
            Ecuador Contrapunto - Generación de Videos
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              La política de privacidad completa está disponible en nuestros servidores oficiales.
              Por favor, visite el siguiente enlace para revisar la política completa:
            </p>

            {import.meta.env.VITE_PRIVACY_URL &&
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  🔒 Política de Privacidad Oficial
                </h3>
                <p className="text-green-800 mb-4">
                  Acceda a la política completa de privacidad de Ecuador Contrapunto
                </p>
                <a
                  href={import.meta.env.VITE_PRIVACY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Ver Política de Privacidad
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            }
            
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Información General sobre Privacidad
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Recopilamos información necesaria para proporcionar el servicio de generación de videos</li>
                <li>Los datos personales se manejan de acuerdo con las políticas de Kolectivo Media LLC</li>
                <li>Los contenidos generados se almacenan de forma segura</li>
                <li>No compartimos datos personales con terceros sin consentimiento</li>
                <li>Los usuarios tienen derecho a acceder y eliminar sus datos</li>
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Tipos de Datos Recopilados
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Información de cuenta (email, credenciales)</li>
                <li>Contenido generado (videos, textos)</li>
                <li>Datos de uso de la aplicación</li>
                <li>Información técnica del dispositivo</li>
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Contacto
              </h2>
              <p className="text-gray-700">
                Para preguntas sobre privacidad o solicitudes de eliminación de datos,
                por favor contacte al equipo de soporte técnico.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy