
import type { MyinderSubmission, School } from "../types/myinder";
import { removeBackground } from "@imgly/background-removal";

const WIDTH = 1092;
const HEIGHT = 1440;

const ORANGE = "#F97316";
const NAVY = "#172033";
const WHITE = "#FFFFFF";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const BODY_FONT = '"Arial", "Helvetica Neue", sans-serif';

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
  maxWidth: number,
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
  type = "image/png",
  quality?: number,
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
      quality,
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
  radius: number,
): void {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.fill();
}

/**
 * Draws an image using a cover crop.
 * The image fills the destination without stretching.
 */
function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
): void {
  const scale = Math.max(
    width / image.naturalWidth,
    height / image.naturalHeight,
  );

  const sourceWidth = width / scale;
  const sourceHeight = height / scale;
  const sourceX = (image.naturalWidth - sourceWidth) / 2;
  const sourceY = (image.naturalHeight - sourceHeight) / 2;

  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    x,
    y,
    width,
    height,
  );
}

/**
 * Draws the original photo as a blurred, enlarged background.
 * The enlarged edges prevent transparent gaps around the canvas.
 */
function drawBlurredPhotoBackground(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
): void {
  ctx.save();

  ctx.filter = "blur(24px)";
  ctx.globalAlpha = 1;

  drawCoverImage(
    ctx,
    image,
    -32,
    -32,
    WIDTH + 64,
    HEIGHT + 64,
  );

  ctx.restore();

  ctx.filter = "none";
  ctx.globalAlpha = 1;
}

/**
 * Adds a subtle dark overlay to improve text readability.
 */
function drawPhotoOverlays(
  ctx: CanvasRenderingContext2D,
): void {
  const overall = ctx.createLinearGradient(
    0,
    0,
    0,
    HEIGHT,
  );

  overall.addColorStop(0, "rgba(0, 0, 0, 0.16)");
  overall.addColorStop(0.58, "rgba(0, 0, 0, 0.04)");
  overall.addColorStop(1, "rgba(0, 0, 0, 0.32)");

  ctx.fillStyle = overall;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const bottomShade = ctx.createLinearGradient(
    0,
    760,
    0,
    HEIGHT,
  );

  bottomShade.addColorStop(0, "rgba(0, 0, 0, 0)");
  bottomShade.addColorStop(
    0.35,
    "rgba(0, 0, 0, 0.42)",
  );
  bottomShade.addColorStop(
    1,
    "rgba(0, 0, 0, 0.76)",
  );

  ctx.fillStyle = bottomShade;
  ctx.fillRect(0, 760, WIDTH, HEIGHT - 760);

  const sideShade = ctx.createLinearGradient(
    0,
    0,
    WIDTH,
    0,
  );

  sideShade.addColorStop(0, "rgba(0, 0, 0, 0.25)");
  sideShade.addColorStop(0.2, "rgba(0, 0, 0, 0)");
  sideShade.addColorStop(0.8, "rgba(0, 0, 0, 0)");
  sideShade.addColorStop(1, "rgba(0, 0, 0, 0.25)");

  ctx.fillStyle = sideShade;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

/**
 * Adds an orange gradient across the entire bottom edge.
 */
function drawBottomOrangeGlow(
  ctx: CanvasRenderingContext2D,
  color = ORANGE,
): void {
  const safeColor = getSafeColor(color);

  const gradient = ctx.createLinearGradient(
    0,
    930,
    0,
    HEIGHT,
  );

  gradient.addColorStop(0, `${safeColor}00`);
  gradient.addColorStop(0.25, `${safeColor}12`);
  gradient.addColorStop(0.55, `${safeColor}55`);
  gradient.addColorStop(0.8, `${safeColor}B8`);
  gradient.addColorStop(1, `${safeColor}E8`);

  ctx.fillStyle = gradient;
  ctx.fillRect(
    0,
    930,
    WIDTH,
    HEIGHT - 930,
  );

  const bottomGlow = ctx.createRadialGradient(
    WIDTH / 2,
    HEIGHT + 30,
    5,
    WIDTH / 2,
    HEIGHT + 30,
    WIDTH * 0.75,
  );

  bottomGlow.addColorStop(0, `${safeColor}66`);
  bottomGlow.addColorStop(0.65, `${safeColor}30`);
  bottomGlow.addColorStop(1, `${safeColor}00`);

  ctx.fillStyle = bottomGlow;
  ctx.fillRect(
    0,
    1050,
    WIDTH,
    HEIGHT - 1050,
  );
}

/**
 * Adds a soft orange glow in the top-right corner.
 */
function drawTopRightGlow(
  ctx: CanvasRenderingContext2D,
): void {
  const gradient = ctx.createRadialGradient(
    WIDTH,
    0,
    10,
    WIDTH,
    0,
    560,
  );

  gradient.addColorStop(0, `${ORANGE}35`);
  gradient.addColorStop(0.5, `${ORANGE}12`);
  gradient.addColorStop(1, `${ORANGE}00`);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, 620);
}

/**
 * Draws the orange neon frame, with a gap at the top
 * so the person's hair can overlap the frame.
 */
function drawNeonFrame(
  ctx: CanvasRenderingContext2D,
): void {
  const left = 80;
  const right = WIDTH - 80;
  const top = 112;
  const bottom = 1326;
  const radius = 42;

  ctx.save();

  ctx.beginPath();

  ctx.moveTo(left + radius, top);
  ctx.lineTo(330, top);

  ctx.moveTo(750, top);
  ctx.lineTo(right - radius, top);

  ctx.quadraticCurveTo(
    right,
    top,
    right,
    top + radius,
  );

  ctx.lineTo(right, bottom - radius);

  ctx.quadraticCurveTo(
    right,
    bottom,
    right - radius,
    bottom,
  );

  ctx.lineTo(left + radius, bottom);

  ctx.quadraticCurveTo(
    left,
    bottom,
    left,
    bottom - radius,
  );

  ctx.lineTo(left, top + radius);

  ctx.quadraticCurveTo(
    left,
    top,
    left + radius,
    top,
  );

  ctx.strokeStyle = ORANGE;
  ctx.lineWidth = 2.2;
  ctx.shadowColor = ORANGE;
  ctx.shadowBlur = 13;
  ctx.lineJoin = "round";
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(255, 205, 160, 0.9)";
  ctx.lineWidth = 0.8;
  ctx.stroke();

  ctx.restore();
}

/**
 * Draws the mylnder branding badge.
 */
function drawBrandBadge(
  ctx: CanvasRenderingContext2D,
): void {
  const x = 113;
  const y = 146;
  const width = 208;
  const height = 66;

  ctx.save();

  ctx.fillStyle = ORANGE;

  drawRoundedRect(
    ctx,
    x,
    y,
    width,
    height,
    26,
  );

  ctx.fillStyle = WHITE;
  ctx.font = `700 39px ${BODY_FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(
    "mylnder",
    x + width / 2,
    y + height / 2 + 1,
  );

  ctx.restore();
}

/**
 * Draws the Instagram outline icon.
 */
function drawInstagramIcon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
): void {
  ctx.save();

  ctx.strokeStyle = ORANGE;
  ctx.lineWidth = 5;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.roundRect(
    x,
    y,
    size,
    size,
    size * 0.23,
  );
  ctx.stroke();

  ctx.beginPath();

  ctx.arc(
    x + size / 2,
    y + size / 2,
    size * 0.23,
    0,
    Math.PI * 2,
  );

  ctx.stroke();

  ctx.beginPath();

  ctx.arc(
    x + size * 0.72,
    y + size * 0.28,
    size * 0.045,
    0,
    Math.PI * 2,
  );

  ctx.fillStyle = ORANGE;
  ctx.fill();

  ctx.restore();
}

/**
 * Draws the graduation cap icon.
 */
function drawGraduationIcon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
): void {
  ctx.save();

  ctx.fillStyle = ORANGE;
  ctx.strokeStyle = ORANGE;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  // Top of the graduation cap.
  ctx.beginPath();

  ctx.moveTo(x, y + size * 0.28);
  ctx.lineTo(x + size * 0.48, y);
  ctx.lineTo(x + size, y + size * 0.28);
  ctx.lineTo(x + size * 0.48, y + size * 0.48);

  ctx.closePath();
  ctx.fill();

  // Base of the cap.
  ctx.beginPath();

  ctx.moveTo(x + size * 0.19, y + size * 0.39);
  ctx.lineTo(x + size * 0.19, y + size * 0.68);
  ctx.lineTo(x + size * 0.48, y + size * 0.86);
  ctx.lineTo(x + size * 0.77, y + size * 0.68);
  ctx.lineTo(x + size * 0.77, y + size * 0.39);
  ctx.lineTo(x + size * 0.48, y + size * 0.57);

  ctx.closePath();
  ctx.fill();

  // Tassel.
  ctx.lineWidth = 3;

  ctx.beginPath();

  ctx.moveTo(
    x + size * 0.91,
    y + size * 0.31,
  );

  ctx.lineTo(
    x + size * 0.91,
    y + size * 0.66,
  );

  ctx.stroke();

  ctx.beginPath();

  ctx.arc(
    x + size * 0.91,
    y + size * 0.71,
    size * 0.035,
    0,
    Math.PI * 2,
  );

  ctx.fill();

  ctx.restore();
}

/**
 * Draws the original photo in a glowing circular badge.
 */
function drawCircularPhotoBadge(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  centerX: number,
  centerY: number,
  radius: number,
): void {
  const borderWidth = 4;
  const innerRadius = radius - borderWidth;
  const diameter = innerRadius * 2;

  // Orange outer circle and glow.
  ctx.save();

  ctx.beginPath();

  ctx.arc(
    centerX,
    centerY,
    radius,
    0,
    Math.PI * 2,
  );

  ctx.fillStyle = ORANGE;
  ctx.shadowColor = ORANGE;
  ctx.shadowBlur = 14;
  ctx.fill();

  ctx.restore();

  // Clip the original photo into a circle.
  ctx.save();

  ctx.beginPath();

  ctx.arc(
    centerX,
    centerY,
    innerRadius,
    0,
    Math.PI * 2,
  );

  ctx.clip();

  const scale = Math.max(
    diameter / image.naturalWidth,
    diameter / image.naturalHeight,
  );

  const sourceWidth = diameter / scale;
  const sourceHeight = diameter / scale;
  const sourceX = (image.naturalWidth - sourceWidth) / 2;
  const sourceY = (image.naturalHeight - sourceHeight) / 2;

  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    centerX - innerRadius,
    centerY - innerRadius,
    diameter,
    diameter,
  );

  ctx.restore();

  // Fine highlight around the circular photo.
  ctx.save();

  ctx.beginPath();

  ctx.arc(
    centerX,
    centerY,
    radius - 1,
    0,
    Math.PI * 2,
  );

  ctx.strokeStyle = "rgba(255, 195, 145, 0.95)";
  ctx.lineWidth = 1.3;
  ctx.stroke();

  ctx.restore();
}

/**
 * Generates the current Myinder profile template.
 *
 * Design features:
 * - Blurred original photo as the background.
 * - Background-removed person overlaid sharply.
 * - Orange bottom fade across the full width.
 * - Top-right orange glow.
 * - Orange neon frame and mylnder branding.
 * - Profile name, Instagram username, and major.
 * - Circular photo badge in the bottom-right corner.
 *
 * The three-argument signature is retained for FormPage.tsx.
 */
export async function generateMyinderTemplate(
  photo: File,
  submission: MyinderSubmission,
  school: School,
): Promise<Blob> {
  if (!photo) {
    throw new Error("Upload at least one photo.");
  }

  if (photo.size > MAX_FILE_SIZE) {
    throw new Error("Please choose a photo smaller than 5 MB.");
  }

  if (!photo.type.startsWith("image/")) {
    throw new Error("Please upload a valid image file.");
  }

  // Load the original photo for the background and thumbnail.
  const image = await loadImage(photo);

  // Separate the person from the background.
  let foregroundBlob: Blob;

  try {
    foregroundBlob = await removeBackground(photo);
  } catch (error) {
    console.error("Background removal failed:", error);

    throw new Error(
      "Could not separate the person from the photo background. Please try another photo or check your internet connection.",
    );
  }

  const foregroundFile = new File(
    [foregroundBlob],
    "myinder-person.png",
    { type: "image/png" },
  );

  const personImage = await loadImage(foregroundFile);

  const canvas = document.createElement("canvas");

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not create the Myinder template.");
  }

  // 1. Base canvas.
  ctx.fillStyle = NAVY;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // 2. Blurred original photo as the background.
  drawBlurredPhotoBackground(ctx, image);

  // 3. Draw the sharp, background-removed person.
  // Draw the full transparent image so the person remains aligned
  // with the original photo's framing.
  ctx.drawImage(
    personImage,
    0,
    0,
    WIDTH,
    HEIGHT,
  );

  // 4. Dark overlays for contrast.
  drawPhotoOverlays(ctx);

  // 5. Soft orange glow at the top-right.
  drawTopRightGlow(ctx);

  // 6. Orange fade across the entire bottom edge.
  drawBottomOrangeGlow(ctx, ORANGE);

  // 7. Neon frame and brand badge.
  drawNeonFrame(ctx);
  drawBrandBadge(ctx);

  // Retain compatibility with callers that provide a school.
  // The current reference design does not display the school name.
  void school;

  const left = 130;
  const maxTextWidth = 700;

  ctx.save();

  ctx.fillStyle = WHITE;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
  ctx.shadowBlur = 5;
  ctx.shadowOffsetY = 2;

  // Profile name.
  const name =
    submission.name?.trim() || "Myinder Member";

  ctx.font = `700 72px ${BODY_FONT}`;

  ctx.fillText(
    fitText(ctx, name, maxTextWidth),
    left,
    1030,
  );

  // Instagram icon and username.
  drawInstagramIcon(
    ctx,
    137,
    1067,
    56,
  );

  const username = submission.ig_username
    ?.trim()
    .replace(/^@/, "");

  const instagramLabel =
    username || "Instagram username not provided";

  ctx.font = `600 34px ${BODY_FONT}`;

  ctx.fillText(
    fitText(ctx, instagramLabel, 565),
    229,
    1107,
  );

  // Orange divider beneath the Instagram row.
  const divider = ctx.createLinearGradient(
    137,
    1155,
    399,
    1155,
  );

  divider.addColorStop(0, "#FFB27D");
  divider.addColorStop(1, ORANGE);

  ctx.save();

  ctx.shadowBlur = 0;
  ctx.strokeStyle = divider;
  ctx.lineWidth = 6;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(138, 1155);
  ctx.lineTo(397, 1155);
  ctx.stroke();

  ctx.restore();

  // Graduation icon and major.
  drawGraduationIcon(
    ctx,
    137,
    1188,
    62,
  );

  const major =
    submission.major?.trim() || "Major not provided";

  ctx.font = `600 33px ${BODY_FONT}`;

  ctx.fillText(
    fitText(ctx, major, 530),
    229,
    1225,
  );

  ctx.restore();

  // Circular thumbnail uses the original, sharp photo.
  drawCircularPhotoBadge(
    ctx,
    image,
    907,
    1210,
    69,
  );

  return canvasToBlob(canvas, "image/png");
}

/**
 * Adds a small mylnder watermark to a photo.
 * The original file is not modified.
 */
export async function watermarkPhoto(
  photo: File,
  themeColor: string = ORANGE,
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
      `${photo.name} is not supported. Use JPEG, PNG, or WebP.`,
    );
  }

  if (photo.size > MAX_FILE_SIZE) {
    throw new Error(
      `${photo.name} is larger than 5 MB.`,
    );
  }

  const image = await loadImage(photo);

  const canvas = document.createElement("canvas");

  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error(
      `Could not prepare ${photo.name} for watermarking.`,
    );
  }

  ctx.drawImage(
    image,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  const safeColor = getSafeColor(themeColor);

  const scale = Math.max(
    0.45,
    Math.min(canvas.width, canvas.height) / 1080,
  );

  const padding = Math.round(18 * scale);
  const fontSize = Math.round(36 * scale);
  const label = "mylnder";

  ctx.save();

  ctx.font = `700 ${fontSize}px ${BODY_FONT}`;
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
    radius,
  );

  ctx.globalAlpha = 1;
  ctx.fillStyle = WHITE;

  ctx.fillText(
    label,
    x + padding,
    y + boxHeight / 2,
  );

  ctx.restore();

  let blob: Blob | null = null;
  const outputType = photo.type;

  if (outputType === "image/png") {
    blob = await canvasToBlob(
      canvas,
      outputType,
    );
  } else {
    for (const quality of [
      0.88,
      0.78,
      0.68,
      0.58,
      0.48,
    ]) {
      blob = await canvasToBlob(
        canvas,
        outputType,
        quality,
      );

      if (blob.size <= MAX_FILE_SIZE) {
        break;
      }
    }
  }

  if (!blob) {
    throw new Error(
      `Could not watermark ${photo.name}.`,
    );
  }

  if (blob.size > MAX_FILE_SIZE) {
    throw new Error(
      `${photo.name} is still larger than 5 MB after watermarking. Please choose a smaller photo.`,
    );
  }

  const extension =
    outputType === "image/jpeg"
      ? ".jpg"
      : outputType === "image/webp"
        ? ".webp"
        : ".png";

  const baseName =
    photo.name.replace(/\.[^.]+$/, "") ||
    "myinder-photo";

  return new File(
    [blob],
    `${baseName}-myinder${extension}`,
    {
      type: outputType,
      lastModified: Date.now(),
    },
  );
}

/**
 * Adds the mylnder watermark to every selected photo.
 */
export async function watermarkPhotos(
  photos: File[],
  themeColor: string = ORANGE,
): Promise<File[]> {
  if (photos.length < 1 || photos.length > 10) {
    throw new Error(
      "Please select between 1 and 10 photos.",
    );
  }

  return Promise.all(
    photos.map((photo) =>
      watermarkPhoto(photo, themeColor),
    ),
  );
}
