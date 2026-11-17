import { ImageResponse } from "next/og";

export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";

export function renderOgImage(title: string, subtitle: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0a0a0a",
          color: "#f5f5f4",
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 600,
            marginBottom: 24,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 32, color: "#a1a1aa" }}>{subtitle}</div>
        <div
          style={{
            marginTop: 48,
            width: 64,
            height: 2,
            backgroundColor: "#f5f5f4",
          }}
        />
      </div>
    ),
    { ...ogImageSize }
  );
}
