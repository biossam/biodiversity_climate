/* 공통: 저장, 동물 배지 그림, 머리글 */
(function () {
  var D = window.BC_DATA;
  var BC = window.BC = { data: D };
  var KEY = "biocl:";

  BC.esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  BC.get = function (k, d) {
    try { var v = localStorage.getItem(KEY + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; }
  };
  BC.set = function (k, v) {
    try { localStorage.setItem(KEY + k, JSON.stringify(v)); } catch (e) {}
  };
  BC.lesson = function (no) { return D.lessons.filter(function (l) { return l.no === +no; })[0]; };
  BC.param = function (k) { return new URLSearchParams(location.search).get(k); };

  /* 배지 = 그 차시 활동지 '다 했어요' 또는 퀴즈 만점 */
  BC.badges = function () { return BC.get("badges", {}); };
  BC.giveBadge = function (no) {
    var b = BC.badges(); if (b[no]) return false;
    b[no] = Date.now(); BC.set("badges", b); return true;
  };

  /* 동물 얼굴 (직접 그린 단순 도형) */
  var FACE = {
    earth:
      '<circle cx="50" cy="52" r="27" fill="#5aa7e0"/>' +
      '<path d="M30 42c6-6 14-5 17 0s-2 9 3 13-1 10-7 9-12-6-13-11 0-11 0-11z" fill="#7cc576"/>' +
      '<path d="M58 30c7 1 13 6 15 12-4 2-9 1-11-3s-6-4-4-9z" fill="#7cc576"/>' +
      '<path d="M60 62c5-3 11-2 12 2-2 5-7 9-12 9-2-4-3-8 0-11z" fill="#7cc576"/>' +
      '<circle cx="42" cy="50" r="3" fill="#2b2b2b"/><circle cx="58" cy="50" r="3" fill="#2b2b2b"/>' +
      '<path d="M44 58q6 5 12 0" stroke="#2b2b2b" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
      '<circle cx="37" cy="57" r="3.5" fill="#f4a3a3" opacity=".8"/><circle cx="63" cy="57" r="3.5" fill="#f4a3a3" opacity=".8"/>',
    bear:
      '<circle cx="32" cy="32" r="9" fill="#fff" stroke="#c9d6e2" stroke-width="2"/><circle cx="68" cy="32" r="9" fill="#fff" stroke="#c9d6e2" stroke-width="2"/>' +
      '<circle cx="32" cy="32" r="4" fill="#e7eef5"/><circle cx="68" cy="32" r="4" fill="#e7eef5"/>' +
      '<ellipse cx="50" cy="54" rx="27" ry="25" fill="#fff" stroke="#c9d6e2" stroke-width="2"/>' +
      '<ellipse cx="50" cy="62" rx="11" ry="8" fill="#eef3f8"/>' +
      '<circle cx="40" cy="50" r="3" fill="#2b2b2b"/><circle cx="60" cy="50" r="3" fill="#2b2b2b"/>' +
      '<ellipse cx="50" cy="59" rx="4.5" ry="3.2" fill="#2b2b2b"/>' +
      '<path d="M46 65q4 3 8 0" stroke="#2b2b2b" stroke-width="2.2" fill="none" stroke-linecap="round"/>',
    bee:
      '<ellipse cx="36" cy="34" rx="11" ry="8" fill="#e8f4ff" stroke="#9cc4e4" stroke-width="2" transform="rotate(-25 36 34)"/>' +
      '<ellipse cx="64" cy="34" rx="11" ry="8" fill="#e8f4ff" stroke="#9cc4e4" stroke-width="2" transform="rotate(25 64 34)"/>' +
      '<ellipse cx="50" cy="56" rx="25" ry="22" fill="#ffd23f"/>' +
      '<path d="M27 50h46M26 60h48" stroke="#3a2e1f" stroke-width="6"/>' +
      '<ellipse cx="50" cy="56" rx="25" ry="22" fill="none" stroke="#e0a800" stroke-width="2"/>' +
      '<circle cx="42" cy="45" r="2.8" fill="#2b2b2b"/><circle cx="58" cy="45" r="2.8" fill="#2b2b2b"/>' +
      '<path d="M46 70q4 3 8 0" stroke="#3a2e1f" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
      '<path d="M44 34q-3-8-8-9M56 34q3-8 8-9" stroke="#3a2e1f" stroke-width="2" fill="none" stroke-linecap="round"/>',
    tiger:
      '<circle cx="31" cy="33" r="9" fill="#f08a3c"/><circle cx="69" cy="33" r="9" fill="#f08a3c"/>' +
      '<circle cx="31" cy="33" r="4" fill="#fff"/><circle cx="69" cy="33" r="4" fill="#fff"/>' +
      '<ellipse cx="50" cy="54" rx="27" ry="25" fill="#f08a3c"/>' +
      '<ellipse cx="50" cy="63" rx="14" ry="10" fill="#fff"/>' +
      '<path d="M50 30v9M43 32l2 7M57 32l-2 7M24 50h9M24 58h8M76 50h-9M76 58h-8" stroke="#3a2e1f" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="40" cy="50" r="3" fill="#2b2b2b"/><circle cx="60" cy="50" r="3" fill="#2b2b2b"/>' +
      '<path d="M46 58h8l-4 4z" fill="#e2687a"/>' +
      '<path d="M45 65q5 4 10 0" stroke="#2b2b2b" stroke-width="2.2" fill="none" stroke-linecap="round"/>',
    turtle:
      '<ellipse cx="50" cy="58" rx="28" ry="20" fill="#7fc58a"/>' +
      '<path d="M50 42l9 6v10l-9 6-9-6V48zM33 52l7 4v8l-7 2-6-6zM67 52l-7 4v8l7 2 6-6z" fill="#4f9d69"/>' +
      '<circle cx="50" cy="30" r="12" fill="#a9dcae"/>' +
      '<circle cx="45" cy="29" r="2.6" fill="#2b2b2b"/><circle cx="55" cy="29" r="2.6" fill="#2b2b2b"/>' +
      '<path d="M46 35q4 3 8 0" stroke="#2b2b2b" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="25" cy="72" rx="7" ry="4" fill="#a9dcae"/><ellipse cx="75" cy="72" rx="7" ry="4" fill="#a9dcae"/>',
    show:
      '<path d="M50 22l8 17 18 2-13 12 4 18-17-9-17 9 4-18-13-12 18-2z" fill="#ffcf4d" stroke="#e0a800" stroke-width="2" stroke-linejoin="round"/>' +
      '<circle cx="44" cy="46" r="2.8" fill="#2b2b2b"/><circle cx="56" cy="46" r="2.8" fill="#2b2b2b"/>' +
      '<path d="M45 53q5 4 10 0" stroke="#2b2b2b" stroke-width="2.2" fill="none" stroke-linecap="round"/>' +
      '<path d="M22 28l3 3M78 28l-3 3M20 66l4-1M80 66l-4-1" stroke="#8a5cc2" stroke-width="3" stroke-linecap="round"/>'
  };

  BC.face = function (l, size, locked) {
    size = size || 64;
    return '<svg class="face' + (locked ? " locked" : "") + '" width="' + size + '" height="' + size + '" viewBox="0 0 100 100" aria-hidden="true">' +
      '<circle cx="50" cy="50" r="47" fill="' + l.soft + '" stroke="' + l.color + '" stroke-width="4"/>' + FACE[l.key] + "</svg>";
  };

  /* 머리글 */
  BC.header = function (cur) {
    var links = [["./", "처음", "home"], ["lesson.html?l=1", "6차시", "lesson"], ["words.html", "개념 사전", "words"], ["play.html", "놀이터", "play"], ["pledge.html", "실천 다짐", "pledge"], ["teacher.html", "선생님", "teacher"]];
    var h = document.createElement("header");
    h.className = "top";
    h.innerHTML = '<div class="wrap top-in"><a class="brand" href="./">' + BC.face(D.lessons[0], 34) + "<span>" + BC.esc(D.title) + "</span></a>" +
      '<nav class="nav">' + links.map(function (a) {
        return '<a href="' + a[0] + '"' + (a[2] === cur ? ' aria-current="page"' : "") + ">" + a[1] + "</a>";
      }).join("") + "</nav></div>";
    document.body.insertBefore(h, document.body.firstChild);
    var f = document.createElement("footer");
    f.className = "foot";
    f.innerHTML = '<div class="wrap"><p>' + BC.esc(D.credit) + "</p><p>LEGO®는 LEGO Group의 상표입니다. 이 사이트의 그림·놀이·퀴즈는 수업을 돕기 위해 새로 만든 것입니다.</p></div>";
    document.body.appendChild(f);
  };

  BC.toast = function (msg) {
    var t = document.createElement("div");
    t.className = "toast"; t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add("on"); }, 10);
    setTimeout(function () { t.classList.remove("on"); setTimeout(function () { t.remove(); }, 400); }, 2600);
  };
})();
