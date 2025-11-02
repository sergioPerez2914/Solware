import { memo, useEffect, useState } from 'react';

type Particle = {
	id: number
	text: string
	left: number
	animationDuration: number
	fontSize: number
	delay: number
	opacity: number
}

const PreloaderBinary = memo(() => {
	const [particles, setParticles] = useState<Particle[]>([])

	useEffect(() => {
		const generateParticles = () => {
			const newParticles = []
			const particleCount = 500

			for (let i = 0; i < particleCount; i++) {
				const binaryString = Array.from({ length: Math.floor(Math.random() * 10) + 3 }, () =>
					Math.random() > 0.5 ? '1' : '0',
				).join('')

				newParticles.push({
					id: i,
					text: binaryString,
					left: Math.random() * 100,
					animationDuration: Math.random() * 3 + 2, // 2-5 seconds
					fontSize: Math.random() * 8 + 12, // 12-20px
					delay: Math.random() * 3, // 0-3 seconds delay
					opacity: Math.random() * 0.4 + 0.2, // 0.2-0.6 opacity
				})
			}

			setParticles(newParticles)
		}

		// Generar partículas inmediatamente sin delay
		generateParticles()

		// Regenerate particles periodically
		const interval = setInterval(() => {
			generateParticles()
		}, 10000)

		return () => {
			clearInterval(interval)
		}
	}, [])

	return (
		<div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
			<style>{`
        @keyframes binaryFall {
          0% {
            transform: translateY(-50px);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          95% {
            opacity: 1;
          }
          100% {
            transform: translateY(calc(100vh + 1000px));
            opacity: 0;
          }
        }
        .binary-particle {
          position: absolute;
          font-family: 'Courier New', monospace;
          font-weight: bold;
          pointer-events: none;
          animation: binaryFall linear infinite;
          top: -50px;
          white-space: nowrap;
        }
      `}</style>
			{particles.map((particle) => (
				<div
					key={`${particle.id}-${Date.now()}`}
					className="binary-particle"
					style={{
						left: `${particle.left}%`,
						fontSize: `${particle.fontSize}px`,
						animationDuration: `${particle.animationDuration}s`,
						animationDelay: `${particle.delay}s`,
						color: `rgba(122, 20, 224, ${particle.opacity})`,
						textShadow: `0 0 8px rgba(75, 119, 188, ${particle.opacity * 0.8})`,
					}}
				>
					{particle.text}
				</div>
			))}
		</div>
	)
})

const Preloader = memo(() => {
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false)
			document.body.style.overflow = 'auto'
		}, 3000)

		document.body.style.overflow = 'hidden'

		return () => {
			clearTimeout(timer)
			document.body.style.overflow = 'auto'
		}
	}, [])

	if (!isLoading) return null

	return (
		<div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900">
			<style>{`
        .loader {
          --size: 250px;
          --duration: 2s;
          --logo-color: #4B77BC;
          --background: linear-gradient(
            0deg,
            rgba(75, 119, 188, 0.2) 0%,
            rgba(106, 0, 255, 0.2) 100%
          );
          height: var(--size);
          aspect-ratio: 1;
          position: relative;
          margin-bottom: 2rem;
          z-index: 10;
        }

        .loader .box {
          position: absolute;
          background: var(--background);
          border-radius: 50%;
          border-top: 1px solid rgba(75, 119, 188, 1);
          box-shadow: rgba(0, 0, 0, 0.3) 0px 10px 10px -0px;
          backdrop-filter: blur(5px);
          animation: ripple var(--duration) infinite ease-in-out;
        }

        .loader .box:nth-child(1) {
          inset: 40%;
          z-index: 99;
        }

        .loader .box:nth-child(2) {
          inset: 30%;
          z-index: 98;
          border-color: rgba(75, 119, 188, 0.8);
          animation-delay: 0.2s;
        }

        .loader .box:nth-child(3) {
          inset: 20%;
          z-index: 97;
          border-color: rgba(75, 119, 188, 0.6);
          animation-delay: 0.4s;
        }

        .loader .box:nth-child(4) {
          inset: 10%;
          z-index: 96;
          border-color: rgba(75, 119, 188, 0.4);
          animation-delay: 0.6s;
        }

        .loader .box:nth-child(5) {
          inset: 0%;
          z-index: 95;
          border-color: rgba(75, 119, 188, 0.2);
          animation-delay: 0.8s;
        }

        .loader .logo {
          position: absolute;
          inset: 0;
          display: grid;
          place-content: center;
          padding: 5%;
        }

        .loader .logo svg {
          fill: var(--logo-color);
          width: 100%;
          animation: color-change var(--duration) infinite ease-in-out;
        }

        @keyframes ripple {
          0% {
            transform: scale(1);
            box-shadow: rgba(0, 0, 0, 0.3) 0px 10px 10px -0px;
          }
          50% {
            transform: scale(1.3);
            box-shadow: rgba(0, 0, 0, 0.3) 0px 30px 20px -0px;
          }
          100% {
            transform: scale(1);
            box-shadow: rgba(0, 0, 0, 0.3) 0px 10px 10px -0px;
          }
        }

        @keyframes color-change {
          0% {
            fill: var(--logo-color);
          }
          50% {
            fill: white;
          }
          100% {
            fill: var(--logo-color);
          }
        }

        .animated-text {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin: 2rem 0;
          z-index: 10;
          position: relative;
        }

        .text-char {
          display: inline-block;
          font-size: 2.5rem;
          font-weight: bold;
          color: #4B77BC;
          text-shadow: 2px 2px 8px rgba(75, 119, 188, 0.3);
          animation: float-text 2s ease-in-out infinite;
          transform-origin: center;
        }

        .text-char:nth-child(2) { animation-delay: 0.1s; }
        .text-char:nth-child(3) { animation-delay: 0.2s; }
        .text-char:nth-child(4) { animation-delay: 0.3s; }
        .text-char:nth-child(5) { animation-delay: 0.4s; }
        .text-char:nth-child(6) { animation-delay: 0.5s; }
        .text-char:nth-child(7) { animation-delay: 0.6s; }

        @keyframes float-text {
          0%, 100% {
            transform: translateY(0) rotate(0);
            filter: brightness(1);
          }
          25% {
            transform: translateY(-8px) rotate(2deg);
            filter: brightness(1.2);
          }
          75% {
            transform: translateY(4px) rotate(-1deg);
            filter: brightness(0.9);
          }
        }

        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        .animate-progress {
          animation: progress 3s ease-out;
        }
      `}</style>

			{/* Binary Rain Background - Se renderiza inmediatamente */}
			<PreloaderBinary />

			<div className="relative flex flex-col items-center">
				<div className="relative">
					<div className="loader">
						<div className="box">
							<div className="logo">
								<img 
									src="/favicon.png" 
									alt="Solware Logo" 
									className="w-full h-full object-contain"
									style={{
										filter: 'drop-shadow(0 0 20px rgba(64, 128, 191, 0.6))',
									}}
								/>
							</div>
						</div>
						<div className="box" />
						<div className="box" />
						<div className="box" />
						<div className="box" />
					</div>

					<div className="animated-text">
						{'SOLWARE'.split('').map((char, index) => (
							<span
								key={index}
								className="text-char"
								style={{
									animationDelay: `${index * 0.1}s`,
									textShadow: `0 0 10px rgba(75, 119, 188, ${0.3 + index * 0.1})`,
								}}
							>
								{char}
							</span>
						))}
					</div>
				</div>
			</div>
		</div>
	)
})

export default Preloader