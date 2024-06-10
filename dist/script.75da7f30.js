// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/fireworks-js/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Fireworks = void 0;
/**
 * name: fireworks-js
 * version: 2.10.7
 * author: Vitalij Ryndin (https://crashmax.ru)
 * homepage: https://fireworks.js.org
 * license MIT
 */
function f(e) {
  return Math.abs(Math.floor(e));
}
function c(e, t) {
  return Math.random() * (t - e) + e;
}
function o(e, t) {
  return Math.floor(c(e, t + 1));
}
function m(e, t, i, s) {
  const n = Math.pow;
  return Math.sqrt(n(e - i, 2) + n(t - s, 2));
}
function x(e, t, i = 1) {
  if (e > 360 || e < 0) throw new Error(`Expected hue 0-360 range, got \`${e}\``);
  if (t > 100 || t < 0) throw new Error(`Expected lightness 0-100 range, got \`${t}\``);
  if (i > 1 || i < 0) throw new Error(`Expected alpha 0-1 range, got \`${i}\``);
  return `hsla(${e}, 100%, ${t}%, ${i})`;
}
const g = e => {
    if (typeof e == "object" && e !== null) {
      if (typeof Object.getPrototypeOf == "function") {
        const t = Object.getPrototypeOf(e);
        return t === Object.prototype || t === null;
      }
      return Object.prototype.toString.call(e) === "[object Object]";
    }
    return !1;
  },
  y = ["__proto__", "constructor", "prototype"],
  v = (...e) => e.reduce((t, i) => (Object.keys(i).forEach(s => {
    y.includes(s) || (Array.isArray(t[s]) && Array.isArray(i[s]) ? t[s] = i[s] : g(t[s]) && g(i[s]) ? t[s] = v(t[s], i[s]) : t[s] = i[s]);
  }), t), {});
function b(e, t) {
  let i;
  return (...s) => {
    i && clearTimeout(i), i = setTimeout(() => e(...s), t);
  };
}
class S {
  x;
  y;
  ctx;
  hue;
  friction;
  gravity;
  flickering;
  lineWidth;
  explosionLength;
  angle;
  speed;
  brightness;
  coordinates = [];
  decay;
  alpha = 1;
  constructor({
    x: t,
    y: i,
    ctx: s,
    hue: n,
    decay: h,
    gravity: a,
    friction: r,
    brightness: u,
    flickering: p,
    lineWidth: l,
    explosionLength: d
  }) {
    for (this.x = t, this.y = i, this.ctx = s, this.hue = n, this.gravity = a, this.friction = r, this.flickering = p, this.lineWidth = l, this.explosionLength = d, this.angle = c(0, Math.PI * 2), this.speed = o(1, 10), this.brightness = o(u.min, u.max), this.decay = c(h.min, h.max); this.explosionLength--;) this.coordinates.push([t, i]);
  }
  update(t) {
    this.coordinates.pop(), this.coordinates.unshift([this.x, this.y]), this.speed *= this.friction, this.x += Math.cos(this.angle) * this.speed, this.y += Math.sin(this.angle) * this.speed + this.gravity, this.alpha -= this.decay, this.alpha <= this.decay && t();
  }
  draw() {
    const t = this.coordinates.length - 1;
    this.ctx.beginPath(), this.ctx.lineWidth = this.lineWidth, this.ctx.fillStyle = x(this.hue, this.brightness, this.alpha), this.ctx.moveTo(this.coordinates[t][0], this.coordinates[t][1]), this.ctx.lineTo(this.x, this.y), this.ctx.strokeStyle = x(this.hue, this.flickering ? c(0, this.brightness) : this.brightness, this.alpha), this.ctx.stroke();
  }
}
class E {
  constructor(t, i) {
    this.options = t, this.canvas = i, this.pointerDown = this.pointerDown.bind(this), this.pointerUp = this.pointerUp.bind(this), this.pointerMove = this.pointerMove.bind(this);
  }
  active = !1;
  x;
  y;
  get mouseOptions() {
    return this.options.mouse;
  }
  mount() {
    this.canvas.addEventListener("pointerdown", this.pointerDown), this.canvas.addEventListener("pointerup", this.pointerUp), this.canvas.addEventListener("pointermove", this.pointerMove);
  }
  unmount() {
    this.canvas.removeEventListener("pointerdown", this.pointerDown), this.canvas.removeEventListener("pointerup", this.pointerUp), this.canvas.removeEventListener("pointermove", this.pointerMove);
  }
  usePointer(t, i) {
    const {
      click: s,
      move: n
    } = this.mouseOptions;
    (s || n) && (this.x = t.pageX - this.canvas.offsetLeft, this.y = t.pageY - this.canvas.offsetTop, this.active = i);
  }
  pointerDown(t) {
    this.usePointer(t, this.mouseOptions.click);
  }
  pointerUp(t) {
    this.usePointer(t, !1);
  }
  pointerMove(t) {
    this.usePointer(t, this.active);
  }
}
class O {
  hue;
  rocketsPoint;
  opacity;
  acceleration;
  friction;
  gravity;
  particles;
  explosion;
  mouse;
  boundaries;
  sound;
  delay;
  brightness;
  decay;
  flickering;
  intensity;
  traceLength;
  traceSpeed;
  lineWidth;
  lineStyle;
  autoresize;
  constructor() {
    this.autoresize = !0, this.lineStyle = "round", this.flickering = 50, this.traceLength = 3, this.traceSpeed = 10, this.intensity = 30, this.explosion = 5, this.gravity = 1.5, this.opacity = 0.5, this.particles = 50, this.friction = 0.95, this.acceleration = 1.05, this.hue = {
      min: 0,
      max: 360
    }, this.rocketsPoint = {
      min: 50,
      max: 50
    }, this.lineWidth = {
      explosion: {
        min: 1,
        max: 3
      },
      trace: {
        min: 1,
        max: 2
      }
    }, this.mouse = {
      click: !1,
      move: !1,
      max: 1
    }, this.delay = {
      min: 30,
      max: 60
    }, this.brightness = {
      min: 50,
      max: 80
    }, this.decay = {
      min: 0.015,
      max: 0.03
    }, this.sound = {
      enabled: !1,
      files: ["explosion0.mp3", "explosion1.mp3", "explosion2.mp3"],
      volume: {
        min: 4,
        max: 8
      }
    }, this.boundaries = {
      debug: !1,
      height: 0,
      width: 0,
      x: 50,
      y: 50
    };
  }
  update(t) {
    Object.assign(this, v(this, t));
  }
}
class z {
  constructor(t, i) {
    this.options = t, this.render = i;
  }
  tick = 0;
  rafId = 0;
  fps = 60;
  tolerance = 0.1;
  now;
  mount() {
    this.now = performance.now();
    const t = 1e3 / this.fps,
      i = s => {
        this.rafId = requestAnimationFrame(i);
        const n = s - this.now;
        n >= t - this.tolerance && (this.render(), this.now = s - n % t, this.tick += n * (this.options.intensity * Math.PI) / 1e3);
      };
    this.rafId = requestAnimationFrame(i);
  }
  unmount() {
    cancelAnimationFrame(this.rafId);
  }
}
class L {
  constructor(t, i, s) {
    this.options = t, this.updateSize = i, this.container = s;
  }
  resizer;
  mount() {
    if (!this.resizer) {
      const t = b(() => this.updateSize(), 100);
      this.resizer = new ResizeObserver(t);
    }
    this.options.autoresize && this.resizer.observe(this.container);
  }
  unmount() {
    this.resizer && this.resizer.unobserve(this.container);
  }
}
class M {
  constructor(t) {
    this.options = t, this.init();
  }
  buffers = [];
  audioContext;
  onInit = !1;
  get isEnabled() {
    return this.options.sound.enabled;
  }
  get soundOptions() {
    return this.options.sound;
  }
  init() {
    !this.onInit && this.isEnabled && (this.onInit = !0, this.audioContext = new (window.AudioContext || window.webkitAudioContext)(), this.loadSounds());
  }
  async loadSounds() {
    for (const t of this.soundOptions.files) {
      const i = await (await fetch(t)).arrayBuffer();
      this.audioContext.decodeAudioData(i).then(s => {
        this.buffers.push(s);
      }).catch(s => {
        throw s;
      });
    }
  }
  play() {
    if (this.isEnabled && this.buffers.length) {
      const t = this.audioContext.createBufferSource(),
        i = this.buffers[o(0, this.buffers.length - 1)],
        s = this.audioContext.createGain();
      t.buffer = i, s.gain.value = c(this.soundOptions.volume.min / 100, this.soundOptions.volume.max / 100), s.connect(this.audioContext.destination), t.connect(s), t.start(0);
    } else this.init();
  }
}
class C {
  x;
  y;
  sx;
  sy;
  dx;
  dy;
  ctx;
  hue;
  speed;
  acceleration;
  traceLength;
  totalDistance;
  angle;
  brightness;
  coordinates = [];
  currentDistance = 0;
  constructor({
    x: t,
    y: i,
    dx: s,
    dy: n,
    ctx: h,
    hue: a,
    speed: r,
    traceLength: u,
    acceleration: p
  }) {
    for (this.x = t, this.y = i, this.sx = t, this.sy = i, this.dx = s, this.dy = n, this.ctx = h, this.hue = a, this.speed = r, this.traceLength = u, this.acceleration = p, this.totalDistance = m(t, i, s, n), this.angle = Math.atan2(n - i, s - t), this.brightness = o(50, 70); this.traceLength--;) this.coordinates.push([t, i]);
  }
  update(t) {
    this.coordinates.pop(), this.coordinates.unshift([this.x, this.y]), this.speed *= this.acceleration;
    const i = Math.cos(this.angle) * this.speed,
      s = Math.sin(this.angle) * this.speed;
    this.currentDistance = m(this.sx, this.sy, this.x + i, this.y + s), this.currentDistance >= this.totalDistance ? t(this.dx, this.dy, this.hue) : (this.x += i, this.y += s);
  }
  draw() {
    const t = this.coordinates.length - 1;
    this.ctx.beginPath(), this.ctx.moveTo(this.coordinates[t][0], this.coordinates[t][1]), this.ctx.lineTo(this.x, this.y), this.ctx.strokeStyle = x(this.hue, this.brightness), this.ctx.stroke();
  }
}
class T {
  target;
  container;
  canvas;
  ctx;
  width;
  height;
  traces = [];
  explosions = [];
  waitStopRaf;
  running = !1;
  opts;
  sound;
  resize;
  mouse;
  raf;
  constructor(t, i = {}) {
    this.target = t, this.container = t, this.opts = new O(), this.createCanvas(this.target), this.updateOptions(i), this.sound = new M(this.opts), this.resize = new L(this.opts, this.updateSize.bind(this), this.container), this.mouse = new E(this.opts, this.canvas), this.raf = new z(this.opts, this.render.bind(this));
  }
  get isRunning() {
    return this.running;
  }
  get version() {
    return "2.10.7";
  }
  get currentOptions() {
    return this.opts;
  }
  start() {
    this.running || (this.canvas.isConnected || this.createCanvas(this.target), this.running = !0, this.resize.mount(), this.mouse.mount(), this.raf.mount());
  }
  stop(t = !1) {
    !this.running || (this.running = !1, this.resize.unmount(), this.mouse.unmount(), this.raf.unmount(), this.clear(), t && this.canvas.remove());
  }
  async waitStop(t) {
    if (!!this.running) return new Promise(i => {
      this.waitStopRaf = () => {
        !this.waitStopRaf || (requestAnimationFrame(this.waitStopRaf), !this.traces.length && !this.explosions.length && (this.waitStopRaf = null, this.stop(t), i()));
      }, this.waitStopRaf();
    });
  }
  pause() {
    this.running = !this.running, this.running ? this.raf.mount() : this.raf.unmount();
  }
  clear() {
    !this.ctx || (this.traces = [], this.explosions = [], this.ctx.clearRect(0, 0, this.width, this.height));
  }
  launch(t = 1) {
    for (let i = 0; i < t; i++) this.createTrace();
    this.waitStopRaf || (this.start(), this.waitStop());
  }
  updateOptions(t) {
    this.opts.update(t);
  }
  updateSize({
    width: t = this.container.clientWidth,
    height: i = this.container.clientHeight
  } = {}) {
    this.width = t, this.height = i, this.canvas.width = t, this.canvas.height = i, this.updateBoundaries({
      ...this.opts.boundaries,
      width: t,
      height: i
    });
  }
  updateBoundaries(t) {
    this.updateOptions({
      boundaries: t
    });
  }
  createCanvas(t) {
    t instanceof HTMLCanvasElement ? (t.isConnected || document.body.append(t), this.canvas = t) : (this.canvas = document.createElement("canvas"), this.container.append(this.canvas)), this.ctx = this.canvas.getContext("2d"), this.updateSize();
  }
  render() {
    if (!this.ctx || !this.running) return;
    const {
      opacity: t,
      lineStyle: i,
      lineWidth: s
    } = this.opts;
    this.ctx.globalCompositeOperation = "destination-out", this.ctx.fillStyle = `rgba(0, 0, 0, ${t})`, this.ctx.fillRect(0, 0, this.width, this.height), this.ctx.globalCompositeOperation = "lighter", this.ctx.lineCap = i, this.ctx.lineJoin = "round", this.ctx.lineWidth = c(s.trace.min, s.trace.max), this.initTrace(), this.drawTrace(), this.drawExplosion();
  }
  createTrace() {
    const {
      hue: t,
      rocketsPoint: i,
      boundaries: s,
      traceLength: n,
      traceSpeed: h,
      acceleration: a,
      mouse: r
    } = this.opts;
    this.traces.push(new C({
      x: this.width * o(i.min, i.max) / 100,
      y: this.height,
      dx: this.mouse.x && r.move || this.mouse.active ? this.mouse.x : o(s.x, s.width - s.x * 2),
      dy: this.mouse.y && r.move || this.mouse.active ? this.mouse.y : o(s.y, s.height * 0.5),
      ctx: this.ctx,
      hue: o(t.min, t.max),
      speed: h,
      acceleration: a,
      traceLength: f(n)
    }));
  }
  initTrace() {
    if (this.waitStopRaf) return;
    const {
      delay: t,
      mouse: i
    } = this.opts;
    (this.raf.tick > o(t.min, t.max) || this.mouse.active && i.max > this.traces.length) && (this.createTrace(), this.raf.tick = 0);
  }
  drawTrace() {
    let t = this.traces.length;
    for (; t--;) this.traces[t].draw(), this.traces[t].update((i, s, n) => {
      this.initExplosion(i, s, n), this.sound.play(), this.traces.splice(t, 1);
    });
  }
  initExplosion(t, i, s) {
    const {
      particles: n,
      flickering: h,
      lineWidth: a,
      explosion: r,
      brightness: u,
      friction: p,
      gravity: l,
      decay: d
    } = this.opts;
    let w = f(n);
    for (; w--;) this.explosions.push(new S({
      x: t,
      y: i,
      ctx: this.ctx,
      hue: s,
      friction: p,
      gravity: l,
      flickering: o(0, 100) <= h,
      lineWidth: c(a.explosion.min, a.explosion.max),
      explosionLength: f(r),
      brightness: u,
      decay: d
    }));
  }
  drawExplosion() {
    let t = this.explosions.length;
    for (; t--;) this.explosions[t].draw(), this.explosions[t].update(() => {
      this.explosions.splice(t, 1);
    });
  }
}
exports.default = exports.Fireworks = T;
},{}],"script.js":[function(require,module,exports) {
"use strict";

var _fireworksJs = require("fireworks-js");
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var GameObject = /*#__PURE__*/function () {
  function GameObject(x, y, width, height, speed, color) {
    _classCallCheck(this, GameObject);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.color = color;
    this.frameCount = 0;
  }
  return _createClass(GameObject, [{
    key: "aiFollow",
    value: function aiFollow(ball) {
      // Only update the AI's position every 5 frames
      if (this.frameCount % 1 === 0) {
        // Move the paddle towards the current position of the ball
        if (ball.y < this.y) {
          this.moveUp();
        } else if (ball.y > this.y + this.height) {
          this.moveDown();
        }
      }
      this.frameCount++;
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }, {
    key: "moveUp",
    value: function moveUp() {
      if (this.y > 0) {
        this.y -= this.speed;
      }
    }
  }, {
    key: "moveDown",
    value: function moveDown() {
      if (this.y + this.height < window.innerHeight) {
        this.y += this.speed;
      }
    }
  }, {
    key: "keepWithinScreen",
    value: function keepWithinScreen() {
      if (this.y < 0) this.y = 0;
      if (this.y + this.height > window.innerHeight) this.y = window.innerHeight - this.height;
    }
  }]);
}();
var Ball = /*#__PURE__*/function (_GameObject) {
  function Ball(x, y, radius, color) {
    var _this;
    _classCallCheck(this, Ball);
    _this = _callSuper(this, Ball, [x, y, radius * 2, radius * 2, 6, color]);
    _this.radius = radius;
    _this.speedX = (Math.random() < 0.5 ? -1 : 1) * _this.speed;
    _this.speedY = (Math.random() < 0.5 ? -1 : 1) * _this.speed;
    _this.isVisible = true;
    return _this;
  }
  _inherits(Ball, _GameObject);
  return _createClass(Ball, [{
    key: "draw",
    value: function draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }, {
    key: "move",
    value: function move() {
      this.x += this.speedX;
      this.y += this.speedY;
    }
  }, {
    key: "bounceOffWalls",
    value: function bounceOffWalls() {
      if (this.y + this.radius > window.innerHeight) {
        this.speedY = -Math.abs(this.speedY);
        this.y = window.innerHeight - this.radius;
      } else if (this.y - this.radius < 0) {
        this.speedY = Math.abs(this.speedY);
        this.y = this.radius;
      }
    }
  }, {
    key: "resetIfHitsWall",
    value: function resetIfHitsWall() {
      if (this.x + this.radius > window.innerWidth) {
        this.resetBallDirection(false);
        return this.isVisible ? 'blue' : false;
      }
      if (this.x - this.radius < 0) {
        this.resetBallDirection(true);
        return this.isVisible ? 'red' : false;
      }
      return false;
    }
  }, {
    key: "resetBallDirection",
    value: function resetBallDirection(towardsBlue) {
      this.x = window.innerWidth / 2;
      this.y = window.innerHeight / 2;
      this.speedX = (towardsBlue ? -1 : 1) * Math.abs(this.speed);
      this.speedY = (Math.random() < 0.5 ? -1 : 1) * this.speed;
    }
  }, {
    key: "bounceOffObject",
    value: function bounceOffObject(obj) {
      if (this.x + this.radius > obj.x && this.x - this.radius < obj.x + obj.width && this.y + this.radius > obj.y && this.y - this.radius < obj.y + obj.height) {
        var hitPos = (this.y - obj.y) / obj.height;
        this.speedX = -this.speedX;
        this.speedY = 2 * (hitPos - 0.5) * this.speed;
      }
    }
  }]);
}(GameObject);
var Game = /*#__PURE__*/function () {
  function Game() {
    _classCallCheck(this, Game);
    var blockParams = {
      width: 10,
      height: 130,
      speed: 5,
      offset: 100
    };
    this.obj1 = new GameObject(blockParams.offset, (window.innerHeight - blockParams.height) / 2, blockParams.width, blockParams.height, blockParams.speed, 'blue');
    this.obj2 = new GameObject(window.innerWidth - blockParams.width - blockParams.offset, (window.innerHeight - blockParams.height) / 2, blockParams.width, blockParams.height, blockParams.speed, 'red');
    this.ball = new Ball(window.innerWidth / 2, window.innerHeight / 2, 10, 'white');
    this.keys = {};
    this.gamePaused = true;
    this.timerInterval = null;
    this.timer = 60;
    this.scoreBlue = 0;
    this.scoreRed = 0;
    this.mode = 'ai';
  }
  return _createClass(Game, [{
    key: "draw",
    value: function draw() {
      var canvas = document.getElementById('canvas');
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.obj1.draw(ctx);
      this.obj2.draw(ctx);
      if (this.timer > 0) this.ball.draw(ctx);
    }
  }, {
    key: "update",
    value: function update() {
      if (this.keys['w']) this.obj1.moveUp();
      if (this.keys['s']) this.obj1.moveDown();
      if (this.mode === 'duo') {
        if (this.keys['ArrowUp']) this.obj2.moveUp();
        if (this.keys['ArrowDown']) this.obj2.moveDown();
      } else {
        // Only move the AI when the game is not paused
        if (!this.gamePaused) {
          this.obj2.aiFollow(this.ball);
        }
      }
      this.obj1.keepWithinScreen();
      this.obj2.keepWithinScreen();
      if (!this.gamePaused) {
        this.ball.move();
        this.ball.bounceOffWalls();
        this.ball.bounceOffObject(this.obj1);
        this.ball.bounceOffObject(this.obj2);
        var scorer = this.ball.resetIfHitsWall();
        if (scorer && this.timer > 0) {
          this.gamePaused = true;
          this.pauseTimer();
          if (scorer === 'blue') {
            this.scoreBlue++;
            document.getElementById('score-blue').textContent = this.scoreBlue;
          } else if (scorer === 'red') {
            this.scoreRed++;
            document.getElementById('score-red').textContent = this.scoreRed;
          }
          this.resetPositions();
        }
      }
    }
  }, {
    key: "gameLoop",
    value: function gameLoop() {
      this.update();
      this.draw();
      window.requestAnimationFrame(this.gameLoop.bind(this));
    }
  }, {
    key: "resetPositions",
    value: function resetPositions() {
      var blockParams = {
        width: 10,
        height: 130,
        offset: 100
      };
      this.obj1.x = blockParams.offset;
      this.obj1.y = (window.innerHeight - blockParams.height) / 2;
      this.obj2.x = window.innerWidth - blockParams.width - blockParams.offset;
      this.obj2.y = (window.innerHeight - blockParams.height) / 2;
      this.ball.resetBallDirection(true);
    }
  }, {
    key: "adjustCanvasSize",
    value: function adjustCanvasSize() {
      var canvas = document.getElementById('canvas');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }, {
    key: "start",
    value: function start() {
      var _this2 = this;
      this.adjustCanvasSize();
      window.addEventListener('resize', this.adjustCanvasSize.bind(this));
      this.gameLoop();
      window.addEventListener('keydown', function (event) {
        _this2.keys[event.key] = true;
        if (event.key === ' ') {
          _this2.gamePaused = !_this2.gamePaused;
          if (_this2.gamePaused) {
            _this2.pauseTimer();
          } else {
            _this2.startTimer();
          }
        }
        if (['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(event.key)) {
          event.preventDefault();
        }
      });
      window.addEventListener('keyup', function (event) {
        _this2.keys[event.key] = false;
      });
    }
  }, {
    key: "showFireworks",
    value: function showFireworks() {
      var container = document.getElementById('canvas');
      var fireworks = new _fireworksJs.Fireworks(container, {
        maxRockets: 50,
        rocketSpawnInterval: 150,
        numParticles: 100,
        explosionMinHeight: 20,
        explosionMaxHeight: 200,
        explosionChance: 0.08
      });
      fireworks.start();
    }
  }, {
    key: "startTimer",
    value: function startTimer() {
      var _this3 = this;
      if (!this.timerInterval) {
        var timerElement = document.getElementById('timer');
        this.timerInterval = setInterval(function () {
          if (_this3.timer > 0) {
            _this3.timer--;
            timerElement.textContent = _this3.timer;
            if (_this3.timer === 0) {
              clearInterval(_this3.timerInterval);
              var winner = _this3.scoreBlue > _this3.scoreRed ? 'blue' : 'red';
              var winnerElement = document.getElementById('winner');
              winnerElement.textContent = "The winner is ".concat(winner);
              winnerElement.style.color = winner;
              winnerElement.classList.add('animate-winner');
              _this3.showFireworks();

              // Refresh the page 10 seconds after the game ends
              setTimeout(function () {
                location.reload();
              }, 10000);
            }
          }
        }, 1000);
      }
    }
  }, {
    key: "pauseTimer",
    value: function pauseTimer() {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }]);
}(); // Start the game
new Game().start();
},{"fireworks-js":"node_modules/fireworks-js/dist/index.es.js"}],"../../../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50361" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["../../../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","script.js"], null)
//# sourceMappingURL=/script.75da7f30.js.map