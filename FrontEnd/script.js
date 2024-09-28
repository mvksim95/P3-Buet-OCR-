const gallery = document.querySelector(".gallery");
let allWorks = [];

getWorks()




async function getWorks() {
  const reponse = await fetch("http://localhost:5678/api/works");
  allWorks = await reponse.json();
  console.log(allWorks);
   
  allWorks.forEach(work => {
    const newFigure = document.createElement("figure");
    const newFigCaption = document.createElement("Figcaption");
    newFigCaption.innerText = work.title 
    gallery.appendChild(newFigure);
    newFigure.appendChild(newFigCaption);
    
  });



}

