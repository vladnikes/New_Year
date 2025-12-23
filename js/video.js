// video.js — плавное зацикливание с парными видео (вперёд и назад)
document.addEventListener('DOMContentLoaded', () => {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  const videoPairs = {}; // { tabId: { forward: videoElem, reverse: videoElem } }

  // Инициализация всех видео
  document.querySelectorAll('.background-video').forEach(video => {
    video.muted = true;
    video.playsInline = true;
    video.loop = false; // управляем циклом вручную

    // получаем id, например "video-1" и "video-1_1"
    const match = video.id.match(/^video-(.+?)(?:_1)?$/);
    if (match) {
      const tabId = match[1];
      if (!videoPairs[tabId]) videoPairs[tabId] = {};
      if (video.id.includes('_1')) {
        videoPairs[tabId].reverse = video;
      } else {
        videoPairs[tabId].forward = video;
      }
    }
  });

  // Функция запуска цикла вперёд-назад для выбранной вкладки
  function startLoop(tabId) {
    const pair = videoPairs[tabId];
    if (!pair || !pair.forward || !pair.reverse) return;

    const { forward, reverse } = pair;

    // Убедимся, что только нужные видео активны
    Object.values(videoPairs).forEach(({ forward, reverse }) => {
      if (forward) {
        forward.pause();
        forward.classList.remove('active');
      }
      if (reverse) {
        reverse.pause();
        reverse.classList.remove('active');
      }
    });

    // Запускаем прямое видео
    forward.currentTime = 0;
    forward.classList.add('active');
    reverse.classList.remove('active');

    forward.play().catch(err => console.warn('Play forward failed:', err));

    // Когда прямое закончится → запускаем обратное
    forward.onended = () => {
      forward.classList.remove('active');
      reverse.classList.add('active');
      reverse.currentTime = 0;
      reverse.play().catch(err => console.warn('Play reverse failed:', err));
    };

    // Когда обратное закончится → снова вперёд
    reverse.onended = () => {
      reverse.classList.remove('active');
      forward.classList.add('active');
      forward.currentTime = 0;
      forward.play().catch(err => console.warn('Play forward failed:', err));
    };
  }

  // Переключение вкладок
  function activateTab(tabId) {
    tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId));
    tabContents.forEach(content => content.classList.toggle('active', content.id === tabId));

    startLoop(tabId);
  }

  // Клики по вкладкам
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      activateTab(btn.dataset.tab);
    });
  });

  // Автозапуск первой вкладки
  const initialTab =
    document.querySelector('.tab-button.active')?.dataset.tab ||
    document.querySelector('.tab-button')?.dataset.tab;
  if (initialTab) activateTab(initialTab);
});
