# Configuración de Resend para el Formulario de Contacto

## ¿Qué es Resend?

Resend es un servicio de envío de emails moderno y fácil de usar, diseñado especialmente para desarrolladores. A diferencia de EmailJS, Resend funciona del lado del servidor, lo que significa que tu API key nunca se expone en el frontend.

## Estructura del Proyecto

```
Solware/
├── api/
│   └── send.js          # Función serverless de Vercel (backend)
├── src/
│   └── components/
│       └── Contact.tsx  # Formulario de contacto (frontend)
└── .env                 # Variables de entorno (NO subir a Git)
```

## Configuración Paso a Paso

### 1. Obtener tu API Key de Resend

1. Ve a [https://resend.com](https://resend.com)
2. Crea una cuenta o inicia sesión
3. Ve a **API Keys** en el panel de control
4. Haz clic en **Create API Key**
5. Dale un nombre (ej: "Solware Production")
6. Copia la key que comienza con `re_...`

### 2. Configurar Variables de Entorno

#### Desarrollo Local

En tu archivo `.env` local (ya configurado):
```env
RESEND_API_KEY=re_your_resend_api_key_here
```

#### Producción en Vercel

1. Ve a tu proyecto en [Vercel](https://vercel.com)
2. Click en **Settings** → **Environment Variables**
3. Agrega:
   - **Name:** `RESEND_API_KEY`
   - **Value:** `re_...` (tu API key de Resend)
   - **Environment:** Production, Preview, Development (selecciona todos)
4. Click en **Save**

### 3. Probar Localmente con Vercel Dev

Para probar la función serverless en local:

```bash
# Instalar Vercel CLI globalmente (solo una vez)
npm install -g vercel

# En la carpeta del proyecto, correr:
vercel dev
```

Esto iniciará un servidor local que simula el ambiente de Vercel, incluyendo las funciones serverless.

### 4. Verificar el Email de Remitente

**IMPORTANTE:** Por defecto, Resend usa el email `onboarding@resend.dev` que es solo para pruebas.

Para producción, debes:
1. Ir a **Domains** en Resend
2. Agregar tu propio dominio (ej: `solware.agency`)
3. Configurar los registros DNS según las instrucciones
4. Una vez verificado, cambiar en `api/send.js`:
   ```javascript
   from: 'Solware <contacto@solware.agency>'
   ```

### 5. Personalizar el Email de Destino

En `api/send.js`, línea 51:
```javascript
to: ['renebehrens90@gmail.com'], // Cambiar por tu email
```

## Cómo Funciona

### Frontend (Contact.tsx)
```javascript
// El formulario envía los datos a tu función serverless
const response = await fetch('/api/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(emailData),
})
```

### Backend (api/send.js)
```javascript
// La función serverless recibe los datos y usa Resend
const { data, error } = await resend.emails.send({
  from: 'Solware <onboarding@resend.dev>',
  to: ['renebehrens90@gmail.com'],
  subject: `Nuevo contacto de ${name}`,
  html: htmlContent,
})
```

## Sistema de Fallback

El formulario tiene un sistema de respaldo inteligente:

1. **Intenta con Resend** (función serverless)
2. Si falla → **Intenta con EmailJS** (si está configurado)
3. **Siempre guarda en Supabase** como backup

Esto asegura que nunca pierdas un mensaje de contacto.

## Ventajas de Resend vs EmailJS

| Característica | Resend | EmailJS |
|----------------|--------|---------|
| API Key expuesta | ❌ No (backend) | ⚠️ Sí (frontend) |
| Personalización HTML | ✅ Total | ⚠️ Limitada |
| Límite gratis | 100/día | 200/mes |
| Velocidad | ⚡ Muy rápida | 🐌 Regular |
| Programático | ✅ Sí | ❌ No |
| Reply-To automático | ✅ Sí | ⚠️ Requiere config |

## Depuración

### Ver logs en Vercel
1. Ve a tu proyecto en Vercel
2. Click en **Deployments**
3. Click en el deployment actual
4. Ve a **Functions** → `api/send.js`
5. Ahí verás todos los logs y errores

### Probar la función manualmente

Puedes probar la función con `curl` o Postman:

```bash
curl -X POST https://tu-proyecto.vercel.app/api/send \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+58 412-1234567",
    "areas": "Automatización, CRM",
    "message": "Este es un mensaje de prueba"
  }'
```

## Límites y Precios

### Plan Gratuito de Resend
- **100 emails/día**
- **3,000 emails/mes**
- Ideal para la mayoría de sitios web

### Plan Pro ($20/mes)
- **50,000 emails/mes**
- Soporte prioritario
- Webhooks avanzados

## Soporte

Si tienes problemas:
1. Revisa los logs en Vercel
2. Verifica que la API key esté correcta
3. Asegúrate de que Resend esté instalado: `pnpm list resend`
4. Consulta la [documentación oficial](https://resend.com/docs)

## Recursos Adicionales

- [Documentación de Resend](https://resend.com/docs)
- [Ejemplos de Resend](https://resend.com/examples)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
