import { renderOgImage, ogImageSize, ogImageContentType } from "@/lib/og";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image() {
  return renderOgImage("Blog", "Writing on frontend development");
}
