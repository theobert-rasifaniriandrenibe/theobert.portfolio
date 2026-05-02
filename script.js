// Improved interactions and accessibility

document.addEventListener('DOMContentLoaded', () => {
    // Active navigation link highlighting (debounced)
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    const sections = Array.from(document.querySelectorAll('section'));

    function onScroll() {
        let current = '';
        const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPos >= sectionTop - 200 && scrollPos < sectionTop + sectionHeight - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href').slice(1) === current);
        });
    }

    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(onScroll, 50);
    });
    onScroll();

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // close mobile menu if open
                document.querySelector('.nav-links')?.classList.remove('active');
            }
        });
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinksMenu = document.querySelector('.nav-links');

    if (hamburger && navLinksMenu) {
        hamburger.addEventListener('click', () => {
            navLinksMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', navLinksMenu.classList.contains('active'));
        });
    }

    // Close mobile menu when clicking on link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            document.querySelector('.nav-links')?.classList.remove('active');
            document.querySelector('.hamburger')?.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
            document.querySelector('.nav-links')?.classList.remove('active');
            document.querySelector('.hamburger')?.classList.remove('active');
        }
    });

    // Contact form submission to PHP mailer
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = (this.querySelector('input[name="name"]') || {}).value || '';
            const email = (this.querySelector('input[name="email"]') || {}).value || '';
            const message = (this.querySelector('textarea[name="message"]') || {}).value || '';

            if (!name.trim() || !email.trim() || !message.trim()) {
                alert('Please fill in all fields.');
                return;
            }

            // Simple email format check
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Create FormData
            const formData = new FormData(this);
            const btn = this.querySelector('.submit-btn');
            const originalText = btn.textContent;

            // Disable button during submission
            btn.disabled = true;
            btn.textContent = 'Sending...';

            // Send via fetch
            fetch('send-email.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert(data.message);
                        this.reset();
                    } else {
                        alert(data.message || 'Failed to send message.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred. Please try again.');
                })
                .finally(() => {
                    btn.disabled = false;
                    btn.textContent = originalText;
                });
        });
    }

    // Home section modal
    const homeModal = document.getElementById('homeModal');
    const profileWrapper = document.querySelector('.profile-wrapper');
    const modalClose = document.querySelector('.home-modal-close');
    const modalBackdrop = document.querySelector('.home-modal-backdrop');

    function openHomeModal() {
        homeModal?.classList.add('active');
        homeModal?.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeHomeModal() {
        homeModal?.classList.remove('active');
        homeModal?.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    profileWrapper?.addEventListener('click', openHomeModal);
    modalClose?.addEventListener('click', closeHomeModal);
    modalBackdrop?.addEventListener('click', closeHomeModal);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeHomeModal();
        }
    });

    // Intersection observer for subtle entrance animations
    const observerOptions = {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.competence-card, .work-card, .about-visual, .section-title').forEach(el => {
        el.classList.add('pre-animate');
        observer.observe(el);
    });

    /* --------------------------
       Multilingual UI (i18n)
       -------------------------- */
    const translations = {
        en: {
            'nav.home': 'Home',
            'nav.about': 'About',
            'nav.work': 'Work',
            'nav.skills': 'Skills',
            'nav.contact': 'Contact',
            'hero.subtitle': 'Creative Designer & Developer',
            'hero.description': 'Crafting digital experiences with passion and innovation',
            'cta.viewWork': 'View My Work',
            'cta.getInTouch': 'Get In Touch',
            'about.title': 'About Me',
            'about.p1': "I'm a passionate creative professional with a unique blend of design and development skills. My journey revolves around transforming ideas into stunning digital realities.",
            'about.p2': 'With a keen eye for aesthetics and a technical mindset, I create experiences that not only look beautiful but function flawlessly. Every project is an opportunity to push boundaries and explore new possibilities.',
            'stats.projects': 'Projects',
            'stats.clients': 'Clients',
            'stats.years': 'Experience',
            'work.title': 'My Work',
            'skills.title': 'My Skills',
            'contact.title': "Let's Connect",
            'contact.heading': 'Get In Touch',
            'contact.description': "I'm always interested in hearing about new projects and opportunities.",
            'contact.emailLabel': 'Email:',
            'contact.telLabel': 'Tel:',
            'contact.socialLabel': 'Social:',
            'form.namePlaceholder': 'Your Name',
            'form.emailPlaceholder': 'Your Email',
            'form.messagePlaceholder': 'Your Message',
            'form.submit': 'Send Message'
        },
        fr: {
            'nav.home': 'Accueil',
            'nav.about': 'À propos',
            'nav.work': 'Travaux',
            'nav.skills': 'Compétences',
            'nav.contact': 'Contact',
            'hero.subtitle': 'Designer créatif & développeur',
            'hero.description': 'Créer des expériences numériques avec passion et innovation',
            'cta.viewWork': 'Voir mon travail',
            'cta.getInTouch': 'Me contacter',
            'about.title': 'À propos',
            'about.p1': "Je suis un professionnel créatif passionné, alliant design et développement. Mon parcours consiste à transformer des idées en réalités numériques époustouflantes.",
            'about.p2': "Avec un sens aigu de l'esthétique et une approche technique, je crée des expériences à la fois belles et fonctionnelles. Chaque projet est une opportunité d'innover.",
            'stats.projects': 'Projets',
            'stats.clients': 'Clients',
            'Month.experience': '5mois+',
            'stats.years': "Expérience",
            'work.title': 'Mes travaux',
            'skills.title': 'Mes compétences',
            'contact.title': 'Entrons en contact',
            'contact.heading': 'Contactez-moi',
            'contact.description': "Je suis toujours intéressé par de nouveaux projets et opportunités.",
            'contact.emailLabel': 'Email:',
            'contact.telLabel': 'Tél:',
            'contact.socialLabel': 'Réseaux sociaux:',
            'form.namePlaceholder': 'Votre nom',
            'form.emailPlaceholder': 'Votre email',
            'form.messagePlaceholder': 'Votre message',
            'form.submit': 'Envoyer'
        },
        zh: {
            'nav.home': '主页',
            'nav.about': '关于',
            'nav.work': '作品',
            'nav.skills': '技能',
            'nav.contact': '联系',
            'hero.subtitle': '创意设计师与开发者',
            'hero.description': '以热情与创新打造数字体验',
            'cta.viewWork': '查看作品',
            'cta.getInTouch': '联系我',
            'about.title': '关于我',
            'about.p1': '我是一名充满热情的创意专业人士，兼具设计和开发技能，将想法转化为惊艳的数字成果。',
            'about.p2': '我以敏锐的审美和技术思维，创造既美观又高效的体验。每个项目都是突破边界的机会。',
            'stats.projects': '项目',
            'stats.clients': '客户',
            'Month.experience': '5+',
            'stats.years': '工作经验',
            'work.title': '我的作品',
            'skills.title': '我的技能',
            'contact.title': '联系我们',
            'contact.heading': '联系我',
            'contact.description': '我始终乐于了解新的项目与机会。',
            'contact.emailLabel': '邮箱:',
            'contact.telLabel': '电话:',
            'contact.socialLabel': '社交媒体:',
            'form.namePlaceholder': '你的名字',
            'form.emailPlaceholder': '你的邮箱',
            'form.messagePlaceholder': '你的留言',
            'form.submit': '发送'
        },
        it: {
            'nav.home': 'Home',
            'nav.about': 'Chi sono',
            'nav.work': 'Lavori',
            'nav.skills': 'Competenze',
            'nav.contact': 'Contatto',
            'hero.subtitle': 'Designer creativo & sviluppatore',
            'hero.description': 'Creare esperienze digitali con passione e innovazione',
            'cta.viewWork': 'Vedi i miei lavori',
            'cta.getInTouch': 'Contattami',
            'about.title': 'Chi sono',
            'about.p1': 'Sono un professionista creativo con una combinazione unica di competenze di design e sviluppo.',
            'about.p2': 'Creo esperienze che sono belle e funzionano perfettamente, sempre spingendo i limiti.',
            'stats.projects': 'Progetti',
            'stats.clients': 'Clienti',
            'Month.experience': '5+',
            'stats.years': 'Esperienza',
            'work.title': 'I miei lavori',
            'skills.title': 'Le mie competenze',
            'contact.title': 'Mettiamoci in contatto',
            'contact.heading': 'Contattami',
            'contact.description': 'Sono sempre interessato a nuovi progetti e opportunità.',
            'contact.emailLabel': 'Email:',
            'contact.telLabel': 'Tel:',
            'contact.socialLabel': 'Social:',
            'form.namePlaceholder': 'Il tuo nome',
            'form.emailPlaceholder': 'La tua email',
            'form.messagePlaceholder': 'Il tuo messaggio',
            'form.submit': 'Invia'
        },
        es: {
            'nav.home': 'Inicio',
            'nav.about': 'Sobre mí',
            'nav.work': 'Trabajos',
            'nav.skills': 'Habilidades',
            'nav.contact': 'Contacto',
            'hero.subtitle': 'Diseñador creativo y desarrollador',
            'hero.description': 'Creando experiencias digitales con pasión e innovación',
            'cta.viewWork': 'Ver mi trabajo',
            'cta.getInTouch': 'Contactar',
            'about.title': 'Sobre mí',
            'about.p1': 'Soy un profesional creativo y apasionado con una mezcla de diseño y desarrollo.',
            'about.p2': 'Creo experiencias que no solo son bonitas sino también funcionales. Cada proyecto es una oportunidad para innovar.',
            'stats.projects': 'Proyectos',
            'stats.clients': 'Clientes',
            'Month.experience': '5+',
            'stats.years': 'Experiencia',
            'work.title': 'Mi trabajo',
            'skills.title': 'Mis habilidades',
            'contact.title': 'Conectemos',
            'contact.heading': 'Ponte en contacto',
            'contact.description': 'Siempre me interesa conocer nuevos proyectos y oportunidades.',
            'contact.emailLabel': 'Email:',
            'contact.telLabel': 'Tel:',
            'contact.socialLabel': 'Social:',
            'form.namePlaceholder': 'Tu nombre',
            'form.emailPlaceholder': 'Tu email',
            'form.messagePlaceholder': 'Tu mensaje',
            'form.submit': 'Enviar'
        },
        de: {
            'nav.home': 'Start',
            'nav.about': 'Über mich',
            'nav.work': 'Arbeit',
            'nav.skills': 'Fähigkeiten',
            'nav.contact': 'Kontakt',
            'hero.subtitle': 'Kreativer Designer & Entwickler',
            'hero.description': 'Digitale Erlebnisse mit Leidenschaft und Innovation gestalten',
            'cta.viewWork': 'Meine Arbeiten',
            'cta.getInTouch': 'Kontaktiere mich',
            'about.title': 'Über mich',
            'about.p1': 'Ich bin ein leidenschaftlicher Kreativprofi mit Design- und Entwicklungsfähigkeiten.',
            'about.p2': 'Ich gestalte Erfahrungen, die schön aussehen und einwandfrei funktionieren.',
            'stats.projects': 'Projekte',
            'stats.clients': 'Kunden',
            'Month.experience': '5+',
            'stats.years': 'Erfahrung',
            'work.title': 'Meine Arbeiten',
            'skills.title': 'Meine Fähigkeiten',
            'contact.title': 'Lass uns verbinden',
            'contact.heading': 'Kontakt aufnehmen',
            'contact.description': 'Ich bin stets an neuen Projekten und Chancen interessiert.',
            'contact.emailLabel': 'E-Mail:',
            'contact.telLabel': 'Tel:',
            'contact.socialLabel': 'Soziales:',
            'form.namePlaceholder': 'Dein Name',
            'form.emailPlaceholder': 'Deine E-Mail',
            'form.messagePlaceholder': 'Deine Nachricht',
            'form.submit': 'Senden'
        },
        mg: {
            'nav.home': 'Trano',
            'nav.about': 'Mombamomba',
            'nav.work': 'Asa',
            'nav.skills': 'Fahaiza-manao',
            'nav.contact': 'Mifandraisa',
            'hero.subtitle': 'Mpamorona sy mpampivelatra',
            'hero.description': 'Mamolavola traikefa nomerika amin\'ny fitiavana sy ny zava-baovao',
            'cta.viewWork': 'Jereo ny asa',
            'cta.getInTouch': 'Mifandraisa amiko',
            'about.title': 'Momba Ahy',
            'about.p1': 'Mpiasa famoronana feno finiavana miaraka amin\'ny fampifangaroana ny famolavolana sy fampandrosoana.',
            'about.p2': 'Mamorona traikefa izay tsara tarehy ary miasa tsara.',
            'stats.projects': 'Tetikasa',
            'stats.clients': 'Mpiasa',
            'Month.experience': '5volana+',
            'stats.years': 'Traikefa',
            'work.title': 'Asako',
            'skills.title': 'Fahaiza-manaoko',
            'contact.title': 'Andeha hifandray',
            'contact.heading': 'Mifandraisa amiko',
            'contact.description': 'Liana hatrany amin\'ny tetikasa vaovao sy fahafahana aho.',
            'contact.emailLabel': 'Email:',
            'contact.telLabel': 'Tel:',
            'contact.socialLabel': 'Sosialy:',
            'form.namePlaceholder': 'Anaranao',
            'form.emailPlaceholder': 'Email-nao',
            'form.messagePlaceholder': 'Hafatrao',
            'form.submit': 'Alefaso'
        }
    };

    function translatePage(lang) {
        // text nodes
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const txt = translations[lang] && translations[lang][key];
            if (txt) el.innerText = txt;
        });

        // placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const txt = translations[lang] && translations[lang][key];
            if (txt) el.setAttribute('placeholder', txt);
        });

        // update html lang attribute
        document.documentElement.setAttribute('lang', lang);
    }

    const langSelect = document.getElementById('langSelect');

    function setLanguage(lang) {
        if (!translations[lang]) lang = 'en';
        translatePage(lang);
        if (langSelect) langSelect.value = lang;
        try { localStorage.setItem('siteLang', lang); } catch (e) { }
    }

    // initialize language from storage or browser
    const savedLang = (function () { try { return localStorage.getItem('siteLang'); } catch (e) { return null; } })();
    const browserLang = navigator.language ? navigator.language.split('-')[0] : 'en';
    const initialLang = savedLang || (translations[browserLang] ? browserLang : 'en');
    setLanguage(initialLang);

    if (langSelect) {
        langSelect.value = initialLang;
        langSelect.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
    }

});
