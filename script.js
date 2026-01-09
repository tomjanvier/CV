// Sidebar Navigation - Active Section Highlighting
const sidebarLinks = document.querySelectorAll('.sidebar-link');
const sections = document.querySelectorAll('section[id]');
const pageLanguage = document.documentElement.lang === 'en' ? 'en' : 'fr';
const localizedText = {
    fr: {
        resourcesTitle: '📚 Ressources et publications',
        projectSkills: 'Compétences :',
        projectResources: '📚 Ressources associées',
        contactEmailSubject: 'Message depuis tomjanvier.com - ',
        contactEmailName: 'Nom',
        contactEmailMessage: 'Message'
    },
    en: {
        resourcesTitle: '📚 Resources and publications',
        projectSkills: 'Skills:',
        projectResources: '📚 Related resources',
        contactEmailSubject: 'Message from tomjanvier.com - ',
        contactEmailName: 'Name',
        contactEmailMessage: 'Message'
    }
};

function getLocalizedText(key) {
    return localizedText[pageLanguage]?.[key] || localizedText.fr[key];
}

// Scroll vers le haut
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Highlight active section in sidebar
function highlightActiveSection() {
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });
    
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === currentSection) {
            link.classList.add('active');
            const sidebarMenu = document.querySelector('.sidebar-menu');
            if (sidebarMenu) {
                const linkRect = link.getBoundingClientRect();
                const menuRect = sidebarMenu.getBoundingClientRect();
                if (linkRect.top < menuRect.top || linkRect.bottom > menuRect.bottom) {
                    link.scrollIntoView({ block: 'nearest' });
                }
            }
        }
    });
}

// Listen to scroll events
window.addEventListener('scroll', highlightActiveSection);

// Smooth scroll for sidebar links
sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Gestion du thème clair/sombre
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Charger le thème sauvegardé ou utiliser la préférence système
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
} else if (prefersDark) {
    htmlElement.setAttribute('data-theme', 'dark');
}

// Toggle du thème
themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Animation au scroll pour les éléments
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observer tous les cards et timeline items
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.card, .timeline-item, .skill-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Appliquer la configuration depuis CONFIG
    if (typeof CONFIG !== 'undefined') {
        // Mettre à jour les liens
        const linkedinBtn = document.getElementById('linkedinBtn');
        const cvPdfBtn = document.getElementById('cvPdfBtn');
        const contactLinkedinBtn = document.getElementById('contactLinkedinBtn');
        const contactCvPdfBtn = document.getElementById('contactCvPdfBtn');

        if (linkedinBtn) linkedinBtn.href = CONFIG.linkedinUrl;
        if (cvPdfBtn) cvPdfBtn.href = CONFIG.cvPdfUrl;
        if (contactLinkedinBtn) contactLinkedinBtn.href = CONFIG.linkedinUrl;
        if (contactCvPdfBtn) contactCvPdfBtn.href = CONFIG.cvPdfUrl;

        // Mettre à jour les textes
        const heroInitials = document.getElementById('heroInitials');
        const heroName = document.getElementById('heroName');
        const heroTitle = document.getElementById('heroTitle');
        const heroLocation = document.getElementById('heroLocation');

        if (heroInitials) heroInitials.textContent = CONFIG.initials;
        if (heroName) heroName.textContent = CONFIG.fullName;
        if (heroTitle) heroTitle.textContent = CONFIG.jobTitle;
        if (heroLocation) heroLocation.textContent = '📍 ' + CONFIG.location;
    }
});

// Smooth scroll pour les liens d'ancrage
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Gestion du modal de contact
const contactModal = document.getElementById('contactModal');
const openContactFormBtns = document.querySelectorAll('.js-contact-form-trigger');
const closeContactModalBtn = document.getElementById('closeContactModal');
const cancelContactFormBtn = document.getElementById('cancelContactForm');
const contactForm = document.getElementById('contactForm');

// Ouvrir le modal
openContactFormBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        contactModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// Fermer le modal
function closeModal() {
    contactModal.classList.remove('active');
    document.body.style.overflow = '';
    contactForm.reset();
}

closeContactModalBtn.addEventListener('click', closeModal);
cancelContactFormBtn.addEventListener('click', closeModal);

// Fermer en cliquant en dehors du modal
contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal) {
        closeModal();
    }
});

// Fermer avec la touche Échap
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && contactModal.classList.contains('active')) {
        closeModal();
    }
});

// Soumission du formulaire
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;
    
    // Créer le lien mailto
    const mailtoLink = `mailto:contact@tomjanvier.com?subject=${encodeURIComponent(getLocalizedText('contactEmailSubject') + subject)}&body=${encodeURIComponent(`${getLocalizedText('contactEmailName')}: ${name}\nEmail: ${email}\n\n${getLocalizedText('contactEmailMessage')}:\n${message}`)}`;
    
    // Ouvrir le client email
    window.location.href = mailtoLink;
    
    // Fermer le modal après un court délai
    setTimeout(() => {
        closeModal();
    }, 500);
});

// Fonction pour obtenir l'icône selon le type de ressource
function getResourceIcon(type) {
    const icons = {
        'article': '📄',
        'document': '📋',
        'video': '🎥',
        'link': '🔗'
    };
    return icons[type] || '📎';
}

// Fonction pour rendre les ressources
function renderResources() {
    // Focus 2030
    const focus2030Container = document.getElementById('resources-focus2030');
    if (focus2030Container && RESOURCES.focus2030 && RESOURCES.focus2030.length > 0) {
        const html = `
            <h4 class="resources-title">${getLocalizedText('resourcesTitle')}</h4>
            <ul class="resources-list">
                ${RESOURCES.focus2030.map(resource => `
                    <li class="resource-item">
                        <a href="${resource.url}" target="_blank" rel="noopener noreferrer" class="resource-link">
                            <span class="resource-icon">${getResourceIcon(resource.type)}</span>
                            <span class="resource-title">${resource.title}</span>
                            <span class="resource-external">↗</span>
                        </a>
                    </li>
                `).join('')}
            </ul>
        `;
        focus2030Container.innerHTML = html;
    }

    // Coordination SUD
    const coordinationSudContainer = document.getElementById('resources-coordinationsud');
    if (coordinationSudContainer && RESOURCES.coordinationSud && RESOURCES.coordinationSud.length > 0) {
        const html = `
            <h4 class="resources-title">${getLocalizedText('resourcesTitle')}</h4>
            <ul class="resources-list">
                ${RESOURCES.coordinationSud.map(resource => `
                    <li class="resource-item">
                        <a href="${resource.url}" target="_blank" rel="noopener noreferrer" class="resource-link">
                            <span class="resource-icon">${getResourceIcon(resource.type)}</span>
                            <span class="resource-title">${resource.title}</span>
                            <span class="resource-external">↗</span>
                        </a>
                    </li>
                `).join('')}
            </ul>
        `;
        coordinationSudContainer.innerHTML = html;
    }

    // Mouvement Européen
    const mouvementEuropeenContainer = document.getElementById('resources-mouvementeuropeen');
    if (mouvementEuropeenContainer && RESOURCES.mouvementEuropeen && RESOURCES.mouvementEuropeen.length > 0) {
        const html = `
            <h4 class="resources-title">${getLocalizedText('resourcesTitle')}</h4>
            <ul class="resources-list">
                ${RESOURCES.mouvementEuropeen.map(resource => `
                    <li class="resource-item">
                        <a href="${resource.url}" target="_blank" rel="noopener noreferrer" class="resource-link">
                            <span class="resource-icon">${getResourceIcon(resource.type)}</span>
                            <span class="resource-title">${resource.title}</span>
                            <span class="resource-external">↗</span>
                        </a>
                    </li>
                `).join('')}
            </ul>
        `;
        mouvementEuropeenContainer.innerHTML = html;
    }

    // Amnesty International
    const amnestyContainer = document.getElementById('resources-amnesty');
    if (amnestyContainer && RESOURCES.amnestyInternational && RESOURCES.amnestyInternational.length > 0) {
        const html = `
            <h4 class="resources-title">${getLocalizedText('resourcesTitle')}</h4>
            <ul class="resources-list">
                ${RESOURCES.amnestyInternational.map(resource => `
                    <li class="resource-item">
                        <a href="${resource.url}" target="_blank" rel="noopener noreferrer" class="resource-link">
                            <span class="resource-icon">${getResourceIcon(resource.type)}</span>
                            <span class="resource-title">${resource.title}</span>
                            <span class="resource-external">↗</span>
                        </a>
                    </li>
                `).join('')}
            </ul>
        `;
        amnestyContainer.innerHTML = html;
    }
}

// Appeler la fonction au chargement de la page
document.addEventListener('DOMContentLoaded', renderResources);

// Fonction pour rendre les projets
function renderProjects() {
    const projectsContainer = document.getElementById('projects-container');
    if (!projectsContainer || !PROJECTS || PROJECTS.length === 0) return;
    
    const html = PROJECTS.map(project => `
        <div class="project-card card">
            <div class="project-header">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-organization">${project.organization}</p>
            </div>
            <div class="project-body">
                <p class="project-description">${project.description.replace(/\n/g, '<br>')}</p>
                ${project.skills && project.skills.length > 0 ? `
                    <div class="project-skills">
                        <h4>${getLocalizedText('projectSkills')}</h4>
                        <div class="skills-tags">
                            ${project.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
                ${project.resources && project.resources.length > 0 ? `
                    <div class="project-resources">
                        <h4 class="resources-title">${getLocalizedText('projectResources')}</h4>
                        <ul class="resources-list">
                            ${project.resources.map(resource => `
                                <li class="resource-item">
                                    <a href="${resource.url}" target="_blank" rel="noopener noreferrer" class="resource-link">
                                        <span class="resource-icon">${getResourceIcon(resource.type)}</span>
                                        <span class="resource-title">${resource.title}</span>
                                        <span class="resource-external">↗</span>
                                    </a>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
    
    projectsContainer.innerHTML = html;
}

// Appeler la fonction de rendu des projets au chargement
document.addEventListener('DOMContentLoaded', renderProjects);

// Gestion de la bannière de cookies et Google Analytics
const cookieBanner = document.getElementById('cookieBanner');
const acceptCookiesBtn = document.getElementById('acceptCookies');
const rejectCookiesBtn = document.getElementById('rejectCookies');
const COOKIE_KEY = 'cookieConsent';

function loadGoogleAnalytics() {
    if (document.getElementById('gaScript')) return;
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-4VLTXE92HT';
    script.id = 'gaScript';
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
        window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', 'G-4VLTXE92HT');
}

function setCookieConsent(value) {
    localStorage.setItem(COOKIE_KEY, value);
    if (cookieBanner) {
        cookieBanner.classList.remove('active');
    }
}

if (cookieBanner) {
    const savedConsent = localStorage.getItem(COOKIE_KEY);
    if (savedConsent === 'accepted') {
        loadGoogleAnalytics();
    } else if (!savedConsent) {
        cookieBanner.classList.add('active');
    }

    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => {
            setCookieConsent('accepted');
            loadGoogleAnalytics();
        });
    }

    if (rejectCookiesBtn) {
        rejectCookiesBtn.addEventListener('click', () => {
            setCookieConsent('rejected');
        });
    }
}
