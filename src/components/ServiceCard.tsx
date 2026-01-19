import React, { useState, useRef, useEffect, memo, ReactElement } from 'react'
import { ChevronRight, ArrowLeft } from 'lucide-react'
import GlareHover from './effectsComponents/GlareHover'
import { useTranslation } from 'react-i18next'
interface ServiceCardProps {
	title: string
	description: string
	icon: ReactElement<{ className?: string }>
	image: string
	details: {
		title: string
		description: string
	}[]
}

const ServiceCard = memo(
	({ title, description, icon, image, details }: ServiceCardProps) => {
		const { t } = useTranslation()
		const [isFlipped, setIsFlipped] = useState(false)
		const cardRef = useRef<HTMLDivElement | null>(null)

		useEffect(() => {
			if (!isFlipped) return
			const handleClickOutside = (event: MouseEvent) => {
				if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
					setIsFlipped(false)
				}
			}
			document.addEventListener('mousedown', handleClickOutside)
			return () => document.removeEventListener('mousedown', handleClickOutside)
		}, [isFlipped])

		return (
			<div ref={cardRef} className="perspective-1000 w-full h-[20rem] sm:h-[22.4rem] md:h-[24rem] lg:h-[26.6rem]">
				<div
					className={`relative w-full h-full transition-transform duration-600 transform-style-3d ${
						isFlipped ? 'rotate-y-180' : ''
					}`}
				>
					{/* Front of card */}
					<div className="absolute w-full h-full backface-hidden" onClick={() => setIsFlipped((f) => !f)}>
						<GlareHover
						glareColor="#ffffff"
						glareOpacity={0.3}
						glareAngle={-30}
						glareSize={300}
						transitionDuration={800}
						playOnce={false}
						>
							<div
								className="h-full w-full bg-blue-600 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden group 
            hover:shadow-xl transition-all duration-300"
							>
								<div className="relative h-32 sm:h-40 md:h-44 lg:h-48 overflow-hidden">
									<img
										src={image}
										alt={title}
										className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
								</div>

								<div className="p-4 sm:p-6">
									<h3 className="text-lg sm:text-xl font-bold text-white mb-2 transition-colors duration-300">
										{title}
									</h3>
									<p className="text-sm sm:text-base text-white/90 mb-4 transition-colors duration-300">
										{description}
									</p>

									<button
										className="inline-flex items-center text-white font-medium 
                  hover:text-white/80 transition-colors group/btn text-sm sm:text-base"
									>
										{t('services.button')}
										<ChevronRight className="ml-2 h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" />
									</button>
								</div>
							</div>
						</GlareHover>
					</div>

					{/* Back of card */}
					<div className="absolute w-full h-full backface-hidden rotate-y-180" onClick={() => setIsFlipped((f) => !f)}>
						<div className="h-full w-full bg-blue-600 dark:bg-blue-600 rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col">
							<div className="flex-grow space-y-3 sm:space-y-4 lg:space-y-6 overflow-y-auto scrollbar-hide">
								{details.map((detail, index) => (
									<div key={index} className="group">
										<h4
											className="text-sm sm:text-base font-semibold text-white mb-1 sm:mb-2 
                    transition-colors duration-300 group-hover:text-white/90 line-clamp-2"
										>
											{detail.title}
										</h4>
										<p
											className="text-xs sm:text-sm text-white/80 transition-colors duration-300 
                    leading-relaxed group-hover:text-white/90 line-clamp-3"
										>
											{detail.description}
										</p>
									</div>
								))}
							</div>

							<button
								className="mt-3 sm:mt-4 lg:mt-6 inline-flex items-center text-white 
                font-medium hover:text-white/80 transition-colors 
                group/btn text-xs sm:text-sm lg:text-base"
							>
								<ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 transform group-hover/btn:-translate-x-1 transition-transform" />
								{t('services.back')}
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	},
	(prevProps, nextProps) => {
		return prevProps.title === nextProps.title && prevProps.description === nextProps.description
	},
)

export default ServiceCard
