let modal = null
const focusableSelector = 'button, a , input, textarea'
let focusables = []
let previouslyFocusedElement = null

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
    modal.addEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
}

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
    let index = focusables.findIndex( f => f === modal.querySelector(':focus'))
    if (e.shiftKey === true) {
        index--
    }else{
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
