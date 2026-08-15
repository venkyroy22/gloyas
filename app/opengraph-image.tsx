import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'GLOYAS — Brand Strategy, Web Design & Marketing Services';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#F9FAFB',
            border: '2px solid #E5E7EB',
            borderRadius: '32px',
            padding: '60px',
            width: '100%',
            height: '100%',
          }}
        >
          <img
            src="https://cdn-img.streamletedge.com/6a6874155ad7d80e5dbcdb7b/images/gloyas-favicon-1786823386290.webp"
            alt="GLOYAS Logo"
            width={180}
            height={180}
            style={{ marginBottom: '40px', borderRadius: '24px' }}
          />
          <div
            style={{
              display: 'flex',
              fontSize: '72px',
              fontWeight: 800,
              color: '#111827',
              textAlign: 'center',
              marginBottom: '20px',
              letterSpacing: '-0.02em',
            }}
          >
            GLOYAS
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '36px',
              fontWeight: 500,
              color: '#278DFD',
              textAlign: 'center',
            }}
          >
            Brand Strategy, Web Design & Marketing
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
