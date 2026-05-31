import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for AI French Tutor Chat
  app.post("/api/tutor", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "El historial de mensajes es requerido." });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ 
          error: "La llave API para Gemini (GEMINI_API_KEY) no está configurada. Agrégala en Settings > Secrets en AI Studio." 
        });
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Prompt optimized for Francés A1 - Unidad 1 (Presentaciones, saludos e identificación de personas)
      const systemInstruction = 
        "Eres 'Tutor de Francés IA', un tutor de francés profesional, didáctico y sumamente amable para estudiantes de nivel principiante (A1) hispanohablantes. " +
        "Tu misión principal es resolver dudas, dar explicaciones sencillas y animar al estudiante en su aprendizaje de la *Unidad 1: Se Présenter et Saluer*. " +
        "Esta unidad cubre los siguientes temas fundamentales:\n" +
        "1. Saludos formales e informales (Bonjour, Salut, Bonsoir, Bonne nuit)\n" +
        "2. Presentarse y decir el nombre (Je m'appelle, Je suis, My name is... no, es Je m'appelle)\n" +
        "3. Preguntar e identificar personas (Qui est-ce ? C'est... Ce sont...)\n" +
        "4. El uso y diferencia crucial entre 'Tu' (informal/amigos/jóvenes) y 'Vous' (formal/respeto/varias personas)\n" +
        "5. Vocabulario de la vida escolar (un sac, un crayon, une table, etc.)\n" +
        "6. Conjugación básica del presente de los verbos 'être' (ser/estar) y 's'appeler' (llamarse) en francés\n" +
        "7. Expresar nacionalidades, días de la semana, meses y fechas básicas.\n\n" +
        "Instrucciones de Respuesta:\n" +
        "- Mantén tus explicaciones claras, amigables, cortas y bien estructuradas en español.\n" +
        "- Utiliza negritas, listas o tablas breves para que sea más fácil de leer en la interfaz del chat.\n" +
        "- Enseña expresiones útiles en francés y pon su traducción al español entre paréntesis, por ejemplo: 'Enchanté de vous rencontrer' (Encantado de conocerle).\n" +
        "- Si el usuario intenta escribir en francés, felicítalo y dale retroalimentación constructiva si cometió algún error, siempre de forma muy motivadora.\n" +
        "- Invítalo a practicar dándole un pequeño ejercicio rápido si el usuario lo solicita.";

      // Map roles to GoogleGenAI specification ('user' and 'model')
      const contents = messages.map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Error calling Gemini:", error);
      res.status(500).json({ error: error.message || "Lo sentimos, el Tutor de IA experimentó un contratiempo temporal. Por favor intenta de nuevo." });
    }
  });

  // Serve static UI assets or connect Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app._router.get('*', (req: any, res: any) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
