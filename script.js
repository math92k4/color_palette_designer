"use strict";

window.addEventListener("DOMContentLoaded", init);

const HTML = []; //for globals (if any)

//
//
// ----- init
function init() {
  //initial run-through
  collectInputs();

  document.querySelector("select").addEventListener("change", collectInputs);
  document.querySelector("#input").addEventListener("input", collectInputs);
}

//
//
//
//
// ------ collectInputs
function collectInputs() {
  declareHarmonyInput();

  const hex = getHexInput();
  convertValueToHsl(hex);
}

function declareHarmonyInput() {
  HTML.selectedHarmony = document.querySelector("select").value;
}

function getHexInput() {
  const hex = document.querySelector("#input").value;

  return hex;
}

//
//
//
//
// ------ convertValueToHsl
function convertValueToHsl(hex) {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb);

  generateHarmony(hsl);
}

function hexToRgb(hex) {
  const hexR = hex.substring(1, 3);
  const hexG = hex.substring(3, 5);
  const hexB = hex.substring(5, 7);

  const r = parseInt(hexR, 16);
  const g = parseInt(hexG, 16);
  const b = parseInt(hexB, 16);

  return { r, g, b };
}

function rgbToHsl(rgb) {
  let r = rgb.r;
  let g = rgb.g;
  let b = rgb.b;

  r /= 255;
  g /= 255;
  b /= 255;

  let h, s, l;

  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);

  if (max === min) {
    h = 0;
  } else if (max === r) {
    h = 60 * (0 + (g - b) / (max - min));
  } else if (max === g) {
    h = 60 * (2 + (b - r) / (max - min));
  } else if (max === b) {
    h = 60 * (4 + (r - g) / (max - min));
  }

  if (h < 0) {
    h = h + 360;
  }

  l = (min + max) / 2;

  if (max === 0 || min === 1) {
    s = 0;
  } else {
    s = (max - l) / Math.min(l, 1 - l);
  }
  // multiply s and l by 100 to get the value in percent, rather than [0,1]
  s *= 100;
  l *= 100;

  //Afrundet til 2 decimaler
  h = Number(h.toFixed(0));
  s = Number(s.toFixed(2));
  l = Number(l.toFixed(2));

  return { h, s, l };
}

//
//
//
//
// ----- generateHarmony
function generateHarmony(hsl) {
  let hslHarmony = null; //To be array of selected harmony, in hsl.

  if (HTML.selectedHarmony === "analogous") {
    hslHarmony = calcAnalogous(hsl);
  }
  if (HTML.selectedHarmony === "monochromatic") {
    hslHarmony = calcMonochromatic(hsl);
  }
  if (HTML.selectedHarmony === "triad") {
    hslHarmony = calcTriad(hsl);
  }
  if (HTML.selectedHarmony === "complementary") {
    hslHarmony = calcComplementary(hsl);
  }
  if (HTML.selectedHarmony === "compound") {
    hslHarmony = calcCompound(hsl);
  }
  if (HTML.selectedHarmony === "shades") {
    hslHarmony = calcShades(hsl);
  }

  //Making sure h values are between 0 and 360 (degrees)
  hslHarmony = calcMinMaxValues(hslHarmony);

  reconvertValues(hslHarmony);
}

function calcAnalogous(hsl) {
  let hslHarmony = new Array(5);
  let valueH = -40;

  for (let i = 0; i < 5; i++) {
    hslHarmony[i] = { h: hsl.h + valueH, s: hsl.s, l: hsl.l };
    valueH += 20;
  }

  return hslHarmony;
}

function calcMonochromatic(hsl) {
  let hslHarmony = new Array(5);

  hslHarmony[0] = { h: hsl.h, s: hsl.s - 15, l: hsl.l };
  hslHarmony[1] = { h: hsl.h, s: hsl.s, l: hsl.l - 15 };
  hslHarmony[2] = { h: hsl.h, s: hsl.s, l: hsl.l };
  hslHarmony[3] = { h: hsl.h, s: hsl.s + 15, l: hsl.l };
  hslHarmony[4] = { h: hsl.h, s: hsl.s, l: hsl.l + 15 };

  return hslHarmony;
}

function calcTriad(hsl) {
  let hslHarmony = new Array(5);

  hslHarmony[0] = { h: hsl.h + 60, s: hsl.s, l: hsl.l - 2 };
  hslHarmony[1] = { h: hsl.h + 60, s: hsl.s, l: hsl.l };
  hslHarmony[2] = { h: hsl.h, s: hsl.s, l: hsl.l };
  hslHarmony[3] = { h: hsl.h + 120, s: hsl.s, l: hsl.l };
  hslHarmony[4] = { h: hsl.h + 120, s: hsl.s, l: hsl.l - 2 };

  return hslHarmony;
}

function calcComplementary(hsl) {
  let hslHarmony = new Array(5);

  hslHarmony[0] = { h: hsl.h, s: hsl.s, l: hsl.l };
  hslHarmony[1] = { h: hsl.h + 180, s: hsl.s, l: hsl.l };
  hslHarmony[2] = { h: hsl.h, s: hsl.s, l: hsl.l };
  hslHarmony[3] = { h: hsl.h + 180, s: hsl.s, l: hsl.l };
  hslHarmony[4] = { h: hsl.h, s: hsl.s, l: hsl.l };

  return hslHarmony;
}

function calcCompound(hsl) {
  let hslHarmony = new Array(5);

  hslHarmony[0] = { h: hsl.h + 200, s: hsl.s, l: hsl.l };
  hslHarmony[1] = { h: hsl.h + 20, s: hsl.s, l: hsl.l };
  hslHarmony[2] = { h: hsl.h, s: hsl.s, l: hsl.l };
  hslHarmony[3] = { h: hsl.h - 20, s: hsl.s, l: hsl.l };
  hslHarmony[4] = { h: hsl.h - 160, s: hsl.s, l: hsl.l };

  return hslHarmony;
}

function calcShades(hsl) {
  let hslHarmony = new Array(5);
  let valueL = -40;

  for (let i = 0; i < 5; i++) {
    hslHarmony[i] = { h: hsl.h, s: hsl.s, l: hsl.l + valueL };
    valueL += 20;
  }

  return hslHarmony;
}

function calcMinMaxValues(hslHarmony) {
  //H min 0, max 360 (deg)
  //S,L min 0 max 100
  hslHarmony.forEach((value) => {
    if (value.h < 0) {
      value.h = value.h + 360;
    }
    if (value.h > 360) {
      value.h = value.h - 360;
    }
    if (value.l < 0) {
      value.l = value.l + 100;
    }
    if (value.l > 100) {
      value.l = value.l - 100;
    }
    if (value.s < 0) {
      value.s = value.s + 100;
    }
    if (value.s > 100) {
      value.s = value.s - 100;
    }
  });

  return hslHarmony;
}

//
//
//
//
// ----- reconvertValues
function reconvertValues(hslHarmony) {
  for (let i = 0; i < 5; i++) {
    const hsl = hslHarmony[i];
    const rgb = hslToRgb(hsl);
    const hex = rgbToHex(rgb);
    displayColorInfo(hsl, rgb, hex, i);
  }
}

function hslToRgb(hsl) {
  let h = hsl.h;
  let s = hsl.s / 100;
  let l = hsl.l / 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0;
  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return { r, g, b };
}

function rgbToHex(rgb) {
  const hexR = rgb.r.toString(16).padStart(2, "0");
  const hexG = rgb.g.toString(16).padStart(2, "0");
  const hexB = rgb.b.toString(16).padStart(2, "0");

  const hex = "#" + hexR + hexG + hexB;

  return hex;
}

//
//
//
//
// ----- displayColorInfo
function displayColorInfo(hsl, rgb, hex, i) {
  displayColor(hex, i);

  displayHex(hex, i);
  displayRgb(rgb, i);
  displayHsl(hsl, i);
}

function displayHex(hex, i) {
  document.querySelector(`#colorBox${i} .hex`).textContent = `HEX: ${hex}`;
}

function displayRgb(rgb, i) {
  document.querySelector(
    `#colorBox${i} .rgb`
  ).textContent = `RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}`;
}

function displayHsl(hsl, i) {
  document.querySelector(
    `#colorBox${i} .hsl`
  ).textContent = `HSL: ${hsl.h.toFixed()}, ${hsl.s.toFixed(
    2
  )}%, ${hsl.l.toFixed(2)}%`;
}

function displayColor(hex, i) {
  document.querySelector(`#colorBox${i} .color`).style.backgroundColor = hex;
}
