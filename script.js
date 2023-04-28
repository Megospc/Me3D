const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const type = "all";
var r = { x: 0, y: 0 };
var zoom = 1;
const devices = new RegExp('Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini', "i");
const mobile = devices.test(navigator.userAgent);
const dtr = (deg) => deg/180*Math.PI;
const sin = (deg) => Math.sin(dtr(deg));
const cos = (deg) => Math.cos(dtr(deg));
const X = (x, y, z) => (sin(r.x)*x-cos(r.x)*y)*zoom+300;
const Y = (x, y, z) => ((cos(r.x)*x+sin(r.x)*y)*cos(r.y)+sin(r.y)*z)*zoom+300;
const examples = [
  ["zoom", 1, "fill", "#a0000080", "stroke", "#700000", "width", 2, "cube", 0, 0, 0, 100],
  ["zoom", 0.5, "fill", "#a0000080", "stroke", "#700000", "width", 2, "cube", 0, 0, 0, 100, "cube", 200, 0, 0, 100, "cube", -200, 0, 0, 100, "cube", 0, 200, 0, 100, "cube", 0, -200, 0, 100, "cube", 0, 0, 200, 100, "cube", 0, 0, -200, 100]
];
var arr = examples[0];
var touch = false;
var sm = {};
var sr = {};

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  function rectz(x, y, z, w, h) {
    ctx.beginPath();
    ctx.moveTo(X(x, y, z), Y(x, y, z));
    ctx.lineTo(X(x+w, y, z), Y(x+w, y, z));
    ctx.lineTo(X(x+w, y+h, z), Y(x+w, y+h, z));
    ctx.lineTo(X(x, y+h, z), Y(x, y+h, z));
    ctx.closePath();
    end();
  }
  function rectx(x, y, z, w, h) {
    ctx.beginPath();
    ctx.moveTo(X(x, y, z), Y(x, y, z));
    ctx.lineTo(X(x, y+w, z), Y(x, y+w, z));
    ctx.lineTo(X(x, y+w, z+h), Y(x, y+w, z+h));
    ctx.lineTo(X(x, y, z+h), Y(x, y, z+h));
    ctx.closePath();
    end();
  }
  function recty(x, y, z, w, h) {
    ctx.beginPath();
    ctx.moveTo(X(x, y, z), Y(x, y, z));
    ctx.lineTo(X(x+w, y, z), Y(x+w, y, z));
    ctx.lineTo(X(x+w, y, z+h), Y(x+w, y, z+h));
    ctx.lineTo(X(x, y, z+h), Y(x, y, z+h));
    ctx.closePath();
    end();
  }
  function end() {
    if (type == "stroke" || type == "all") ctx.stroke();
    if (type == "fill" || type == "all") ctx.fill();
  }
  function cube(x, y, z, s) {
    rectz(x-s, y-s, z+s, s*2, s*2);
    rectz(x-s, y-s, z-s, s*2, s*2);
    rectx(x-s, y-s, z-s, s*2, s*2);
    rectx(x+s, y-s, z-s, s*2, s*2);
    recty(x-s, y-s, z-s, s*2, s*2);
    recty(x-s, y+s, z-s, s*2, s*2);
  }
  for (let i = 0; i < arr.length; i++) {
    let x, y, z, w, h;
    switch (arr[i]) {
      case "zoom":
        i++;
        zoom = arr[i];
        break;
      case "begin":
        ctx.beginPath();
        break;
      case "cube":
        x = arr[i+1], y = arr[i+2], z = arr[i+3], w = arr[i+4];
        cube(x, y, z, w);
        break;
      case "rectz":
        x = arr[i+1], y = arr[i+2], w = arr[i+3], h = arr[i+4], z = arr[i+5];
        rectz(x, y, z, w, h);
        break;
      case "rectx":
        y = arr[i+1], z = arr[i+2], w = arr[i+3], h = arr[i+4], x = arr[i+5];
        rectz(x, y, z, w, h);
        break;
      case "recty":
        x = arr[i+1], z = arr[i+2], w = arr[i+3], h = arr[i+4], y = arr[i+5];
        recty(x, y, z, w, h);
        break;
      case "end":
        end();
        break;
      case "fill":
        i++;
        ctx.fillStyle = arr[i];
        break;
      case "stroke":
        i++;
        ctx.strokeStyle = arr[i];
        break;
      case "width":
        i++;
        ctx.lineWidth = arr[i];
        break;
      case "move":
        x = arr[i+1], y = arr[i+2], z = arr[i+3];
        ctx.moveTo(X(x, y, z), Y(x, y, z));
        break;
      case "line":
        x = arr[i+1], y = arr[i+2], z = arr[i+3];
        ctx.lineTo(X(x, y, z), Y(x, y, z));
        break;
    }
  }
}

function touchstart(e) {
  const b = e.target.getBoundingClientRect();
  const m = mobile ? e.touches[0]:e;
  const x = (m.clientY-b.left)*2;
  const y = (m.clientY-b.top)*2;
  touch = true;
  sm = { x: x, y: y };
  sr = { x: r.x, y: r.y };
  document.body.style.overflow = 'hidden';
}
function touchmove(e) {
  if (touch) {
    const b = e.target.getBoundingClientRect();
    const m = mobile ? e.touches[0]:e;
    const x = (m.clientY-b.left)*2;
    const y = (m.clientY-b.top)*2;
    r.x = (sr.x+sm.x-x)%360;
    r.y = (sr.y+sm.y-y)%360;
    render();
  }
}
function touchend() {
  touch = false;
  document.body.style.overflow = 'visible';
}

function example(i) {
  arr = examples[i];
  render();
}

window.onload = function() {
  if (mobile) {
    canvas.addEventListener('touchstart', touchstart);
    canvas.addEventListener('touchmove', touchmove);
    canvas.addEventListener('touchend', touchend);
  } else {
    canvas.addEventListener('mousedown', touchstart);
    canvas.addEventListener('mousemove', touchmove);
    canvas.addEventListener('mouseup', touchend);
  }
  render();
};
