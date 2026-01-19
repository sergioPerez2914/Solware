import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Bot, BarChart2, FileSpreadsheet, Clock } from 'lucide-react';

interface Card {
  id: number;
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  details: {
    title: string;
    description: string;
  }[];
}

const cards: Card[] = [
  {
    id: 1,
    title: "Automatización de Facturación",
    description: "Sistema inteligente que automatiza la generación y seguimiento de facturas.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800",
    icon: <FileSpreadsheet className="h-6 w-6 text-white" />,
    details: [
      {
        title: "Generación Automática",
        description: "Creación automática de facturas basada en reglas predefinidas y datos del sistema."
      },
      {
        title: "Seguimiento en Tiempo Real",
        description: "Monitoreo del estado de cada factura y notificaciones automáticas."
      }
    ]
  },
  {
    id: 2,
    title: "Chatbots Inteligentes",
    description: "Asistentes virtuales 24/7 para atención al cliente automatizada.",
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=800",
    icon: <Bot className="h-6 w-6 text-white" />,
    details: [
      {
        title: "IA Conversacional",
        description: "Procesamiento de lenguaje natural para interacciones fluidas y naturales."
      },
      {
        title: "Aprendizaje Continuo",
        description: "Mejora constante basada en interacciones previas y feedback."
      }
    ]
  },
  {
    id: 3,
    title: "Automatización de Marketing",
    description: "Campañas personalizadas basadas en comportamiento del usuario.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    icon: <BarChart2 className="h-6 w-6 text-white" />,
    details: [
      {
        title: "Segmentación Automática",
        description: "Clasificación inteligente de audiencias basada en comportamiento."
      },
      {
        title: "Optimización en Tiempo Real",
        description: "Ajuste automático de campañas según rendimiento y métricas."
      }
    ]
  },
  {
    id: 4,
    title: "Gestión de Procesos",
    description: "Optimización y automatización de flujos de trabajo empresariales.",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800",
    icon: <Clock className="h-6 w-6 text-white" />,
    details: [
      {
        title: "Workflows Inteligentes",
        description: "Automatización de procesos basada en reglas y condiciones."
      },
      {
        title: "Análisis de Eficiencia",
        description: "Métricas detalladas y optimización continua de procesos."
      }
    ]
  }
];

const FlipCardCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flippedCard, setFlippedCard] = useState<number | null>(null);

  const handlePrevious = () => {
    setFlippedCard(null);
    setCurrentIndex((prev) => (prev === 0 ? cards.length - 3 : prev - 1));
  };

  const handleNext = () => {
    setFlippedCard(null);
    setCurrentIndex((prev) => (prev === cards.length - 3 ? 0 : prev + 1));
  };

  const handleFlip = (cardId: number) => {
    setFlippedCard(flippedCard === cardId ? null : cardId);
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative overflow-hidden">
        <div 
          className="flex gap-8 transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (320)}px)` }}
        >
          {cards.map((card) => (
            <div 
              key={card.id}
              className="w-[300px] h-[400px] flex-shrink-0 perspective-1000"
            >
              <div
                className={`relative w-full h-full transition-transform duration-600 transform-style-3d ${
                  flippedCard === card.id ? 'rotate-x-180' : ''
                }`}
              >
                {/* Front of card */}
                <div className="absolute w-full h-full backface-hidden">
                  <div className="h-full bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <div className="bg-blue-600/90 p-2 rounded-lg backdrop-blur-sm">
                          {card.icon}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
                      <p className="text-gray-600 mb-4">{card.description}</p>
                      
                      <button
                        onClick={() => handleFlip(card.id)}
                        className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
                      >
                        Ver detalles
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Back of card */}
                <div className="absolute w-full h-full backface-hidden rotate-x-180">
                  <div className="h-full bg-white rounded-2xl shadow-lg p-6">
                    <div className="space-y-4">
                      {card.details.map((detail, index) => (
                        <div key={index}>
                          <h4 className="text-lg font-semibold text-blue-600 mb-2">
                            {detail.title}
                          </h4>
                          <p className="text-gray-600">
                            {detail.description}
                          </p>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleFlip(card.id)}
                      className="mt-6 inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Volver
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handlePrevious}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
        aria-label="Previous slide"
      >
        <ArrowLeft className="h-6 w-6 text-gray-600" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
        aria-label="Next slide"
      >
        <ArrowRight className="h-6 w-6 text-gray-600" />
      </button>
    </div>
  );
};

export default FlipCardCarousel;