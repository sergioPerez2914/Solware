import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // CORS headers para permitir peticiones desde tu frontend
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Manejar preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Solo permitimos solicitudes POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Tomamos los datos que vienen del frontend
    const { name, email, phone, areas, message } = req.body;

    // Validación de datos requeridos
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Datos incompletos',
        details: 'Se requieren nombre, email y mensaje' 
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Email inválido',
        details: 'Por favor proporciona un email válido' 
      });
    }

    // Construir el HTML del email con mejor formato
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 10px;">
        <div style="background-color: #3b82f6; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">Nuevo mensaje de contacto</h1>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Información del Cliente</h2>
          
          <div style="margin: 20px 0;">
            <p style="margin: 10px 0;"><strong style="color: #3b82f6;">Nombre:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong style="color: #3b82f6;">Email:</strong> <a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a></p>
            <p style="margin: 10px 0;"><strong style="color: #3b82f6;">Teléfono:</strong> <a href="tel:${phone}" style="color: #3b82f6; text-decoration: none;">${phone}</a></p>
            ${areas && areas.length > 0 ? `<p style="margin: 10px 0;"><strong style="color: #3b82f6;">Áreas de interés:</strong> ${areas}</p>` : ''}
          </div>

          <div style="margin: 20px 0;">
            <h3 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Mensaje</h3>
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin-top: 10px; border-left: 4px solid #3b82f6;">
              <p style="color: #4b5563; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">Este mensaje fue enviado desde el formulario de contacto de Solware</p>
          </div>
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: 'Solware <onboarding@resend.dev>', // Email de prueba de Resend
      to: ['ventas@solware.agency'], // Tu correo donde recibirás los mensajes
      subject: `Nuevo contacto de ${name} - Solware`,
      html: htmlContent,
      replyTo: email, // Para que puedas responder directamente desde tu email
    });

    if (error) {
      console.error('Error de Resend:', error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Email enviado exitosamente',
      data 
    });
  } catch (error) {
    console.error('Error al enviar email:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
}
