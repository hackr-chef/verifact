import { NextRequest } from "next/server";

export async function GET(_request: NextRequest) {
  // Return a simple JSON response
  return new Response(
    JSON.stringify({
      message: "API is working correctly",
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();

    // Return the body as part of the response
    return new Response(
      JSON.stringify({
        message: "POST request received successfully",
        receivedData: body,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    // Handle parsing errors
    return new Response(
      JSON.stringify({
        error: "Failed to parse request body",
        message: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
