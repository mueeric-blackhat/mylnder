
import type {
  MyinderSubmission,
  School,
} from "../types/myinder";

const WIDTH = 1080;
const HEIGHT = 1350;
const ORANGE = "#F97316";
const NAVY = "#172033";
const WHITE = "#FFFFFF";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

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
      reject(new Error(`Could not load ${file.name}.`));
    };

    image.src = objectUrl;
  });
}

function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string {
  const value = text.trim();

  if (ctx.measureText(value).width <= maxWidth) {
    return value;
  }

  let result = value;

  while (
    result.length > 0 &&
    ctx.measureText(`${result}...`).width > maxWidth
  ) {
    result = result.slice(0, -1);
  }

  return result ? `${result}...` : "";
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to export the image."));
        }
      },
      type,
      quality
    );
  });
}

function getSafeColor(color?: string): string {
  return color && /^#[0-9a-fA-F]{6}$/.test(color)
    ? color
    : ORANGE;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.fill();
}

/**
 * Generates the complete Myinder profile template.
 *
 * Includes:
 * - Full-size profile photo
 * - Myinder badge at the top
 * - School-color gradient fading into the bottom
 * - Name
 * - School profile name
 * - Instagram username
 * - Major/course
 * - Optional bio
 */
export async function generateMyinderTemplate(
  photo: File,
  submission: MyinderSubmission,
  school: School,
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

  // Use a solid background in case the source image contains transparency.
  ctx.fillStyle = NAVY;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Crop the photo to cover the complete 1080 x 1350 canvas.
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

  // Prefer the school's custom color; fall back to Myinder orange.
  const safeColor = getSafeColor(
    school.custom_color || themeColor
  );

  // Bottom gradient: transparent over the photo, stronger near the text.
  const gradient = ctx.createLinearGradient(0, 480, 0, HEIGHT);

  gradient.addColorStop(0, "rgba(23, 32, 51, 0)");
  gradient.addColorStop(0.22, `${safeColor}18`);
  gradient.addColorStop(0.48, `${safeColor}66`);
  gradient.addColorStop(0.72, `${safeColor}CC`);
  gradient.addColorStop(1, `${safeColor}F5`);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 480, WIDTH, HEIGHT - 480);

  // Add a subtle dark fade behind the top badge for readability.
  const topGradient = ctx.createLinearGradient(0, 0, 0, 220);

  topGradient.addColorStop(0, "rgba(0, 0, 0, 0.45)");
  topGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = topGradient;
  ctx.fillRect(0, 0, WIDTH, 220);

  // Draw the Myinder badge at the top-left.
  const badgeX = 56;
  const badgeY = 56;
  const badgePaddingX = 24;
  const badgePaddingY = 15;
  const badgeFontSize = 38;

  ctx.save();
  ctx.font = `bold ${badgeFontSize}px Arial`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  const badgeText = "myinder";
  const badgeWidth =
    ctx.measureText(badgeText).width + badgePaddingX * 2;
  const badgeHeight = badgeFontSize + badgePaddingY * 2;

  ctx.fillStyle = safeColor;
  drawRoundedRect(
    ctx,
    badgeX,
    badgeY,
    badgeWidth,
    badgeHeight,
    16
  );

  ctx.fillStyle = WHITE;
  ctx.fillText(
    badgeText,
    badgeX + badgePaddingX,
    badgeY + badgeHeight / 2
  );
  ctx.restore();

  // Draw profile details over the gradient.
  ctx.save();
  ctx.fillStyle = WHITE;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 2;

  const left = 64;
  const maxTextWidth = WIDTH - left * 2;

  // Full name.
  ctx.font = "bold 62px Arial";
  ctx.fillText(
    fitText(
      ctx,
      submission.name || "Myinder Member",
      maxTextWidth
    ),
    left,
    1000
  );

  // Instagram username.
  const username = submission.ig_username?.trim();
  const instagramLabel = username
    ? `@${username.replace(/^@/, "")}`
    : "Instagram username not provided";

  ctx.font = "34px Arial";
  ctx.fillText(
    fitText(ctx, instagramLabel, maxTextWidth),
    left,
    1115
  );

  // Major or course of study.
  ctx.font = "bold 40px Arial";
  ctx.fillText(
    fitText(
      ctx,
      submission.major || "Major not provided",
      maxTextWidth
    ),
    left,
    1180
  );


  ctx.restore();

  return canvasToBlob(canvas, "image/png");
}

/**
 * Adds a small Myinder badge to one photo.
 * Use this for additional photos that do not need the full template.
 */
export async function watermarkPhoto(
  photo: File,
  themeColor: string = ORANGE
): Promise<File> {
  if (!photo) {
    throw new Error("A photo is required for watermarking.");
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(photo.type)) {
    throw new Error(
      `${photo.name} is not supported. Use JPEG, PNG, or WebP.`
    );
  }

  const image = await loadImage(photo);
  const canvas = document.createElement("canvas");

  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error(
      `Could not prepare ${photo.name} for watermarking.`
    );
  }

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const safeColor = getSafeColor(themeColor);
  const scale = Math.max(
    0.45,
    Math.min(canvas.width, canvas.height) / 1080
  );

  const padding = Math.round(18 * scale);
  const fontSize = Math.round(36 * scale);
  const label = "myinder";

  ctx.save();
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  const textWidth = ctx.measureText(label).width;
  const boxWidth = textWidth + padding * 2;
  const boxHeight = fontSize + padding * 1.4;
  const x = Math.round(16 * scale);
  const y = Math.round(16 * scale);
  const radius = Math.round(8 * scale);

  ctx.fillStyle = safeColor;
  ctx.globalAlpha = 0.9;

  drawRoundedRect(
    ctx,
    x,
    y,
    boxWidth,
    boxHeight,
    radius
  );

  ctx.globalAlpha = 1;
  ctx.fillStyle = WHITE;
  ctx.fillText(label, x + padding, y + boxHeight / 2);
  ctx.restore();

  const outputType = photo.type;
  let blob: Blob | null = null;

  if (outputType === "image/png") {
    blob = await canvasToBlob(canvas, outputType);
  } else {
    for (const quality of [0.88, 0.78, 0.68, 0.58, 0.48]) {
      blob = await canvasToBlob(canvas, outputType, quality);

      if (blob.size <= MAX_FILE_SIZE) {
        break;
      }
    }
  }

  if (!blob) {
    throw new Error(`Could not watermark ${photo.name}.`);
  }

  if (blob.size > MAX_FILE_SIZE) {
    throw new Error(
      `${photo.name} is still larger than 5 MB after watermarking. ` +
        "Please choose a smaller photo."
    );
  }

  const extension =
    outputType === "image/jpeg"
      ? ".jpg"
      : outputType === "image/webp"
        ? ".webp"
        : ".png";

  const baseName =
    photo.name.replace(/\.[^.]+$/, "") || "myinder-photo";

  return new File(
    [blob],
    `${baseName}-myinder${extension}`,
    {
      type: outputType,
      lastModified: Date.now(),
    }
  );
}

/**
 * Adds the small Myinder badge to every selected photo.
 * This does not generate the complete profile template.
 */
export async function watermarkPhotos(
  photos: File[],
  themeColor: string = ORANGE
): Promise<File[]> {
  if (photos.length < 1 || photos.length > 10) {
    throw new Error("Please select between 1 and 10 photos.");
  }

  return Promise.all(
    photos.map((photo) => watermarkPhoto(photo, themeColor))
  );
}
