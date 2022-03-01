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
  console.log(phones);
  const errorMessage = document.getElementById("error-message");
  const totalCount = document.getElementById("total-count");
  const phoneList = document.getElementById("phone-lists");
  if (phones.length == 0) {
    errorMessage.style.display = "block";
    clearDetails("details");
    clearDetails("phone-lists");
    clearDetails("total-count");
  } else {
    errorMessage.style.display = "none";
    clearDetails("phone-lists");
    if (phones.length > 20) {
      const showMoreButton = document.getElementById("show-more-phones");
      showMoreButton.style.display = "block";
    }
    totalCount.textContent = `Showing ${phones.length} results`;
    phones.slice(0, 20).forEach((phone) => {
      const div = document.createElement("div");
      div.innerHTML = `
       <div class="col">
         <div class="card h-100">
             <div class="d-flex" >
               <div class="card-img-div" style="height: 200px">
                  <img src="${phone.image}" class="card-img-top" alt="" />
               </div>
                <div>
                  <div class="card-body">
                    <h5 class="card-title">Name: ${phone.phone_name}</h5>
                    <h6 class="card-text">Brand: ${phone.brand}</h6>
                    <h6 class="card-text">Release Date: </h6>
                  <div class="phone-button text-center">
                    <a href="#" onclick="loadDetails('${phone.slug}')" class="btn btn-primary"> Show More Details </a>
                  </div>
                </div>
              </div>
          </div>
        </div>`;
      phoneList.appendChild(div);
    });
  }
};
// };
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
