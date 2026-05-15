// --- 新增：帶有百分比進度的圖片載入偵測 ---
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("scroll-container");
  const logo = document.querySelector(".center-logo");
  if (!container || !logo) return;

  const initialImages = Array.from(
    document.querySelectorAll(".gallery-img"),
  ).slice(0, 6);

  if (initialImages.length === 0) {
    showGallery(container);
    return;
  }

  let loadedCount = 0;
  let targetProgress = 0; // 真實的載入進度 (0 到 100)
  let currentProgress = 0; // 畫面顯示的平滑進度 (0 到 100)

  // 更新目標進度
  const updateTargetProgress = () => {
    targetProgress = (loadedCount / initialImages.length) * 100;
  };

  // 綁定圖片載入事件
  const onImageLoad = () => {
    loadedCount++;
    updateTargetProgress();
  };

  initialImages.forEach((img) => {
    if (img.complete) {
      onImageLoad();
    } else {
      img.addEventListener("load", onImageLoad);
      img.addEventListener("error", onImageLoad);
    }
  });

  // 初始給一點點進度，讓底下有一點點墨水先滲出來
  targetProgress = 5;

  // 動畫迴圈：讓 currentProgress 平滑追趕 targetProgress
  const animateProgress = () => {
    // 0.05 是追趕速度，數字越小墨水流動越慢越滑順
    currentProgress += (targetProgress - currentProgress) * 0.05;

    // 將進度寫入 CSS 變數
    logo.style.setProperty("--progress", currentProgress);

    // 當幾乎達到 100% 時，觸發畫廊顯示
    if (currentProgress > 99) {
      logo.style.setProperty("--progress", 100);
      showGallery(container);
    } else {
      requestAnimationFrame(animateProgress);
    }
  };

  // 啟動動畫引擎
  requestAnimationFrame(animateProgress);

  // 安全機制：最多等 3.5 秒就強制把進度推到 100%
  setTimeout(() => {
    targetProgress = 100;
  }, 3500);
});

// 統一顯示畫廊的函數
function showGallery(container) {
  if (!container.classList.contains("loaded")) {
    container.classList.add("loaded");
    document.body.classList.remove("is-loading");
  }
}

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

          const galleryContainer = doc.querySelector(
            ".post-gallery-container",
          ).outerHTML;
          const infoPanel = doc.querySelector(".info-panel").outerHTML;
          const closeBtnHTML = doc.querySelector(".close-btn").outerHTML;

          // 注入 HTML
          overlay.innerHTML = `
    ${closeBtnHTML} 
    <div class="drawer-body">
      ${galleryContainer}
    </div>
    ${infoPanel}
  `;

          // --- 重點：綁定點擊展開/收合事件 ---
          const panel = overlay.querySelector(".info-panel");
          if (panel) {
            panel.addEventListener("click", function (e) {
              // 如果點擊的是裡面的連結，不要收合面板
              if (e.target.tagName.toLowerCase() === "a") return;

              this.classList.toggle("expanded");
            });
          }

          overlay.classList.add("active");
          document.body.classList.add("no-scroll");

          // 關閉按鈕邏輯保持不變
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
