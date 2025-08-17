app.component('gallery', {
    data() {
        let images = [];
        let slides = [];
        let thslides = [];
        this.$slots.default()[0].children.trim().split(/\r?\n|\r/).forEach(elm => {
            let img = (new URL(elm.trim(), document.baseURI)).href;
            thslides.push('<div class="swiper-slide"><img src="' + img + '"></div>');
            slides.push('<div class="swiper-slide" style="background-image: url(\'' + img + '\')"><img src="' + img + '"></div>');
            images.push(img);
        });
        return {
            hash: cyrb53(images.join('')),
            thslides: thslides.join(''),
            slides: slides.join(''),
            images: images,
            swiper: null,
            thumbs: null,
            modal: null,
            show: false
        }
    },
    created() {
        this.$nextTick(() => {
            document.addEventListener('keydown', this.hotkeys);
            this.modal = document.getElementById('swiper-modal-' + this.hash);
            this.thumbs = new Swiper("#swiper-thumbs-" + this.hash, {
                spaceBetween: 10,
                slidesPerView: 'auto',
                freeMode: true,
                watchSlidesProgress: true,
            });
            this.swiper = new Swiper("#swiper-" + this.hash, {
                spaceBetween: 10,
                pagination: {
                    el: "#swiper-pagination-" + this.hash,
                    type: "fraction",
                },
                navigation: {
                    nextEl: "#swiper-button-next-" + this.hash,
                    prevEl: "#swiper-button-prev-" + this.hash,
                },
                thumbs: {
                    swiper: this.thumbs,
                },
            });
        });
    },
    methods: {
        modalimage() {
            this.modal.style.backgroundImage = "url('" + this.images[this.swiper.activeIndex] + "')";
        },
        fullscreen() {
            this.modalimage();
            this.modal.classList.add("swiper-modal--show");
            this.show = true;
        },
        close() {
            this.modal.classList.remove("swiper-modal--show");
            this.show = false;
        },
        hotkeys(event) {
            if (this.show) {
                if (event.key === 'Escape' && !(event.ctrlKey || event.altKey || event.shiftKey)) {
                    this.close();
                } else if (event.key === 'ArrowRight') {
                    this.swiper.slideNext();
                    this.modalimage();
                } else if (event.key === 'ArrowLeft') {
                    this.swiper.slidePrev();
                    this.modalimage();
                }
            }
        }
    },
    template:
        `<div class="swiper-container">` +
            `<div class="swiper-modal" :id="'swiper-modal-' + this.hash" @click="close()"></div>` +
            `<div :id="'swiper-' + this.hash" style="--swiper-navigation-color: #fff; --swiper-pagination-color: #fff" class="swiper swiper-main">` +
                `<div class="swiper-wrapper" v-html="slides"></div>` +
                `<div :id="'swiper-button-next-' + this.hash" class="swiper-button-next"></div>` +
                `<div :id="'swiper-button-prev-' + this.hash" class="swiper-button-prev"></div>` +
                `<div :id="'swiper-pagination-' + this.hash" class="swiper-pagination"></div>` +
                `<div title="Navigue avec les flèches de ton clavier en plein écran" class="swiper-fullscreen" @click="fullscreen()"></div>` +
            `</div>` +
            `<div :id="'swiper-thumbs-' + this.hash" class="swiper swiper-thumbs">` +
                `<div class="swiper-wrapper" v-html="thslides"></div>` +
            `</div>` +
        `</div>`
});
