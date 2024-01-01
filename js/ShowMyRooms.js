const firebaseConfig = {
  apiKey: "AIzaSyAKTof0tllNs6Jqniou9zaq8baJrJXBCoM",
  authDomain: "ashraf-27e6b.firebaseapp.com",
  projectId: "ashraf-27e6b",
  storageBucket: "ashraf-27e6b.appspot.com",
  messagingSenderId: "14595756122",
  appId: "1:14595756122:web:99e3ba2344567f9ff84863",
};
firebase.initializeApp(firebaseConfig);
// Get a reference to  RealTime Database service
const database = firebase.database();

let description = document.querySelector(".description");

let currentName;
let currentImage;
// Retrieve data from the URL
const urlParams = new URLSearchParams(window.location.search);
//Check for data in URL
if (urlParams.has("nameRoom") && urlParams.has("nameImage")) {
  currentName = decodeURIComponent(urlParams.get("nameRoom"));
  currentImage = decodeURIComponent(urlParams.get("nameImage"));

  //Display data on the page
  document.querySelector(".nameCurrentRoom").innerHTML += currentName;
  description.style.backgroundImage = currentImage;
} else {
  console.log("No user data found in URL");
}

let devices = document.querySelector(".devices");
let devicesPush = document.querySelector(".devicesPush");
let devicesPushDoor = document.querySelector(".devicesPushDoor");
let devicesPushRemote = document.querySelector(".devicesPushRemote");
let choosePush = document.querySelector(".choose-Push");
let containPushButtons = document.getElementById("containPushButtons");
let NameOfDevice = document.querySelector(".NameOfDevice");
let contentDevices = document.querySelector(".contentDevices");
let addDevice = document.querySelector(".addDevice");
let closecontentdevices = document.querySelector(".closecontentdevices");
let addNewDevice = document.querySelector(".addNewDevice");
let body = document.querySelector("body");
let modal = document.querySelector("modal");

let parentselectImage = document.querySelector(".parentselectImage");
let selectImg = document.getElementById("selectImg"); // input
let selectImage = document.querySelector(".selectImage"); // button
let closeImages = document.querySelector("#closeImages"); //close

// button open Form add New Device in this Room
addDevice.addEventListener("click", () => {
  contentDevices.style.transform = "scale(1)";
});

// button close Form
closecontentdevices.addEventListener("click", () => {
  contentDevices.style.transform = "scale(0)";
});

let DifferentDevice = document.getElementById("DifferentDevice");
let addDefferentDevice = document.querySelector(".addDefferentDevice");
let checkPushDoor = document.querySelector("#checkPushDoor");
let checkPush = document.querySelector("#checkPush");
let checkRemote = document.querySelector("#checkRemote");

addDefferentDevice.addEventListener("click", () => {
  // close form after adding new device
  contentDevices.style.transform = "scale(0)";

  // Call data from realtime
  let roomsRef = firebase.database().ref("Rooms");
  // if checkbox not Checked ====> : Normal device without bushing
  if (DifferentDevice.value != "" && selectImg.value !="")  {
    if (!containPushButtons.checked) {
      roomsRef
        .orderByChild("Name")
        .equalTo(currentName)
        .once("value")
        .then((snapshot) => {
          snapshot.forEach((childSnapshot) => {
            const devicesArray = childSnapshot.val().devices || [];
            const newDevice = {
              Name: DifferentDevice.value,
              status: 0,
              nameImage: selectImg.value,
              type:""
            };
            const deviceExists = devicesArray.some(
              (device) => device.Name === newDevice.Name
            );
            if (deviceExists) {
              alert("This device already exists");
            } else {
              devicesArray.push(newDevice);
              childSnapshot.ref.update({ devices: devicesArray }).then(() => {
                console.log("تم إضافة الجهاز بنجاح!");
                DifferentDevice.value = "";
                selectImg.value = "";
              });
            }
          });
        })
        .catch((error) => {
          console.error("حدث خطأ أثناء إضافة الجهاز الجديد:", error);
        });
    } else {
      if (checkPush.checked) {
        roomsRef
          .orderByChild("Name")
          .equalTo(currentName)
          .once("value")
          .then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
              const devicesArray = childSnapshot.val().devicesPush || [];
              const newDevice = {
                Name: "Push" + DifferentDevice.value,
                status: 0,
              };
              const deviceExists = devicesArray.some(
                (device) => device.Name === newDevice.Name
              );
              if (deviceExists) {
                alert("This device already exists");
              } else {
                devicesArray.push(newDevice);
                childSnapshot.ref
                  .update({ devicesPush: devicesArray })
                  .then(() => {
                    console.log("تم إضافة الجهاز بنجاح!");
                    DifferentDevice.value = "";
                  });
              }
            });
          })
          .catch((error) => {
            console.error("حدث خطأ أثناء إضافة الجهاز الجديد:", error);
          });
      }
      if (checkPushDoor.checked) {
        roomsRef
          .orderByChild("Name")
          .equalTo(currentName)
          .once("value")
          .then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
              const devicesArray = childSnapshot.val().devicesPushDoor || [];
              const newDevice = {
                Name: "Push" + DifferentDevice.value,
                status: 0,
              };
              const deviceExists = devicesArray.some(
                (device) => device.Name === newDevice.Name
              );
              if (deviceExists) {
                alert("This device already exists");
              } else {
                devicesArray.push(newDevice);
                childSnapshot.ref
                  .update({ devicesPushDoor: devicesArray })
                  .then(() => {
                    console.log("تم إضافة الجهاز بنجاح!");
                    DifferentDevice.value = "";
                  });
              }
            });
          })
          .catch((error) => {
            console.error("حدث خطأ أثناء إضافة الجهاز الجديد:", error);
          });
      }
      if (checkRemote.checked) {
        roomsRef
          .orderByChild("Name")
          .equalTo(currentName)
          .once("value")
          .then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
              const devicesArray = childSnapshot.val().devicesPushRemote || [];
              const newDevice = {
                Name: "Push" + DifferentDevice.value,
                status_on_off: 0,
                status_mute: 0,
                status_up: 0,
                status_down: 0,
                status_right: 0,
                status_left: 0,
                status_play: 0,
                status_low: 0,
                status_high: 0,
                status_rotate: 0,
                status_arrow: 0,
              };
              const deviceExists = devicesArray.some(
                (device) => device.Name === newDevice.Name
              );
              if (deviceExists) {
                alert("This device already exists");
              } else {
                devicesArray.push(newDevice);
                childSnapshot.ref
                  .update({ devicesPushRemote: devicesArray })
                  .then(() => {
                    console.log("تم إضافة الجهاز بنجاح!");
                    DifferentDevice.value = "";
                  });
              }
            });
          })
          .catch((error) => {
            console.error("حدث خطأ أثناء إضافة الجهاز الجديد:", error);
          });
      }
    }
  } else {
    alert(" Name of Device and Image of Device required !!!!");
  }
});

// containPushButtons.addEventListener("change", () => {
//   if (containPushButtons.checked) {
//     parentselectImage.style.opacity = "0";
//     choosePush.style.display = "block";
//   } else {
//     parentselectImage.style.opacity = "1";
//     choosePush.style.display = "none";
//   }
// });


// initialization of two variables to store index and name of device
let index;
let newNameOfDevice;

// container all Devices
devices.addEventListener("click", (e) => {
  // index and uid :==> (id) and name of current Device to use later during updating
  let uid = e.target.parentElement.parentElement.lastElementChild.innerHTML;

  // uid and index for this current element
  uid = e.target.parentElement.lastElementChild.innerHTML;
  index = e.target.parentElement.firstElementChild.innerHTML;
  // the Element that contains classes : ( fa-solid fa-xmark deletbtnDevice notPushDevice ) will be deleted
  if (e.target.classList == "fa-solid fa-trash-can deletbtnDevice") {
    if (confirm("Confirm Delete")) {
      deleteDevice(uid, index, "devices");
    } else {
      alert("Delete Cancel");
    }
  }
  if (e.target.classList == "fa-solid fa-trash-can deletbtnDevice pushbtn") {
    if (confirm("Confirm Delete")) {
      deleteDevice(uid, index, "devicesPush");
    } else {
      alert("Delete Cancel");
    }
  }
});

devicesPush.addEventListener("click", (e) => {
  // index and uid :==> (id) and name of current Device to use later during updating
  let uid = e.target.parentElement.parentElement.lastElementChild.innerHTML;

  // uid and index for this current element
  uid = e.target.parentElement.lastElementChild.innerHTML;
  index = e.target.parentElement.firstElementChild.innerHTML;
  // the Element that contains classes : ( fa-solid fa-xmark deletbtnDevice notPushDevice ) will be deleted
  if (e.target.classList == "fa-solid fa-trash-can deletbtnDevice") {
    if (confirm("Confirm Delete")) {
      deleteDevice(uid, index, "devices");
    } else {
      alert("Delete Cancel");
    }
  }
  if (e.target.classList == "fa-solid fa-trash-can deletbtnDevice pushbtn") {
    if (confirm("Confirm Delete")) {
      deleteDevice(uid, index, "devicesPush");
    } else {
      alert("Delete Cancel");
    }
  }
});

// function delete device using index and uid
function deleteDevice(uid, index, NameOfArray) {
  $.ajax({
    url: `https://ashraf-27e6b-default-rtdb.firebaseio.com/Rooms/${uid}/${NameOfArray}/${index}.json`,
    method: "DELETE",
    success: function () {
      alert("Device deleted successfully");
    },
    error: function () {
      alert("Failed to delete Device");
    },
  });
}

// button select image
selectImage.addEventListener("click", function (e) {
  e.preventDefault();
  containerImage.style.transform = " scale(1)";
});

// close list of Images
closeImages.addEventListener("click", function (e) {
  e.preventDefault();
  containerImage.style.transform = " scale(0)";
});

let containerSelectionImages = document.querySelector(
  ".containerSelectionImages"
);

// for loop ( 12 image ) : 12 is not fixed, it changes according to the number of images
for (let i = 1; i <= 24; i++) {
  let newImage = `
<div class="cardImage">
<img src="../imagesDevices/${i}.jpg" alt="">
<span>${i}</span>
</div>
`;
  containerSelectionImages.innerHTML += newImage;
}

const images = document.querySelectorAll(".cardImage img");

// in click any image will take name for this image and close List of Images
images.forEach(function (image) {
  image.addEventListener("click", function (event) {
    if (event.target.tagName.toLowerCase() === "img") {
      const card = event.target.closest(".cardImage");
      const span = card.querySelector("span");
      selectImg.value = span.textContent;
      containerImage.style.transform = " scale(0)";
    }
  });
});



