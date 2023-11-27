let petBox = document.getElementById("companion");
let hatchButton = document.getElementById("hatch");
let actions = document.getElementById("actions");
let foodButton = document.getElementById("food");

let statusBar = document.getElementById("status-bar");
let healthBar = document.getElementById("health-bar");
let hungerBar = document.getElementById("hunger-bar");
let cleanlinessBar = document.getElementById("cleanliness-bar");
let happinessBar = document.getElementById("happiness-bar");

let decayInterval;

let pet = {
  info: {
    type: "",
    growthPoints: 0,
    growthIndex: 0, // Start at the first stage ("baby")
    growthStages: ["baby", "teen", "adult"],
    sprite: ""
  },

  stats: {
    health: 10,
    hunger: 10,
    cleanliness: 10,
    happiness: 10,
  },

  hatch: function () {

    decayInterval = setInterval(() => { pet.decay() }, 10000);

    this.info.type = petTypes[rollType()];

    this.info.sprite = `url(../../img/pets/${this.info.type}/${this.info.growthStages[this.info.growthIndex]}.svg)`;
    petBox.style.backgroundImage = this.info.sprite;

    hatchButton.style.display = "none";
    petBox.style.display = "block";
    statusBar.style.display = "flex";
    actions.style.display = "flex";
  },

  grow: function () {
    this.info.growthPoints++;

    if (
      this.info.growthPoints >= 100 &&
      this.info.growthIndex < this.info.growthStages.length - 1
    ) {
      this.info.growthIndex++;
      this.info.growthPoints = 0; // Reset growth points after growing

      // Set sprite based on the new growth stage
      this.info.sprite = `url(../../img/pets/${this.info.type}/${this.info.growthStages[this.info.growthIndex]}.svg)`;

      console.log(
        `Your pet has grown! New growth stage: ${this.info.growthStages[this.info.growthIndex]
        }`
      );
    } else {
      console.log(
        "Your pet is already an adult or doesn't have enough growth points!"
      );
    }
  },

  eat: function () {
    if (this.hunger < 10) {
      this.hunger = Math.min(this.hunger + 2, 10);
      this.grow();
    }
  },

  clean: function () {
    if (this.cleanliness < 10) {
      this.cleanliness = Math.min(this.cleanliness + 5, 10);
    }
  },

  play: function () {
    if (this.happiness < 10) {
      this.happiness = Math.min(this.happiness + 3, 10);
    }
  },

  decay: function () {
    // Get an array of stat names excluding "health"
    const statNames = Object.keys(this.stats).filter(stat => stat !== "health");

    // Randomly select a stat to decay from hunger, cleanliness, and happiness
    const randomStatIndex = Math.floor(Math.random() * statNames.length - 1);
    const randomStat = statNames[randomStatIndex];

    if (randomStat === "happiness" && this.stats.happiness > 0) {
      this.stats.happiness -= 1;
      update
      console.log("happiness has decayed. Stats:", this.stats);

    } else if (randomStat === "cleanliness" && this.stats.cleanliness > 0) {
      this.stats.cleanliness -= 1;
      update
      console.log("cleanliness has decayed. Stats:", this.stats);

    } else if (randomStat === "hunger" && this.stats.hunger > 0) {
      this.stats.hunger -= 1;
      update
      console.log("hunger has decayed. Stats:", this.stats);
    }

    // Check if health is the last stat and decay it if it's not already zero
    if (this.stats.health > 0 && this.stats.hunger == 0 && this.stats.cleanliness == 0 && this.stats.happiness == 0) {
      this.stats.health -= 1;
      update
      console.log("health has decayed. Stats:", this.stats);

      // Check if health has reached zero after decaying
      if (this.stats.health === 0) {
        this.die();
      }
    }
  },

  die: function () {
    this.info.type = "";
    this.info.growthPoints = 0;
    this.info.growthIndex = 0;
    this.info.sprite = "";

    this.stats.health = 10;
    this.stats.hunger = 10;
    this.stats.cleanliness = 10;
    this.stats.happiness = 10;

    clearInterval(decayInterval);
  }
};

let petTypes = ["yeti", "tree", "fly", "red_panda"];

function rollType() {
  const randomNumber = Math.floor(Math.random() * 4);
  return randomNumber;
}



hatchButton.addEventListener("click", function () {
  pet.hatch();
});

foodButton.addEventListener("click", function () {
  chrome.windows.create({
    type: 'popup',
    url: 'popup/food/food.html',
    width: 600,
    height: 600
  })
});