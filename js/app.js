// Clearing the Content
const clearDetails = (id) => {
  const element = document.getElementById(id);
  element.textContent = "";
};

// Display Function //
const toggleElement = (id, displayStyle) => {
  document.getElementById(id).style.display = displayStyle;
};
// Getting The Search Text //
getInputValue = () => {
  const searchField = document.getElementById("search-input");
  const searchFieldInput = searchField.value;
  const searchFieldInputText = searchFieldInput.toLowerCase();
  searchField.value = "";
  return searchFieldInputText;
};
const searchValue = () => {
  toggleElement("spinner", "block");
  const searchFieldInputText = getInputValue();
  if (searchFieldInputText === "" || searchFieldInputText <= 0) {
    toggleElement("empty-error-message", "block");
    toggleElement("wrong-error-message", "none");
    toggleElement("total-count", "none");
    toggleElement("website-elements", "none");
    toggleElement("spinner", "none");
  } else {
    toggleElement("empty-error-message", "none");
    toggleElement("total-count", "block");
    toggleElement("website-elements", "block");

    const url = `https://openapi.programming-hero.com/api/phones?search=${searchFieldInputText}`;
    fetch(url)
      .then((res) => res.json())
      .then((phones) => loadPhoneList(phones.data));
    clearDetails("main-details");
    clearDetails("other-details");
    clearDetails("phone-image");
  }
};

// Loading the Phone List //
const loadPhoneList = (phones) => {
  toggleElement("spinner", "none");
  const totalCount = document.getElementById("total-count");
  const searchFieldInputText = getInputValue();
  const filteredPhones = phones.filter(
    (phone) => !phone.phone_name.includes("Watch")
  );
  totalCount.textContent = `Showing ${filteredPhones.length} results`;
  if (filteredPhones.length === 0 || searchFieldInputText === "watch") {
    toggleElement("wrong-error-message", "block");
    toggleElement("total-count", "none");
    toggleElement("website-elements", "none");
    toggleElement("show-more-phones", "none");
    clearDetails("phone-lists");
    clearDetails("total-count");
  } else {
    toggleElement("wrong-error-message", "none");
    toggleElement("total-count", "block");
    toggleElement("website-elements", "block");
    clearDetails("phone-lists");

    // Phones Less than 20 //
    if (filteredPhones.length <= 20) {
      toggleElement("show-more-phones", "none");
      clearDetails("phone-lists");
      displayPhoneLists(filteredPhones);
    }
    // Phones More than 20 //
    else if (filteredPhones.length > 20) {
      clearDetails("phone-lists");
      toggleElement("show-more-phones", "block");
      clearDetails("phone-lists");
      const phone20List = filteredPhones.slice(0, 20);
      displayPhoneLists(phone20List);

      // Showing all Phones More than 20 //
      document
        .getElementById("show-more-phones")
        .addEventListener("click", function () {
          toggleElement("show-more-phones", "none");
          clearDetails("phone-lists");
          displayPhoneLists(filteredPhones);
        });
    }
  }
};

// Phone List Showing Function //
const displayPhoneLists = (phones) => {
  phones.forEach((phone) => {
    const phoneList = document.getElementById("phone-lists");
    const div = document.createElement("div");
    div.innerHTML = `
       <div class="col-11 col-md-12 col-lg-12 mx-auto">
          <div id="phone-card" class="card h-100">
            <div
              class="d-flex flex-column justify-content-center"
              style="padding: 20px"
            >
              <div class="mx-auto">
                <img src="${phone.image}" class="" alt="" />
              </div>
              <div class="card-body text-center">
                <h5 class="card-title phone-name "> ${phone.phone_name}</h5>
                <h6 id="phone-brand" class="card-text">${phone.brand}</h6>
              </div>
              <div class="text-center">
               <a href="#phone-details" onclick="loadDetails('${phone.slug}')" class="show-more-details-button"> Show More Details </a>
              </div>
            </div>
          </div>
        </div>`;
    phoneList.appendChild(div);
  });
};

// Loading the phone details //
const loadDetails = (phoneId) => {
  fetch(`https://openapi.programming-hero.com/api/phone/${phoneId}`)
    .then((res) => res.json())
    .then((phone) => showDetails(phone.data));
};

// Displaying the Details //
const showDetails = (data) => {
  // Showing The Image in the Detail Section //
  const detailsImage = document.getElementById("phone-image");
  const mainDetailBox = document.getElementById("main-details");
  clearDetails("phone-image");
  clearDetails("main-details");
  const detailsImageDiv = document.createElement("div");
  detailsImageDiv.classList.add("detail-box");
  detailsImageDiv.innerHTML = `
            <div class="text-center mx-auto "style="padding: 20px">
              <img src="${data.image}" class="image-border" alt="" />
            </div>
            <h5 class="phone-name text-center"> ${data.name} </h5>
            <h6 id="release-text" class="text-center" style="margin-bottom:25px"> ${
              data.releaseDate
                ? data.releaseDate
                : "Release Date : Coming Soon..."
            } 
            <h6>`;
  detailsImage.appendChild(detailsImageDiv);

  // Showing The Main Features in the Detail Section //
  const mainDetailsDiv = document.createElement("div");
  mainDetailsDiv.classList.add("detail-box");
  mainDetailsDiv.innerHTML = `
            <h4 class="features-name">Main Features Of ${data.name}</h4>
            <h6 class="features-details"><span class="features-name">Storage : </span>${
              data.mainFeatures.storage
            }</h6>
            <h6 class="features-details"><span class="features-name">Display Size : </span>${
              data.mainFeatures.displaySize
            } </h6>
            <h6 class="features-details"><span class="features-name">Chipset : </span>${
              data.mainFeatures.chipSet
            }</h6>
            <h6 class="features-details"><span class="features-name">Memory : </span>${
              data.mainFeatures.memory
            }</h6>
            <h6 class="features-details"><span class="features-name">Sensors : </span>${data.mainFeatures.sensors.join(
              ",\n"
            )}</h6>`;
  mainDetailBox.appendChild(mainDetailsDiv);

  // Displaying The Image in the Detail Section //
  const otherDetailBox = document.getElementById("other-details");
  clearDetails("other-details");
  if (data.others) {
    otherDetailBox.setAttribute("class", "col-10 col-md-6 mx-auto");
    const otherDetailsDiv = document.createElement("div");
    otherDetailsDiv.classList.add("detail-box");
    otherDetailsDiv.innerHTML = `
          <h4 class="features-name">Other Features Of ${data.name}</h4>
            <h6 class="features-details"><span class="features-name">WLAN :</span> ${data.others.WLAN}</h6>
            <h6 class="features-details"><span class="features-name">Bluetooth :</span> ${data.others.Bluetooth} </h6>
            <h6 class="features-details"><span class="features-name">GPS :</span> ${data.others.GPS}</h6>
            <h6 class="features-details"><span class="features-name">USB :</span> ${data.others.USB}</h6>
            <h6 class="features-details"><span class="features-name">Radio :</span> ${data.others.Radio}</h6>
            <h6 class="features-details"><span class="features-name">NFC :</span> ${data.others.NFC}</h6>`;
    otherDetailBox.appendChild(otherDetailsDiv);
  } else {
    otherDetailBox.removeAttribute("class");
  }
};
