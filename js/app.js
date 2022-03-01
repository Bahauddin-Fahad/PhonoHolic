const clearDetails = (id) => {
  const element = document.getElementById(id);
  element.textContent = "";
};

// Getting the search Text //
const searchValue = () => {
  const searchField = document.getElementById("search-button");
  const searchFieldValue = searchField.value;
  const url = `https://openapi.programming-hero.com/api/phones?search=${searchFieldValue}`;
  fetch(url)
    .then((res) => res.json())
    .then((phones) => displayPhone(phones.data));
  clearDetails("main-details");
  clearDetails("other-details");
  // console.log(searchField.value);
  searchField.value = "";
};

// Displaying the Phone List
const displayPhone = (phones) => {
  // console.log(phones);
  const errorMessage = document.getElementById("error-message");
  const totalCount = document.getElementById("total-count");
  const showMoreButton = document.getElementById("show-more-phones");
  if (phones.length == 0) {
    errorMessage.style.display = "block";
    clearDetails("phone-details");
    clearDetails("phone-lists");
    clearDetails("total-count");
    showMoreButton.style.display = "none";
  } else {
    errorMessage.style.display = "none";
    totalCount.textContent = `Showing ${phones.length} results`;
    clearDetails("phone-lists");
    if (phones.length < 20) {
      showMoreButton.style.display = "none";
      showResults(phones);
    } else if (phones.length > 20) {
      showMoreButton.style.display = "block";
      const phoneList = phones.slice(0, 20);
      showResults(phoneList);
      document
        .getElementById("show-more-phones")
        .addEventListener("click", function () {
          showMoreButton.style.display = "none";
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
       <div class="col">
          <div class="card h-100">
            <div
              class="d-flex flex-column justify-content-center"
              style="padding: 20px"
            >
              <div class="mx-auto">
                <img src="${phone.image}" class="" alt="" />
              </div>
              <div class="card-body text-center">
                <h5 class="card-title"> ${phone.phone_name}</h5>
                <h6 class="card-text">${phone.brand}</h6>
              </div>
              <div class="text-center">
               <a href="#" onclick="loadDetails('${phone.slug}')" class="btn btn-primary"> Show More Details </a>
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
  console.log(data);
  const mainDetailBox = document.getElementById("main-details");
  clearDetails("main-details");
  const mainDetailsDiv = document.createElement("div");
  mainDetailsDiv.classList.add("detail-box");
  mainDetailsDiv.innerHTML = `
   <h5>Main Features of ${data.name}</h5>
            <h6>Storage: ${data.mainFeatures.storage}</h6>
            <h6>Display Size: ${data.mainFeatures.displaySize} </h6>
            <h6>Chipset:  ${data.mainFeatures.chipSet}</h6>
            <h6>Memory:  ${data.mainFeatures.memory}</h6>
            <h6>Sensors:  ${data.mainFeatures.sensors}</h6>`;
  mainDetailBox.appendChild(mainDetailsDiv);

  // displaying the other details//
  const otherDetailBox = document.getElementById("other-details");
  clearDetails("other-details");
  if (data.others) {
    otherDetailBox.setAttribute("class", "col-6 mx-auto");
    const otherDetailsDiv = document.createElement("div");
    otherDetailsDiv.classList.add("detail-box");
    otherDetailsDiv.innerHTML = `
   <h5>Other Features Of ${data.name}</h5>
            <h6>WLAN: ${data.others.WLAN}</h6>
            <h6>Bluetooth: ${data.others.Bluetooth} </h6>
            <h6>GPS: ${data.others.GPS}</h6>
            <h6>USB: ${data.others.USB}</h6>
            <h6>Radio: ${data.others.Radio}</h6>
            <h6>NFC: ${data.others.NFC}</h6>`;
    otherDetailBox.appendChild(otherDetailsDiv);
  } else {
    otherDetailBox.removeAttribute("class");
  }
};
