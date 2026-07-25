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
          backgroundColor: "#0a0b10",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          color: "#e7eaf0",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 13,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#49e0d3",
            marginBottom: 20,
          }}
        >
          SIGNAL // A. GOKTUG YALCIN
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 600,
            marginBottom: 20,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 30, color: "#8891a1" }}>{subtitle}</div>
        <div
          style={{
            marginTop: 48,
            display: "flex",
            width: 72,
            height: 3,
            backgroundColor: "#49e0d3",
          }}
        />
      </div>
    ),
    { ...ogImageSize }
  );
}
