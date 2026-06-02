document.addEventListener('DOMContentLoaded', function() {
    const textColorInput = document.getElementById('text-color-input');
    const bgColorInput = document.getElementById('bg-color-input');
    const textColorDisplay = document.getElementById('text-color-display');
    const bgColorDisplay = document.getElementById('bg-color-display');
    const previewBox = document.getElementById('contrast-preview-box');
    const sampleText = previewBox ? previewBox.querySelector('.contrast-checker__sample-text') : null;
    const ratioValue = document.getElementById('contrast-ratio-value');
    const wcagStatus = document.getElementById('wcag-status');

    if (!textColorInput || !bgColorInput) return;

    function hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }

    function getLuminance(r, g, b) {
      const a = [r, g, b].map(function (v) {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }

    function getContrastRatio(hex1, hex2) {
      const rgb1 = hexToRgb(hex1);
      const rgb2 = hexToRgb(hex2);
      if (!rgb1 || !rgb2) return 1;
      const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
      const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
      const brightest = Math.max(lum1, lum2);
      const darkest = Math.min(lum1, lum2);
      return (brightest + 0.05) / (darkest + 0.05);
    }

    function updateContrast() {
      const textColor = textColorInput.value;
      const bgColor = bgColorInput.value;
      
      if (textColorDisplay) textColorDisplay.textContent = textColor.toUpperCase();
      if (bgColorDisplay) bgColorDisplay.textContent = bgColor.toUpperCase();
      
      if (previewBox) previewBox.style.backgroundColor = bgColor;
      if (sampleText) sampleText.style.color = textColor;
      
      const ratio = getContrastRatio(textColor, bgColor);
      const ratioRounded = ratio.toFixed(2);
      if (ratioValue) ratioValue.textContent = ratioRounded + ':1';
      
      if (wcagStatus) {
        if (ratio >= 4.5) {
          wcagStatus.textContent = '✓ Проходит стандарт WCAG AA';
          wcagStatus.className = 'contrast-checker__status contrast-checker__status--success';
        } else {
          wcagStatus.textContent = '✗ Не проходит стандарт WCAG AA';
          wcagStatus.className = 'contrast-checker__status contrast-checker__status--fail';
        }
      }
    }

    textColorInput.addEventListener('input', updateContrast);
    bgColorInput.addEventListener('input', updateContrast);
    updateContrast();
  });