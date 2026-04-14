document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("scroll-container");
  if (container) {
    container.addEventListener("wheel", (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        // 在 RTL 模式下，往右滑動通常需要減去 deltaY
        container.scrollLeft -= e.deltaY;
      }
    });
  }
});
