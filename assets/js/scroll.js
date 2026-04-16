document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("scroll-container");
  const overlay = document.getElementById("post-overlay");
  const aboutLink = document.querySelector(".about-link"); // 取得 Logo 連結

  // --- 1. 定義統一的捲動邏輯 ---
  const handleWheelScroll = (e) => {
    if (e.deltaY !== 0) {
      e.preventDefault();
      // 將捲動量傳遞給水平容器
      container.scrollLeft -= e.deltaY;
    }
  };

  // 在容器上捲動時
  if (container) {
    container.addEventListener("wheel", handleWheelScroll);
  }

  // 當滑鼠停在 Logo 上捲動時，也觸發一樣的邏輯
  if (aboutLink) {
    aboutLink.addEventListener("wheel", handleWheelScroll);
  }

  // --- 2. 攔截貼文點擊，改為滑入抽屜 ---
  document.querySelectorAll(".scroll-item, .about-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      // ... 原有的 fetch 邏輯保持不變 ...
      e.preventDefault();
      const url = this.getAttribute("href");

      fetch(url)
        .then((response) => response.text())
        .then((html) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          const postContent = doc.querySelector(".post-content").outerHTML;
          const closeBtnHTML = doc.querySelector(".close-btn").outerHTML;

          overlay.innerHTML = `
            ${closeBtnHTML} 
            <div class="drawer-body">
              ${postContent}
            </div>
          `;

          overlay.classList.add("active");
          document.body.classList.add("no-scroll");

          overlay.querySelector(".close-btn").onclick = (e) => {
            e.preventDefault();
            closeDrawer();
          };
        });
    });
  });

  function closeDrawer() {
    overlay.classList.remove("active");
    document.body.classList.remove("no-scroll");
    setTimeout(() => {
      overlay.innerHTML = "";
    }, 600);
  }
});
