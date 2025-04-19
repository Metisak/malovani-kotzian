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

// Lightbox funkcionalita a galerie s postupným načítáním
document.addEventListener('DOMContentLoaded', async () => {
    const galleryGrid = document.getElementById('gallery-grid');
    const loadMoreBtn = document.getElementById('load-more');
    const imagesPerPage = 8;
    let currentPage = 0;
    let lightbox;
    let currentIndex = 0;
    let allImages = [];

    // Načtení všech obrázků hned na začátku
    const imageFiles = [
        "ref_0App Image 2025-04-19 at 09.34.14_724a2d8f.jpg",
        "ref_1App Image 2025-04-19 at 09.34.14_ef2379d1.jpg",
        "ref_2App Image 2025-04-19 at 09.34.15_e36c1a03.jpg",
        "ref_3App Image 2025-04-19 at 09.34.16_a32d1d45.jpg",
        "ref_4App Image 2025-04-19 at 09.34.18_3d56c536.jpg",
        "ref_5App Image 2025-04-19 at 09.34.19_7e5b3224.jpg",
        "ref_6App Image 2025-04-19 at 09.34.20_8971a260.jpg",
        "ref_7App Image 2025-04-19 at 09.34.20_ff2637f9.jpg",
        "ref_8App Image 2025-04-19 at 09.34.21_02998157.jpg",
        "ref_9App Image 2025-04-19 at 09.34.21_c626014a.jpg",
        "ref_10App Image 2025-04-19 at 09.34.22_117ca019.jpg",
        "ref_11App Image 2025-04-19 at 09.34.23_5efc01d7.jpg",
        "ref_12App Image 2025-04-19 at 09.34.23_82cc4653.jpg",
        "ref_13App Image 2025-04-19 at 09.34.23_85d05882.jpg",
        "ref_14App Image 2025-04-19 at 09.34.23_c8b5969c.jpg",
        "ref_15App Image 2025-04-19 at 09.34.23_ffb91e45.jpg",
        "ref_16App Image 2025-04-19 at 09.34.24_01dc3c37.jpg",
        "ref_17App Image 2025-04-19 at 09.34.24_6eccbe94.jpg",
        "ref_18App Image 2025-04-19 at 09.34.24_aa33122e.jpg",
        "ref_19App Image 2025-04-19 at 09.34.24_bfe8893c.jpg",
        "ref_20App Image 2025-04-19 at 09.34.24_c5178156.jpg",
        "ref_21App Image 2025-04-19 at 09.34.24_d5a88913.jpg",
        "ref_22App Image 2025-04-19 at 09.34.24_ed5fb038.jpg",
        "ref_23App Image 2025-04-19 at 09.34.25_8e051174.jpg",
        "ref_24App Image 2025-04-19 at 09.34.25_12ff434e.jpg",
        "ref_25App Image 2025-04-19 at 09.34.25_4099e724.jpg",
        "ref_26App Image 2025-04-19 at 09.34.25_69915e45.jpg",
        "ref_27App Image 2025-04-19 at 09.34.25_d187513e.jpg",
        "ref_28App Image 2025-04-19 at 09.34.25_e1371f09.jpg",
        "ref_29App Image 2025-04-19 at 09.34.25_e719684a.jpg",
        "ref_30App Image 2025-04-19 at 09.34.26_02eca72f.jpg",
        "ref_31App Image 2025-04-19 at 09.34.26_9c2a22d9.jpg",
        "ref_32App Image 2025-04-19 at 09.34.26_74d2ac52.jpg",
        "ref_33App Image 2025-04-19 at 09.34.26_79abd4cd.jpg",
        "ref_34App Image 2025-04-19 at 09.34.26_b6924886.jpg",
        "ref_35App Image 2025-04-19 at 09.34.26_cd721cd4.jpg",
        "ref_36App Image 2025-04-19 at 09.34.26_ce1490ba.jpg",
        "ref_37App Image 2025-04-19 at 09.34.27_5bb731ff.jpg",
        "ref_38App Image 2025-04-19 at 09.34.27_28f5a1a4.jpg",
        "ref_39App Image 2025-04-19 at 09.34.27_46efd494.jpg",
        "ref_40App Image 2025-04-19 at 09.34.27_de256cb8.jpg",
        "ref_41App Image 2025-04-19 at 09.34.27_e0c3f7ef.jpg",
        "ref_42App Image 2025-04-19 at 09.34.27_f4b1bb01.jpg",
        "ref_43App Image 2025-04-19 at 09.34.28_0f2c519d.jpg",
        "ref_44App Image 2025-04-19 at 09.34.28_99110818.jpg",
        "ref_45App Image 2025-04-19 at 09.34.28_aad195bb.jpg",
        "ref_46App Image 2025-04-19 at 09.34.28_d56fcbe0.jpg"
    ];

    // Vytvoření pole všech URL obrázků
    allImages = imageFiles.map(file => `Galery/${file}`);

    // Vytvoření lightboxu
    function createLightbox() {
        lightbox = document.createElement('div');
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
            e.stopPropagation();
        });

        // Zavření lightboxu při kliknutí mimo obrázek
        lightbox.querySelector('.lightbox-content').addEventListener('click', (e) => {
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
    }

    function openLightbox(index) {
        currentIndex = index;
        lightbox.style.display = 'block';
        updateLightboxImage();
    }

    function closeLightbox() {
        lightbox.style.display = 'none';
    }

    function updateLightboxImage() {
        const lightboxImg = lightbox.querySelector('img');
        lightboxImg.src = allImages[currentIndex];
    }

    function showPrevImage() {
        currentIndex = (currentIndex - 1 + allImages.length) % allImages.length;
        updateLightboxImage();
    }

    function showNextImage() {
        currentIndex = (currentIndex + 1) % allImages.length;
        updateLightboxImage();
    }

    // Funkce pro vytvoření HTML elementu obrázku
    function createImageElement(imagePath, index) {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = `Galery/${imagePath}`;
        img.alt = `Reference`;
        img.loading = 'lazy';

        // Přidání event listeneru pro lightbox
        div.addEventListener('click', () => {
            openLightbox(index);
        });

        div.appendChild(img);
        return div;
    }

    // Funkce pro načtení další stránky obrázků
    async function loadMoreImages() {
        const start = currentPage * imagesPerPage;
        const end = start + imagesPerPage;
        const pageImages = imageFiles.slice(start, end);

        pageImages.forEach((imagePath, i) => {
            const globalIndex = start + i;
            const imageElement = createImageElement(imagePath, globalIndex);
            galleryGrid.appendChild(imageElement);
        });

        if (end >= imageFiles.length) {
            loadMoreBtn.style.display = 'none';
        }

        currentPage++;
    }

    // Vytvoření lightboxu
    createLightbox();

    // Event listener pro tlačítko "Načíst další"
    loadMoreBtn.addEventListener('click', loadMoreImages);

    // Načtení první stránky
    loadMoreImages();
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