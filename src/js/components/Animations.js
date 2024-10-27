export default {
    fadeIn(element) {
        element.style.opacity = 0;
        let last = +new Date();
        const fade = function () {
            element.style.opacity = +element.style.opacity + (new Date() - last) / 400;
            last = +new Date();
            if (+element.style.opacity < 1) {
                requestAnimationFrame(fade);
            }
        };
        fade();
    },
};
