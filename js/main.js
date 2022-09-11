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

  modals();
  sliders('.feedback-slider-item', 'horizontal', '.main-prev-btn', '.main-next-btn');
  sliders('.main-slider-item', 'vertical');


});

