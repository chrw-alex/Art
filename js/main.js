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

    function activateAnimation () {
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

  // const checkNumInputs = (selector) => {
  //   const numInputs = document.querySelectorAll(selector);
  //   numInputs.forEach(item => {
  //     item.addEventListener('input', () => {
  //       item.value = item.value.replace(/\D/, '');
  //     });
  //   });
  // };
  
  const forms = () => {
    const form = document.querySelectorAll('form'),
          inputs = document.querySelectorAll('input'),
          upload = document.querySelectorAll('[name="upload"]');
  
    // checkNumInputs('input[name = "user_phone"]');
  
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

  modals();
  sliders('.feedback-slider-item', 'horizontal', '.main-prev-btn', '.main-next-btn');
  sliders('.main-slider-item', 'vertical');
  forms();


});

