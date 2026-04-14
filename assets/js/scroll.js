document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("scroll-container");
  const overlay = document.getElementById("post-overlay");

  // --- 1. 原有的水平捲動邏輯 ---
  if (container) {
    container.addEventListener("wheel", (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft -= e.deltaY;
      }
    });
  }

  // --- 2. 攔截貼文點擊，改為滑入抽屜 ---
  document.querySelectorAll(".scroll-item").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const url = this.getAttribute("href");

      // 抓取貼文頁面
      fetch(url)
        .then((response) => response.text())
        .then((html) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");

          const postContent = doc.querySelector(".post-content").outerHTML;
          const closeBtnHTML = doc.querySelector(".close-btn").outerHTML;

          // 修改 HTML 結構：將按鈕與捲動主體分開
          overlay.innerHTML = `
    ${closeBtnHTML} 
    <div class="drawer-body">
      ${postContent}
    </div>
  `;

          overlay.classList.add("active");
          document.body.classList.add("no-scroll");

          // 重新綁定關閉事件
          overlay.querySelector(".close-btn").onclick = (e) => {
            e.preventDefault();
            closeDrawer();
          };
        });
    });
  });

  // 關閉抽屜的函式
  function closeDrawer() {
    overlay.classList.remove("active");
    document.body.classList.remove("no-scroll");
    // 動態清空內容，確保下次開啟時不會看到舊貼文殘影
    setTimeout(() => {
      overlay.innerHTML = "";
    }, 600);
  }
});
