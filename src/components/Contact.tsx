import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Mail, Phone, Send, ChevronDown, Instagram, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import BlurText from './effectsComponents/BlurText'
import { useTranslation } from 'react-i18next'

interface FormData {
	name: string
	email: string
	countryCode: string
	phone: string
	message: string
	areas: string[]
}

interface FormErrors {
	name?: string
	email?: string
	phone?: string
	message?: string
}

interface CountryCode {
	code: string
	country: string
	countryCode: string // ISO code like "US", "ES", "MX"
	pattern: RegExp
	placeholder: string
	maxLength: number
}

const Contact: React.FC = () => {
	const { t } = useTranslation()
	
	// Country codes for all countries worldwide
	const countryCodes: CountryCode[] = [
		// North America
		{ code: '+1', country: 'Estados Unidos', countryCode: 'US', pattern: /^\d{10}$/, placeholder: '1234567890', maxLength: 10 },
		{ code: '+1', country: 'Canadá', countryCode: 'CA', pattern: /^\d{10}$/, placeholder: '1234567890', maxLength: 10 },
		
		// Europe
		{ code: '+34', country: 'España', countryCode: 'ES', pattern: /^\d{9}$/, placeholder: '123456789', maxLength: 9 },
		{ code: '+33', country: 'Francia', countryCode: 'FR', pattern: /^\d{10}$/, placeholder: '0123456789', maxLength: 10 },
		{ code: '+49', country: 'Alemania', countryCode: 'DE', pattern: /^\d{10,11}$/, placeholder: '01234567890', maxLength: 11 },
		{ code: '+39', country: 'Italia', countryCode: 'IT', pattern: /^\d{10}$/, placeholder: '0123456789', maxLength: 10 },
		{ code: '+44', country: 'Reino Unido', countryCode: 'GB', pattern: /^\d{10}$/, placeholder: '1234567890', maxLength: 10 },
		{ code: '+31', country: 'Países Bajos', countryCode: 'NL', pattern: /^\d{9}$/, placeholder: '123456789', maxLength: 9 },
		{ code: '+41', country: 'Suiza', countryCode: 'CH', pattern: /^\d{9}$/, placeholder: '123456789', maxLength: 9 },
		{ code: '+43', country: 'Austria', countryCode: 'AT', pattern: /^\d{10,11}$/, placeholder: '01234567890', maxLength: 11 },
		{ code: '+32', country: 'Bélgica', countryCode: 'BE', pattern: /^\d{9}$/, placeholder: '123456789', maxLength: 9 },
		{ code: '+45', country: 'Dinamarca', countryCode: 'DK', pattern: /^\d{8}$/, placeholder: '12345678', maxLength: 8 },
		{ code: '+46', country: 'Suecia', countryCode: 'SE', pattern: /^\d{9}$/, placeholder: '123456789', maxLength: 9 },
		{ code: '+47', country: 'Noruega', countryCode: 'NO', pattern: /^\d{8}$/, placeholder: '12345678', maxLength: 8 },
		{ code: '+358', country: 'Finlandia', countryCode: 'FI', pattern: /^\d{9}$/, placeholder: '123456789', maxLength: 9 },
		{ code: '+351', country: 'Portugal', countryCode: 'PT', pattern: /^\d{9}$/, placeholder: '123456789', maxLength: 9 },
		{ code: '+30', country: 'Grecia', countryCode: 'GR', pattern: /^\d{10}$/, placeholder: '1234567890', maxLength: 10 },
		{ code: '+48', country: 'Polonia', countryCode: 'PL', pattern: /^\d{9}$/, placeholder: '123456789', maxLength: 9 },
		{ code: '+420', country: 'República Checa', countryCode: 'CZ', pattern: /^\d{9}$/, placeholder: '123456789', maxLength: 9 },
		{ code: '+36', country: 'Hungría', countryCode: 'HU', pattern: /^\d{9}$/, placeholder: '123456789', maxLength: 9 },
		{ code: '+7', country: 'Rusia', countryCode: 'RU', pattern: /^\d{10}$/, placeholder: '1234567890', maxLength: 10 },
		{ code: '+380', country: 'Ucrania', countryCode: 'UA', pattern: /^\d{9}$/, placeholder: '123456789', maxLength: 9 },
		{ code: '+353', country: 'Irlanda', countryCode: 'IE', pattern: /^\d{9}$/, placeholder: '123456789', maxLength: 9 },
		
		// Latin America
		{ code: '+54', country: 'Argentina', countryCode: 'AR', pattern: /^\d{10}$/, placeholder: '1123456789', maxLength: 10 },
		{ code: '+55', country: 'Brasil', countryCode: 'BR', pattern: /^\d{11}$/, placeholder: '11987654321', maxLength: 11 },
		{ code: '+56', country: 'Chile', countryCode: 'CL', pattern: /^\d{9}$/, placeholder: '987654321', maxLength: 9 },
		{ code: '+57', country: 'Colombia', countryCode: 'CO', pattern: /^\d{10}$/, placeholder: '3001234567', maxLength: 10 },
		{ code: '+52', country: 'México', countryCode: 'MX', pattern: /^\d{10}$/, placeholder: '5512345678', maxLength: 10 },
		{ code: '+51', country: 'Perú', countryCode: 'PE', pattern: /^\d{9}$/, placeholder: '987654321', maxLength: 9 },
		{ code: '+58', country: 'Venezuela', countryCode: 'VE', pattern: /^\d{10}$/, placeholder: '4123456789', maxLength: 10 },
		{ code: '+593', country: 'Ecuador', countryCode: 'EC', pattern: /^\d{9}$/, placeholder: '987654321', maxLength: 9 },
		{ code: '+595', country: 'Paraguay', countryCode: 'PY', pattern: /^\d{9}$/, placeholder: '987654321', maxLength: 9 },
		{ code: '+598', country: 'Uruguay', countryCode: 'UY', pattern: /^\d{9}$/, placeholder: '987654321', maxLength: 9 },
		{ code: '+591', country: 'Bolivia', countryCode: 'BO', pattern: /^\d{8}$/, placeholder: '12345678', maxLength: 8 },
		{ code: '+506', country: 'Costa Rica', countryCode: 'CR', pattern: /^\d{8}$/, placeholder: '12345678', maxLength: 8 },
		{ code: '+507', country: 'Panamá', countryCode: 'PA', pattern: /^\d{8}$/, placeholder: '12345678', maxLength: 8 },
		{ code: '+505', country: 'Nicaragua', countryCode: 'NI', pattern: /^\d{8}$/, placeholder: '12345678', maxLength: 8 },
		{ code: '+504', country: 'Honduras', countryCode: 'HN', pattern: /^\d{8}$/, placeholder: '12345678', maxLength: 8 },
		{ code: '+503', country: 'El Salvador', countryCode: 'SV', pattern: /^\d{8}$/, placeholder: '12345678', maxLength: 8 },
		{ code: '+502', country: 'Guatemala', countryCode: 'GT', pattern: /^\d{8}$/, placeholder: '12345678', maxLength: 8 },
		{ code: '+53', country: 'Cuba', countryCode: 'CU', pattern: /^\d{8}$/, placeholder: '12345678', maxLength: 8 },
		{ code: '+1', country: 'República Dominicana', countryCode: 'DO', pattern: /^\d{10}$/, placeholder: '8091234567', maxLength: 10 },
		{ code: '+509', country: 'Haití', countryCode: 'HT', pattern: /^\d{8}$/, placeholder: '12345678', maxLength: 8 },
		{ code: '+1', country: 'Jamaica', countryCode: 'JM', pattern: /^\d{10}$/, placeholder: '8761234567', maxLength: 10 },
		
		// Asia
		{ code: '+86', country: 'China', countryCode: 'CN', pattern: /^\d{11}$/, placeholder: '13812345678', maxLength: 11 },
		{ code: '+81', country: 'Japón', countryCode: 'JP', pattern: /^\d{10,11}$/, placeholder: '09012345678', maxLength: 11 },
		{ code: '+82', country: 'Corea del Sur', countryCode: 'KR', pattern: /^\d{10,11}$/, placeholder: '01012345678', maxLength: 11 },
		{ code: '+91', country: 'India', countryCode: 'IN', pattern: /^\d{10}$/, placeholder: '9876543210', maxLength: 10 },
		{ code: '+62', country: 'Indonesia', countryCode: 'ID', pattern: /^\d{9,12}$/, placeholder: '81234567890', maxLength: 12 },
		{ code: '+60', country: 'Malasia', countryCode: 'MY', pattern: /^\d{9,10}$/, placeholder: '123456789', maxLength: 10 },
		{ code: '+65', country: 'Singapur', countryCode: 'SG', pattern: /^\d{8}$/, placeholder: '12345678', maxLength: 8 },
		{ code: '+66', country: 'Tailandia', countryCode: 'TH', pattern: /^\d{9}$/, placeholder: '812345678', maxLength: 9 },
		{ code: '+84', country: 'Vietnam', countryCode: 'VN', pattern: /^\d{9,10}$/, placeholder: '912345678', maxLength: 10 },
		{ code: '+63', country: 'Filipinas', countryCode: 'PH', pattern: /^\d{10}$/, placeholder: '9171234567', maxLength: 10 },
		{ code: '+92', country: 'Pakistán', countryCode: 'PK', pattern: /^\d{10}$/, placeholder: '3001234567', maxLength: 10 },
		{ code: '+880', country: 'Bangladesh', countryCode: 'BD', pattern: /^\d{10}$/, placeholder: '1812345678', maxLength: 10 },
		{ code: '+94', country: 'Sri Lanka', countryCode: 'LK', pattern: /^\d{9}$/, placeholder: '712345678', maxLength: 9 },
		{ code: '+98', country: 'Irán', countryCode: 'IR', pattern: /^\d{10}$/, placeholder: '9123456789', maxLength: 10 },
		{ code: '+90', country: 'Turquía', countryCode: 'TR', pattern: /^\d{10}$/, placeholder: '5321234567', maxLength: 10 },
		{ code: '+972', country: 'Israel', countryCode: 'IL', pattern: /^\d{9}$/, placeholder: '501234567', maxLength: 9 },
		{ code: '+971', country: 'Emiratos Árabes', countryCode: 'AE', pattern: /^\d{9}$/, placeholder: '501234567', maxLength: 9 },
		{ code: '+966', country: 'Arabia Saudí', countryCode: 'SA', pattern: /^\d{9}$/, placeholder: '501234567', maxLength: 9 },
		
		// Africa
		{ code: '+27', country: 'Sudáfrica', countryCode: 'ZA', pattern: /^\d{9}$/, placeholder: '712345678', maxLength: 9 },
		{ code: '+20', country: 'Egipto', countryCode: 'EG', pattern: /^\d{10}$/, placeholder: '1012345678', maxLength: 10 },
		{ code: '+234', country: 'Nigeria', countryCode: 'NG', pattern: /^\d{10}$/, placeholder: '8012345678', maxLength: 10 },
		{ code: '+254', country: 'Kenia', countryCode: 'KE', pattern: /^\d{9}$/, placeholder: '712345678', maxLength: 9 },
		{ code: '+212', country: 'Marruecos', countryCode: 'MA', pattern: /^\d{9}$/, placeholder: '612345678', maxLength: 9 },
		{ code: '+233', country: 'Ghana', countryCode: 'GH', pattern: /^\d{9}$/, placeholder: '501234567', maxLength: 9 },
		{ code: '+256', country: 'Uganda', countryCode: 'UG', pattern: /^\d{9}$/, placeholder: '712345678', maxLength: 9 },
		{ code: '+255', country: 'Tanzania', countryCode: 'TZ', pattern: /^\d{9}$/, placeholder: '712345678', maxLength: 9 },
		
		// Oceania
		{ code: '+61', country: 'Australia', countryCode: 'AU', pattern: /^\d{9}$/, placeholder: '412345678', maxLength: 9 },
		{ code: '+64', country: 'Nueva Zelanda', countryCode: 'NZ', pattern: /^\d{8,9}$/, placeholder: '212345678', maxLength: 9 },
		
		// Middle East (additional)
		{ code: '+962', country: 'Jordania', countryCode: 'JO', pattern: /^\d{9}$/, placeholder: '791234567', maxLength: 9 },
		{ code: '+961', country: 'Líbano', countryCode: 'LB', pattern: /^\d{8}$/, placeholder: '71123456', maxLength: 8 },
		{ code: '+963', country: 'Siria', countryCode: 'SY', pattern: /^\d{9}$/, placeholder: '991234567', maxLength: 9 },
		{ code: '+964', country: 'Irak', countryCode: 'IQ', pattern: /^\d{10}$/, placeholder: '7901234567', maxLength: 10 },
		{ code: '+965', country: 'Kuwait', countryCode: 'KW', pattern: /^\d{8}$/, placeholder: '50123456', maxLength: 8 },
		{ code: '+968', country: 'Omán', countryCode: 'OM', pattern: /^\d{8}$/, placeholder: '92123456', maxLength: 8 },
		{ code: '+974', country: 'Qatar', countryCode: 'QA', pattern: /^\d{8}$/, placeholder: '33123456', maxLength: 8 },
		{ code: '+973', country: 'Bahréin', countryCode: 'BH', pattern: /^\d{8}$/, placeholder: '36123456', maxLength: 8 },
		
		// Additional European countries
		{ code: '+421', country: 'Eslovaquia', countryCode: 'SK', pattern: /^\d{9}$/, placeholder: '901123456', maxLength: 9 },
		{ code: '+386', country: 'Eslovenia', countryCode: 'SI', pattern: /^\d{8}$/, placeholder: '31123456', maxLength: 8 },
		{ code: '+385', country: 'Croacia', countryCode: 'HR', pattern: /^\d{8,9}$/, placeholder: '912345678', maxLength: 9 },
		{ code: '+381', country: 'Serbia', countryCode: 'RS', pattern: /^\d{8,9}$/, placeholder: '601234567', maxLength: 9 },
		{ code: '+382', country: 'Montenegro', countryCode: 'ME', pattern: /^\d{8}$/, placeholder: '67123456', maxLength: 8 },
		{ code: '+387', country: 'Bosnia', countryCode: 'BA', pattern: /^\d{8}$/, placeholder: '61123456', maxLength: 8 },
		{ code: '+389', country: 'Macedonia del Norte', countryCode: 'MK', pattern: /^\d{8}$/, placeholder: '70123456', maxLength: 8 },
		{ code: '+355', country: 'Albania', countryCode: 'AL', pattern: /^\d{9}$/, placeholder: '672123456', maxLength: 9 },
		{ code: '+40', country: 'Rumania', countryCode: 'RO', pattern: /^\d{9}$/, placeholder: '721234567', maxLength: 9 },
		{ code: '+359', country: 'Bulgaria', countryCode: 'BG', pattern: /^\d{9}$/, placeholder: '881234567', maxLength: 9 },
		{ code: '+370', country: 'Lituania', countryCode: 'LT', pattern: /^\d{8}$/, placeholder: '61234567', maxLength: 8 },
		{ code: '+371', country: 'Letonia', countryCode: 'LV', pattern: /^\d{8}$/, placeholder: '21234567', maxLength: 8 },
		{ code: '+372', country: 'Estonia', countryCode: 'EE', pattern: /^\d{7,8}$/, placeholder: '5123456', maxLength: 8 },
	]

	const areasDeInteres = [
		{ id: 'automatizacion', label: t('contact.form.areas.options.automatizacion') },
		{ id: 'desarrollo', label: t('contact.form.areas.options.desarrollo') },
		{ id: 'crm', label: t('contact.form.areas.options.crm') },
		{ id: 'marketing', label: t('contact.form.areas.options.marketing') },
		{ id: 'infraestructura', label: t('contact.form.areas.options.infraestructura') },
		{ id: 'consultoria', label: t('contact.form.areas.options.consultoria') },
	]
	const faqs = [
		{
			question: t('contact.faq.faqs.0.question'),
			answer: t('contact.faq.faqs.0.answer'),
		},
		{
			question: t('contact.faq.faqs.1.question'),
			answer: t('contact.faq.faqs.1.answer'),
		},
		{
			question: t('contact.faq.faqs.2.question'),
			answer: t('contact.faq.faqs.2.answer'),
		},
		{
			question: t('contact.faq.faqs.3.question'),
			answer: t('contact.faq.faqs.3.answer'),
		},
		{
			question: t('contact.faq.faqs.4.question'),
			answer: t('contact.faq.faqs.4.answer'),
		},
	]
	const formRef = useRef<HTMLFormElement>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
	const [submitMessage, setSubmitMessage] = useState('')
	const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
	const [formData, setFormData] = useState<FormData>({
		name: '',
		email: '',
		countryCode: '+58', // Default to Venezuela
		phone: '',
		message: '',
		areas: [],
	})
	const [formErrors, setFormErrors] = useState<FormErrors>({})
	
	// Country dropdown search states
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const [filteredCountries, setFilteredCountries] = useState(countryCodes)

	// Validation functions
	const validateName = (name: string): string | undefined => {
		const trimmedName = name.trim()
		if (!trimmedName) return 'Por favor ingresa tu nombre completo'
		
		const nameParts = trimmedName.split(/\s+/).filter(part => part.length > 0)
		if (nameParts.length < 2) {
			return 'Por favor ingresa tu nombre completo (nombre y apellido)'
		}
		
		return undefined
	}

	const validateEmail = (email: string): string | undefined => {
		const trimmedEmail = email.trim()
		if (!trimmedEmail) return 'Por favor ingresa tu correo electrónico'
		
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(trimmedEmail)) {
			return 'Por favor ingresa un correo electrónico válido'
		}
		
		return undefined
	}

	const validateMessage = (message: string): string | undefined => {
		const trimmedMessage = message.trim()
		if (!trimmedMessage) return 'Por favor ingresa tu mensaje'
		
		return undefined
	}

	const validatePhone = (phone: string, countryCode: string): string | undefined => {
		const trimmedPhone = phone.trim()
		if (!trimmedPhone) return 'Por favor ingresa tu número de teléfono'
		
		const selectedCountry = countryCodes.find(country => country.code === countryCode)
		if (!selectedCountry) return 'Por favor selecciona un código de país válido'
		
		// Remove any non-digit characters
		const cleanPhone = trimmedPhone.replace(/\D/g, '')
		
		if (!selectedCountry.pattern.test(cleanPhone)) {
			return `Por favor ingresa un número válido para ${selectedCountry.country} (${selectedCountry.placeholder})`
		}
		
		return undefined
	}

	// Country search functions
	const handleSearchChange = (query: string) => {
		setSearchQuery(query)
		const filtered = countryCodes.filter(country => 
			country.country.toLowerCase().includes(query.toLowerCase()) ||
			country.countryCode.toLowerCase().includes(query.toLowerCase()) ||
			country.code.includes(query)
		)
		setFilteredCountries(filtered)
	}

	const handleCountrySelect = (country: CountryCode) => {
		setFormData(prev => ({ ...prev, countryCode: country.code }))
		setIsDropdownOpen(false)
		setSearchQuery('')
		setFilteredCountries(countryCodes)
	}

	const getSelectedCountry = () => {
		return countryCodes.find(country => country.code === formData.countryCode) || countryCodes[0]
	}

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement
			if (!target.closest('.country-dropdown')) {
				setIsDropdownOpen(false)
			}
		}

		if (isDropdownOpen) {
			document.addEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isDropdownOpen])

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
			const { name, value } = e.target
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}))

			// Clear error when user starts typing
			if (formErrors[name as keyof FormErrors]) {
				setFormErrors((prev) => ({
					...prev,
					[name]: undefined,
				}))
			}
		},
		[formErrors],
	)

	const handleAreaChange = useCallback((areaId: string) => {
		setFormData((prev) => {
			const areas = prev.areas.includes(areaId) ? prev.areas.filter((id) => id !== areaId) : [...prev.areas, areaId]
			return { ...prev, areas }
		})
	}, [])

	const handleSubmit = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault()

			if (!formRef.current || isSubmitting) return

			// Validate form
			const nameError = validateName(formData.name)
			const emailError = validateEmail(formData.email)
			const phoneError = validatePhone(formData.phone, formData.countryCode)
			const messageError = validateMessage(formData.message)

			const errors: FormErrors = {}
			if (nameError) errors.name = nameError
			if (emailError) errors.email = emailError
			if (phoneError) errors.phone = phoneError
			if (messageError) errors.message = messageError

			setFormErrors(errors)

			// If there are errors, don't submit
			if (Object.keys(errors).length > 0) {
				return
			}

			setIsSubmitting(true)
			setSubmitStatus('idle')

			try {
				// Preparar los datos para el email
				const emailData = {
					name: formData.name,
					email: formData.email,
					phone: `${formData.countryCode} ${formData.phone}`,
					areas: formData.areas.map((id) => areasDeInteres.find((area) => area.id === id)?.label || id).join(', '),
					message: formData.message,
				}

				// Enviar con Resend (función serverless)
				const response = await fetch('/api/send', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(emailData),
				})

				const result = await response.json()

				if (!response.ok) {
					throw new Error(result.error || 'Error al enviar el email')
				}

				// Guardar en Supabase como backup
				try {
					const { error } = await supabase.from('contact_submissions').insert([
						{
							name: formData.name,
							email: formData.email,
							phone: `${formData.countryCode} ${formData.phone}`,
							areas: formData.areas.map((id) => areasDeInteres.find((area) => area.id === id)?.label || id),
							message: formData.message,
						},
					])

					if (error) {
						console.error('Error al guardar en base de datos:', error)
					}
				} catch (dbError) {
					console.error('Error al guardar en base de datos:', dbError)
				}

				setSubmitStatus('success')
				setSubmitMessage('¡Mensaje enviado exitosamente! Te contactaremos pronto.')

				// Reset form
				setFormData({
					name: '',
					email: '',
					countryCode: '+58',
					phone: '',
					message: '',
					areas: [],
				})
				setFormErrors({})

				// Hide success message after 5 seconds
				setTimeout(() => {
					setSubmitStatus('idle')
				}, 5000)

			} catch (error) {
				setSubmitStatus('error')
				
				let errorMessage = 'Error al enviar el mensaje. Por favor, intenta nuevamente.'
				
				// More specific error messages
				if (error instanceof Error) {
					if (error.message.includes('Invalid') || error.message.includes('config')) {
						errorMessage = 'Error de configuración. Por favor, contacta al administrador.'
					} else if (error.message.includes('network') || error.message.includes('fetch')) {
						errorMessage = 'Error de conexión. Verifica tu internet y intenta nuevamente.'
					}
				}
				
				setSubmitMessage(errorMessage)
				
				// Hide error message after 5 seconds
				setTimeout(() => {
					setSubmitStatus('idle')
				}, 5000)
			} finally {
				setIsSubmitting(false)
			}
		},
		[formRef, isSubmitting, formData, validateName, validateEmail, validatePhone, validateMessage],
	)

	const openWhatsApp = useCallback(() => {
		const message = encodeURIComponent(t('contact.form.whatsapp.message'))
		window.open(`https://wa.me/584129974533?text=${message}`, '_blank')
	}, [])

	const handleFaqClick = useCallback((index: number) => {
		setOpenFaqIndex((prev) => (prev === index ? null : index))
	}, [])

	return (
		<section className="py-20 pb-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-300" id="contacto">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center max-w-3xl mx-auto mb-16">
					<BlurText
						text={t('contact.title')}
						delay={150}
						animateBy="words"
						direction="top"
						className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
					/>
					<BlurText
						text={t('contact.description')}
						delay={200}
						animateBy="words"
						direction="bottom"
						className="text-xl text-gray-600 dark:text-gray-300"
					/>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
					<div className="bg-white dark:bg-gray-800 rounded-2xl border border-blue-500/60 p-8 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
						<div className="mb-8">
							<h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
								{t('contact.form.title')}
							</h3>
						</div>

						<form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
							<div>
								<label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
									{t('contact.form.name.title')}
								</label>
								<input
									type="text"
									id="name"
									name="name"
									value={formData.name}
									onChange={handleChange}
									placeholder={t('contact.form.name.placeholder')}
									className={`mt-1 block w-full rounded-md border px-3 py-2 text-gray-900 dark:text-white 
									shadow-sm focus:ring-2 focus:ring-offset-0 transition-colors duration-300 ${
										formErrors.name
											? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20 focus:border-red-500 focus:ring-red-500'
											: 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-gray-600'
									}`}
								/>
								{formErrors.name && (
									<p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.name}</p>
								)}
							</div>

							<div>
								<label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
									{t('contact.form.email.title')}
								</label>
								<input
									type="text"
									id="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									placeholder={t('contact.form.email.placeholder')}
									className={`mt-1 block w-full rounded-md border px-3 py-2 text-gray-900 dark:text-white 
									shadow-sm focus:ring-2 focus:ring-offset-0 transition-colors duration-300 ${
										formErrors.email
											? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20 focus:border-red-500 focus:ring-red-500'
											: 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-gray-600'
									}`}
								/>
								{formErrors.email && (
									<p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.email}</p>
								)}
							</div>

							<div>
								<label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
									{t('contact.form.phone.title')}
								</label>
								<div className="mt-1 flex space-x-2">
									{/* Country Code Dropdown with Search */}
									<div className="relative w-32 country-dropdown">
										<div
											className={`block w-full rounded-md border px-3 py-2 text-gray-900 dark:text-white text-sm
											shadow-sm cursor-pointer transition-colors duration-300 ${
												formErrors.phone
													? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20'
													: 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600'
											}`}
											onClick={() => setIsDropdownOpen(!isDropdownOpen)}
										>
											<div className="flex items-center justify-between">
												<span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
													{getSelectedCountry().countryCode}
												</span>
												<span className="text-sm">{getSelectedCountry().code}</span>
											</div>
										</div>
										
										{isDropdownOpen && (
											<div className="absolute z-50 mt-1 w-80 max-h-64 overflow-hidden bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
												{/* Search Input */}
												<div className="p-2 border-b border-gray-200 dark:border-gray-700">
													<input
														type="text"
														placeholder="Buscar país..."
														value={searchQuery}
														onChange={(e) => handleSearchChange(e.target.value)}
														className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
														onClick={(e) => e.stopPropagation()}
													/>
												</div>
												
												{/* Countries List */}
												<div className="max-h-48 overflow-y-auto">
													{filteredCountries.map((country) => (
														<div
															key={`${country.code}-${country.countryCode}`}
															className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between text-sm"
															onClick={() => handleCountrySelect(country)}
														>
															<div className="flex items-center space-x-2">
																<span className="text-xs font-semibold text-blue-600 dark:text-blue-400 w-8">
																	{country.countryCode}
																</span>
																<span className="text-gray-900 dark:text-white">
																	{country.country}
																</span>
															</div>
															<span className="text-gray-600 dark:text-gray-300">
																{country.code}
															</span>
														</div>
													))}
													{filteredCountries.length === 0 && (
														<div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
															No se encontraron países
														</div>
													)}
												</div>
											</div>
										)}
									</div>
									
									{/* Phone Number Input */}
									<input
										type="tel"
										id="phone"
										name="phone"
										value={formData.phone}
										onChange={(e) => {
											// Solo permitir números en el onChange
											const value = e.target.value.replace(/\D/g, '')
											setFormData(prev => ({ ...prev, phone: value }))
											// Clear error when user starts typing
											if (formErrors.phone) {
												setFormErrors((prev) => ({ ...prev, phone: undefined }))
											}
										}}
										onKeyDown={(e) => {
											// Permitir: backspace, delete, tab, escape, enter, flechas
											if ([8, 9, 27, 13, 46].includes(e.keyCode) ||
												// Permitir: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
												(e.keyCode === 65 && e.ctrlKey === true) ||
												(e.keyCode === 67 && e.ctrlKey === true) ||
												(e.keyCode === 86 && e.ctrlKey === true) ||
												(e.keyCode === 88 && e.ctrlKey === true) ||
												// Permitir: home, end, left, right
												(e.keyCode >= 35 && e.keyCode <= 39)) {
												return
											}
											// Bloquear si no es un número (0-9)
											if ((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
												e.preventDefault()
											}
										}}
										onPaste={(e) => {
											// Limpiar cualquier caracter no numérico al pegar
											e.preventDefault()
											const pastedText = e.clipboardData.getData('text')
											const cleanedText = pastedText.replace(/\D/g, '')
											const newValue = formData.phone + cleanedText
											const maxLength = countryCodes.find(c => c.code === formData.countryCode)?.maxLength || 15
											setFormData(prev => ({ ...prev, phone: newValue.slice(0, maxLength) }))
										}}
										placeholder={countryCodes.find(c => c.code === formData.countryCode)?.placeholder || t('contact.form.phone.placeholder')}
										maxLength={countryCodes.find(c => c.code === formData.countryCode)?.maxLength || 15}
										className={`flex-1 block w-full rounded-md border px-3 py-2 text-gray-900 dark:text-white 
										shadow-sm focus:ring-2 focus:ring-offset-0 transition-colors duration-300 ${
											formErrors.phone
												? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20 focus:border-red-500 focus:ring-red-500'
												: 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-gray-600'
										}`}
									/>
								</div>
								{formErrors.phone && (
									<p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.phone}</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									{t('contact.form.areas.title')}
								</label>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
									{areasDeInteres.map((area) => (
										<label
											key={area.id}
											className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
												formData.areas.includes(area.id)
													? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
													: 'border-gray-200 dark:border-gray-600 hover:border-blue-200 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-900/20'
											}`}
										>
											<input
												type="checkbox"
												className="sr-only"
												checked={formData.areas.includes(area.id)}
												onChange={() => handleAreaChange(area.id)}
											/>
											<span className="text-sm">{area.label}</span>
										</label>
									))}
								</div>
							</div>

							<div>
								<label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
									{t('contact.form.message.title')}
								</label>
								<textarea
									id="message"
									name="message"
									value={formData.message}
									onChange={handleChange}
									placeholder={t('contact.form.message.placeholder')}
									rows={4}
									className={`mt-1 block w-full rounded-md border px-3 py-2 text-gray-900 dark:text-white 
									shadow-sm focus:ring-2 focus:ring-offset-0 transition-colors duration-300 ${
										formErrors.message
											? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20 focus:border-red-500 focus:ring-red-500'
											: 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-gray-600'
									}`}
								/>
								{formErrors.message && (
									<p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.message}</p>
								)}
							</div>

							{/* Status notification */}
							{submitStatus !== 'idle' && (
								<div
									className={`flex items-center p-4 rounded-lg border ${
										submitStatus === 'success'
											? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300'
											: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300'
									}`}
								>
									{submitStatus === 'success' ? (
										<CheckCircle className="h-5 w-5 mr-2" />
									) : (
										<AlertCircle className="h-5 w-5 mr-2" />
									)}
									<span className="text-sm">{submitMessage}</span>
								</div>
							)}

							<button
								type="submit"
								disabled={isSubmitting}
								className="w-full flex items-center justify-center px-6 py-3 relative
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
                  hover:after:opacity-100 after:transition-opacity after:duration-500"
							>
								<Send className="h-5 w-5 mr-2" />
								{isSubmitting ? t('contact.form.button.submitting') : t('contact.form.button.send')}
							</button>
						</form>
					</div>

					<div className="space-y-8">
						<div className="bg-white dark:bg-gray-800 rounded-2xl border border-blue-500/60 p-8 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
							<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
								{t('contact.contactInf.title')}
							</h3>

							<div className="space-y-6">
								{/* Sección superior: Texto | Logo */}
								<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
									<div className="space-y-4">
										<div className="flex items-center">
											<Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
											<a
												href="mailto:ventas@solware.agency"
												className="ml-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 
		                      dark:hover:text-blue-400 transition-colors"
											>
												ventas@solware.agency
											</a>
										</div>

										<div className="flex items-center">
											<Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
											<a
												href="tel:+584129974533"
												className="ml-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 
		                      dark:hover:text-blue-400 transition-colors"
											>
												+58 412-9974533
											</a>
										</div>

										<div className="flex items-center">
											<Instagram className="h-5 w-5 text-blue-600 dark:text-blue-400" />
											<a
												href="https://www.instagram.com/solware_?igsh=MTg4OTdwM3k3d2o4cA=="
												target="_blank"
												rel="noopener noreferrer"
												className="ml-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 
		                      dark:hover:text-blue-400 transition-colors"
											>
												{t('contact.contactInf.ig')}
											</a>
										</div>

										<div className="flex items-center">
											<svg
												className="h-5 w-5 text-blue-600 dark:text-blue-400"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 24 24"
												fill="currentColor"
											>
												<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.5c0-1.379-1.121-2.5-2.5-2.5s-2.5 1.121-2.5 2.5v5.5h-3v-10h3v1.5c.69-.69 1.79-1.5 3-1.5 2.209 0 4 1.791 4 4v6z" />
											</svg>
											<a
												href="https://www.linkedin.com/company/agencia-solware/"
												target="_blank"
												rel="noopener noreferrer"
												className="ml-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 
		                      dark:hover:text-blue-400 transition-colors"
											>
												{t('contact.contactInf.linkedin')}
											</a>
										</div>
									</div>

									{/* Logo a la derecha - centrado verticalmente */}
									<div className="flex justify-center lg:justify-center items-center">
										<div className="group relative">
											<div
												className="rounded-full p-4 drop-shadow-[0px_0px_3px_rgba(29,78,216,0.5)] group-hover:drop-shadow-[0px_0px_10px_rgba(29,78,216,0.8)] transition duration-300 hover:scale-110 animate-pulse"
												style={{ backgroundColor: '#3b82f6' }}
											>
												<svg 
													className="size-20 text-white group-hover:rotate-180 transition-all duration-700 ease-in-out"
													viewBox="0 0 500 500"
													fill="currentColor"
												>
													<path d="M88.26,341.01h-3.59c-15.43,0-27.94,12.51-27.94,27.94v77.04h80.64c15.43,0,27.94-12.51,27.94-27.94h0c0-42.37-34.67-77.04-77.04-77.04Z"/>
													<path d="M165.3,162.58h93.26v1.6c0,42.71,34.73,77.44,77.04,77.44h6.08c3.91-77.09,43.05-144.85,101.61-187.62H133.76c-42.31,0-77.04,34.33-77.04,77.04v31.54c0,229.93,247.9,134.53,247.9,255.88v27.54h108.58v-27.54c0-208.38-247.9-124.55-247.9-255.88Z"/>
												</svg>
											</div>
										</div>
									</div>
								</div>

								{/* Línea divisoria */}
								<hr className="border-gray-200 dark:border-gray-700" />

								{/* Botón de WhatsApp ocupando todo el ancho */}
								<div>
									<button
										onClick={openWhatsApp}
										className="w-full flex items-center justify-center px-6 py-3 relative
	                    bg-green-500 dark:bg-green-600 text-white rounded-full 
	                    hover:bg-green-600 dark:hover:bg-green-700 hover:scale-105 hover:shadow-2xl
	                    border border-green-400/30 dark:border-green-300/20
	                    transition-all duration-300 shadow-lg hover:-translate-y-1
	                    active:scale-95 transform
	                    before:absolute before:inset-0 before:rounded-full before:border 
	                    before:border-green-300/40 dark:before:border-green-400/30 before:opacity-0 
	                    hover:before:opacity-100 before:transition-opacity before:duration-300
	                    after:absolute after:inset-[-2px] after:rounded-full after:border 
	                    after:border-green-200/30 dark:after:border-green-500/20 after:opacity-0 
	                    hover:after:opacity-100 after:transition-opacity after:duration-500"
									>
										<svg 
											className="h-5 w-5 mr-2" 
											fill="currentColor" 
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.787"/>
										</svg>
										{t('contact.wspButton')}
									</button>
								</div>
							</div>
						</div>

						<div className="bg-white dark:bg-gray-800 rounded-2xl border border-blue-500/60 p-8 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
							<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
								{t('contact.faq.title')}
							</h3>

							<div className="space-y-4">
								{faqs.map((faq, index) => (
									<details
										key={index}
										className="group"
										open={openFaqIndex === index}
										onClick={(e) => {
											e.preventDefault()
											handleFaqClick(index)
										}}
									>
										<summary
											className="flex justify-between items-center cursor-pointer 
                      text-gray-700 dark:text-gray-300 hover:text-blue-600 
                      dark:hover:text-blue-400 transition-colors list-none"
										>
											<span>{faq.question}</span>
											<ChevronDown
												className={`h-5 w-5 transform transition-transform duration-500
                        ${openFaqIndex === index ? 'rotate-180' : ''}`}
											/>
										</summary>
										<div
											className="overflow-hidden transition-all duration-500 ease-in-out"
											style={{
												maxHeight: openFaqIndex === index ? '200px' : '0px',
												opacity: openFaqIndex === index ? 1 : 0,
												marginTop: openFaqIndex === index ? '0.5rem' : '0',
											}}
										>
											<p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
										</div>
									</details>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Contact
