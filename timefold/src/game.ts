import type { EraTheme } from "./archive";

export function mountGame(
  container: HTMLElement,
  options: { theme: EraTheme; year: string },
): () => void {
  const { theme, year } = options;
  container.innerHTML = `<canvas class="game-canvas" width="720" height="440" aria-label="Isometric memory game. Use arrow keys or the direction buttons to collect three memories, then reach the doorway."></canvas><p class="game-status" aria-live="polite">Collect the three fragments. Find the doorway.</p><div class="game-controls"><div class="dpad"><button data-move="0,-1" aria-label="Move up">↑</button><button data-move="-1,0" aria-label="Move left">←</button><button data-move="0,1" aria-label="Move down">↓</button><button data-move="1,0" aria-label="Move right">→</button></div><button class="text-button" data-restart>Restart ↺</button></div>`;
  const canvas = container.querySelector("canvas")!,
    ctx = canvas.getContext("2d")!,
    status = container.querySelector(".game-status")!;
  let player = [0, 5],
    collected = 0,
    won = false;
  const walls = new Set(["1,1", "2,1", "3,1", "3,2", "3,3", "1,4", "5,4"]);
  let fragments = new Set(["0,0", "5,1", "4,5"]);
  function point(x: number, y: number) {
    return [360 + (x - y) * 41, 74 + (x + y) * 23];
  }
  function diamond(x: number, y: number, color: string, lift = 0) {
    const [px, py] = point(x, y);
    ctx.beginPath();
    ctx.moveTo(px, py - 20 - lift);
    ctx.lineTo(px + 39, py - lift);
    ctx.lineTo(px, py + 20 - lift);
    ctx.lineTo(px - 39, py - lift);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = theme.shadow;
    ctx.stroke();
  }
  function draw() {
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, 720, 440);
    for (let y = 0; y < 6; y++)
      for (let x = 0; x < 6; x++) {
        diamond(x, y, (x + y) % 2 ? theme.floor : theme.wall);
        if (walls.has(`${x},${y}`)) {
          const [px, py] = point(x, y);
          ctx.fillStyle = theme.shadow;
          ctx.fillRect(px - 30, py - 60, 60, 60);
          diamond(x, y, theme.plaster, 55);
        }
        if (x === 5 && y === 0) {
          const [px, py] = point(x, y);
          ctx.strokeStyle = collected === 3 ? theme.light : theme.metal;
          ctx.lineWidth = 5;
          ctx.strokeRect(px - 17, py - 54, 34, 54);
          ctx.lineWidth = 1;
        }
        if (fragments.has(`${x},${y}`)) {
          const [px, py] = point(x, y);
          ctx.fillStyle = theme.accent;
          ctx.shadowColor = theme.accent;
          ctx.shadowBlur = 18;
          ctx.beginPath();
          ctx.arc(px, py - 19, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    const [px, py] = point(...(player as [number, number]));
    ctx.fillStyle = theme.paper;
    ctx.beginPath();
    ctx.roundRect(px - 10, py - 43, 20, 33, 7);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(px, py - 50, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = theme.text;
    ctx.font = "13px monospace";
    ctx.fillText(`FRAGMENTS  ${collected} / 3`, 28, 400);
    ctx.fillText(`A SMALL WORLD / ${year}`, 490, 400);
  }
  function move(dx: number, dy: number) {
    if (won) return;
    const x = player[0] + dx,
      y = player[1] + dy;
    if (x < 0 || x > 5 || y < 0 || y > 5 || walls.has(`${x},${y}`)) return;
    player = [x, y];
    if (fragments.delete(`${x},${y}`)) {
      collected++;
      status.textContent = `${collected} of 3 fragments found. ${collected === 3 ? "The doorway is open." : "Keep exploring."}`;
    }
    if (x === 5 && y === 0 && collected === 3) {
      won = true;
      status.textContent =
        "A memory, put back together. You found your way home.";
    }
    draw();
  }
  function key(e: KeyboardEvent) {
    const directions: Record<string, number[]> = {
      ArrowUp: [0, -1],
      w: [0, -1],
      ArrowDown: [0, 1],
      s: [0, 1],
      ArrowLeft: [-1, 0],
      a: [-1, 0],
      ArrowRight: [1, 0],
      d: [1, 0],
    };
    if (directions[e.key]) {
      e.preventDefault();
      move(...(directions[e.key] as [number, number]));
    }
  }
  container
    .querySelectorAll<HTMLButtonElement>("[data-move]")
    .forEach(
      (b) =>
        (b.onclick = () =>
          move(
            ...(b.dataset.move!.split(",").map(Number) as [number, number]),
          )),
    );
  container.querySelector<HTMLButtonElement>("[data-restart]")!.onclick =
    () => {
      player = [0, 5];
      collected = 0;
      won = false;
      fragments = new Set(["0,0", "5,1", "4,5"]);
      status.textContent = "Collect the three fragments. Find the doorway.";
      draw();
    };
  window.addEventListener("keydown", key);
  draw();
  return () => window.removeEventListener("keydown", key);
}
