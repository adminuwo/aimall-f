// AI-Mall™ — Universal Cinematic Engine
// Smooth Scroll + Universal Reveal System

document.addEventListener('DOMContentLoaded', () => {
    // ── Global API Configuration ──
    // Uses the central window.AI_MALL_CONFIG defined in app-config.js
    window.API_BASE_URL = `${window.AI_MALL_CONFIG.API_BASE_URL}/api`; 

    // ═══════════════════════════════════════════
    // 1. LENIS SMOOTH SCROLL
    // ═══════════════════════════════════════════
    const lenis = new Lenis({
        duration: 1.6,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        smoothTouch: false,
        wheelMultiplier: 1,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Link GSAP ScrollTrigger with Lenis
    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);


    // ═══════════════════════════════════════════
    // 2. CINEMATIC LOADER
    // ═══════════════════════════════════════════
    const loader = document.getElementById('loader');
    const loaderBar = document.querySelector('.loader-bar');
    const body = document.body;

    if (loader) {
        let progress = 0;
        const loaderText = document.querySelector('.loader-text');
        const messages = [
            "Initializing Neural Network...",
            "Syncing Global Intelligence...",
            "Synthesizing Ecosystem...",
            "Ready for Deployment."
        ];

        const interval = setInterval(() => {
            progress += Math.random() * 12;
            if (progress > 100) progress = 100;
            
            if (loaderBar) loaderBar.style.width = `${progress}%`;
            
            if (loaderText) {
                const msgIndex = Math.floor((progress / 100) * (messages.length - 1));
                loaderText.textContent = messages[msgIndex];
            }

            if (progress === 100) {
                clearInterval(interval);
                setTimeout(hideLoader, 500);
            }
        }, 140);
    } else {
        body.classList.remove('loading');
        startHeroAnimations();
    }

    function hideLoader() {
        if (!loader) return;
        const tl = gsap.timeline({
            onComplete: () => {
                loader.style.display = 'none';
                body.classList.remove('loading');
                startHeroAnimations();
            }
        });
        tl.to('.loader-content', { opacity: 0, scale: 0.9, duration: 0.7, ease: 'expo.inOut' })
          .to(loader, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '-=0.3');
    }


    // ═══════════════════════════════════════════
    // 3. HERO ENTRY ANIMATION
    // ═══════════════════════════════════════════
    function startHeroAnimations() {
        const tl = gsap.timeline();
        tl.to('.reveal-text',    { opacity: 1, y: 0, duration: 1.4, ease: 'expo.out', stagger: 0.15 })
          .to('.reveal-subtext', { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out' }, '-=1')
          .from('.cta-group .btn, .cta-group .btn-premium', { y: 24, opacity: 0, stagger: 0.15, duration: 1, ease: 'expo.out' }, '-=0.8')
          .from('.scroll-indicator', { opacity: 0, duration: 1 }, '-=0.5');

        // Parallax on hero bg
        const heroTrigger = document.querySelector('#hero, #about-hero, #aseries-hero, #partner-hero, #contact-hero');
        if (heroTrigger) {
            gsap.to('.hero-bg img, .hero-bg .parallax-img', {
                scale: 1.25,
                ease: 'none',
                scrollTrigger: {
                    trigger: heroTrigger,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });
        }
    }


    // ═══════════════════════════════════════════
    // 4. UNIVERSAL SCROLL REVEAL SYSTEM
    //    — Works across ALL pages automatically
    // ═══════════════════════════════════════════

    // Helper: register a stagger-group reveal
    function revealGroup(selector, from, options = {}) {
        const els = gsap.utils.toArray(selector);
        if (!els.length) return;
        els.forEach((el, i) => {
            gsap.fromTo(el, from, {
                ...from,
                opacity: 1,
                y: 0,
                x: 0,
                scale: 1,
                filter: 'blur(0px)',
                delay: (options.staggerDelay || 0) * i,
                duration: options.duration || 0.85,
                ease: options.ease || 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: options.start || 'top 88%',
                    once: true,
                    toggleActions: 'play none none none'
                }
            });
        });
    }

    // ── Section Labels / Badges ──
    revealGroup(
        '.section-label, .hstrip-label, .uwo-badge, .m-badge, .v3-badge',
        { opacity: 0, y: 20 },
        { duration: 0.7, start: 'top 90%' }
    );

    // ── Section Titles / Headings ──
    revealGroup(
        '.section-title, .hstrip-title, .uwo-title, .hstrip-header h2, .founder-name',
        { opacity: 0, y: 40 },
        { duration: 1, ease: 'power4.out', start: 'top 88%' }
    );

    // ── Subtitles / Descriptions / Paragraphs ──
    revealGroup(
        '.subheadline, .hstrip-sub, .uwo-description, .uwo-subtext, .founder-quote, .founder-bio, .m-support-line, .footer-description',
        { opacity: 0, y: 30 },
        { duration: 0.9, start: 'top 88%' }
    );

    // ── Generic Reveal Items Tagged by Class ──
    revealGroup(
        '.reveal-on-scroll',
        { opacity: 0, y: 36 },
        { duration: 0.9, start: 'top 88%' }
    );

    // ── Feature/Stat Items (stagger via group) ──
    gsap.utils.toArray('.uwo-features, .uwo-stats-row, .m-stats-row, .v3-stats-row, .founder-traits').forEach(group => {
        const children = gsap.utils.toArray(group.children);
        gsap.fromTo(children,
            { opacity: 0, y: 30 },
            {
                opacity: 1, y: 0,
                duration: 0.7,
                stagger: 0.12,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: group,
                    start: 'top 88%',
                    once: true
                }
            }
        );
    });

    // ── Buttons / CTAs ──
    revealGroup(
        '.cta-minimal, .v3-btn-primary, .social-links-minimal, .btn-premium',
        { opacity: 0, y: 20 },
        { duration: 0.8, start: 'top 90%' }
    );

    // ── Image Wrappers ──
    revealGroup(
        '.image-wrapper, .uwo-video-card-reveal, .v3-video-card, .reveal-card-v3',
        { opacity: 0, y: 50, scale: 0.96 },
        { duration: 1.1, ease: 'expo.out', start: 'top 85%' }
    );

    // ── Footer Columns ──
    gsap.utils.toArray('.footer-brand, .footer-col, .footer-social-hub').forEach((el, i) => {
        gsap.fromTo(el,
            { opacity: 0, y: 30 },
            {
                opacity: 1, y: 0,
                duration: 0.8,
                delay: i * 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 95%',
                    once: true
                }
            }
        );
    });


    // ═══════════════════════════════════════════
    // 5. SECTION-SPECIFIC ANIMATIONS
    // ═══════════════════════════════════════════

    // ── Parallax on all section background images ──
    gsap.utils.toArray('.scroll-section').forEach(section => {
        const img = section.querySelector('.parallax-img');
        if (img) {
            gsap.to(img, {
                yPercent: 18,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        }
    });

    // ── Pillar Cards (Home) ──
    const pillars = document.querySelector('.pillars-grid');
    if (pillars) {
        const pCards = gsap.utils.toArray(pillars.children);
        gsap.set(pCards, { xPercent: 100, opacity: 0, scale: 0.95, filter: 'blur(8px)' });

        const pTL = gsap.timeline({
            scrollTrigger: {
                trigger: '#pillars',
                start: 'top 75%',
                end: 'bottom -20%',
                scrub: 1.2
            }
        });
        pTL
          .to(pCards, { xPercent: 0, opacity: 1, scale: 1, filter: 'blur(0px)', stagger: 0.15, duration: 2, ease: 'power2.out' })
          .to(pCards, { duration: 2.5 })
          .to(pCards, { xPercent: 90, opacity: 0, scale: 0.85, filter: 'blur(15px)', stagger: 0.08, duration: 1.5, ease: 'power2.in' });
    }

    // ── A-Series Tiles (Home + A-Series page) ──
    const aGrid = document.querySelector('.a-series-grid');
    if (aGrid) {
        const tiles = gsap.utils.toArray(aGrid.children);
        gsap.fromTo(tiles,
            { opacity: 0, y: 35, scale: 0.88 },
            {
                opacity: 1, y: 0, scale: 1,
                duration: 0.8,
                stagger: 0.07,
                ease: 'expo.out',
                scrollTrigger: { trigger: aGrid, start: 'top 85%', once: true }
            }
        );
        // Tilt on hover
        tiles.forEach(tile => {
            tile.addEventListener('mousemove', (e) => {
                const rect = tile.getBoundingClientRect();
                const dx = e.clientX - rect.left - rect.width / 2;
                const dy = e.clientY - rect.top - rect.height / 2;
                gsap.to(tile, { rotateY: dx / 14, rotateX: -dy / 14, scale: 1.02, duration: 0.4, ease: 'power2.out' });
                tile.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
                tile.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
            });
            tile.addEventListener('mouseleave', () => {
                gsap.to(tile, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
            });
        });
    }

    // ── Stack Cards (A-Series page) ──
    const stackCards = gsap.utils.toArray('.stack-card');
    stackCards.forEach((card, i) => {
        // Cards are visible by default — only compress when next card enters
        if (i < stackCards.length - 1) {
            gsap.to(card, {
                scale: 0.94,
                opacity: 0.4,
                scrollTrigger: {
                    trigger: stackCards[i + 1],
                    start: 'top 80%',
                    end: 'top 20%',
                    scrub: true
                }
            });
        }
    });

    // ── Vision Section V3 (Home Redesign) ──
    const visionV3 = document.querySelector('.vision-structured-v3');
    if (visionV3) {
        const v3Heading = visionV3.querySelector('.reveal-heading-v3');
        const v3Card    = visionV3.querySelector('.reveal-card-v3');
        const v3Items   = visionV3.querySelectorAll('.reveal-item');

        ScrollTrigger.create({
            trigger: visionV3,
            start: 'top 65%',
            once: true,
            onEnter: () => {
                if (v3Heading) v3Heading.classList.add('active');
                if (v3Card) v3Card.classList.add('active');
                gsap.to(v3Items, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power3.out',
                    delay: 0.5
                });
                
                // Ensure video attempts play again on entry if needed
                const visionVideo = document.getElementById('demo-video');
                if (visionVideo) visionVideo.play().catch(() => {
                    console.log("Autoplay prevented by browser; user interaction needed.");
                });
            }
        });
    }

    // ── UWO Story Section (About) ──
    const uwoSection = document.getElementById('uwo-story');
    if (uwoSection) {
        const uwoWords = uwoSection.querySelectorAll('.u-word');
        const uwoItems = uwoSection.querySelectorAll('.reveal-item');
        const uwoCard  = uwoSection.querySelector('.uwo-video-card-reveal');

        const uwoTL = gsap.timeline({
            scrollTrigger: { trigger: uwoSection, start: 'top 70%', once: true }
        });
        uwoTL.to(uwoWords, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'expo.out' })
             .to(uwoItems, { opacity: 1, y: 0, duration: 0.7, stagger: 0.13, ease: 'power2.out' }, '-=0.5')
             .to(uwoCard,  { opacity: 1, x: 0, scale: 1, duration: 1.3, ease: 'expo.out' }, '-=1');

        // Counters
        uwoSection.querySelectorAll('.stat-value[data-val]').forEach(stat => {
            const val = parseInt(stat.getAttribute('data-val'));
            uwoTL.to(stat, { innerText: val, duration: 1.8, snap: { innerText: 1 }, ease: 'power2.out' }, '-=0.8');
        });
    }

    // ── Mission V2 Section (About) ──
    const missionV2 = document.getElementById('mission-v2');
    if (missionV2) {
        const mWords  = missionV2.querySelectorAll('.m-word');
        const mItems  = missionV2.querySelectorAll('.reveal-item');
        const mCounts = missionV2.querySelectorAll('.min-val.m-count');

        const mTL = gsap.timeline({
            scrollTrigger: { trigger: missionV2, start: 'top 75%', once: true }
        });
        mTL.to(mWords, { opacity: 1, y: 0, duration: 0.9, stagger: 0.07, ease: 'expo.out' })
           .to(mItems, { opacity: 1, y: 0, duration: 0.7, stagger: 0.18, ease: 'power2.out' }, '-=0.5');

        mCounts.forEach(stat => {
            const val = parseInt(stat.getAttribute('data-val'));
            mTL.to(stat, { innerText: val, duration: 1.8, snap: { innerText: 1 }, ease: 'power2.out' }, '-=0.8');
        });
    }

    // ── Horizontal Feature Strip (About Roadmap) ──
    const hstripOuter    = document.getElementById('hstrip-outer');
    const hstripTrack    = document.getElementById('hstrip-track');
    const hstripProgress = document.getElementById('hstrip-progress');

    if (hstripOuter && hstripTrack) {
        const items = hstripTrack.querySelectorAll('.hstrip-item');

        gsap.fromTo(items,
            { opacity: 0, y: 50 },
            {
                opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
                scrollTrigger: { trigger: hstripOuter, start: 'top 85%', once: true }
            }
        );

        // Drag to scroll
        let isDown = false, startX, scrollLeft;
        hstripOuter.addEventListener('mousedown', (e) => { isDown = true; hstripOuter.classList.add('is-dragging'); startX = e.pageX - hstripOuter.offsetLeft; scrollLeft = hstripOuter.scrollLeft; });
        hstripOuter.addEventListener('mouseleave', () => { isDown = false; hstripOuter.classList.remove('is-dragging'); });
        hstripOuter.addEventListener('mouseup', () => { isDown = false; hstripOuter.classList.remove('is-dragging'); });
        hstripOuter.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            hstripOuter.scrollLeft = scrollLeft - (e.pageX - hstripOuter.offsetLeft - startX) * 1.5;
        });

        // Progress + active tracking
        hstripOuter.addEventListener('scroll', () => {
            const max = hstripOuter.scrollWidth - hstripOuter.clientWidth;
            if (hstripProgress) hstripProgress.style.width = (max > 0 ? (hstripOuter.scrollLeft / max) * 100 : 0) + '%';
            const cx = hstripOuter.scrollLeft + hstripOuter.clientWidth / 2;
            items.forEach(item => {
                item.classList.toggle('is-active', Math.abs(cx - (item.offsetLeft + item.offsetWidth / 2)) < item.offsetWidth * 0.6);
            });
        });

        if (items.length > 0) items[0].classList.add('is-active');
    }

    // ── Trust / Connect Grid (Contact page) ──
    const whyUsGrid = document.querySelector('.why-us-cinematic .trust-grid');
    if (whyUsGrid) {
        const left   = document.querySelector('.card-left');
        const center = document.querySelector('.card-center');
        const right  = document.querySelector('.card-right');
        gsap.timeline({ scrollTrigger: { trigger: whyUsGrid, start: 'top 75%', once: true } })
            .to(left,   { x: 0, scale: 1, opacity: 1, duration: 1.3, ease: 'expo.out' })
            .to(center, { rotateX: 0, scale: 1, opacity: 1, duration: 1.5, ease: 'elastic.out(1, 0.75)' }, '-=0.9')
            .to(right,  { x: 0, scale: 1, opacity: 1, duration: 1.3, ease: 'expo.out' }, '-=1.1');
    }

    const connectGrid = document.querySelector('.connect-grid');
    if (connectGrid) {
        const cl = document.querySelector('.connect-left');
        const cc = document.querySelector('.connect-center-reveal');
        const cr = document.querySelector('.connect-right');
        gsap.timeline({ scrollTrigger: { trigger: connectGrid, start: 'top 80%', once: true } })
            .to(cl, { x: 0, scale: 1, opacity: 1, duration: 1.3, ease: 'expo.out' })
            .to(cc, { scale: 1.05, rotateY: 0, opacity: 1, duration: 1.5, ease: 'elastic.out(1, 0.75)' }, '-=0.9')
            .to(cr, { x: 0, scale: 1, opacity: 1, duration: 1.3, ease: 'expo.out' }, '-=1.1');
    }

    // ── A-Series Stream Grid / Module rows ──
    gsap.utils.toArray('.streams-grid, .stream-card, .module-preview, .a-series-module').forEach(el => {
        const children = el.querySelectorAll(':scope > *');
        if (children.length > 1) {
            gsap.fromTo(children,
                { opacity: 0, y: 40 },
                {
                    opacity: 1, y: 0, duration: 0.75, stagger: 0.1, ease: 'power3.out',
                    scrollTrigger: { trigger: el, start: 'top 86%', once: true }
                }
            );
        } else {
            gsap.fromTo(el, { opacity: 0, y: 40 }, {
                opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 86%', once: true }
            });
        }
    });

    // ── Standalone Dividers / Lines / Animated elements ──
    revealGroup(
        '.animated-line, .animated-divider, .footer-divider',
        { opacity: 0, scaleX: 0 },
        { duration: 0.9, ease: 'power3.out', start: 'top 92%' }
    );


    // ═══════════════════════════════════════════
    // 6. MAGNETIC CURSOR
    // ═══════════════════════════════════════════
    const cursor    = document.getElementById('cursor');
    const cursorBlur = document.getElementById('cursor-blur');
    if (cursor && cursorBlur) {
        let mouseX = 0, mouseY = 0, ballX = 0, ballY = 0, blurX = 0, blurY = 0;

        document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });

        function animateCursor() {
            ballX += (mouseX - ballX) * 0.2;
            ballY += (mouseY - ballY) * 0.2;
            blurX += (mouseX - blurX) * 0.1;
            blurY += (mouseY - blurY) * 0.1;
            cursor.style.left = ballX + 'px';
            cursor.style.top  = ballY + 'px';
            cursorBlur.style.left = blurX + 'px';
            cursorBlur.style.top  = blurY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        document.querySelectorAll('a, button, .pillar-card, .a-tile, .hstrip-item, .stack-card, [data-tilt]').forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to(cursorBlur, { width: 80, height: 80, backgroundColor: 'rgba(0,132,255,0.05)', borderColor: 'rgba(0,132,255,0.5)', duration: 0.3 });
                gsap.to(cursor, { scale: 0.4, duration: 0.3 });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(cursorBlur, { width: 40, height: 40, backgroundColor: 'transparent', borderColor: 'rgba(0,132,255,0.3)', duration: 0.3 });
                gsap.to(cursor, { scale: 1, duration: 0.3 });
            });
        });
    }


    // ═══════════════════════════════════════════
    // 7. 3D TILT EFFECT (data-tilt)
    // ═══════════════════════════════════════════
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const rx = (rect.height / 2 - (e.clientY - rect.top)) / 14;
            const ry = ((e.clientX - rect.left) - rect.width / 2) / 14;
            gsap.to(card, { rotateX: rx, rotateY: ry, scale: 1.02, duration: 0.4, ease: 'power2.out' });
            card.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
            card.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
        });
    });


    // ═══════════════════════════════════════════
    // 8. STICKY HEADER STATE
    // ═══════════════════════════════════════════
    const header = document.getElementById('header');
    if (header) {
        ScrollTrigger.create({
            start: 'top -80',
            onEnter:     () => header.classList.add('scrolled'),
            onLeaveBack: () => header.classList.remove('scrolled'),
        });
    }

    // ═══════════════════════════════════════════
    // 9. PREMIUM CHATBOT LOGIC (AI-Mall bot™)
    // ═══════════════════════════════════════════
    window.toggleChat = () => {
        const win = document.getElementById('chat-window');
        if (win) win.classList.toggle('active');
    };

    // Wire up bot orb and close button via IDs (inline onclick removed for module compatibility)
    document.getElementById('chat-orb-btn')?.addEventListener('click', window.toggleChat);
    document.getElementById('chat-close-btn')?.addEventListener('click', window.toggleChat);

    window.handleChatReg = (e) => {
        e.preventDefault();
        const n = document.getElementById('chat-reg-name')?.value;
        const email = document.getElementById('chat-reg-email')?.value;
        if (!n || !email) return;

        localStorage.setItem('chat_registered', 'true');
        localStorage.setItem('chat_user', n);
        localStorage.setItem('chat_email', email);

        const regView = document.getElementById('registration-view');
        const msgView = document.getElementById('chat-messages');
        const input = document.getElementById('chat-main-input');

        if (regView) regView.style.display = 'none';
        if (msgView) msgView.style.display = 'flex';
        if (input) {
            input.placeholder = "Type message...";
            input.readOnly = false;
        }

        const msgBox = document.getElementById('chat-messages');
        if (msgBox) {
            const welcome = document.createElement('div');
            welcome.className = 'chat-msg msg-ai';
            welcome.textContent = `Welcome back, ${n}! How can I assist you with the AI-Mall™ ecosystem today?`;
            msgBox.appendChild(welcome);
            msgBox.scrollTop = msgBox.scrollHeight;
        }
    };

    window.sendMessage = async () => {
        const input = document.getElementById('chat-main-input');
        const val = input?.value.trim();
        if (!val || input.readOnly) return;

        const msgBox = document.getElementById('chat-messages');
        if (!msgBox) return;

        // User Message
        const u = document.createElement('div');
        u.className = 'chat-msg msg-user';
        u.textContent = val;
        msgBox.appendChild(u);
        input.value = "";
        msgBox.scrollTop = msgBox.scrollHeight;

        // Show Thinking Indicator
        const thinking = document.createElement('div');
        thinking.className = 'thinking';
        thinking.innerHTML = '<span></span><span></span><span></span>';
        msgBox.appendChild(thinking);
        msgBox.scrollTop = msgBox.scrollHeight;

        // Prepare AI Message Container (HIDDEN initially)
        const aiMsg = document.createElement('div');
        aiMsg.className = 'chat-msg msg-ai';
        aiMsg.style.display = 'none';
        msgBox.appendChild(aiMsg);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
        }, 45000); // 45s Timeout

        try {
            const baseUrl = window.API_BASE_URL;
            const response = await fetch(`${baseUrl}/rag/chat/stream`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: val, sessionId: 'floating-assistant' }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) throw new Error(`Server ${response.status}`);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullText = "";
            let firstChunk = true;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');
                
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.type === 'chunk') {
                                if (firstChunk) {
                                  thinking.remove();
                                  aiMsg.style.display = 'block';
                                  firstChunk = false;
                                }
                                fullText += data.text;
                                
                                // Basic Markdown Parser for streaming text
                                const parseBasicMarkdown = (text) => {
                                    if (!text) return '';
                                    let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
                                    const lines = html.split('\n');
                                    let result = '';
                                    let listType = null;
                                    for (let line of lines) {
                                        const ulMatch = line.match(/^[\s]*[-*][\s]+(.*)$/);
                                        const olMatch = line.match(/^[\s]*\d+\.[\s]+(.*)$/);
                                        const isList = ulMatch || olMatch;
                                        const curType = ulMatch ? 'ul' : (olMatch ? 'ol' : null);
                                        const item = ulMatch ? ulMatch[1] : (olMatch ? olMatch[1] : null);
                                        
                                        if (isList) {
                                            if (listType !== curType) {
                                                if (listType) result += `</${listType}>\n`;
                                                result += `<${curType} style="margin: 5px 0 5px 20px; padding: 0;">\n`;
                                                listType = curType;
                                            }
                                            result += `  <li style="margin-bottom: 5px;">${item}</li>\n`;
                                        } else {
                                            if (listType) { result += `</${listType}>\n`; listType = null; }
                                            result += line + '<br>';
                                        }
                                    }
                                    if (listType) result += `</${listType}>\n`;
                                    return result.replace(/(<br>)+$/, '');
                                };
                                
                                aiMsg.innerHTML = parseBasicMarkdown(fullText);
                                msgBox.scrollTop = msgBox.scrollHeight;
                            }
                        } catch (e) { /* partial chunk */ }
                    }
                }
            }
        } catch (err) {
            clearTimeout(timeoutId);
            console.error('Chat Error:', err);
            thinking.remove();
            aiMsg.style.display = 'block';
            if (err.name === 'AbortError') {
              aiMsg.textContent = "Request timed out. The AI is taking too long to synthesize - please try again later.";
            } else {
              aiMsg.textContent = "Connectivity error. Unable to reach AI-Mall™ servers.";
            }
        }
        msgBox.scrollTop = msgBox.scrollHeight;
    };

    // Initialize Chat state
    if (localStorage.getItem('chat_registered') === 'true') {
        const rv = document.getElementById('registration-view');
        const mv = document.getElementById('chat-messages');
        const ci = document.getElementById('chat-main-input');
        if (rv) rv.style.display = 'none';
        if (mv) mv.style.display = 'flex';
        if (ci) {
            ci.placeholder = "Type message...";
            ci.readOnly = false;
        }
    }

    // Enter Key to Send
    const chatInput = document.getElementById('chat-main-input');
    if (chatInput) {
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                window.sendMessage();
            }
        });
    }

});
