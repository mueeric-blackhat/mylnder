
import type { MyinderProfile } from "../types/myinder";

const WIDTH = 1080;
const HEIGHT = 1350;
const ORANGE = "#F97316";
const NAVY = "#172033";

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not load the uploaded photo."));
    };

    image.src = objectUrl;
  });
}

function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string {
  let result = text.trim();

  while (result.length > 0 && ctx.measureText(result).width > maxWidth) {
    result = result.slice(0, -1);
  }

  if (result !== text.trim()) {
    return `${result.slice(0, Math.max(0, result.length - 3))}...`;
  }

  return result;
}

/**
 * Generates the Myinder Instagram profile graphic.
 * Uses the first uploaded photo as the main image.
 * This runs in the browser; no preview screen is required.
 */
export async function generateMyinderTemplate(
  photo: File,
  profile: MyinderProfile,
  themeColor: string = ORANGE
): Promise<Blob> {
  if (!photo) {
    throw new Error("Upload at least one photo.");
  }

  const image = await loadImage(photo);
  const canvas = document.createElement("canvas");

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not create the Myinder template.");
  }

  // Crop the image to fill the 4:5 portrait canvas.
  const scale = Math.max(
    WIDTH / image.naturalWidth,
    HEIGHT / image.naturalHeight
  );

  const sourceWidth = WIDTH / scale;
  const sourceHeight = HEIGHT / scale;
  const sourceX = (image.naturalWidth - sourceWidth) / 2;
  const sourceY = (image.naturalHeight - sourceHeight) / 2;

  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    WIDTH,
    HEIGHT
  );

  // Add the dark fade at the bottom of the photo.
  const safeColor = /^#[0-9a-fA-F]{6}$/.test(themeColor)
    ? themeColor
    : ORANGE;

  const gradient = ctx.createLinearGradient(0, 650, 0, HEIGHT);
  gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradient.addColorStop(0.35, `${safeColor}55`);
  gradient.addColorStop(1, `${safeColor}F2`);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 600, WIDTH, 750);

  // Brand label in the top-left corner.
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 48px Arial";
  ctx.textAlign = "left";
  ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
  ctx.shadowBlur = 8;
  ctx.fillText("myinder", 64, 96);

  // Profile name.
  ctx.font = "bold 66px Arial";
  ctx.fillText(fitText(ctx, profile.name || "Your Name", 950), 64, 1080);

  // Instagram username.
  ctx.font = "38px Arial";
  const username = profile.username
    ? `@${profile.username.replace(/^@/, "")}`
    : "@instagram";
  ctx.fillText(fitText(ctx, username, 950), 64, 1145);

  // Course / major.
  ctx.font = "34px Arial";
  ctx.fillText(
    fitText(ctx, profile.major || "Your Major", 950),
    64,
    1205
  );

  ctx.shadowBlur = 0;

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to export the Myinder image."));
        }
      },
      "image/png"
    );
  });
}
