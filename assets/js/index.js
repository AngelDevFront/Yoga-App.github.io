//fait un tableau composer de différent élément
const main = document.querySelector("main");
const basicArray = [
  { pic: 0, min: 1 },
  { pic: 1, min: 1 },
  { pic: 2, min: 1 },
  { pic: 3, min: 1 },
  { pic: 4, min: 1 },
  { pic: 5, min: 1 },
  { pic: 6, min: 1 },
  { pic: 7, min: 1 },
  { pic: 8, min: 1 },
  { pic: 9, min: 1 },
];
// variable prête a stocker d'autre données
let exerciceArray = [];

// Get stored exercices array
// if vérifie si une clé nommée exercices existe dans le stockage local du navigateur permet de charger un tableau d'exercices a partir du stockage local si il existe si pas il charge un tableau par défaut
(() => {
  if (localStorage.exercices) {
    exerciceArray = JSON.parse(localStorage.exercices);
  } else {
    exerciceArray = basicArray;
  }
})();
// défini le temp pour chaque exercices
class Exercice {
  constructor() {
    this.index = 0;
    this.minutes = exerciceArray[this.index].min;
    this.seconds = 0;
  }
  // est utilisé pour mettre a jour la valeur des secondes
  updateCountdown() {
    this.seconds = this.seconds < 10 ? "0" + this.seconds : this.seconds;
    // Gère la progression du temps pour chaque exercice en tenant compte du délai spécifié entre chaque mise a jour dans ce cas 1 seconde il déclenche également des actions appropriées lorsque le temps de l'exercice est écoulé ou lorsqu'un nouveau cycle commence.
    setTimeout(() => {
      if (this.minutes === 0 && this.seconds === "00") {
        this.index++;
        this.ring();
        if (this.index < exerciceArray.length) {
          this.minutes = exerciceArray[this.index].min;
          this.seconds = 0;
          this.updateCountdown();
        } else {
          return page.finish();
        }
      } else if (this.seconds === "00") {
        this.minutes--;
        this.seconds = 59;
        this.updateCountdown();
      } else {
        this.seconds--;
        this.updateCountdown();
      }
    }, 1000);
    // génère le contenu HTML
    return (main.innerHTML = `
          <div class="exercice-container">
            <p>${this.minutes}:${this.seconds}</p>
            <img src="../img/${exerciceArray[this.index].pic}.png" />
            <div>${this.index + 1}/${exerciceArray.length}</div>
          </div>`);
  }
  // Déclenche la lecture d'un fichier
  ring() {
    const audio = new Audio();
    audio.src = "ring.mp3";
    audio.play();
  }
}
//Méthode pour mettre a jour le titre le contenu et le bouton de la page en fonction des valeur passée en paramètre. Cela simplifie la mise a jour du contenu de la page en mettant la logique nécessaire dans une seul méthode.
const utils = {
  pageContent: function (title, content, btn) {
    document.querySelector("h1").innerHTML = title;
    main.innerHTML = content;
    document.querySelector(".btn-container").innerHTML = btn;
  },
  // met a jour les champ de saisie de type nombre met a jour les valeur de exercice array en fonction des valeur saisie puis stockes les changement
  handleEventMinutes: function () {
    document.querySelectorAll('input[type="number"]').forEach((input) => {
      input.addEventListener("input", (e) => {
        exerciceArray.map((exo) => {
          if (exo.pic == e.target.id) {
            exo.min = parseInt(e.target.value);
            this.store();
          }
        });
      });
    });
  },
  // écoute les événement de click sur les flèches dans les interfaces utilisateur permettant a l'utilisateur de réorganiser l'ordre des exercices
  handleEventArrow: function () {
    document.querySelectorAll(".arrow").forEach((arrow) => {
      arrow.addEventListener("click", (e) => {
        let position = 0;
        exerciceArray.map((exo) => {
          if (exo.pic == e.target.dataset.pic && position !== 0) {
            [exerciceArray[position], exerciceArray[position - 1]] = [
              exerciceArray[position - 1],
              exerciceArray[position],
            ];
            page.lobby();
            this.store();
          } else {
            position++;
          }
        });
      });
    });
  },
  // Permet a l'utilisateur de supprimer des exercices en cliquant sur les boutons de suppression associés. Lorsqu'un bouton de suppression est cliqué, l'exercice correspondant est supprimé de la liste des exercices, et la liste mise a jour est ensuite affichée à l'utilisateur
  deleteItem: function () {
    document.querySelectorAll(".deleteBtn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        let newArr = [];
        exerciceArray.map((exo) => {
          if (exo.pic != e.target.dataset.pic) {
            newArr.push(exo);
          }
        });
        exerciceArray = newArr;
        page.lobby();
        this.store();
      });
    });
  },
  // La méthode reboot permet de réinitialiser les exercices à leur état initial puis actualise l'affichage et stocke les modifications dans le stockage local Utile pour permettre au utilisateur de revenir à une config par défaut des exercices
  reboot: function () {
    exerciceArray = basicArray;
    page.lobby();
    this.store();
  },

  store: function () {
    localStorage.exercices = JSON.stringify(exerciceArray);
  },
};
//la méthode lobby génère dynamiquement une liste HTML des exercices actuels à partir des données contenues dans exercices array ce qui permet à l'utilisateur de voir et d'interagir avec les exercices dans l'interface utilisateur
const page = {
  lobby: function () {
    let mapArray = exerciceArray
      .map(
        (exo) =>
          `
            <li>
              <div class="card-header">
                <input type="number" id=${exo.pic} min="1" max="10" value=${exo.min}>
                <span>min</span>
              </div>
              <img src="../img/${exo.pic}.png" />
              <i class="fas fa-arrow-alt-circle-left arrow" data-pic=${exo.pic}></i>
              <i class="fas fa-times-circle deleteBtn" data-pic=${exo.pic}></i>
            </li>
          `
      )
      .join("");
    // défini la procédure pour afficher la page de paramétrage des exercices dans l'interface utilisateur  i gère les événements associés a la modification des exercices a leur réorganisation et a leur suppression et fournit des fonctionnalités pour réinitialiser les exercices et démarrer une routine d'exercices
    utils.pageContent(
      "Paramétrage <i id='reboot' class='fas fa-undo'></i>",
      "<ul>" + mapArray + "</ul>",
      "<button id='start'>Commencer<i class='far fa-play-circle'></i></button>"
    );
    utils.handleEventMinutes();
    utils.handleEventArrow();
    utils.deleteItem();
    reboot.addEventListener("click", () => utils.reboot());
    start.addEventListener("click", () => this.routine());
  },
  //utilisé pour démarrer une routine d'exercice mes a jour l'interface utilisateur pour afficher la page routine d'exercice avec le titre routine et le compte a rebours de l'exercices en cours
  routine: function () {
    const exercice = new Exercice();

    utils.pageContent("Routine", exercice.updateCountdown(), null);
  },
  // Affiche une page de fin de routine d'exercice avec des option pour recommencer la routine ou réinitialiser les exercices elle permet a l'utilisateur de gérer la fin de la routine d'exercices et de prendre des actions en conséquence
  finish: function () {
    utils.pageContent(
      "C'est terminé !",
      "<button id='start'>Recommencer</button>",
      "<button id='reboot' class='btn-reboot'>Réinintialiser <i class='fas fa-times-circle'></i></button>"
    );
    start.addEventListener("click", () => this.routine());
    reboot.addEventListener("click", () => utils.reboot());
  },
};
//affiche la page de paramétrage dans l'innterface utilisateur lui permettant ainsi de modifier les paramètres des exercices avant de démarrer la routine.
page.lobby();
