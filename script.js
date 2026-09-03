/* ==========================================================================
   PORTFOLIO INTERACTIVE JAVASCRIPT - 23MIC7031
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. DYNAMIC BACKGROUND PARTICLE CANVAS
  const initCanvasBackground = () => {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(width / 25), 65);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? 'rgba(99, 102, 241, 0.4)' : 'rgba(6, 182, 212, 0.4)'
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }

    animate();
  };

  initCanvasBackground();


  // 2. HERO TYPING EFFECT
  const initTypingEffect = () => {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;

    const words = [
      'Full-Stack Developer',
      'Software Engineer',
      'AI & Web Architect',
      'Problem Solver'
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        typingElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
      } else {
        typingElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500;
      }

      setTimeout(type, typeSpeed);
    }

    type();
  };

  initTypingEffect();


  // 3. THEME TOGGLE (DARK / LIGHT MODE)
  const initThemeToggle = () => {
    const themeBtn = document.getElementById('theme-toggle');
    if (!themeBtn) return;

    const currentTheme = localStorage.getItem('portfolio-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
      updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
      const icon = themeBtn.querySelector('i');
      if (icon) {
        icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
      }
    }
  };

  initThemeToggle();


  // 4. NAVBAR SCROLL & ACTIVE LINK HIGHLIGHT (SCROLLSPY)
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar background blur toggle
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }

    // ScrollSpy active link update
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  // 5. MOBILE MENU TOGGLE
  const mobileBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileBtn.querySelector('i');
      if (icon) {
        icon.className = navMenu.classList.contains('active') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
    });

    // Close menu when clicking link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileBtn.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }


  // 6. ANIMATED STATS COUNTER ON SCROLL
  const statNumbers = document.querySelectorAll('.stat-number');
  let animatedStats = false;

  const animateStats = () => {
    const statsSection = document.querySelector('.stats-section');
    if (!statsSection) return;

    const sectionPos = statsSection.getBoundingClientRect().top;
    const screenPos = window.innerHeight / 1.2;

    if (sectionPos < screenPos && !animatedStats) {
      animatedStats = true;
      statNumbers.forEach(stat => {
        const target = +stat.getAttribute('data-target');
        let count = 0;
        const increment = Math.ceil(target / 40);

        const updateCount = () => {
          count += increment;
          if (count < target) {
            stat.textContent = count + '+';
            setTimeout(updateCount, 35);
          } else {
            stat.textContent = target + '+';
          }
        };
        updateCount();
      });
    }
  };

  window.addEventListener('scroll', animateStats);
  animateStats();


  // 7. SKILL PROGRESS BAR ANIMATION & TAB FILTERING
  const skillTabs = document.querySelectorAll('.skill-tab');
  const skillCards = document.querySelectorAll('.skill-card');
  const progressFills = document.querySelectorAll('.progress-bar-fill');
  let animatedSkills = false;

  const animateProgressBars = () => {
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;

    const sectionPos = skillsSection.getBoundingClientRect().top;
    if (sectionPos < window.innerHeight / 1.2 && !animatedSkills) {
      animatedSkills = true;
      progressFills.forEach(fill => {
        const targetWidth = fill.getAttribute('data-progress');
        fill.style.width = targetWidth;
      });
    }
  };

  window.addEventListener('scroll', animateProgressBars);
  animateProgressBars();

  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      skillTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const cat = tab.getAttribute('data-category');
      skillCards.forEach(card => {
        if (cat === 'all' || card.getAttribute('data-cat') === cat) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  // 8. PROJECT FILTERING
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (filterVal === 'all' || card.getAttribute('data-category') === filterVal) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  // 9. PROJECT MODAL POPUP
  const modalOverlay = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalBodyContent = document.getElementById('modal-body-content');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');

  const projectDetailsMap = {
    'modal-1': {
      title: 'CloudIQ Analytics Dashboard',
      subtitle: 'Real-Time Developer Infrastructure & Metric Platform',
      image: 'assets/project_analytics.jpg',
      tags: ['JavaScript', 'Node.js', 'Express', 'Chart.js', 'WebSockets'],
      description: 'CloudIQ is a full-featured dashboard designed to visualize real-time API latency, deployment statuses, server health metrics, and active instance logs. Built with responsive dark-mode aesthetics and modular architecture.',
      features: [
        'Live WebSockets streaming for server metrics and response times',
        'Interactive time-series charts for API endpoints latency',
        'Developer console log viewer with syntax highlighting',
        'Responsive layout tuned for mobile and desktop screens'
      ]
    },
    'modal-2': {
      title: 'CodeFlow AI Refactor Engine',
      subtitle: 'Intelligent LLM Code Analyzer & Optimization Tool',
      image: 'assets/project_ai_assistant.jpg',
      tags: ['Python', 'FastAPI', 'React', 'OpenAI API', 'Diff Engine'],
      description: 'CodeFlow AI assists developers by analyzing code snippets, identifying performance bottlenecks, and automatically suggesting clean, optimized refactored code with split diff rendering.',
      features: [
        'Vectorized code complexity reduction suggestions',
        'Interactive chat prompt interface for refactoring context',
        'Split side-by-side unified code diff viewer',
        'Export refactored code directly to project repository'
      ]
    },
    'modal-3': {
      title: 'Synapse Smart Task Manager',
      subtitle: 'Glassmorphism Productive Task & Progress Hub',
      image: 'assets/project_mobile_app.jpg',
      tags: ['HTML5', 'Vanilla CSS', 'JavaScript ES6', 'LocalStorage'],
      description: 'Synapse is a modern, responsive web application engineered to streamline daily task management, project focus rings, and milestone tracking across desktop and mobile devices.',
      features: [
        'Glassmorphic card design system with vibrant glowing badges',
        'Category filters, priority urgency tags, and progress meters',
        'LocalStorage state persistence for offline productivity',
        'Fully fluid responsive design optimized for mobile viewports'
      ]
    }
  };

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      const details = projectDetailsMap[modalId];

      if (details) {
        modalBodyContent.innerHTML = `
          <img src="${details.image}" alt="${details.title}" style="width:100%; height:260px; object-fit:cover; border-radius:12px; margin-bottom:1.5rem;">
          <h3 style="font-size:1.6rem; font-weight:800; margin-bottom:0.25rem;">${details.title}</h3>
          <p style="color:var(--accent-cyan); font-size:0.95rem; font-weight:600; margin-bottom:1rem;">${details.subtitle}</p>
          
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1.25rem;">
            ${details.tags.map(t => `<span class="tag-pill">${t}</span>`).join('')}
          </div>

          <p style="color:var(--text-muted); line-height:1.7; margin-bottom:1.5rem;">${details.description}</p>
          
          <h4 style="font-size:1.1rem; font-weight:700; margin-bottom:0.75rem;">Key Engineering Highlights:</h4>
          <ul style="list-style:disc; margin-left:1.5rem; color:var(--text-muted); line-height:1.8; margin-bottom:2rem;">
            ${details.features.map(f => `<li>${f}</li>`).join('')}
          </ul>

          <div style="display:flex; gap:1rem;">
            <a href="https://github.com" target="_blank" class="btn btn-primary" style="flex:1;"><i class="fa-brands fa-github"></i> View GitHub Repo</a>
            <button class="btn btn-secondary" onclick="document.getElementById('project-modal').classList.remove('active');">Close</button>
          </div>
        `;
        modalOverlay.classList.add('active');
      }
    });
  });

  if (modalCloseBtn && modalOverlay) {
    modalCloseBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  }


  // 10. CONTACT FORM SUBMISSION HANDLER
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending...`;

      setTimeout(() => {
        submitBtn.style.background = 'var(--accent-emerald)';
        submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> Message Sent Successfully!`;

        contactForm.reset();

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.style.background = '';
          submitBtn.innerHTML = originalText;
        }, 3500);
      }, 1200);
    });
  }

});
