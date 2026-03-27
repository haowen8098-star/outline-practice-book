import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, rgba(252,248,239,1) 0%, rgba(235,248,239,1) 55%, rgba(243,240,255,1) 100%)",
          borderRadius: 20,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "5px solid #628978",
            background: "rgba(255,255,255,0.9)",
            boxShadow: "0 8px 18px rgba(98,137,120,0.2)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#f497af",
          }}
        />
      </div>
    ),
    {
      ...size,
    },
  );
}
