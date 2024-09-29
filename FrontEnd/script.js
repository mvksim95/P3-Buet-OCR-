const gallery = document.querySelector(".gallery");
let allWorks = [];

getWorks()




async function getWorks() {
  const reponse = await fetch("http://localhost:5678/api/works");
  allWorks = await reponse.json();
  console.log(allWorks);
   
  allWorks.forEach(work => {
    const newFigure = document.createElement("figure");
    const newFigCaption = document.createElement("figcaption");
    const newImg = document.createElement("img");
    newFigCaption.innerText = work.title
    newImg.src = work.imageUrl
    newImg.alt = work.title
    gallery.appendChild(newFigure);
    newFigure.appendChild(newImg);
    newFigure.appendChild(newFigCaption);

  });
}

