const signals = [
  "AUTOSAR control loops tuned for lower end-to-end latency",
  "CAN, J1939, Ethernet, SPI, and I2C diagnostics turned into release evidence",
  "HIL/SIL scenarios cover ISO 26262, SOTIF, FMEA, camera, and positioning faults",
  "Qt operator UIs and camera firmware make machine feedback easier to trust",
  "Requirements traces stay connected to code, tests, hazards, and field fixes",
  "RTOS scheduling, lock-free queues, and GDB traces keep real-time behavior honest"
];

const dynamicSignal = document.querySelector("#dynamic-signal");
let signalIndex = 0;
let charIndex = 0;
let deleting = false;

function typeSignal() {
  if (!dynamicSignal) return;
  const phrase = signals[signalIndex];
  dynamicSignal.textContent = phrase.slice(0, charIndex) || "\u00a0";

  if (!deleting && charIndex < phrase.length) {
    charIndex += 1;
    setTimeout(typeSignal, 32);
    return;
  }

  if (!deleting && charIndex === phrase.length) {
    deleting = true;
    setTimeout(typeSignal, 1450);
    return;
  }

  if (deleting && charIndex > 0) {
    charIndex -= 1;
    setTimeout(typeSignal, 16);
    return;
  }

  deleting = false;
  signalIndex = (signalIndex + 1) % signals.length;
  setTimeout(typeSignal, 240);
}

typeSignal();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const metricObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const target = entry.target;
    const finalValue = Number(target.dataset.count);
    const duration = 960;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      target.textContent = Math.round(finalValue * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
    metricObserver.unobserve(target);
  });
}, { threshold: 0.45 });

document.querySelectorAll("[data-count]").forEach((metric) => metricObserver.observe(metric));

const canvas = document.querySelector("#machine-canvas");
const ctx = canvas.getContext("2d");
let width = 0;
let height = 0;
let scale = Math.min(window.devicePixelRatio || 1, 2);
let particles = [];
let packets = [];

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  scale = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(width * scale);
  canvas.height = Math.floor(height * scale);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);

  const particleCount = width < 640 ? 38 : 88;
  const packetCount = width < 640 ? 8 : 18;
  particles = Array.from({ length: particleCount }, () => createParticle(true));
  packets = Array.from({ length: packetCount }, () => createPacket());
}

function createParticle(randomizeY = false) {
  return {
    x: Math.random() * width,
    y: randomizeY ? Math.random() * height : height + 60,
    vx: 0.14 + Math.random() * 0.42,
    vy: -0.06 - Math.random() * 0.2,
    size: 1 + Math.random() * 2.8,
    phase: Math.random() * Math.PI * 2,
    color: Math.random() > 0.68 ? "247, 201, 72" : Math.random() > 0.45 ? "109, 242, 165" : "53, 217, 255"
  };
}

function createPacket() {
  return {
    x: -120 - Math.random() * width,
    y: height * (0.16 + Math.random() * 0.72),
    length: 100 + Math.random() * 270,
    speed: 0.75 + Math.random() * 1.7,
    bend: 18 + Math.random() * 54,
    alpha: 0.1 + Math.random() * 0.18,
    color: Math.random() > 0.55 ? "247, 201, 72" : "53, 217, 255"
  };
}

function drawCanvas(time) {
  ctx.clearRect(0, 0, width, height);

  packets.forEach((packet, index) => {
    packet.x += packet.speed;
    if (packet.x > width + 180) packets[index] = createPacket();

    ctx.beginPath();
    ctx.moveTo(packet.x, packet.y);
    ctx.quadraticCurveTo(packet.x + packet.length * 0.5, packet.y - packet.bend, packet.x + packet.length, packet.y + packet.bend * 0.2);
    ctx.strokeStyle = `rgba(${packet.color}, ${packet.alpha})`;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(packet.x + packet.length, packet.y + packet.bend * 0.2, 2.4, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${packet.color}, ${packet.alpha + 0.24})`;
    ctx.fill();
  });

  particles.forEach((node, index) => {
    const wave = Math.sin(time * 0.0012 + node.phase) * 0.28;
    node.x += node.vx + wave;
    node.y += node.vy;

    if (node.x > width + 24 || node.y < -24) {
      particles[index] = createParticle(false);
      particles[index].x = -24;
      particles[index].y = height * (0.14 + Math.random() * 0.78);
      return;
    }

    ctx.beginPath();
    ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${node.color}, 0.48)`;
    ctx.fill();

    const neighbor = particles[index + 1];
    if (neighbor) {
      const dx = node.x - neighbor.x;
      const dy = node.y - neighbor.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 150) {
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(neighbor.x, neighbor.y);
        ctx.strokeStyle = `rgba(${node.color}, ${0.13 * (1 - distance / 150)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(drawCanvas);
}

resizeCanvas();
requestAnimationFrame(drawCanvas);
window.addEventListener("resize", resizeCanvas, { passive: true });
