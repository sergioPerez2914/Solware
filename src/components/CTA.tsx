import React from 'react'
import { ArrowRight } from 'lucide-react'
import BlurText from './effectsComponents/BlurText'
import { useTranslation } from 'react-i18next'

interface CTAProps {
	variant?: 'primary' | 'secondary'
	titleKey: string
	descriptionKey: string
	buttonTextKey: string
	buttonLink?: string
	onButtonClick?: () => void
}

const CTA: React.FC<CTAProps> = ({
	variant = 'primary',
	titleKey,
	descriptionKey,
	buttonTextKey,
	buttonLink,
	onButtonClick,
}) => {
	const { t } = useTranslation()

	const handleClick = () => {
		if (onButtonClick) {
			onButtonClick()
		} else if (buttonLink) {
			if (buttonLink.startsWith('#')) {
				const element = document.querySelector(buttonLink)
				if (element) {
					element.scrollIntoView({ behavior: 'smooth' })
				}
			} else {
				window.open(buttonLink, '_blank')
			}
		} else {
			// Default: scroll to contact section
			const contactSection = document.getElementById('contacto')
			if (contactSection) {
				contactSection.scrollIntoView({ behavior: 'smooth' })
			}
		}
	}

	return (
		<section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-150 ease-in-out">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="bg-white dark:bg-gray-800 rounded-2xl border border-blue-500/60 p-8 sm:p-12 shadow-[0_0_20px_rgba(59,130,246,0.15)] dark:shadow-[0_0_20px_rgba(59,130,246,0.25)] transition-all duration-150 ease-in-out">
					<div className="text-center max-w-4xl mx-auto">
						<BlurText
							text={t(titleKey)}
							delay={150}
							animateBy="words"
							direction="top"
							className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-150 ease-in-out"
						/>
						<BlurText
							text={t(descriptionKey)}
							delay={200}
							animateBy="words"
							direction="bottom"
							className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 transition-colors duration-150 ease-in-out"
						/>

						<button
							onClick={handleClick}
							className="group inline-flex items-center justify-center px-8 py-4 relative
                  text-base font-medium rounded-full text-white bg-blue-600 dark:bg-blue-500 
                  hover:bg-blue-700 dark:hover:bg-blue-600 hover:scale-105 hover:shadow-2xl
                  border border-blue-400/30 dark:border-blue-300/20
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                  transition-all duration-300 ease-out transform hover:-translate-y-1
                  active:scale-95
                  before:absolute before:inset-0 before:rounded-full before:border 
                  before:border-blue-300/40 dark:before:border-blue-400/30 before:opacity-0 
                  hover:before:opacity-100 before:transition-opacity before:duration-500 before:ease-out
                  after:absolute after:inset-[-2px] after:rounded-full after:border 
                  after:border-blue-200/30 dark:after:border-blue-500/20 after:opacity-0 
                  hover:after:opacity-100 after:transition-opacity after:duration-700 after:ease-out"
						>
							<span className="mr-2 relative z-10 transition-transform duration-300 ease-out group-hover:translate-x-0.5">{t(buttonTextKey)}</span>
							<ArrowRight className="h-5 w-5 transform group-hover:translate-x-2 transition-transform duration-500 ease-out relative z-10" />
						</button>
					</div>
				</div>
			</div>
		</section>
	)
}

export default CTA
