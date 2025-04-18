// Vlastní kurzor
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Hamburger menu
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('nav ul');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Zavření menu po kliknutí na odkaz
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

const interactiveElements = document.querySelectorAll('.gallery-item, .cta-button, nav a, .hamburger');
interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
    });
    element.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
    });
});

// Lightbox funkcionalita
document.addEventListener('DOMContentLoaded', () => {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close">&times;</button>
            <img src="" alt="">
            <div class="lightbox-nav">
                <button class="lightbox-prev">&lt;</button>
                <button class="lightbox-next">&gt;</button>
            </div>
        </div>
    `;
    document.body.appendChild(lightbox);

    let currentIndex = 0;
    const images = Array.from(galleryItems).map(item => item.querySelector('img').src);

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = index;
            openLightbox();
        });
    });

    function openLightbox() {
        lightbox.style.display = 'block';
        updateLightboxImage();
    }

    function closeLightbox() {
        lightbox.style.display = 'none';
    }

    function updateLightboxImage() {
        const lightboxImg = lightbox.querySelector('img');
        lightboxImg.src = images[currentIndex];
    }

    function showPrevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateLightboxImage();
    }

    function showNextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        updateLightboxImage();
    }

    // Event listeners pro lightbox
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', showPrevImage);
    lightbox.querySelector('.lightbox-next').addEventListener('click', showNextImage);

    // Přidání navigace kliknutím na obrázek
    const lightboxImg = lightbox.querySelector('img');
    lightboxImg.addEventListener('click', (e) => {
        const clickX = e.clientX;
        const imgRect = lightboxImg.getBoundingClientRect();
        const imgCenterX = imgRect.left + imgRect.width / 2;

        if (clickX > imgCenterX) {
            showNextImage();
        } else {
            showPrevImage();
        }
        e.stopPropagation(); // Zastaví propagaci události, aby se lightbox nezavřel
    });

    // Zavření lightboxu při kliknutí mimo obrázek
    lightbox.querySelector('.lightbox-content').addEventListener('click', (e) => {
        // Pokud se nekliklo na obrázek, navigační tlačítka nebo křížek pro zavření
        if (!e.target.matches('img') && !e.target.matches('.lightbox-prev') && !e.target.matches('.lightbox-next') && !e.target.matches('.lightbox-close')) {
            closeLightbox();
        }
    });

    // Klávesové zkratky
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'block') {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            }
        }
    });
});

// Zpracování formuláře
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const form = this;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Odesílám...';
    submitButton.disabled = true;

    fetch(form.action, {
        method: 'POST',
        body: new FormData(form)
    })
    .then(response => response.json())
    .then(data => {
        // Vytvoření elementu pro zprávu
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${data.status}`;
        messageElement.textContent = data.message;

        // Vložení zprávy nad formulář
        form.parentNode.insertBefore(messageElement, form);

        // Pokud bylo odesílání úspěšné, vyčistíme formulář
        if (data.status === 'success') {
            form.reset();
        }

        // Odstranění zprávy po 5 sekundách
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    })
    .catch(error => {
        const messageElement = document.createElement('div');
        messageElement.className = 'form-message error';
        messageElement.textContent = 'Došlo k chybě při odesílání. Zkuste to prosím později.';
        form.parentNode.insertBefore(messageElement, form);

        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    })
    .finally(() => {
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    });
}); 