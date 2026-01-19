import { useState, useEffect, useCallback, useRef } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import WorkProcess from './components/WorkProcess'
import Automation from './components/Automation'
import ValuesMission from './components/ValuesMission'
import Contact from './components/Contact'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import Preloader from './components/Preloader'
import ButtonMessageBot from './components/ButtonMessageBot'
import AboutUs from './components/AboutUs'
import Pricing from './components/Pricing'
import CTA from './components/CTA'
import SplashCursor from './components/effectsComponents/SplashCursor'
import { Analytics } from '@vercel/analytics/react'

function App() {
	const [isLoading, setIsLoading] = useState(true)
	const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const isScrollingRef = useRef(false)

	// Memoizar el handleScroll sin dependencias que cambien
	const handleScroll = useCallback(() => {
		// Skip if we're already in scrolling state
		if (!isScrollingRef.current) {
			document.documentElement.classList.add('scrolling')
			isScrollingRef.current = true
		}

		// Clear any existing timeout
		if (scrollTimeoutRef.current) {
			clearTimeout(scrollTimeoutRef.current)
		}

		// Set new timeout
		scrollTimeoutRef.current = setTimeout(() => {
			document.documentElement.classList.remove('scrolling')
			isScrollingRef.current = false
		}, 150)
	}, []) // Sin dependencias!

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false)
		}, 3000)

		// Use requestAnimationFrame to throttle scroll events
		let ticking = false
		const scrollListener = () => {
			if (!ticking) {
				window.requestAnimationFrame(() => {
					handleScroll()
					ticking = false
				})
				ticking = true
			}
		}

		window.addEventListener('scroll', scrollListener, { passive: true })

		return () => {
			clearTimeout(timer)
			if (scrollTimeoutRef.current) {
				clearTimeout(scrollTimeoutRef.current)
			}
			window.removeEventListener('scroll', scrollListener)
		}
	}, [handleScroll])

	// Check if need to scroll to services after navigation
	useEffect(() => {
		const shouldScrollToServices = sessionStorage.getItem('scrollToServices')
		if (shouldScrollToServices === 'true') {
			sessionStorage.removeItem('scrollToServices')
			// Wait for the page to fully load and render
			setTimeout(() => {
				const servicesSection = document.getElementById('servicios')
				if (servicesSection) {
					servicesSection.scrollIntoView({ behavior: 'smooth' })
				}
			}, 500)
		}
	}, [])

	return (
		<>
			<Preloader />
			<div
				className={`min-h-screen bg-gray-50 dark:bg-dark transition-colors duration-300 ${
					isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'
				}`}
			>
				<SplashCursor />
				<Header />
				<main>
					<Hero />
					<AboutUs />
					<WorkProcess />
					<CTA
						variant="primary"
						titleKey="cta1.title"
						descriptionKey="cta1.description"
						buttonTextKey="cta1.button"
						buttonLink="#servicios"
					/>
					<Services />
					<Automation />
					<CTA
						variant="secondary"
						titleKey="cta2.title"
						descriptionKey="cta2.description"
						buttonTextKey="cta2.button"
						buttonLink="#contacto"
					/>
					<Pricing />
					<ValuesMission />
					<Contact />
				</main>
				<Footer />
				<WhatsAppButton />
				<ButtonMessageBot />
			</div>
			<Analytics debug={false} />
		</>
	)
}

export default App
