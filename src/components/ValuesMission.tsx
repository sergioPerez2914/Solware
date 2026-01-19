import React from 'react'
import { Lightbulb, Users, Target, Leaf, Handshake } from 'lucide-react'
import BlurText from './effectsComponents/BlurText'
import { useTranslation } from 'react-i18next'

// Función helper para resaltar palabras clave en negrita
const highlightKeywords = (text: string, keywords: string[]): JSX.Element[] => {
	const parts: (string | JSX.Element)[] = []
	let lastIndex = 0
	let key = 0

	// Crear un patrón regex que busca las palabras clave (case insensitive)
	const pattern = new RegExp(`(${keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi')
	
	// Encontrar todas las coincidencias
	const matches = Array.from(text.matchAll(pattern))
	
	if (matches.length === 0) {
		return [<span key={0}>{text}</span>]
	}

	matches.forEach((match) => {
		const matchIndex = match.index!
		const matchText = match[0]

		// Agregar texto antes de la coincidencia
		if (matchIndex > lastIndex) {
			parts.push(text.substring(lastIndex, matchIndex))
		}

		// Agregar la palabra clave en negrita
		parts.push(<strong key={key++} className="font-bold text-gray-900 dark:text-white">{matchText}</strong>)

		lastIndex = matchIndex + matchText.length
	})

	// Agregar el texto restante
	if (lastIndex < text.length) {
		parts.push(text.substring(lastIndex))
	}

	return parts.map((part, index) => 
		typeof part === 'string' ? <span key={index}>{part}</span> : part
	)
}

const ValuesMission: React.FC = () => {
	const { t } = useTranslation()
	const values = [
		{
			icon: <Lightbulb className="h-6 w-6" />,
			title: t('valuesMission.values.innovation.title'),
			description: t('valuesMission.values.innovation.description'),
			color: 'bg-amber-100 dark:bg-amber-900/30',
			iconColor: 'text-amber-600 dark:text-amber-400',
			hoverColor: 'group-hover:text-amber-500 dark:group-hover:text-amber-300',
			cardHover: 'hover:shadow-[0_20px_50px_rgba(245,158,11,0.4)] dark:hover:shadow-[0_0_20px_rgba(245,158,11,0.5)]',
		},
		{
			icon: <Users className="h-6 w-6" />,
			title: t('valuesMission.values.commitment.title'),
			description: t('valuesMission.values.commitment.description'),
			color: 'bg-blue-100 dark:bg-blue-900/30',
			iconColor: 'text-blue-600 dark:text-blue-400',
			hoverColor: 'group-hover:text-blue-500 dark:group-hover:text-blue-300',
			cardHover: 'hover:shadow-[0_20px_50px_rgba(59,130,246,0.4)] dark:hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]',
		},
		{
			icon: <Target className="h-6 w-6" />,
			title: t('valuesMission.values.adaptability.title'),
			description: t('valuesMission.values.adaptability.description'),
			color: 'bg-purple-100 dark:bg-purple-900/30',
			iconColor: 'text-purple-600 dark:text-purple-400',
			hoverColor: 'group-hover:text-purple-500 dark:group-hover:text-purple-300',
			cardHover: 'hover:shadow-[0_20px_50px_rgba(168,85,247,0.4)] dark:hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]',
		},
		{
			icon: <Leaf className="h-6 w-6" />,
			title: t('valuesMission.values.sustainability.title'),
			description: t('valuesMission.values.sustainability.description'),
			color: 'bg-green-100 dark:bg-green-900/30',
			iconColor: 'text-green-600 dark:text-green-400',
			hoverColor: 'group-hover:text-green-500 dark:group-hover:text-green-300',
			cardHover: 'hover:shadow-[0_20px_50px_rgba(34,197,94,0.4)] dark:hover:shadow-[0_0_20px_rgba(34,197,94,0.5)]',
		},
	]

	return (
		<section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center max-w-3xl mx-auto mb-16">
					<BlurText
						text={t('valuesMission.title')}
						delay={150}
						animateBy="words"
						direction="top"
						className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
					/>
					<BlurText
						text={t('valuesMission.description')}
						delay={200}
						animateBy="words"
						direction="bottom"
						className="text-xl text-gray-600 dark:text-gray-300"
					/>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					<div
						className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 
              rounded-2xl p-8 sm:p-10 shadow-lg transform hover:scale-[1.02] transition-all duration-300
              hover:shadow-[0_20px_50px_rgba(236,72,153,0.4)] dark:hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]"
					>
						<div className="prose prose-lg dark:prose-invert max-w-none text-justify">
							<div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center float-left mr-4 mb-2">
								<Handshake className="h-6 w-6 text-pink-600 dark:text-pink-400" />
							</div>
							<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
								{highlightKeywords(t('valuesMission.paragraph1'), [
									'transformamos', 'tecnología', 'motor de cambio', 'soluciones innovadoras', 'accesibles', 'sostenibles', 'adaptadas'
								])}
							</p>
							<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
								{highlightKeywords(t('valuesMission.paragraph2'), [
									'confianza', 'colaboración', 'excelencia', 'superar expectativas', 'futuro digital', 'éxito', 'objetivo'
								])}
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						{values.map((value, index) => (
							<div
								key={index}
								className={`group bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 
                  rounded-xl p-6 shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${value.cardHover}`}
							>
								<div
									className={`w-12 h-12 ${value.color} rounded-lg flex items-center justify-center 
                  mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
								>
									{React.cloneElement(value.icon, {
										className: `transition-colors duration-300 ${value.iconColor} ${value.hoverColor}`,
									})}
								</div>
								<h3
									className="text-lg font-semibold text-gray-900 dark:text-white mb-2 
                  transition-colors duration-300"
								>
									{value.title}
								</h3>
								<p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300">
									{value.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}

export default ValuesMission
