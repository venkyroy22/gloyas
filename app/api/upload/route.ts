import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ message: 'No image provided' }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_STREAMLET_API_KEY;
    const accountNumber = process.env.NEXT_PUBLIC_STREAMLET_ACCOUNT_NUMBER;

    if (!apiKey || !accountNumber) {
      return NextResponse.json({ message: 'Server configuration missing' }, { status: 500 });
    }

    const streamletFormData = new FormData();
    streamletFormData.append('image', file);

    const response = await fetch('https://api.streamlet.in/api-key/upload-image', {
      method: 'POST',
      headers: {
        'x-streamlet-api-key': apiKey,
        'x-streamlet-account-number': accountNumber,
      },
      body: streamletFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ message: `Streamlet Error: ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Server-side upload error:', error);
    return NextResponse.json({ message: 'Internal server error during upload' }, { status: 500 });
  }
}
