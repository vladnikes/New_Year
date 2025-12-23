// ---------- Галерея: fullscreen modal ----------
document.addEventListener('DOMContentLoaded', () => {
  const folderEls = document.querySelectorAll('.folder');
  const thumbs = document.getElementById('thumbs');
  const panelTitle = document.getElementById('panel-title');

  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modal-content');
  const modalClose = document.getElementById('modal-close');
  const modalPrev = document.getElementById('modal-prev');
  const modalNext = document.getElementById('modal-next');

  // ---------- Фото и Видео ----------
  const PHOTOS = [
    {
      type: 'image',
      src: 'images/1.jpg',
      name: 'Зимняя сказка',
      shortDesc: 'Зимняя сказка',               // короткий текст для миниатюры
      description: 'Бубу и Дуду гуляют в снежный, прекрасный день' // полное описание
    },
    {
      type: 'image',
      src: 'images/2.jpg',
      name: 'Зимняя радость',
      shortDesc: 'Зимняя радость',
      description: 'Наслаждаются зимним вечером и запускают фейерверк, пока снежинки мягко падают с неба, создавая атмосферу праздника'
    },
    {
      type: 'image',
      src: 'images/3.jpg',
      name: 'Зимнее приключение',
      shortDesc: 'Зимнее приключение',
      description: 'Стоят на заснеженной равнине под падающими снежинками, окружённые заснеженными горами'
    },
	{
	  type: 'image',
      src: 'images/4.jpg',
      name: 'Новогодняя прогулка',
      shortDesc: 'Новогодняя прогулка',
      description: 'Гуляют по заснеженной улице уютного городка в одетые в костюмы ёлок'
    },
	{
	  type: 'image',
      src: 'images/5.jpg',
      name: 'Теплая новогодняя комната',
      shortDesc: 'Теплая новогодняя комната',
      description: 'Уютная комната, украшенная гирляндами и новогодними фотографиями'
    },
	{
	  type: 'image',
      src: 'images/6.jpg',
      name: 'Волшебная зимняя прогулка',
      shortDesc: 'Волшебная зимняя прогулка',
      description: 'Гуляют под светом луны в заснеженном саду с цветущими сакурой'
    },
	{
	  type: 'image',
      src: 'images/7.jpg',
      name: 'Новогоднее веселье',
      shortDesc: 'Новогоднее веселье',
      description: 'Снежинки нежно падают вокруг нас, укрывая заснеженные деревья и землю'
    },
	{
	  type: 'image',
      src: 'images/8.jpg',
      name: 'Два очаровательных санта',
      shortDesc: 'Два очаровательных санта',
      description: 'Улыбаются под падающими снежинками в морозное утро'
    },
	{
	  type: 'image',
      src: 'images/9.jpg',
      name: 'Зимняя идиллия у дома',
      shortDesc: 'Зимняя идиллия у дома',
      description: 'Медвежата в наряде жирафика стоят под заснеженной крышей'
    },
	{
	  type: 'image',
      src: 'images/10.jpg',
      name: 'Весёлая пирамида',
      shortDesc: 'Весёлая пирамида',
      description: 'Кампания медвежат, одетых в костюмы Санта-Клауса и с оленями рогами, выстроились в пирамиду вокруг украшенной ёлки'
    },
	{
	  type: 'image',
      src: 'images/11.jpg',
      name: 'Романтика под снегом',
      shortDesc: 'Романтика под снегом',
      description: 'Нежно держатся за руки под зонтом в заснеженном саду'
    },
	{
	  type: 'image',
      src: 'images/12.jpg',
      name: 'Весёлые снеговички',
      shortDesc: 'Весёлые снеговички',
      description: 'Одетые в костюмы снеговичков, стоят на заснеженной улице перед уютными жёлтыми домиками'
    },
	{
	  type: 'image',
      src: 'images/13.jpg',
      name: 'Дружная тройка',
      shortDesc: 'Дружная тройка',
      description: 'Лепят милого снеговичка, украшенным шапочкой и шарфом '
    },
	{
	  type: 'image',
      src: 'images/14.jpg',
      name: 'Спокойствие зимней ночи',
      shortDesc: 'Спокойствие зимней ночи',
      description: 'Сидит на стуле с маленькой птичкой на голове '
    },
	
	
  ];

  const VIDEOS = [
    {
      type: 'video',
      src: 'video/bubu_and_dudu_1.mp4',
      name: 'Милые исполнители',
      shortDesc: 'Милые исполнители',
      description: 'Подвевают и играют на гитаре под песню'
    },
    {
      type: 'video',
      src: 'video/bubu_and_dudu_2.mp4',
      name: 'Веселье под песню',
      shortDesc: '',
      description: ''
    },
	{
      type: 'video',
      src: 'video/bubu_and_dudu_3.mp4',
      name: 'Новогоднее веселье',
      shortDesc: 'Новогоднее веселье',
      description: 'Исполняют музыку вантусом'
    },
	{
      type: 'video',
      src: 'video/bubu_and_dudu_4.mp4',
      name: 'Отдых',
      shortDesc: '',
      description: 'Новогодний перекус на улице'
    },
	{
      type: 'video',
      src: 'video/bubu_and_dudu_5.mp4',
      name: 'Фейерверк',
      shortDesc: '',
      description: 'Веселье на фоне фейерверка'
    },
	{
      type: 'video',
      src: 'video/bubu_and_dudu_6.mp4',
      name: 'Поют',
      shortDesc: '',
      description: 'Веселье на фоне фейерверка'
    },
  ];

  let currentList = [];
  let currentIndex = -1;

  // ---------- Рендер миниатюр ----------
  function renderThumbs(list) {
    thumbs.innerHTML = '';
    list.forEach((item, idx) => {
      const t = document.createElement('div');
      t.className = 'thumb';

      // --- картинка или видео ---
      if (item.type === 'image') {
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.name || '';
        t.appendChild(img);
      } else {
        const vid = document.createElement('video');
        vid.src = item.src;
        vid.muted = true;
        vid.preload = 'metadata';
        vid.playsInline = true;
        vid.addEventListener('play', () => {
          document.querySelectorAll('.thumb video').forEach(v => { if (v !== vid) v.pause(); });
        });
        t.appendChild(vid);
      }

      // --- короткое описание вместо "Фото 1" ---
      const title = document.createElement('div');
      title.className = 'title';
      title.textContent = item.shortDesc || item.name || '';
      t.appendChild(title);

      t.addEventListener('click', () => openModal(idx));
      thumbs.appendChild(t);
    });
  }

  // ---------- Модалка ----------
  function openModal(index) {
    if (!currentList || !currentList.length) return;
    currentIndex = index;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    renderModalContent();
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    modalContent.querySelectorAll('video').forEach(v => {
      try { v.pause(); v.removeAttribute('src'); v.load(); } catch (e) {}
    });
    modalContent.innerHTML = '';
  }

  function navigateModal(dir) {
    if (!currentList || !currentList.length) return;
    currentIndex = (currentIndex + dir + currentList.length) % currentList.length;
    renderModalContent();
  }

  function renderModalContent() {
    const item = currentList[currentIndex];
    modalContent.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'modal-media-wrap';

    if (item.type === 'image') {
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.name || '';
      img.style.objectFit = 'contain';
      img.style.maxWidth = '100vw';
      img.style.maxHeight = '80vh';
      container.appendChild(img);
    } else {
      const video = document.createElement('video');
      video.src = item.src;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.preload = 'auto';
      video.style.objectFit = 'contain';
      video.style.maxWidth = '100vw';
      video.style.maxHeight = '80vh';
      setTimeout(() => {
        const p = video.play();
        if (p && p.catch) p.catch(() => {});
      }, 60);
      container.appendChild(video);
    }

    // Название (если нужно)
    if (item.name) {
      const title = document.createElement('div');
      title.className = 'modal-title';
      title.textContent = item.name;
      title.style.margin = '12px 0 6px';
      title.style.fontWeight = '700';
      title.style.fontSize = '1.05rem';
      container.appendChild(title);
    }

    // Полное описание
    const desc = document.createElement('div');
    desc.className = 'modal-description';
    desc.textContent = item.description || '';
    desc.style.maxWidth = '90vw';
    desc.style.fontSize = '0.95rem';
    desc.style.opacity = '0.95';
    desc.style.lineHeight = '1.45';
    container.appendChild(desc);

    modalContent.appendChild(container);
  }

  // ---------- Навигация ----------
  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  modalPrev?.addEventListener('click', () => navigateModal(-1));
  modalNext?.addEventListener('click', () => navigateModal(1));
  document.addEventListener('keydown', e => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'ArrowLeft') navigateModal(-1);
    if (e.key === 'ArrowRight') navigateModal(1);
    if (e.key === 'Escape') closeModal();
  });

  // ---------- Открытие папок ----------
  folderEls.forEach(f => f.addEventListener('click', () => {
    const key = f.dataset.open;
    if (key === 'photos') {
      currentList = PHOTOS;
      panelTitle.textContent = 'Фотографии';
    } else {
      currentList = VIDEOS;
      panelTitle.textContent = 'Видео';
    }
    renderThumbs(currentList);
  }));

  // ---------- По умолчанию открываем фото ----------
  document.querySelector('.folder[data-open="photos"]')?.click();

  // ---------- Новый зум миниатюр без наложений ----------
const zoomWrap = document.querySelector('.zoom-wrap');
const zoomThumb = zoomWrap?.querySelector('.zoom-thumb');

if (zoomWrap && zoomThumb) {
  const MIN_SIZE = 100;  // минимальная ширина превью
  const MAX_SIZE = 260;  // максимальная ширина превью
  const TRACK_WIDTH = 120 - 16; // ширина трека минус ползунок

  let isDragging = false;

  const setZoom = (clientX) => {
    const rect = zoomWrap.getBoundingClientRect();
    let offset = Math.min(Math.max(0, clientX - rect.left - 8), TRACK_WIDTH);
    zoomThumb.style.left = `${offset}px`;

    const ratio = offset / TRACK_WIDTH;
    const size = MIN_SIZE + (MAX_SIZE - MIN_SIZE) * ratio;
    document.documentElement.style.setProperty('--thumb-size', `${size}px`);
  };

  zoomWrap.addEventListener('mousedown', (e) => {
    isDragging = true;
    setZoom(e.clientX);
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) setZoom(e.clientX);
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Установка дефолтного положения (средний масштаб)
  document.documentElement.style.setProperty('--thumb-size', `160px`);
  zoomThumb.style.left = `${(TRACK_WIDTH / 2)}px`;
}

});