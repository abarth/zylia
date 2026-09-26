import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../engine/constants";
import { drawCursor, drawText, drawWindow, LINE_HEIGHT } from "../engine/draw";
import { DialogueScene } from "./dialogue";
import type { Game, Scene } from "./game";

const COMMANDS = ["Win (debug)", "Run"] as const;

/**
 * Placeholder battle screen: shows the enemy group and the party in the
 * FF4/FF6 layout, but resolves instantly. The real system is designed in
 * docs/design/combat.md.
 */
export class BattleScene implements Scene {
  private cursor = 0;

  constructor(private readonly groupId: string) {}

  update(game: Game): void {
    const { input } = game;
    if (input.pressed("up")) this.cursor = (this.cursor + COMMANDS.length - 1) % COMMANDS.length;
    if (input.pressed("down")) this.cursor = (this.cursor + 1) % COMMANDS.length;
    if (!input.pressed("confirm")) return;

    game.pop();
    if (COMMANDS[this.cursor] === "Run") {
      game.push(new DialogueScene([{ text: "The party escaped!" }]));
      return;
    }
    const enemies = game.content.encounterGroups[this.groupId].enemies.map((id) => game.content.enemies[id]);
    const xp = enemies.reduce((sum, e) => sum + e.xp, 0);
    const gold = enemies.reduce((sum, e) => sum + e.gold, 0);
    game.state.gold += gold;
    for (const member of game.state.party) member.xp += xp;
    game.push(new DialogueScene([{ text: `Victory! Gained ${xp} XP and ${gold} gold.` }]));
  }

  render(ctx: CanvasRenderingContext2D, game: Game): void {
    const { content, state } = game;
    const group = content.encounterGroups[this.groupId];

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Backdrop.
    const sky = ctx.createLinearGradient(0, 0, 0, 144);
    sky.addColorStop(0, "#182848");
    sky.addColorStop(1, "#3c6048");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, SCREEN_WIDTH, 144);
    ctx.fillStyle = "#2c4a30";
    ctx.fillRect(0, 100, SCREEN_WIDTH, 44);

    // Enemies on the left, in two columns, as in FF4/FF6.
    group.enemies.forEach((id, i) => {
      const enemy = content.enemies[id];
      const x = 20 + Math.floor(i / 3) * 56;
      const y = 16 + (i % 3) * 40;
      ctx.fillStyle = "#101010";
      ctx.fillRect(x - 1, y - 1, 30, 26);
      ctx.fillStyle = enemy.color;
      ctx.fillRect(x, y, 28, 24);
    });

    // Party on the right, staggered.
    state.party.forEach((member, i) => {
      const x = 196 + i * 8;
      const y = 24 + i * 28;
      ctx.fillStyle = "#101010";
      ctx.fillRect(x - 1, y - 1, 18, 22);
      ctx.fillStyle = member.color;
      ctx.fillRect(x, y, 16, 20);
    });

    const boxY = 144;
    const boxH = SCREEN_HEIGHT - boxY - 4;
    drawWindow(ctx, 4, boxY, 96, boxH);
    const counts = new Map<string, number>();
    for (const id of group.enemies) counts.set(id, (counts.get(id) ?? 0) + 1);
    [...counts].forEach(([id, count], i) => {
      drawText(ctx, content.enemies[id].name, 10, boxY + 6 + i * LINE_HEIGHT);
      if (count > 1) drawText(ctx, `${count}`, 88, boxY + 6 + i * LINE_HEIGHT);
    });

    drawWindow(ctx, 100, boxY, SCREEN_WIDTH - 104, boxH);
    state.party.forEach((member, i) => {
      const y = boxY + 6 + i * LINE_HEIGHT;
      drawText(ctx, member.name, 108, y);
      drawText(ctx, `${member.hp}/${member.stats.hp}`, 172, y);
    });

    // Command window floats above the party window, as in FF4.
    const cmdW = 100;
    const cmdH = COMMANDS.length * LINE_HEIGHT + 12;
    const cmdX = SCREEN_WIDTH - cmdW - 4;
    const cmdY = boxY - cmdH + 2;
    drawWindow(ctx, cmdX, cmdY, cmdW, cmdH);
    COMMANDS.forEach((label, i) => drawText(ctx, label, cmdX + 16, cmdY + 6 + i * LINE_HEIGHT));
    drawCursor(ctx, cmdX + 7, cmdY + 8 + this.cursor * LINE_HEIGHT, game.tick);
  }
}
