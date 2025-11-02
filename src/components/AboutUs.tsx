import { Lightbulb, Target, Rocket } from 'lucide-react'
import BlurText from './effectsComponents/BlurText'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'


const AboutUs = () => {
	const { t } = useTranslation()
	const [autoHoverIndex, setAutoHoverIndex] = useState(-1)
	const [isManualHover, setIsManualHover] = useState(false)
	const [manualHoverIndex, setManualHoverIndex] = useState(-1)

	// Auto hover animation effect
	useEffect(() => {
		if (!isManualHover) {
			const initialDelay = 2000 // 2 segundos de delay inicial

			let intervalId: NodeJS.Timeout
			const timeoutId = setTimeout(() => {
				setAutoHoverIndex(0) // Inicia el autohover después del delay

				intervalId = setInterval(() => {
					setAutoHoverIndex(prev => {
						const nextIndex = (prev + 1) % 3 // 3 paneles total
						return nextIndex
					})
				}, 3000) // Cada 3 segundos
			}, initialDelay)

			return () => {
				clearTimeout(timeoutId)
				clearInterval(intervalId)
			}
		}
	}, [isManualHover])

	// Handle manual hover
	const handleMouseEnter = (index: number) => {
		setIsManualHover(true)
		setManualHoverIndex(index)
		setAutoHoverIndex(-1) // Stop auto hover
	}

	const handleMouseLeave = () => {
		setIsManualHover(false)
		setManualHoverIndex(-1)
		// Auto hover will resume due to useEffect dependency
	}

	return (
		<section
			id="quienes-somos"
			className="relative pt-20 pb-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 text-justify overflow-hidden transition-colors duration-300"
		>
			{/* Partículas de fondo sutiles */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute w-40 h-40 bg-blue-400/10 rounded-full blur-3xl animate-float-slow top-20 left-10"></div>
				<div className="absolute w-56 h-56 bg-purple-400/10 rounded-full blur-3xl animate-float-medium top-40 right-20"></div>
				<div className="absolute w-32 h-32 bg-pink-400/15 rounded-full blur-2xl animate-float-fast bottom-40 left-1/4"></div>
			</div>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<BlurText
						text={t('about.title')}
						delay={150}
						animateBy="words"
						direction="top"
						className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
					/>
					<BlurText
						text={t('about.subtitle')}
						delay={200}
						animateBy="words"
						direction="bottom"
						className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
					/>
				</div>

				<div className="grid md:grid-cols-2 gap-12 items-center mb-20">
					{/* Timeline/Comic Style Story */}
					<div className="space-y-7">
						<h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{t('about.story.title')}</h3>
						
						{/* Comic-style timeline */}
						<div className="relative mt-8">
							{/* Timeline line con efecto glow */}
							<div className="absolute left-5 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-600 via-purple-500 to-blue-500 rounded-full shadow-lg shadow-purple-500/50"></div>
							
							{/* Story panels */}
							<div className="space-y-8">
								{/* Panel 1 */}
								<div className="relative pl-16">
									<div 
										className="absolute left-0 w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-700 rounded-full flex items-center justify-center shadow-xl shadow-pink-500/50 border-2 border-white dark:border-gray-800" 
										style={{ 
											top: '-5px'
										}}>
										<Lightbulb className="w-6 h-6 text-white" />
									</div>
									<div 
										className={`group bg-white/90 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 border-2 border-pink-200 dark:border-pink-600/30 shadow-lg cursor-pointer
											transition-all duration-500 
											hover:bg-pink-50 dark:hover:bg-pink-900/40 
											hover:-translate-y-2 hover:shadow-2xl hover:scale-[1.02]
											hover:shadow-pink-400/40 dark:hover:shadow-pink-400/50
											hover:border-pink-400 dark:hover:border-pink-500 ${
												isManualHover ? 
													(manualHoverIndex === 0 ? 'bg-pink-50 dark:bg-pink-900/40 -translate-y-2 shadow-2xl scale-[1.02] shadow-pink-400/40 dark:shadow-pink-400/50 border-pink-400 dark:border-pink-500' : '') :
													(autoHoverIndex === 0 ? 'bg-pink-50 dark:bg-pink-900/40 -translate-y-2 shadow-2xl scale-[1.02] shadow-pink-400/40 dark:shadow-pink-400/50 border-pink-400 dark:border-pink-500' : '')
											}`}
										style={{ marginTop: '10px' }}
										onMouseEnter={() => handleMouseEnter(0)}
										onMouseLeave={handleMouseLeave}
									>
										<p className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed
											group-hover:text-gray-900 dark:group-hover:text-white
											transition-all duration-300">{t('about.story.paragraph1')}</p>
									</div>
								</div>
								
								{/* Panel 2 */}
								<div className="relative pl-16">
									<div 
										className="absolute left-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center shadow-xl shadow-purple-500/50 border-2 border-white dark:border-gray-800" 
										style={{ 
											top: '10px'
										}}>
										<Target className="w-6 h-6 text-white" />
									</div>
									<div 
										className={`group bg-white/90 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-600/30 shadow-lg cursor-pointer
											transition-all duration-500 
											hover:bg-purple-50 dark:hover:bg-purple-900/40
											hover:-translate-y-2 hover:shadow-2xl hover:scale-[1.02]
											hover:shadow-purple-400/40 dark:hover:shadow-purple-400/50
											hover:border-purple-400 dark:hover:border-purple-500 ${
												isManualHover ? 
													(manualHoverIndex === 1 ? 'bg-purple-50 dark:bg-purple-900/40 -translate-y-2 shadow-2xl scale-[1.02] shadow-purple-400/40 dark:shadow-purple-400/50 border-purple-400 dark:border-purple-500' : '') :
													(autoHoverIndex === 1 ? 'bg-purple-50 dark:bg-purple-900/40 -translate-y-2 shadow-2xl scale-[1.02] shadow-purple-400/40 dark:shadow-purple-400/50 border-purple-400 dark:border-purple-500' : '')
											}`}
										style={{ marginTop: '10px' }}
										onMouseEnter={() => handleMouseEnter(1)}
										onMouseLeave={handleMouseLeave}
									>
										<p className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed
											group-hover:text-gray-900 dark:group-hover:text-white
											transition-all duration-300">{t('about.story.paragraph2')}</p>
									</div>
								</div>
								
								{/* Panel 3 */}
								<div className="relative pl-16">
									<div 
										className="absolute left-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-xl shadow-blue-500/50 border-2 border-white dark:border-gray-800" 
										style={{ 
											top: '10px'
										}}>
										<Rocket className="w-6 h-6 text-white" />
									</div>
									<div 
										className={`group bg-white/90 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-600/30 shadow-lg cursor-pointer
											transition-all duration-500 
											hover:bg-blue-50 dark:hover:bg-blue-900/40
											hover:-translate-y-2 hover:shadow-2xl hover:scale-[1.02]
											hover:shadow-blue-400/40 dark:hover:shadow-blue-400/50
											hover:border-blue-400 dark:hover:border-blue-500 ${
												isManualHover ? 
													(manualHoverIndex === 2 ? 'bg-blue-50 dark:bg-blue-900/40 -translate-y-2 shadow-2xl scale-[1.02] shadow-blue-400/40 dark:shadow-blue-400/50 border-blue-400 dark:border-blue-500' : '') :
													(autoHoverIndex === 2 ? 'bg-blue-50 dark:bg-blue-900/40 -translate-y-2 shadow-2xl scale-[1.02] shadow-blue-400/40 dark:shadow-blue-400/50 border-blue-400 dark:border-blue-500' : '')
											}`}
										style={{ marginTop: '10px' }}
										onMouseEnter={() => handleMouseEnter(2)}
										onMouseLeave={handleMouseLeave}
									>
										<p className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed
											group-hover:text-gray-900 dark:group-hover:text-white
											transition-all duration-300">{t('about.story.paragraph3')}</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Video con efectos mejorados */}
					<div className="relative flex justify-center">
						{/* Resplandor de fondo sutil en azul */}
						<div className="absolute inset-0 bg-blue-500/10 rounded-3xl blur-xl"></div>
						
						{/* Contenedor del video */}
						<div className="relative w-full max-w-md">
							<div className="relative group">
								{/* Borde decorativo animado en azul */}
								<div className="absolute -inset-1 bg-blue-600 dark:bg-blue-500 rounded-3xl blur opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
								
								{/* Video */}
								<div className="relative h-[568px] rounded-2xl overflow-hidden shadow-2xl bg-gray-900 ring-1 ring-gray-900/5">
									<video className="w-full h-full object-cover" autoPlay loop muted playsInline>
										<source
											src="https://lafysstpyiejevhrlmzc.supabase.co/storage/v1/object/public/videos//Abouts_Us_Video.mp4"
											type="video/mp4"
										/>
										Tu navegador no soporta el elemento de video.
									</video>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Sección de Reconocimientos */}
			   <div className="relative pt-4 pb-8 overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
				{/* Partículas animadas de fondo con colores de la página */}
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-float-slow -top-16 -left-16"></div>
					<div className="absolute w-48 h-48 bg-purple-400/10 rounded-full blur-2xl animate-float-medium top-1/2 -right-24"></div>
					<div className="absolute w-24 h-24 bg-pink-400/25 rounded-full blur-lg animate-float-fast bottom-0 left-1/3"></div>
				</div>

				{/* Contenido principal */}
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						{/* Título principal con efectos especiales */}
						<div className="relative mb-16">
							<BlurText
								text={t('recognition.sectionTitle')}
								delay={150}
								animateBy="words"
								direction="top"
								className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
							/>
							
							{/* Línea decorativa animada */}
							<div className="flex justify-center items-center space-x-4 mb-6">
								<div className="h-1 w-16 bg-gradient-to-r from-transparent to-blue-600 dark:to-blue-400 "></div>
								<div className="w-6 h-6 bg-purple-600 dark:bg-purple-400 rotate-45 animate-spin-slow"></div>
								<div className="h-1 w-16 bg-gradient-to-l from-transparent to-pink-600 dark:to-pink-400 "></div>
							</div>
						</div>

						{/* Contenedor principal del premio */}
						<div className="grid lg:grid-cols-2 gap-12 items-center">
							{/* Texto del premio */}
							<div className="text-left">
								   <div className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 border border-gray-200 dark:border-gray-600 shadow-2xl hover:bg-gray-100 dark:hover:bg-gray-800/90 hover:shadow-[0_20px_50px_rgba(168,85,247,0.4)] dark:hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:scale-[1.02] transition-all duration-500 group">
									   <div className="flex items-center mb-6">
										   <div className="w-12 h-12 bg-yellow-400 dark:bg-yellow-500 rounded-full flex items-center justify-center mr-4 group-hover:animate-spin transition-transform duration-700">
											<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-900 dark:text-yellow-900">
												<path d="M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978"/>
												<path d="M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978"/>
												<path d="M18 9h1.5a1 1 0 0 0 0-5H18"/>
												<path d="M4 22h16"/>
												<path d="M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z"/>
												<path d="M6 9H4.5a1 1 0 0 1 0-5H6"/>
											</svg>
										</div>
										   <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
											{t('recognition.title')}
										</h3>
									</div>
									
									   <p className="text-xl md:text-2xl text-purple-700 dark:text-purple-300 font-semibold mb-4 leading-relaxed">
										{t('recognition.institution')}
									</p>
									
									   <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
										{t('recognition.description')}
									</p>
									
									{/* Stats del logro */}
									   <div className="grid grid-cols-2 gap-4">
										   <div className="text-center bg-blue-100 dark:bg-blue-900/50 rounded-xl p-4 backdrop-blur-sm">
											   <div className="text-3xl font-black text-blue-600 dark:text-blue-400">{t('recognition.position')}</div>
											   <div className="text-gray-500 dark:text-gray-400 text-sm">{t('recognition.positionLabel')}</div>
										   </div>
										   <div className="text-center bg-purple-100 dark:bg-purple-900/50 rounded-xl p-4 backdrop-blur-sm">
											   <div className="text-3xl font-black text-purple-700 dark:text-purple-400">{t('recognition.year')}</div>
											   <div className="text-gray-500 dark:text-gray-400 text-sm">{t('recognition.yearLabel')}</div>
										   </div>
									   </div>
								</div>
							</div>

							{/* Logo del IESA con efectos especiales */}
							   <div className="flex justify-center">
								   <a href="https://www.iesa.edu.ve" target="_blank" rel="noopener noreferrer" className="relative group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full">
									   {/* Círculos concéntricos animados */}
									   <div className="absolute inset-0 rounded-full border-4 border-blue-600/30 dark:border-blue-400/30 animate-ping"></div>
									   <div className="absolute inset-2 rounded-full border-2 border-purple-600/40 dark:border-purple-400/40 animate-pulse"></div>
									   {/* Contenedor del logo */}
									   <div className="relative w-48 h-48 md:w-64 md:h-64 bg-white rounded-full shadow-2xl flex items-center justify-center overflow-hidden transition-all duration-500">
										   <img
											   src="/Logo IESA.png"
											   alt="IESA Hackathon Logo" 
											   className="w-32 h-32 md:w-40 md:h-40 object-contain group-hover:rotate-6 transition-all duration-700"
										   />
										   {/* Efecto de brillo */}
										   <div className="absolute inset-0 bg-gradient-to-tr from-transparent  opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
									   </div>
									   {/* Partículas de celebración con colores de la página */}
									   <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce-delayed opacity-80"></div>
									   <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-600 dark:bg-purple-400 rounded-full animate-bounce opacity-70"></div>
									   <div className="absolute top-1/2 -right-8 w-4 h-4 bg-pink-600 dark:bg-pink-400 rounded-full animate-float-fast opacity-60"></div>
								   </a>
							   </div>
						</div>

						{/* Call to action sutil */}
						<div className="mt-12 text-center">
							<p className="text-gray-700 dark:text-gray-300 text-lg italic">
								"{t('recognition.quote')}" 
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default AboutUs
