import Swiper from "swiper";
import { A11y, Autoplay, Keyboard, Navigation, Pagination } from "swiper/modules";

import { ComponentType, ComponentInstance } from "../../lib/component.js";
import currentlyInCanvasEditor from "../../lib/currentlyInCanvasEditor.js";

class SwiperCarousel extends ComponentInstance {
  init() {
    if (currentlyInCanvasEditor()) {
      return;
    }

    this.wrapper = this.el.querySelector(".swiper-wrapper");

    if (!this.wrapper) {
      return;
    }

    this.slides = Array.from(this.wrapper.children);
    this.slides.forEach((slide) => slide.classList.add("swiper-slide"));

    if (!this.slides.length) {
      return;
    }

    const autoplayEnabled = this.el.dataset.autoplay === "true";
    const navigationEnabled = this.el.dataset.showNavigation === "true";
    const paginationEnabled = this.el.dataset.showPagination === "true";

    this.swiper = new Swiper(this.el, {
      modules: [A11y, Autoplay, Keyboard, Navigation, Pagination],
      a11y: {
        enabled: true,
      },
      autoplay: autoplayEnabled
        ? {
            delay: this.#numberSetting("autoplayDelay", 5000),
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }
        : false,
      breakpoints: {
        640: {
          slidesPerView: this.#numberSetting("slidesTablet", 2),
        },
        1024: {
          slidesPerView: this.#numberSetting("slidesDesktop", 3),
        },
      },
      keyboard: {
        enabled: true,
      },
      loop: this.el.dataset.loop === "true" && this.slides.length > 1,
      navigation: navigationEnabled
        ? {
            nextEl: this.el.querySelector(".swiper-button-next"),
            prevEl: this.el.querySelector(".swiper-button-prev"),
          }
        : false,
      pagination: paginationEnabled
        ? {
            clickable: true,
            el: this.el.querySelector(".swiper-pagination"),
          }
        : false,
      slidesPerView: this.#numberSetting("slidesMobile", 1),
      spaceBetween: this.#numberSetting("spaceBetween", 24),
      watchOverflow: true,
    });
  }

  remove() {
    if (this.swiper) {
      this.swiper.destroy(true, true);
      this.swiper = undefined;
    }

    this.slides?.forEach((slide) => slide.classList.remove("swiper-slide"));
  }

  #numberSetting(name, fallback) {
    const value = Number.parseInt(this.el.dataset[name], 10);
    return Number.isNaN(value) ? fallback : value;
  }
}

new ComponentType(SwiperCarousel, "swiperCarousel", ".swiper-carousel");