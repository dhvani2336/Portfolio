document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // Global DOM Selectors
  // ==========================================================================
  const header = document.querySelector('.header');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinksContainer = document.querySelector('.nav-links');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollProgress = document.querySelector('.scroll-progress');
  const backToTop = document.querySelector('.back-to-top');
  
  // ==========================================================================
  // Header Scroll State & Scroll Progress
  // ==========================================================================
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Toggle header scrolled appearance
    if (scrollTop > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Update scroll progress bar
    if (docHeight > 0) {
      const scrollPercent = (scrollTop / docHeight) * 100;
      scrollProgress.style.width = `${scrollPercent}%`;
    }
    
    // Toggle back-to-top button visibility
    if (scrollTop > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check
  
  // Back to Top functionality
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // ==========================================================================
  // Responsive Mobile Menu
  // ==========================================================================
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinksContainer.classList.toggle('active');
    });
  }
  
  // Close menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navToggle) {
        navToggle.classList.remove('active');
        navLinksContainer.classList.remove('active');
      }
    });
  });

  // ==========================================================================
  // Typewriter Animation
  // ==========================================================================
  const typewriterText = document.getElementById('typewriter-text');
  if (typewriterText) {
    const words = [
      'Web Developer',
      'UI/UX Enthusiast',
      'Full Stack Learner',
      'Creative Problem Solver'
    ];
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingDelay = 100;
    
    const type = () => {
      const currentWord = words[wordIdx];
      
      if (isDeleting) {
        // Erasing text
        typewriterText.textContent = currentWord.substring(0, charIdx - 1);
        charIdx--;
        typingDelay = 40;
      } else {
        // Typing text
        typewriterText.textContent = currentWord.substring(0, charIdx + 1);
        charIdx++;
        typingDelay = 120;
      }
      
      // End typing a word
      if (!isDeleting && charIdx === currentWord.length) {
        isDeleting = true;
        typingDelay = 2000; // Pause at end of word
      }
      // End deleting a word
      else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        typingDelay = 500; // Pause before typing next word
      }
      
      setTimeout(type, typingDelay);
    };
    
    // Start typing cycle
    setTimeout(type, 1000);
  }

  // ==========================================================================
  // Active Navigation Tracking & Scroll Animations
  // ==========================================================================
  const sections = document.querySelectorAll('section[id]');
  const scrollReveals = document.querySelectorAll('.scroll-reveal');
  
  const sectionObserverOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Trigger when section is active in main viewport portion
    threshold: 0
  };
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, sectionObserverOptions);
  
  sections.forEach(section => {
    sectionObserver.observe(section);
  });
  
  // Element reveal animation on scroll
  const revealObserverOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target); // Animate once only
      }
    });
  }, revealObserverOptions);
  
  scrollReveals.forEach(el => {
    revealObserver.observe(el);
  });

  // ==========================================================================
  // Skills Animation (Load progress bar only when in view)
  // ==========================================================================
  const skillsBars = document.querySelectorAll('.skills-bar');
  const skillsSection = document.getElementById('skills');
  
  if (skillsSection && skillsBars.length > 0) {
    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          skillsBars.forEach(bar => {
            const progress = bar.getAttribute('data-width');
            bar.style.width = progress;
          });
          skillsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    
    skillsObserver.observe(skillsSection);
  }

  // ==========================================================================
  // Interactive Canvas Particle System
  // ==========================================================================
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId = null;
    let isCanvasActive = true;
    
    // Mouse coords
    const mouse = {
      x: null,
      y: null,
      radius: 120 // Interaction radius
    };
    
    // Handle mouse movement over canvas
    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    
    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });
    
    // Optimize performance: pause particle system if hero section is offscreen
    const heroSection = document.getElementById('home');
    if (heroSection) {
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isCanvasActive = entry.isIntersecting;
          if (isCanvasActive) {
            if (!animationId) animate();
          } else {
            if (animationId) {
              cancelAnimationFrame(animationId);
              animationId = null;
            }
          }
        });
      }, { threshold: 0 });
      heroObserver.observe(heroSection);
    }
    
    class Particle {
      constructor(x, y, vx, vy, size, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.size = size;
        this.color = color;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
      
      update() {
        // Bounce off borders
        if (this.x > canvas.width || this.x < 0) this.vx = -this.vx;
        if (this.y > canvas.height || this.y < 0) this.vy = -this.vy;
        
        // Move particle
        this.x += this.vx;
        this.y += this.vy;
        
        // Check mouse collision / magnetism
        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            // Pull slightly towards mouse
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= dx * force * 0.03;
            this.y -= dy * force * 0.03;
          }
        }
        
        this.draw();
      }
    }
    
    const initCanvas = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
      
      // Determine particle density based on screen size
      let particleCount = 65;
      if (window.innerWidth < 768) {
        particleCount = 25; // Reduce count for lighter rendering on mobile
      }
      
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        let size = Math.random() * 1.5 + 0.8;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let vx = (Math.random() * 0.4) - 0.2;
        let vy = (Math.random() * 0.4) - 0.2;
        
        // Custom subtle color matching accents
        let colorIdx = Math.floor(Math.random() * 3);
        let color;
        if (colorIdx === 0) color = 'rgba(99, 102, 241, 0.45)'; // Indigo
        else if (colorIdx === 1) color = 'rgba(6, 182, 212, 0.45)'; // Cyan
        else color = 'rgba(255, 255, 255, 0.25)'; // Muted white
        
        particles.push(new Particle(x, y, vx, vy, size, color));
      }
    };
    
    // Connect particles close to each other
    const connect = () => {
      let opacityValue = 1;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          let dx = particles[a].x - particles[b].x;
          let dy = particles[a].y - particles[b].y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          
          const maxLineDistance = 110;
          if (dist < maxLineDistance) {
            opacityValue = 1 - (dist / maxLineDistance);
            ctx.strokeStyle = `rgba(99, 102, 241, ${opacityValue * 0.08})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };
    
    // Animation loop
    const animate = () => {
      if (!isCanvasActive) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }
      
      connect();
      animationId = requestAnimationFrame(animate);
    };
    
    // Initialize
    initCanvas();
    if (isCanvasActive) animate();
    
    // Resize event
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        initCanvas();
      }, 200);
    });
  }


});
