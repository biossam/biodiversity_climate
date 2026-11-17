/* 놀이터 네 가지 */
(function () {
  var D = BC.data, esc = BC.esc;
  BC.header("play");
  var root = document.documentElement;

  /* 탭 */
  var pick = document.querySelector(".gpick");
  function show(g) {
    pick.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-selected", b.dataset.g === g); });
    document.querySelectorAll(".game").forEach(function (s) { s.classList.toggle("on", s.id === "g-" + g); });
    history.replaceState(null, "", "#" + g);
  }
  pick.addEventListener("click", function (e) { var b = e.target.closest("[data-g]"); if (b) show(b.dataset.g); });
  var start = location.hash.slice(1);
  show(["habitat", "thermo", "bee", "turtle"].indexOf(start) >= 0 ? start : "habitat");
  window.addEventListener("hashchange", function () { var h = location.hash.slice(1); if (document.getElementById("g-" + h)) show(h); });

  /* ---------- 1. 서식지 지키기 ---------- */
  var HAB = {
    bear: { name: "북극곰", items: [
      { e: "🧊", n: "바다 얼음(해빙)", ev: "기온이 올라 바다 얼음이 녹았어요! 쉴 곳과 사냥터가 사라져요.", ok: "전기를 아끼고 걸어 다니며 온실가스를 줄여요", bad: "북극곰에게 선풍기를 보내요" },
      { e: "🦭", n: "물범(먹이)", ev: "얼음이 사라져 물범을 사냥하기 어려워졌어요.", ok: "북극 바다를 보호구역으로 지정해 먹이가 살 곳을 지켜요", bad: "북극곰에게 햄버거를 배달해요" },
      { e: "❄️", n: "눈 굴(새끼 키우는 곳)", ev: "눈이 일찍 녹아 새끼를 키울 눈 굴이 무너졌어요.", ok: "새끼를 키우는 지역에 사람 출입을 줄여 조용히 지켜 줘요", bad: "눈 굴 대신 텐트를 쳐 줘요" },
      { e: "🌊", n: "차가운 바다", ev: "바다가 따뜻해져 북극 바다 생물이 줄고 있어요.", ok: "일회용품을 줄이고 재생 에너지를 써요", bad: "바다에 얼음을 한 바구니 부어요" }
    ] },
    bee: { name: "꿀벌", items: [
      { e: "🌼", n: "꽃밭(꿀과 꽃가루)", ev: "가뭄으로 꽃이 시들었어요! 먹을 꿀이 부족해요.", ok: "학교와 집에 꿀벌이 좋아하는 꽃을 심어요", bad: "조화(가짜 꽃)를 꽂아 둬요" },
      { e: "💧", n: "마실 물", ev: "폭염에 물웅덩이가 말라 버렸어요.", ok: "얕은 그릇에 물과 작은 돌을 넣어 급수대를 만들어요", bad: "꿀벌에게 탄산음료를 줘요" },
      { e: "🌳", n: "시원한 쉼터", ev: "도시가 너무 뜨거워 쉴 그늘이 없어요.", ok: "나무를 심어 시원한 그늘 쉼터를 만들어요", bad: "꿀벌집에 에어컨을 달아요" },
      { e: "📅", n: "알맞은 계절", ev: "겨울이 너무 따뜻해 꿀벌이 꽃보다 먼저 깨어났어요.", ok: "온실가스를 줄여 계절의 리듬을 지켜요", bad: "꿀벌에게 달력을 나눠 줘요" }
    ] },
    tiger: { name: "벵갈호랑이", items: [
      { e: "🌳", n: "맹그로브 숲", ev: "해수면이 올라 맹그로브 숲이 바닷물에 잠기고 있어요.", ok: "맹그로브 나무를 새로 심어 숲을 넓혀요", bad: "숲을 베어 높은 건물을 지어요" },
      { e: "💧", n: "마실 민물", ev: "짠 바닷물이 들어와 마실 민물이 부족해요.", ok: "빗물을 모아 두는 민물 연못을 만들어요", bad: "바닷물을 그냥 마시게 해요" },
      { e: "🦌", n: "사슴(피식자)", ev: "가뭄으로 풀이 줄어 사슴이 사라지고 있어요.", ok: "풀과 숲을 함께 되살려 먹이사슬을 지켜요", bad: "호랑이에게 사료를 줘요" },
      { e: "🔥", n: "산불 없는 숲", ev: "건기가 길어져 산불이 났어요!", ok: "방화선을 만들어 산불이 번지는 것을 막아요", bad: "숲에서 불꽃놀이를 해요" }
    ] },
    turtle: { name: "바다거북", items: [
      { e: "🏖", n: "넓은 모래사장", ev: "해수면이 올라 알을 낳을 모래사장이 잠겼어요.", ok: "모래가 쓸려 가지 않게 해변 식물을 심어요", bad: "모래사장을 시멘트로 덮어요" },
      { e: "⛱", n: "시원한 모래", ev: "모래가 너무 뜨거워져 암컷만 태어나고 있어요.", ok: "해변에 나무를 심어 그늘을 만들어요", bad: "알을 냉동실에 넣어요" },
      { e: "🌊", n: "깨끗한 바닷길", ev: "쓰레기 때문에 아기 거북이 바다로 가는 길이 막혔어요.", ok: "해변 쓰레기를 줍고 일회용품을 줄여요", bad: "쓰레기를 모래에 묻어요" },
      { e: "🌿", n: "해초와 먹이", ev: "바다가 따뜻해져 해초밭과 산호가 줄고 있어요.", ok: "바다 보호구역을 만들고 온실가스를 줄여요", bad: "바다에 설탕을 뿌려요" }
    ] }
  };
  var LBY = { bear: 2, bee: 3, tiger: 4, turtle: 5 };
  var hk = "bear", lost = [], fixing = -1;
  var hA = document.getElementById("h-animals");
  hA.innerHTML = Object.keys(HAB).map(function (k) { var l = BC.lesson(LBY[k]); return '<button class="btn line" data-a="' + k + '" style="padding:4px 14px 4px 4px">' + BC.face(l, 34) + esc(HAB[k].name) + "</button>"; }).join("");
  hA.addEventListener("click", function (e) { var b = e.target.closest("[data-a]"); if (b) { hk = b.dataset.a; hReset(); } });
  function hReset() { lost = []; fixing = -1; document.getElementById("h-event").innerHTML = ""; hDraw(); }
  function hDraw() {
    var l = BC.lesson(LBY[hk]);
    var sec = document.getElementById("g-habitat");
    sec.style.setProperty("--c", l.color); sec.style.setProperty("--soft", l.soft);
    hA.querySelectorAll("button").forEach(function (b) { b.style.borderColor = b.dataset.a === hk ? l.color : ""; b.style.background = b.dataset.a === hk ? l.soft : ""; });
    document.getElementById("h-tiles").innerHTML = HAB[hk].items.map(function (it, i) {
      return '<div class="tile' + (lost.indexOf(i) >= 0 ? " lost" : "") + '" data-i="' + i + '"><span class="e">' + it.e + "</span>" + esc(it.n) + "</div>";
    }).join("");
    var left = 4 - lost.length;
    document.getElementById("h-meter").style.width = (left * 25) + "%";
    document.getElementById("h-face").innerHTML = BC.face(l, 64, left <= 1);
    document.getElementById("h-say").textContent = HAB[hk].name + ": " + ["살기가 너무 힘들어요… 도와주세요!", "많이 힘들어요…", "조금 불편해요.", "괜찮아요!", "여기서 사는 게 행복해요!"][left];
  }
  document.getElementById("h-draw").onclick = function () {
    var ok = [0, 1, 2, 3].filter(function (i) { return lost.indexOf(i) < 0; });
    if (!ok.length) { BC.toast("모든 요소가 사라졌어요. 사라진 칸을 눌러 지켜 주세요!"); return; }
    var i = ok[Math.floor(Math.random() * ok.length)];
    lost.push(i);
    document.getElementById("h-event").innerHTML = '<div class="event">🃏 ' + esc(HAB[hk].items[i].ev) + "</div>";
    hDraw();
  };
  document.getElementById("h-reset").onclick = hReset;
  document.getElementById("h-tiles").addEventListener("click", function (e) {
    var t = e.target.closest(".tile.lost"); if (!t) return;
    var i = +t.dataset.i, it = HAB[hk].items[i]; fixing = i;
    var opts = Math.random() < .5 ? [[it.ok, 1], [it.bad, 0]] : [[it.bad, 0], [it.ok, 1]];
    document.getElementById("h-event").innerHTML = '<div class="event">🛠 <b>' + esc(it.n) + "</b>을(를) 어떻게 지킬까요?" +
      '<div class="fix">' + opts.map(function (o) { return '<button data-ok="' + o[1] + '">' + esc(o[0]) + "</button>"; }).join("") + "</div></div>";
  });
  document.getElementById("h-event").addEventListener("click", function (e) {
    var b = e.target.closest("[data-ok]"); if (!b) return;
    if (b.dataset.ok === "1") {
      lost = lost.filter(function (x) { return x !== fixing; });
      document.getElementById("h-event").innerHTML = '<div class="event" style="background:#e5f3e8;border-color:#9fd0ab">🌱 좋은 해결책이에요! ' + esc(HAB[hk].items[fixing].n) + "을(를) 지켜 냈어요. 내 브릭 작품에는 이런 생각을 어떻게 담을 수 있을까요?</div>";
      hDraw();
    } else {
      b.style.background = "#fde7e7"; b.disabled = true; BC.toast("음… 정말 도움이 될까요? 다시 골라 봐요");
    }
  });
  hDraw();

  /* ---------- 2. 지구 온도 조절기 ---------- */
  var LV = ["아주 적게", "적게", "많이", "아주 많이", "엄청 많이"];
  var TEMP = ["시원해요", "지금쯤", "뜨거워져요", "아주 뜨거워요", "펄펄 끓어요"];
  var FX = [
    { at: 2, e: "🧊", t: "북극 바다 얼음이 녹아 북극곰이 사냥하기 어려워요." },
    { at: 2, e: "🌼", t: "꽃 피는 때가 어긋나 꿀벌이 먹이를 찾기 어려워요." },
    { at: 3, e: "🌊", t: "해수면이 올라 맹그로브 숲과 모래사장이 잠겨요." },
    { at: 3, e: "🔥", t: "가뭄과 폭염이 길어져 산불이 자주 나요." },
    { at: 4, e: "🐢", t: "모래가 너무 뜨거워 아기 바다거북이 거의 암컷만 태어나요." },
    { at: 4, e: "🍎", t: "꽃가루받이가 줄어 우리 식탁의 과일도 줄어요." }
  ];
  var gas = document.getElementById("t-gas");
  function tDraw() {
    var v = +gas.value;
    var sec = document.getElementById("g-thermo");
    var c = ["#3b82b8", "#4f9d69", "#e0a020", "#d9622b", "#c0392b"][v];
    sec.style.setProperty("--c", c);
    document.getElementById("t-lv").textContent = LV[v];
    document.getElementById("t-temp").textContent = "지구가 " + TEMP[v];
    var haze = v * 0.12;
    document.getElementById("t-earth").innerHTML =
      '<circle cx="100" cy="100" r="' + (86 + v * 3) + '" fill="' + c + '" opacity="' + (0.1 + haze) + '"/>' +
      '<circle cx="100" cy="100" r="70" fill="#5aa7e0"/>' +
      '<path d="M55 80c12-12 28-10 34 0s-4 18 6 26-2 20-14 18-24-12-26-22 0-22 0-22z" fill="' + (v >= 3 ? "#c8b56a" : "#7cc576") + '"/>' +
      '<path d="M112 52c14 2 26 12 30 24-8 4-18 2-22-6s-12-8-8-18z" fill="' + (v >= 3 ? "#c8b56a" : "#7cc576") + '"/>' +
      '<path d="M116 118c10-6 22-4 24 4-4 10-14 18-24 18-4-8-6-16 0-22z" fill="' + (v >= 4 ? "#c8b56a" : "#7cc576") + '"/>' +
      (v < 3 ? '<ellipse cx="100" cy="34" rx="' + (30 - v * 8) + '" ry="8" fill="#fff"/>' : "") +
      '<circle cx="84" cy="98" r="5" fill="#2b2b2b"/><circle cx="116" cy="98" r="5" fill="#2b2b2b"/>' +
      (v <= 1 ? '<path d="M86 114q14 10 28 0" stroke="#2b2b2b" stroke-width="4" fill="none" stroke-linecap="round"/>' :
        v === 2 ? '<path d="M88 116h24" stroke="#2b2b2b" stroke-width="4" stroke-linecap="round"/>' :
        '<path d="M86 120q14-10 28 0" stroke="#2b2b2b" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M128 82q6 8 0 14" stroke="#5ab0e8" stroke-width="5" fill="none" stroke-linecap="round"/>');
    document.getElementById("t-fx").innerHTML = FX.map(function (f) {
      return '<div class="' + (v >= f.at ? "" : "off") + '"><span style="font-size:26px">' + f.e + "</span>" + esc(f.t) + "</div>";
    }).join("") + (v <= 1 ? '<div style="background:#e5f3e8"><span style="font-size:26px">🌏</span>온실가스를 줄이면 동물들의 집을 지킬 수 있어요!</div>' : "");
  }
  gas.oninput = tDraw; tDraw();

  /* ---------- 3. 꿀벌 수분 놀이 ---------- */
  var garden = document.getElementById("b-garden"), beeEl = document.getElementById("b-bee");
  var KINDS = [{ f: "🌸", fruit: "🍓" }, { f: "🌼", fruit: "🍎" }, { f: "🌺", fruit: "🍑" }];
  var flowers = [], carry = null, fruits = 0, timer = null, left = 30, wiltT = null;
  function bSetup() {
    garden.querySelectorAll(".flower").forEach(function (f) { f.remove(); });
    flowers = []; carry = null; fruits = 0;
    for (var i = 0; i < 12; i++) {
      var k = i % 3, el = document.createElement("span");
      el.className = "flower"; el.textContent = KINDS[k].f;
      el.style.left = (8 + (i % 6) * 16.5 + Math.random() * 4) + "%";
      el.style.top = (i < 6 ? 34 : 72) + Math.random() * 10 + "%";
      el.dataset.i = i; garden.appendChild(el);
      flowers.push({ el: el, k: k, state: "bloom" });
    }
    bHud();
  }
  function bHud() {
    document.getElementById("b-fruit").textContent = fruits;
    document.getElementById("b-carry").textContent = carry ? KINDS[flowers[carry.i].k].f + " 꽃가루" : "없음";
    document.getElementById("b-time").textContent = left;
  }
  garden.addEventListener("click", function (e) {
    var el = e.target.closest(".flower"); if (!el || !timer) return;
    var f = flowers[+el.dataset.i];
    beeEl.style.left = el.style.left; beeEl.style.top = el.style.top;
    if (f.state !== "bloom") return;
    if (!carry) { carry = { i: +el.dataset.i }; el.insertAdjacentHTML("beforeend", '<span class="tag">✨</span>'); }
    else if (+el.dataset.i === carry.i) return;
    else if (flowers[carry.i].k === f.k) {
      f.state = "fruit"; el.textContent = KINDS[f.k].fruit; fruits++;
      var src = flowers[carry.i].el.querySelector(".tag"); if (src) src.remove();
      carry = null;
    } else { BC.toast("같은 종류의 꽃으로 옮겨야 수분이 돼요!"); }
    bHud();
  });
  function bEnd() {
    clearInterval(timer); clearInterval(wiltT); timer = null;
    var heat = document.getElementById("b-heat").checked;
    var wilted = flowers.filter(function (f) { return f.state === "wilt"; }).length;
    document.getElementById("b-result").innerHTML = '<div class="event" style="margin-top:12px">⏱ 끝! 열매 <b>' + fruits + "개</b>를 맺었어요." +
      (heat ? " 폭염으로 꽃 " + wilted + "송이가 시들었어요. 폭염을 끄고 한 번 더 해서 비교해 보세요." : " 이번엔 🔥 폭염과 가뭄을 켜고 해 보세요. 열매 수가 어떻게 달라질까요?") + "</div>";
  }
  document.getElementById("b-start").onclick = function () {
    clearInterval(timer); clearInterval(wiltT);
    left = 30; bSetup(); document.getElementById("b-result").innerHTML = "";
    timer = setInterval(function () { left--; bHud(); if (left <= 0) bEnd(); }, 1000);
    if (document.getElementById("b-heat").checked) {
      wiltT = setInterval(function () {
        var b = flowers.filter(function (f) { return f.state === "bloom" && (!carry || flowers[carry.i] !== f); });
        if (!b.length) return;
        var f = b[Math.floor(Math.random() * b.length)]; f.state = "wilt"; f.el.classList.add("wilt");
      }, 2600);
    }
  };
  bSetup();

  /* ---------- 4. 거북 알 ---------- */
  var tIn = document.getElementById("u-temp"), shade = document.getElementById("u-shade");
  function uDraw() {
    var t = +tIn.value - (shade.checked ? 2 : 0);
    var sec = document.getElementById("g-turtle"); sec.style.setProperty("--c", "#1f9a93");
    document.getElementById("u-t").textContent = tIn.value + "℃" + (shade.checked ? " → 그늘에서 " + t + "℃" : "");
    var pf = 1 / (1 + Math.exp(-(t - 29) * 1.6));
    var fail = t >= 33 ? Math.min(10, Math.round((t - 32.5) * 5)) : 0;
    var hatch = 10 - fail, fem = Math.round(hatch * pf), mal = hatch - fem;
    var arr = [];
    for (var i = 0; i < fem; i++) arr.push("#e2687a");
    for (i = 0; i < mal; i++) arr.push("#3b82b8");
    for (i = 0; i < fail; i++) arr.push("#b9b1a2");
    document.getElementById("u-nest").innerHTML = arr.map(function (c) { return '<span style="background:' + c + '">' + (c === "#b9b1a2" ? "" : "🐢") + "</span>"; }).join("");
    document.getElementById("u-say").textContent =
      fail ? "모래가 너무 뜨거워 깨어나지 못하는 알이 생겼어요. 그늘막을 세워 보세요!" :
      fem >= 9 ? "거의 모두 암컷이에요. 나중에 짝을 찾기 어려워질 수 있어요." :
      mal >= 9 ? "거의 모두 수컷이에요. 모래가 시원한 해변이에요." :
      "암컷과 수컷이 골고루 태어나요. 건강한 해변이에요!";
  }
  tIn.oninput = uDraw; shade.onchange = uDraw; uDraw();
})();
