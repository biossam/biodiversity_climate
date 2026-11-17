/* 간단한 그림판: BC.drawPad(el, savedDataUrl, onChange) */
(function () {
  var COLORS = ["#2d3a33", "#e2574c", "#f0a030", "#ffd23f", "#4f9d69", "#3b82b8", "#8a5cc2", "#8b5a2b"];
  BC.drawPad = function (host, saved, onChange) {
    host.className = "draw";
    host.innerHTML = '<canvas></canvas><div class="tools">' +
      COLORS.map(function (c, i) { return '<button type="button" data-c="' + c + '" style="background:' + c + '" class="' + (i ? "" : "on") + '" aria-label="색 ' + (i + 1) + '"></button>'; }).join("") +
      '<button type="button" class="txt" data-w="3">가늘게</button><button type="button" class="txt" data-w="8">굵게</button>' +
      '<button type="button" class="txt" data-er="1">지우개</button><button type="button" class="txt" data-clear="1">모두 지우기</button></div>';
    var cv = host.querySelector("canvas"), ctx = cv.getContext("2d");
    var color = COLORS[0], width = 4, erase = false, drawing = false, last = null;
    var W = 1200, H = 680;
    cv.width = W; cv.height = H;
    function blank() { ctx.fillStyle = "#fffdf8"; ctx.fillRect(0, 0, W, H); }
    blank();
    if (saved) { var im = new Image(); im.onload = function () { ctx.drawImage(im, 0, 0, W, H); }; im.src = saved; }
    function pos(e) {
      var r = cv.getBoundingClientRect();
      return { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height };
    }
    cv.addEventListener("pointerdown", function (e) { drawing = true; last = pos(e); cv.setPointerCapture(e.pointerId); dot(last); });
    cv.addEventListener("pointermove", function (e) { if (!drawing) return; var p = pos(e); line(last, p); last = p; });
    function end() { if (!drawing) return; drawing = false; onChange && onChange(cv.toDataURL("image/jpeg", .8)); }
    cv.addEventListener("pointerup", end); cv.addEventListener("pointercancel", end);
    function style() { ctx.strokeStyle = ctx.fillStyle = erase ? "#fffdf8" : color; ctx.lineWidth = erase ? 26 : width * 2; ctx.lineCap = ctx.lineJoin = "round"; }
    function dot(p) { style(); ctx.beginPath(); ctx.arc(p.x, p.y, ctx.lineWidth / 2, 0, 7); ctx.fill(); }
    function line(a, b) { style(); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
    host.querySelector(".tools").addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      if (b.dataset.c) { color = b.dataset.c; erase = false; host.querySelectorAll("[data-c],[data-er]").forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on"); }
      if (b.dataset.w) width = +b.dataset.w;
      if (b.dataset.er) { erase = true; host.querySelectorAll("[data-c]").forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on"); }
      if (b.dataset.clear && confirmClear()) { blank(); onChange && onChange(""); }
    });
    function confirmClear() { return b2(); }
    function b2() { var ok = host.dataset.sure === "1"; if (!ok) { host.dataset.sure = "1"; BC.toast("한 번 더 누르면 모두 지워져요"); setTimeout(function () { host.dataset.sure = ""; }, 2500); } return ok; }
    return cv;
  };
})();
