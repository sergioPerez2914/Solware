# Script de Prueba para Resend

## Opción 1: Usando Vercel Dev (Recomendado)

Este es el método más cercano a producción:

```bash
# 1. Instalar Vercel CLI (solo una vez)
npm install -g vercel

# 2. En la carpeta del proyecto
cd c:\Users\reneb\OneDrive\Desktop\Proyecto\Solware

# 3. Correr el servidor de desarrollo
vercel dev
```

Esto iniciará:
- Tu frontend en `http://localhost:3000`
- La función serverless en `http://localhost:3000/api/send`

Luego simplemente usa el formulario de contacto normalmente.

---

## Opción 2: Probar Solo la Función (cURL)

Si solo quieres probar que la función envía emails:

### En PowerShell:
```powershell
$body = @{
    name = "René Test"
    email = "test@example.com"
    phone = "+58 412-1234567"
    areas = "Automatización, CRM"
    message = "Este es un mensaje de prueba desde PowerShell"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/send" -Method Post -Body $body -ContentType "application/json"
```

### En CMD (usando curl):
```bash
curl -X POST http://localhost:3000/api/send ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"phone\":\"+58 412-1234567\",\"areas\":\"Automatización\",\"message\":\"Mensaje de prueba\"}"
```

---

## Opción 3: Probar con Postman

1. Abre Postman
2. Crea una nueva petición POST
3. URL: `http://localhost:3000/api/send`
4. Headers:
   - `Content-Type: application/json`
5. Body (raw, JSON):
```json
{
  "name": "Usuario de Prueba",
  "email": "usuario@ejemplo.com",
  "phone": "+58 412-9974533",
  "areas": "Automatización, Desarrollo Web, CRM",
  "message": "Este es un mensaje de prueba para verificar que Resend funciona correctamente."
}
```

---

## Verificar que Todo Está Configurado

### 1. Verificar que Resend está instalado
```bash
pnpm list resend
```

Debería mostrar algo como:
```
resend 6.5.2
```

### 2. Verificar que la API key está configurada
```bash
# En PowerShell
Get-Content .env | Select-String "RESEND_API_KEY"
```

Debería mostrar:
```
RESEND_API_KEY=re_your_api_key_here
```

### 3. Verificar que el archivo de la función existe
```bash
# En PowerShell
Test-Path api\send.js
```

Debería devolver: `True`

---

## Respuestas Esperadas

### ✅ Éxito (Status 200)
```json
{
  "success": true,
  "message": "Email enviado exitosamente",
  "data": {
    "id": "abc123..."
  }
}
```

### ❌ Error de validación (Status 405)
```json
{
  "error": "Method not allowed"
}
```

### ❌ Error de Resend (Status 400)
```json
{
  "error": "Invalid email address"
}
```

### ❌ Error del servidor (Status 500)
```json
{
  "error": "Error interno del servidor",
  "details": "..."
}
```

---

## Problemas Comunes

### "Cannot find module 'resend'"
**Solución:** 
```bash
pnpm install resend
```

### "RESEND_API_KEY is not defined"
**Solución:**
- Verifica que `.env` tenga la variable configurada
- Si usas Vercel Dev, reinícialo: `Ctrl+C` y luego `vercel dev`

### "fetch failed" o "ECONNREFUSED"
**Solución:**
- Asegúrate de que `vercel dev` esté corriendo
- Verifica que la URL sea `http://localhost:3000/api/send`

### El email no llega
**Solución:**
- Revisa la carpeta de spam
- Verifica que el email de destino sea correcto en `api/send.js`
- Revisa los logs en la terminal de Vercel Dev

---

## Siguiente Paso: Desplegar a Producción

Una vez que todo funcione localmente:

```bash
# 1. Commitear los cambios
git add .
git commit -m "feat: Integrar Resend para formulario de contacto"
git push

# 2. Vercel desplegará automáticamente
```

No olvides configurar `RESEND_API_KEY` en las variables de entorno de Vercel (ver RESEND_SETUP.md).
