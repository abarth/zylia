/**
 * Placeholder drawing primitives. Everything is drawn at the internal
 * resolution; text is thresholded to hard pixels so it matches the look of
 * the rest of the screen when scaled up.
 */

export const FONT_SIZE = 10;
export const LINE_HEIGHT = 12;
const FONT = `${FONT_SIZE}px monospace`;

const textCache = new Map<string, HTMLCanvasElement>();

function renderText(text: string, color: string): HTMLCanvasElement {
  const key = `${color}\u0000${text}`;
  const cached = textCache.get(key);
  if (cached) return cached;

  const measure = document.createElement("canvas").getContext("2d")!;
  measure.font = FONT;
  const width = Math.max(1, Math.ceil(measure.measureText(text).width));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = LINE_HEIGHT;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.font = FONT;
  ctx.textBaseline = "top";
  ctx.fillStyle = color;
  ctx.fillText(text, 0, 1);

  // Snap anti-aliased edges to fully on or off.
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = image.data;
  for (let i = 3; i < data.length; i += 4) data[i] = data[i] >= 110 ? 255 : 0;
  ctx.putImageData(image, 0, 0);

  if (textCache.size > 500) textCache.clear();
  textCache.set(key, canvas);
  return canvas;
}

export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color = "#ffffff",
): void {
  ctx.drawImage(renderText(text, "#000000"), Math.round(x) + 1, Math.round(y) + 1);
  ctx.drawImage(renderText(text, color), Math.round(x), Math.round(y));
}

export function textWidth(ctx: CanvasRenderingContext2D, text: string): number {
  ctx.font = FONT;
  return Math.ceil(ctx.measureText(text).width);
}

/** Classic FF-style blue gradient window with a light border. */
export function drawWindow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  const gradient = ctx.createLinearGradient(0, y, 0, y + h);
  gradient.addColorStop(0, "#3a4fc0");
  gradient.addColorStop(1, "#141c60");
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "#e8e8f0";
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 1.5, y + 1.5, w - 3, h - 3);
  ctx.strokeStyle = "#50507a";
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
}

/** Splits text into lines that fit within `maxWidth` game pixels. */
export function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  for (const paragraph of text.split("\n")) {
    let line = "";
    for (const word of paragraph.split(" ")) {
      const candidate = line ? `${line} ${word}` : word;
      if (line && textWidth(ctx, candidate) > maxWidth) {
        lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    }
    lines.push(line);
  }
  return lines;
}

/** Blinking cursor used to mark selections. */
export function drawCursor(ctx: CanvasRenderingContext2D, x: number, y: number, tick: number): void {
  if (Math.floor(tick / 20) % 3 === 2) return;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 5, y + 4);
  ctx.lineTo(x, y + 8);
  ctx.closePath();
  ctx.fill();
}
