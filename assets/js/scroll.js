document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("scroll-container");
  if (container) {
    container.addEventListener("wheel", (e) => {
      // 阻斷預設垂直捲動，改為操作容器的水平捲動位置
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    });
  }
});
