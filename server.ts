import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Initialize Gemini API
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

  // Initialize Nodemailer Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.example.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || "user@example.com",
      pass: process.env.SMTP_PASS || "password",
    },
  });

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const data = req.body;
      console.log("Received contact submission:", data);

      const slotsText = data.consultationSlots?.map((slot: any, idx: number) => {
        const date = new Date(slot.date).toLocaleDateString();
        return `Option ${idx + 1}: ${date} at ${slot.times.join(", ")}`;
      }).join("\n") || "None";

      const mailOptions = {
        from: `"Gridge AI Manager" <${process.env.SMTP_USER || "user@example.com"}>`,
        to: process.env.RECIPIENT_EMAIL || "recipient@example.com", // "email1, email2" 형식 지원
        subject: `[New Request] Contact from ${data.name || "Unknown"}`,
        text: `
          New Contact Wizard Submission:
          ------------------------------
          Name: ${data.name}
          Company: ${data.company}
          Email: ${data.email}
          Phone: ${data.phone}
          
          Request Types: ${data.requestTypes?.join(", ") || "N/A"}
          
          Project Details:
          - Scopes: ${data.scopes?.join(", ") || "N/A"}
          - Budget: ${data.budget || "N/A"}
          - Schedule: ${data.startDate?.year}.${data.startDate?.month} (${data.startDate?.period}) ~ ${data.endDate?.year}.${data.endDate?.month} (${data.endDate?.period})
          
          AI Ops Details:
          - Team Size: ${data.teamSize || "N/A"}
          - AI Cost: ${data.aiCost || "N/A"}
          - AI Tools: ${data.aiTools?.join(", ") || "N/A"}
          - AI Tools (Other): ${data.aiToolsOther || "None"}
          
          Consultation Slots:
          ${slotsText}
          
          Additional Details:
          ${data.details || "None"}
          
          Privacy Agreed: ${data.privacyAgreed ? "Yes" : "No"}
        `,
      };

      // Admin alert
      await transporter.sendMail(mailOptions);

      // Applicant confirmation email
      if (data.email) {
        await transporter.sendMail({
          from: `"Gridge AI Manager" <${process.env.SMTP_USER || "user@example.com"}>`,
          to: data.email,
          subject: `[Gridge AI Manager] 문의가 접수되었습니다.`,
          text: `
            안녕하세요, ${data.name}님.
            Gridge AI Manager에 관심을 가져주셔서 감사합니다.
            
            요청하신 문의 내용이 정상적으로 접수되었습니다.
            담당자가 내용을 검토한 후 빠르게 연락드리도록 하겠습니다.
            
            감사합니다.
            Gridge AI Manager 팀 드림
          `,
        });
      }

      res.json({ success: true, message: "Emails sent successfully" });
    } catch (error: any) {
      console.error("Email Error:", error);
      res.status(500).json({ error: "Failed to send email", details: error.message || error.toString() });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, context } = req.body;
      console.log("Received chat request:", message);

      const systemInstruction = `You are a helpful AI assistant for AiMSP. Use the following context to answer questions about the product. If the answer is not in the context, politely say you don't have that information but can help connect them with the sales team. Keep answers concise and professional.\n\nContext:\n${context}`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: message,
        config: {
          systemInstruction: systemInstruction,
        },
      });

      res.json({ response: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Failed to process request", details: error.message || error.toString() });
    }
  });

  app.post("/api/generate", async (req, res) => {
    try {
      const { model, contents, config } = req.body;
      console.log("Received generate request for model:", model);

      const response = await ai.models.generateContent({
        model: model || "gemini-3-flash-preview",
        contents: contents,
        config: config,
      });

      res.json({
        text: response.text,
        functionCalls: response.functionCalls,
      });
    } catch (error: any) {
      console.error("Gemini API /api/generate Error:", error);
      res.status(500).json({ error: "Failed to process request", details: error.message || error.toString() });
    }
  });

  // Serve static files in production or use Vite middleware in development
  if (process.env.NODE_ENV === "production") {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
