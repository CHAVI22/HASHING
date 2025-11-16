
import {NextRequest, NextResponse} from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {file_names, prompt} = body;

    if (!prompt || !Array.isArray(file_names)) {
      return NextResponse.json(
        {error: 'Invalid request body. "file_names" and "prompt" are required.'},
        {status: 400}
      );
    }

    const externalApiResponse = await fetch('http://100.115.101.135:8559/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        file_names,
        prompt,
      }),
    });

    if (!externalApiResponse.ok) {
      const errorText = await externalApiResponse.text();
      // Forward the error from the external API
      return new NextResponse(
        `Error from external API: ${errorText}`,
        {status: externalApiResponse.status}
      );
    }

    const responseData = await externalApiResponse.json();
    return NextResponse.json(responseData);

  } catch (error: any) {
    console.error("Error in model-master proxy API:", error);
    return NextResponse.json(
      {error: `Internal Server Error: ${error.message}`},
      {status: 500}
    );
  }
}
