/* ============================================================
   Dr. Ir. Abanob Soliman — site behaviour
   No dependencies. Everything degrades without JavaScript.
   ============================================================ */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ── Footer year ─────────────────────────────────────────── */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ── Theme ───────────────────────────────────────────────── */
  var themeBtn = document.getElementById('themeToggle');

  function syncThemeLabel() {
    if (!themeBtn) return;
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    themeBtn.setAttribute('aria-label', 'Switch to ' + next + ' theme');
  }
  syncThemeLabel();

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('theme', root.dataset.theme); } catch (e) { /* storage blocked */ }
      syncThemeLabel();
      window.dispatchEvent(new CustomEvent('themechange'));
    });
  }


  /* ── Stat counters ───────────────────────────────────────── */
  var countersDone = false;

  function runCounters() {
    if (countersDone) return;
    countersDone = true;
    var stats = document.querySelectorAll('.stat dd[data-count]');
    Array.prototype.forEach.call(stats, function (el) {
      var target = parseInt(el.dataset.count, 10);
      var suffix = el.dataset.suffix || '';
      if (reduceMotion.matches || !target) { el.textContent = target + suffix; return; }
      var start = performance.now(), dur = 850;
      (function step(now) {
        var p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(step);
      })(start);
    });
  }


  /* ── Tabs ─────────────────────────────────────────────────
     Standard ARIA tabs: click, arrow keys, Home/End. The URL
     hash mirrors the open tab so sections stay linkable.
     ────────────────────────────────────────────────────────── */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var panelsWrap = document.getElementById('panels');
  var ink = document.getElementById('tabsInk');
  var panelFor = {};

  tabs.forEach(function (tab) {
    panelFor[tab.id] = document.getElementById(tab.getAttribute('aria-controls'));
  });

  function nameOf(tab) { return tab.id.replace(/^tab-/, ''); }

  function moveInk(tab) {
    if (!ink || !tab) return;
    ink.style.width = tab.offsetWidth + 'px';
    ink.style.transform = 'translateX(' + tab.offsetLeft + 'px)';
  }

  function updateEndFade() {
    if (!panelsWrap) return;
    var panel = panelsWrap.querySelector('.panel.is-active');
    if (!panel) return;
    var atEnd = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 8;
    panelsWrap.classList.toggle('is-end', atEnd);
  }

  function selectTab(tab, opts) {
    if (!tab) return;
    opts = opts || {};

    tabs.forEach(function (t) {
      var on = t === tab;
      var panel = panelFor[t.id];
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (!panel) return;
      panel.classList.toggle('is-active', on);
      // `hidden` keeps assistive tech in step with what is painted.
      if (on) panel.removeAttribute('hidden');
      else panel.setAttribute('hidden', '');
    });

    var active = panelFor[tab.id];
    if (active) {
      active.scrollTop = 0;
      if (active.id === 'panel-overview') runCounters();
    }

    moveInk(tab);
    updateEndFade();
    tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    if (opts.focus) tab.focus();

    // Below the console breakpoint the page itself scrolls, so bring the
    // freshly opened panel back up to the tab strip.
    if (opts.history !== false && window.matchMedia('(max-width: 1023px)').matches) {
      var stageEl = document.getElementById('stage');
      if (stageEl) stageEl.scrollIntoView({ block: 'start' });
    }

    if (opts.history !== false) {
      var hash = '#' + nameOf(tab);
      if (location.hash !== hash) history.pushState({ tab: tab.id }, '', hash);
    }
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () { selectTab(tab); });
  });

  var tablist = document.querySelector('.tabs');
  if (tablist) {
    tablist.addEventListener('keydown', function (e) {
      var i = tabs.indexOf(document.activeElement);
      if (i === -1) return;
      var next = null;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      else if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') next = tabs[0];
      else if (e.key === 'End') next = tabs[tabs.length - 1];
      if (!next) return;
      e.preventDefault();
      selectTab(next, { focus: true });
    });
  }

  function tabFromHash() {
    var name = (location.hash || '').replace(/^#/, '');
    return name ? document.getElementById('tab-' + name) : null;
  }

  window.addEventListener('popstate', function () {
    selectTab(tabFromHash() || tabs[0], { history: false });
  });

  // Any in-page link (the wordmark, the skip link) opens the matching tab.
  document.addEventListener('click', function (e) {
    if (!e.target || !e.target.closest) return;
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var target = document.getElementById('tab-' + a.getAttribute('href').slice(1));
    if (!target) return;
    e.preventDefault();
    selectTab(target);
  });

  if (panelsWrap) {
    panelsWrap.addEventListener('scroll', updateEndFade, { capture: true, passive: true });
  }
  window.addEventListener('resize', function () {
    moveInk(tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0]);
    updateEndFade();
  }, { passive: true });

  // Initial state — honour a hash if we arrived with one.
  selectTab(tabFromHash() || tabs[0], { history: false });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      moveInk(tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0]);
      updateEndFade();
    });
  }


  /* ── Publication filter ──────────────────────────────────── */
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip[data-filter]'));
  var pubs = Array.prototype.slice.call(document.querySelectorAll('#pubs .pub'));
  var pubsEmpty = document.getElementById('pubsEmpty');

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var want = chip.dataset.filter, shown = 0;
      chips.forEach(function (c) {
        var on = c === chip;
        c.classList.toggle('is-on', on);
        c.setAttribute('aria-pressed', String(on));
      });
      pubs.forEach(function (pub) {
        var match = want === 'all' || pub.dataset.type === want;
        pub.hidden = !match;
        if (match) shown++;
      });
      if (pubsEmpty) pubsEmpty.hidden = shown !== 0;
      updateEndFade();
    });
  });


  /* ══════════════════════════════════════════════════════════
     The live map — a sparse SLAM viewer.

     Landmark cloud, the estimated trajectory, keyframe poses,
     loop-closure constraints, and the pose being estimated now.
     Milestone keyframes correspond to the roles on the
     Experience tab, so hovering a role finds it in the map.
     ══════════════════════════════════════════════════════════ */
  var canvas = document.getElementById('slam');
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext('2d');
  var stage = canvas.parentElement;
  var W = 0, H = 0, DPR = 1;

  // Deterministic noise, so the map is the same on every visit.
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  var rand = mulberry32(20260126);

  /* ── Scene ──────────────────────────────────────────────── */
  var PATH_N = 560;
  var path = [];
  for (var i = 0; i < PATH_N; i++) {
    var t = (i / PATH_N) * Math.PI * 2;
    path.push({
      x: 22 * Math.sin(t) + 8 * Math.sin(3 * t + 0.7),
      y: 2.6 * Math.sin(2 * t + 1.1) - 1.2,
      z: 19 * Math.cos(t) + 6.5 * Math.cos(2 * t)
    });
  }

  var fwd = path.map(function (p, idx) {
    var q = path[(idx + 4) % PATH_N];
    var dx = q.x - p.x, dy = q.y - p.y, dz = q.z - p.z;
    var L = Math.hypot(dx, dy, dz) || 1;
    return { x: dx / L, y: dy / L, z: dz / L };
  });

  /* Landmarks. A real sparse map is not a uniform cloud — features cling to
     structure. Building them as vertical elements standing on a ground plane
     (trunks, posts, edges) is what makes it read as a mapped corridor. */
  var GROUND = 8;                                    // +y points down
  var landmarks = [];
  function landmark(x, y, z, w) { landmarks.push({ x: x, y: y, z: z, w: w }); }

  for (var st = 0; st < 82; st++) {                  // vertical structure
    var base = path[Math.floor(rand() * PATH_N)];
    var ang = rand() * Math.PI * 2;
    var off = 4 + rand() * 12;
    var bx = base.x + Math.cos(ang) * off;
    var bz = base.z + Math.sin(ang) * off;
    var h = 8 + rand() * 18;
    var n = 6 + Math.floor(rand() * 8);
    for (var q = 0; q < n; q++) {
      landmark(bx + (rand() - 0.5) * 0.9,
               GROUND - (q / (n - 1)) * h,
               bz + (rand() - 0.5) * 0.9,
               0.45 + rand() * 0.5);
    }
  }

  for (var gc = 0; gc < 250; gc++) {                 // ground clutter
    var ga = path[Math.floor(rand() * PATH_N)];
    var gr = rand() * 19, gt = rand() * Math.PI * 2;
    landmark(ga.x + Math.cos(gt) * gr, GROUND - rand() * 1.6, ga.z + Math.sin(gt) * gr, 0.3 + rand() * 0.4);
  }

  for (var sc = 0; sc < 170; sc++) {                 // distant scenery
    var sa = rand() * Math.PI * 2, sr = 27 + rand() * 19;
    landmark(Math.cos(sa) * sr, GROUND - rand() * 24, Math.sin(sa) * sr, 0.25 + rand() * 0.3);
  }

  var LM_N = landmarks.length;

  var KF_EVERY = 28;
  var kfIdx = [];
  for (var kf = 0; kf < PATH_N; kf += KF_EVERY) kfIdx.push(kf);

  // Milestone keyframes — one per role on the Experience tab.
  var MILESTONES = 7;
  var milestone = [];
  for (var m = 0; m < MILESTONES; m++) {
    milestone.push(kfIdx[Math.round(m * (kfIdx.length - 1) / (MILESTONES - 1))]);
  }

  // Loop closures: keyframe pairs that are close in space but far apart in time.
  function findClosures(maxDist) {
    var out = [];
    for (var a = 0; a < kfIdx.length; a++) {
      for (var b = a + 1; b < kfIdx.length; b++) {
        var sep = Math.abs(kfIdx[b] - kfIdx[a]);
        sep = Math.min(sep, PATH_N - sep);
        if (sep < 110) continue;
        var p1 = path[kfIdx[a]], p2 = path[kfIdx[b]];
        var d = Math.hypot(p1.x - p2.x, p1.y - p2.y, p1.z - p2.z);
        if (d < maxDist) out.push([kfIdx[a], kfIdx[b]]);
      }
    }
    return out;
  }
  var closures = [], thresh = 8;
  while (closures.length < 4 && thresh < 46) { closures = findClosures(thresh); thresh += 3; }
  if (closures.length > 9) closures = closures.slice(0, 9);

  /* ── Palette, driven by the CSS custom properties ───────── */
  var pal = {};
  function hexToRgb(hex) {
    hex = (hex || '').trim().replace('#', '');
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    var n = parseInt(hex, 16);
    return isNaN(n) ? [128, 128, 128] : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function readPalette() {
    var cs = getComputedStyle(root);
    pal.far = hexToRgb(cs.getPropertyValue('--viz-far'));
    pal.near = hexToRgb(cs.getPropertyValue('--viz-near'));
    pal.trace = hexToRgb(cs.getPropertyValue('--viz-trace'));
    pal.grid = cs.getPropertyValue('--viz-grid').trim() || 'rgba(128,128,128,.1)';
    pal.bg = cs.getPropertyValue('--viz-bg').trim() || '#ffffff';
  }
  readPalette();

  function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
  function mix(a, b, m) {
    return [Math.round(a[0] + (b[0] - a[0]) * m),
            Math.round(a[1] + (b[1] - a[1]) * m),
            Math.round(a[2] + (b[2] - a[2]) * m)];
  }

  /* ── Camera ─────────────────────────────────────────────── */
  var YAW0 = 0, PITCH0 = -0.34, DIST0 = 62;
  var yaw = YAW0, pitch = PITCH0, dist = DIST0;
  var yawVel = 0, pitchTarget = PITCH0, distTarget = DIST0;
  var focal = 0, cxp = 0, cyp = 0;
  var lastInteract = -1e9;

  function resize() {
    var rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return false;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = rect.width; H = rect.height;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    focal = Math.max(W, H) * 0.95;
    cxp = W * 0.5;
    cyp = H * 0.5;
    return true;
  }

  function project(p) {
    var cy = Math.cos(yaw), sy = Math.sin(yaw);
    var x = p.x * cy - p.z * sy;
    var z = p.x * sy + p.z * cy;
    var cp = Math.cos(pitch), sp = Math.sin(pitch);
    var y2 = p.y * cp - z * sp;
    var z2 = p.y * sp + z * cp + dist;
    if (z2 < 4) return null;
    var f = focal / z2;
    return { x: cxp + x * f, y: cyp + y2 * f, d: z2, f: f };
  }

  function drawGrid() {
    var R = 46, step = 7.6, gy = GROUND;
    ctx.strokeStyle = pal.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (var g = -R; g <= R; g += step) {
      var a1 = project({ x: -R, y: gy, z: g }), a2 = project({ x: R, y: gy, z: g });
      if (a1 && a2) { ctx.moveTo(a1.x, a1.y); ctx.lineTo(a2.x, a2.y); }
      var b1 = project({ x: g, y: gy, z: -R }), b2 = project({ x: g, y: gy, z: R });
      if (b1 && b2) { ctx.moveTo(b1.x, b1.y); ctx.lineTo(b2.x, b2.y); }
    }
    ctx.stroke();
  }

  function drawFrustum(idx, alpha, size, fill) {
    var p = path[idx], f = fwd[idx];
    // Orthonormal frame about the forward vector: right = up(0,1,0) × f, then up' = right × f.
    var rx = f.z, ry = 0, rz = -f.x;
    var rl = Math.hypot(rx, ry, rz) || 1;
    rx /= rl; ry /= rl; rz /= rl;
    var ux = ry * f.z - rz * f.y, uy = rz * f.x - rx * f.z, uz = rx * f.y - ry * f.x;

    var d = size, w = size * 0.62, h = size * 0.42;
    var apex = project(p);
    if (!apex) return null;

    var corners = [[1, 1], [1, -1], [-1, -1], [-1, 1]].map(function (s) {
      return project({
        x: p.x + f.x * d + rx * w * s[0] + ux * h * s[1],
        y: p.y + f.y * d + ry * w * s[0] + uy * h * s[1],
        z: p.z + f.z * d + rz * w * s[0] + uz * h * s[1]
      });
    });
    if (corners.indexOf(null) !== -1) return apex;

    if (fill) {
      ctx.fillStyle = rgba(pal.trace, alpha * 0.18);
      ctx.beginPath();
      ctx.moveTo(corners[0].x, corners[0].y);
      for (var c2 = 1; c2 < 4; c2++) ctx.lineTo(corners[c2].x, corners[c2].y);
      ctx.closePath();
      ctx.fill();
    }

    ctx.strokeStyle = rgba(pal.trace, alpha);
    ctx.lineWidth = fill ? 1.4 : 1;
    ctx.beginPath();
    for (var c = 0; c < 4; c++) {
      ctx.moveTo(apex.x, apex.y);
      ctx.lineTo(corners[c].x, corners[c].y);
      ctx.lineTo(corners[(c + 1) % 4].x, corners[(c + 1) % 4].y);
    }
    ctx.stroke();
    return apex;
  }

  /* ── Runtime state ──────────────────────────────────────── */
  var head = 0;
  var assoc = [];
  var hot = -1;                       // milestone highlighted from the Experience tab
  var frames = 0, fpsAt = 0;
  var hLm = document.getElementById('hLm');
  var hKf = document.getElementById('hKf');
  var hLc = document.getElementById('hLc');
  var hFps = document.getElementById('hFps');
  var poseX = document.getElementById('poseX');
  var poseY = document.getElementById('poseY');
  var poseZ = document.getElementById('poseZ');
  var poseAt = 0;

  function refreshAssociations() {
    var p = path[head | 0];
    assoc.length = 0;
    if (!p) return;
    for (var i = 0; i < landmarks.length && assoc.length < 8; i++) {
      var l = landmarks[(i * 37 + (head | 0)) % landmarks.length];
      var dx = l.x - p.x, dy = l.y - p.y, dz = l.z - p.z;
      if (dx * dx + dy * dy + dz * dz < 130) assoc.push(l);
    }
  }

  function render(now) {
    ctx.clearRect(0, 0, W, H);

    var glow = ctx.createRadialGradient(cxp, cyp, 0, cxp, cyp, Math.max(W, H) * 0.7);
    glow.addColorStop(0, rgba(pal.near, 0.09));
    glow.addColorStop(1, rgba(pal.near, 0));
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    drawGrid();

    // Landmarks, far to near, depth-coded.
    var pts = [];
    for (var i = 0; i < landmarks.length; i++) {
      var q = project(landmarks[i]);
      if (q) { q.w = landmarks[i].w; pts.push(q); }
    }
    pts.sort(function (a, b) { return b.d - a.d; });
    for (var j = 0; j < pts.length; j++) {
      var q2 = pts[j];
      var mNear = Math.max(0, Math.min(1, 1 - (q2.d - 34) / 62));
      ctx.fillStyle = rgba(mix(pal.far, pal.near, mNear), 0.26 + mNear * 0.68);
      ctx.beginPath();
      ctx.arc(q2.x, q2.y, Math.max(0.5, Math.min(2.9, q2.f * 1.15 * q2.w)), 0, 6.2832);
      ctx.fill();
    }

    // Loop-closure constraints.
    ctx.setLineDash([3, 4]);
    ctx.lineWidth = 1;
    for (var lc = 0; lc < closures.length; lc++) {
      var c1 = project(path[closures[lc][0]]), c2b = project(path[closures[lc][1]]);
      if (!c1 || !c2b) continue;
      ctx.strokeStyle = rgba(pal.trace, 0.3);
      ctx.beginPath();
      ctx.moveTo(c1.x, c1.y);
      ctx.lineTo(c2b.x, c2b.y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // The estimated trajectory.
    ctx.strokeStyle = rgba(pal.trace, 0.42);
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    for (var s = 0; s <= PATH_N; s++) {
      var pp = project(path[s % PATH_N]);
      if (!pp) continue;
      if (s === 0) ctx.moveTo(pp.x, pp.y); else ctx.lineTo(pp.x, pp.y);
    }
    ctx.stroke();

    // Registered keyframes.
    for (var a2 = 0; a2 < kfIdx.length; a2++) drawFrustum(kfIdx[a2], 0.42, 2.7, false);

    // Milestone keyframes — the roles.
    for (var ms = 0; ms < milestone.length; ms++) {
      var isHot = ms === hot;
      var apex = drawFrustum(milestone[ms], isHot ? 0.95 : 0.42, isHot ? 5.2 : 3, isHot);
      if (apex && isHot) {
        var pulse = 7 + Math.sin(now / 180) * 2.5;
        ctx.strokeStyle = rgba(pal.trace, 0.9);
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(apex.x, apex.y, pulse, 0, 6.2832);
        ctx.stroke();
      }
    }

    // The pose being estimated right now, with a fading tail.
    var TAIL = 74;
    ctx.lineWidth = 1.6;
    for (var u = 0; u < TAIL; u++) {
      var i0 = (Math.floor(head) - u + PATH_N * 2) % PATH_N;
      var i1 = (i0 + 1) % PATH_N;
      var t0 = project(path[i0]), t1 = project(path[i1]);
      if (!t0 || !t1) continue;
      ctx.strokeStyle = rgba(pal.trace, (1 - u / TAIL) * 0.85);
      ctx.beginPath();
      ctx.moveTo(t0.x, t0.y);
      ctx.lineTo(t1.x, t1.y);
      ctx.stroke();
    }

    var hp = project(path[Math.floor(head)]);
    if (hp) {
      // Feature associations from the current pose.
      for (var an = 0; an < assoc.length; an++) {
        var lp = project(assoc[an]);
        if (!lp) continue;
        var flick = 0.16 + 0.16 * Math.sin(now / 220 + an * 1.7);
        ctx.strokeStyle = rgba(pal.trace, flick);
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(hp.x, hp.y);
        ctx.lineTo(lp.x, lp.y);
        ctx.stroke();
        ctx.strokeStyle = rgba(pal.trace, flick * 2.4);
        ctx.strokeRect(lp.x - 3.5, lp.y - 3.5, 7, 7);
      }

      drawFrustum(Math.floor(head), 0.95, 4.6, true);

      // Pose uncertainty.
      ctx.strokeStyle = rgba(pal.trace, 0.35);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(hp.x, hp.y, 13 + Math.sin(now / 900) * 2, 7 + Math.cos(now / 700) * 1.5,
                  now / 3000, 0, 6.2832);
      ctx.stroke();

      ctx.fillStyle = rgba(pal.trace, 1);
      ctx.beginPath();
      ctx.arc(hp.x, hp.y, 2.6, 0, 6.2832);
      ctx.fill();
    }
  }

  /* ── Loop control ───────────────────────────────────────── */
  var raf = null, last = 0, visible = true, paused = false, dragging = false;

  function frame(now) {
    raf = requestAnimationFrame(frame);

    // The rAF timestamp can predate the performance.now() taken in start(),
    // so guard against negative and non-finite deltas before they walk the
    // path index out of bounds.
    var dt = now - last;
    if (!(dt > 0)) dt = 16;
    dt = Math.min(dt, 50);
    last = now;

    if (!dragging) {
      yaw += yawVel;
      yawVel *= 0.93;
      if (now - lastInteract > 2000) yaw += dt * 0.00005;   // idle drift resumes
    }
    pitch += (pitchTarget - pitch) * 0.12;
    dist += (distTarget - dist) * 0.12;

    head = (head + dt * 0.022) % PATH_N;
    if (head < 0) head += PATH_N;
    if ((frames & 15) === 0) refreshAssociations();

    render(now);

    // Pose readout, throttled — no need to repaint text every frame.
    if (now - poseAt > 100 && poseX) {
      poseAt = now;
      var cp2 = path[Math.floor(head)];
      if (cp2) {
        poseX.textContent = cp2.x.toFixed(2);
        poseY.textContent = (-cp2.y).toFixed(2);
        poseZ.textContent = cp2.z.toFixed(2);
      }
    }

    frames++;
    if (now - fpsAt > 500) {
      if (hFps) hFps.textContent = Math.max(1, Math.min(Math.round(frames * 1000 / (now - fpsAt)), 120));
      frames = 0; fpsAt = now;
    }
  }

  function start() {
    if (raf !== null || !visible || paused || reduceMotion.matches) return;
    last = performance.now();
    fpsAt = last;
    frames = 0;
    raf = requestAnimationFrame(frame);
  }
  function stop() { if (raf !== null) { cancelAnimationFrame(raf); raf = null; } }
  function repaint() { if (raf === null && W) render(performance.now()); }

  /* ── Interaction: drag to orbit ─────────────────────────── */
  var viewer = document.querySelector('.viewer');
  var hint = document.getElementById('vwHint');
  var pointerId = null, lastX = 0, lastY = 0;

  if (stage) {
    stage.addEventListener('pointerdown', function (e) {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      pointerId = e.pointerId;
      dragging = true;
      lastX = e.clientX; lastY = e.clientY;
      lastInteract = performance.now();
      stage.classList.add('is-dragging');
      stage.setPointerCapture(e.pointerId);
      if (hint) hint.classList.add('is-gone');
    });

    stage.addEventListener('pointermove', function (e) {
      if (!dragging || e.pointerId !== pointerId) return;
      var dx = e.clientX - lastX, dy = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      lastInteract = performance.now();
      yaw -= dx * 0.006;
      yawVel = -dx * 0.0009;
      pitchTarget = Math.max(-1.25, Math.min(0.25, pitchTarget + dy * 0.005));
      if (paused || reduceMotion.matches) { pitch = pitchTarget; repaint(); }
    });

    function endDrag(e) {
      if (pointerId === null || (e && e.pointerId !== pointerId)) return;
      dragging = false;
      pointerId = null;
      lastInteract = performance.now();
      stage.classList.remove('is-dragging');
    }
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);
  }

  var resetBtn = document.getElementById('vwReset');
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      pitchTarget = PITCH0;
      distTarget = DIST0;
      yawVel = 0;
      lastInteract = performance.now();
      if (paused || reduceMotion.matches) { pitch = PITCH0; dist = DIST0; repaint(); }
    });
  }

  var playBtn = document.getElementById('vwPlay');
  if (playBtn) {
    playBtn.addEventListener('click', function () {
      paused = !paused;
      if (viewer) viewer.classList.toggle('is-paused', paused);
      playBtn.setAttribute('aria-label', paused ? 'Resume map' : 'Pause map');
      playBtn.title = paused ? 'Resume map' : 'Pause map';
      if (paused) { stop(); if (hFps) hFps.textContent = '—'; }
      else start();
    });
  }

  /* ── Experience roles ↔ milestone keyframes ─────────────── */
  var track = document.getElementById('track');
  if (track) {
    var setHot = function (el) {
      var items = track.querySelectorAll('.kf');
      Array.prototype.forEach.call(items, function (n) { n.classList.toggle('is-hot', n === el); });
      hot = el ? parseInt(el.dataset.kf, 10) : -1;
      if (isNaN(hot)) hot = -1;
      repaint();
    };
    track.addEventListener('pointerover', function (e) {
      var item = e.target.closest('.kf');
      if (item) setHot(item);
    });
    track.addEventListener('pointerleave', function () { setHot(null); });
    // Keyboard and screen-reader users get the same link via focus.
    track.addEventListener('focusin', function (e) {
      var item = e.target.closest('.kf');
      if (item) setHot(item);
    });
  }

  /* ── Lifecycle ──────────────────────────────────────────── */
  if (typeof ResizeObserver !== 'undefined' && stage) {
    new ResizeObserver(function () { if (resize()) repaint(); }).observe(stage);
  } else {
    window.addEventListener('resize', function () { if (resize()) repaint(); }, { passive: true });
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) start(); else stop();
    }, { threshold: 0 }).observe(canvas);
  }

  window.addEventListener('themechange', function () { readPalette(); repaint(); });

  if (reduceMotion.addEventListener) {
    reduceMotion.addEventListener('change', function () { stop(); boot(); });
  }

  function boot() {
    if (!resize()) return;
    refreshAssociations();
    if (hLm) hLm.textContent = LM_N.toLocaleString('en-US');
    if (hKf) hKf.textContent = kfIdx.length;
    if (hLc) hLc.textContent = closures.length;

    if (reduceMotion.matches) {
      if (hFps) hFps.textContent = '—';
      if (hint) hint.classList.add('is-gone');
      render(0);                                  // a single still frame
    } else {
      start();
      // The hint has done its job once someone has had time to read it.
      setTimeout(function () { if (hint) hint.classList.add('is-gone'); }, 6000);
    }
  }

  boot();
})();
