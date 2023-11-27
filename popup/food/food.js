let boxRow = document.getElementById("box-row");
let feedButton = document.getElementById("feed");
let feedButtonCount = document.getElementById("feed-count")
let cookieList = document.getElementById("cookie-list");


let cookieSpriteArray = ["chip", "cookie", "food_token", "key", "ride_token_2", "ride_token_3", "ride_token", "tel_token", "ticket", "token"];
let cookiesByDomain = {};
let selectedItems = [];

class Cookie {
  constructor(
    name,
    value,
    domain,
    path,
    expirationDate,
    secure,
    httpOnly
  ) {
    this.name = name;
    this.value = value;
    this.domain = domain;
    this.path = path;
    this.expirationDate = expirationDate;
    this.secure = secure;
    this.httpOnly = httpOnly;
  }
}



document.addEventListener("DOMContentLoaded", function () {
  // Query all cookies
  chrome.cookies.getAll({}, function (cookies) {

    // Create a Cookie object and push it into the array for the current domain
    for (let i = 0; i < cookies.length; i++) {
      let domain = cookies[i].domain;
      if (!cookiesByDomain[domain]) {
        cookiesByDomain[domain] = [];
      }

      let cookie = new Cookie(
        cookies[i].name,
        cookies[i].value,
        cookies[i].domain,
        cookies[i].path,
        cookies[i].expirationDate,
        cookies[i].secure,
      );

      cookiesByDomain[domain].push(cookie);

    }

    // Display cookies in the popup, grouped by domain
    for (let domain in cookiesByDomain) {
      //create domain
      let domainItem = document.createElement("li");
      domainItem.className = "domain-item";
      domainItem.textContent = domain;
      cookieList.appendChild(domainItem);

      //create cookie group
      let cookieGroup = document.createElement("ul");
      cookieGroup.className = "cookie-group"

      for (let j = 0; j < cookiesByDomain[domain].length; j++) {
        let cookieItem = document.createElement("li");
        cookieItem.className = "cookie-item";

        let cookie = cookiesByDomain[domain][j];

        try {
          let secondsExpirationDate = new Date(cookie.expirationDate * 1000);
          let formattedDate = new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: 'numeric', day: '2-digit', month: '2-digit', year: 'numeric' }).format(secondsExpirationDate);




          let randomIndex = Math.floor(Math.random() * cookieSpriteArray.length);

          if (cookie.path == "/") {
            delete cookie.path;
          }





          const cookieSprite = document.createElement("div");
          cookieSprite.className = "cookie-sprite details";
          cookieSprite.style.backgroundImage = `url(../../img/cookies/${cookieSpriteArray[randomIndex]}.png)`;


          const cookieDetails = document.createElement("div");
          cookieDetails.className = "cookie-details";


          const cookieName = document.createElement("div");
          cookieName.className = "cookie-name";
          cookieName.textContent = cookie.name;

          // const cookieValue = document.createElement("div");
          // cookieValue.className = "cookie-value details";
          // cookieValue.textContent = cookie.value;

            const cookiePath = document.createElement("div");
            cookiePath.className = "cookie-path details";
            cookiePath.textContent = cookie.path;

          const cookieExp = document.createElement("div");
          cookieExp.className = "cookie-exp details";
          cookieExp.textContent = formattedDate;

          const cookieSecure = document.createElement("div");
          cookieSecure.className = "cookie-secure details";
          cookieSecure.textContent = "Secure";

          const cookieSelect = document.createElement("div");
          cookieSelect.className = "cookie-select";
          cookieSelect.textContent = "Select";




          cookieItem.appendChild(cookieSprite);
          cookieItem.appendChild(cookieDetails);

          cookieDetails.appendChild(cookieName);
          // cookieDetails.appendChild(cookieValue);
          cookieDetails.appendChild(cookiePath);
          cookieDetails.appendChild(cookieExp);
          if (cookie.secure == true) { cookieDetails.appendChild(cookieSecure) };
          cookieDetails.appendChild(cookieSelect);





          cookieSelect.addEventListener("click", function () {
            // Toggle the "selected" class on cookieItem
            cookieItem.classList.toggle("selected");

            // Check if the "selected" class is present after toggling
            if (cookieItem.classList.contains("selected")) {
              selectedItems.push(cookieItem);

            } else {
              // If it's not present, remove cookieItem from the selectedItems array
              const index = selectedItems.indexOf(cookieItem);
              if (index > -1) { selectedItems.splice(index, 1) };

            }

            if (selectedItems.length > 0) {
              feedButton.style.display = "block";
              feedButtonCount.innerText = selectedItems.length + " selected";
            } else {
              feedButton.style.display = "none";
            }

            // Now, selectedItems array contains the selected items
            console.log(selectedItems);
          });


          cookieItem.addEventListener("mouseenter", function () {
            cookieSelect.style.display = "block";
          });

          cookieItem.addEventListener("mouseleave", function () {
            cookieSelect.style.display = "none";
          });



          cookieGroup.appendChild(cookieItem);

          domainItem.appendChild(cookieGroup);



        } catch (error) {
          console.error("An error occurred:", error.message)
        }
      }

    }
  });

  boxRow.addEventListener("click", function () {
    let groups = document.getElementsByClassName("cookie-group");
    for (let i = 0; i < groups.length; i++) {
      groups[i].classList.toggle("toggle-row");
    }

    let items = document.getElementsByClassName("cookie-item");
    for (let i = 0; i < items.length; i++) {
      items[i].classList.toggle("toggle-row-items");
    }

    let details = document.getElementsByClassName("details");
    for (let i = 0; i < details.length; i++) {
      details[i].classList.toggle("toggle-row-details");
    }
  });

  feedButton.addEventListener("click", function () {

    for (let i = 0; i < selectedItems.length; i++) {
      let cookieName = selectedItems[i].getElementsByClassName("cookie-name")[0].textContent;
      let cookieDomain = selectedItems[i].parentNode.parentNode.textContent;
      chrome.cookies.remove({ url: "http://" + cookieDomain, name: cookieName }, function (deletedCookie) {
        selectedItems[i].remove();
        console.log("Cookie deleted:", deletedCookie);
      });

    }
  });


});

