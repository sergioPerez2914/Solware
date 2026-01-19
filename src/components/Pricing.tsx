import { Settings, Check } from 'lucide-react'
import React, { useMemo, useEffect, useState } from 'react'
import RobotEyeTracking from './RoboTrakChat'
import BlurText from './effectsComponents/BlurText'
import { useTranslation } from 'react-i18next'
const PricingParticles = React.memo(
	({
		lightColor = '#e5e7eb',
		darkColor = '#222E3D',
		className,
	}: {
		lightColor?: string
		darkColor?: string
		className?: string
	}) => {
		const [isDark, setIsDark] = useState(false)

		useEffect(() => {
			const checkTheme = () => {
				setIsDark(document.documentElement.classList.contains('dark'))
			}

			checkTheme()

			const observer = new MutationObserver(checkTheme)
			observer.observe(document.documentElement, {
				attributes: true,
				attributeFilter: ['class'],
			})

			return () => observer.disconnect()
		}, [])

		const bubbles = useMemo(
			() =>
				Array.from({ length: 60 }, (_, i) => ({
					id: i,
					size: `${2 + Math.random() * 0.5}rem`,
					distance: `${6 + Math.random() * 50}rem`,
					position: `${-5 + Math.random() * 110}%`,
					time: `${2 + Math.random() * 8}s`,
					delay: `${-1 * (2 + Math.random() * 8)}s`,
				})),
			[],
		)

		const currentColor = isDark ? darkColor : lightColor
		const filterId = useMemo(() => `blob-${currentColor.replace('#', '')}`, [currentColor])

		return (
			<>
				<style>{`
        @keyframes bubble-size {
          0%, 75% {
            width: var(--size);
            height: var(--size);
          }
          100% {
            width: 0rem;
            height: 0rem;
          }
        }
        @keyframes bubble-move {
          0% {
            bottom: -4rem;
          }
          100% {
            bottom: var(--distance);
          }
        }
        .bubble {
          position: absolute;
          left: var(--position);
          background: var(--color);
          border-radius: 100%;
          animation: bubble-size var(--time) ease-in infinite var(--delay),
                     bubble-move var(--time) ease-in infinite var(--delay);
          transform: translate(-50%, 100%);
          width: var(--size);
          height: var(--size);
          transition: background-color 0.3s ease;
        }
      `}</style>
				<div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
					<svg className="absolute" style={{ position: 'fixed', top: '100vh' }}>
						<defs>
							<filter id={filterId}>
								<feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
								<feColorMatrix
									in="blur"
									mode="matrix"
									values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
									result="blob"
								/>
							</filter>
						</defs>
					</svg>
					<div className="absolute inset-0" style={{ filter: `url(#${filterId})` }}>
						{bubbles.map((bubble) => (
							<div
								key={bubble.id}
								className="bubble"
								style={
									{
										'--size': bubble.size,
										'--distance': bubble.distance,
										'--position': bubble.position,
										'--time': bubble.time,
										'--delay': bubble.delay,
										'--color': currentColor,
									} as React.CSSProperties & { [key: string]: string }
								}
							/>
						))}
					</div>
				</div>
			</>
		)
	},
)

export default function Pricing() {
	const { t } = useTranslation()
	const pricingData = [
		{
			id: 1,
			icon: <Settings className="size-20 text-white svg-rotate-on-hover transition-all duration-300 ease-in-out" />,
			title: t("pricing.details.0.title"),
			advantage1: t("pricing.details.0.advantage1"),
			advantage2: t("pricing.details.0.advantage2"),
			advantage3: t("pricing.details.0.advantage3"),
			color: '#3b82f6',
		},
		{
			id: 2,
			icon: <RobotEyeTracking className="size-32 text-white" />,
			title: t("pricing.details.1.title"),
			advantage1: t("pricing.details.1.advantage1"),
			advantage2: t("pricing.details.1.advantage2"),
			advantage3: t("pricing.details.1.advantage3"),
			color: '',
		},
		{
			id: 3,
			icon: (
				<svg 
					className="size-20 text-white svg-rotate-on-hover transition-all duration-300 ease-in-out"
					viewBox="420 170 430 560"
					fill="currentColor"
				>
					<path d="M 626.5,216.5 C 656.495,213.407 676.329,226.074 686,254.5C 689.803,271.568 685.97,286.568 674.5,299.5C 648.647,321.854 622.647,344.021 596.5,366C 586.877,374.329 584.044,384.496 588,396.5C 605.667,424.833 623.333,453.167 641,481.5C 655.572,509.378 650.405,532.878 625.5,552C 598.149,565.193 574.982,560.027 556,536.5C 527.698,490.854 499.365,445.187 471,399.5C 456.442,374.99 459.275,352.823 479.5,333C 521.352,297.904 563.019,262.571 604.5,227C 611.131,221.855 618.464,218.355 626.5,216.5 Z"/>
					<path d="M 676.5,347.5 C 693.453,347.063 707.619,353.063 719,365.5C 749.062,412.567 778.729,459.9 808,507.5C 822.498,531.976 819.664,554.142 799.5,574C 757.648,609.096 715.981,644.429 674.5,680C 653.711,694.856 632.711,695.19 611.5,681C 591.228,662.468 586.728,640.634 598,615.5C 599.977,612.688 602.144,610.022 604.5,607.5C 630.353,585.146 656.353,562.979 682.5,541C 691.926,533.139 694.759,523.306 691,511.5C 672,480.5 653,449.5 634,418.5C 624.986,392.545 631.486,371.378 653.5,355C 660.961,351.395 668.628,348.895 676.5,347.5 Z"/>
		   </svg>
			),
			title: t("pricing.details.2.title"),
			advantage1: t("pricing.details.2.advantage1"),
			advantage2: t("pricing.details.2.advantage2"),
			advantage3: t("pricing.details.2.advantage3"),
			color: '#3b82f6',
		},
	]

	return (
		<section id="pricing" className="py-20 bg-white dark:bg-gray-900">
			<style>{`
				@keyframes rotate-infinite {
					from {
						transform: rotate(0deg);
					}
					to {
						transform: rotate(360deg);
					}
				}
				.group:hover .svg-rotate-on-hover {
					animation: rotate-infinite 2s linear infinite;
				}
			`}</style>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<BlurText
					text={t("pricing.title")}
					delay={150}
					animateBy="words"
					direction="top"
					className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 sm:text-2xl md:text-3xl lg:text-4xl"
				/>
				<BlurText
					text={t("pricing.description")}
					delay={200}
					animateBy="words"
					direction="bottom"
					className="text-lg text-gray-600 dark:text-gray-300 mb-16 sm:text-base md:text-lg lg:text-xl"
				/>
				<PricingParticles lightColor="#e5e7eb" darkColor="#222E3D" className="z[-1] hidden lg:block" />
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{pricingData.map((plan) => (
						<div
							key={plan.id}
							className="group group rounded-2xl border-2 relative flex flex-col justify-between h-full transition-all duration-300 hover:-translate-y-1 border-[#0099ff]/20 hover:border-[#0099ff]/70 hover:shadow-[0_0_30px_-5px_rgba(0,153,255,0.1)] cursor-pointer"
						>
							<div className="relative bg-gray-50 dark:bg-gray-700 p-16 text-center flex flex-col items-center justify-center rounded-t-2xl h-48 flex-shrink-0">
								<div
									className="rounded-full z-50 p-5 drop-shadow-[0px_0px_3px_rgba(29,78,216,0.5)] group-hover:drop-shadow-[0px_0px_10px_rgba(29,78,216,0.8)] transition duration-300 flex items-center justify-center"
									style={{ backgroundColor: plan.color }}
								>
									{plan.icon}
								</div>
							</div>
							<div className="bg-gray-100 dark:bg-gray-800 pb-12 pt-8 px-12 text-center rounded-b-2xl shadow-[inset_0_0px_20px_-10px_rgba(29,78,216,0.5),inset_0_-0px_20px_-10px_rgba(0,153,255,0.2)] group-hover:shadow-[inset_0_10px_20px_-8px_rgba(0,153,255,0.3),inset_0_-10px_20px_-8px_rgba(0,153,255,0.3)] transition-shadow duration-300 flex-1">
								<div className="z-10 flex flex-col">
									<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">{plan.title}</h3>
									<div className="flex flex-col items-start">
										<p className="text-gray-600 dark:text-gray-300 mb-4 flex items-center gap-3 justify-start w-full text-sm sm:text-sm">
											<Check className="size-4 text-green-400" />{' '}
											<span className="font-bold text-center ">{plan.advantage1}</span>
										</p>
										<p className="text-gray-600 dark:text-gray-300 mb-4 flex items-center gap-3 justify-start w-full text-sm sm:text-sm">
											<Check className="size-4 text-green-400" />{' '}
											<span className="font-bold text-center ">{plan.advantage2}</span>
										</p>
										<p className="text-gray-600 dark:text-gray-300 mb-4 flex items-center gap-3 justify-start w-full text-sm sm:text-sm">
											<Check className="size-4 text-green-400" />{' '}
											<span className="font-bold text-center ">{plan.advantage3}</span>
										</p>
									</div>
									<a href="#contacto">
										<button className="mt-4 w-full flex items-center justify-center px-6 py-3 relative
                  text-base font-medium rounded-full text-white bg-blue-600 dark:bg-blue-500 
                  hover:bg-blue-700 dark:hover:bg-blue-600 hover:scale-105 hover:shadow-2xl
                  border border-blue-400/30 dark:border-blue-300/20
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                  transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                  active:scale-95 transform hover:-translate-y-1
                  before:absolute before:inset-0 before:rounded-full before:border 
                  before:border-blue-300/40 dark:before:border-blue-400/30 before:opacity-0 
                  hover:before:opacity-100 before:transition-opacity before:duration-300
                  after:absolute after:inset-[-2px] after:rounded-full after:border 
                  after:border-blue-200/30 dark:after:border-blue-500/20 after:opacity-0 
                  hover:after:opacity-100 after:transition-opacity after:duration-500">
											{t("pricing.button")}
										</button>
									</a>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}