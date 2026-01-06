import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
    width: 256,
    height: 256,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    fontSize: 64,
                    background: 'white',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#232D4B', // UVA Blue
                    fontWeight: 800,
                    borderRadius: '16px',
                }}
            >
                VAISI
            </div>
        ),
        // ImageResponse options
        {
            ...size,
        }
    )
}
