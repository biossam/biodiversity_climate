/* 차시 화면: 배우기 · 활동지 · 퀴즈 · 선생님 + 수업 모드 */
(function () {
  var D = BC.data, esc = BC.esc;
  var no = +(BC.param("l") || 1);
  var autoPresent = BC.param("present") === "1";
  var L = BC.lesson(no) || D.lessons[0];
  no = L.no;
  document.title = no + "차시 " + L.title + " · " + D.title;
  document.documentElement.style.setProperty("--c", L.color);
  document.documentElement.style.setProperty("--soft", L.soft);
  BC.header("lesson");
  var app = document.getElementById("app");
  var next = BC.lesson(no + 1);

  /* ---------- 조각 ---------- */
  function qs(list) { return '<ul class="qs">' + list.map(function (q) { return "<li>" + esc(q) + "</li>"; }).join("") + "</ul>"; }
  function terms(hide) {
    return '<div class="terms">' + L.terms.map(function (t) {
      return '<div class="term' + (hide ? " hide" : "") + '"><b>' + esc(t.w) + '</b><div class="d">' + esc(t.d) + "</div></div>";
    }).join("") + "</div>";
  }
  function learn() {
    var x = L.learn;
    var h = "<h3>" + esc(x.head) + "</h3>";
    if (x.type === "chain") return h + '<div class="chain">' + x.items.map(function (i) { return "<div>" + esc(i) + "</div>"; }).join("") + "</div>";
    if (x.type === "split") return h + '<div class="split2">' + [x.left, x.right].map(function (s) {
      return "<div><b>" + esc(s.h) + '</b><ul style="margin:6px 0 0;padding-left:20px">' + s.items.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul></div>";
    }).join("") + "</div>";
    return h + '<ul class="qs">' + x.items.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul>";
  }
  function videoBox(big) {
    if (!L.video) return "";
    var inner = L.videoUrl
      ? '<div style="position:relative;padding-top:56.25%;margin-top:12px"><iframe src="' + esc(L.videoUrl) + '" style="position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:12px" allowfullscreen></iframe></div>'
      : '<p style="margin:6px 0 10px;opacity:.85;font-size:14px">수업 자료로 받은 영상 파일을 이 컴퓨터에서 바로 열어 재생해요. 영상은 인터넷에 올라가지 않아요.</p>' +
        '<label class="btn soft">🎬 영상 파일 열기<input type="file" accept="video/*" class="vfile"></label><video controls hidden></video>';
    return '<div class="video"><div class="hand" style="font-size:' + (big ? 36 : 26) + 'px">▶ ' + esc(L.video) + "</div>" + inner + "</div>";
  }
  function bindVideo(root) {
    root.querySelectorAll(".vfile").forEach(function (inp) {
      inp.addEventListener("change", function () {
        var f = inp.files[0]; if (!f) return;
        var v = inp.closest(".video").querySelector("video");
        if (v.src) URL.revokeObjectURL(v.src);
        v.src = URL.createObjectURL(f); v.hidden = false; v.play();
      });
    });
  }

  /* ---------- 화면 ---------- */
  app.innerHTML =
    '<nav class="lesson-pick">' + D.lessons.map(function (l) {
      return '<a href="lesson.html?l=' + l.no + '"' + (l.no === no ? ' aria-current="page"' : "") + ' style="--c:' + l.color + ";--soft:" + l.soft + '">' + BC.face(l, 30) + l.no + "차시</a>";
    }).join("") + "</nav>" +
    '<div class="lhead">' + BC.face(L, 112) + "<div>" +
    '<p class="kicker">' + no + "차시 · " + esc(L.animal) + "</p><h1>" + esc(L.title) + "</h1>" +
    '<div class="goal"><b>공부할 문제</b> ' + esc(L.goal) + "</div>" +
    '<p style="margin-top:12px" class="t-only"><button class="btn c" id="go-present">🖥 수업 모드</button></p></div></div>' +
    '<div class="tabs" role="tablist">' +
    '<button role="tab" data-t="learn">배우기</button><button role="tab" data-t="sheet">활동지</button>' +
    (L.quiz.length ? '<button role="tab" data-t="quiz">퀴즈</button>' : "") +
    '<button role="tab" data-t="teacher" class="t-only">선생님</button></div>' +
    '<section data-p="learn"></section><section data-p="sheet"></section><section data-p="quiz"></section><section data-p="teacher"></section>';

  /* 배우기 */
  var P = function (k) { return app.querySelector('[data-p="' + k + '"]'); };
  P("learn").innerHTML =
    '<div class="grid" style="gap:28px">' +
    (no === 1 ? '<div class="card" style="border-color:var(--c)"><h3>먼저, 사전 설문에 참여해요</h3><p class="mute">환경 문제에 대한 내 생각을 투표해요.</p>' + BC.surveyBtn(0) + "</div>" : "") +
    "<div><h2>마음 열기</h2>" + qs(L.open) + "</div>" +
    "<div><h2>학습 활동</h2>" + '<div class="flow">' + L.activities.map(function (a, i) { return "<div><b>활동 " + (i + 1) + "</b>" + esc(a) + "</div>"; }).join("") + "</div></div>" +
    (L.video ? "<div><h2>영상 보기</h2>" + videoBox() + "</div>" : "") +
    '<div><h2 style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">오늘의 핵심 단어 <button class="btn line" id="hide-terms" style="font-family:Gothic A1;font-size:14px">뜻 가리고 맞혀 보기</button></h2><div id="terms">' + terms(false) + "</div></div>" +
    '<div class="card">' + learn() + "</div>" +
    '<div class="card"><p class="kicker">' + (no === 6 ? "변화 만들기" : "만들어 볼까요") + "</p><h3>" + esc(L.make.title) + "</h3><p>" + esc(L.make.text) + '</p><p class="mute" style="margin:0">예시) ' + esc(L.make.ex) + "</p></div>" +
    (no < 6 ? '<p><a class="btn line" href="play.html">🎮 놀이터에서 더 알아보기</a></p>' : '<div class="card" style="border-color:var(--c)"><h3>마지막으로, 사후 설문에 참여해요</h3><p class="mute">프로젝트를 마친 지금의 내 생각을 알려 주세요.</p><p style="display:flex;gap:8px;flex-wrap:wrap">' + BC.surveyBtn(1) + '<a class="btn line" href="pledge.html">🌱 실천 다짐 쓰러 가기</a></p></div>') +
    "</div>";
  bindVideo(P("learn"));
  var hidden = false;
  app.querySelector("#hide-terms").onclick = function () {
    hidden = !hidden;
    app.querySelector("#terms").innerHTML = terms(hidden);
    this.textContent = hidden ? "뜻 모두 보기" : "뜻 가리고 맞혀 보기";
  };
  app.querySelector("#terms").addEventListener("click", function (e) { var t = e.target.closest(".term"); if (t) t.classList.toggle("hide"); });

  /* 활동지 */
  var S = BC.get("sheet" + no, {});
  var who = BC.get("who", {});
  function field(id, label, rows, ph) {
    return '<label class="field"><span>' + esc(label) + "</span>" +
      (rows === 1 ? '<input type="text" data-id="' + id + '" placeholder="' + esc(ph || "") + '">' : '<textarea data-id="' + id + '" rows="' + (rows || 3) + '" placeholder="' + esc(ph || "") + '"></textarea>') + "</label>";
  }
  var sh = '<div class="card" style="margin-bottom:18px"><h2 style="margin-bottom:6px">[' + no + "차시] " + esc(L.title) + "</h2>" +
    '<div class="who"><input data-who="ban" placeholder="반"><input data-who="num" placeholder="번호"><input data-who="name" placeholder="이름 (선택)"></div>' +
    '<p class="mute" style="margin:0;font-size:14px">쓴 내용은 이 기기에 저장돼요. 다 쓰면 아래 <b>다 했어요</b>를 눌러 배지를 받아요.</p></div>';
  // 마음 열기
  sh += '<div class="card sheet-sec"><h3><span class="chip">마음 열기</span> 생각해 보기</h3>' + L.open.map(function (q, i) { return field("o" + i, q, no === 6 && i < 2 ? 1 : 3); }).join("") + "</div>";
  // 알아보아요 (1차시만 쓰기)
  if (no === 1) sh += '<div class="card sheet-sec"><h3><span class="chip">알아보아요</span> 나만의 동물과 완벽한 서식지</h3>' + field("a0", "내가 상상한 동물", 2) + field("a1", "이 동물이 살아가는 데 꼭 필요한 것", 3, "예: 깨끗한 물, 신선한 풀, 숨을 동굴") + "</div>";
  if (no === 6) {
    sh += '<div class="card sheet-sec"><h3><span class="chip">소개하기</span> 작품 설명 카드</h3>' + field("c0", "작품명", 1) +
      '<div class="field"><span>보호하고 싶은 동물</span><div class="picks">' + ["북극곰", "꿀벌", "벵갈호랑이", "바다거북", "기타"].map(function (a) {
        return '<label><input type="radio" name="c1" data-id="c1" value="' + a + '">' + a + "</label>";
      }).join("") + "</div></div>" + field("c2", "핵심 기능", 3) + "</div>";
    sh += '<div class="card sheet-sec"><h3><span class="chip">변화 만들기</span> 세상을 바꾸는 작은 편지</h3><p class="mute">우리가 만든 아이디어 중 학교나 집에서 바로 실천할 수 있는 것을 골라 제안해요.</p>' +
      field("l0", "받는 사람", 1, "예: 교장 선생님, 우리 가족") + field("l1", "편지 내용", 7) + field("l2", "보내는 사람", 1) + "</div>";
  } else {
    sh += '<div class="card sheet-sec"><h3><span class="chip">만들어 볼까요</span> ' + esc(L.make.title) + '</h3><p class="mute">' + esc(L.make.text) + '</p><p style="font-weight:700;margin:12px 0 6px">아이디어 스케치</p><div id="pad"></div>' +
      '<div class="grid g2" style="margin-top:12px">' + field("m0", "작품 이름", 1) + field("m1", "어떻게 도와주나요? (아이디어 카드)", 2) + "</div></div>";
  }
  sh += '<div class="card sheet-sec"><h3><span class="chip">성찰하기</span> 돌아보기</h3>' + L.reflect.map(function (q, i) { return field("r" + i, q, 3); }).join("") + "</div>";
  sh += '<div class="sheet-actions"><button class="btn c" id="done">✔ 다 했어요</button><button class="btn line" id="print">🖨 인쇄</button>' + (no < 6 ? '<button class="btn line" id="savepic">🖼 스케치 저장</button>' : "") + "</div>";
  P("sheet").innerHTML = sh;

  var sheet = P("sheet");
  sheet.querySelectorAll("[data-id]").forEach(function (el) {
    var v = S[el.dataset.id];
    if (el.type === "radio") el.checked = v === el.value; else if (v) el.value = v;
    el.addEventListener(el.type === "radio" ? "change" : "input", function () {
      S[el.dataset.id] = el.value; BC.set("sheet" + no, S);
    });
  });
  sheet.querySelectorAll("[data-who]").forEach(function (el) {
    el.value = who[el.dataset.who] || "";
    el.addEventListener("input", function () { who[el.dataset.who] = el.value; BC.set("who", who); });
  });
  var pad = sheet.querySelector("#pad"), padCanvas;
  if (pad) padCanvas = BC.drawPad(pad, BC.get("sketch" + no, ""), function (url) { BC.set("sketch" + no, url); });
  sheet.querySelector("#print").onclick = function () { window.print(); };
  var sp = sheet.querySelector("#savepic");
  if (sp) sp.onclick = function () {
    var a = document.createElement("a");
    a.download = no + "차시_아이디어_스케치.png"; a.href = padCanvas.toDataURL("image/png"); a.click();
  };
  sheet.querySelector("#done").onclick = function () {
    var filled = Object.keys(S).filter(function (k) { return String(S[k]).trim(); }).length;
    if (filled < 2) { BC.toast("조금 더 써 볼까요? 두 칸 이상 채워 주세요"); return; }
    if (BC.giveBadge(no)) BC.toast("🎉 " + L.animal + " 배지를 받았어요!"); else BC.toast("저장했어요. 배지는 이미 받았어요!");
  };

  /* 퀴즈 */
  if (L.quiz.length) {
    var qz = P("quiz"), right = 0, done = 0;
    qz.innerHTML = '<div class="quiz">' + L.quiz.map(function (q, i) {
      return '<div class="card q" data-q="' + i + '"><p>Q' + (i + 1) + ". " + esc(q.q) + '</p><div class="opts">' +
        q.o.map(function (o, j) { return '<button data-j="' + j + '">' + "ABC"[j] + ". " + esc(o) + "</button>"; }).join("") + "</div></div>";
    }).join("") + '<div class="card" id="score" hidden></div></div>';
    qz.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-j]"); if (!b) return;
      var box = b.closest("[data-q]"), q = L.quiz[+box.dataset.q], j = +b.dataset.j;
      box.querySelectorAll("button").forEach(function (x) { x.disabled = true; });
      b.classList.add(j === q.a ? "ok" : "no");
      box.querySelectorAll("button")[q.a].classList.add("ok");
      box.insertAdjacentHTML("beforeend", '<div class="why">' + (j === q.a ? "⭕ 정답! " : "❌ 아쉬워요. ") + esc(q.why) + "</div>");
      done++; if (j === q.a) right++;
      if (done === L.quiz.length) {
        var sc = qz.querySelector("#score"); sc.hidden = false;
        var full = right === done;
        sc.innerHTML = '<h3>' + done + "문제 중 " + right + "문제 맞혔어요" + (full ? " 🎉" : "") + "</h3>" +
          (full ? "<p>" + (BC.giveBadge(no) ? esc(L.animal) + " 배지를 받았어요!" : "배지는 이미 받았어요.") + "</p>" : '<p>다시 풀어서 모두 맞히면 배지를 받아요.</p><button class="btn c" onclick="location.reload()">다시 풀기</button>');
      }
    });
  }

  /* 선생님 */
  var T = '<div class="grid" style="gap:28px">';
  T += '<div class="card" style="border-color:var(--c);display:flex;gap:12px;align-items:center;flex-wrap:wrap;justify-content:space-between"><b>교실 TV로 수업하기</b><span style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn c" data-present>🖥 수업 모드 시작</button><a class="btn line" href="qr.html?l=' + no + '">📱 학생 접속 QR</a></span></div>';
  T += '<div class="card"><h3>학습 목표</h3><ol style="margin:0;padding-left:20px">' + L.aims.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") + "</ol>" +
    '<p class="mute" style="margin:10px 0 0;font-size:14px">' + no + "/6차시 · 대상 " + esc(D.grade) + " · 관련 교과 " + esc(D.subjects) + "</p></div>";
  T += "<div><h2>수업 흐름 (40분)</h2>" + L.steps.map(function (s) {
    return '<div class="step"><div class="n">' + esc(s.stage) + "<br>" + s.min + "분</div><div><h3>" + esc(s.title) + "</h3><p>" + esc(s.text) + "</p></div></div>";
  }).join("") + "</div>";
  T += '<div class="card"><h3>준비물</h3><p>' + L.materials.map(function (m) { return '<span class="chip" style="margin:0 4px 6px 0">' + esc(m) + "</span>"; }).join("") + "</p>" +
    (no === 1 ? '<p><a class="btn line" target="_blank" rel="noopener" href="' + esc(D.surveys[0].url) + '">📝 ' + esc(D.surveys[0].label) + "</a></p>" : "") +
    (no === 6 ? '<p><a class="btn line" target="_blank" rel="noopener" href="' + esc(D.surveys[1].url) + '">📝 ' + esc(D.surveys[1].label) + "</a></p>" : "") + "</div>";
  T += '<div><h2>평가 계획</h2><div class="tscroll"><table class="t"><tr><th>평가 내용</th><th>상</th><th>중</th><th>하</th><th>방법</th></tr>' + L.eval.map(function (e) {
    return "<tr><td><b>" + esc(e.what) + "</b></td><td>" + esc(e.high) + "</td><td>" + esc(e.mid) + "</td><td>" + esc(e.low) + "</td><td>" + esc(e.how) + "</td></tr>";
  }).join("") + "</table></div></div>";
  T += '<p class="mute" style="font-size:14px">성취기준과 지도 유의점, 전체 운영 안내는 <a href="teacher.html">선생님 화면</a>에 있어요.</p></div>';
  P("teacher").innerHTML = T;

  /* 탭 */
  function tab(k) {
    app.querySelectorAll("[role=tab]").forEach(function (b) { b.setAttribute("aria-selected", b.dataset.t === k); });
    app.querySelectorAll("[data-p]").forEach(function (p) { p.hidden = p.dataset.p !== k; });
    history.replaceState(null, "", "?l=" + no + "#" + k);
  }
  app.querySelector(".tabs").addEventListener("click", function (e) { var b = e.target.closest("[data-t]"); if (b) tab(b.dataset.t); });
  var h = location.hash.slice(1);
  tab(["learn", "sheet", "quiz", "teacher"].indexOf(h) >= 0 && (h !== "quiz" || L.quiz.length) && !(h === "teacher" && BC.student) ? h : "learn");

  /* ---------- 수업 모드 ---------- */
  function slides() {
    var s = [];
    s.push('<div style="text-align:center">' + BC.face(L, 220) + '<p class="kicker" style="font-size:22px;margin-top:16px">생물 다양성과 기후변화 · ' + no + "차시</p><h1>" + esc(L.title) + "</h1></div>");
    s.push('<p class="kicker" style="font-size:22px">마음 열기</p><h2>생각해 볼까요?</h2>' + qs(L.open));
    s.push('<div style="text-align:center"><p class="kicker" style="font-size:24px">공부할 문제</p><h2>' + esc(L.goal) + "</h2></div>");
    s.push('<p class="kicker" style="font-size:22px">학습 활동</p><h2>오늘 우리는</h2><div class="flow">' + L.activities.map(function (a, i) { return '<div class="big"><b>활동 ' + (i + 1) + "</b>" + esc(a) + "</div>"; }).join("") + "</div>");
    if (L.video) s.push(videoBox(true));
    s.push('<p class="kicker" style="font-size:22px">오늘의 핵심 단어</p><h2>단어를 익혀요 <span class="mute" style="font-size:.5em">(카드를 누르면 뜻이 보여요)</span></h2>' + terms(true));
    s.push(learn().replace("<h3>", "<h2>").replace("</h3>", "</h2>"));
    s.push('<p class="kicker" style="font-size:22px">' + (no === 6 ? "변화 만들기" : "이제 만들어 볼까요?") + "</p><h2>" + esc(L.make.title) + '</h2><p class="big">' + esc(L.make.text) + '</p><p class="mute big">예시) ' + esc(L.make.ex) + '</p><div class="timer" data-timer>15:00</div><p style="text-align:center"><button class="btn line" data-min="10">10분</button> <button class="btn line" data-min="15">15분</button> <button class="btn c" data-start>▶ 시작</button></p>');
    s.push('<p class="kicker" style="font-size:22px">' + (no === 6 ? "포스트잇 갤러리 워크" : "아이디어 전시회") + '</p><h2>만든 작품을 공유해 볼까요?</h2><ul class="qs"><li>작품을 책상 위에 놓고 설명 카드를 함께 올려요.</li><li>친구 작품을 둘러보며 설명을 귀 기울여 읽어요.</li><li>인상 깊은 작품에 칭찬 포스트잇을 붙여요.</li>' + (no < 6 ? "<li>사진을 찍어 온라인 갤러리에 올려요.</li>" : "") + "</ul>");
    L.quiz.forEach(function (q, i) {
      s.push('<p class="kicker" style="font-size:22px">즐거운 퀴즈 시간 · 문제 ' + (i + 1) + '</p><h2>' + esc(q.q) + '</h2><div class="quiz"><div class="opts">' + q.o.map(function (o, j) { return '<button class="big" data-j="' + j + '" data-a="' + q.a + '">' + "ABC"[j] + ". " + esc(o) + "</button>"; }).join("") + '</div><div class="why big" hidden>' + esc(q.why) + "</div></div>");
    });
    s.push('<p class="kicker" style="font-size:22px">성찰하기</p><h2>오늘을 돌아봐요</h2>' + qs(L.reflect));
    s.push('<div style="text-align:center"><h1>수고하셨습니다!</h1>' + (next ? '<p class="big">다음 시간엔<br>“' + esc(next.title) + '”<br>에 대해 배워 보겠습니다.</p>' + BC.face(next, 160) : '<p class="big">여러분은 Play2Change 프로젝트를<br>훌륭하게 마쳤습니다 🎉</p>') + "</div>");
    return s;
  }
  var timerId = null;
  function present() {
    var list = slides(), i = 0;
    var box = document.createElement("div");
    box.className = "present";
    box.innerHTML = '<div class="stage"><div class="slide"></div></div><div class="bar"><button class="btn line" data-x>✕ 닫기</button><button class="btn line" data-full>⛶ 전체 화면</button><span class="pg"></span><button class="btn line" data-prev>◀ 이전</button><button class="btn c" data-next>다음 ▶</button></div>';
    document.body.appendChild(box);
    var slide = box.querySelector(".slide"), pg = box.querySelector(".pg");
    function show() {
      clearInterval(timerId);
      slide.innerHTML = list[i]; pg.textContent = (i + 1) + " / " + list.length;
      bindVideo(slide);
    }
    function go(d) { i = Math.max(0, Math.min(list.length - 1, i + d)); show(); }
    function close() { clearInterval(timerId); document.removeEventListener("keydown", key); if (document.fullscreenElement) document.exitFullscreen(); box.remove(); }
    function key(e) {
      if (e.target.tagName === "INPUT") return;
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); go(1); }
      if (e.key === "ArrowLeft" || e.key === "PageUp") go(-1);
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", key);
    box.addEventListener("click", function (e) {
      var t = e.target;
      if (t.closest("[data-x]")) close();
      else if (t.closest("[data-next]")) go(1);
      else if (t.closest("[data-prev]")) go(-1);
      else if (t.closest("[data-full]")) { if (!document.fullscreenElement) box.requestFullscreen && box.requestFullscreen(); else document.exitFullscreen(); }
      else if (t.closest(".term")) t.closest(".term").classList.toggle("hide");
      else if (t.closest("[data-j]")) {
        var b = t.closest("[data-j]"), a = +b.dataset.a;
        b.parentNode.querySelectorAll("button").forEach(function (x, j) { x.disabled = true; if (j === a) x.classList.add("ok"); });
        if (+b.dataset.j !== a) b.classList.add("no");
        b.closest(".quiz").querySelector(".why").hidden = false;
      }
      else if (t.closest("[data-min]")) { clearInterval(timerId); slide.querySelector("[data-timer]").textContent = t.closest("[data-min]").dataset.min + ":00"; }
      else if (t.closest("[data-start]")) {
        var el = slide.querySelector("[data-timer]"), p = el.textContent.split(":"), left = +p[0] * 60 + +p[1];
        clearInterval(timerId);
        timerId = setInterval(function () {
          left--; if (left <= 0) { clearInterval(timerId); left = 0; el.textContent = "시간이 다 되었어요!"; return; }
          el.textContent = Math.floor(left / 60) + ":" + ("0" + left % 60).slice(-2);
        }, 1000);
      }
    });
    show();
  }
  document.getElementById("go-present").onclick = present;
  P("teacher").querySelectorAll("[data-present]").forEach(function (b) { b.onclick = present; });
  if (autoPresent && !BC.student) present();
})();
