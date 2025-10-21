import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

// Test endpoint to verify OpenAI integration
export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key') {
      return NextResponse.json({
        success: false,
        error: "OpenAI API key not configured",
        configured: false
      });
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Test API connection with a simple request
    try {
      // Just test the connection, don't actually generate
      const models = await openai.models.list();
      
      return NextResponse.json({
        success: true,
        configured: true,
        message: "OpenAI API connection successful",
        keyLength: process.env.OPENAI_API_KEY.length,
        availableModels: models.data.filter(m => m.id.includes('dall-e')).map(m => m.id)
      });
    } catch (error: any) {
      return NextResponse.json({
        success: false,
        configured: true,
        error: "API connection failed",
        message: error.message,
        details: error.response?.data || null
      }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: "Test failed",
      message: error.message
    }, { status: 500 });
  }
}

