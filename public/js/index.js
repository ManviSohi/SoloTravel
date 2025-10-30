// Tax toggle logic
const taxSwitch = document.getElementById("switchCheckDefault");
if (taxSwitch) {
    taxSwitch.addEventListener("click", () => {
        const taxInfo = document.getElementsByClassName("tax-info");
        for (let info of taxInfo) {
            info.style.display =
                info.style.display !== "inline" ? "inline" : "none";
        }
    });
}

// Custom drag scroll for filters
const slider = document.getElementById("filters");
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener("mousedown", (e) => {
    isDown = true;
    slider.classList.add("active");
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
});

slider.addEventListener("mouseleave", () => {
    isDown = false;
});

slider.addEventListener("mouseup", () => {
    isDown = false;
});

slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5; // scroll speed multiplier
    slider.scrollLeft = scrollLeft - walk;
});

// Touch support for mobile
let touchStartX = 0;
let touchScrollLeft = 0;

slider.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].pageX;
    touchScrollLeft = slider.scrollLeft;
});

slider.addEventListener("touchmove", (e) => {
    const x = e.touches[0].pageX;
    const walk = (x - touchStartX) * 1.5;
    slider.scrollLeft = touchScrollLeft - walk;
});