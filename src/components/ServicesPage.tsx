import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, ChevronLeft, ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Particles from './Particles'
import Header from './Header'
import WhatsAppButton from './WhatsAppButton'
import ButtonMessageBot from './ButtonMessageBot'

const ServicesPage: React.FC = () => {
  const { t } = useTranslation()
  const [isInitialSlide, setIsInitialSlide] = useState(true)
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0)
  const [currentPointIndex, setCurrentPointIndex] = useState(0)
  const [previousServiceIndex, setPreviousServiceIndex] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  
  // Detectar si cambió de servicio
  const isServiceChange = previousServiceIndex !== currentServiceIndex
  
  const services = [
    {
      id: 'automatizacion',
      title: t('services.automatizacion.title'),
      subtitle: t('services.automatizacion.description'),
      image: 'https://lafysstpyiejevhrlmzc.supabase.co/storage/v1/object/public/imagenes/Servicios/automatizacion.webp',
      points: [
        {
          title: t('services.automatizacion.details.0.title'),
          description: t('services.automatizacion.details.0.description'),
        },
        {
          title: t('services.automatizacion.details.1.title'),
          description: t('services.automatizacion.details.1.description'),
        },
        {
          title: t('services.automatizacion.details.2.title'),
          description: t('services.automatizacion.details.2.description'),
        }
      ]
    },
    {
      id: 'agentes',
      title: t('services.agentes.title'),
      subtitle: t('services.agentes.description'),
      image: 'https://lafysstpyiejevhrlmzc.supabase.co/storage/v1/object/public/imagenes/Servicios/Agentes%20ia2.webp',
      points: [
        {
          title: t('services.agentes.details.0.title'),
          description: t('services.agentes.details.0.description'),
        },
        {
          title: t('services.agentes.details.1.title'),
          description: t('services.agentes.details.1.description'),
        }
      ]
    },
    {
      id: 'desarrollo',
      title: t('services.desarrollo.title'),
      subtitle: t('services.desarrollo.description'),
      image: 'https://lafysstpyiejevhrlmzc.supabase.co/storage/v1/object/public/imagenes/Servicios/Desarrollomovilydesktop.webp',
      points: [
        {
          title: t('services.desarrollo.details.0.title'),
          description: t('services.desarrollo.details.0.description'),
        },
        {
          title: t('services.desarrollo.details.2.title'),
          description: t('services.desarrollo.details.2.description'),
        }
      ]
    },
    {
      id: 'digitalizacion',
      title: t('services.digitalizacion.title'),
      subtitle: t('services.digitalizacion.description'),
      image: 'https://lafysstpyiejevhrlmzc.supabase.co/storage/v1/object/public/imagenes/Servicios/Digitalizaci%C3%B3n.webp',
      points: [
        {
          title: t('services.digitalizacion.details.0.title'),
          description: t('services.digitalizacion.details.0.description'),
        },
        {
          title: t('services.digitalizacion.details.1.title'),
          description: t('services.digitalizacion.details.1.description'),
        }
      ]
    },
    {
      id: 'soporte',
      title: t('services.soporte.title'),
      subtitle: t('services.soporte.description'),
      image: 'https://lafysstpyiejevhrlmzc.supabase.co/storage/v1/object/public/imagenes/Servicios/Soporte.webp',
      points: [
        {
          title: t('services.soporte.details.0.title'),
          description: t('services.soporte.details.0.description'),
        },
        {
          title: t('services.soporte.details.2.title'),
          description: t('services.soporte.details.2.description'),
        }
      ]
    },
  ]

  // Navegación total de elementos
  const getTotalItems = () => {
    return services.reduce((total, service) => total + service.points.length, 0)
  }

  const getCurrentGlobalIndex = () => {
    let globalIndex = 0
    for (let i = 0; i < currentServiceIndex; i++) {
      globalIndex += services[i].points.length
    }
    return globalIndex + currentPointIndex
  }

  const getServiceAndPointFromGlobalIndex = (globalIndex: number) => {
    let serviceIndex = 0
    let pointIndex = globalIndex
    
    for (let i = 0; i < services.length; i++) {
      if (pointIndex < services[i].points.length) {
        serviceIndex = i
        break
      }
      pointIndex -= services[i].points.length
      serviceIndex = i + 1
    }
    
    return { serviceIndex, pointIndex }
  }

  const navigateToNext = () => {
    if (isInitialSlide) {
      setIsInitialSlide(false)
      return
    }
    
    const currentGlobal = getCurrentGlobalIndex()
    const totalItems = getTotalItems()
    
    if (currentGlobal < totalItems - 1) {
      const nextGlobal = currentGlobal + 1
      const { serviceIndex, pointIndex } = getServiceAndPointFromGlobalIndex(nextGlobal)
      
      // Actualizar servicio anterior si cambió
      if (serviceIndex !== currentServiceIndex) {
        setPreviousServiceIndex(currentServiceIndex)
      }
      
      setCurrentServiceIndex(serviceIndex)
      setCurrentPointIndex(pointIndex)
    } else {
      // Si está en el último slide, volver al slide inicial
      setPreviousServiceIndex(currentServiceIndex)
      setIsInitialSlide(true)
      setCurrentServiceIndex(0)
      setCurrentPointIndex(0)
    }
  }

  const navigateToPrev = () => {
    if (isInitialSlide) {
      // Desde el slide inicial, ir al último slide
      const totalItems = getTotalItems()
      const { serviceIndex, pointIndex } = getServiceAndPointFromGlobalIndex(totalItems - 1)
      
      setPreviousServiceIndex(0)
      setIsInitialSlide(false)
      setCurrentServiceIndex(serviceIndex)
      setCurrentPointIndex(pointIndex)
    } else {
      const currentGlobal = getCurrentGlobalIndex()
      
      if (currentGlobal > 0) {
        const prevGlobal = currentGlobal - 1
        const { serviceIndex, pointIndex } = getServiceAndPointFromGlobalIndex(prevGlobal)
        
        // Actualizar servicio anterior si cambió
        if (serviceIndex !== currentServiceIndex) {
          setPreviousServiceIndex(currentServiceIndex)
        }
        
        setCurrentServiceIndex(serviceIndex)
        setCurrentPointIndex(pointIndex)
      } else {
        setIsInitialSlide(true)
      }
    }
  }

  // Manejo del scroll para navegación
  useEffect(() => {
    let lastScrollTime = 0
    const scrollThrottle = 800 // Tiempo entre navegaciones en ms

    const handleWheel = (e: WheelEvent) => {
      // Detectar si es scroll horizontal o shift+scroll
      const hasHorizontalScroll = Math.abs(e.deltaX) > 10
      const isShiftScroll = e.shiftKey && Math.abs(e.deltaY) > 10
      
      // En desktop, también permitir scroll vertical normal para cambiar slides
      const isDesktop = window.innerWidth >= 768
      const isVerticalScroll = !hasHorizontalScroll && !e.shiftKey && Math.abs(e.deltaY) > 10
      
      const shouldNavigate = hasHorizontalScroll || isShiftScroll || (isDesktop && isVerticalScroll)
      
      if (shouldNavigate) {
        e.preventDefault()
        
        const now = Date.now()
        if (now - lastScrollTime < scrollThrottle) return
        
        if (!isScrolling) {
          setIsScrolling(true)
          
          // Determinar dirección basada en el tipo de scroll
          let delta = 0
          if (hasHorizontalScroll) {
            delta = e.deltaX
          } else if (isShiftScroll || (isDesktop && isVerticalScroll)) {
            delta = e.deltaY
          }
          
          if (delta > 0) {
            navigateToNext()
          } else if (delta < 0) {
            navigateToPrev()
          }
          
          lastScrollTime = now
          
          setTimeout(() => {
            setIsScrolling(false)
          }, scrollThrottle)
        }
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Solo flechas horizontales cambian slides, verticales permiten scroll normal
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        navigateToNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        navigateToPrev()
      }
      // ArrowUp y ArrowDown ahora permiten scroll vertical normal
    }

    // Variables para manejar touch/swipe
    let touchStartX = 0
    let touchStartY = 0
    let touchStartTime = 0

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      touchStartX = touch.clientX
      touchStartY = touch.clientY
      touchStartTime = Date.now()
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!e.changedTouches[0]) return
      
      const touch = e.changedTouches[0]
      const touchEndX = touch.clientX
      const touchEndY = touch.clientY
      const touchEndTime = Date.now()
      
      const deltaX = touchEndX - touchStartX
      const deltaY = touchEndY - touchStartY
      const deltaTime = touchEndTime - touchStartTime
      
      // Solo considerar swipes rápidos (menos de 500ms) y con suficiente distancia
      if (deltaTime > 500) return
      
      const minSwipeDistance = 50
      const maxVerticalDistance = 100
      
      // Solo swipe horizontal (izquierda/derecha) - el vertical se permite para scroll normal
      if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaY) < maxVerticalDistance) {
        if (deltaX > 0) {
          // Swipe hacia la derecha - ir al slide anterior
          navigateToPrev()
        } else {
          // Swipe hacia la izquierda - ir al siguiente slide
          navigateToNext()
        }
      }
      // El swipe vertical ahora se permite para scroll normal del contenido
    }

    // Solo aplicar en el área de contenido principal
    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      mainContent.addEventListener('wheel', handleWheel, { passive: false })
      mainContent.addEventListener('touchstart', handleTouchStart, { passive: true })
      mainContent.addEventListener('touchend', handleTouchEnd, { passive: true })
    }
    
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      if (mainContent) {
        mainContent.removeEventListener('wheel', handleWheel)
        mainContent.removeEventListener('touchstart', handleTouchStart)
        mainContent.removeEventListener('touchend', handleTouchEnd)
      }
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentServiceIndex, currentPointIndex, isScrolling, isInitialSlide])

  // Actualizar previousServiceIndex después de la animación
  useEffect(() => {
    if (isServiceChange) {
      const timer = setTimeout(() => {
        setPreviousServiceIndex(currentServiceIndex)
      }, 800) // Coincide con la duración de la animación de cambio de servicio
      
      return () => clearTimeout(timer)
    }
  }, [currentServiceIndex, isServiceChange])

  const getGenericImage = (serviceId: string, pointIndex: number) => {
    // Different generic images for each service point
    const images = {
      automatizacion: [
        'https://images.unsplash.com/photo-1551434678-e076c223a692?w=500&h=300&fit=crop&crop=center', // Automation workflow
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop&crop=center', // Process optimization
        'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=500&h=300&fit=crop&crop=center'  // Data analysis
      ],
      agentes: [
        'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop&crop=center', // AI robot
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=300&fit=crop&crop=center', // Chatbot interface
        'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500&h=300&fit=crop&crop=center'  // AI assistant
      ],
      desarrollo: [
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=300&fit=crop&crop=center', // Coding screen
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=300&fit=crop&crop=center', // Web development
        'https://images.unsplash.com/photo-1547658719-da2b51169166?w=500&h=300&fit=crop&crop=center'  // Mobile app
      ],
      digitalizacion: [
        'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=500&h=300&fit=crop&crop=center', // UI design mockup
        'https://images.unsplash.com/photo-1558655146-d09347e92766?w=500&h=300&fit=crop&crop=center', // User experience design
        'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=500&h=300&fit=crop&crop=center'  // Digital interface design
      ],
      soporte: [
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop&crop=center', // Presentation
        'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=500&h=300&fit=crop&crop=center', // Graphic design workspace
        'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=500&h=300&fit=crop&crop=center'  // Business presentation
      ]
    }
    
    return images[serviceId as keyof typeof images]?.[pointIndex] || 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=300&fit=crop&crop=center'
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 overflow-x-hidden w-full">
      {/* Background particles */}
      <Particles />
      
      {/* Header Component */}
      <Header />

      {/* Main Content with Fixed Layout */}
      <main id="main-content" className="relative min-h-screen md:h-screen overflow-y-auto md:overflow-hidden overflow-x-hidden w-full max-w-full pb-16 md:pb-14">
        <AnimatePresence mode="wait">
          {isInitialSlide ? (
            // Initial Slide - Soluciones Digitales Integrales
            <motion.section
              key="initial-slide"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900 flex items-center justify-center py-16 md:py-24 lg:py-28 xl:py-24 2xl:py-32 w-full overflow-hidden"
            >
              <div className="max-w-4xl xl:max-w-4xl 2xl:max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 text-center w-full flex flex-col justify-center min-h-[calc(100vh-4rem)] md:min-h-0">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-4xl sm:text-5xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-8xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 md:mb-6 lg:mb-6 xl:mb-8 2xl:mb-10"
                >
                  {t('services.title')}
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-lg sm:text-xl md:text-xl lg:text-xl xl:text-2xl 2xl:text-4xl text-gray-600 dark:text-gray-300 mb-12 sm:mb-16 md:mb-8 lg:mb-8 xl:mb-10 2xl:mb-12 leading-relaxed px-2"
                >
                  {t('services.shortDescription')}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="flex flex-col items-center space-y-6 sm:space-y-8 md:space-y-5 lg:space-y-6 2xl:space-y-8"
                >
                  {/* Indicativo desktop */}
                  <div className="hidden md:block text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl text-gray-500 dark:text-gray-400 text-center">
                    {t('services.navigation.initial.desktop')}
                  </div>
                  
                  {/* Indicativo móvil con animación de swipe */}
                  <div className="md:hidden flex flex-col items-center space-y-4 sm:space-y-5">
                    <div className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 text-center px-4">
                      {t('services.navigation.initial.mobile')}
                    </div>
                    <div className="flex items-center space-x-3 text-blue-600 dark:text-blue-400">
                      <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 animate-pulse" />
                      <div className="w-10 sm:w-12 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></div>
                      <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 animate-pulse" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.section>
          ) : (
            // Service Content
            <motion.section
              key={`service-${currentServiceIndex}`}
              initial={{ 
                opacity: 0, 
                scale: 0.9,
                rotateY: -15
              }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                rotateY: 0
              }}
              exit={{ 
                opacity: 0, 
                scale: 1.1,
                rotateY: 15
              }}
              transition={{ 
                duration: 0.8, 
                ease: [0.43, 0.13, 0.23, 0.96]
              }}
              className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 py-16 md:py-24 lg:py-28 xl:py-24 2xl:py-28 md:pt-24 md:pb-4 w-full overflow-hidden"
              style={{ perspective: 1000 }}
            >
              <div className="max-w-7xl xl:max-w-7xl 2xl:max-w-[100rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 md:min-h-screen flex flex-col justify-start md:justify-center md:pt-0 w-full">
                {/* Service Header - Solo cambia cuando cambia de servicio */}
                <motion.div 
                  className="text-center mb-6 sm:mb-8 md:mb-6 lg:mb-6 xl:mb-8 2xl:mb-10"
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <motion.h2 
                    className="text-3xl sm:text-4xl md:text-4xl lg:text-4xl xl:text-5xl 2xl:text-7xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-5 md:mb-4 lg:mb-4 xl:mb-5 2xl:mb-6"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    {services[currentServiceIndex].title}
                  </motion.h2>
                  
                  <motion.p 
                    className="text-lg sm:text-xl md:text-xl lg:text-xl xl:text-2xl 2xl:text-4xl text-gray-600 dark:text-gray-300 max-w-2xl lg:max-w-3xl xl:max-w-3xl 2xl:max-w-5xl mx-auto px-2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    {services[currentServiceIndex].subtitle}
                  </motion.p>
                </motion.div>

                {/* Current Point Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`point-${currentPointIndex}`}
                    initial={isServiceChange ? { 
                      // Animación espectacular para cambio de servicio
                      opacity: 0, 
                      scale: 0.8,
                      rotateX: 45,
                      y: 100
                    } : { 
                      // Animación suave para cambio de punto
                      opacity: 0, 
                      y: 30
                    }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      rotateX: 0,
                      y: 0
                    }}
                    exit={isServiceChange ? { 
                      // Salida espectacular para cambio de servicio
                      opacity: 0, 
                      scale: 1.2,
                      rotateX: -45,
                      y: -100
                    } : { 
                      // Salida suave para cambio de punto
                      opacity: 0, 
                      y: -30
                    }}
                    transition={isServiceChange ? { 
                      // Transición más larga y dramática para cambio de servicio
                      duration: 0.8, 
                      ease: [0.68, -0.55, 0.265, 1.55]
                    } : { 
                      // Transición rápida y suave para cambio de punto
                      duration: 0.4, 
                      ease: "easeInOut" 
                    }}
                    className={`flex flex-col gap-6 sm:gap-8 md:gap-6 lg:gap-6 xl:gap-8 2xl:gap-12 flex-1 mt-0 md:-mt-4 lg:-mt-4 xl:-mt-6 2xl:-mt-8 px-0 sm:px-0 lg:px-0 xl:px-0 lg:items-center w-full ${
                      // En mobile alternar imagen arriba/abajo, en desktop alternar izquierda/derecha
                      (currentServiceIndex + currentPointIndex) % 2 === 0 
                        ? 'lg:flex-row' 
                        : 'lg:flex-row-reverse'
                    }`}
                  >
                    {/* Image - Mobile: arriba alternando, Desktop: lado alternando */}
                    <div className={`w-full max-w-lg md:max-w-xl lg:max-w-xl xl:max-w-2xl 2xl:max-w-4xl mx-auto lg:mx-0 lg:flex-1 ${
                      (currentServiceIndex + currentPointIndex) % 2 === 0 
                        ? 'order-first' 
                        : 'order-last lg:order-first'
                    }`}>
                      <div className="relative overflow-hidden rounded-xl md:rounded-2xl lg:rounded-2xl xl:rounded-3xl shadow-lg ring-4 md:ring-4 lg:ring-5 ring-blue-500/50 dark:ring-blue-400/50 h-56 sm:h-64 md:h-64 lg:h-64 xl:h-80 2xl:h-[28rem]">
                        <img
                          src={getGenericImage(services[currentServiceIndex].id, currentPointIndex)}
                          alt={services[currentServiceIndex].points[currentPointIndex].title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className={`w-full max-w-lg md:max-w-xl lg:max-w-xl xl:max-w-2xl 2xl:max-w-4xl mx-auto lg:mx-0 lg:flex-1 space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 2xl:space-y-8 lg:flex lg:flex-col lg:justify-center ${
                      (currentServiceIndex + currentPointIndex) % 2 === 0 
                        ? 'order-last' 
                        : 'order-first lg:order-last'
                    }`}>
                      <div className="flex items-start space-x-3 sm:space-x-4 md:space-x-4 lg:space-x-4 xl:space-x-5 2xl:space-x-6 px-2 sm:px-0">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 2xl:w-14 2xl:h-14 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-blue-600 dark:bg-blue-500 text-white">
                          <CheckCircle className="w-5 h-5 sm:w-5 sm:h-5 md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-8 2xl:h-8" />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-3xl 2xl:text-5xl font-bold mb-3 sm:mb-4 md:mb-3 lg:mb-3 xl:mb-4 2xl:mb-5 text-blue-600 dark:text-blue-400">
                            {services[currentServiceIndex].points[currentPointIndex].title}
                          </h3>
                          
                          <p className="text-base sm:text-lg md:text-lg lg:text-lg xl:text-xl 2xl:text-3xl text-gray-600 dark:text-gray-300 leading-relaxed">
                            {services[currentServiceIndex].points[currentPointIndex].description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Indicators */}
                <div className="flex flex-col items-center space-y-3 md:space-y-4 lg:space-y-5 2xl:space-y-6 mt-0 sm:mt-4 md:mt-8 lg:mt-10 xl:mt-12 2xl:mt-16 mb-2 md:mb-6 lg:mb-0">
                  {/* Service Points Progress - Hidden */}
                  <div className="flex space-x-2 hidden">
                    {services[currentServiceIndex].points.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPointIndex(index)}
                        className={`w-3 h-3 md:w-4 md:h-4 lg:w-4 lg:h-4 2xl:w-5 2xl:h-5 rounded-full transition-all duration-300 ${
                          index === currentPointIndex
                            ? 'bg-blue-600 dark:bg-blue-400 scale-125'
                            : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Service Navigation - Hidden */}
                  <div className="flex space-x-2 hidden">
                    {services.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (index !== currentServiceIndex) {
                            setPreviousServiceIndex(currentServiceIndex)
                          }
                          setCurrentServiceIndex(index)
                          setCurrentPointIndex(0)
                        }}
                        className={`w-4 h-4 md:w-5 md:h-5 lg:w-5 lg:h-5 2xl:w-6 2xl:h-6 rounded-full transition-all duration-300 ${
                          index === currentServiceIndex
                            ? 'bg-blue-600 dark:bg-blue-400 scale-125'
                            : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Progress Info */}
                  <div className="text-center text-xs sm:text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl text-gray-500 dark:text-gray-400">
                    <span className="font-medium">{getCurrentGlobalIndex() + 1}</span> / <span>{getTotalItems()}</span>
                  </div>
                  
                  {/* Navigation Instructions */}
                  <div className="flex flex-col items-center space-y-3 sm:space-y-4 mt-4 sm:mt-5 md:mt-6">
                    {/* Desktop Navigation Text */}
                    <div className="hidden md:block text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl text-gray-500 dark:text-gray-400 text-center">
                      {t('services.navigation.slides.desktop')}
                    </div>
                    
                    {/* Mobile Navigation with Icons */}
                    <div className="md:hidden flex flex-col items-center space-y-3">
                      <div className="text-sm sm:text-base text-gray-500 dark:text-gray-400 text-center px-4">
                        {t('services.navigation.slides.mobile')}
                      </div>
                      <div className="flex items-center space-x-3 text-blue-600 dark:text-blue-400">
                        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
                        <div className="w-8 sm:w-10 h-1 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></div>
                        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

      </main>

      {/* Call to Action - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl lg:max-w-5xl xl:max-w-5xl 2xl:max-w-7xl mx-auto text-center px-4 sm:px-6 md:px-8 lg:px-10 xl:px-10 py-2 md:py-2.5 lg:py-2.5 xl:py-3 2xl:py-3.5">
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 lg:gap-8 xl:gap-10 justify-center items-center">
            {/* Navigation Button */}
            <div className="inline-flex items-center px-4 sm:px-6 md:px-8 lg:px-8 xl:px-10 2xl:px-12 py-1.5 sm:py-2 md:py-2 lg:py-2 xl:py-2.5 2xl:py-3 text-xs sm:text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-full border border-gray-300 dark:border-gray-600">
              <span className="hidden md:inline">{t('services.navigation.slides.desktop')}</span>
              <span className="md:hidden">{t('services.navigation.slides.mobile')}</span>
            </div>
            
            <Link
              to="/"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-4 sm:px-5 md:px-6 lg:px-6 xl:px-7 2xl:px-8 py-1.5 sm:py-2 md:py-2 lg:py-2 xl:py-2.5 2xl:py-3 text-xs sm:text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl font-medium text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-full hover:bg-blue-600 dark:hover:bg-blue-400 hover:text-white dark:hover:text-gray-900 transition-all duration-300 hover:scale-105"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Inicio</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Buttons */}
      <WhatsAppButton />
      <ButtonMessageBot />
    </div>
  )
}

export default ServicesPage