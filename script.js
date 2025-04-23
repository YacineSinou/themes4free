// Configuration GitHub
const githubRepo = "votreUtilisateur/votreDepot";
const branch = "main";
const imagesFolder = "images";

// Données des thèmes avec URLs GitHub
const themes = [
    {
        id: 1,
        title: "Forêt Enchantée",
        description: "forêts mystérieuses et magiques.",
        category: "nature",
        filename: "photo-1.jpg"
    },
    {
        id: 2,
        title: "Futur Numérique",
        description: "high-tech et éléments futuristes.",
        category: "technologie",
        filename: "photo-2.jpg"
    },
    {
        id: 3,
        title: "Ondes Colorées",
        description: "formes et couleurs vibrantes.",
        category: "abstrait",
        filename: "photo-3.jpg"
    },
    {
        id: 4,
        title: "Nuit Urbaine",
        description: "Captez l'essence des villes la nuit.",
        category: "ville",
        filename: "photo-4.jpg"
    }
];

// Éléments DOM
const themesContainer = document.querySelector('.themes-container');
const filterButtons = document.querySelectorAll('.filter-btn');
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("expandedImg");
const closeBtn = document.getElementsByClassName("close")[0];
const downloadExpandedBtn = document.getElementById("downloadExpandedImage");

// Variables pour suivre l'image actuellement agrandie
let currentExpandedImageUrl = "";

// Fonction pour générer l'URL GitHub
function getGitHubUrl(filename) {
    return `https://raw.githubusercontent.com/${githubRepo}/${branch}/${imagesFolder}/${filename}`;
}

// Afficher tous les thèmes au chargement
document.addEventListener('DOMContentLoaded', () => {
    loadImagesFromGitHub();
    setupModal();
});

// Fonction pour afficher les thèmes
function displayThemes(themesToDisplay) {
    themesContainer.innerHTML = '';
    
    themesToDisplay.forEach(theme => {
        const imageUrl = getGitHubUrl(theme.filename);
        
        const themeElement = document.createElement('div');
        themeElement.classList.add('theme-card');
        themeElement.setAttribute('data-category', theme.category);
        
        themeElement.innerHTML = `
            <div class="theme-img-container">
                <img src="${imageUrl}" alt="${theme.title}" class="theme-img">
                <button class="download-image-btn" data-url="${imageUrl}">Télécharger l'image</button>
            </div>
            <div class="theme-info">
                <h3>${theme.title}</h3>
                <p>${theme.description}</p>
                <button class="download-btn" data-id="${theme.id}">Télécharger le thème complet</button>
            </div>
        `;
        
        themesContainer.appendChild(themeElement);
    });
    
    // Gestion des erreurs d'image
    addImageErrorHandling();
    // Ajouter les événements aux boutons
    addDownloadEvents();
    addImageDownloadEvents();
}

// Charger les images depuis GitHub
async function loadImagesFromGitHub() {
    try {
        // Vérifier la disponibilité des images
        const availableThemes = [];
        
        for (const theme of themes) {
            const imageUrl = getGitHubUrl(theme.filename);
            const exists = await checkImageExists(imageUrl);
            
            if (exists) {
                availableThemes.push({
                    ...theme,
                    imageUrl,
                    downloadUrl: imageUrl,
                    imageDownloadUrl: imageUrl
                });
            }
        }
        
        displayThemes(availableThemes.length > 0 ? availableThemes : themes);
    } catch (error) {
        console.error("Erreur:", error);
        displayThemes(themes);
    }
}

// Vérifier si une image existe
async function checkImageExists(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        return false;
    }
}

// Gestion des erreurs d'image
function addImageErrorHandling() {
    document.querySelectorAll('.theme-img').forEach(img => {
        img.onerror = function() {
            this.src = 'https://via.placeholder.com/300x200?text=Image+Non+Disponible';
            this.style.objectFit = 'contain';
            this.style.backgroundColor = '#f0f0f0';
        };
    });
}

// Filtrer les thèmes par catégorie
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
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

// Gérer les téléchargements
function addDownloadEvents() {
    const downloadButtons = document.querySelectorAll('.download-btn');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            const themeId = e.target.dataset.id;
            const theme = themes.find(t => t.id == themeId);
            const downloadUrl = getGitHubUrl(theme.filename);
            
            try {
                const response = await fetch(downloadUrl);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.href = url;
                a.download = `theme-${theme.title.toLowerCase().replace(/ /g, '-')}.jpg`;
                document.body.appendChild(a);
                a.click();
                
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } catch (error) {
                console.error('Erreur de téléchargement:', error);
                alert('Le téléchargement a échoué. Veuillez réessayer plus tard.');
            }
        });
    });
}

// Gérer les téléchargements d'images
function addImageDownloadEvents() {
    const downloadImageButtons = document.querySelectorAll('.download-image-btn');
    
    downloadImageButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const imageUrl = e.target.dataset.url;
            
            const a = document.createElement('a');
            a.href = imageUrl;
            a.download = `image-${Date.now()}.jpg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    });
}

// Configurer le modal
function setupModal() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('theme-img')) {
            modal.style.display = "block";
            modalImg.src = e.target.src;
            currentExpandedImageUrl = e.target.src;
        }
    });

    downloadExpandedBtn.addEventListener('click', function() {
        const a = document.createElement('a');
        a.href = currentExpandedImageUrl;
        a.download = `image-${Date.now()}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    closeBtn.addEventListener('click', function() {
        modal.style.display = "none";
    });

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
}
