let modal = null
const focusableSelector = 'button, a , input, textarea'
let focusables = []
let previouslyFocusedElement = null

//import de la fonction displayWorks pour pouvoir l'utiliser avec les fonctions des modal sans devoir la réécrire
import { displayWorks } from "./script.js";

//recuperation des img de l'API pour la modalGallery  
getWorks()

//creer la modif pour la fonction
const openModal = function (e) {
    e.preventDefault()
    console.log("bouton modal cliqué")//<-- affiche que la func est bien liée au bouton
    modal = document.querySelector(e.target.getAttribute('href'))
    focusables = Array.from(modal.querySelectorAll(focusableSelector))
    previouslyFocusedElement = document.querySelector(':focus')
    modal.style.display = null
    focusables[0].focus() // <<-- focus par défaut à l'ouverture de la boite modal
    modal.removeAttribute('aria-hidden')
    modal.setAttribute('aria-modal', 'true')
    console.log(modal)

    modal.addEventListener('click', function (e) {
        // vérifie si le clic est en dehors des modales "modal-to-add" et "hiddenModal"
        if (e.target === modal) {
            closeModal(e);
        }
    });

    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modalGallery.querySelector('.js-modal-close').addEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
};


// déclaration de la fonction pour la fermeture de la modal
const closeModal = function (e) {
    if (modal === null) return
    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus()
    e.preventDefault()
    console.log('fonction closeModal ok')//<-- affiche que la func pour fermer la modal est ok 
    modal.style.display = "none"
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
    modalGallery.querySelector('.js-modal-close').removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
    modal = null
}

//empeche la propagation de l'evenement vers les parents (empeche le probleme de click qui ferme la modale à l'interieur du contenu)
const stopPropagation = function (e) {
    e.stopPropagation()
}

// Gestion du focus dans la boite modal 
const focusInModal = function (e) {
    e.preventDefault()
    let index = focusables.findIndex(f => f === modal.querySelector(':focus'))
    if (e.shiftKey === true) {
        index--
    } else {
        index++
    }
    if (index >= focusables.length) {
        index = 0
    }
    if (index < 0) {
        index = focusables.length - 1
    }
    focusables[index].focus()
    console.log(index)
}

//creer la fonctionpour ouvrir la modale
document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal)
})

//pour fermer la modale avec la touche echap (ecoute du clavier + fonction closeModal sur Esc)
// + focus du tab dans la modal
window.addEventListener('keydown', function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
    if (e.key === 'Tab' && modal !== null) {
        focusInModal(e)
    }
})

//switch des modal
const modalToAdd = document.querySelector('.modal-to-add')
const modalGallery = document.querySelector('.hiddenModal')
const switchButtonToGallery = document.querySelector('.switch')
const switchButtonToAdd = document.querySelector('.btn-add-photo')

async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    allworks = await response.json();
    displayWorksOnModal(allworks);
}

const switchToGalleryModal = function (e) {
    e.preventDefault()
    e.stopPropagation()
    console.log('switch modal ok')
    modalToAdd.style.display = 'none'
    modalGallery.style.display = 'flex'
};

const switchToAddModal = function (e) {
    e.preventDefault()
    e.stopPropagation()
    console.log('switch to add ok')
    modalGallery.style.display = ''
    modalToAdd.style.display = 'flex'
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
}

switchButtonToGallery.addEventListener('click', switchToGalleryModal);
switchButtonToAdd.addEventListener('click', switchToAddModal);

//affichage des img de la galerie dans la modalGallery

const galerie = document.querySelector('.gallerie')

let allworks = [];

function displayWorksOnModal(works) {
    works.forEach(work => {
        //créer un conteneur pour chaque image et son icone
        const container = document.createElement("div");
        container.classList.add("img-container");
        container.style.position = "relative"; //permet de positionner l'icone par rapport a ce conteneur

        //images
        const newImg = document.createElement("img");
        newImg.src = work.imageUrl;

        //conteneur des icones (pour le background en noir notamment)
        const trashContainer = document.createElement("div");
        trashContainer.classList.add("trash-container")

        //icone de la poubelle
        const trashLogo = document.createElement("i");
        trashLogo.classList.add("fa-solid", "fa-trash-can");

        container.appendChild(newImg);
        container.appendChild(trashContainer);
        trashContainer.appendChild(trashLogo)

        galerie.appendChild(container);

        trashLogo.addEventListener('click', deleteWorks)
    });
}

//suppression des travaux dans la modal 

async function deleteWorks(event) {
    try {
        // récupère le conteneur de l'img à partir de l'icone poubelle
        const container = event.target.closest(".img-container");
        const workIndex = Array.from(galerie.children).indexOf(container);
        const workId = allworks[workIndex].id;

        // requete delete pour supp l'element de l'API
        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'Content-type' : 'application/json'
            }
        });

        if (response.ok) {
            // supprime l'élément du tableau allworks
            allworks.splice(workIndex, 1);

            // régénérer la galerie avec les données mises à jour via la fonction importé
            displayWorks(allworks);

            // supprime l'élément du DOM de la modale
            galerie.removeChild(container);

        } else {
            alert('Erreur lors de la suppression')
        }


    } catch {
        console.error('erreur de connexion');
        alert('Une erreur est survenue');
    }
}

// Ajout des works ---------------------------------------------------------------------

document.querySelector('.addPhoto').addEventListener('click', function() {
    document.getElementById('fileInput').click();
});

// fonction pour charger les catégorie et les ajouter au select
async function loadCategories() {
    try {
        // faire une requete GET pour récupérer les catégories depuis l'API
        const response = await fetch('http://localhost:5678/api/categories', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            }
        });

        if (response.ok) {
            const categories = await response.json(); // récupère les cat au format JSON
            const categorySelect = document.querySelector('.categorie-select');

            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        } else {
            console.error('Erreur lors de la récupération des catégories');
        }
    } catch (error) {
        console.error('Erreur de connexion', error);
    }
}
// appel la fonction pour charger les catégories au chargementde la modal
document.addEventListener('DOMContentLoaded', loadCategories);

const fileInput = document.getElementById('fileInput');
const imgUpload = document.querySelector('.imgUpload');

// afficher une prévisualisation de l'image
fileInput.addEventListener('change', function () {
    const file = fileInput.files[0]; // récupère le fichier inséré
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imgUpload.src = e.target.result; //<-- affiche l'image dans la balise <img>
            imgUpload.style.display = 'block'; // annule le display none
            document.querySelector('.addPhoto').style.display = 'none'; // cache le bouton d'ajout
        };
        reader.readAsDataURL(file); // convertit l'image en URL lisable
    }
});


// fonction pour vérifier si tous les champs sont remplis utilisé plus bas
function checkFormCompletion() {
    const fileInput = document.getElementById('fileInput');
    const titleInput = document.getElementById('Titre');
    const categorySelect = document.getElementById('categories');
    const submitButton = document.querySelector('.submitValider');

    // vérifie si tous les champs sont remplis
    if (fileInput.files.length && titleInput.value.trim() !== '' && categorySelect.value !== '') {
        // si tous les champs sont remplis, changer la couleur du bouton en vert
        submitButton.style.backgroundColor = '#1D6154';
        return true; // renvoie true si tous les champs sont remplis
    } else {
        // sinon, revenir à la couleur par défaut
        submitButton.style.backgroundColor = '#A7A7A7';
        return false; // renvoie false si un des champs est vide
    }
}

// ajout d'écouteur d'event pour surveiller les changement
document.getElementById('fileInput').addEventListener('change', checkFormCompletion);
document.getElementById('Titre').addEventListener('input', checkFormCompletion);
document.getElementById('categories').addEventListener('change', checkFormCompletion);

// validation du formulaire et soumission des données insérées vers l'API
document.getElementById('addForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // empeche le rechargement de la page

    const messErreur = document.querySelector('.messErreur'); // div pour les messages d'erreur
    const messErreurTxt = document.createElement('p'); // message d'erreur pour l'image

    messErreur.innerHTML = ''; // vide les messages d'erreur précédents

    // vérifie si tous les champs sont bien remplis avec la fonction checkForm
    if (!checkFormCompletion()) {
        // si les champs ne sont pas tous remplis, affiche le mess d'erreur
        const fileInput = document.getElementById('fileInput');
        if (!fileInput.files.length) {
            messErreurTxt.innerText = 'Veuillez remplir tout les champs avant de valider l\'ajout';
            messErreur.appendChild(messErreurTxt); //<-- ajoute le message d'erreur dans la div messErreur
        }
        return; // empeche la soumission du formulaire si il est est incomplet
    }

    // création de l'objet FormData pour capter les données du formulaire
    const formData = new FormData();
    formData.append('image', document.getElementById('fileInput').files[0]); //<- ajoute l'image
    formData.append('title', document.getElementById('Titre').value); // <---ajoute le titre
    formData.append('category', document.getElementById('categories').value); //<<- ajoute la catégorie

    try {
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
            body: formData //<<-- envoie les données du formulaire
        });

        if (response.ok) {
            const data = await response.json();
            alert('Travail ajouté avec succès');
        } else {
            alert('Erreur lors de l\'ajout du travail');
        }
    } catch (error) {
        console.error('Erreur de connexion', error);
        alert('Une erreur est survenue');
    }
});