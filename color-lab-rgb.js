const rSlider = document.getElementById('rSlider');
const gSlider = document.getElementById('gSlider');
const bSlider = document.getElementById('bSlider');
const rgbPreview = document.getElementById('rgbPreview');
const rgbHexResult = document.getElementById('rgbHexResult');

function updateRGBColor() {
  const r = parseInt(rSlider.value);
  const g = parseInt(gSlider.value);
  const b = parseInt(bSlider.value);
  
  document.getElementById('rVal').textContent = r;
  document.getElementById('gVal').textContent = g;
  document.getElementById('bVal').textContent = b;
  
  rgbPreview.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  rgbHexResult.textContent = `HEX: #${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

function componentToHex(c) {
  const hex = c.toString(16).toUpperCase();
  return hex.length === 1 ? '0' + hex : hex;
}

rSlider.addEventListener('input', updateRGBColor);
gSlider.addEventListener('input', updateRGBColor);
bSlider.addEventListener('input', updateRGBColor);

updateRGBColor();