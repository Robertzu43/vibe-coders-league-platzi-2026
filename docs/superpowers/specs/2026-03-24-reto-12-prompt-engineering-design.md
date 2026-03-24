# Reto 12 — Prompt Engineering: De genérico a preciso

## Resumen

Documento Markdown que demuestra la metodología **Rol + Enfoque + Límites + Contexto** aplicada a la tarea de escribir un correo de follow-up profesional después de una reunión de negocios. Se presentan 3 versiones de prompts (básico, intermedio, avanzado) con evolución progresiva, mostrando cómo cada capa de la fórmula mejora el resultado.

## Formato de entrega

Un único `README.md` en `reto-12/` — sin código de aplicación, sin dependencias.

## Escenario

Un consultor de transformación digital tuvo una reunión con el director de operaciones de una empresa manufacturera. Quiere hacer follow-up para avanzar con la propuesta de digitalización.

## Estructura del README

### 1. Header
- Título: "Reto 12 — Prompt Engineering: De genérico a preciso"
- Descripción breve del reto
- Estado: Completado

### 2. El reto
- Qué se pide: elegir un objetivo, escribir 3 versiones de prompts, mostrar resultados, explicar técnicas.

### 3. La metodología
- Explicación de la fórmula: Rol + Enfoque + Límites + Contexto
- Breve descripción de cada componente
- Diagrama Mermaid del flujo de la fórmula

### 4. El objetivo elegido
- Escribir un correo de follow-up profesional post-reunión de negocios
- Contexto del escenario ficticio

### 5. Prompt Básico
- **Prompt:** Una línea genérica sin contexto
  - `"Escribe un correo de seguimiento después de una reunión"`
- **Resultado:** Correo genérico generado (simulado, representativo de lo que un LLM produciría)
- **Análisis:** Tabla mostrando qué elementos de la fórmula están presentes/ausentes
- **Veredicto:** Qué falla y por qué

### 6. Prompt Intermedio
- **Prompt:** Agrega Rol + Enfoque
  - Asigna identidad de consultor de transformación digital
  - Define acción concreta: redactar follow-up profesional para potencial cliente
- **Resultado:** Correo mejorado (simulado)
- **Análisis:** Tabla de elementos presentes/ausentes
- **Veredicto:** Qué mejoró y qué aún falta

### 7. Prompt Avanzado
- **Prompt:** Fórmula completa — Rol + Enfoque + Límites + Contexto
  - Rol: consultor senior de transformación digital con 10 años de experiencia
  - Enfoque: redactar correo de follow-up post-reunión
  - Límites: máximo 200 palabras, tono profesional pero cercano, incluir CTA claro, estructura con saludo/resumen/próximos pasos/cierre
  - Contexto: reunión con Carlos Méndez (Dir. Operaciones de ManufacturaPro), se discutió digitalización de línea de producción, interés en fase piloto de 3 meses, próximo paso es enviar propuesta formal
- **Resultado:** Correo preciso, personalizado, listo para enviar (simulado)
- **Análisis:** Tabla de elementos — todos presentes
- **Veredicto:** Por qué este resultado es superior

### 8. Comparativa general
- Tabla resumen de los 3 niveles:
  - Columnas: Nivel | Rol | Enfoque | Límites | Contexto | Calidad del resultado
  - Filas: Básico (solo enfoque implícito), Intermedio (Rol + Enfoque), Avanzado (todos)

### 9. Diagrama de flujo
- Diagrama Mermaid tipo flowchart mostrando:
  - Prompt genérico → se agrega Rol → se agrega Enfoque → se agregan Límites → se agrega Contexto → Resultado preciso
  - Cada nodo muestra qué aporta ese elemento
  - Flechas con labels descriptivos

### 10. Tips adicionales
- Resolver problemas complejos: dividir en pasos
- Creatividad vs. precisión: cuándo dar más libertad vs. más restricciones
- Elegir modelo y enfoque según la tarea

### 11. Conclusiones
- La fórmula funciona porque reduce ambigüedad progresivamente
- Cada elemento cumple un rol específico en la calidad del output
- El contexto es el diferenciador más grande entre un resultado genérico y uno útil

## Resultados simulados

Los resultados de cada prompt serán textos representativos de lo que un LLM produciría, no llamadas reales a un modelo. Esto es intencional: el reto es sobre prompt engineering (la técnica), no sobre ejecutar prompts.

## Diagramas

Se usarán 2 diagramas Mermaid:
1. **Diagrama de la fórmula** (sección 3): muestra los 4 componentes y su relación
2. **Diagrama de evolución** (sección 9): flowchart de cómo el prompt evoluciona de básico a avanzado

## Fuera de alcance

- No hay código de aplicación
- No hay dependencias ni package.json
- No se ejecutan prompts reales contra un LLM
- No se crea web app
