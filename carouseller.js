function carouseller(carousel, w, h) {
    let width = w || carousel.style.width;
    let height = h || carousel.style.height;
    carousel.style.width = `${width}px`;
    carousel.style.height = `${height}px`;
    const slider = carousel.querySelector(".slider");
    const slideList = slider.children;
    let slideIndex = 0;
    // 1 is to the right (forwards), -1 is backwards
    let direction = 1;
    let slideSpeed = 300;
    // These two variables control the autoplay interval function
    let interval = 4000;
    let autoplayIntFunc;
    let autoplayEnabled = true;
    for (let slide of slideList) {
        slide.style.width = `${width}px`;
        slide.style.height = `${height}px`;
        slide.style.backgroundColor = `hsl(${Math.random() * 360}, 20%, 80%)`;
    }

    function formatSlides(num) {
        if (direction === 1) {
            for (let i = 0; i < (num || 1); i++) {
                slideIndex++;
                slider.append(slider.firstElementChild);
            }
            if (slideIndex > slideList.length - 1) {
                slideIndex = 0;
            }
        } else if (direction === -1) {
            for (let i = 0; i < (num || 1); i++) {
                slideIndex--;
                slider.prepend(slider.lastElementChild);
            }
            if (slideIndex < 0) slideIndex = slideList.length - 1;
        }
        // When changing the location of the elements, we remove the transition then translate the slider to the default position
        slider.style.transition = "none";
        slider.style.transform = "translateX(0)";
        // Then we reset the transition property with a setTimeout so it is forced to be re-applied only after the slider is in the correct position
        setTimeout(() => {
            slider.style.transition = `all ease ${slideSpeed / 1000}s`;
        });
        if (document.querySelector(".nav-box")) {
            updateNav();
        };

    }

    function createControlButton(dir) {
        const controlButton = document.createElement("div");
        controlButton.classList.add("control-button");
        controlButton.classList.add(`control-button-${dir}`);
        controlButton.addEventListener("mousedown", function () {
            dir === "right" ? slideToNext() : slideToPrev();
        });
        return controlButton
    }

    function createControl() {
        const controlBox = document.createElement("div");
        controlBox.classList.add("control-box");
        controlBox.appendChild(createControlButton("left"));
        controlBox.appendChild(createControlButton("right"));
        carousel.appendChild(controlBox);
    }

    function createNavButton(index) {
        const navButton = document.createElement("div");
        navButton.classList.add("nav-button");
        navButton.setAttribute("carousel-nav", index);
        navButton.addEventListener("mousedown", function () {
            if (slideIndex < index) {
                slideToNext(index - slideIndex);
            }
            if (slideIndex > index) {
                slideToPrev(slideIndex - index);
            }
        });
        return navButton;
    }

    function createNav() {
        const navBox = document.createElement("div");
        navBox.classList.add("nav-box");
        for (let i = 0; i < slideList.length; i++) {
            navBox.appendChild(createNavButton(i));
        }
        navBox.children[slideIndex].classList.add("nav-button-active");
        carousel.appendChild(navBox);
    }

    function updateNav() {
        carousel
            .querySelector(".nav-button-active")
            .classList.remove("nav-button-active");
        carousel
            .querySelectorAll(".nav-button")
        [slideIndex].classList.add("nav-button-active");
    }

    // Functions to slide the carousel
    // Uses flex-start & flex-end to justify slides to direction
    // If a change in direction happens, moves the current slide so that it is the first element in the flexbox
    function slideToNext(num) {
        if (direction === -1) {
            direction = 1;
            slider.prepend(slider.lastElementChild);
        }
        carousel.style.justifyContent = "flex-start";
        slider.style.transform = `translateX(-${width * (num || 1)}px)`;
        slider.ontransitionend = () => formatSlides(num);
    }

    function slideToPrev(num) {
        if (direction === 1) {
            direction = -1;
            slider.append(slider.firstElementChild);
        }
        carousel.style.justifyContent = "flex-end";
        slider.style.transform = `translateX(${width * (num || 1)}px)`;
        slider.ontransitionend = () => formatSlides(num);
    }

    function autoplay(status) {
        if (status && autoplayEnabled) {
            autoplayIntFunc = setInterval(slideToNext, interval);
        } else {
            clearInterval(autoplayIntFunc);
        }
    }

    carousel.addEventListener("mouseover", () => {
        autoplay(false);
    });
    carousel.addEventListener("mouseout", () => {
        autoplay(true);
    });

    createControl();
    createNav();
    updateNav();
    autoplay(true);

    function setDelay(delay) {
        if (delay > 0) {
            autoplayEnabled = true;
            interval = delay;
            autoplay(true);
        } else {
            autoplayEnabled = false;
            autoplay(false);
        }
    }

    function setSlideSpeed(speed) {
        if (speed > 0) {
            slideSpeed = speed;
            slider.style.transition = `all ease ${slideSpeed / 1000}s`;
        }
    }

    function setNavigation(style) {
        let navBox = carousel.querySelector(".nav-box");
        if (!style) {
            navBox.remove();
        } else {
            if (!navBox) {
                createNav();
                navBox = carousel.querySelector(".nav-box");
            }
            switch (style) {
                case "square":
                    for (let btn of navBox.children) {
                        btn.style.width = "10px";
                        btn.style.borderRadius = "0";
                    };
                    break;
                case "circle":
                    for (let btn of navBox.children) {
                        btn.style.width = "10px";
                        btn.style.borderRadius = "50%";
                    };
                    break;
                case "oval":
                    for (let btn of navBox.children) {
                        btn.style.width = "40px";
                        btn.style.borderRadius = "5px";
                    };
                    break;
                case "rectangle":
                    for (let btn of navBox.children) {
                        btn.style.width = "40px";
                        btn.style.borderRadius = "0";
                    }
                    break;
                default:
                    return;
            }
        }
    }

    function setControl(style) {
        let controlBox = carousel.querySelector(".control-box");
        if (!style) {
            controlBox.remove();
        } else {
            if (!controlBox) {
                createControl();
                controlBox = carousel.querySelector(".control-box");
            }
            switch (style) {
                case "circle":
                    for (let btn of controlBox.children) {
                        btn.style.borderRadius = "50%";
                    };
                    break;
                case "square":
                    for (let btn of controlBox.children) {
                        btn.style.borderRadius = "0";
                    }
                    break;
                default:
                    return;
            }
        }
    }

    return { setDelay, setSlideSpeed, setNavigation, setControl }
}

let carousel = carouseller(document.querySelector(".carouseller"), 800, 600);
