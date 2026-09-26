export type Action = "up" | "down" | "left" | "right" | "confirm" | "cancel" | "menu" | "prevMember" | "nextMember";

const KEY_BINDINGS: Record<string, Action> = {
  ArrowUp: "up",
  KeyW: "up",
  ArrowDown: "down",
  KeyS: "down",
  ArrowLeft: "left",
  KeyA: "left",
  ArrowRight: "right",
  KeyD: "right",
  KeyZ: "confirm",
  Enter: "confirm",
  Space: "confirm",
  KeyX: "cancel",
  Backspace: "cancel",
  Escape: "menu",
  KeyC: "menu",
  KeyQ: "prevMember",
  PageUp: "prevMember",
  KeyE: "nextMember",
  PageDown: "nextMember",
};

/**
 * Keyboard state mapped to abstract actions. `held` is true while a key is
 * down; `pressed` is true only on the first tick after it went down.
 */
export class Input {
  private readonly heldActions = new Set<Action>();
  private readonly pressedActions = new Set<Action>();

  attach(target: Window): void {
    target.addEventListener("keydown", (e) => {
      const action = KEY_BINDINGS[e.code];
      if (!action) return;
      e.preventDefault();
      if (!e.repeat && !this.heldActions.has(action)) this.pressedActions.add(action);
      this.heldActions.add(action);
    });
    target.addEventListener("keyup", (e) => {
      const action = KEY_BINDINGS[e.code];
      if (action) this.heldActions.delete(action);
    });
    // Avoid keys getting stuck when the tab loses focus mid-press.
    target.addEventListener("blur", () => this.heldActions.clear());
  }

  held(action: Action): boolean {
    return this.heldActions.has(action);
  }

  pressed(action: Action): boolean {
    return this.pressedActions.has(action);
  }

  /** Called once per simulation tick, after update. */
  endTick(): void {
    this.pressedActions.clear();
  }

  /** Test helper and scripting hook: simulate a key press for one tick. */
  press(action: Action): void {
    this.pressedActions.add(action);
  }
}
