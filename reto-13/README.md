# Reto 13 — System Prompt Design: Professor AI

> Vibe Coders League Platzi 2026

Diseno de un system prompt completo para una Gema de Gemini que actua como tutor academico especializado en LLMs e IA generativa. El documento incluye el prompt, su razonamiento de diseno, anatomia por componentes y conversaciones de prueba que demuestran su funcionamiento.

**Estado:** En progreso

---

## 1. El reto

Disenar un system prompt completo para un chatbot con un proposito especifico. El prompt debe incluir:

| # | Elemento requerido | Descripcion |
|---|---|---|
| 1 | **Rol definido** | Identidad y experiencia del chatbot |
| 2 | **Tono** | Estilo de comunicacion consistente |
| 3 | **Restricciones** | Limites de dominio, contenido y comportamiento |
| 4 | **Formato de respuesta** | Estructura predecible para cada respuesta |
| 5 | **Ejemplos de interaccion** | Minimo 2 conversaciones esperadas |

Ademas, se debe presentar una conversacion de prueba mostrando como funciona el prompt en la practica.

---

## 2. Razonamiento de diseno

### Proposito de la Gema

Una Gema de Gemini para uso personal que sirva como tutor academico en IA generativa. El objetivo es triple:

1. **Profundizar conocimientos** — entender como funcionan los modelos por dentro, no solo usarlos
2. **Mantenerse actualizado** — seguir el ritmo de nuevos modelos, tecnicas y herramientas
3. **Desarrollo profesional** — descubrir herramientas y tecnicas que mejoren el flujo de trabajo como vibe coder

### Perfil del usuario

- Nivel intermedio: entiende conceptos como transformers, fine-tuning, RAG y embeddings, pero no los ha implementado todos
- Busca profundidad tecnica, no divulgacion superficial
- Prefiere respuestas estructuradas y formales

### Eleccion del enfoque

Se evaluaron tres enfoques posibles:

| Enfoque | Descripcion | Ventaja | Desventaja |
|---|---|---|---|
| **Tutor academico** | Estructura cada respuesta como una mini-leccion con definicion, mecanismo, comparacion, implicaciones y lecturas | Construye conocimiento acumulativo | Puede ser lento para preguntas rapidas |
| **Bot de briefing** | Formato de reporte: TL;DR, hallazgos, analisis | Rapido de escanear | Menos profundidad pedagogica |
| **Hibrido** | Tutor por defecto con modo briefing activable | Flexible | System prompt mas complejo |

**Enfoque elegido: Tutor academico.** La razon principal es que el objetivo es aprender y profundizar, no solo mantenerse informado. Una estructura pedagogica consistente construye modelos mentales solidos que una lista de noticias no logra.
