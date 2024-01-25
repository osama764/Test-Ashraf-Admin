const firebaseConfig = {
  apiKey: "AIzaSyAKTof0tllNs6Jqniou9zaq8baJrJXBCoM",
  authDomain: "ashraf-27e6b.firebaseapp.com",
  projectId: "ashraf-27e6b",
  storageBucket: "ashraf-27e6b.appspot.com",
  messagingSenderId: "14595756122",
  appId: "1:14595756122:web:99e3ba2344567f9ff84863"
};
firebase.initializeApp(firebaseConfig);
// Get a reference to  RealTime Database service
const database = firebase.database();


let addRoom = document.querySelector(".addRoom");
let contentAddRoom = document.querySelector(".contentAddRoom");
let close = document.querySelector(".close");

// button add New Room will appear form to add data of this Room
addRoom.addEventListener("click", (e) => {
  e.preventDefault();
  contentAddRoom.style.transform = "translateX(0vw)";
});

// this button will close form (adding data of Room)
close.addEventListener("click", (e) => {
  e.preventDefault();
  contentAddRoom.style.transform = "translateX(120vw)";
});

// initialization variables to use later
let nameRoom     = document.getElementById("nameRoom");
let imageRoom    = document.getElementById("imageRoom");
let addNewRoom   = document.querySelector(".addNewRoom");
let contentRooms = document.querySelector(".contentRooms");
let body         = document.querySelector("body");

// this button will add New Room in container Rooms after take data of this Room
addNewRoom.addEventListener("click", (e) => {
  e.preventDefault(); // To prevent the page from loading 

  // To ensure that the data is correct
  if (imageRoom.value != "" && nameRoom.value != "") {
    // calling Function add Room in RealTime Database in Firebase
    addNewRoomInFirebase();
    nameRoom.value=""
    imageRoom.value=""
    // close form and browser will speech that Room added 
    contentAddRoom.style.transform = "translateX(120vw)";

  } else {
    // if data of Room can't correct will appear message above form ( color Red )
    let h5 = document.createElement("h5");
    h5.innerHTML = "أدخل البيانات بشكل صحيح";
    h5.classList = "alertMessage";
    contentAddRoom.prepend(h5);

    // Remove message after 3 seconds
    setTimeout(() => {
      let deletAlert = document.querySelector(".alertMessage");
      deletAlert.remove();
    }, 3000);
  }
});




async function addNewRoomInFirebase() {
  // استلام القيم من حقول الإدخال لاسم الغرفة وصورة الغرفة
  const nameRoomValue = nameRoom.value;
  const imageRoomValue = imageRoom.value;

  try {
    const response = await fetch('https://ashraf-27e6b-default-rtdb.firebaseio.com/Rooms.json');
    const responseData = await response.json();

    // حساب الـ index الجديد بناءً على عدد الغرف الموجودة حاليًا
    let index = 0;
    if (responseData) {
      index = Object.keys(responseData).length;
    }

    // إضافة الغرفة الجديدة
    await fetch(`https://ashraf-27e6b-default-rtdb.firebaseio.com/Rooms/${index}.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Name: nameRoomValue,
        image: imageRoomValue,
        devices: [],
        devicesPush: [],
        devicesPushDoor: [],
        devicesPushRemote: [],
        id:JSON.stringify(index)
      }),
    });

    DisplayData();
    console.log('تمت إضافة الغرفة بنجاح');
  } catch (error) {
    console.error('فشل في إضافة الغرفة:', error.message);
  }
}

function DisplayData() {
  // إنشاء طلب HTTP
  const request = new XMLHttpRequest();
  request.open('GET', 'https://ashraf-27e6b-default-rtdb.firebaseio.com/Rooms.json');

  // إرسال الطلب
  request.send();

  // إضافة معالج لاستجابة الطلب
  request.onload = function () {
    if (request.status === 200) {
      // تحويل البيانات إلى كائن JSON
      const data = JSON.parse(request.responseText);
console.log(data)
      // حذف جميع العناصر الحالية
      contentRooms.innerHTML = '';

      Object.values(data).forEach(room => {
        if(room){
          let card = `
          <div class="card border-0 p-3 m-2 text-center" style="background-image: url(../images/${room.image}.jpg);">
           
            <h3 class="mt-3 mb-3 room__title">${room.Name}</h3>
            <button class="btn btn-warning visit">فتح الغرفة</button>
            <span style="opacity: 0">${room.id}</span>
          </div>
        `;
        console.log(room.id)
        contentRooms.innerHTML += card;
        }
    
      });
    } else {
      // رسالة خطأ في حالة فشل الطلب
      alert('حدث خطأ أثناء استرداد بيانات الغرف');
    }
  };
}
// calling function display during loading Page
window.onload = DisplayData();

// this is container for all Rooms
contentRooms.addEventListener("click", (e) => {
  
  // the Element that contains classes : ( card  border-0   p-3 m-2   text-center )


  if (e.target.classList == "btn btn-warning visit") {

    // Fetching room data via this current element on which the event takes place
    const nameImage = e.target.parentElement.style.backgroundImage
    const nameRoom =
    e.target.parentElement.lastElementChild.previousElementSibling.previousElementSibling
    .innerHTML

    // Encrypt the data and send it to the home page in the url
    const encodedImage = encodeURIComponent(nameImage);
    const encodedName = encodeURIComponent(nameRoom);
    // path Home Page
    const url = 
      "ShowMyRooms.html?nameRoom=" +
      encodedName +
      "&nameImage=" +
      encodedImage;
    window.location.href = url;
  }

    // the Element that contains classes : ( fa-solid  fa-xmark  deletbtnThisRoom )
  if (e.target.classList == "fa-solid fa-trash-can deletbtnThisRoom") {
  
    // uid is id that use to delete this Room 
    let uid = e.target.parentElement.lastElementChild.innerHTML
    // passing uid in function to delete this Room

    deleteRoom(uid)
  

   }




})


let selectImage = document.querySelector(".select");
let closeImages = document.querySelector("#closeImages");

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
for (let i = 1; i <= 6; i++) {
  let newImage = `
<div class="cardImage">
<img src="../images/${i}.jpg" alt="">
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
      imageRoom.value = span.textContent;
      containerImage.style.transform = " scale(0)";
    }
  });
});







function deleteRoom(roomKey) {
  // إنشاء طلب HTTP
  const request = new XMLHttpRequest();
  request.open('DELETE', `https://ashraf-27e6b-default-rtdb.firebaseio.com/Rooms/${roomKey}.json`);

  // إرسال الطلب
  request.send();

  // إضافة معالج لاستجابة الطلب
  request.onload = function () {
    if (request.status === 200) {
      // تم حذف الغرفة بنجاح
      console.log('تم حذف الغرفة بنجاح');
      DisplayData()
      // يمكنك إجراء أي إجراءات إضافية هنا بعد حذف الغرفة بنجاح
    } else {
      // حدث خطأ أثناء حذف الغرفة
      console.error('حدث خطأ أثناء حذف الغرفة');
    }
  };
}

let setting = document.querySelector(".setting")
let updateSetting = document.querySelector(".updateSetting")
let closeSetting = document.querySelector(".closeSetting")
let inputuserNameWifi = document.getElementById("inputuserNameWifi")
let inputPasswordWifi = document.getElementById("inputPasswordWifi")
let updateData = document.querySelector(".updateData")
let saveData = document.querySelector(".saveData")

setting.addEventListener("click", () => {
  updateSetting.style.top = "0";

  const userCurrent = firebase.auth().currentUser;
  if (userCurrent) {
    const uid = userCurrent.uid;

    firebase
      .database()
      .ref('users/' + uid)
      .once('value')
      .then((snapshot) => {
        const data = snapshot.val();

        const nameUser = data.usernamewifi;
        const passUser = data.passwordwifi;

        inputuserNameWifi.value = nameUser;
        inputPasswordWifi.value = passUser;
      });
  }
});

updateData.addEventListener("click",()=>{
  inputuserNameWifi.value=""
  inputPasswordWifi.value=""
  inputuserNameWifi.focus()
})

saveData.addEventListener("click",()=>{
  const userCurrent = firebase.auth().currentUser;

  if (userCurrent) {
    const uid = userCurrent.uid;

    const nameUser = inputuserNameWifi.value;
    const passUser = inputPasswordWifi.value;

    const userRef = firebase.database().ref('users/' + uid);
    userRef.update({
      usernamewifi: nameUser,
      passwordwifi: passUser
    })
    .then(() => {
      console.log("تم تحديث البيانات بنجاح");
      inputuserNameWifi.value=""
      inputPasswordWifi.value=""
    })
    .catch((error) => {
      console.log("حدث خطأ أثناء تحديث البيانات:", error);
    });
  }
})

closeSetting.addEventListener("click",()=>{
  updateSetting.style.top="-80%"
})


