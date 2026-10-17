
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
const PROFILE_FONT = '"Algerian", "Copperplate", Georgia, serif';

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

function drawCircularPhotoBadge(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  centerX: number,
  centerY: number,
  radius: number
): void {
  const borderWidth = 7;
  const innerRadius = radius - borderWidth;
  const diameter = innerRadius * 2;

  // Orange badge base and subtle shadow.
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 3;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = ORANGE;
  ctx.fill();
  ctx.restore();

  // Crop the same uploaded photo into a circle.
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
  ctx.clip();

  const scale = Math.max(
    diameter / image.naturalWidth,
    diameter / image.naturalHeight
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
    diameter
  );

  ctx.restore();
}

/**
 * Generates the complete Myinder profile template.
 */
export async function generateMyinderTemplate(
  photo: File,
  submission: MyinderSubmission,
  school: School,
  // themeColor: string = ORANGE
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

  // Base background.
  ctx.fillStyle = NAVY;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Crop the photo to cover the complete canvas.
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



  // Soft orange fade at the top-right.
  const topRightGradient = ctx.createRadialGradient(
    WIDTH,
    0,
    10,
    WIDTH,
    0,
    560
  );

  topRightGradient.addColorStop(0, `${ORANGE}45`);
  topRightGradient.addColorStop(0.5, `${ORANGE}18`);
  topRightGradient.addColorStop(1, `${ORANGE}00`);

  ctx.fillStyle = topRightGradient;
  ctx.fillRect(0, 0, WIDTH, 620);

  // Compact orange gradient across the ENTIRE bottom.
  // It starts at y=930 instead of y=480, preserving more of the photo.
  const bottomGradient = ctx.createLinearGradient(
    0,
    930,
    0,
    HEIGHT
  );

  bottomGradient.addColorStop(0, `${ORANGE}00`);
  bottomGradient.addColorStop(0.25, `${ORANGE}12`);
  bottomGradient.addColorStop(0.55, `${ORANGE}55`);
  bottomGradient.addColorStop(0.8, `${ORANGE}B8`);
  bottomGradient.addColorStop(1, `${ORANGE}E8`);

  ctx.fillStyle = bottomGradient;
  ctx.fillRect(0, 930, WIDTH, HEIGHT - 930);

  // Subtle top fade behind the logo.
  const topGradient = ctx.createLinearGradient(0, 0, 0, 220);

  topGradient.addColorStop(0, "rgba(0, 0, 0, 0.3)");
  topGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = topGradient;
  ctx.fillRect(0, 0, WIDTH, 220);

  // Myinder logo badge.
  const badgeX = 56;
  const badgeY = 56;
  const badgePaddingX = 24;
  const badgePaddingY = 15;
  const badgeFontSize = 38;
  const badgeText = "mylnder";

  ctx.save();
  ctx.font = `bold ${badgeFontSize}px Arial`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  const badgeWidth =
    ctx.measureText(badgeText).width + badgePaddingX * 2;
  const badgeHeight = badgeFontSize + badgePaddingY * 2;

  ctx.fillStyle = ORANGE;
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

  // Profile text positioned lower-left.
  // Reserve the bottom-right for the circular photo badge.
  ctx.save();
  ctx.fillStyle = WHITE;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
  ctx.shadowBlur = 5;
  ctx.shadowOffsetY = 2;

  const left = 64;
  const maxTextWidth = 700;

  // Name.
  ctx.font = `bold 56px ${PROFILE_FONT}`;
  ctx.fillText(
    fitText(
      ctx,
      submission.name || "Myinder Member",
      maxTextWidth
    ),
    left,
    1135
  );

  // School profile name.
  const schoolProfileName =
    school.profile_name?.trim() || school.name?.trim();

  if (schoolProfileName) {
    ctx.font = `28px ${PROFILE_FONT}`;
    ctx.fillText(
      fitText(ctx, schoolProfileName, maxTextWidth),
      left,
      1180
    );
  }

  // Instagram username.
  const username = submission.ig_username?.trim();
  const instagramLabel = username
    ? `@${username.replace(/^@/, "")}`
    : "Instagram username not provided";

  ctx.font = `27px ${PROFILE_FONT}`;
  ctx.fillText(
    fitText(ctx, instagramLabel, maxTextWidth),
    left,
    1223
  );

  // Major/course.
  ctx.font = `bold 29px ${PROFILE_FONT}`;
  ctx.fillText(
    fitText(
      ctx,
      submission.major || "Major not provided",
      maxTextWidth
    ),
    left,
    1267
  );

  // Optional bio, kept within the canvas.
  if (submission.bio?.trim()) {
    ctx.font = `22px ${PROFILE_FONT}`;
    ctx.fillText(
      fitText(ctx, submission.bio, maxTextWidth),
      left,
      1310
    );
  }

  ctx.restore();

  // Small circular preview of the same photo at bottom-right.
  drawCircularPhotoBadge(ctx, image, 956, 1225, 62);

  return canvasToBlob(canvas, "image/png");
}

/**
 * Adds a small Myinder badge to one photo.
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
  const label = "mylnder";

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