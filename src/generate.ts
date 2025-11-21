import fs from "fs";
import path from "path";
import { createCanvas } from "canvas";

const paylines = JSON.parse(
  fs.readFileSync("paylines.json", "utf8")
) as Record<string, number[]>;

const CELL = 40;
const COLS = 5;
const ROWS = 3;

if (!fs.existsSync("output")) fs.mkdirSync("output");

function generatePNG(id: string, pattern: number[]) {
  const width = COLS * CELL;
  const height = ROWS * CELL;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // background
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);

  // grid
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      ctx.strokeStyle = "#444";
      ctx.lineWidth = 2;
      ctx.strokeRect(c * CELL, r * CELL, CELL, CELL);
    }
  }

  // active cells
  pattern.forEach((row, col) => {
    ctx.fillStyle = "#00c97a";
    ctx.fillRect(
      col * CELL + 4,
      row * CELL + 4,
      CELL - 8,
      CELL - 8
    );
  });

  // connecting polyline
  ctx.strokeStyle = "#00ff99";
  ctx.lineWidth = 4;
  ctx.beginPath();

  pattern.forEach((row, col, i) => {
    const x = col * CELL + CELL / 2;
    const y = row * CELL + CELL / 2;
    if (col === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.stroke();

  // write PNG
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(path.join("output", `payline_${id}.png`), buffer);
}

Object.entries(paylines).forEach(([id, pattern]) => {
  generatePNG(id, pattern);
});

console.log("Generated PNGs in /output");
