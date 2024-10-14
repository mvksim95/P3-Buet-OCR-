document.addEventListener('DOMContentLoaded', () => {

    // sélectionne le formulaire et les champs du formulaire
    const loginForm = document.querySelector('.form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('mdp');
    const errorMess = document.querySelector(".errorMess")

    // création d'un élément pour le message d'erreur et l'ajouter au formulaire
    const errorMessage = document.createElement('p');
    errorMessage.id = 'errorMessage';
    errorMessage.style.display = 'none';
    errorMess.appendChild(errorMessage);


    // ajout d'un écouteur d'événement sur le submit du formulaire
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // <--- empeche le submit par défaut du formulaire

        // récupères les valeurs des champs email et mot de passe
        const email = emailInput.value;
        const password = passwordInput.value;

        //cache le mess pour chaque submit
        errorMessage.style.display = 'none';

        try {
            //fait la requête à l'API pour vérifier les id
            const reponse = await fetch('http://localhost:5678/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            //si la réponse est ok (statut 200), récupère kle token
            if (reponse.ok) {
                const data = await reponse.json();
                const token = data.token;

                //stock le token dans le localstorage
                localStorage.setItem('authToken', token);

                //redirige vers index.html après stockage du token
                window.location.href = 'index.html';
            } else {
                // affiche le message d'erreur si les id sont incorrects
                errorMessage.style.display = 'block';
                errorMessage.textContent = 'E-mail ou mot de passe incorrect'
            }
        } catch (error) {
            //gestion erreurs réseaux ou autre
            console.error('Erreur de connexion', error);
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'Une erreur est survenue, veuillez réessayer plus tard.';
        }
    });
});

