import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in the environment variables.");
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const { message, history } = await req.json();
    
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      
      systemInstruction: `
        Anda adalah "Asisten Sehat AI", seorang asisten virtual yang berpengetahuan dan simpatik.
        Tugas Anda adalah memberikan informasi awal mengenai gejala penyakit dan langkah-langkah pencegahan atau pertolongan pertama yang bisa dilakukan di rumah.
        Gunakan bahasa Indonesia yang mudah dipahami, ramah, dan menenangkan.
        
        ATURAN UTAMA:
        1. JANGAN PERNAH memberikan diagnosis medis.
        2. Selalu awali atau akhiri jawaban Anda dengan DISCLAIMER yang jelas. Contoh: "Informasi ini tidak menggantikan nasihat medis profesional. Segera konsultasikan dengan dokter atau kunjungi fasilitas kesehatan terdekat untuk diagnosis dan penanganan yang akurat."
        3. Fokus pada pertolongan pertama yang aman dan umum (misal: kompres air hangat, minum air putih, istirahat).
        4. Jika gejala yang disebutkan terdengar serius (seperti nyeri dada hebat, sesak napas, pingsan), sarankan pengguna untuk SEGERA mencari pertolongan medis darurat atau menelepon ambulans.
        5. Strukturkan jawaban dengan poin-poin atau paragraf pendek agar mudah dibaca.
      `,
    });

    const chat = model.startChat({
      history: history || [], 
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    
    return Response.json({ text });

  } catch (error) {
    console.error("Error di API route:", error);
    return Response.json({ error: "Terjadi kesalahan saat memproses permintaan Anda." }, { status: 500 });
  }
}