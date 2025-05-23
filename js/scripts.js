// Configuración
const CONFIG = {
    transitionDuration: 800,
    scrollOffset: 300,
    resultPlaceholder: "Sin resultado"
};

// Inicialización de la aplicación
class F1App {
    constructor() {
        this.initTheme(); // <-- Añade esto PRIMERO
        this.initPreloader();
        this.initNavigation();
        this.initBackToTop();
        this.initVisibilityObserver();
        this.loadStandingsData();
    }

    // Añade estos métodos para el tema
    initTheme() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeIcon = this.themeToggle.querySelector('i');

        // Cargar tema guardado o usar preferencia del sistema
        const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        this.setTheme(savedTheme);

        // Escuchar cambios en el botón
        this.themeToggle.addEventListener('click', () => {
            const newTheme = document.documentElement.classList.contains('light-mode') ? 'dark' : 'light';
            this.setTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    setTheme(theme) {
        if (theme === 'light') {
            document.documentElement.classList.add('light-mode');
            this.themeIcon.classList.replace('fa-moon', 'fa-sun');
            this.themeToggle.setAttribute('aria-label', 'Cambiar a modo oscuro');
        } else {
            document.documentElement.classList.remove('light-mode');
            this.themeIcon.classList.replace('fa-sun', 'fa-moon');
            this.themeToggle.setAttribute('aria-label', 'Cambiar a modo claro');
        }
    }

    initPreloader() {
        const preloader = document.getElementById('preloader');
        if (!preloader) return;

        // Detección de móvil
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (isMobile) {
            // Para móviles, ocultar más rápido
            setTimeout(() => {
                preloader.classList.add('hidden');
                setTimeout(() => preloader.remove(), 300);
            }, 1500);
        } else {
            // Para desktop mantener la animación normal
            window.addEventListener('load', () => {
                preloader.classList.add('hidden');
                setTimeout(() => preloader.remove(), CONFIG.transitionDuration);
            });
        }
    }

    // Navegación
    initNavigation() {
        // Click en el logo/título
        document.querySelector('header h1').addEventListener('click', (e) => {
            e.preventDefault();
            this.scrollToTop();
        });

        // Scroll suave para enlaces
        document.querySelectorAll('nav ul li a').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        });
    }

    // Scroll to top
    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Scroll to section
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Botón "volver arriba"
    initBackToTop() {
        const backToTopButton = document.getElementById('back-to-top');

        window.addEventListener('scroll', () => {
            backToTopButton.classList.toggle(
                'visible',
                window.pageYOffset > CONFIG.scrollOffset
            );
        });

        backToTopButton.addEventListener('click', () => {
            this.scrollToTop();
        });
    }

    // Observador de visibilidad para animaciones
    initVisibilityObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1 // Baja el threshold para móviles
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting || entry.intersectionRatio > 0) {
                    entry.target.classList.add('visible');

                    const items = entry.target.querySelectorAll('.race, .result');
                    items.forEach((item, index) => {
                        item.style.transitionDelay = `${index * 0.1}s`;
                    });

                    // Deja de observar después de mostrar
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.section').forEach(section => {
            observer.observe(section);
        });
    }

    // Cargar datos de clasificación
    async loadStandingsData() {
        try {
            const response = await fetch('data/data.json');
            if (!response.ok) throw new Error('Error al cargar los datos');

            const data = await response.json();
            this.renderStandings(data);
            this.generateEmptyResults(); // <-- Esta línea debe estar aquí
        } catch (error) {
            console.error('Error:', error);
            this.showErrorNotification();
        }
    }

    // Renderizar tablas de clasificación
    renderStandings(data) {
        // Pilotos
        const driverTbody = document.querySelector('#driver-standings tbody');
        driverTbody.innerHTML = data.driverStandings.map(standing => `
            <tr>
                <td>${standing.position}</td>
                <td>${standing.driver}</td>
                <td>${standing.constructor}</td>
                <td>${standing.points}</td>
            </tr>
        `).join('');

        // Constructores
        const constructorTbody = document.querySelector('#constructor-standings tbody');
        constructorTbody.innerHTML = data.constructorStandings.map(standing => `
            <tr>
                <td>${standing.position}</td>
                <td>${standing.constructor}</td>
                <td>${standing.points}</td>
            </tr>
        `).join('');
    }

    generateEmptyResults() {
        const resultsContainer = document.querySelector('.results-grid');
        if (!resultsContainer) return;

        // Lista completa de carreras (sin incluir Australia y China que ya tienen resultados)
        const allRaces = [
            'Gran Premio de Japón',
            'Gran Premio de Baréin',
            'Gran Premio de Arabia Saudita',
            'Gran Premio de Miami',
            'Gran Premio de Emilia-Romaña',
            'Gran Premio de Mónaco',
            'Gran Premio de España',
            'Gran Premio de Canadá',
            'Gran Premio de Austria',
            'Gran Premio de Gran Bretaña',
            'Gran Premio de Bélgica',
            'Gran Premio de Hungría',
            'Gran Premio de Los Países Bajos',
            'Gran Premio de Italia',
            'Gran Premio de Azerbaiyán',
            'Gran Premio de Singapur',
            'Gran Premio de Estados Unidos',
            'Gran Premio de México',
            'Gran Premio de Brasil',
            'Gran Premio de Las Vegas',
            'Gran Premio de Catar',
            'Gran Premio de Abu Dabi'
        ];

        // Después de generar los elementos, forzar su visualización en móviles
        if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            const resultsSection = document.getElementById('resultados');
            if (resultsSection) {
                resultsSection.classList.add('visible');
                resultsContainer.querySelectorAll('.result').forEach((item, index) => {
                    item.style.opacity = 1;
                    item.style.transform = 'none';
                    item.style.transitionDelay = `${index * 0.1}s`;
                });
            }
        }
    }

    // Mostrar notificación de error
    showErrorNotification() {
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.textContent = 'Error al cargar los datos. Por favor, inténtalo de nuevo más tarde.';
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Registrar Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/js/sw.js')
            .then(registration => {
                console.log('ServiceWorker registrado con éxito:', registration.scope);
            })
            .catch(error => {
                console.log('Error al registrar ServiceWorker:', error);
            });
    });
}

// API Jolpica para mantener los datos actualizados
async function cargarPilotos() {
    const res = await fetch("https://api.jolpi.ca/ergast/f1/current/driverStandings.json");
    const data = await res.json();

    const pilotos = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;

    const tbody = document.querySelector("#driver-standings tbody");
    tbody.innerHTML = "";

    pilotos.forEach(p => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${p.position}</td>
            <td>${p.Driver.givenName} ${p.Driver.familyName}</td>
            <td>${p.Driver.nationality}</td>
            <td>${p.Constructors[0].name}</td>
            <td>${p.points}</td>
            `;
        tbody.appendChild(fila);
    });
}

async function cargarConstructores() {
    const res = await fetch("https://api.jolpi.ca/ergast/f1/current/constructorStandings.json");
    const data = await res.json();

    const constructores = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;

    const tbody = document.querySelector("#constructor-standings tbody");
    tbody.innerHTML = "";

    constructores.forEach(c => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${c.position}</td>
            <td>${c.Constructor.name}</td>
            <td>${c.Constructor.nationality}</td>
            <td>${c.points}</td>
            `;
        tbody.appendChild(fila);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    cargarPilotos();
    cargarConstructores();
    new F1App();
});