'use strict'

window.addEventListener('DOMContentLoaded', () => {
  // modals

  const modals = () => {
    let btnPressed;

    function bindModal(triggerSelector, modalSelector, closeSelector, destroy = false) {
      const trigger = document.querySelectorAll(triggerSelector),
        modal = document.querySelector(modalSelector),
        close = document.querySelector(closeSelector),
        windows = document.querySelectorAll('[data-modal]'),
        scroll = calcScroll();

      trigger.forEach(item => {
        item.addEventListener('click', (e) => {
          if (e.target) {
            e.preventDefault();
          }

          btnPressed = true;

          if (destroy) {
            item.remove();
          }

          windows.forEach(item => {
            item.style.display = "none";
            item.classList.add('animated', 'fadeIn');
          });

          modal.style.display = "block";
          document.body.style.overflow = "hidden";
          document.body.style.marginRight = `${scroll}px`;

        });
      });

      close.addEventListener('click', () => {
        windows.forEach(item => {
          item.style.display = "none";
        });

        modal.style.display = "none";
        document.body.style.overflow = "";
        document.body.style.marginRight = `0px`;
      });

      modal.addEventListener('click', (e) => {

        if (e.target === modal) {
          windows.forEach(item => {
            item.style.display = "none";
          });

          modal.style.display = "none";
          document.body.style.overflow = "";
          document.body.style.marginRight = `0px`;
        }
      });
    }

    function showModalByTime(selector, time) {
      setTimeout(function () {

        let display;

        document.querySelectorAll('[data-modal]').forEach(item => {
          if (getComputedStyle(item).display !== 'none') {
            display = 'block';
          }
        });

        if (!display) {
          document.querySelector(selector).style.display = 'block';
          document.body.style.overflow = "hidden";
          let scroll = calcScroll();
          document.body.style.marginRight = `${scroll}px`;
        }
      }, time);
    }

    function calcScroll() {
      let div = document.createElement('div');

      div.style.width = '50px';
      div.style.height = '50px';
      div.style.overflowY = 'scroll';
      div.style.visibility = 'hidden';

      document.body.appendChild(div);

      let scrollWidth = div.offsetWidth - div.clientWidth;
      div.remove();

      return scrollWidth;
    }

    function openByScroll(selector) {
      window.addEventListener('scroll', () => {

        let scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);

        if (!btnPressed && (window.pageYOffset + document.documentElement.clientHeight >= scrollHeight)) {
          document.querySelector(selector).click();
        }
      })
    }

    bindModal('.button-design', '.popup-design', '.popup-design .popup-close');
    bindModal('.button-consultation', '.popup-consultation', '.popup-consultation .popup-close');
    bindModal('.fixed-gift', '.popup-gift', '.popup-gift .popup-close', true);
    openByScroll('.fixed-gift');
    //showModalByTime('.popup-consultation', 60000);
  };

  // sliders

  const sliders = (slides, dir, prev, next) => {
    let slideIndex = 1,
      paused = false;
    const items = document.querySelectorAll(slides);

    function showSlides(n) {
      if (n > items.length) {
        slideIndex = 1;
      }

      if (n < 1) {
        slideIndex = items.length;
      }

      items.forEach(item => {
        item.classList.add('animated');
        item.style.display = 'none';
      });

      items[slideIndex - 1].style.display = 'block';
    }

    showSlides(slideIndex);

    function plusSlides(n) {
      showSlides(slideIndex += n);
    }

    try {
      const prevBtn = document.querySelector(prev),
        nextBtn = document.querySelector(next);

      prevBtn.addEventListener('click', () => {
        plusSlides(-1);
        items[slideIndex - 1].classList.remove('slideInLeft');
        items[slideIndex - 1].classList.add('slideInRight');
      });

      nextBtn.addEventListener('click', () => {
        plusSlides(1);
        items[slideIndex - 1].classList.remove('slideInRight');
        items[slideIndex - 1].classList.add('slideInLeft');
      });
    } catch (e) { }

    function activateAnimation() {
      if (dir === 'vertical') {
        paused = setInterval(function () {
          plusSlides(1);
          items[slideIndex - 1].classList.add('slideInDown');
        }, 3000);
      } else {
        paused = setInterval(function () {
          plusSlides(1);
          items[slideIndex - 1].classList.remove('slideInRight');
          items[slideIndex - 1].classList.add('slideInLeft');
        }, 3000);
      }
    }

    activateAnimation();

    items[0].parentNode.addEventListener('mouseenter', () => {
      clearInterval(paused);
    });

    items[0].parentNode.addEventListener('mouseleave', () => {
      activateAnimation();
    });
  };

  // Forms

  const forms = () => {
    const form = document.querySelectorAll('form'),
      inputs = document.querySelectorAll('input'),
      upload = document.querySelectorAll('[name="upload"]');

    const message = {
      loading: 'Загрузка...',
      success: 'Спасибо! Мы скоро свяжемся с Вами',
      failure: 'Что-то пошло не так...',
      spinner: 'assets/img/spinner.gif',
      ok: 'assets/img/ok.png',
      fail: 'assets/img/fail.png'
    };

    const path = {
      designer: 'assets/server.php',
      question: 'assets/question.php'
    };

    const postData = async (url, data) => {
      let res = await fetch(url, {
        method: 'POST',
        body: data
      });

      return await res.text();
    };

    const clearInputs = () => {
      inputs.forEach(item => {
        item.value = '';
      });
      upload.forEach(item => {
        item.previousElementSibling.textContent = 'Файл не выбран';
      })
    };

    upload.forEach(item => {
      item.addEventListener('input', () => {
        let dots;
        const arr = item.files[0].name.split('.');

        arr[0].length > 6 ? dots = '...' : dots = '.';
        const name = arr[0].substring(0, 6) + dots + arr[1];
        item.previousElementSibling.textContent = name;
      });
    });

    form.forEach(item => {
      item.addEventListener('submit', (e) => {
        e.preventDefault();


        let statusMessage = document.createElement('div');
        statusMessage.classList.add('status');
        item.parentNode.appendChild(statusMessage);

        item.classList.add('animated', 'fadeOutUp');
        setTimeout(() => {
          item.style.display = 'none';
        }, 400);

        let statusImg = document.createElement('img');
        statusImg.setAttribute('src', message.spinner);
        statusImg.classList.add('animated', 'fadeInUp');
        statusMessage.appendChild(statusImg);

        let textMessage = document.createElement('div');
        textMessage.textContent = message.loading;
        statusMessage.appendChild(textMessage);

        const formData = new FormData(item);
        let api;
        item.closest('.popup-design') || item.classList.contains('calc_form') ? api = path.designer : path.question;

        postData(api, formData)
          .then(res => {
            console.log(res);
            statusImg.setAttribute('src', message.ok);
            textMessage.textContent = message.success;
          })
          .catch(() => {
            statusImg.setAttribute('src', message.fail);
            textMessage.textContent = message.failure;
          })
          .finally(() => {
            clearInputs();
            setTimeout(() => {
              statusMessage.remove();
              item.style.display = 'block';
              item.classList.remove('fadeOutUp');
              item.classList.add('fadeInUp');
            }, 5000);
          });


      });
    });
  };

  // Mask

  const mask = (selector) => {

    let setCursorPosition = (pos, elem) => {
      elem.focus();

      if (elem.setSelectionRange) {
        elem.setSelectionRange(pos, pos);
      } else if (elem.createTextRange) {
        let range = elem.createTextRange();

        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
      }
    };

    function createMask(event) {
      let matrix = '+7 (___) ___ __ __',
        i = 0,
        def = matrix.replace(/\D/g, ''),
        val = this.value.replace(/\D/g, '');

      if (def.length >= val.length) {
        val = def;
      }

      this.value = matrix.replace(/./g, function (a) {
        return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? '' : a;
      });

      if (event.type == 'blur') {
        if (this.value.length == 2) {
          this.value = '';
        }
      } else {
        setCursorPosition(this.value.length, this);
      }
    }

    let inputs = document.querySelectorAll(selector);

    inputs.forEach(input => {
      input.addEventListener('input', createMask);
      input.addEventListener('focus', createMask);
      input.addEventListener('blur', createMask);
    });
  };

  //checkTestInputs

  const checkTestInputs = (selector) => {
    const txtInputs = document.querySelectorAll(selector);

    txtInputs.forEach(input => {
      input.addEventListener('keypress', function (e) {
        if (e.key.match(/[^а-яё 0-9]/ig)) {
          e.preventDefault();
        }
      });
    });
  };

  // showMoreStyles

  const showMoreStyles = (trigger, wrapper) => {
    const btn = document.querySelector(trigger);


    // const cards = document.querySelectorAll(styles);
    // cards.forEach(card => {
    //   card.classList.add('animated', 'fadeInUp');
    // });

    // btn.addEventListener('click', () => {
    //   cards.forEach(card => {
    //     card.classList.remove('hidden-lg', 'hidden-md', 'hidden-xs');
    //     card.classList.add('col-sm-3', 'col-sm-offset-0', 'col-xs-10', 'col-xs-offset-1');
    //   });
    //   // btn.style.display = 'none';
    //   btn.remove();
    // });

    const getResource = async (url) => {
      let res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Could not fetch ${url}, status: ${res.status}`);
      }

      return await res.json();
    };

    btn.addEventListener('click', function () {
      getResource('assets/db.json')
        .then(res => createCards(res.styles))
        .catch(error => console.log(error));

      this.remove();
    });

    function createCards(response) {
      response.forEach(({ src, title, link }) => {
        let card = document.createElement('div');

        card.classList.add('col-sm-3', 'col-sm-offset-0', 'col-xs-10', 'col-xs-offset-1', 'animated', 'fadeInUp');

        card.innerHTML = `
          <div class='styles-block'>
            <img src=${src} alt='style'>
            <h4>${title}</h4>
            <a href=${link}>Подробнее</a>
          </div>
        `;

        document.querySelector(wrapper).appendChild(card);
      });
    };
  };

  //Calculator

  const calc = (size, material, options, promocode, result) => {
    const sizeBlock = document.querySelector(size),
      materialBlock = document.querySelector(material),
      optionsBlock = document.querySelector(options),
      promocodeBlock = document.querySelector(promocode),
      resultBlock = document.querySelector(result);

    let sum = 0;

    const calcFunction = () => {
      sum = Math.round((+sizeBlock.value) * (+materialBlock.value) + (+optionsBlock.value));

      if (sizeBlock.value == '' || materialBlock.value == '') {
        resultBlock.textContent = 'Пожалуйста выберите размер и материал картины';
      } else if (promocodeBlock.value === 'IWANTPOPART') {
        resultBlock.textContent = Math.round(sum * 0.7);
      } else {
        resultBlock.textContent = sum;
      }
    };

    sizeBlock.addEventListener('change', calcFunction);
    materialBlock.addEventListener('change', calcFunction);
    optionsBlock.addEventListener('change', calcFunction);
    promocodeBlock.addEventListener('input', calcFunction);
  };


  //filter

  const filter = () => {
    const menu = document.querySelector('.portfolio-menu'),
      items = menu.querySelectorAll('li'),
      btnAll = menu.querySelector('.all'),
      btnLovers = menu.querySelector('.lovers'),
      btnChef = menu.querySelector('.chef'),
      btnGirl = menu.querySelector('.girl'),
      btnGuy = menu.querySelector('.guy'),
      btnGrandmother = menu.querySelector('.grandmother'),
      btnGranddad = menu.querySelector('.granddad'),
      wrapper = document.querySelector('.portfolio-wrapper'),
      markAll = wrapper.querySelectorAll('.all'),
      markGirl = wrapper.querySelectorAll('.girl'),
      markLovers = wrapper.querySelectorAll('.lovers'),
      markChef = wrapper.querySelectorAll('.chef'),
      markGuy = wrapper.querySelectorAll('.guy'),
      no = document.querySelector('.portfolio-no');

    const typeFilter = (markType) => {
      markAll.forEach(mark => {
        mark.style.display = 'none';
        mark.classList.remove('animated', 'fadeIn');
      });

      no.style.display = 'none';
      no.classList.remove('animated', 'fadeIn');

      if (markType) {
        markType.forEach(mark => {
          mark.style.display = 'block';
          mark.classList.add('animated', 'fadeIn');
        });
      } else {
        no.style.display = 'block';
        no.classList.add('animated', 'fadeIn');
      }
    };

    btnAll.addEventListener('click', () => {
      typeFilter(markAll);
    });

    btnLovers.addEventListener('click', () => {
      typeFilter(markLovers);
    });

    btnChef.addEventListener('click', () => {
      typeFilter(markChef);
    });

    btnGuy.addEventListener('click', () => {
      typeFilter(markGuy);
    });

    btnGirl.addEventListener('click', () => {
      typeFilter(markGirl);
    });

    btnGrandmother.addEventListener('click', () => {
      typeFilter();
    });

    btnGranddad.addEventListener('click', () => {
      typeFilter();
    });

    menu.addEventListener('click', (e) => {
      let target = e.target;

      if (target && target.tagName == 'LI') {
        items.forEach(btn => {
          btn.classList.remove('active');
        })
        target.classList.add('active');
      }
    });
  };

  // pitureSize

  const pictureSize = (imgSelector) => {
    const blocks = document.querySelectorAll(imgSelector);

    function showImg (block) {
      const img = block.querySelector('img');
      img.src = img.src.slice(0, -4) + '-1.png';
      block.querySelectorAll('p:not(.sizes-hit)').forEach(p => {
        p.style.display = 'none';
      });
    }

    function hideImg (block) {
      const img = block.querySelector('img');
      img.src = img.src.slice(0, -6) + '.png';
      block.querySelectorAll('p:not(.sizes-hit)').forEach(p => {
        p.style.display = 'block';
      });
    }

    blocks.forEach(block => {
      block.addEventListener('mouseover', () => {
        showImg(block);
      });
      block.addEventListener('mouseout', () => {
        hideImg(block);
      });
    });
  };

  // Accordion

  const accordion = (triggersSelector, itemsSelector) => {
    const buttons = document.querySelectorAll(triggersSelector),
          blocks = document.querySelectorAll(itemsSelector);

    blocks.forEach(block => {
      block.classList.add('animated', 'fadeInDown')
    });

    buttons.forEach(button => {
      button.addEventListener('click', function() {
        if (!this.classList.contains('active')) {
          buttons.forEach(button => {
            button.classList.remove('active', 'active-style');
          });
          this.classList.add('active', 'active-style');
        }
      });
    });
  };

  modals();
  sliders('.feedback-slider-item', 'horizontal', '.main-prev-btn', '.main-next-btn');
  sliders('.main-slider-item', 'vertical');
  forms();
  mask('[name="phone"]');
  checkTestInputs('[name="name"]');
  checkTestInputs('[name="message"]');
  showMoreStyles('.button-styles', '#styles .row');
  calc('#size', '#material', '#options', '.promocode', '.calc-price');
  filter();
  pictureSize('.sizes-block');
  accordion('.accordion-heading', '.accordion-block');
});

