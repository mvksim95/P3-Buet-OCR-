document.addEventListener('DOMContentLoaded', () => {

    // sélectionne le formulaire et les champs du formulaire
    const loginForm = document.querySelector('.form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('mdp');
    const errorMess = document.querySelector(".errorMess")
    console.log(loginForm)
    console.log(emailInput)
    console.log(passwordInput)
    console.log(errorMess)

    // création d'un élément pour le message d'erreur et l'ajouter au formulaire
    const errorMessage = document.createElement('p');
    errorMessage.id = 'errorMessage';
    errorMessage.style.color = 'red';
    errorMessage.style.display = 'none';
    errorMess.appendChild(errorMessage);


    // ajout d'un écouteur d'événement sur le submit du formulaire
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); // <--- empeche le submit par défaut du formulaire

        // récupères les valeurs des champs email et mot de passe
        const email = emailInput.value;
        const password = passwordInput.value;

        // vérifie si les identifiants sont corrects (avec 3 options pour les message d'erreur)
        if (email !== 'sophie.bluel@test.tld' && password !== 'S0phie') {
            // display pour afficher le message d'erreur si les identifiants sont incorrects
            // puis textContent pour saisir le texte à afficher
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'E-mail et mot de passe incorrects'
        }else if (email !== 'sophie.bluel@test.tld' && password === 'S0phie') {
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'E-mail incorrect' 
        }else if (email === 'sophie.bluel@test.tld' && password !== 'S0phie') {
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'Mot de passe incorrect' 
        } else {
            // redirige vers index.html si les identifiants sont corrects
            window.location.href = 'index.html';
        }
    });
});