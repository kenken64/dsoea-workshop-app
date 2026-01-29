import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { db, pages } from "@/db";
import { eq } from "drizzle-orm";

// Lazy initialization of OpenAI client to avoid build-time errors
function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }
  return new OpenAI({ apiKey });
}

export async function POST(request: NextRequest) {
  try {
    const { content, title, pageId, forceRegenerate } = await request.json();

    if (!pageId) {
      return NextResponse.json(
        { error: "Page ID is required" },
        { status: 400 }
      );
    }

    // Check if we have a cached summary in the database
    const page = await db.query.pages.findFirst({
      where: eq(pages.id, pageId),
    });

    if (!page) {
      return NextResponse.json(
        { error: "Page not found" },
        { status: 404 }
      );
    }

    // Return cached summary if exists and not forcing regeneration
    if (page.aiSummary && !forceRegenerate) {
      return NextResponse.json({
        summary: page.aiSummary,
        cached: true
      });
    }

    // Generate new summary with OpenAI
    if (!content) {
      return NextResponse.json(
        { error: "Content is required for generating summary" },
        { status: 400 }
      );
    }

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a helpful DevSecOps instructor. Provide a comprehensive and detailed explanation of the workshop tutorial, focusing especially on explaining commands and source code.

Your response should include:

1. **Overview**: A brief 2-3 sentence summary of what this workshop covers

2. **Key Learning Objectives**: 3-5 bullet points of what students will learn

3. **Prerequisites**: What students should know before starting

4. **Command Explanations**: For each important command in the tutorial, explain:
   - What the command does
   - What each flag/option means
   - Expected output or result
   - Common errors and how to fix them

5. **Code/Configuration Explanations**: For any source code, configuration files, or scripts in the tutorial:
   - Explain what each section/block does
   - Explain important variables, functions, or settings
   - Explain how different parts connect together
   - Highlight security considerations if any

6. **Step-by-Step Breakdown**: Walk through the key steps explaining WHY each step is necessary, not just what to do

7. **Common Pitfalls**: List common mistakes students make and how to avoid them

8. **Tips for Success**: 2-3 practical tips for completing the workshop successfully

Format your response in markdown with clear headings and code blocks where appropriate.`,
        },
        {
          role: "user",
          content: `Please provide a detailed explanation of this workshop tutorial titled "${title}", with special focus on explaining all commands and source code:\n\n${content}`,
        },
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });

    const summary = completion.choices[0]?.message?.content || "Unable to generate summary.";

    // Save summary to database
    await db
      .update(pages)
      .set({
        aiSummary: summary,
        updatedAt: new Date()
      })
      .where(eq(pages.id, pageId));

    return NextResponse.json({
      summary,
      cached: false
    });
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate summary" },
      { status: 500 }
    );
  }
}
