import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { cdnUrl } = await req.json();

    if (!cdnUrl) {
      return NextResponse.json({ message: 'No URL provided' }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_STREAMLET_API_KEY;
    const accountNumber = process.env.NEXT_PUBLIC_STREAMLET_ACCOUNT_NUMBER;

    if (!apiKey || !accountNumber) {
      return NextResponse.json({ message: 'Server configuration missing' }, { status: 500 });
    }

    // Streamlet deletion requires the account number in the URL path
    const response = await fetch(`https://api.streamlet.in/${accountNumber}/delete-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-streamlet-api-key': apiKey,
      },
      body: JSON.stringify({ cdnUrl }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ message: `Streamlet Deletion Error: ${errorText}` }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Server-side deletion error:', error);
    return NextResponse.json({ message: 'Internal server error during deletion' }, { status: 500 });
  }
}
