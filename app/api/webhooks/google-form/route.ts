import { sendWorkflowExecutionEvent } from "@/inngest/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const workflowId = url.searchParams.get("workflowId");

    if (!workflowId) {
      return NextResponse.json(
        { success: false, error: "Missing workflowId" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const formData = {
      formId: body.formId,
      formTitle: body.formTitle,
      responseId: body.responseId,
      timestamp: body.timestamp,
      respondedEmail: body.respondedEmail,
      response: body.response,
      raw: body,
    };

    await sendWorkflowExecutionEvent({
      workflowId,
      initialData: formData,
    });

    // ✅ Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing Google Form webhook:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
