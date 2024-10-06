let modal = null
const focusableSelector = 'button, a , input, textarea'
let focusables = []
let previouslyFocusedElement = null

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
    displayWorks(allworks);
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

function displayWorks(works) {
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

async function deleteWorks() {
    try {

        const container = event.target.closest(".img-container");
        const workIndex = Array.from(galerie.children).indexOf(container);
        const workId = allworks[workIndex].id;

        const response = await fetch('http://localhost:5678/api/works/${workId}', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'Content-type' : 'application/json'
            }
        });

        if (response.ok) {
            alert('Travail supprimé')
            galerie.removeChild(container);
        } else {
            alert('Erreur lors de la suppression')
        }


    } catch {
        console.error('erreur de connexion', error);
        alert('Une erreur est survenue');
    }
}
