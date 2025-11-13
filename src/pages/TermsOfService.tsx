'use client'

function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Términos de Servicio
          </h1>
          <p className="text-lg text-gray-600">
            Ecuador Contrapunto - Generación de Videos
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Los términos de servicio completos están disponibles en nuestros servidores oficiales.
              Por favor, visite el siguiente enlace para revisar los términos completos:
            </p>

            {import.meta.env.VITE_TERMS_URL &&
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  📋 Términos de Servicio Oficiales
                </h3>
                <p className="text-blue-800 mb-4">
                  Acceda a los términos completos de servicio de Ecuador Contrapunto
                </p>
                <a
                  href={import.meta.env.VITE_TERMS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Ver Términos de Servicio
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            }

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Información General
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Esta aplicación permite generar videos a partir de texto o videos existentes</li>
                <li>Los servicios están sujetos a los términos de Kolectivo Media LLC</li>
                <li>El uso de la aplicación requiere una cuenta válida</li>
                <li>Los contenidos generados son propiedad del usuario</li>
                <li>Se aplican restricciones de uso ético y legal</li>
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Contacto
              </h2>
              <p className="text-gray-700">
                Para preguntas sobre estos términos o el servicio, por favor contacte al soporte técnico.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsOfService