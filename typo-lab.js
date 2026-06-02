document.addEventListener('DOMContentLoaded', () => {
  const lab = document.querySelector('.typo-lab');
  const sliders = lab.querySelectorAll('.typo-lab__slider');
  const content = lab.querySelector('.typo-lab__content');
  const gradeBox = lab.querySelector('.typo-lab__grade');

  function updateLab() {
    let currentLH = 1.5;
    let currentWidth = 60;

    sliders.forEach(slider => {
      const target = slider.dataset.target;
      const valueDisplay = slider.parentElement.querySelector('.typo-lab__value-display');
      
      if (target === 'line-height') {
        currentLH = parseFloat(slider.value);
        content.style.lineHeight = currentLH;
        valueDisplay.textContent = currentLH;
      } else if (target === 'width') {
        currentWidth = parseInt(slider.value);
        // Устанавливаем минимальную ширину контента
        content.style.maxWidth = currentWidth + 'ch';
        content.style.minWidth = currentWidth + 'ch';
        valueDisplay.textContent = currentWidth + 'ch';
      }
    });

    const isLHGood = currentLH >= 1.4 && currentLH <= 1.6;
    const isWidthGood = currentWidth >= 50 && currentWidth <= 75;

    if (isLHGood && isWidthGood) {
      gradeBox.textContent = "Отлично! Параметры идеальны для длительного чтения.";
      gradeBox.classList.add('typo-lab__grade--success');
    } else {
      let message = "Стремитесь к идеалу: ";
      if (!isLHGood) message += "интерлиньяж 1.4–1.6. ";
      if (!isWidthGood) message += "длина строки 50–75 зн.";
      
      gradeBox.textContent = message;
      gradeBox.classList.remove('typo-lab__grade--success');
    }
  }

  sliders.forEach(slider => {
    slider.addEventListener('input', updateLab);
  });

  updateLab();
});