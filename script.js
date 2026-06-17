const rotatingPhrases = [
  "control loops that stay stable under real load",
  "CAN/J1939 traces that explain machine behavior",
  "HIL and SIL regressions that catch field failures early",
  "board bring-up paths from first signal to release",
  "RTOS schedules tuned against latency budgets",
  "model-based controls that become production firmware"
];

const projects = [
  {
    title: "Linux Character Device Driver",
    category: "Embedded",
    tags: ["C", "Linux Kernel", "ioctl"],
    summary: "Kernel-mode character driver with module lifecycle, ioctl interface, proc filesystem debugging, and semaphore-based synchronization.",
    source: "https://github.com/devthedevil/Character-Device-Driver"
  },
  {
    title: "EXPOS - Experimental Operating System",
    category: "Systems",
    tags: ["C", "OS", "Scheduler"],
    summary: "From-scratch OS with preemptive scheduling, memory management, system calls, and filesystem concepts tied to RTOS fundamentals.",
    source: "https://github.com/devthedevil/EXPOS"
  },
  {
    title: "16-Bit RISC Processor",
    category: "Embedded",
    tags: ["Verilog", "RISC", "Hardware"],
    summary: "Computer architecture project implementing a 16-bit RISC processor and hardware-level digital design concepts.",
    source: "https://github.com/devthedevil/Hardware-lab"
  },
  {
    title: "CME MDP 3.0 Multicast Feed Handler",
    category: "Systems",
    tags: ["C++", "Low Latency", "Parsing"],
    summary: "Feed-handler implementation focused on high-volume multicast parsing and systems-level performance concerns.",
    source: "https://github.com/devthedevil/CME-Multicast-Market-Data-Feed-Handler-C-"
  },
  {
    title: "Real-time Stock Market Analysis Pipeline",
    category: "Backend",
    tags: ["Streaming", "Data", "Pipelines"],
    summary: "Streaming data pipeline for market data ingestion, processing, and analysis with production-style flow control.",
    source: "https://github.com/devthedevil/Realtime-Stock-Market-Analysis"
  },
  {
    title: "Voting App",
    category: "Backend",
    tags: ["Kubernetes", "Docker", "Deployment"],
    summary: "Container orchestration project showing service wiring, deployment topology, and cloud-native operations.",
    source: "https://github.com/devthedevil/Kubernetes-K8"
  },
  {
    title: "Hire Loop",
    category: "Backend",
    tags: ["Go", "Concurrency", "Matching"],
    summary: "Job-matching backend with goroutine-based workers, clean API boundaries, and high-throughput request handling.",
    source: "https://github.com/devthedevil/hireloop"
  },
  {
    title: "AskMyStore",
    category: "AI",
    tags: ["LangGraph", "RAG", "Agents"],
    summary: "Agentic RAG assistant using multi-agent orchestration, vector retrieval, prompt engineering, and evaluation-oriented responses.",
    source: "https://github.com/devthedevil/AskMyStore",
    demo: "https://askmystore.vercel.app/"
  },
  {
    title: "TradeSentinel",
    category: "AI",
    tags: ["Trading", "AI", "Analytics"],
    summary: "Market intelligence product that turns trading signals and workflows into a focused, interactive decision surface.",
    source: "https://github.com/devthedevil/tradesentinel",
    demo: "https://tradesentinel.vercel.app/"
  },
  {
    title: "LangChain Chat With Search",
    category: "AI",
    tags: ["LangChain", "Search", "LLM"],
    summary: "LLM chat workflow combining search grounding, retrieval, and application-ready orchestration.",
    source: "https://github.com/devthedevil/LangChain-Chat-with-Search"
  },
  {
    title: "AgentFlow",
    category: "AI",
    tags: ["OpenAI SDK", "Agents", "Automation"],
    summary: "Agent orchestration project exploring OpenAI agent workflows, tool calling, and composable execution paths.",
    source: "https://github.com/devthedevil/openAI-Agent-SDK"
  },
  {
    title: "MCP",
    category: "AI",
    tags: ["MCP", "Tools", "Integration"],
    summary: "Model Context Protocol work for tool-connected AI systems and reusable integration patterns.",
    source: "https://github.com/devthedevil/MCP"
  },
  {
    title: "STRANGERS",
    category: "Apps",
    tags: ["React", "Web", "Product"],
    summary: "React application with a deployed demo and complete user-facing web experience.",
    source: "https://github.com/devthedevil/Strangers",
    demo: "https://strangers-react.vercel.app/"
  },
  {
    title: "Pitch Perfect",
    category: "Apps",
    tags: ["iOS", "Swift", "Audio"],
    summary: "iOS app project exploring audio recording and playback effects in a polished mobile interface.",
    source: "https://github.com/devthedevil/Pitch_Perfect"
  },
  {
    title: "TicTacToe Game",
    category: "Apps",
    tags: ["Android", "Game", "Mobile"],
    summary: "Android game project implementing mobile UI state, game rules, and interaction flow.",
    source: "https://github.com/devthedevil/TicTacToe-Game"
  }
];

const rotatingText = document.querySelector("#rotating-text");
let phraseIndex = 0;

setInterval(() => {
  phraseIndex = (phraseIndex + 1) % rotatingPhrases.length;
  rotatingText.classList.add("swap");
  window.setTimeout(() => {
    rotatingText.textContent = rotatingPhrases[phraseIndex];
    rotatingText.classList.remove("swap");
  }, 190);
}, 2600);

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));

const metricObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      }
      const value = entry.target;
      const target = Number(value.dataset.count);
      const decimalPlaces = Number.isInteger(target) ? 0 : 2;
      const duration = 1200;
      const start = performance.now();

      const tick = now => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        value.textContent = (target * eased).toFixed(decimalPlaces);
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          value.textContent = target.toFixed(decimalPlaces).replace(/\.00$/, "");
        }
      };

      requestAnimationFrame(tick);
      metricObserver.unobserve(value);
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll(".metric-value").forEach(value => metricObserver.observe(value));

const projectGrid = document.querySelector("#project-grid");

function renderProjects(filter = "all") {
  projectGrid.innerHTML = "";
  projects
    .filter(project => filter === "all" || project.category === filter)
    .forEach(project => {
      const card = document.createElement("article");
      card.className = "project-card reveal visible";
      card.dataset.category = project.category;

      const demoLink = project.demo
        ? `<a class="project-link" href="${project.demo}" target="_blank" rel="noreferrer">Demo</a>`
        : "";

      card.innerHTML = `
        <header>
          <div class="tag-row">
            <span>${project.category}</span>
            ${project.tags.map(tag => `<span>${tag}</span>`).join("")}
          </div>
          <h3>${project.title}</h3>
        </header>
        <p>${project.summary}</p>
        <div class="link-row">
          <a class="project-link" href="${project.source}" target="_blank" rel="noreferrer">Source</a>
          ${demoLink}
        </div>
      `;

      projectGrid.append(card);
    });
}

renderProjects();

document.querySelectorAll(".filter-button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-button").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    renderProjects(button.dataset.filter);
  });
});

const canvas = document.querySelector("#control-canvas");
const context = canvas.getContext("2d");
const nodes = [];
const packets = [];
const waveforms = [];
let canvasWidth = 0;
let canvasHeight = 0;

function resizeCanvas() {
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  canvas.width = canvasWidth * scale;
  canvas.height = canvasHeight * scale;
  canvas.style.width = `${canvasWidth}px`;
  canvas.style.height = `${canvasHeight}px`;
  context.setTransform(scale, 0, 0, scale, 0, 0);
  seedNetwork();
}

function seedNetwork() {
  nodes.length = 0;
  packets.length = 0;
  waveforms.length = 0;
  const count = Math.max(34, Math.floor((canvasWidth * canvasHeight) / 41000));
  for (let index = 0; index < count; index += 1) {
    nodes.push({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      vx: (Math.random() - 0.5) * 0.16,
      vy: (Math.random() - 0.5) * 0.16,
      size: Math.random() * 1.8 + 1
    });
  }
  for (let index = 0; index < 14; index += 1) {
    packets.push({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      vx: Math.random() * 0.95 + 0.35,
      vy: (Math.random() - 0.5) * 0.28,
      color: index % 3 === 0 ? "#ffbe33" : index % 2 === 0 ? "#6dff8f" : "#3ee8ff"
    });
  }
  for (let index = 0; index < 7; index += 1) {
    waveforms.push({
      y: Math.random() * canvasHeight,
      phase: Math.random() * Math.PI * 2,
      speed: 0.02 + Math.random() * 0.02,
      color: index % 2 === 0 ? "#3ee8ff" : "#ffbe33"
    });
  }
}

function drawNetwork() {
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.lineWidth = 1;

  waveforms.forEach(wave => {
    wave.phase += wave.speed;
    context.strokeStyle = wave.color === "#3ee8ff" ? "rgba(62, 232, 255, 0.12)" : "rgba(255, 190, 51, 0.1)";
    context.beginPath();
    for (let x = 0; x <= canvasWidth; x += 18) {
      const y = wave.y + Math.sin(x * 0.018 + wave.phase) * 8;
      if (x === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    }
    context.stroke();
  });

  for (let a = 0; a < nodes.length; a += 1) {
    const node = nodes[a];
    node.x += node.vx;
    node.y += node.vy;

    if (node.x < -20) node.x = canvasWidth + 20;
    if (node.x > canvasWidth + 20) node.x = -20;
    if (node.y < -20) node.y = canvasHeight + 20;
    if (node.y > canvasHeight + 20) node.y = -20;

    for (let b = a + 1; b < nodes.length; b += 1) {
      const other = nodes[b];
      const dx = node.x - other.x;
      const dy = node.y - other.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 140) {
        const alpha = (1 - distance / 140) * 0.22;
        context.strokeStyle = `rgba(62, 232, 255, ${alpha})`;
        context.beginPath();
        context.moveTo(node.x, node.y);
        context.lineTo(other.x, other.y);
        context.stroke();
      }
    }

    context.fillStyle = "rgba(248, 251, 250, 0.66)";
    context.beginPath();
    context.arc(node.x, node.y, node.size, 0, Math.PI * 2);
    context.fill();
  }

  packets.forEach(packet => {
    packet.x += packet.vx;
    packet.y += packet.vy;
    if (packet.x > canvasWidth + 80) {
      packet.x = -40;
      packet.y = Math.random() * canvasHeight;
    }
    context.shadowBlur = 14;
    context.shadowColor = packet.color;
    context.fillStyle = packet.color;
    context.fillRect(packet.x, packet.y, 18, 2);
    context.shadowBlur = 0;
  });

  requestAnimationFrame(drawNetwork);
}

resizeCanvas();
drawNetwork();
window.addEventListener("resize", resizeCanvas);
