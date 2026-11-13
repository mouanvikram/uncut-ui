import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Uncut-Ui — a design system made for AI-built interfaces";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logoFile = await readFile(join(process.cwd(), "public", "uncut-ui-logo.png"));
  const logoSrc = `data:image/png;base64,${logoFile.toString("base64")}`;
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", background: "#f9f9f9", color: "#171717", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", width: 1080, height: 510, flexDirection: "column", justifyContent: "space-between", padding: 56, border: "1px solid #e5e5e5", background: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 27, fontWeight: 700 }}>
          {/* ImageResponse renders this embedded image directly. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={46} height={46} alt="" />
          Uncut UI
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ color: "#5f5f5f", fontSize: 19 }}>A DESIGN SYSTEM MADE FOR AI</div>
          <div style={{ maxWidth: 890, fontSize: 68, fontWeight: 600, letterSpacing: -4, lineHeight: 1.06 }}>Good interfaces, from the first prompt.</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", color: "#718078", fontSize: 19 }}><span>React components · Design foundations · Patterns</span><span>UNCUT-UI.DEV</span></div>
      </div>
    </div>,
    size,
  );
}
