import React, { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CarouselProps {
	items: {
		id: number
		title: string
		description: string
		image?: string
		CustomImage?: React.ComponentType
		icon?: React.ReactElement
	}[]
	autoPlay?: boolean
	autoPlayInterval?: number
}

const Carousel: React.FC<CarouselProps> = ({ items, autoPlay = true, autoPlayInterval = 5000 }) => {
	const [currentIndex, setCurrentIndex] = useState(1)
	const [isTransitioning, setIsTransitioning] = useState(false)
	const [isHovered, setIsHovered] = useState(false)
	const [isTouchActive, setIsTouchActive] = useState(false)
	const [touchStart, setTouchStart] = useState(0)
	const containerRef = useRef<HTMLDivElement>(null)
	const slideRef = useRef<HTMLDivElement>(null)

	const extendedItems = [items[items.length - 1], ...items, items[0]]

	const resetTransition = (newIndex: number) => {
		if (slideRef.current) {
			slideRef.current.style.transition = 'none'
		}
		setIsTransitioning(true)

		slideRef.current?.offsetHeight

		setCurrentIndex(newIndex)

		requestAnimationFrame(() => {
			if (slideRef.current) {
				slideRef.current.style.transition = 'transform 275ms cubic-bezier(0.4, 0, 0.2, 1)'
			}
			setIsTransitioning(false)
		})
	}

	const handleTransitionEnd = () => {
		if (currentIndex === 0) {
			resetTransition(items.length)
		} else if (currentIndex === items.length + 1) {
			resetTransition(1)
		} else {
			setIsTransitioning(false)
		}
	}

	const handleNext = () => {
		if (!isTransitioning) {
			setIsTransitioning(true)
			setCurrentIndex((prev) => prev + 1)
		}
	}

	const handlePrevious = () => {
		if (!isTransitioning) {
			setIsTransitioning(true)
			setCurrentIndex((prev) => prev - 1)
		}
	}

	const handleTouchStart = (e: React.TouchEvent) => {
		setIsTouchActive(true)
		setTouchStart(e.touches[0].clientX)
	}

	const handleTouchMove = (e: React.TouchEvent) => {
		if (!isTouchActive) return

		const currentTouch = e.touches[0].clientX
		const diff = touchStart - currentTouch

		if (Math.abs(diff) > 50) {
			if (diff > 0) {
				handleNext()
			} else {
				handlePrevious()
			}
			setIsTouchActive(false)
		}
	}

	const handleTouchEnd = () => {
		setIsTouchActive(false)
	}

	useEffect(() => {
		let interval: NodeJS.Timeout

		if (autoPlay && !isHovered && !isTransitioning && !isTouchActive) {
			interval = setInterval(() => {
				handleNext()
			}, autoPlayInterval)
		}

		return () => {
			if (interval) {
				clearInterval(interval)
			}
		}
	}, [autoPlay, isHovered, isTransitioning, isTouchActive, autoPlayInterval])

	const getTransform = () => {
		const isMobile = window.innerWidth < 768
		const cardWidth = isMobile ? 85 : 33.333
		const translateValue = -(currentIndex * cardWidth) + (100 - cardWidth) / 2

		return {
			transform: `translateX(${translateValue}%)`,
			transition: isTransitioning ? 'transform 275ms cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
			willChange: 'transform',
		}
	}

	return (
		<div
			className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:overflow-hidden"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			ref={containerRef}
		>
			<div
				className="md:overflow-hidden touch-pan-x"
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
			>
				<div
					ref={slideRef}
					className="flex snap-x snap-mandatory"
					style={getTransform()}
					onTransitionEnd={handleTransitionEnd}
				>
					{extendedItems.map((item, index) => (
						<div
							key={`${item.id}-${index}`}
							className={`w-[85%] md:w-[33.333%] flex-shrink-0 px-3 md:px-4 snap-center ${
								index === currentIndex ? '' : 'blur-[2px]'
							}`}
							style={{
								transform: `scale(${index === currentIndex ? 1 : 0.95})`,
								opacity: index === currentIndex ? 1 : 0.7,
								transition: 'all 275ms cubic-bezier(0.4, 0, 0.2, 1)',
								willChange: 'transform, opacity',
								cursor: index !== currentIndex ? 'pointer' : 'default',
							}}
							aria-hidden={index !== currentIndex}
							onClick={() => {
								if (!isTransitioning && index !== currentIndex) {
									if (index < currentIndex) {
										handlePrevious()
									} else {
										handleNext()
									}
								}
							}}
						>
							<div
								className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg 
                transition-all duration-275 ease-out hover:shadow-xl
                transform hover:-translate-y-1 my-5"
							>
								<div className="relative aspect-[3/2] md:overflow-hidden">
									{item.CustomImage ? (
										<item.CustomImage />
									) : (
										<img
											src={item.image}
											alt={item.title}
											className="w-full h-full object-cover transform transition-transform 
                        duration-275 ease-out group-hover:scale-105"
											loading="lazy"
										/>
									)}
									{item.icon && React.isValidElement(item.icon) && (
										<div className="absolute bottom-3 left-3">
											<div
												className="bg-blue-600/90 dark:bg-blue-500/90 p-2 rounded-lg 
                        backdrop-blur-sm transition-transform duration-275 ease-out 
                        hover:scale-105"
											>
												{React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, {
													className: 'h-5 w-5 text-white',
												})}
											</div>
										</div>
									)}
								</div>

								<div className="p-4 md:p-6">
									<h3
										className="font-bold text-gray-900 dark:text-white mb-3
                    transition-colors duration-275 mobile-carousel-title"
									>
										{item.title}
									</h3>
									<p
										className="text-gray-600 dark:text-gray-300 
                    transition-colors duration-275 mobile-carousel-description"
									>
										{item.description}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			<button
				onClick={handlePrevious}
				className="absolute -left-3 md:-left-3 lg:-left-0 top-[calc(50%-40px)] -translate-y-1/2 z-20 p-2.5 rounded-full
          	bg-white/90 dark:bg-gray-800/90 shadow-lg hover:bg-white dark:hover:bg-gray-700 
          	transition-all duration-275 ease-out hover:scale-105 hover:shadow-xl
          	transform active:scale-95"
				aria-label="Anterior"
			>
				<ChevronLeft className="w-5 h-5 text-gray-800 dark:text-gray-200" />
			</button>

			<button
				onClick={handleNext}
				className="absolute -right-3 md:-right-3 lg:-right-0 top-[calc(50%-40px)] -translate-y-1/2 z-20 p-2.5 rounded-full
          bg-white/90 dark:bg-gray-800/90 shadow-lg hover:bg-white dark:hover:bg-gray-700 
          transition-all duration-275 ease-out hover:scale-105 hover:shadow-xl
          transform active:scale-95"
				aria-label="Siguiente"
			>
				<ChevronRight className="w-5 h-5 text-gray-800 dark:text-gray-200" />
			</button>

			<div className="flex justify-center items-center gap-2 mt-4 mb-4">
				   {items.map((_, index) => (
					   <button
						   key={index}
						   onClick={() => !isTransitioning && setCurrentIndex(index + 1)}
						   className={`w-2 h-2 rounded-full transition-all duration-275 ease-out transform hover:scale-110
							   ${index === currentIndex - 1
								   ? 'bg-gray-800 dark:bg-blue-500 scale-125 border border-gray-300 dark:border-blue-400'
								   : 'bg-gray-400 dark:bg-gray-600 hover:bg-blue-400 dark:hover:bg-blue-400 border border-gray-300 dark:border-gray-500'}
						   `}
						   aria-label={`Ir a la diapositiva ${index + 1}`}
						   aria-current={index === currentIndex - 1}
					   />
				   ))}
			</div>
		</div>
	)
}

export default Carousel
