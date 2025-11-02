import React, { useState, useEffect } from 'react'
import { Zap, Play, Bot, Paintbrush, LayoutDashboard } from 'lucide-react'
import { Link } from 'react-router-dom'
import Particles from './Particles'
import DecryptedText from './effectsComponents/DecryptedText'
import { useTranslation } from 'react-i18next'

export default function Hero() {
	const { t, i18n } = useTranslation()
	const [isPreloadFinished, setIsPreloadFinished] = useState(false)
	const [animationKey, setAnimationKey] = useState(0)
	const [autoHoverIndex, setAutoHoverIndex] = useState(-1)
	const [isManualHover, setIsManualHover] = useState(false)
	const [manualHoverIndex, setManualHoverIndex] = useState(-1)
	const [canStartAutoHover, setCanStartAutoHover] = useState(false)

	useEffect(() => {
		// Simulate preload animation ending
		const preloadTimer = setTimeout(() => {
			setIsPreloadFinished(true)
		}, 3000) // Adjust the time to match your preload animation duration

		return () => clearTimeout(preloadTimer)
	}, [])

	useEffect(() => {
		// Restart title animation every 15 seconds
		const animationInterval = setInterval(() => {
			setAnimationKey(prev => prev + 1)
		}, 15000) // 15 seconds

		return () => clearInterval(animationInterval)
	}, [])

	// Auto hover animation effect
	useEffect(() => {
		if (!isManualHover && canStartAutoHover) {
			let intervalId: NodeJS.Timeout
			setAutoHoverIndex(0)
			intervalId = setInterval(() => {
				setAutoHoverIndex(prev => {
					const nextIndex = (prev + 1) % 4 // 4 cards total
					return nextIndex
				})
			}, 3000)
			return () => {
				clearInterval(intervalId)
			}
		}
	}, [isManualHover, canStartAutoHover])

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
		<div className="relative min-h-[100svh] flex items-center" id="inicio">
			{/* Background with gradient overlay and animated particles */}
			<div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-purple-600/90 dark:from-indigo-900/90 dark:to-purple-900/90 overflow-hidden">
				<div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:32px_32px]" />

				{/* Animated particles - ahora usando las partículas memorizadas */}
				<Particles />
			</div>

			{/* Hero content */}
			<div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
					<div className="text-center lg:text-left">
						<div className="min-h-[120px] sm:min-h-[140px] lg:min-h-[180px] xl:min-h-[220px] flex items-start">
							<DecryptedText
								key={`hero-title-${i18n.language}-${animationKey}`} // Fuerza re-render cuando cambia el idioma o la animación
								text={t('hero.title')}
								speed={50}
								className="revealed text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white dark:text-blue-100 \
	              mb-12 sm:mb-15 lg:mb-24 animate-fade-in leading-tight sm:leading-tight w-full"
								animateOn={isPreloadFinished ? 'view' : 'hover'}
								revealDirection="start"
								sequential={true}
								onRevealEnd={() => setCanStartAutoHover(true)}
							/>
						</div>

						<p
							className="text-lg sm:text-xl text-white/90 dark:text-blue-200 mb-6 sm:mb-8 animate-fade-in-delay 
              [text-shadow:_0_1px_5px_rgba(0,0,0,0.1)] dark:[text-shadow:_0_0_15px_rgba(147,197,253,0.3)]
              max-w-2xl mx-auto lg:mx-0 pt-6 sm:pt-8 lg:pt-10"
						>
							{t('hero.subtitle')}
						</p>

						{/* Responsive feature module - Only visible on smaller screens */}
						<div className="lg:hidden mb-8 animate-fade-in-delay">
							<div className={`bg-white/10 dark:bg-blue-900/20 backdrop-blur-lg rounded-xl p-4 shadow-lg dark:shadow-blue-500/20 transition-all duration-500 ${
								!isManualHover && autoHoverIndex === 0 ? '!shadow-[0_0_30px_rgba(245,158,11,0.6)]' :
								!isManualHover && autoHoverIndex === 1 ? '!shadow-[0_0_30px_rgba(59,130,246,0.6)]' :
								!isManualHover && autoHoverIndex === 2 ? '!shadow-[0_0_30px_rgba(168,85,247,0.6)]' :
								!isManualHover && autoHoverIndex === 3 ? '!shadow-[0_0_30px_rgba(34,197,94,0.6)]' : ''
							}`}>
								<div className="grid grid-cols-2 gap-3">
									{[
										{
											icon: <Zap className="h-5 w-5" />,
											title: t('hero.automation'),
											label: t('hero.efficiency'),
										},
										{
											icon: <Paintbrush className="h-5 w-5" />,
											title: t('hero.security'),
											label: t('hero.activeTime'),
										},
										{
											icon: <Bot className="h-5 w-5" />,
											title: t('hero.savings'),
											label: t('hero.costs'),
										},
										{
											icon: <LayoutDashboard className="h-5 w-5" />,
											title: t('hero.scalability'),
											label: t('hero.limits'),
										},
									].map((stat, index) => {
										const isActiveHover = isManualHover 
											? manualHoverIndex === index 
											: autoHoverIndex === index

										return (
											<div
												key={index}
												onTouchStart={() => handleMouseEnter(index)}
												onTouchEnd={handleMouseLeave}
												className={`text-center p-3 rounded-lg bg-white/5 dark:bg-blue-900/30 transition-all duration-300 ${
													isActiveHover ? 
														`bg-white/20 dark:bg-blue-700/60 -translate-y-1 shadow-lg scale-105 ${
															index === 0 ? 'shadow-amber-400/40' : 
															index === 1 ? 'shadow-blue-400/40' : 
															index === 2 ? 'shadow-purple-400/40' : 
															index === 3 ? 'shadow-green-400/40' : ''
														}` : ''
												}`}
											>
												<div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 dark:bg-blue-800/50 mb-2 transition-all duration-300 ${
													isActiveHover ? 
														`scale-110 ${
															index === 0 ? 'shadow-[0_0_15px_rgba(245,158,11,0.8)]' : 
															index === 1 ? 'shadow-[0_0_15px_rgba(59,130,246,0.8)]' : 
															index === 2 ? 'shadow-[0_0_15px_rgba(168,85,247,0.8)]' : 
															index === 3 ? 'shadow-[0_0_15px_rgba(34,197,94,0.8)]' : ''
														}` : ''
												}`}>
													{React.cloneElement(stat.icon, {
														className: `h-5 w-5 transition-colors duration-300 ${
															isActiveHover ? 
																(index === 0 ? 'text-yellow-300' : 
																 index === 1 ? 'text-blue-300' : 
																 index === 2 ? 'text-purple-300' : 
																 index === 3 ? 'text-green-300' : 'text-white') : 
																'text-white'
														}`,
													})}
												</div>
												<h3 className={`text-sm font-medium text-white dark:text-blue-100 mb-1 transition-all duration-300 ${
													isActiveHover ? 'font-semibold' : ''
												}`}>
													{stat.title}
												</h3>
												<p className={`text-xs text-white/80 dark:text-blue-200/80 transition-all duration-300 ${
													isActiveHover ? 'text-white font-medium' : ''
												}`}>
													{stat.label}
												</p>
											</div>
										)
									})}
								</div>
							</div>
						</div>

						<div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-delay-2">
							<a
								href="https://calendar.app.google/EYruMbWpJwJ82gHr6"
								target="_blank"
								className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold 
                  hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-2xl
                  transform hover:-translate-y-1 hover:scale-105 active:scale-95"
							>
								{t('header.consulta')}
							</a>

							<Link
								to="/demo"
								className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold 
                  hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-2xl
                  transform hover:-translate-y-1 hover:scale-105 active:scale-95 flex items-center justify-center"
							>
								<Play className="h-5 w-5 mr-2" />
								{t('hero.demo')}
							</Link>
						</div>
					</div>

					<div className="hidden lg:block">
						<div
							className={`bg-white/10 dark:bg-blue-900/20 backdrop-blur-lg rounded-2xl p-6 sm:p-8 
              shadow-2xl dark:shadow-blue-500/20 animate-fade-in-delay 
              transition-all duration-500 
              has-[.card-amber:hover]:!shadow-[0_0_50px_rgba(245,158,11,0.6)]
              has-[.card-blue:hover]:!shadow-[0_0_50px_rgba(59,130,246,0.6)]
              has-[.card-purple:hover]:!shadow-[0_0_50px_rgba(168,85,247,0.6)]
              has-[.card-green:hover]:!shadow-[0_0_50px_rgba(34,197,94,0.6)] ${
								!isManualHover && autoHoverIndex === 0 ? '!shadow-[0_0_50px_rgba(245,158,11,0.6)]' :
								!isManualHover && autoHoverIndex === 1 ? '!shadow-[0_0_50px_rgba(59,130,246,0.6)]' :
								!isManualHover && autoHoverIndex === 2 ? '!shadow-[0_0_50px_rgba(168,85,247,0.6)]' :
								!isManualHover && autoHoverIndex === 3 ? '!shadow-[0_0_50px_rgba(34,197,94,0.6)]' : ''
							}`}
						>
							<div className="grid grid-cols-2 gap-4 sm:gap-6">
								{[
									{
										icon: <Zap className="h-6 w-6 sm:h-8 sm:w-8" />,
										title: t('hero.automation'),
										label: t('hero.efficiency'),
										hoverColor: 'group-hover:text-yellow-300 dark:group-hover:text-yellow-300',
										glowColor: 'group-hover:shadow-[0_0_25px_rgba(245,158,11,0.8)]',
										cardHover: 'hover:shadow-amber-400/40 dark:hover:shadow-amber-400/40',
										cardClass: 'card-amber',
									},
									{
										icon: <Paintbrush className="h-6 w-6 sm:h-8 sm:w-8" />,
										title: t('hero.security'),
										label: t('hero.activeTime'),
										hoverColor: 'group-hover:text-blue-300 dark:group-hover:text-blue-300',
										glowColor: 'group-hover:shadow-[0_0_25px_rgba(59,130,246,0.8)]',
										cardHover: 'hover:shadow-blue-400/40 dark:hover:shadow-blue-400/40',
										cardClass: 'card-blue',
									},
									{
										icon: <Bot className="h-6 w-6 sm:h-8 sm:w-8" />,
										title: t('hero.savings'),
										label: t('hero.costs'),
										hoverColor: 'group-hover:text-purple-300 dark:group-hover:text-purple-300',
										glowColor: 'group-hover:shadow-[0_0_25px_rgba(168,85,247,0.8)]',
										cardHover: 'hover:shadow-purple-400/40 dark:hover:shadow-purple-400/40',
										cardClass: 'card-purple',
									},
									{
										icon: <LayoutDashboard className="h-6 w-6 sm:h-8 sm:w-8" />,
										title: t('hero.scalability'),
										label: t('hero.limits'),
										hoverColor: 'group-hover:text-green-300 dark:group-hover:text-green-300',
										glowColor: 'group-hover:shadow-[0_0_25px_rgba(34,197,94,0.8)]',
										cardHover: 'hover:shadow-green-400/40 dark:hover:shadow-green-400/40',
										cardClass: 'card-green',
									},
								].map((stat, index) => {
									const isActiveHover = isManualHover 
										? manualHoverIndex === index 
										: autoHoverIndex === index

									return (
										<div
											key={index}
											onMouseEnter={() => handleMouseEnter(index)}
											onMouseLeave={handleMouseLeave}
											className={`${stat.cardClass} group text-center p-3 sm:p-4 rounded-xl bg-white/5 dark:bg-blue-900/30 
                      transition-all duration-300
                      ${isActiveHover ? 
                        `bg-white/20 dark:bg-blue-700/60 -translate-y-2 shadow-xl scale-105 ${
													index === 0 ? 'shadow-amber-400/40 dark:shadow-amber-400/40' : 
													index === 1 ? 'shadow-blue-400/40 dark:shadow-blue-400/40' : 
													index === 2 ? 'shadow-purple-400/40 dark:shadow-purple-400/40' : 
													index === 3 ? 'shadow-green-400/40 dark:shadow-green-400/40' : ''
												}` :
                        'hover:bg-white/20 dark:hover:bg-blue-700/60 hover:-translate-y-2 hover:shadow-xl hover:scale-105 ' + stat.cardHover
                      }`}
										>
											<div
												className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 
                      rounded-lg bg-white/10 dark:bg-blue-800/50 mb-2 sm:mb-3 transform transition-all duration-300
                      ${isActiveHover ? 
                        `scale-125 rotate-6 bg-white/30 dark:bg-blue-700/70 ${
													index === 0 ? 'shadow-[0_0_25px_rgba(245,158,11,0.8)]' : 
													index === 1 ? 'shadow-[0_0_25px_rgba(59,130,246,0.8)]' : 
													index === 2 ? 'shadow-[0_0_25px_rgba(168,85,247,0.8)]' : 
													index === 3 ? 'shadow-[0_0_25px_rgba(34,197,94,0.8)]' : ''
												}` :
                        'group-hover:scale-125 group-hover:rotate-6 group-hover:bg-white/30 dark:group-hover:bg-blue-700/70 ' + stat.glowColor
                      }`}
											>
												{React.cloneElement(stat.icon, {
													className: `h-6 w-6 sm:h-8 sm:w-8 transition-colors duration-300 ${
														isActiveHover ? 
															(index === 0 ? 'text-yellow-300' : 
															 index === 1 ? 'text-blue-300' : 
															 index === 2 ? 'text-purple-300' : 
															 index === 3 ? 'text-green-300' : 'text-white') : 
															`text-white ${stat.hoverColor}`
													}`,
												})}
											</div>
											<h3
												className={`text-base sm:text-lg font-medium text-white dark:text-blue-100 mb-1 
                      transition-colors duration-300 ${
													isActiveHover ? 
														'text-white font-semibold' : 
														'group-hover:text-white group-hover:font-semibold'
												}`}
											>
												{stat.title}
											</h3>
											<p
												className={`text-sm sm:text-base text-white/80 dark:text-blue-200/80 
                      transition-colors duration-300 ${
													isActiveHover ? 
														'text-white font-medium' : 
														'group-hover:text-white group-hover:font-medium'
												}`}
											>
												{stat.label}
											</p>
										</div>
									)
								})}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}