// création des const ici
const gallery = document.querySelector(".gallery");
const filtres = document.querySelector(".filtres");

// création des variables ici
let allGallery = [];
let allFilters = [];
let filterChoice = "Tous";

// fonctions ici  
getFilters();
getWorks();


// récupères et affiche les filtres depuis l'API
async function getFilters() {
  const response = await fetch("http://localhost:5678/api/categories");
  allFilters = await response.json();

  // ajout de l'entrée "Tous" en premier dans la liste des filtres
  allFilters.unshift({ id: 0, name: 'Tous' });

  // créer un bouton pour chaque filtre stylisé dans le CSS
  allFilters.forEach(filter => {
    const newFilter = document.createElement("button");
    newFilter.innerText = filter.name;
    newFilter.dataset.id = filter.id; //<--- pour associer l'ID de la catégorie au bouton
    filtres.appendChild(newFilter);
  });

  // ajout de l'écouteur d'événement sur les boutons de filtre
  filtres.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') { //<<- BUTTON en maj car la valeur est toujours renvoyé en MAJUSCULE par le DOM
      filterChoice = event.target.dataset.id; //<-- pour récupérer l'ID de la catégorie choisie
      filterGallery(); // filtre la galerie en fonction du choix du filtre
    }
  });
}

// fonction pour récupéré et afficher les oeuvres
async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  allGallery = await response.json();
  displayWorks(allGallery);
}

// fonction pour afficher les oeuvres dans la galerie
function displayWorks(works) {
  gallery.innerHTML = ''; //<- important pour vider la galerie, sinon à chaque choix de filtre il y aura un ajout de work a la suite les uns des autres
  works.forEach(work => {
    const newFigure = document.createElement("figure");
    const newFigCaption = document.createElement("figcaption");
    const newImg = document.createElement("img");

    newFigCaption.innerText = work.title;
    newImg.src = work.imageUrl;
    newImg.alt = work.title;

    newFigure.appendChild(newImg);
    newFigure.appendChild(newFigCaption);
    gallery.appendChild(newFigure);
  });
}

// fonction pour filtrer et affiche la galerie en fonction du filtre sélectionné
function filterGallery() {
  if (filterChoice == 0) {
    // si "Tous" est sélectionné (tous à l'id 0), affiche toutes les oeuvres
    displayWorks(allGallery);
  } else {
    // sinon, filtrer les oeuvres par catégorie 
    const filteredWorks = allGallery.filter(work => work.categoryId == filterChoice);
    displayWorks(filteredWorks);
  }
}

// sélectionne tous les liens de navigation
const navLinks = document.querySelectorAll('header ul li a');

// ajout d'un écouteur d'événement sur les lien
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // supprime la classe active des liens
        navLinks.forEach(link => link.classList.remove('active'));
        
        // ajouter la classe active au lien cliqué
        link.classList.add('active');
    });
});








