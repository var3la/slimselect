var Galeria = (function () {
  function G(param) {
    if (
      typeof param != 'object' ||
      typeof param.o == 'undefined' ||
      !Array.isArray(param.photos) ||
      param.photos.length < 1
    ) return false;

    var dParam = {
      //o         : Object, //----------------obligatorio
      type: 'opacity', //carrusel, carruselMargin
      infinity: !0, //false
      //photos    : [], //----------------obligatorio que sea Array con minimo 1
      callback: !!0,//function 
      automatic: !!0, //false
      act: 0,
      time: 5e3,
      buttons: !0,
      dedo: !0,
      cursor: !!0,
      aniTime: 500,
      template: !!0,
      tradus: !!0
    };
    param = hotusa().controlDefecto(dParam, param);
    param.dedo = $('html').hasClass('sf5') ? false : param.dedo;

    var that = this;
    that.$o = $(param.o);
    that.name = "galeria2-eh";
    that.t = param.type;
    that.infinity = param.infinity;
    that.photos = param.photos.slice();//clonar array
    that.photos = [];
    for (var i = 0; i < param.photos.length; i++) {
      var _t = {
        src: param.photos[i]
      };
      that.photos.push(_t);
    };
    that.callback = param.callback;
    that.automatic = param.automatic;
    that.controlAuto = null;
    that.act = param.act;
    that.time = param.time;
    that.aniTime = param.aniTime;
    that.buttons = param.buttons;
    that.dedo = param.dedo;
    that.cursor = param.cursor;
    that.load = !!0;
    that.$tpl = (function () {
      if (param.template) {
        var _p = $(param.template).clone().addClass('sta-' + that.name + '_p');

        if (!$('<div></div>').append(_p).find('.sta-' + that.name + '_image').length) _p.addClass('sta-' + that.name + '_image');
      };

      switch (that.t) {
        case 'opacity':
          that.$cont = that.$o;
          return param.template ? _p.hide() : $('<div></div>', {
            "class": "sta-" + that.name + "_p sta-" + that.name + "_image"
          }).hide();
          break;
        case 'carrusel':
          that.$cont = that.$o;
          return param.template ? _p.css('left', '100%') : $('<div></div>', {
            "class": "sta-" + that.name + "_p sta-" + that.name + "_image"
          }).css('left', '100%');
          break;
        case 'carruselMargin':
          that.$cont = $('<div></div>', { 'class': 'sta-' + that.name + '_o' }).appendTo(that.$o);
          return param.template ? _p : $('<div></div>', {
            "class": "sta-" + that.name + "_p sta-" + that.name + "_image"
          });

        default:
          break;
      };
    })();
    that.orderCarrusel = !!0;
    that.tradus = param.tradus && Array.isArray(param.tradus) && param.tradus.length == param.photos.length ? param.tradus.slice() : false;

    that.cargaInicial();

    if (that.buttons && that.photos.length > 1) that.generarButtons();
  };
  G.prototype.interval = function () {
    var _t = this;
    if (_t.automatic) {
      clearInterval(_t.controlAuto);
      switch (_t.t) {
        case 'opacity':
          _t.controlAuto = setInterval(function () {

            if (_t.plus()) {
              _t.cargaOpacidad();
            } else {
              clearInterval(_t.controlAuto);
            };
          }, _t.time);
          break;
        case 'carrusel':
          _t.controlAuto = setInterval(function () {
            if (_t.plus()) {
              _t.cargaCarrusel();
            } else {
              clearInterval(_t.controlAuto);
            };
          }, _t.time);
          break;
        case 'carruselMargin':
          _t.controlAuto = setInterval(function () {

            if (_t.load) {
              _t.load = !!0;
              if (_t.plus()) {
                _t.cargaCarruselMargin();
              } else {
                clearInterval(_t.controlAuto);
              };
            };

          }, _t.time);
          break;

        default:
          break;
      };
    };
  };
  G.prototype.removePhoto = function (src) {
    var _t = this,
      _p = _t.photos,
      _n = _p.findIndex(function (e) { return e.src == src });

    _p.splice(_n, 1);
    if (_t.tradus) _t.tradus.splice(_n, 1);

    if (_p.length > 0) {
      return !0
    } else {
      console.trace("Imagenes insuficientes");
      return !!0;
    };
  };
  G.prototype.less = function () {
    var _t = this;

    if (_t.buttons && !_t.infinity) {
      _t.$bR.removeClass('sta-fin');

      _t.act < 2 ?
        _t.$bL.addClass('sta-fin') :
        _t.$bL.removeClass('sta-fin');
    };

    if (_t.act > 0) {
      _t.act--;
      return !0;
    } else if (_t.infinity) {
      _t.act = _t.photos.length - 1;
      return !0;
    };
    return !!0;
  };
  G.prototype.plus = function () {
    var _t = this;

    if (_t.buttons && !_t.infinity) {
      _t.$bL.removeClass('sta-fin');

      _t.act > _t.photos.length - 3 ?
        _t.$bR.addClass('sta-fin') :
        _t.$bR.removeClass('sta-fin');
    };

    if (_t.act < _t.photos.length - 1) {
      _t.act++;
      return !0;
    } else if (_t.infinity) {
      _t.act = 0;
      return !0;
    };
    return !!0;
  };
  G.prototype.cargaInicial = function () {
    var _t = this,
      _elem = _t.photos[_t.act],
      img = new Image();

    _t.$o.addClass('tpl-' + _t.name);
    if (_t.t == 'carruselMargin') _t.$o.addClass('v2');

    img.src = _elem.src;
    img.onload = function () {
      var _src = this.src;

      _elem.$tpl = _t.remplace(_t.t == 'carrusel' ? _t.$tpl.clone().css('left', '0') : _t.$tpl.clone().show(), _src);

      _t.$cont.append(_elem.$tpl);

      _t.load = !0;

      if (_t.callback) _t.callback(_src);
      if (_t.photos.length > 1) _t.interval();
    };
    img.onerror = function () {
      if (_t.removePhoto(this.src)) _t.cargaInicial();
    };
  };
  G.prototype.cargaOpacidad = function () {
    var _t = this,
      _elem = _t.photos[_t.act];

    if (_elem.$tpl) {
      var h = $('.sta-' + _t.name + '_p', _t.$cont),
        c = _elem.$tpl.clone().hide();

      _t.$cont.append(c);
      c.fadeIn(_t.aniTime, function () {
        h.remove();
      });

      if (_t.callback) _t.callback(_elem.src);
    }
    else {
      var img = new Image();

      img.src = _elem.src;

      img.onload = function () {
        var _src = this.src,
          h = $('.sta-' + _t.name + '_p', _t.$cont);

        _elem.$tpl = _t.remplace(_t.$tpl.clone(), _src);

        _t.$cont.append(_elem.$tpl);
        _elem.$tpl.fadeIn(_t.aniTime, function () {
          h.remove();
        });

        if (_t.callback) _t.callback(_src);
      };
      img.onerror = function () {
        if (_t.removePhoto(this.src)) _t.cargaOpacidad();
      };
    };
  };
  G.prototype.cargaCarrusel = function () {
    var _t = this,
      _elem = _t.photos[_t.act];

    if (_elem.$tpl) {
      var h = $('.sta-' + _t.name + '_p', _t.$cont);

      _t.cargaCarruselAni(h, _elem);

      if (_t.callback) _t.callback(_elem.src);
    }
    else {
      var img = new Image();

      img.src = _elem.src;

      img.onload = function () {
        var _src = this.src,
          h = $('.sta-' + _t.name + '_p', _t.$cont);

        _elem.$tpl = _t.remplace(_t.$tpl.clone(), _src);

        _t.cargaCarruselAni(h, _elem);
      };
      img.onerror = function () {
        if (_t.removePhoto(this.src)) _t.cargaCarrusel();
      };
    };

  };
  G.prototype.cargaCarruselAni = function (h, e) {
    var _t = this,
      c = e.$tpl.clone(),
      _m1 = _t.orderCarrusel ? '' : '-',
      _m2 = _t.orderCarrusel ? '-' : '';

    c.css('left', _m1 + '100%')
    _t.$cont.append(c);
    h.animate({ 'left': _m2 + '100%' }, _t.aniTime);

    c.animate({ 'left': 0 }, _t.aniTime, function () {
      h.remove();
    });

    if (_t.callback) _t.callback(e.src);
  };
  G.prototype.cargaCarruselMargin = function () {
    var _t = this,
      _elem = _t.photos[_t.act];

    if (_elem.$tpl) {

      _t.cargaCarruselMarginAni(_elem, $('.sta-' + _t.name + '_p', _t.$cont), _t.$o.innerHeight());

    }
    else {
      var img = new Image();

      img.src = _elem.src;

      img.onload = function () {
        var _src = this.src;

        _elem.$tpl = _t.remplace(_t.$tpl.clone(), _src);

        _t.cargaCarruselMarginAni(_elem, $('.sta-' + _t.name + '_p', _t.$cont), _t.$o.innerHeight());

      };

      img.onerror = function () {
        if (_t.removePhoto(this.src)) _t.cargaCarruselMargin();
      };

    };
  };
  G.prototype.cargaCarruselMarginAni = function (j, rem, oldH) {
    var _t = this,
      _nHeight = 0;

    if (_t.orderCarrusel) {

      _t.$cont.css('margin-left', '-100%');
      _nHeight = j.$tpl.prependTo(_t.$cont).innerHeight();

      j.$tpl.css('height', oldH + 'px');

      //movimiento horizontal
      _t.$cont.animate({ 'margin-left': '0' }, _t.aniTime, function () {
        _t.$cont.css('margin-left', '');
      });

    }
    else {

      _nHeight = j.$tpl.appendTo(_t.$cont).innerHeight();

      j.$tpl.css('height', oldH + 'px');

      //movimiento horizontal
      _t.$cont.animate({ 'margin-left': '-100%' }, _t.aniTime, function () {
        _t.$cont.css('margin-left', '');
      });
    };

    //altura del que entra
    j.$tpl.animate({ 'height': _nHeight + 'px' }, _t.aniTime, function () {
      j.$tpl.css('height', '');
    });
    //altura del que se va
    rem.animate({ 'height': _nHeight + 'px' }, _t.aniTime, function () {
      _t.load = !0;
      rem.css('height', '')
      rem.remove();
    });

    if (_t.callback) _t.callback(j.src);
  };
  G.prototype.generarButtons = function () {
    var _t = this;
    _t.$bL = $('<button></button>', {
      'class': 'sta-' + _t.name + '_bL'
    }).appendTo(_t.$o);
    _t.$bR = $('<button></button>', {
      'class': 'sta-' + _t.name + '_bR'
    }).appendTo(_t.$o);

    if (!_t.infinity) _t.$bL.addClass('sta-fin');

    function _l() {
      _t.interval();
      if (_t.load && _t.plus()) {
        switch (_t.t) {
          case 'opacity':
            _t.cargaOpacidad();
            break;
          case 'carrusel':
            _t.orderCarrusel = !!0;
            _t.cargaCarrusel();
            break;
          case 'carruselMargin':
            _t.load = !!0;
            _t.orderCarrusel = !!0;
            _t.cargaCarruselMargin();
            break;

          default:
            break;
        };
      };
    };
    function _r() {
      _t.interval();
      if (_t.load && _t.less()) {
        switch (_t.t) {
          case 'opacity':
            _t.cargaOpacidad();
            break;
          case 'carrusel':
            _t.orderCarrusel = !0;
            _t.cargaCarrusel();
            break;
          case 'carruselMargin':
            if (_t.load) {
              _t.load = !!0;
              _t.orderCarrusel = !0;
              _t.cargaCarruselMargin();
            };
            break;

          default:
            break;
        };
      };
    };

    _t.$bL.click(_l);
    _t.$bR.click(_r);

    if (_t.dedo) {
      _t.$o.on('swipeleft', _l);
      _t.$o.on('swiperight', _r);
    };

    if (_t.cursor) {
      $(document).keydown(function (t) {
        if (t.keyCode == 37 || t.keyCode == 39) {
          var _top = _t.$o.offset().top,
            _hei = _t.$o.innerHeight(),
            _wTop = $(window).scrollTop(),
            _wHei = $(window).innerHeight();
          if (
            _top + (_hei * 2 / 3) > _wTop &&
            _wTop + _wHei > _top + _hei - (_hei * 2 / 3)
          ) {
            switch (t.keyCode) {
              case 37:
                _l();
                break;
              case 39:
                _r();
                break;
            };
          };
        };
      });
    };
  };
  G.prototype.remplace = function (obj, url) {
    var _t = this,
      _a = $('<div></div>').append(obj);
    _a.find('.sta-' + _t.name + '_image').css("background-image", "url(" + url + ")")
    var _p = _a.html();

    if (_t.tradus) $.each(_t.tradus[_t.act], function (i, e) { _p = _p.replace(new RegExp('{' + i + '}', "g"), e); });

    return $(_p);
  };
  return G;
})();

/** 
 * booking area
 */
((buscador) => {
  if (!buscador.length) return false;
  new SlimSelect({
    select: '#evento',
    settings: {
      placeholderText: 'Selecciona un tipo de evento'
    }
  })
  new SlimSelect({
    select: '#disposicion',
    settings: {
      placeholderText: 'Selecciona una sala'
    }
  })
  // Inicializar SlimSelect
  const select = new SlimSelect({
    select: '#hotel_destino',
    settings: {
      placeholderText: 'Selecciona un hotel',
      searchPlaceholder: 'Buscar por hotel o ciudad...',
      searchFilter: (option, search) => {
        const searchLower = search.toLowerCase()
        const hotelNombre = (option.text || '').toLowerCase()
        const ciudad = (option.data?.city || '').toLowerCase()
        const codigo = (option.data?.codigo || '').toLowerCase()
        
        // Busca en nombre de hotel, ciudad y código
        return hotelNombre.includes(searchLower) || 
              ciudad.includes(searchLower) || 
              codigo.includes(searchLower)
      }
    }
  })
      const buttons = document.querySelectorAll('.tpl-buttonSearchME-eh_buscador');

      buttons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          const modalMobile = document.querySelector('.tpl-buscadorME-eh.mobile');
          if (modalMobile && modalMobile.classList.contains('openModal')) {
            modalMobile.classList.remove('openModal');
          }

          const input = document.getElementById('hotel_destino');
          if (!input) return;

          const hotelData = input.dataset.hotelData;

          if (hotelData) {
            const selectedHotel = JSON.parse(hotelData);
            search.renderResults([selectedHotel], '.sta-resultsModuleME-eh_max');
          } else {
            const query = utils.normalize(input.value);
            const lang = utils.language();
            const filtered = data.filter(hotel =>
              utils.normalize(hotel.HotelName).includes(query) ||
              utils.normalize(hotel.HotelCity[lang]?.name || hotel.HotelCity['es']?.name || hotel.HotelCity[Object.keys(hotel.HotelCity)[0]]?.name || '').includes(query)

            );

            if (filtered.length === 0) {
              utils.showNotification('No se encontraron resultados', 'warning');
            }

            search.renderResults(filtered, '.sta-resultsModuleME-eh_max');
          }
        });
      });
    },

    // Mostrar resultados
    renderResults (hoteles, containerSelector) {
      const container = document.querySelector(containerSelector);
      if (!container) return;

      // limpiar resultados previos
      if (globalScrollHandler) {
        window.removeEventListener('scroll', globalScrollHandler);
        globalScrollHandler = null;
      }

      container.innerHTML = '';

      if (!hoteles || hoteles.length === 0) {
        const lang = utils.language();
        const tradu_noResults = {
          "es": "No se encontraron hoteles con esos criterios de búsqueda",
          "en": "No hotels found with those search criteria",
          "it": "Nessun hotel trovato con quei criteri di ricerca",
          "fr": "Aucun hôtel trouvé avec ces critères de recherche",
          "de": "Keine Hotels mit diesen Suchkriterien gefunden",
          "pt": "Nenhum hotel encontrado com esses critérios de pesquisa",
          "ru": "Отели с такими критериями поиска не найдены",
          "nl": "Geen hotels gevonden met die zoekcriteria"
        };

        container.innerHTML = `
          <div class="no-results">
            <p>${tradu_noResults[lang] || tradu_noResults["es"]}</p>
          </div>
        `;
        return;
      }

      // reiniciar variables globales
      globalCurrentPage = 0;
      globalIsLoading = false;
      globalAllItemsLoaded = false;
      globalHoteles = hoteles;
      globalContainer = container;

      const itemsPerPage = 9;
      const totalPages = Math.ceil(hoteles.length / itemsPerPage);
      const lang = utils.language();

      const tradu_seeHotel = {
        "es": "Ver Hotel",
        "en": "View Hotel",
        "it": "Visualizza hotel",
        "fr": "Voir l'hôtel",
        "de": "Hotel anzeigen",
        "pt": "Ver hotel",
        "ru": "Посмотреть отель",
        "nl": "Bekijk hotel"
      };

      const tradu_select = {
        "es": "SELECCIONAR",
        "en": "SELECT",
        "it": "SELEZIONARE",
        "fr": "SÉLECTIONNER",
        "de": "AUSWÄHLEN",
        "pt": "SELECIONAR",
        "ru": "ВЫБРАТЬ",
        "nl": "SELECTEREN"
      };

      const tradu_salones = {
        "es": "Salones",
        "en": "Halls",
        "it": "Sale",
        "fr": "Salles",
        "de": "Säle",
        "pt": "Salões",
        "ru": "Залы",
        "nl": "Zalen"
      };

      const loadMoreItems = () => {
        if (globalIsLoading || globalAllItemsLoaded) return;

        globalIsLoading = true;

        const start = globalCurrentPage * itemsPerPage;
        const end = start + itemsPerPage;
        const pageItems = globalHoteles.slice(start, end);

        if (pageItems.length === 0) {
          globalAllItemsLoaded = true;
          globalIsLoading = false;
          return;
        }

        const moduleDeleted = document.querySelector('.tpl-boxesME-eh');

        pageItems.forEach(hotel => {
          const div = document.createElement('div');
          div.className = 'sta-resultsModuleME-eh';
          div.setAttribute('data-hotel', JSON.stringify(hotel));
          div.innerHTML = `
            <div class="sta-resultsModuleME-eh_photo">
              <img src="https://${utils.getFirstValidImage(hotel)}" 
                alt="${hotel.HotelName}">
              <div class="sta-resultsModuleME-eh_total">
                ${Object.keys(hotel.Salones).filter(key => !isNaN(key)).length} ${tradu_salones[lang] || tradu_salones["es"]}
              </div>
            </div>
            <div class="sta-resultsModuleME-eh_text">${hotel.HotelName}</div>
            <div class="sta-resultsModuleME-eh_text_dir">${hotel.HotelAddress}, ${hotel.HotelCity[lang]?.name || hotel.HotelCity['es']?.name || hotel.HotelCity[Object.keys(hotel.HotelCity)[0]]?.name || ''}</div>
            <div class="sta-resultsModuleME-eh_contButton">
              <div class="sta-resultsModuleME-eh_link">
                <a href="${utils.slugify(hotel.HotelName)}" target="_blank" rel="noopener noreferrer">${tradu_seeHotel[lang] || tradu_seeHotel["es"]}</a>
              </div>
              <button class="sta-resultsModuleME-eh_selection">${tradu_select[lang] || tradu_select["es"]}</button>
            </div>
          `;
          globalContainer.appendChild(div);
        });

        if (moduleDeleted) {
          moduleDeleted.remove();
        }

        globalCurrentPage++;
        globalIsLoading = false;

        if (globalCurrentPage >= totalPages) {
          globalAllItemsLoaded = true;
        }
      };

      const handleScroll = () => {
        if (globalIsLoading || globalAllItemsLoaded) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        if (scrollTop + windowHeight >= documentHeight - 200) {
          loadMoreItems();
        }
      };

      const moduleDeleted = document.querySelector('.tpl-boxesME-eh');
      if (moduleDeleted) {
        moduleDeleted.remove();
      }

      globalScrollHandler = handleScroll;
      window.addEventListener('scroll', globalScrollHandler);

      loadMoreItems();

      eventHandlers.openForm();
    }
  
  // Función para cargar datos desde la API
  async function cargarDatosAPI() {
    try {
      // Mostrar estado de carga
      select.setData([{
        text: 'Cargando...',
        value: '',
        disabled: true
      }])

      const response = await fetch('https://synergy.booking-channel.com/api/cms/hotels_with_meeting_rooms')
      const datos = await response.json()
      console.log('Datos recibidos:', datos)
      
      // Agrupar hoteles por ciudad
      const hotelesAgrupados = datos.reduce((acc, hotel) => {
        const ciudadNombre = hotel.HotelCity.es.name
        if (!acc[ciudadNombre]) {
          acc[ciudadNombre] = []
        }
        acc[ciudadNombre].push(hotel)
        return acc
      }, {})
      
      // Convertir a formato SlimSelect con grupos
      const opciones = Object.keys(hotelesAgrupados).sort().map(ciudad => ({
        label: ciudad, // Nombre del grupo (ciudad)
        options: hotelesAgrupados[ciudad].map(hotel => ({
          text: `${hotel.HotelName} - ${ciudad}`,
          value: hotel.HotelId,
          data: {
            codigo: hotel.HotelCode,
            city: ciudad,
            hotelNombre: hotel.HotelName
          }
        }))
      }))
      
      // Cargar las opciones en el select
      select.setData(opciones)
      
    } catch (error) {
      console.error('Error al cargar datos:', error)
      select.setData([{
        text: 'Error al cargar datos',
        value: '',
        disabled: true
      }])
    }
  }

  // Cargar datos al iniciar
  cargarDatosAPI()

})(document.querySelectorAll('.tpl-buscadorME-eh'));
