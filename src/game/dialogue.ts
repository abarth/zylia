import type { DialogueLine } from "../content/types";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../engine/constants";
import { drawText, drawWindow, LINE_HEIGHT, wrapText } from "../engine/draw";
import type { Game, Scene } from "./game";

const BOX_HEIGHT = 64;
const PADDING = 8;
const LINES_PER_PAGE = 3;
const CHARS_PER_TICK = 1;

type Page = { speaker?: string; lines: string[] };

/**
 * Text box overlay at the bottom of the screen. Text types out one character
 * per tick; confirm finishes the page, then advances to the next.
 */
export class DialogueScene implements Scene {
  private pages: Page[] | null = null;
  private page = 0;
  private shown = 0;

  constructor(
    private readonly lines: DialogueLine[],
    private readonly onDone?: () => void,
  ) {}

  private layout(ctx: CanvasRenderingContext2D): Page[] {
    const pages: Page[] = [];
    for (const line of this.lines) {
      const wrapped = wrapText(ctx, line.text, SCREEN_WIDTH - PADDING * 2 - 4);
      const perPage = line.speaker ? LINES_PER_PAGE - 1 : LINES_PER_PAGE;
      for (let i = 0; i < wrapped.length; i += perPage) {
        pages.push({ speaker: line.speaker, lines: wrapped.slice(i, i + perPage) });
      }
    }
    return pages;
  }

  private pageLength(): number {
    return this.pages?.[this.page]?.lines.join("").length ?? 0;
  }

  update(game: Game): void {
    if (!this.pages) return; // Laid out on first render.
    const input = game.input;
    const total = this.pageLength();
    if (this.shown < total) {
      this.shown = input.pressed("confirm") ? total : this.shown + CHARS_PER_TICK;
      return;
    }
    if (input.pressed("confirm") || input.pressed("cancel")) {
      this.page++;
      this.shown = 0;
      if (this.page >= this.pages.length) {
        game.pop();
        this.onDone?.();
      }
    }
  }

  render(ctx: CanvasRenderingContext2D, game: Game): void {
    this.pages ??= this.layout(ctx);
    const page = this.pages[this.page];
    if (!page) return;
    const y = SCREEN_HEIGHT - BOX_HEIGHT - 4;
    drawWindow(ctx, 4, y, SCREEN_WIDTH - 8, BOX_HEIGHT);

    let row = 0;
    const textX = 4 + PADDING;
    const textY = y + PADDING - 2;
    if (page.speaker) {
      drawText(ctx, `${page.speaker}:`, textX, textY, "#f8e070");
      row++;
    }
    let remaining = this.shown;
    for (const line of page.lines) {
      if (remaining <= 0) break;
      drawText(ctx, line.slice(0, remaining), textX, textY + row * (LINE_HEIGHT + 2));
      remaining -= line.length;
      row++;
    }
    if (this.shown >= this.pageLength() && Math.floor(game.tick / 16) % 2 === 0) {
      ctx.fillStyle = "#ffffff";
      const ax = SCREEN_WIDTH - 18;
      const ay = y + BOX_HEIGHT - 12;
      ctx.fillRect(ax, ay, 6, 2);
      ctx.fillRect(ax + 1, ay + 2, 4, 1);
      ctx.fillRect(ax + 2, ay + 3, 2, 1);
    }
  }
}
