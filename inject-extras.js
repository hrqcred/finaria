(function() {
  'use strict';


  var REVIEWS = [
    {
      name: "Leila Carvalho",
      text: "O meu chegou hoje, muito cheiroso e tem uma testura muito cremosa",
      imgs: ["fotos-avaliacoes/review-1.jpg","fotos-avaliacoes/review-2.jpg","fotos-avaliacoes/review-3.jpg","fotos-avaliacoes/review-4.jpg","fotos-avaliacoes/review-5.jpg","fotos-avaliacoes/review-6.jpg"],
      stars: 5
    },
    {
      name: "Sol Mesquita",
      text: "Fiquei satisfeita, superou muito as expectativas, comprarei mais vezes e outras máscaras da mesma linha, recomendo, entrega no prazo",
      imgs: ["fotos-avaliacoes/review-7.jpg","fotos-avaliacoes/review-8.jpg","fotos-avaliacoes/review-9.jpg","fotos-avaliacoes/review-10.jpg","fotos-avaliacoes/review-11.jpg","fotos-avaliacoes/review-12.jpg"],
      stars: 5
    },
    {
      name: "Leco Vilela",
      text: "Boa e hidrata bem, tem um cheiro maravilhoso, gostei bastante",
      imgs: ["fotos-avaliacoes/review-13.jpg","fotos-avaliacoes/review-14.jpg","fotos-avaliacoes/review-15.jpg","fotos-avaliacoes/review-16.jpg","fotos-avaliacoes/review-17.jpg","fotos-avaliacoes/review-18.jpg"],
      stars: 5
    },
    {
      name: "Felícia Paiva",
      text: "Genteee, tem um cheiro magnífico, deixa o cabelo super macio, brilhoso e bemmm hidratado. Comprem não vão se arrepender",
      imgs: ["fotos-avaliacoes/review-19.jpg","fotos-avaliacoes/review-20.jpg","fotos-avaliacoes/review-21.jpg","fotos-avaliacoes/review-22.jpg"],
      stars: 5
    },
    {
      name: "Gui Albuquerque",
      text: "Chegou super rápido, cheirosa, vou testar pra ver como é. Recomendo a todos.",
      imgs: ["fotos-avaliacoes/review-23.jpg","fotos-avaliacoes/review-24.jpg","fotos-avaliacoes/review-25.jpg","fotos-avaliacoes/review-26.jpg"],
      stars: 5
    },
    {
      name: "Celia Pacheco",
      text: "O cheiro é maravilhoso. Os fios ficam bem emolientes e é perceptível como hidrata assim que aplicado.",
      imgs: ["fotos-avaliacoes/review-27.jpg","fotos-avaliacoes/review-28.jpg","fotos-avaliacoes/review-29.jpg"],
      stars: 5
    },
    {
      name: "Gabriella Ávila",
      text: "Amei muito cheiroso, chegou rápido, validade muito bom veio brinde amei, agora é só usar.",
      imgs: ["fotos-avaliacoes/review-30.jpg","fotos-avaliacoes/review-31.jpg"],
      stars: 5
    },
    {
      name: "Laís Batista",
      text: "Já é a segunda vez que compro apaixonada nessa máscara hidrata muito p cabelo, quero comprar a máscara bronze que veio de brinde maravilhosa tbm, parabéns pelos produtos!! Perfeito",
      imgs: ["fotos-avaliacoes/review-32.jpg","fotos-avaliacoes/review-33.jpg"],
      stars: 5
    },
    {
      name: "Rico Curado",
      text: "Gente essa aqui é de hidratação ela é a máscara marroquina ouro super concentrada um cheirinho maravilhoso efeito teia também igual eu falei a marca dela é muito boa a textura é ótima vale muito a pena gente é salão de beleza em casa com certeza",
      imgs: ["fotos-avaliacoes/review-34.jpg","fotos-avaliacoes/review-35.jpg","fotos-avaliacoes/review-36.jpg","fotos-avaliacoes/review-37.jpg","fotos-avaliacoes/review-38.jpg","fotos-avaliacoes/review-39.jpg"],
      stars: 5
    },
    {
      name: "Flávio Siqueira",
      text: "Eu amei, muito bom mesmo, só comprem",
      imgs: ["fotos-avaliacoes/review-40.jpg","fotos-avaliacoes/review-41.jpg","fotos-avaliacoes/review-42.jpg","fotos-avaliacoes/review-43.jpg","fotos-avaliacoes/review-44.jpg","fotos-avaliacoes/review-45.jpg"],
      stars: 5
    },
    {
      name: "Beto Ornélas",
      text: "Chegou conforme anúncio, bem embalado, tem um consistência boa, um cheiro muito bom.",
      imgs: ["fotos-avaliacoes/review-46.jpg","fotos-avaliacoes/review-47.jpg"],
      stars: 5
    },
    {
      name: "Nanda Vieira",
      text: "Chegou bem rápido, veio bem embalado a loja caprichou, muito bom...",
      imgs: ["fotos-avaliacoes/review-48.jpg"],
      stars: 5
    }
  ];

  function createStars(count) {
    var html = '';
    for (var i = 0; i < count; i++) {
      html += '<span class="rv-card-star">★</span>';
    }
    return html;
  }

  function createVerifiedBadge() {
    return '<span class="rv-verified"><svg viewBox="0 0 12 12"><path d="M10.28 2.28L4.5 8.06 1.72 5.28a.75.75 0 00-1.06 1.06l3.5 3.5a.75.75 0 001.06 0l6.5-6.5a.75.75 0 00-1.06-1.06z"/></svg></span>';
  }

  function createCard(review, visible) {
    var div = document.createElement('div');
    div.className = 'rv-card';
    if (!visible) div.style.display = 'none';
    div.setAttribute('data-rv-card', '');

    var dotsHtml = '';
    if (review.imgs.length > 1) {
      dotsHtml = '<div class="rv-card-dots">';
      for (var i = 0; i < Math.min(review.imgs.length, 6); i++) {
        dotsHtml += '<span class="rv-card-dot' + (i === 0 ? ' active' : '') + '"></span>';
      }
      dotsHtml += '</div>';
    }

    div.innerHTML =
      '<div class="rv-card-img-wrap" data-imgs=\'' + JSON.stringify(review.imgs) + '\' data-idx="0">' +
        '<img src="' + review.imgs[0] + '" alt="Avaliação de ' + review.name + '" loading="lazy">' +
        dotsHtml +
      '</div>' +
      '<div class="rv-card-body">' +
        '<div class="rv-card-stars">' + createStars(review.stars) + '</div>' +
        '<div class="rv-card-name">' + review.name + ' ' + createVerifiedBadge() + '</div>' +
        '<div class="rv-card-text">' + review.text + '</div>' +
      '</div>';

    var imgWrap = div.querySelector('.rv-card-img-wrap');
    var startX = 0;
    imgWrap.addEventListener('touchstart', function(e) { startX = e.touches[0].clientX; }, {passive: true});
    imgWrap.addEventListener('touchend', function(e) {
      var endX = e.changedTouches[0].clientX;
      var diff = startX - endX;
      if (Math.abs(diff) > 40) {
        var imgs = JSON.parse(imgWrap.getAttribute('data-imgs'));
        var idx = parseInt(imgWrap.getAttribute('data-idx'));
        if (diff > 0 && idx < imgs.length - 1) idx++;
        else if (diff < 0 && idx > 0) idx--;
        imgWrap.setAttribute('data-idx', idx);
        imgWrap.querySelector('img').src = imgs[idx];
        var dots = imgWrap.querySelectorAll('.rv-card-dot');
        dots.forEach(function(d, i) { d.classList.toggle('active', i === idx); });
      }
    }, {passive: true});

    imgWrap.addEventListener('click', function() {
      var imgs = JSON.parse(imgWrap.getAttribute('data-imgs'));
      var idx = parseInt(imgWrap.getAttribute('data-idx'));
      idx = (idx + 1) % imgs.length;
      imgWrap.setAttribute('data-idx', idx);
      imgWrap.querySelector('img').src = imgs[idx];
      var dots = imgWrap.querySelectorAll('.rv-card-dot');
      dots.forEach(function(d, i) { d.classList.toggle('active', i === idx); });
    });

    return div;
  }

  function injectReviews() {
    var relatosSection = document.getElementById('relatos');
    if (relatosSection) relatosSection.style.display = 'none';

    var section = document.createElement('section');
    section.className = 'rv-section';
    section.id = 'avaliacoes-clientes';

    section.innerHTML =
      '<div class="rv-header">' +
        '<h2 class="rv-title">Quem já provou</h2>' +
        '<div class="rv-stars"><span class="rv-star">★</span><span class="rv-star">★</span><span class="rv-star">★</span><span class="rv-star">★</span><span class="rv-star">★</span></div>' +
        '<div class="rv-count">391 avaliações</div>' +
      '</div>';

    var grid = document.createElement('div');
    grid.className = 'rv-grid';

    REVIEWS.forEach(function(review, i) {
      grid.appendChild(createCard(review, i < 4));
    });

    section.appendChild(grid);

    var loadMore = document.createElement('button');
    loadMore.className = 'rv-load-more';
    loadMore.textContent = 'Carregar mais';
    loadMore.addEventListener('click', function() {
      var hidden = grid.querySelectorAll('[data-rv-card][style*="display: none"]');
      hidden.forEach(function(card) { card.style.display = ''; });
      loadMore.style.display = 'none';
    });
    section.appendChild(loadMore);

    var protocoloSection = document.getElementById('protocolo');
    if (protocoloSection && protocoloSection.nextElementSibling) {
      protocoloSection.parentElement.insertBefore(section, protocoloSection.nextElementSibling);
    } else {
      document.querySelector('main').appendChild(section);
    }
  }

  function injectFloatingVideo() {
    var widget = document.createElement('div');
    widget.className = 'fv-widget';
    widget.id = 'fv-widget';

    widget.innerHTML =
      '<div class="fv-bubble" id="fv-bubble">' +
        '<button class="fv-close" id="fv-close">✕</button>' +
        '<video muted loop playsinline autoplay preload="auto">' +
          '<source src="/video-flutuante.mp4" type="video/mp4">' +
        '</video>' +
      '</div>';

    var expanded = document.createElement('div');
    expanded.className = 'fv-expanded';
    expanded.id = 'fv-expanded';
    expanded.innerHTML =
      '<button class="fv-exp-close" id="fv-exp-close">✕</button>' +
      '<video controls playsinline preload="metadata">' +
        '<source src="/video-flutuante.mp4" type="video/mp4">' +
      '</video>';

    document.body.appendChild(widget);
    document.body.appendChild(expanded);

    var bubble = document.getElementById('fv-bubble');
    var bubbleVid = bubble.querySelector('video');
    var closeBtn = document.getElementById('fv-close');
    var expPanel = document.getElementById('fv-expanded');
    var expClose = document.getElementById('fv-exp-close');
    var expVid = expPanel.querySelector('video');

    bubbleVid.play().catch(function(){});

    bubble.addEventListener('click', function(e) {
      if (e.target === closeBtn || closeBtn.contains(e.target)) return;
      widget.style.display = 'none';
      expPanel.classList.add('show');
      expVid.currentTime = 0;
      expVid.play().catch(function(){});
    });

    closeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      widget.style.display = 'none';
    });

    expClose.addEventListener('click', function() {
      expPanel.classList.remove('show');
      expVid.pause();
      widget.style.display = 'flex';
    });
  }

  function waitForApp(cb) {
    var attempts = 0;
    var check = setInterval(function() {
      attempts++;
      var root = document.getElementById('root');
      if ((root && root.children.length > 0) || attempts > 50) {
        clearInterval(check);
        setTimeout(cb, 500);
      }
    }, 200);
  }

  var PRODUCT_IMGS = [
    "fotos-produto/01-26dbca1728fbc4e03117785095618554-1024-1024.webp",
    "fotos-produto/03-43bf76b9581d71c0c617786840465957-1024-1024.webp",
    "fotos-produto/br-11134207-81z1k-mfo4pt5kqxhh4cresize_w900_nl-1-5f3bad0710c166160217818939256582-1024-1024.webp",
    "fotos-produto/br-11134207-81z1k-mfo4pt5ksc1xe1resize_w900_nl-56c74c3b322c5b088817818939257587-1024-1024.webp",
    "fotos-produto/br-11134207-81z1k-mfo4pt5xe1hg87resize_w900_nl-7d01bed8440803c27f17818939257537-1024-1024.webp",
    "fotos-produto/br-11134207-81z1k-mgcvuf1960as06resize_w900_nl-2-1eeb86a9d1249c5cee17818939259930-1024-1024.webp"
  ];

  function injectProductCarousel() {
    var heroImg = document.querySelector('#topo img[alt*="Máscara"]') ||
                  document.querySelector('#topo img[alt*="Pote"]') ||
                  document.querySelector('#topo img');
    if (!heroImg) return;

    var container = heroImg.closest('div');
    if (!container) return;

    var wrap = document.createElement('div');
    wrap.className = 'pp-carousel';

    var mainImg = document.createElement('img');
    mainImg.className = 'pp-main-img';
    mainImg.src = heroImg.src;
    mainImg.alt = heroImg.alt || 'Produto';

    var allImgs = [heroImg.src].concat(PRODUCT_IMGS.map(function(p) { return '/' + p; }));
    var currentIdx = 0;

    var dotsRow = document.createElement('div');
    dotsRow.className = 'pp-dots';
    allImgs.forEach(function(_, i) {
      var dot = document.createElement('span');
      dot.className = 'pp-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', function(e) {
        e.stopPropagation();
        goTo(i);
      });
      dotsRow.appendChild(dot);
    });

    var prevBtn = document.createElement('button');
    prevBtn.className = 'pp-arrow pp-arrow-left';
    prevBtn.innerHTML = '‹';
    prevBtn.setAttribute('aria-label', 'Foto anterior');
    prevBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (currentIdx > 0) goTo(currentIdx - 1);
      else goTo(allImgs.length - 1);
    });

    var nextBtn = document.createElement('button');
    nextBtn.className = 'pp-arrow pp-arrow-right';
    nextBtn.innerHTML = '›';
    nextBtn.setAttribute('aria-label', 'Próxima foto');
    nextBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (currentIdx < allImgs.length - 1) goTo(currentIdx + 1);
      else goTo(0);
    });

    function goTo(idx) {
      currentIdx = idx;
      mainImg.src = allImgs[idx];
      var dots = dotsRow.querySelectorAll('.pp-dot');
      dots.forEach(function(d, i) { d.classList.toggle('active', i === idx); });
    }

    wrap.appendChild(mainImg);
    wrap.appendChild(prevBtn);
    wrap.appendChild(nextBtn);
    wrap.appendChild(dotsRow);

    container.innerHTML = '';
    container.appendChild(wrap);
  }

  function reorderCheckoutFields() {
    var style = document.createElement('style');
    style.textContent =
      '.space-y-4 { display: flex !important; flex-direction: column !important; }' +
      '.space-y-4 > * { margin-top: 16px !important; }' +
      '.space-y-4 > *:first-child { margin-top: 0 !important; }' +
      '.space-y-4 > .grid { display: contents !important; }' +
      '.space-y-4 > .grid > label { margin-top: 16px !important; }';
    document.head.appendChild(style);

    var observer = new MutationObserver(function() {
      var parent = document.querySelector('.space-y-4');
      if (!parent) return;

      var children = parent.children;
      for (var i = 0; i < children.length; i++) {
        var el = children[i];
        var text = el.textContent.toLowerCase();

        if (el.tagName === 'LABEL') {
          if (text.indexOf('nome') !== -1) el.style.order = '1';
          else if (text.indexOf('e-mail') !== -1 || text.indexOf('email') !== -1) el.style.order = '3';
          else if (text.indexOf('cpf') !== -1) el.style.order = '2';
          else if (text.indexOf('celular') !== -1 || text.indexOf('whatsapp') !== -1) el.style.order = '4';
        } else if (el.classList.contains('grid')) {
          var labels = el.querySelectorAll('label');
          for (var j = 0; j < labels.length; j++) {
            var lt = labels[j].textContent.toLowerCase();
            if (lt.indexOf('cpf') !== -1) labels[j].style.order = '2';
            else if (lt.indexOf('celular') !== -1 || lt.indexOf('whatsapp') !== -1) labels[j].style.order = '4';
          }
        }
      }

      var hasOrder = parent.querySelector('[style*="order"]');
      if (hasOrder) observer.disconnect();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(function() { observer.disconnect(); }, 20000);
  }

  waitForApp(function() {
    injectReviews();
    injectFloatingVideo();
    injectProductCarousel();
    reorderCheckoutFields();
  });
})();
