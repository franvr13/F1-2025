// Ocultar el preloader cuando la página esté completamente cargada
window.addEventListener('load', function () {
    const preloader = document.getElementById('preloader');
    preloader.classList.add('hidden'); // Añade la clase 'hidden' para ocultar el preloader

    // Elimina el preloader después de la transición de opacidad
    setTimeout(() => {
        preloader.remove();
    }, 800); // Duración de la transición de opacidad
});

// Manejar el clic en el título para volver al inicio
document.querySelector('header h1').addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Selecciona todos los enlaces del menú de navegación
document.querySelectorAll('nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Evita el comportamiento predeterminado del enlace

        // Obtén el ID de la sección a la que se debe desplazar
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        // Desplázate suavemente a la sección
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Función para detectar cuándo una sección está en la vista
function checkVisibility() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionBottom = section.getBoundingClientRect().bottom;

        // Si la sección está en la vista, añade la clase 'visible'
        if (sectionTop < window.innerHeight && sectionBottom > 0) {
            section.classList.add('visible');
        }
    });
}

// Ejecutar la función al cargar la página y al hacer scroll
window.addEventListener('load', checkVisibility);
window.addEventListener('scroll', checkVisibility);

// Botón volver arriba
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) { // Mostrar después de bajar 300px
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

async function getDriverStandings() {
    try {
        const response = await fetch('https://f1-2025.vercel.app/driverStandings');
        const data = await response.json();
        const tbody = document.querySelector('#driver-standings tbody');
        tbody.innerHTML = data.map(standing => `
            <tr>
                <td>${standing.position}</td>
                <td>${standing.driver}</td>
                <td>${standing.constructor}</td>
                <td>${standing.points}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error al obtener la clasificación de pilotos:', error);
    }
}

async function getConstructorStandings() {
    try {
        const response = await fetch('https://f1-2025.vercel.app/constructorStandings');
        const data = await response.json();
        const tbody = document.querySelector('#constructor-standings tbody');
        tbody.innerHTML = data.map(standing => `
            <tr>
                <td>${standing.position}</td>
                <td>${standing.constructor}</td>
                <td>${standing.points}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error al obtener la clasificación de constructores:', error);
    }
}

window.addEventListener('load', function () {
    getDriverStandings();
    getConstructorStandings();
});