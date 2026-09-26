import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../engine/constants";
import { drawText, drawWindow, LINE_HEIGHT } from "../engine/draw";
import type { Game, Scene } from "./game";

/** Read-only party/inventory screen. Items, equipment and saving plug in here later. */
export class MenuScene implements Scene {
  update(game: Game): void {
    if (game.input.pressed("cancel") || game.input.pressed("menu")) game.pop();
  }

  render(ctx: CanvasRenderingContext2D, game: Game): void {
    const { state, content } = game;

    drawWindow(ctx, 4, 4, 172, 116);
    state.party.forEach((member, i) => {
      const y = 10 + i * 52;
      ctx.fillStyle = "#101010";
      ctx.fillRect(11, y + 3, 18, 22);
      ctx.fillStyle = member.color;
      ctx.fillRect(12, y + 4, 16, 20);
      drawText(ctx, member.name, 36, y);
      drawText(ctx, `${member.job}  Lv ${member.level}`, 36, y + LINE_HEIGHT, "#c8d0ff");
      drawText(ctx, `HP ${member.hp}/${member.stats.hp}`, 36, y + LINE_HEIGHT * 2);
      drawText(ctx, `MP ${member.mp}/${member.stats.mp}`, 108, y + LINE_HEIGHT * 2);
    });

    drawWindow(ctx, 180, 4, SCREEN_WIDTH - 184, 116);
    const commands = ["Items", "Magic", "Equip", "Status", "Save"];
    commands.forEach((label, i) => drawText(ctx, label, 192, 10 + i * (LINE_HEIGHT + 2), "#8088a8"));
    drawText(ctx, "(soon)", 192, 10 + commands.length * (LINE_HEIGHT + 2), "#8088a8");

    const invY = 124;
    drawWindow(ctx, 4, invY, 172, SCREEN_HEIGHT - invY - 4);
    drawText(ctx, "Inventory", 12, invY + 6, "#f8e070");
    const entries = Object.entries(state.inventory);
    if (entries.length === 0) drawText(ctx, "(empty)", 12, invY + 6 + LINE_HEIGHT);
    entries.slice(0, 6).forEach(([id, qty], i) => {
      const y = invY + 6 + (i + 1) * LINE_HEIGHT;
      drawText(ctx, content.items[id]?.name ?? id, 12, y);
      drawText(ctx, `x${qty}`, 150, y);
    });

    drawWindow(ctx, 180, invY, SCREEN_WIDTH - 184, SCREEN_HEIGHT - invY - 4);
    drawText(ctx, "Gold", 188, invY + 6, "#f8e070");
    drawText(ctx, `${state.gold}`, 188, invY + 6 + LINE_HEIGHT);
    drawText(ctx, "Steps", 188, invY + 6 + LINE_HEIGHT * 3, "#f8e070");
    drawText(ctx, `${state.steps}`, 188, invY + 6 + LINE_HEIGHT * 4);
  }
}
