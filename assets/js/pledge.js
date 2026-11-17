(function () {
  var D = BC.data, esc = BC.esc;
  BC.header("pledge");
  var P = BC.get("pledge", { picks: [], mine: "", name: "", animal: 2, line: "", week: {} });
  function save() { BC.set("pledge", P); }
  function chosen() { return P.picks.map(function (i) { return D.pledges[i]; }).concat(P.mine.trim() ? [P.mine.trim()] : []); }

  /* ① 고르기 */
  var pl = document.getElementById("plist");
  pl.innerHTML = D.pledges.map(function (p, i) { return '<label><input type="checkbox" value="' + i + '">' + esc(p) + "</label>"; }).join("");
  pl.querySelectorAll("input").forEach(function (c) {
    c.checked = P.picks.indexOf(+c.value) >= 0;
    c.onchange = function () {
      if (c.checked && P.picks.length >= 3) { c.checked = false; BC.toast("약속은 3개까지 골라요"); return; }
      P.picks = [].slice.call(pl.querySelectorAll("input:checked")).map(function (x) { return +x.value; });
      save(); all();
    };
  });
  var mine = document.getElementById("mine");
  mine.value = P.mine; mine.oninput = function () { P.mine = mine.value; save(); all(); };

  /* ② 기록 */
  var DAYS = ["월", "화", "수", "목", "금", "토", "일"];
  function week() {
    var list = chosen(), t = document.getElementById("week");
    if (!list.length) { t.innerHTML = '<tr><td class="mute">먼저 약속을 골라 주세요.</td></tr>'; return; }
    t.innerHTML = "<tr><th></th>" + DAYS.map(function (d) { return "<th>" + d + "</th>"; }).join("") + "</tr>" + list.map(function (p) {
      return '<tr><td class="p">' + esc(p) + "</td>" + DAYS.map(function (d, j) {
        var on = P.week[p + "|" + j];
        return '<td><button data-k="' + esc(p + "|" + j) + '" class="' + (on ? "on" : "") + '" aria-label="' + esc(p) + " " + d + '">' + (on ? "🌱" : "") + "</button></td>";
      }).join("") + "</tr>";
    }).join("");
  }
  document.getElementById("week").addEventListener("click", function (e) {
    var b = e.target.closest("[data-k]"); if (!b) return;
    var k = b.dataset.k; if (P.week[k]) delete P.week[k]; else P.week[k] = 1;
    save(); week(); card();
  });
  document.getElementById("clearweek").onclick = function () { P.week = {}; save(); week(); card(); BC.toast("새 주를 시작해요!"); };

  /* ③ 카드 */
  var ani = document.getElementById("ani");
  ani.innerHTML = D.lessons.slice(1, 5).map(function (l) {
    return '<label><input type="radio" name="ani" value="' + l.no + '">' + esc(l.animal) + "</label>";
  }).join("");
  ani.querySelectorAll("input").forEach(function (r) { r.checked = +r.value === P.animal; r.onchange = function () { P.animal = +r.value; save(); card(); }; });
  ["nm", "line"].forEach(function (id) {
    var el = document.getElementById(id), key = id === "nm" ? "name" : "line";
    el.value = P[key]; el.oninput = function () { P[key] = el.value; save(); card(); };
  });

  var cv = document.getElementById("cardcv"), ctx = cv.getContext("2d"), faceImg = {};
  function faceFor(l, cb) {
    if (faceImg[l.no]) return cb(faceImg[l.no]);
    var svg = BC.face(l, 400).replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ');
    var im = new Image();
    im.onload = function () { faceImg[l.no] = im; cb(im); };
    im.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }
  function wrapText(t, x, y, maxW, lh) {
    var line = "", lines = [];
    t.split(" ").forEach(function (w) { var tryL = line ? line + " " + w : w; if (line && ctx.measureText(tryL).width > maxW) { lines.push(line); line = w; } else line = tryL; });
    lines.push(line);
    lines.forEach(function (l, i) { ctx.fillText(l, x, y + i * lh); });
    return lines.length * lh;
  }
  function card() {
    var l = BC.lesson(P.animal) || D.lessons[1];
    faceFor(l, function (im) {
      var W = 1080, H = 1350;
      ctx.fillStyle = "#fbf8f1"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = l.soft; roundRect(60, 60, W - 120, H - 120, 48); ctx.fill();
      ctx.lineWidth = 8; ctx.strokeStyle = l.color; ctx.stroke();
      ctx.drawImage(im, W / 2 - 150, 120, 300, 300);
      ctx.textAlign = "center"; ctx.fillStyle = l.color;
      ctx.font = '700 44px "Gothic A1", sans-serif'; ctx.fillText("PLAY2CHANGE · 나도 환경 건축가", W / 2, 490);
      ctx.fillStyle = "#2d3a33"; ctx.font = '700 92px "Gaegu", sans-serif';
      ctx.fillText((P.name || "이름") + "의 실천 다짐", W / 2, 600);
      ctx.font = '700 56px "Gaegu", sans-serif';
      var y = 690 + wrapText(P.line || "나는 " + l.animal + "의 집을 지키는 환경 건축가!", W / 2, 690, W - 260, 64);
      ctx.textAlign = "left"; ctx.font = '700 40px "Gothic A1", sans-serif';
      var list = chosen(); y += 40;
      (list.length ? list : ["약속을 골라 주세요"]).forEach(function (p) {
        var cnt = 0; for (var j = 0; j < 7; j++) if (P.week[p + "|" + j]) cnt++;
        ctx.fillStyle = "#fff"; roundRect(140, y - 50, W - 280, 76, 38); ctx.fill();
        ctx.fillStyle = "#2d3a33"; ctx.fillText("🌱 " + p, 170, y);
        if (cnt) { ctx.textAlign = "right"; ctx.fillStyle = l.color; ctx.fillText(cnt + "일", W - 170, y); ctx.textAlign = "left"; }
        y += 96;
      });
      var got = BC.badges(), gx = W / 2 - (D.lessons.length * 90) / 2;
      D.lessons.forEach(function (b, i) {
        faceFor(b, function (bi) { ctx.globalAlpha = got[b.no] ? 1 : .18; ctx.drawImage(bi, gx + i * 90, H - 210, 80, 80); ctx.globalAlpha = 1; });
      });
      ctx.textAlign = "center"; ctx.fillStyle = "#6b746e"; ctx.font = '500 28px "Gothic A1", sans-serif';
      ctx.fillText("생물 다양성과 기후변화", W / 2, H - 90);
    });
  }
  function roundRect(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  document.getElementById("save").onclick = function () {
    var a = document.createElement("a"); a.download = "실천_다짐_카드.png"; a.href = cv.toDataURL("image/png"); a.click();
  };
  function all() { document.getElementById("cnt").textContent = P.picks.length + " / 3"; week(); card(); }
  all();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(card);
})();
