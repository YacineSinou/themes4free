// Données des thèmes avec des images qui fonctionnent
const themes = [
    {
        id: 1,
        title: "Forêt Enchantée",
        description: "forêts mystérieuses et magiques.",
        category: "nature",
        imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        filename: "photo-1.jpg",
        imageDownloadUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        title: "Futur Numérique",
        description: "high-tech et éléments futuristes.",
        category: "technologie",
        imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        filename: "photo-2.jpg",
        imageDownloadUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        title: "Ondes Colorées",
        description: "formes et couleurs vibrantes.",
        category: "abstrait",
        imageUrl: "https://images.unsplash.com/photo-1533282960533-51328aa49826?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        filename: "photo-3.jpg",
        imageDownloadUrl: "https://images.unsplash.com/photo-1533282960533-51328aa49826?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        title: "Nuit Urbaine",
        description: "Captez l'essence des villes la nuit.",
        category: "ville",
        imageUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        filename: "photo-4.jpg",
        imageDownloadUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        title: "Plage Paradisiaque",
        description: "Thème relaxant inspiré par les plus belles plages du monde.",
        category: "nature",
        imageUrl: "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        filename: "photo-5.jpg",
        imageDownloadUrl: "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        title: "Code Source",
        description: "Pour les développeurs, un thème inspiré par le code.",
        category: "technologie",
        imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        filename: "photo-6.jpg",
        imageDownloadUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 8,
        title: "Cosmos Infini",
        description: "Un thème abstrait inspiré par l'espace et les étoiles.",
        category: "abstrait",
        imageUrl: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        filename: "photo-8.jpg",
        imageDownloadUrl: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    }
];
// Fonction pour générer l'URL de téléchargement GitHub
function getGitHubDownloadUrl(filename) {
    return `https://raw.githubusercontent.com/YacineSinou/themes4free/main/images/${filename}`;
}

// Éléments DOM
const themesContainer = document.querySelector('.themes-container');
const filterButtons = document.querySelectorAll('.filter-btn');
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("expandedImg");
const closeBtn = document.getElementsByClassName("close")[0];
const downloadExpandedBtn = document.getElementById("downloadExpandedImage");

// Variables pour suivre l'image actuellement agrandie
let currentExpandedImageUrl = "";

// Afficher tous les thèmes au chargement
document.addEventListener('DOMContentLoaded', () => {
    displayThemes(themes);
    setupModal();
});

// Fonction pour afficher les thèmes
function displayThemes(themesToDisplay) {
    themesContainer.innerHTML = '';
    
    themesToDisplay.forEach(theme => {
        const themeElement = document.createElement('div');
        themeElement.classList.add('theme-card');
        themeElement.setAttribute('data-category', theme.category);
        
        themeElement.innerHTML = `
            <div class="theme-img-container">
                <img src="${theme.imageUrl}" alt="${theme.title}" class="theme-img">
                <button class="download-image-btn" data-url="${theme.imageDownloadUrl}">Télécharger l'image</button>
            </div>
            <div class="theme-info">
                <h3>${theme.title}</h3>
                <p>${theme.description}</p>
                <button class="download-btn" data-id="${theme.id}">Télécharger le thème complet</button>
            </div>
        `;
        
        themesContainer.appendChild(themeElement);
    });
    
    // Ajouter les événements aux boutons de téléchargement
    addDownloadEvents();
    addImageDownloadEvents();
}

// Filtrer les thèmes par catégorie
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Mettre à jour le bouton actif
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const category = button.dataset.category;
        
        if (category === 'all') {
            displayThemes(themes);
        } else {
            const filteredThemes = themes.filter(theme => theme.category === category);
            displayThemes(filteredThemes);
        }
    });
});

// Gérer les téléchargements de thèmes complets
function addDownloadEvents() {
    const downloadButtons = document.querySelectorAll('.download-btn');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            const themeId = e.target.dataset.id;
            const theme = themes.find(t => t.id == themeId);
            
            // Utiliser GitHub pour le téléchargement
            const downloadUrl = getGitHubDownloadUrl(theme.filename);
            
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `theme-${theme.title.toLowerCase().replace(/ /g, '-')}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    });
}

// Gérer les téléchargements d'images
function addImageDownloadEvents() {
    const downloadImageButtons = document.querySelectorAll('.download-image-btn');
    
    downloadImageButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const themeCard = button.closest('.theme-card');
            const themeId = themeCard.querySelector('.download-btn').dataset.id;
            const theme = themes.find(t => t.id == themeId);
            
            // Utiliser GitHub pour le téléchargement
            const downloadUrl = getGitHubDownloadUrl(theme.filename);
            
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `image-${theme.title.toLowerCase().replace(/ /g, '-')}.jpg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    });
}

// Configurer le modal pour l'image agrandie
downloadExpandedBtn.addEventListener('click', function() {
    const themeCards = document.querySelectorAll('.theme-card');
    let themeId;
    
    // Trouver la carte de thème active
    themeCards.forEach(card => {
        if (card.querySelector('.theme-img').src === currentExpandedImageUrl) {
            themeId = card.querySelector('.download-btn').dataset.id;
        }
    });
    
    if (themeId) {
        const theme = themes.find(t => t.id == themeId);
        const downloadUrl = getGitHubDownloadUrl(theme.filename);
        
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `image-${theme.title.toLowerCase().replace(/ /g, '-')}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
});
