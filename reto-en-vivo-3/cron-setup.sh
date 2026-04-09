#!/bin/bash
# Cron Jobs for Pérez Dental Agent
# Run this after deploying workspace files to ~/.openclaw/workspace/

echo "📋 Registering cron jobs for Pérez..."

# 1. Recordatorio de citas — 24h antes (8PM daily)
openclaw cron add \
  --name "reminder-tomorrow" \
  --cron "0 20 * * *" \
  --tz "America/Mexico_City" \
  --session isolated \
  --message 'Determina la fecha de hoy desde tu contexto. Revisa Google Calendar para las citas de MAÑANA. Por cada cita encontrada, envía un mensaje por Telegram al paciente (usa su Chat ID de memory/) con: "¡Hola [nombre]! 🐭 Te recuerdo que mañana tienes tu cita de [servicio] a las [hora] con [doctor]. ¿Nos vemos? Responde SI para confirmar o NO para reagendar." Registra los recordatorios enviados en memory/ del día de hoy.' \
  --announce

echo "✅ Cron 1/4: reminder-tomorrow (8PM daily)"

# 2. Resumen matutino para la Dra. (7:30AM Lun-Sáb)
openclaw cron add \
  --name "morning-brief" \
  --cron "30 7 * * 1-6" \
  --tz "America/Mexico_City" \
  --session isolated \
  --message 'Determina la fecha de hoy desde tu contexto. Consulta Google Calendar para las citas de HOY. Arma un resumen con: hora, paciente, servicio, doctor asignado, y notas. Envía email a dramartinezcolmillo@gmail.com con asunto "🐭 Buenos días Dra. — Agenda del [fecha de hoy]". Si no hay citas hoy, envía: "Día libre Dra. ¡A descansar! 🐭".' \
  --announce

echo "✅ Cron 2/4: morning-brief (7:30AM Lun-Sáb)"

# 3. Follow-up post-tratamiento 7 días (11AM daily)
openclaw cron add \
  --name "post-treatment-followup" \
  --cron "0 11 * * *" \
  --tz "America/Mexico_City" \
  --session isolated \
  --message 'Determina la fecha de hoy desde tu contexto. Revisa los archivos en memory/ buscando citas agendadas cuya fecha fue hace exactamente 7 días y que NO estén marcadas como canceladas. Por cada una, envía un mensaje por Telegram al paciente (usa su Chat ID) con: "¡Hola [nombre]! 🐭 Ya pasó una semana desde tu [servicio]. ¿Cómo te has sentido? ¿Alguna molestia? Si todo está bien, nos ayudaría mucho tu reseña en Google: [usa GOOGLE_REVIEWS_URL de TOOLS.md]. ¡Tu opinión nos ayuda a seguir cuidando sonrisas! ⭐" Luego sugiere los productos recomendados de PRODUCTOS.md según el tratamiento realizado. Registra en memory/ que se envió el follow-up.' \
  --announce

echo "✅ Cron 3/4: post-treatment-followup (11AM daily)"

# 4. Reporte mensual de ingresos (9AM día 1 de cada mes)
openclaw cron add \
  --name "monthly-revenue" \
  --cron "0 9 1 * *" \
  --tz "America/Mexico_City" \
  --session isolated \
  --message 'Determina la fecha de hoy desde tu contexto. Revisa todos los archivos memory/ del mes anterior. Extrae todos los tratamientos registrados (citas que no estén marcadas como canceladas). Cruza con los precios de CLINICA.md para calcular el ingreso estimado total. Arma un reporte con: total de ingresos, tratamientos más solicitados, cantidad de pacientes atendidos, e ingreso desglosado por doctor. Envía email a dramartinezcolmillo@gmail.com con asunto "🐭 Reporte de ingresos — [Mes Año anterior]".' \
  --announce

echo "✅ Cron 4/4: monthly-revenue (9AM día 1/mes)"
echo ""
echo "✅ Todos los cron jobs registrados. Verifica con: openclaw cron list"
