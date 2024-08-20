document.addEventListener("DOMContentLoaded", function() {
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
  const icon = themeToggle.querySelector("i");

  themeToggle.addEventListener("click", function() {
    body.classList.toggle("night-mode");
    body.classList.toggle("day-mode");

    if (body.classList.contains("night-mode")) {
      icon.classList.remove("bi-moon");
      icon.classList.add("bi-sun");
    } else {
      icon.classList.remove("bi-sun");
      icon.classList.add("bi-moon");
    }
  });

  // Varsayılan olarak gündüz modu ayarlandı
  body.classList.add("night-mode");
});
const arrows = document.querySelectorAll(".arrow");
const gallerylists = document.querySelectorAll(".gallery-list");

arrows.forEach((arrow, index) => {
  let currentX = 0; 

  arrow.addEventListener("click", function () {
    const listWidth = gallerylists[index].offsetWidth;
    const totalWidth = gallerylists[index].scrollWidth;

    // Son öğeye gelindiğinde başa sarmak için kontrol
    if (currentX -200 <= -totalWidth + listWidth) {
      // Bir sonraki kaydırma işlemi son öğeden öteye geçerse, başa sar
      currentX = 0;
    } else {
      currentX -= 270;
    }

    gallerylists[index].style.transform = `translateX(${currentX}px)`;
  });
  document.addEventListener("DOMContentLoaded", function() {
    const scrollToTopButton = document.getElementById("scroll-to-top");
  
 
    scrollToTopButton.addEventListener("click", function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth' 
      });
    });
  });
  
});


