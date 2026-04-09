# HEARTBEAT.md — Tareas Periódicas de Pérez

> Pérez revisa este archivo en cada heartbeat (cada 30 minutos). Ejecuta las tareas que correspondan según la hora y el día.

## Tareas por Horario

### 🌅 Resumen Matutino (7:00 AM — 8:00 AM, Lunes a Sábado)
Si es entre 7:00 y 8:00 AM de Lunes a Sábado y NO has enviado el resumen hoy:
1. Consulta Google Calendar para las citas de HOY
2. Arma un resumen con: hora, paciente, servicio, doctor asignado, y notas
3. Envía email a dramartinezcolmillo@gmail.com con asunto "🐭 Buenos días Dra. — Agenda del [fecha de hoy]"
4. Si no hay citas hoy, envía: "Día libre Dra. ¡A descansar! 🐭"
5. Registra en memory/ que enviaste el resumen matutino

### 🔔 Recordatorio de Citas (8:00 PM — 9:00 PM, todos los días)
Si es entre 8:00 y 9:00 PM y NO has enviado recordatorios hoy:
1. Consulta Google Calendar para las citas de MAÑANA
2. Por cada cita encontrada, envía mensaje por Telegram al paciente (usa su Chat ID de memory/):
   "¡Hola [nombre]! 🐭 Te recuerdo que mañana tienes tu cita de [servicio] a las [hora] con [doctor]. ¿Nos vemos? Responde SI para confirmar o NO para reagendar."
3. Registra los recordatorios enviados en memory/

### 💬 Follow-up Post-Tratamiento (11:00 AM — 12:00 PM, todos los días)
Si es entre 11:00 AM y 12:00 PM y NO has enviado follow-ups hoy:
1. Revisa los archivos en memory/ buscando citas agendadas cuya fecha fue hace exactamente 7 días y que NO estén canceladas
2. Por cada una, envía mensaje por Telegram al paciente (usa su Chat ID):
   "¡Hola [nombre]! 🐭 Ya pasó una semana desde tu [servicio]. ¿Cómo te has sentido? ¿Alguna molestia? Si todo está bien, nos ayudaría mucho tu reseña en Google: [usa GOOGLE_REVIEWS_URL de TOOLS.md]. ¡Tu opinión nos ayuda a seguir cuidando sonrisas! ⭐"
3. Sugiere los productos recomendados de PRODUCTOS.md según el tratamiento
4. Registra en memory/ que enviaste el follow-up

### 📊 Reporte Mensual de Ingresos (9:00 AM — 10:00 AM, día 1 de cada mes)
Si es día 1 del mes, entre 9:00 y 10:00 AM, y NO has enviado el reporte este mes:
1. Revisa todos los archivos memory/ del mes anterior
2. Extrae tratamientos registrados (citas no canceladas)
3. Cruza con precios de CLINICA.md para calcular ingreso estimado
4. Arma reporte: total ingresos, tratamientos más solicitados, pacientes atendidos, ingreso por doctor
5. Envía email a dramartinezcolmillo@gmail.com con asunto "🐭 Reporte de ingresos — [Mes Año anterior]"
6. Registra en memory/ que enviaste el reporte

## Regla Anti-Duplicación

Antes de ejecutar cualquier tarea, revisa memory/ del día de hoy. Si ya registraste que esa tarea fue ejecutada hoy, responde HEARTBEAT_OK y no la repitas.

## Si No Hay Nada que Hacer

Si ninguna tarea corresponde a la hora actual, o todas ya fueron ejecutadas hoy, responde: HEARTBEAT_OK
