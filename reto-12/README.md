# Reto 12 — Prompt Engineering: De genérico a preciso

> Vibe Coders League Platzi 2026

Documentación del proceso de diseño de prompts progresivos aplicando técnicas de ingeniería de prompts: desde una instrucción vaga hasta una instrucción precisa y estructurada, con resultados comparables y análisis de cada técnica empleada.

**Estado:** Completado

---

## 1. El reto

El reto consiste en elegir un objetivo concreto y escribir **tres versiones de un prompt** — básico, intermedio y avanzado — para ese mismo objetivo. Por cada versión se muestra el resultado obtenido y se explican las técnicas aplicadas.

Las cinco técnicas que el reto pide demostrar son:

| # | Técnica | Descripción breve |
|---|---|---|
| 1 | **Contexto** | Proporcionar información específica que da sustancia al prompt |
| 2 | **Ejemplos** | Incluir muestras de entrada/salida esperada (few-shot) |
| 3 | **Formato** | Indicar la estructura de la respuesta (lista, tabla, párrafo, etc.) |
| 4 | **Rol** | Asignar una identidad experta al modelo |
| 5 | **Restricciones** | Definir límites de tono, extensión o contenido a evitar |

Cada versión del prompt incorpora técnicas adicionales respecto a la anterior, de modo que el lector puede observar cómo cada capa de instrucción mejora la calidad y utilidad de la respuesta.

---

## 2. La metodología

### La fórmula RELC

Para construir los prompts de forma sistemática se utiliza la fórmula **RELC**, que descompone cualquier prompt en cuatro componentes ortogonales:

```
Prompt = Rol + Enfoque + Límites + Contexto
```

Cada componente responde a una pregunta distinta y aporta un tipo diferente de precisión:

#### Rol
**¿Quién responde?** Da identidad experta al modelo.

Ejemplo: "Eres un especialista en marketing B2B con diez años de experiencia en SaaS."

Beneficios:
- Profesionalismo en el lenguaje y el enfoque
- Consistencia en criterios y perspectiva
- Mejor calibración del nivel de detalle técnico

#### Enfoque
**¿Qué debe hacer?** Define la acción concreta que se espera del modelo.

Ejemplo: "Redacta un correo de prospección en frío para un director de operaciones."

Consejo: usa verbos de acción precisos como crear, redactar, clasificar, resumir, comparar, evaluar.

#### Límites
**¿Cómo debe hacerlo?** Marcan el formato, el tono y la extensión de la respuesta.

Ejemplo: "Usa un tono profesional pero cercano. Máximo 150 palabras. Sin tecnicismos de ingeniería."

Efecto: claridad en la forma de entrega + precisión en el alcance de la respuesta.

#### Contexto
**¿Con qué información cuenta?** Da sustancia y referencia al prompt.

Ejemplo: "El producto es una plataforma de gestión de inventario. El prospecto trabaja en una empresa de distribución de 200 empleados que actualmente usa hojas de cálculo."

Efecto: evita respuestas genéricas al anclar al modelo a datos específicos y relevantes.

---

### Diagrama de la fórmula

```mermaid
graph LR
    A["Prompt vago"] --> B["+ Rol"]
    B --> C["+ Enfoque"]
    C --> D["+ Límites"]
    D --> E["+ Contexto"]
    E --> F["Resultado preciso"]

    B -.- G["¿Quién responde?<br/>Identidad experta"]
    C -.- H["¿Qué debe hacer?<br/>Acción concreta"]
    D -.- I["¿Cómo debe hacerlo?<br/>Formato, tono, extensión"]
    E -.- J["¿Con qué info?<br/>Datos específicos"]
```

---

### Mapeo: técnicas del reto vs. componentes RELC

Las cinco técnicas que el reto exige no son ajenas a RELC; la mayoría son instancias directas de sus componentes:

| Técnica del reto | Componente RELC | Notas |
|---|---|---|
| Rol | **Rol** | Directo — asignar identidad experta |
| Contexto | **Contexto** | Directo — proporcionar información específica |
| Formato | **Límites** | El formato es un tipo de límite (estructura, extensión) |
| Restricciones | **Límites** | Tono, extensión máxima, qué evitar |
| Ejemplos (few-shot) | Técnica complementaria | No forma parte de RELC, pero se aborda en Tips adicionales |

La única técnica que RELC no cubre de forma nativa es **los ejemplos** (few-shot prompting). Esta técnica actúa como un mecanismo de calibración adicional: en lugar de describir el resultado esperado, se muestra directamente. Se aborda en la sección de Tips adicionales.

---

## 4. El objetivo elegido

**Tarea:** redactar un correo profesional de seguimiento después de una reunión de negocios.

**Escenario:** Un consultor en transformación digital tuvo una reunión con Carlos Méndez, Director de Operaciones de ManufacturaPro, una empresa del sector manufacturero. Durante la reunión se discutió la digitalización de su línea de producción. Carlos mostró interés en una fase piloto de tres meses. El siguiente paso acordado es enviar una propuesta formal esta semana. La reunión tuvo lugar en las oficinas de ManufacturaPro y el ambiente fue positivo.

Este escenario es ideal para el ejercicio porque:

- Tiene nombres, cargos y empresa reales que el modelo puede aprovechar.
- Existe un siguiente paso concreto que debe reflejarse en el correo.
- El tono debe ser profesional pero cordial, lo que permite demostrar el efecto de las restricciones.
- Un prompt vago produce un correo inútil; un prompt preciso produce uno que se puede enviar sin edición.

---

## 5. Prompt Básico

### El prompt

```
Escribe un correo de seguimiento después de una reunión
```

### Resultado simulado

> Estimado/a,
>
> Me pongo en contacto para hacer seguimiento de nuestra reunión reciente. Fue un placer conversar con usted y explorar posibles áreas de colaboración.
>
> Quedo a su disposición para continuar avanzando en los temas que discutimos. Si tiene alguna pregunta o requiere información adicional, no dude en contactarme.
>
> Espero que podamos continuar con los próximos pasos en el futuro cercano.
>
> Saludos cordiales,
> [Nombre]

### Análisis

| Elemento | ¿Presente? | Detalle |
|----------|-----------|---------|
| Rol      | No        | No se asigna identidad experta |
| Enfoque  | Implícito | Solo dice "escribe un correo", sin definir tipo ni propósito |
| Límites  | No        | Sin restricciones de formato, tono ni extensión |
| Contexto | No        | Sin datos de la reunión, personas ni empresa |

### Veredicto

El resultado es genérico porque el modelo no tiene restricciones, no tiene identidad y no tiene información con la que trabajar. La salida es técnicamente correcta —es un correo de seguimiento— pero completamente inútil en la práctica: podría corresponder a cualquier reunión, con cualquier persona, en cualquier industria. No menciona a Carlos Méndez, no hace referencia a ManufacturaPro, no habla de digitalización ni de la fase piloto, y no propone ningún siguiente paso concreto. El modelo hizo lo que pudo con una instrucción vacía.

---

## 6. Prompt Intermedio

### El prompt

```
Eres un consultor de transformación digital. Redacta un correo de seguimiento
profesional después de una reunión con un potencial cliente empresarial.
El correo debe transmitir profesionalismo y mantener el interés del cliente.
```

### Resultado simulado

> Estimado/a,
>
> Me dirijo a usted para agradecer el tiempo que nos dedicó durante nuestra reunión y reafirmar el interés de nuestro equipo en acompañar a su organización en su proceso de transformación digital.
>
> Como consultor especializado en esta área, considero que los temas abordados representan una oportunidad concreta para mejorar la eficiencia operativa de su empresa. Estamos convencidos de que un enfoque estratégico y progresivo puede generar un impacto medible en el corto y mediano plazo.
>
> Quedo a su disposición para responder cualquier pregunta, ampliar la información compartida o coordinar una próxima reunión en el momento que sea conveniente para usted.
>
> Agradezco su confianza y espero que podamos avanzar juntos en esta dirección.
>
> Atentamente,
> [Nombre]
> Consultor de Transformación Digital

### Análisis

| Elemento | ¿Presente? | Detalle |
|----------|-----------|---------|
| Rol      | Sí        | Consultor de transformación digital |
| Enfoque  | Sí        | Redactar follow-up profesional para cliente empresarial |
| Límites  | No        | Sin restricciones de formato, tono específico ni extensión |
| Contexto | No        | Sin datos de la reunión, nombres ni detalles específicos |

### Veredicto

El rol le da al correo una voz profesional y consultiva que el prompt básico no tenía. El enfoque precisa la acción — queda claro que es un seguimiento empresarial y no cualquier tipo de correo. Sin embargo, sin límites, la estructura y extensión del correo son arbitrarias: el modelo decide solo cuánto escribir y en qué formato. Y sin contexto, el resultado sigue siendo impersonal — podría enviarse a cualquier cliente potencial en cualquier industria. La mejora respecto al prompt básico es real pero insuficiente para un correo listo para enviar.
