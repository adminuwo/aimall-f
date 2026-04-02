// AI-Mall™ — Universal Cinematic Engine
// Smooth Scroll + Universal Reveal System

document.addEventListener('DOMContentLoaded', () => {
    // ── Global API Configuration ──
    // Production Backend URL (Cloud Run)
    window.API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:8080/api'
        : 'https://aimall-b-246449377479.asia-south1.run.app/api';

    // ── Global Interface Controls ──
    // (Consolidated in gateway.js for cinematic performance)

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
    // NAVIGATION MOBILE TOGGLE (Global)
    // ═══════════════════════════════════════════
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });

        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('active')) {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    }

    // Touch device detection to hide custom cursor
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
        const cursor = document.getElementById('cursor');
        const cursorBlur = document.getElementById('cursor-blur');
        if (cursor) cursor.style.display = 'none';
        if (cursorBlur) cursorBlur.style.display = 'none';
        document.body.style.cursor = 'auto';
    }


    // ═══════════════════════════════════════════
    // 2. ONBOARDING & LOADER FLOW
    // ═══════════════════════════════════════════
    const loaderOverlay = document.getElementById('onboarding-overlay');
    const newLoader = document.getElementById('new-loader');
    const welcomeCard = document.getElementById('welcome-card');
    const chatAssistant = document.getElementById('ai-chat-assistant');
    const body = document.body;

    // Check if user has already onboarded
    const hasOnboarded = sessionStorage.getItem('ai_mall_onboarded');

    if (loaderOverlay && !hasOnboarded) {
        body.classList.add('onboarding-active');

        // Hide chatbot while onboarding
        if (chatAssistant) chatAssistant.classList.add('ai-chat-hidden');

        const introControls = document.querySelector('.intro-controls-v2');
        const soundToggle = document.getElementById('toggle-sound');
        const skipBtn = document.getElementById('skip-intro');
        const introVideo = document.getElementById('intro-video');

        function showWelcomeCard() {
            if (welcomeCard) {
                welcomeCard.style.display = 'block';
                welcomeCard.offsetHeight;
                welcomeCard.classList.add('visible');
                // Added: Trigger the blur background switch only when bot card appears
                if (loaderOverlay) loaderOverlay.classList.add('show-blur');
            }
        }

        function handleVideoEnd() {
            if (introVideo) {
                introVideo.classList.remove('playing');
                introVideo.pause();
            }
            if (introControls) {
                introControls.classList.remove('visible');
                setTimeout(() => introControls.style.display = 'none', 400);
            }
            // Transition to card (Step 3)
            setTimeout(showWelcomeCard, 600);
        }

        function updateSoundUI(video, isMuted) {
            const sOn = document.getElementById('sound-on');
            const sOff = document.getElementById('sound-off');
            const sLbl = document.querySelector('.control-label');
            if (!sOn || !sOff || !sLbl) return;
            if (isMuted) {
                sOn.style.display = 'none'; sOff.style.display = 'block';
                sLbl.textContent = "Unmute"; video.muted = true;
            } else {
                sOn.style.display = 'block'; sOff.style.display = 'none';
                sLbl.textContent = "Mute"; video.muted = false;
            }
        }

        // STEP 1 & 2: Start with Logo, transition to Video
        setTimeout(() => {
            // Fade out logo components (Step 1 end)
            if (newLoader) {
                newLoader.style.opacity = '0';
                newLoader.style.transform = 'scale(0.95)';
                setTimeout(() => newLoader.style.display = 'none', 600);
            }

            // Clean move: Hide background text to avoid overlap with video
            const bgText = document.querySelector('.loader-bg-text');
            if (bgText) {
                bgText.style.transition = 'opacity 0.6s ease';
                bgText.style.opacity = '0';
                setTimeout(() => bgText.style.display = 'none', 600);
            }

            // Start Video (Step 2 start)
            if (introVideo) {
                introVideo.classList.add('playing');
                if (introControls) {
                    introControls.style.display = 'flex';
                    setTimeout(() => introControls.classList.add('visible'), 150);
                }

                introVideo.play().then(() => {
                    updateSoundUI(introVideo, false);
                }).catch(() => {
                    introVideo.muted = true;
                    introVideo.play();
                    updateSoundUI(introVideo, true);
                });

                if (soundToggle) soundToggle.onclick = () => {
                    introVideo.muted = !introVideo.muted;
                    updateSoundUI(introVideo, introVideo.muted);
                };
                if (skipBtn) skipBtn.onclick = handleVideoEnd;
                introVideo.addEventListener('ended', handleVideoEnd);
            } else {
                // If no video, skip directly to Step 3
                showWelcomeCard();
            }
        }, 2200); // 2.2s for the initial brand reveal
    } else {
        // Already onboarded or elements missing, normal load
        if (loaderOverlay) loaderOverlay.style.display = 'none';
        body.classList.remove('loading');
        body.classList.remove('onboarding-active');
        // Ensure chatbot is visible if already onboarded
        if (chatAssistant) {
            chatAssistant.classList.remove('ai-chat-hidden');
            chatAssistant.style.opacity = '1';
            chatAssistant.style.visibility = 'visible';
        }
        startHeroAnimations();
    }

    // Onboarding Interactions
    const btnTryNow = document.getElementById('btn-try-now');
    const btnGotIt = document.getElementById('btn-got-it');

    function completeOnboarding(openChat = false) {
        sessionStorage.setItem('ai_mall_onboarded', 'true');

        // Hide card first
        if (welcomeCard) welcomeCard.classList.remove('visible');

        setTimeout(() => {
            // Fade out overlay revealing the homepage
            if (loaderOverlay) {
                loaderOverlay.style.opacity = '0';
                loaderOverlay.style.pointerEvents = 'none';
            }
            body.classList.remove('loading');
            body.classList.remove('onboarding-active');

            setTimeout(() => {
                if (loaderOverlay) loaderOverlay.style.display = 'none';
                // Trigger hero animation smoothly once homepage revealed
                startHeroAnimations();

                // Pop-in chatbot after reveal
                if (chatAssistant) {
                    chatAssistant.classList.remove('ai-chat-hidden');
                    chatAssistant.classList.add('ai-chat-pop-in');
                    if (openChat && window.toggleChat) {
                        setTimeout(() => window.toggleChat(), 500);
                    }
                }
            }, 800);
        }, 400);
    }

    if (btnTryNow) btnTryNow.addEventListener('click', () => completeOnboarding(true));
    if (btnGotIt) btnGotIt.addEventListener('click', () => completeOnboarding(false));


    // ═══════════════════════════════════════════
    // 3. HERO ENTRY ANIMATION
    // ═══════════════════════════════════════════
    function startHeroAnimations() {
        const tl = gsap.timeline();
        tl.to('.reveal-text', { opacity: 1, y: 0, duration: 1.4, ease: 'expo.out', stagger: 0.15 })
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
        '.section-title, .hstrip-title, .uwo-title, .hstrip-header h2, .founder-name, .premium-heading',
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

    // ── Vision Section Premium (Home Redesign) ──
    const visionPremium = document.querySelector('.vision-premium-redesign');
    if (visionPremium) {
        const textArea = visionPremium.querySelector('.vision-text-area');
        const textChildren = textArea ? textArea.children : [];
        const mainCard = visionPremium.querySelector('.premium-main-card');
        const nestedCard = visionPremium.querySelector('.nested-glass-card');

        ScrollTrigger.create({
            trigger: visionPremium,
            start: 'top 70%',
            once: true,
            onEnter: () => {
                // Slide from Left for Text
                gsap.fromTo(textChildren,
                    { opacity: 0, x: -60 },
                    { opacity: 1, x: 0, duration: 1.2, stagger: 0.15, ease: 'expo.out' }
                );

                // Scale + Fade for Main Card
                if (mainCard) {
                    gsap.fromTo(mainCard,
                        { opacity: 0, scale: 0.95 },
                        { opacity: 1, scale: 1, duration: 1.5, ease: 'expo.out' }
                    );
                }
            }
        });

        // Parallax Tilt for Nested Card
        if (nestedCard) {
            nestedCard.addEventListener('mousemove', (e) => {
                const rect = nestedCard.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(nestedCard, {
                    rotateY: x / 12,
                    rotateX: -y / 12,
                    x: x / 18,
                    y: y / 18,
                    duration: 0.6,
                    ease: 'power2.out'
                });
            });
            nestedCard.addEventListener('mouseleave', () => {
                gsap.to(nestedCard, { rotateY: 0, rotateX: 0, x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.3)' });
            });
        }

        // Mouse follow glow for the main card container
        if (mainCard) {
            mainCard.addEventListener('mousemove', (e) => {
                const rect = mainCard.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                mainCard.style.setProperty('--mouse-x', `${x}px`);
                mainCard.style.setProperty('--mouse-y', `${y}px`);
            });
        }
    }

    // ── UWO Story Section (About) ──
    const uwoSection = document.getElementById('uwo-story');
    if (uwoSection) {
        const uwoWords = uwoSection.querySelectorAll('.u-word');
        const uwoItems = uwoSection.querySelectorAll('.reveal-item');
        const uwoCard = uwoSection.querySelector('.uwo-video-card-reveal');

        const uwoTL = gsap.timeline({
            scrollTrigger: { trigger: uwoSection, start: 'top 70%', once: true }
        });
        uwoTL.to(uwoWords, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'expo.out' })
            .to(uwoItems, { opacity: 1, y: 0, duration: 0.7, stagger: 0.13, ease: 'power2.out' }, '-=0.5')
            .to(uwoCard, { opacity: 1, x: 0, scale: 1, duration: 1.3, ease: 'expo.out' }, '-=1');

        // Counters
        uwoSection.querySelectorAll('.stat-value[data-val]').forEach(stat => {
            const val = parseInt(stat.getAttribute('data-val'));
            uwoTL.to(stat, { innerText: val, duration: 1.8, snap: { innerText: 1 }, ease: 'power2.out' }, '-=0.8');
        });
    }

    // ── Mission V2 Section (About) ──
    const missionV2 = document.getElementById('mission-v2');
    if (missionV2) {
        const mWords = missionV2.querySelectorAll('.m-word');
        const mItems = missionV2.querySelectorAll('.reveal-item');
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
    const hstripOuter = document.getElementById('hstrip-outer');
    const hstripTrack = document.getElementById('hstrip-track');
    const hstripProgress = document.getElementById('hstrip-progress');

    if (hstripOuter && hstripTrack) {
        const items = hstripTrack.querySelectorAll('.hstrip-item');

        gsap.fromTo(items,
            { opacity: 0, x: 100 },
            {
                opacity: 1, x: 0, duration: 1.2, stagger: 0.18, ease: 'power3.out',
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
        const left = document.querySelector('.card-left');
        const center = document.querySelector('.card-center');
        const right = document.querySelector('.card-right');
        gsap.timeline({ scrollTrigger: { trigger: whyUsGrid, start: 'top 75%', once: true } })
            .to(left, { x: 0, scale: 1, opacity: 1, duration: 1.3, ease: 'expo.out' })
            .to(center, { rotateX: 0, scale: 1, opacity: 1, duration: 1.5, ease: 'elastic.out(1, 0.75)' }, '-=0.9')
            .to(right, { x: 0, scale: 1, opacity: 1, duration: 1.3, ease: 'expo.out' }, '-=1.1');
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
    // 6. SMOOTH CUSTOM CURSOR & TEXT REVEAL
    // ═══════════════════════════════════════════

    // Create Cursor Elements if missing
    let cursor = document.getElementById('cursor');
    let cursorBlur = document.getElementById('cursor-blur');

    if (!cursor) {
        cursor = document.createElement('div');
        cursor.id = 'cursor';
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);
    }
    if (!cursorBlur) {
        cursorBlur = document.createElement('div');
        cursorBlur.id = 'cursor-blur';
        cursorBlur.className = 'custom-cursor-follower';
        document.body.appendChild(cursorBlur);
    }

    let mouseX = 0, mouseY = 0, ballX = 0, ballY = 0, blurX = 0, blurY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        // Smooth interpolation
        ballX += (mouseX - ballX) * 0.15;
        ballY += (mouseY - ballY) * 0.15;
        blurX += (mouseX - blurX) * 0.1;
        blurY += (mouseY - blurY) * 0.1;

        cursor.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;
        cursorBlur.style.transform = `translate3d(${blurX - 20}px, ${blurY - 20}px, 0)`;

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects for cursor
    const interactiveEls = 'a, button, .chat-close, .chat-orb, .pillar-card, .aseries-nav-btn, .aseries-btn-primary, .v3-btn-premium-cta, [data-tilt]';
    document.querySelectorAll(interactiveEls).forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorBlur.style.width = '60px';
            cursorBlur.style.height = '60px';
            cursorBlur.style.backgroundColor = 'rgba(42, 82, 190, 0.1)';
            cursor.style.transform += ' scale(2.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursorBlur.style.width = '40px';
            cursorBlur.style.height = '40px';
            cursorBlur.style.backgroundColor = 'rgba(42, 82, 190, 0.05)';
            cursor.style.transform = cursor.style.transform.replace(' scale(2.5)', '');
        });
    });

    // --- Global Smooth Text Reveal ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // Apply reveal class to all text-heavy elements
    const textSelectors = 'h1, h2, h3, h4, h5, h6, p, .v3-badge, .aseries-subtext, .subheadline';
    document.querySelectorAll(textSelectors).forEach(el => {
        el.classList.add('smooth-reveal');
        revealObserver.observe(el);
    });


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
            onEnter: () => header.classList.add('scrolled'),
            onLeaveBack: () => header.classList.remove('scrolled'),
        });
    }

    // ═══════════════════════════════════════════
    // 9. PREMIUM CHATBOT LOGIC (AISA™)
    // ═══════════════════════════════════════════
    let lastChatToggle = 0;
    window.toggleChat = () => {
        const now = Date.now();
        if (now - lastChatToggle < 400) return; // Prevent double-triggering
        lastChatToggle = now;

        const win = document.getElementById('chat-window');
        const tooltip = document.getElementById('chat-tooltip');
        const orb = document.querySelector('.chatbot-chat-icon');

        if (win) {
            console.log('🔄 Toggling Chat Window');
            win.classList.toggle('active');
            
            if (win.classList.contains('active')) {
                if (tooltip) tooltip.classList.remove('visible');
                if (orb) orb.classList.remove('active-pop');
            }
        }
    };

    // Robust Close Listener with absolute propagation stop
    document.addEventListener('click', (e) => {
        if (e.target.closest('.chat-close')) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 Close Button Hit (Global Intercept)');
            window.toggleChat();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const win = document.getElementById('chat-window');
            if (win && win.classList.contains('active')) {
                window.toggleChat();
            }
        }
    });

    // Proactive Chatbot Engagement (trigger after delay)
    // Delay: 45 seconds for a premium, non-intrusive feel
    const ENGAGEMENT_DELAY = 45000;
    setTimeout(() => {
        const tooltip = document.getElementById('chat-tooltip');
        const orb = document.querySelector('.chatbot-chat-icon');
        const win = document.getElementById('chat-window');

        // Only trigger if chat window is NOT already active
        if (win && !win.classList.contains('active')) {
            if (tooltip) tooltip.classList.add('visible');
            if (orb) orb.classList.add('active-pop');
        }
    }, ENGAGEMENT_DELAY);

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
                                
                                // Simple markdown-to-HTML parser (Refined for spacing)
                                let processedText = fullText
                                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
                                    .split('\n').map(line => {
                                        let trimmed = line.trim();
                                        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                                            return `<li>${trimmed.substring(2)}</li>`;
                                        }
                                        return trimmed;
                                    }).join('\n');

                                // Group <li> into <ul> and handle line breaks concisely
                                aiMsg.innerHTML = processedText
                                    .replace(/(<li>.*?<\/li>[\n\s]*)+/g, (match) => {
                                        return `<ul style="margin: 4px 0;">${match.trim().replace(/\n/g, '')}</ul>`;
                                    })
                                    .replace(/\n\n+/g, '<br>') // Collapse multiple newlines to a single break
                                    .replace(/\n/g, '<br>');   // Map single newline to single break
                                
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

    // ═══════════════════════════════════════════
    // 10. PREMIUM GALLERY MODAL LOGIC
    // ═══════════════════════════════════════════
    window.premiumImages = [
        "aimallproject/slide-1.png", "aimallproject/slide-2.png", "aimallproject/slide-3.png",
        "aimallproject/slide-4.png", "aimallproject/slide-5.png", "aimallproject/slide-6.png",
        "aimallproject/slide-7.png", "aimallproject/slide-8.png", "aimallproject/slide-9.png",
        "aimallproject/slide-10.png", "aimallproject/slide-11.png", "aimallproject/slide-12.png"
    ];
    window.currentPremiumIndex = 0;
    window.galleryAutoPlayInterval = null;

    window.openPremiumModal = function () {
        const modal = document.getElementById('premium-gallery-modal');
        if (modal) {
            modal.classList.add('open');
            document.body.classList.add('modal-active');
            window.currentPremiumIndex = 0; // Reset or sync
            window.updatePremiumImage();
            document.body.style.overflow = 'hidden';
            
            // Auto-start playing when opened
            window.startGalleryAutoPlay();
        }
    };

    window.closePremiumModal = function () {
        const modal = document.getElementById('premium-gallery-modal');
        if (modal) {
            modal.classList.remove('open');
            document.body.classList.remove('modal-active');
            document.body.style.overflow = '';
            if (window.galleryAutoPlayInterval) {
                window.stopGalleryAutoPlay();
            }
        }
    };

    window.premiumGalleryNext = function () {
        window.currentPremiumIndex = (window.currentPremiumIndex + 1) % window.premiumImages.length;
        window.updatePremiumImage();
    };

    window.premiumGalleryPrev = function () {
        window.currentPremiumIndex = (window.currentPremiumIndex - 1 + window.premiumImages.length) % window.premiumImages.length;
        window.updatePremiumImage();
    };

    window.updatePremiumImage = function () {
        const img = document.getElementById('premium-gallery-img');
        if (img) {
            img.style.opacity = '0';
            setTimeout(() => {
                img.src = window.premiumImages[window.currentPremiumIndex];
                img.style.opacity = '1';
            }, 250);
        }
        const curr = document.getElementById('gallery-current');
        if (curr) curr.innerText = window.currentPremiumIndex + 1;
    };

    window.toggleGalleryAutoPlay = function () {
        if (window.galleryAutoPlayInterval) {
            window.stopGalleryAutoPlay();
        } else {
            window.startGalleryAutoPlay();
        }
    };

    window.startGalleryAutoPlay = function () {
        const pBtn = document.getElementById('play-icon');
        const sBtn = document.getElementById('pause-icon');
        if (pBtn) pBtn.style.display = 'none';
        if (sBtn) sBtn.style.display = 'block';
        window.galleryAutoPlayInterval = setInterval(window.premiumGalleryNext, 3500);
    };

    window.stopGalleryAutoPlay = function () {
        const pBtn = document.getElementById('play-icon');
        const sBtn = document.getElementById('pause-icon');
        if (pBtn) pBtn.style.display = 'block';
        if (sBtn) sBtn.style.display = 'none';
        clearInterval(window.galleryAutoPlayInterval);
        window.galleryAutoPlayInterval = null;
    };

    // ═══════════════════════════════════════════
    // 11. LEGAL MODAL LOGIC (TERMS & PRIVACY)
    // ═══════════════════════════════════════════
    const legalContent = {
        terms: `
            <div class="legal-content-header">
                <h2 class="legal-content-title"><img src="logos/Logo.png" alt="AI-Mall" class="legal-logo-icon"> AIMall™ – Terms & Conditions</h2>
            </div>
            <div class="legal-content-scroll-box">
                <div class="legal-content-section">
                    <h3>1. 🔹 Acceptance of Terms</h3>
                    <p>Welcome to AIMall™, a platform owned and operated by <strong>Unified Web Options & Services Pvt. Ltd. (UWO™)</strong>.</p>
                    <p>By accessing, registering, or using AIMall™, you confirm that you have read, understood, and agreed to be bound by these Terms & Conditions (“Terms”). If you do not agree, you must discontinue use immediately.</p>
                </div>
                <div class="legal-content-section">
                    <h3>2. 🔹 About AIMall™</h3>
                    <p>AIMall™ is a unified AI marketplace and execution ecosystem that enables users to access multiple AI tools, perform tasks (content creation, automation, data processing), and interact through AISA™ (AI Super Assistant). AIMall™ functions as an orchestration platform, not a standalone AI model provider.</p>
                </div>
                <div class="legal-content-section">
                    <h3>3. 🔹 Eligibility</h3>
                    <p>Must be at least 18 years of age, have legal capacity for agreements, and provide accurate registration information.</p>
                </div>
                <div class="legal-content-section">
                    <h3>4. 🔹 Account Security</h3>
                    <p>You are responsible for maintaining credential confidentiality and all activities under your account. AIMall™ is not liable for unauthorized access.</p>
                </div>
                <div class="legal-content-section">
                    <h3>5. 🔹 Use of the Platform</h3>
                    <p>Lawful use only. No fraudulent activity, hacking, IP infringement, or distribution of abusive content.</p>
                </div>
                <div class="legal-content-section">
                    <h3>6. 🔹 AI Functionality & Limitations</h3>
                    <p>AI outputs may be inaccurate, incomplete, or biased. AI should NOT be relied upon for critical, legal, medical, or financial decisions without human validation. AIMall™ is an assistive system, not a replacement for human judgment.</p>
                </div>
                <div class="legal-content-section">
                    <h3>7. 🔹 Third-Party Services</h3>
                    <p>Access to third-party AI tools is subject to their own terms. AIMall™ does not control or guarantee their performance.</p>
                </div>
                <div class="legal-content-section">
                    <h3>8. 🔹 Intellectual Property</h3>
                    <p>Platform technology, branding, and AISA™ are owned by UWO™. Users retain ownership of created content but grant AIMall™ a license for platform functionality.</p>
                </div>
                <div class="legal-content-section">
                    <h3>9. 🔹 Payments & Subscriptions</h3>
                    <p>Fees apply for paid plans. Pricing may change. Payments are non-refundable unless stated otherwise.</p>
                </div>
                <div class="legal-content-section">
                    <h3>12. 🔹 Limitation of Liability</h3>
                    <p>AIMall™/UWO™ shall not be liable for errors in AI outputs, loss of data, revenue, or decisions made based on platform data. Use is at your own risk.</p>
                </div>
                <div class="legal-content-section">
                    <h3>15. 🔹 Governing Law</h3>
                    <p>Governed by the laws of <strong>India</strong>. Disputes subject to <strong>Jabalpur / Delhi</strong> jurisdiction.</p>
                </div>
                <div class="legal-content-section">
                    <h3>17. 🔹 Contact</h3>
                    <p>📧 admin@uwo24.com | 🌐 aimall24.com</p>
                </div>
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <button class="modal-action-btn" onclick="closeLegalModal()">Accept & Close</button>
            </div>
        `,
        privacy: `
            <div class="legal-content-header">
                <h2 class="legal-content-title"><img src="logos/Logo.png" alt="AI-Mall" class="legal-logo-icon"> AIMall™ – Privacy Policy</h2>
            </div>
            <div class="legal-content-scroll-box">
                <div class="legal-content-section">
                    <h3>1. Data Collection</h3>
                    <p>We process information required for account registration (name, email) and data generated during your interactions with AI agents to facilitate platform services.</p>
                </div>
                <div class="legal-content-section">
                    <h3>2. Data Sovereignty & Usage</h3>
                    <p>Inputs are used to generate AI outputs via orchestrated models. We do not sell personal data to third parties without consent. Data is processed to improve your individual user experience.</p>
                </div>
                <div class="legal-content-section">
                    <h3>3. Third-Party AI Data Processing</h3>
                    <p>When you utilize third-party AI tools via AIMall™, relevant data may be processed by those providers according to their respective privacy policies.</p>
                </div>
                <div class="legal-content-section">
                    <h3>4. Security Measures</h3>
                    <p>We implement industry-standard security to protect your account and data. Users are urged not to upload highly sensitive confidential data unless specifically permitted by their plan.</p>
                </div>
                <div class="legal-content-section">
                    <h3>5. User Rights</h3>
                    <p>You have the right to update your information and discontinue service at any time. For data inquiries, contact us at <strong>admin@uwo24.com</strong>.</p>
                </div>
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <button class="modal-action-btn" onclick="closeLegalModal()">I Understand</button>
            </div>
        `
    };

    window.openLegalModal = function (type) {
        const modal = document.getElementById('legal-modal');
        const contentBox = document.getElementById('legal-modal-content');
        const card = modal?.querySelector('.legal-modal-card');
        if (modal && contentBox && legalContent[type]) {
            contentBox.innerHTML = legalContent[type];
            // Ensure card exists and set attribute before showing
            if (card) {
                card.setAttribute('data-lenis-prevent', 'true');
                card.scrollTop = 0;
            }
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
            document.body.style.overflow = 'hidden';
            if (window.lenis) window.lenis.stop();
        }
    };

    window.closeLegalModal = function () {
        const modal = document.getElementById('legal-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
                if (window.lenis) window.lenis.start();
            }, 500);
        }
    };

    // Keyboard support for Legal Modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') window.closeLegalModal();
    });
    /* ═══════════════════════════════════════════════════════════════
       VISION™ PREMIUM WHITE THEME ENGINE
       Mirroring the A-Series logic but for the Vision section
       ═══════════════════════════════════════════════════════════════ */
    (function initVisionShowcase() {
        const fullImages = window.galleryImages || [
            'aimallproject/slide-1.png', 'aimallproject/slide-2.png',
            'aimallproject/slide-3.png', 'aimallproject/slide-4.png'
        ];
        const IMAGES = fullImages.slice(0, 11);

        let vIndex = 0;
        let vAutoplayTimer = null;
        let vIsAutoPlaying = false;
        let vIsLiked = false;
        let vIsRepeat = false;

        const vWrapper = document.getElementById('vision-carousel-wrapper');
        const vDotsEl = document.getElementById('vision-dots');
        const vPrevBtn = document.getElementById('vision-prev');
        const vNextBtn = document.getElementById('vision-next');
        const vPlayIcon = document.getElementById('vision-play-icon');
        const vPauseIcon = document.getElementById('vision-pause-icon');

        if (!vWrapper) return;

        function buildVisionCards() {
            vWrapper.innerHTML = '';
            IMAGES.forEach((img, i) => {
                const card = document.createElement('div');
                card.className = 'vision-v2-card';
                card.dataset.index = i;
                card.innerHTML = `
                    <img class="vision-v2-card-img" src="${img}" alt="Vision slide ${i + 1}" loading="lazy">
                    <div class="vision-v2-card-overlay">
                        <div class="vision-v2-view-info">View Gallery</div>
                    </div>
                    <div class="vision-v2-card-info">
                        <span class="vision-v2-card-label">Gallery Slide ${i + 1}</span>
                        <span class="vision-v2-card-tag">Intelligence View</span>
                    </div>
                `;
                card.addEventListener('click', () => {
                    const offset = getVisionOffset(i);
                    if (offset === 0) {
                        if (typeof window.openPremiumModal === 'function') {
                           window.openPremiumModal(i);
                        }
                    } else {
                        goToVision(i);
                    }
                });
                vWrapper.appendChild(card);
            });
            buildVisionDots();
            updateVisionOffsets();
        }

        function getVisionOffset(i) {
            let o = i - vIndex;
            const n = IMAGES.length;
            if (o > n / 2) o -= n;
            if (o < -n / 2) o += n;
            return o;
        }

        function updateVisionOffsets() {
            const cards = vWrapper.querySelectorAll('.vision-v2-card');
            cards.forEach((card, i) => {
                const off = getVisionOffset(i);
                card.dataset.offset = Math.max(-2, Math.min(2, off));
            });
            updateVisionDots();
        }

        function buildVisionDots() {
            if (!vDotsEl) return;
            vDotsEl.innerHTML = '';
            IMAGES.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.className = 'vision-v2-dot' + (i === vIndex ? ' active' : '');
                dot.addEventListener('click', () => goToVision(i));
                vDotsEl.appendChild(dot);
            });
        }

        function updateVisionDots() {
            if (!vDotsEl) return;
            const dots = vDotsEl.querySelectorAll('.vision-v2-dot');
            dots.forEach((d, i) => d.classList.toggle('active', i === vIndex));
        }

        function goToVision(idx) {
            vIndex = ((idx % IMAGES.length) + IMAGES.length) % IMAGES.length;
            updateVisionOffsets();
        }

        function goNext() { goToVision(vIndex + 1); }
        function goPrev() { goToVision(vIndex - 1); }

        if (vPrevBtn) vPrevBtn.addEventListener('click', () => { goPrev(); resetVisionAutoplay(); });
        if (vNextBtn) vNextBtn.addEventListener('click', () => { goNext(); resetVisionAutoplay(); });

        /* Player logic mirrors a-series */
        function startVisionAutoplay() {
            clearInterval(vAutoplayTimer);
            vIsAutoPlaying = true;
            vAutoplayTimer = setInterval(goNext, 2200);
            if (vPlayIcon) vPlayIcon.style.display = 'none';
            if (vPauseIcon) vPauseIcon.style.display = '';
            document.getElementById('vision-autoplay-btn')?.classList.add('active');
        }
        function stopVisionAutoplay() {
            clearInterval(vAutoplayTimer);
            vIsAutoPlaying = false;
            if (vPlayIcon) vPlayIcon.style.display = '';
            if (vPauseIcon) vPauseIcon.style.display = 'none';
            document.getElementById('vision-autoplay-btn')?.classList.remove('active');
        }
        function resetVisionAutoplay() { if (vIsAutoPlaying) { stopVisionAutoplay(); startVisionAutoplay(); } }

        window.toggleVisionAutoplay = function () { vIsAutoPlaying ? stopVisionAutoplay() : startVisionAutoplay(); };
        window.shuffleVisionCarousel = function () {
            goToVision(Math.floor(Math.random() * IMAGES.length));
            resetVisionAutoplay();
        };
        window.toggleVisionRepeat = function () {
            vIsRepeat = !vIsRepeat;
            document.getElementById('vision-repeat-btn')?.classList.toggle('active', vIsRepeat);
        };
        window.toggleVisionLike = function () {
            vIsLiked = !vIsLiked;
            document.getElementById('vision-like-btn')?.classList.toggle('active', vIsLiked);
        };

        buildVisionCards();
    })();
});


/* ═══════════════════════════════════════════════════════════════
   A-SERIES™ PREMIUM SHOWCASE ENGINE
   Self-initialising — runs after full DOM load
   ═══════════════════════════════════════════════════════════════ */
(function initAseriesShowcase() {

    /* ── Module Data ── */
    const MODULES = [
        {
            label: 'Ai-Hire™',
            tag: 'Recruitment AI',
            img: 'logos/aihire_logo.jpeg',
            desc: 'AI-powered recruitment engine that screens, ranks, and interviews candidates — cutting time-to-hire by 70%.'
        },
        {
            label: 'Ai-Base™',
            tag: 'Knowledge AI',
            img: 'logos/aibase_logo.jpeg',
            desc: 'Enterprise knowledge management powered by RAG. Instantly surface answers from your organization\'s entire data corpus.'
        },
        {
            label: 'Ai-Biz™',
            tag: 'Business AI',
            img: 'logos/aibiz_logo.jpeg',
            desc: 'End-to-end business intelligence module. Automate decisions, forecast trends, and power data-driven growth.'
        },
        {
            label: 'Derm-Foundation™',
            tag: 'Healthcare AI',
            img: 'logos/Derm.jpeg',
            desc: 'Clinical-grade dermatology AI trained on millions of skin pathology cases. Enables early, accurate detection.'
        },
        {
            label: 'Geospatial-Foundation™',
            tag: 'Remote Sensing AI',
            img: 'logos/GEOspatial.jpeg',
            desc: 'Satellite & aerial imagery analysis at enterprise scale. Urban planning, agriculture, environmental monitoring.'
        },
        {
            label: 'Bio-Psync™',
            tag: 'Pathology AI',
            img: 'logos/Biopsync.jpeg',
            desc: 'AI pathology engine for digital biopsy analysis. Accelerates diagnosis with precision histopathology models.'
        },
        {
            label: 'Ai-SuperAssistance™',
            tag: 'Cognitive AI',
            img: 'logos/aipersonal_logo.jpeg',
            desc: 'Omni-channel intelligent assistant with memory, context, and enterprise integrations. Your AI co-pilot.'
        },
        {
            label: 'Ai-Sales™',
            tag: 'Revenue AI',
            img: 'logos/aisales_logo.jpeg',
            desc: 'Predictive sales intelligence that scores leads, drafts outreach, and closes the loop on revenue growth.'
        }
    ];

    /* ── State ── */
    let currentIndex = 0;
    let autoplayTimer = null;
    let isAutoPlaying = false;
    let isLiked = false;
    let isRepeat = false;
    let dragStartX = 0;
    let isDragging = false;
    let modalIndex = 0;

    /* ── DOM Refs ── */
    const wrapper = document.getElementById('aseries-carousel-wrapper');
    const dotsEl = document.getElementById('aseries-dots');
    const prevBtn = document.getElementById('aseries-prev');
    const nextBtn = document.getElementById('aseries-next');
    const playIcon = document.getElementById('aseries-play-icon');
    const pauseIcon = document.getElementById('aseries-pause-icon');
    const modal = document.getElementById('aseries-modal');
    const modalImg = document.getElementById('aseries-modal-img');
    const modalTitle = document.getElementById('aseries-modal-title');
    const modalDesc = document.getElementById('aseries-modal-desc');
    const modalCtr = document.getElementById('aseries-modal-counter');
    const textCol = document.getElementById('aseries-text-col');
    const carouselCol = wrapper ? wrapper.closest('.aseries-carousel-col') : null;
    const canvas = document.getElementById('aseries-particles');

    if (!wrapper) return; // Not on home page

    /* ══════════════════════════════
       BUILD CAROUSEL CARDS
    ══════════════════════════════ */
    function buildCards() {
        wrapper.innerHTML = '';
        MODULES.forEach((mod, i) => {
            const card = document.createElement('div');
            card.className = 'aseries-card';
            card.dataset.index = i;
            card.innerHTML = `
                <img class="aseries-card-img" src="${mod.img}" alt="${mod.label}" loading="lazy">
                <div class="aseries-card-overlay">
                    <div class="aseries-view-info">View Info</div>
                </div>
                <div class="aseries-card-info">
                    <span class="aseries-card-label">${mod.label}</span>
                    <span class="aseries-card-tag">${mod.tag}</span>
                </div>
            `;
            card.addEventListener('click', () => {
                const offset = getOffset(i);
                if (offset === 0) {
                    openAseriesModal(i);
                } else {
                    goTo(i);
                }
            });
            /* 3D tilt + cursor glow on center card hover */
            card.addEventListener('mousemove', (e) => {
                if (getOffset(i) !== 0) return;
                const rect = card.getBoundingClientRect();
                const cx = ((e.clientX - rect.left) / rect.width) * 100;
                const cy = ((e.clientY - rect.top) / rect.height) * 100;
                card.style.setProperty('--cx', cx + '%');
                card.style.setProperty('--cy', cy + '%');
                const rx = (rect.height / 2 - (e.clientY - rect.top)) / 18;
                const ry = ((e.clientX - rect.left) - rect.width / 2) / 18;
                card.style.transform = `translate(-50%, -50%) scale(1.04) rotateX(${rx}deg) rotateY(${ry}deg)`;
            });
            card.addEventListener('mouseleave', () => {
                if (getOffset(i) !== 0) return;
                // smooth back
                card.style.transform = '';
                setTimeout(() => { updateOffsets(); }, 50);
            });
            wrapper.appendChild(card);
        });
        buildDots();
        updateOffsets();
    }

    function getOffset(i) {
        let o = i - currentIndex;
        const n = MODULES.length;
        if (o > n / 2) o -= n;
        if (o < -n / 2) o += n;
        return o;
    }

    function updateOffsets() {
        const cards = wrapper.querySelectorAll('.aseries-card');
        cards.forEach((card, i) => {
            const off = getOffset(i);
            // clamp display to ±3
            card.dataset.offset = Math.max(-3, Math.min(3, off));
        });
        updateDots();
    }

    function buildDots() {
        dotsEl.innerHTML = '';
        MODULES.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'aseries-dot' + (i === currentIndex ? ' active' : '');
            dot.setAttribute('aria-label', `Module ${i + 1}`);
            dot.addEventListener('click', () => goTo(i));
            dotsEl.appendChild(dot);
        });
    }

    function updateDots() {
        const dots = dotsEl.querySelectorAll('.aseries-dot');
        dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
    }

    function goTo(idx) {
        currentIndex = ((idx % MODULES.length) + MODULES.length) % MODULES.length;
        updateOffsets();
    }

    function goNext() { goTo(currentIndex + 1); }
    function goPrev() { goTo(currentIndex - 1); }

    /* ══════════════════════════════
       NAVIGATION CONTROLS
    ══════════════════════════════ */
    if (prevBtn) prevBtn.addEventListener('click', () => { goPrev(); resetAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goNext(); resetAutoplay(); });

    /* ══════════════════════════════
       DRAG / SWIPE
    ══════════════════════════════ */
    wrapper.addEventListener('mousedown', (e) => { isDragging = true; dragStartX = e.clientX; });
    wrapper.addEventListener('mousemove', (e) => { if (!isDragging) return; e.preventDefault(); });
    wrapper.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        const dx = e.clientX - dragStartX;
        if (Math.abs(dx) > 40) { dx < 0 ? goNext() : goPrev(); resetAutoplay(); }
    });
    wrapper.addEventListener('mouseleave', () => { isDragging = false; });

    wrapper.addEventListener('touchstart', (e) => { dragStartX = e.touches[0].clientX; }, { passive: true });
    wrapper.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - dragStartX;
        if (Math.abs(dx) > 40) { dx < 0 ? goNext() : goPrev(); resetAutoplay(); }
    }, { passive: true });

    /* ══════════════════════════════
       AUTOPLAY
    ══════════════════════════════ */
    function startAutoplay() {
        clearInterval(autoplayTimer);
        isAutoPlaying = true;
        autoplayTimer = setInterval(goNext, 2800);
        if (playIcon) playIcon.style.display = 'none';
        if (pauseIcon) pauseIcon.style.display = '';
        document.getElementById('aseries-autoplay-btn')?.classList.add('active');
    }
    function stopAutoplay() {
        clearInterval(autoplayTimer);
        isAutoPlaying = false;
        if (playIcon) playIcon.style.display = '';
        if (pauseIcon) pauseIcon.style.display = 'none';
        document.getElementById('aseries-autoplay-btn')?.classList.remove('active');
    }
    function resetAutoplay() { if (isAutoPlaying) { stopAutoplay(); startAutoplay(); } }

    window.toggleAseriesAutoplay = function () {
        isAutoPlaying ? stopAutoplay() : startAutoplay();
    };
    window.shuffleAseriesCarousel = function () {
        goTo(Math.floor(Math.random() * MODULES.length));
        resetAutoplay();
        const btn = document.getElementById('aseries-shuffle-btn');
        if (btn) { btn.classList.add('active'); setTimeout(() => btn.classList.remove('active'), 700); }
    };
    window.toggleAseriesRepeat = function () {
        isRepeat = !isRepeat;
        const btn = document.getElementById('aseries-repeat-btn');
        if (btn) btn.classList.toggle('active', isRepeat);
    };
    window.toggleAseriesLike = function () {
        isLiked = !isLiked;
        const btns = document.querySelectorAll('#aseries-like-btn, .aseries-modal-footer .aseries-modal-ctrl-btn:first-child');
        btns.forEach(b => {
            b.classList.toggle('active', isLiked);
            b.querySelector('svg path') && (b.querySelector('svg path').style.fill = isLiked ? '#f43f5e' : 'none');
        });
    };

    /* ══════════════════════════════
       FULLSCREEN MODAL
    ══════════════════════════════ */
    function updateModalContent(idx) {
        const mod = MODULES[idx];
        if (!mod) return;
        if (modalImg) {
            modalImg.style.opacity = '0';
            requestAnimationFrame(() => {
                modalImg.src = mod.img;
                modalImg.onload = () => { modalImg.style.opacity = '1'; };
                if (modalImg.complete) modalImg.style.opacity = '1';
            });
        }
        if (modalTitle) modalTitle.textContent = mod.label;
        if (modalDesc) modalDesc.textContent = mod.desc;
        if (modalCtr) modalCtr.textContent = `${idx + 1} / ${MODULES.length}`;
    }

    window.openAseriesModal = function (idx) {
        modalIndex = (idx !== undefined) ? idx : currentIndex;
        updateModalContent(modalIndex);
        if (modal) {
            modal.classList.add('open');
            document.body.classList.add('modal-active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    };
    window.closeAseriesModal = function () {
        if (modal) {
            modal.classList.remove('open');
            document.body.classList.remove('modal-active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    };
    window.nextAseriesModal = function () {
        modalIndex = (modalIndex + 1) % MODULES.length;
        updateModalContent(modalIndex);
    };
    window.prevAseriesModal = function () {
        modalIndex = (modalIndex - 1 + MODULES.length) % MODULES.length;
        updateModalContent(modalIndex);
    };

    /* Keyboard nav for modal */
    document.addEventListener('keydown', (e) => {
        if (!modal || !modal.classList.contains('open')) return;
        if (e.key === 'ArrowRight') window.nextAseriesModal();
        if (e.key === 'ArrowLeft') window.prevAseriesModal();
        if (e.key === 'Escape') window.closeAseriesModal();
    });

    /* ══════════════════════════════
       PARTICLE CANVAS
    ══════════════════════════════ */
    function initParticles() {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const PARTICLE_COUNT = 80;
        const particles = [];

        function resize() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.8 + 0.3,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                alpha: Math.random() * 0.6 + 0.15,
                hue: Math.random() > 0.5 ? 250 : 280  // indigo or violet
            });
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.alpha})`;
                ctx.fill();

                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
            });

            // draw connecting lines between nearby particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(129,140,248,${(1 - dist / 100) * 0.18})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(draw);
        }
        draw();
    }

    /* ══════════════════════════════
       SCROLL REVEAL ENTRANCE
    ══════════════════════════════ */
    function setupReveal() {
        const section = document.getElementById('a-series');
        if (!section) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (textCol) textCol.classList.add('revealed');
                    if (carouselCol) carouselCol.classList.add('revealed');
                    observer.disconnect();
                    // Start autoplay on enter
                    setTimeout(() => startAutoplay(), 1200);
                }
            });
        }, { threshold: 0.25 });
        observer.observe(section);
    }

    buildCards();
    initParticles();
    setupReveal();
})();
