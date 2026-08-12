import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get('image');

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    const streamletApiKey = process.env.STREAMLET_API_KEY;
    const streamletAccountNumber = process.env.STREAMLET_ACCOUNT_NUMBER;

    if (!streamletApiKey || !streamletAccountNumber) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Forward the formData to Streamlet
    const streamletFormData = new FormData();
    streamletFormData.append('image', image);

    const response = await fetch('https://api.streamletedge.com/api-key/upload-image', {
      method: 'POST',
      headers: {
        'x-streamlet-api-key': streamletApiKey,
        'x-streamlet-account-number': streamletAccountNumber,
      },
      body: streamletFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Streamlet upload error:', errorText);
      return NextResponse.json(
        { error: 'Failed to upload image to Streamlet' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // The API responds with { cdnUrl: "..." } on success
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in upload route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
