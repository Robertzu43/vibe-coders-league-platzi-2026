# Reto 12 — Prompt Engineering: De genérico a preciso

## Resumen

Documento Markdown que demuestra la metodología **Rol + Enfoque + Límites + Contexto** aplicada a la tarea de escribir un correo de follow-up profesional después de una reunión de negocios. Se presentan 3 versiones de prompts (básico, intermedio, avanzado) con evolución progresiva, mostrando cómo cada capa de la fórmula mejora el resultado.

## Formato de entrega

Un único `README.md` en `reto-12/` — sin código de aplicación, sin dependencias.

**Idioma:** Español.

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
- Ejemplos (few-shot): cuándo usar ejemplos en el prompt y por qué en este caso el contexto específico fue más efectivo

### 11. Conclusiones
- La fórmula funciona porque reduce ambigüedad progresivamente
- Cada elemento cumple un rol específico en la calidad del output
- El contexto es el diferenciador más grande entre un resultado genérico y uno útil

## Mapeo de técnicas del reto a la fórmula RELC

El reto pide explicar 5 técnicas: contexto, ejemplos, formato, rol, restricciones. La fórmula RELC tiene 4 componentes. Mapeo:

| Técnica del reto | Componente RELC | Notas |
|---|---|---|
| Rol | **Rol** | Directo |
| Contexto | **Contexto** | Directo |
| Formato | **Límites** | Formato es un tipo de límite (estructura, extensión) |
| Restricciones | **Límites** | Tono, extensión máxima, qué evitar |
| Ejemplos (few-shot) | No está en RELC | Se menciona como técnica complementaria en Tips adicionales. El prompt avanzado incluye un ejemplo implícito al dar contexto detallado de la reunión, pero no usa few-shot explícito. Se explica por qué: para un correo único, el contexto específico es más valioso que ejemplos genéricos. |

## Esbozo de resultados simulados

Los resultados son textos representativos, no llamadas reales a un LLM. Esto es intencional: el reto es sobre la técnica de prompt engineering.

### Resultado básico (esperado)
- Saludo genérico ("Estimado/a")
- Referencia vaga a "nuestra reunión reciente"
- Sin nombres, sin datos específicos
- Sin próximos pasos concretos
- Tono plano y formulaico
- ~80 palabras

### Resultado intermedio (esperado)
- Tono más profesional y consultivo
- Mención de "transformación digital" como tema
- Referencia a ser consultor
- Aún sin nombres propios ni detalles de la reunión
- Próximos pasos genéricos ("quedo a su disposición")
- ~120 palabras

### Resultado avanzado (esperado)
- Usa "Carlos" y "ManufacturaPro" por nombre
- Referencia específica a la digitalización de línea de producción
- Menciona la fase piloto de 3 meses
- CTA claro: "enviaré la propuesta formal el miércoles"
- Estructura: saludo → agradecimiento → resumen de lo discutido → próximos pasos → cierre
- Tono profesional pero cercano
- ~150-200 palabras

## Diagramas

Se usarán 2 diagramas Mermaid:
1. **Diagrama de la fórmula** (sección 3): muestra los 4 componentes y su relación
2. **Diagrama de evolución** (sección 9): flowchart de cómo el prompt evoluciona de básico a avanzado

## Fuera de alcance

- No hay código de aplicación
- No hay dependencias ni package.json
- No se ejecutan prompts reales contra un LLM
- No se crea web app
