const hueSlider = document.getElementById('hueSlider');
const satSlider = document.getElementById('satSlider');
const briSlider = document.getElementById('briSlider');
const preview = document.getElementById('colorPreview');
const hexResult = document.getElementById('hexResult');

function updateColor() {
    const h = hueSlider.value;
    const s = satSlider.value;
    const b = briSlider.value;

    document.getElementById('hueVal').textContent = h;
    document.getElementById('satVal').textContent = s;
    document.getElementById('briVal').textContent = b;

    preview.style.backgroundColor = `hsl(${h}, ${s}%, ${b}%)`;
    hexResult.textContent = hslToHex(h, s, b);
}

function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

hueSlider.addEventListener('input', updateColor);
satSlider.addEventListener('input', updateColor);
briSlider.addEventListener('input', updateColor);

updateColor();