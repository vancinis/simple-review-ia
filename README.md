# Simple Review IA

Un paquete npm liviano para generar resúmenes amistosos de reseñas usando modelos de IA como Gemini y OpenAI.

## 🚀 Características

- ✅ **Liviano**: Solo un archivo principal
- ✅ **Multi-modelo**: Soporte para Gemini y OpenAI
- ✅ **Configurable**: Opciones personalizables para tono y longitud
- ✅ **TypeScript**: Tipado completo incluido
- ✅ **Fácil de usar**: API simple y directa
- ✅ **Prompt optimizado**: Genera solo resúmenes sin saludos ni comentarios adicionales
- ✅ **Validación robusta**: Tests comprehensivos para verificar funcionamiento

## 📦 Instalación

```bash
npm install simple-review-ia
```

## �� Configuración

### Variables de Entorno

Para usar el ejemplo incluido, crea un archivo `.env` en la raíz del proyecto:

```bash
# Copia el archivo de ejemplo
cp env.example .env

# Edita el archivo .env con tus API keys
```

Contenido del archivo `.env`:

```env
# Google Gemini API Key
GEMINI_API_KEY=tu-api-key-de-gemini

# OpenAI API Key
OPENAI_API_KEY=tu-api-key-de-openai
```

### Para Gemini (Google AI)

1. Obtén tu API key de [Google AI Studio](https://aistudio.google.com/apikey)
2. Configura el proveedor:

```typescript
import { createReviewSummarizer, AIProvider } from "simple-review-ia";

const provider: AIProvider = {
  name: "gemini",
  apiKey: "tu-api-key-de-gemini",
  options: {
    maxCharacters: 250,
    tone: "friendly",
    geminiModel: "gemini-1.5-flash",
  },
};
```

### Para OpenAI

1. Obtén tu API key de [OpenAI Platform](https://platform.openai.com/api-keys)
2. Configura el proveedor:

```typescript
const provider: AIProvider = {
  name: "openai",
  apiKey: "tu-api-key-de-openai",
  options: {
    maxCharacters: 250,
    tone: "friendly",
    openaiModel: "gpt-3.5-turbo",
  },
};
```

## 💡 Uso

### Uso Básico

```typescript
import { summarizeReviews } from "simple-review-ia";

const reviews = [
  "Excelente servicio, el auto estaba impecable y el proceso fue muy fácil.",
  "Muy buena experiencia, lo recomiendo totalmente.",
  "El personal fue muy amable y profesional.",
];

const summary = await summarizeReviews(reviews, provider);
console.log(summary);
// Output: "Los clientes destacan el excelente servicio con autos impecables,
// proceso fácil y personal amable y profesional. Experiencia muy recomendable."
```

### Uso Avanzado

````typescript
import { createReviewSummarizer } from "simple-review-ia";

const summarizer = createReviewSummarizer({
  name: "gemini",
  apiKey: "tu-api-key",
  options: {
    maxCharacters: 200,
    tone: "professional",
    temperature: 0.8,
  },
});

const summary = await summarizer.generateSummary(reviews);

## ⚙️ Opciones

| Opción          | Tipo                                       | Default              | Descripción                                                     |
| --------------- | ------------------------------------------ | -------------------- | --------------------------------------------------------------- |
| `maxCharacters` | `number`                                   | `250`                | Límite de caracteres enviado al modelo (controla costos)        |
| `tone`          | `'friendly' \| 'professional' \| 'casual'` | `'friendly'`         | Tono del resumen                                                |
| `language`      | `string`                                   | `'es'`               | Idioma del resumen                                              |
| `geminiModel`   | `string`                                   | `'gemini-1.5-flash'` | Modelo de Gemini a usar                                         |
| `openaiModel`   | `string`                                   | `'gpt-3.5-turbo'`    | Modelo de OpenAI a usar                                         |
| `temperature`   | `number`                                   | `0.7`                | Controla la creatividad (0.1=muy consistente, 0.9=muy creativo) |

## 🎯 Ejemplos de Uso

### Control de Temperature

El parámetro `temperature` controla qué tan creativas o consistentes son las respuestas:

```typescript
// Temperature bajo - respuestas más consistentes
const consistentProvider = {
  name: "gemini",
  apiKey: "tu-api-key",
  options: {
    temperature: 0.2, // Muy consistente
    tone: "professional",
  },
};

// Temperature medio - balance entre creatividad y consistencia
const balancedProvider = {
  name: "gemini",
  apiKey: "tu-api-key",
  options: {
    temperature: 0.7, // Nuestro default
    tone: "friendly",
  },
};

// Temperature alto - respuestas más creativas
const creativeProvider = {
  name: "gemini",
  apiKey: "tu-api-key",
  options: {
    temperature: 0.9, // Muy creativo
    tone: "casual",
  },
};
```

### Resumen Profesional

```typescript
const professionalProvider: AIProvider = {
  name: "gemini",
  apiKey: "tu-api-key",
  options: {
    tone: "professional",
    maxCharacters: 300,
  },
};
```

### Resumen Casual

```typescript
const casualProvider: AIProvider = {
  name: "openai",
  apiKey: "tu-api-key",
  options: {
    tone: "casual",
    maxCharacters: 150,
  },
};
```

## 🔒 Seguridad y Control de Costos

### Seguridad

- Nunca incluyas tu API key en el código del cliente
- Usa variables de entorno para las API keys
- Considera usar un proxy o backend para mayor seguridad

### Control de Costos

El parámetro `maxCharacters` controla directamente los tokens enviados al modelo:

- **250 caracteres** ≈ 62 tokens (costo bajo)
- **500 caracteres** ≈ 125 tokens (costo medio)
- **1000 caracteres** ≈ 250 tokens (costo alto)

**Recomendación**: Usa valores entre 200-300 caracteres para resúmenes concisos y económicos.

## 📝 Licencia

MIT

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request.

## 📄 Changelog

### v1.0.0

- Soporte inicial para Gemini y OpenAI
- Funcionalidad básica de resumen de reseñas
- Configuración flexible de opciones
````
