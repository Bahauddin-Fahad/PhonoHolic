// Clearing the Content
const clearDetails = (id) => {
  const element = document.getElementById(id);
  element.textContent = "";
};

// Display Function
const toggleElement = (id, displayStyle) => {
  document.getElementById(id).style.display = displayStyle;
};
// Getting the search Text //
const searchValue = () => {
  toggleElement("spinner", "block");
  const searchField = document.getElementById("search-input");
  const searchFieldValue = searchField.value;
  if (searchFieldValue === "" || searchFieldValue <= 0) {
    toggleElement("empty-error-message", "block");
    toggleElement("wrong-error-message", "none");
    toggleElement("total-count", "none");
    toggleElement("website-elements", "none");
    toggleElement("spinner", "none");
  } else {
    toggleElement("empty-error-message", "none");
    toggleElement("total-count", "block");
    toggleElement("website-elements", "block");

    const url = `https://openapi.programming-hero.com/api/phones?search=${searchFieldValue}`;
    fetch(url)
      .then((res) => res.json())
      .then((phones) => displayPhone(phones.data));
    clearDetails("main-details");
    clearDetails("other-details");
    clearDetails("phone-image");
    searchField.value = "";
  }
};

// Displaying the Phone List
const displayPhone = (phones) => {
  toggleElement("spinner", "none");
  // console.log(phones);
  const totalCount = document.getElementById("total-count");
  if (phones.length === 0) {
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

    totalCount.textContent = `Showing ${phones.length} results`;
    clearDetails("phone-lists");
    if (phones.length < 20) {
      // showMoreButton.style.display = "none";
      toggleElement("show-more-phones", "none");
      clearDetails("phone-lists");
      showResults(phones);
    } else if (phones.length > 20) {
      clearDetails("phone-lists");
      toggleElement("show-more-phones", "block");
      clearDetails("phone-lists");
      const phoneList = phones.slice(0, 20);
      showResults(phoneList);
      document
        .getElementById("show-more-phones")
        .addEventListener("click", function () {
          toggleElement("show-more-phones", "none");
          clearDetails("phone-lists");
          showResults(phones);
        });
    }
  }
};

// Result Showing Function //
const showResults = (phones) => {
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
                <h5 id="phone-name" class="card-title"> ${phone.phone_name}</h5>
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
  //   console.log(phoneId);
  fetch(`https://openapi.programming-hero.com/api/phone/${phoneId}`)
    .then((res) => res.json())
    .then((phone) => showDetails(phone.data));
};

// Displaying the Details //
const showDetails = (data) => {
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
            <h6 id="release-text" class="text-center" style="margin-bottom:25px"> ${
              data.releaseDate
                ? data.releaseDate
                : "Release Date : Coming Soon..."
            } <h6>`;
  detailsImage.appendChild(detailsImageDiv);
  const mainDetailsDiv = document.createElement("div");
  mainDetailsDiv.classList.add("detail-box");
  mainDetailsDiv.innerHTML = `
            <h4 class="features-tag">Main Features Of ${data.name}</h4>
            <h6 class="details-tag"><span class="features-tag">Storage : </span>${
              data.mainFeatures.storage
            }</h6>
            <h6 class="details-tag"><span class="features-tag">Display Size : </span>${
              data.mainFeatures.displaySize
            } </h6>
            <h6 class="details-tag"><span class="features-tag">Chipset : </span>${
              data.mainFeatures.chipSet
            }</h6>
            <h6 class="details-tag"><span class="features-tag">Memory : </span>${
              data.mainFeatures.memory
            }</h6>
            <h6 class="details-tag"><span class="features-tag">Sensors : </span>${data.mainFeatures.sensors.join(
              ",\n"
            )}</h6>`;
  mainDetailBox.appendChild(mainDetailsDiv);

  // displaying the other details//
  const otherDetailBox = document.getElementById("other-details");
  clearDetails("other-details");
  if (data.others) {
    otherDetailBox.setAttribute("class", "col-10 col-md-6 mx-auto");
    const otherDetailsDiv = document.createElement("div");
    otherDetailsDiv.classList.add("detail-box");
    otherDetailsDiv.innerHTML = `
          <h4 class="features-tag">Other Features Of ${data.name}</h4>
            <h6 class="details-tag"><span class="features-tag">WLAN :</span> ${data.others.WLAN}</h6>
            <h6 class="details-tag"><span class="features-tag">Bluetooth :</span> ${data.others.Bluetooth} </h6>
            <h6 class="details-tag"><span class="features-tag">GPS :</span> ${data.others.GPS}</h6>
            <h6 class="details-tag"><span class="features-tag">USB :</span> ${data.others.USB}</h6>
            <h6 class="details-tag"><span class="features-tag">Radio :</span> ${data.others.Radio}</h6>
            <h6 class="details-tag"><span class="features-tag">NFC :</span> ${data.others.NFC}</h6>`;
    otherDetailBox.appendChild(otherDetailsDiv);
  } else {
    otherDetailBox.removeAttribute("class");
  }
};
