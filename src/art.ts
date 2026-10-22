// Original procedural illustrations. No external image services or runtime requests.
export function landscape(
  index = 0,
  food = false,
  variant = 0,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 680;
  const c = canvas.getContext("2d")!;
  const palettes = [
    ["#dbc5ad", "#a77c68", "#65433f"],
    ["#eddaa3", "#b29050", "#695248"],
    ["#e5e5e1", "#a8b0b5", "#596473"],
    ["#c7dff1", "#789bc1", "#344f79"],
  ];
  const [sky, mid, dark] = palettes[index % palettes.length];
  c.fillStyle = sky;
  c.fillRect(0, 0, 900, 680);
  if (food) {
    c.fillStyle = mid;
    c.fillRect(0, 470, 900, 210);
    c.fillStyle = "#e9e0c9";
    c.beginPath();
    c.ellipse(450, 420, 260, 115, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = dark;
    c.beginPath();
    c.ellipse(450, 400, 130, 75, 0, 0, Math.PI * 2);
    c.fill();
    if (index === 0) {
      c.fillStyle = "#c59556";
      c.fillRect(300, 310, 260, 145);
      c.fillStyle = "#e3c694";
      c.fillRect(315, 320, 230, 115);
      c.fillStyle = "#f0e4cc";
      c.fillRect(600, 265, 100, 150);
      c.strokeStyle = "#795347";
      c.lineWidth = 10;
      c.strokeRect(600, 265, 100, 150);
    } else if (index === 1) {
      c.fillStyle = "#c88d45";
      for (let i = 0; i < 5; i++) {
        c.beginPath();
        c.ellipse(360 + i * 43, 390 - i * 8, 32, 70, -0.6, 0, Math.PI * 2);
        c.fill();
      }
      c.fillStyle = "#eee4ca";
      c.beginPath();
      c.ellipse(650, 300, 65, 70, 0, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = "#564132";
      c.beginPath();
      c.ellipse(650, 270, 51, 23, 0, 0, Math.PI * 2);
      c.fill();
    } else if (index === 2) {
      for (let i = 0; i < 8; i++) {
        c.fillStyle = ["#c56651", "#d6ad53", "#688766"][i % 3];
        c.beginPath();
        c.arc(
          360 + (i % 4) * 53,
          350 + Math.floor(i / 4) * 54,
          29,
          0,
          Math.PI * 2,
        );
        c.fill();
      }
      c.strokeStyle = "#eaf1f0";
      c.lineWidth = 9;
      c.strokeRect(620, 230, 94, 160);
      c.fillStyle = "#5e4231";
      c.fillRect(629, 299, 76, 83);
    } else {
      c.strokeStyle = "#a5ddf8";
      c.lineWidth = 10;
      c.beginPath();
      c.ellipse(650, 360, 85, 25, 0, 0, Math.PI * 2);
      c.stroke();
      c.fillStyle = "#d4e5ee";
      c.beginPath();
      c.roundRect(600, 190, 100, 150, 25);
      c.fill();
      c.fillStyle = "#65896f";
      for (let i = 0; i < 6; i++) {
        c.beginPath();
        c.ellipse(355 + i * 26, 385 - i * 8, 33, 14, -0.5, 0, Math.PI * 2);
        c.fill();
      }
    }
  } else {
    c.fillStyle = "#ede1b4";
    c.beginPath();
    c.arc(660 - variant * 85, 170 + variant * 22, 58, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = mid;
    c.beginPath();
    c.moveTo(0, 380);
    c.lineTo(200, 210 + index * 20 + variant * 25);
    c.lineTo(380, 380);
    c.lineTo(560, 260);
    c.lineTo(900, 400);
    c.lineTo(900, 680);
    c.lineTo(0, 680);
    c.fill();
    c.fillStyle = dark;
    c.beginPath();
    c.moveTo(0, 500);
    c.bezierCurveTo(260, 350, 540, 560, 900, 440);
    c.lineTo(900, 680);
    c.lineTo(0, 680);
    c.fill();
    c.fillStyle = sky;
    c.beginPath();
    c.moveTo(460, 680);
    c.bezierCurveTo(650, 540, 480, 470, 570, 420);
    c.bezierCurveTo(420, 480, 570, 550, 300, 680);
    c.fill();
    c.fillStyle = dark;
    c.fillRect(130, 280, 8, 180);
    for (let i = 0; i < 4; i++) {
      c.beginPath();
      c.moveTo(134, 220 + i * 35);
      c.lineTo(85 - i * 8, 330 + i * 25);
      c.lineTo(185 + i * 8, 330 + i * 25);
      c.fill();
    }
  }
  let seed = 175 + index + variant * 91;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i < 32000; i++) {
    c.fillStyle = random() > 0.5 ? "rgba(255,255,255,.045)" : "rgba(0,0,0,.04)";
    c.fillRect(random() * 900, random() * 680, 1, 1);
  }
  return canvas;
}
export function imageData(index: number, food = false, variant = 0) {
  return landscape(index, food, variant).toDataURL("image/webp");
}
