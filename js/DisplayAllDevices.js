

function DisplayDevices() {
  const roomsRef = firebase.database().ref("Rooms");
  roomsRef
    .orderByChild("Name")
    .equalTo(currentName)
    .on(
      "value",
      (snapshot) => {
        devices.innerHTML = "";
        snapshot.forEach((childSnapshot) => {
          devices.innerHTML = "";

          const devicesArray = childSnapshot.val().devices || [];
          devicesArray.forEach((device, i) => {
            let iconColor = device.status == "1" ? "#32e072" : "red";

            let card = `<div class="card border-0 p-2 cardBtn">
            <span style="opacity:0">${i}</span>
            <p class="nameOfDevice">${device.Name}</p>
            <img src="../imagesDevices/${device.nameImage}.jpg" alt="">
          
            <div class="container">
              <i class="fa-solid fa-power-off" style="color: ${iconColor}" data-room-key="${childSnapshot.key}" data-device-index="${i}"></i>
              <span style="opacity:0">${device.Name}</span>
            </div>
      
            <span style="opacity:0">${childSnapshot.key}</span>
          </div>`;
            devices.innerHTML += card;
          });
        });

        // Attach click event listeners to the power icons
        let powerIcons = devices.querySelectorAll(".fa-power-off");
        powerIcons.forEach((icon) => {
          icon.addEventListener("click", () => {
            const roomKey = icon.dataset.roomKey;
            const deviceIndex = icon.dataset.deviceIndex;
            const newStatus = icon.style.color == "red" ? "1" : "0";

            // Get the devices array for the current room
            const devicesArray = snapshot.child(roomKey).val().devices || [];

            // Check if the deviceIndex is within the valid range
            if (deviceIndex >= 0 && deviceIndex < devicesArray.length) {
              // Get the name of the device
              const deviceName = devicesArray[deviceIndex].Name;
              const imageName = devicesArray[deviceIndex].nameImage;
              const typeCurrent = devicesArray[deviceIndex].type;

              const newtype=typeCurrent
              const newImage = imageName;
              const newName = deviceName;
              const nameOfArray = "devices";

              updateStateDevice(
                roomKey,
                deviceIndex,
                newStatus,
                newName,
                nameOfArray,
                newImage,
                newtype
              );
            }
          });
        });
      },
      (error) => {
        console.error("حدث خطأ أثناء قراءة الأجهزة:", error);
      }
    );
}

function DisplayPushDevicesDoor() {
  const roomsRef = firebase.database().ref("Rooms");
  roomsRef
    .orderByChild("Name")
    .equalTo(currentName)
    .on(
      "value",
      (snapshot) => {
        devicesPushDoor.innerHTML = "";
        snapshot.forEach((childSnapshot) => {
          devicesPushDoor.innerHTML = "";
          const devicesArray = childSnapshot.val().devicesPushDoor || [];
          devicesArray.forEach((device, i) => {
            let iconColorPush = device.status == "1" ? "#32e072" : "red";

            let card = `<div class="card border-0 p-2">
            <span style="opacity:0">${i}</span>
            <img src="../imagesDevices/${device.nameImage}.jpg" alt="">
            <p class="nameOfDevice">${device.Name}</p>
           
            <div class="container">
              <i class="fa-solid fa-power-off" style="color: ${iconColorPush}" data-room-key="${childSnapshot.key}" data-device-index="${i}"></i>
            </div>

            <span style="opacity:0">${childSnapshot.key}</span>
          </div>`;
            devicesPushDoor.innerHTML += card;
          });
        });

        // Attach click event listeners to the power-off icons
        let powerOffIcons = devicesPushDoor.querySelectorAll(".fa-power-off");
        powerOffIcons.forEach((icon) => {
          icon.addEventListener("mousedown", () => {
            const roomKey = icon.dataset.roomKey;
            const deviceIndex = icon.dataset.deviceIndex;

            // Get the devices array for the current room
            const devicesArray =
              snapshot.child(roomKey).val().devicesPushDoor || [];

            // Check if the deviceIndex is within the valid range
            if (deviceIndex >= 0 && deviceIndex < devicesArray.length) {
              // Get the name of the device
              const deviceName = devicesArray[deviceIndex].Name;
              const imageName = devicesArray[deviceIndex].nameImage;
              const newImage = imageName;
              const newName = deviceName;
              const nameOfArray = "devicesPushDoor";

              updateStateDevice(
                roomKey,
                deviceIndex,
                "1",
                newName,
                nameOfArray,
                newImage
              );
            }
          });

          icon.addEventListener("touchstart", () => {
            const roomKey = icon.dataset.roomKey;
            const deviceIndex = icon.dataset.deviceIndex;

            // Get the devices array for the current room
            const devicesArray =
              snapshot.child(roomKey).val().devicesPushDoor || [];

            // Check if the deviceIndex is within the valid range
            if (deviceIndex >= 0 && deviceIndex < devicesArray.length) {
              // Get the name of the device
              const deviceName = devicesArray[deviceIndex].Name;
              const imageName = devicesArray[deviceIndex].nameImage;
              const newImage = imageName;
              const newName = deviceName;
              const nameOfArray = "devicesPushDoor";

              updateStateDevice(
                roomKey,
                deviceIndex,
                "1",
                newName,
                nameOfArray,
                newImage
              );
            }
          });

          icon.addEventListener("mouseup", () => {
            const roomKey = icon.dataset.roomKey;
            const deviceIndex = icon.dataset.deviceIndex;

            // Get the devices array for the current room
            const devicesArray =
              snapshot.child(roomKey).val().devicesPushDoor || [];

            // Check if the deviceIndex is within the valid range
            if (deviceIndex >= 0 && deviceIndex < devicesArray.length) {
              // Get the name of the device
              const deviceName = devicesArray[deviceIndex].Name;
              const imageName = devicesArray[deviceIndex].nameImage;
              const newImage = imageName;
              const newName = deviceName;
              const nameOfArray = "devicesPushDoor";

              updateStateDevice(
                roomKey,
                deviceIndex,
                "0",
                newName,
                nameOfArray,
                newImage
              );
            }
          });

          icon.addEventListener("touchend", () => {
            const roomKey = icon.dataset.roomKey;
            const deviceIndex = icon.dataset.deviceIndex;

            // Get the devices array for the current room
            const devicesArray =
              snapshot.child(roomKey).val().devicesPushDoor || [];

            // Check if the deviceIndex is within the valid range
            if (deviceIndex >= 0 && deviceIndex < devicesArray.length) {
              // Get the name of the device
              const deviceName = devicesArray[deviceIndex].Name;
              const imageName = devicesArray[deviceIndex].nameImage;
              const newImage = imageName;
              const newName = deviceName;
              const nameOfArray = "devicesPushDoor";

              updateStateDevice(
                roomKey,
                deviceIndex,
                "0",
                newName,
                nameOfArray,
                newImage
              );
            }
          });
        });
      },
      (error) => {
        console.error("حدث خطأ أثناء قراءة الأجهزة:", error);
      }
    );
}

function DisplayPushDevices() {
  const roomsRef = firebase.database().ref("Rooms");
  roomsRef
    .orderByChild("Name")
    .equalTo(currentName)
    .on(
      "value",
      (snapshot) => {
        devicesPush.innerHTML = "";
        snapshot.forEach((childSnapshot) => {
          devicesPush.innerHTML = "";
          const devicesArray = childSnapshot.val().devicesPush || [];
          devicesArray.forEach((device, i) => {
            let iconColorPush = device.status == "1" ? "#32e072" : "red";

            let card = `<div class="card border-0 p-2">
            <span style="opacity:0">${i}</span>
          
            <p class="nameOfDevice">${device.Name}</p>
       
            <div class="container">
              <i class="fa-solid fa-power-off" style="color: ${iconColorPush}" data-room-key="${childSnapshot.key}" data-device-index="${i}"></i>
            </div>

            <span style="opacity:0">${childSnapshot.key}</span>
          </div>`;
            devicesPush.innerHTML += card;
          });
        });

        // Attach click event listeners to the power-off icons
        let powerOffIcons = devicesPush.querySelectorAll(".fa-power-off");
        powerOffIcons.forEach((icon) => {
          icon.addEventListener("mousedown", () => {
            const roomKey = icon.dataset.roomKey;
            const deviceIndex = icon.dataset.deviceIndex;

            // Get the devices array for the current room
            const devicesArray =
              snapshot.child(roomKey).val().devicesPush || [];

            // Check if the deviceIndex is within the valid range
            if (deviceIndex >= 0 && deviceIndex < devicesArray.length) {
              // Get the name of the device
              const deviceName = devicesArray[deviceIndex].Name;
              const imageName = devicesArray[deviceIndex].nameImage;
              const newImage = imageName;
              const newName = deviceName;
              const nameOfArray = "devicesPush";

              updateStateDevice(
                roomKey,
                deviceIndex,
                "1",
                newName,
                nameOfArray,
                newImage
              );
            }
          });

          icon.addEventListener("touchstart", () => {
            const roomKey = icon.dataset.roomKey;
            const deviceIndex = icon.dataset.deviceIndex;

            // Get the devices array for the current room
            const devicesArray =
              snapshot.child(roomKey).val().devicesPush || [];

            // Check if the deviceIndex is within the valid range
            if (deviceIndex >= 0 && deviceIndex < devicesArray.length) {
              // Get the name of the device
              const deviceName = devicesArray[deviceIndex].Name;
              const imageName = devicesArray[deviceIndex].nameImage;
              const newImage = imageName;
              const newName = deviceName;
              const nameOfArray = "devicesPush";

              updateStateDevice(
                roomKey,
                deviceIndex,
                "1",
                newName,
                nameOfArray,
                newImage
              );
            }
          });

          icon.addEventListener("mouseup", () => {
            const roomKey = icon.dataset.roomKey;
            const deviceIndex = icon.dataset.deviceIndex;

            // Get the devices array for the current room
            const devicesArray =
              snapshot.child(roomKey).val().devicesPush || [];

            // Check if the deviceIndex is within the valid range
            if (deviceIndex >= 0 && deviceIndex < devicesArray.length) {
              // Get the name of the device
              const deviceName = devicesArray[deviceIndex].Name;
              const imageName = devicesArray[deviceIndex].nameImage;
              const newImage = imageName;
              const newName = deviceName;
              const nameOfArray = "devicesPush";

              updateStateDevice(
                roomKey,
                deviceIndex,
                "0",
                newName,
                nameOfArray,
                newImage
              );
            }
          });

          icon.addEventListener("touchend", () => {
            const roomKey = icon.dataset.roomKey;
            const deviceIndex = icon.dataset.deviceIndex;

            // Get the devices array for the current room
            const devicesArray =
              snapshot.child(roomKey).val().devicesPush || [];

            // Check if the deviceIndex is within the valid range
            if (deviceIndex >= 0 && deviceIndex < devicesArray.length) {
              // Get the name of the device
              const deviceName = devicesArray[deviceIndex].Name;
              const imageName = devicesArray[deviceIndex].nameImage;
              const newImage = imageName;
              const newName = deviceName;
              const nameOfArray = "devicesPush";

              updateStateDevice(
                roomKey,
                deviceIndex,
                "0",
                newName,
                nameOfArray,
                newImage
              );
            }
          });
        });
      },
      (error) => {
        console.error("حدث خطأ أثناء قراءة الأجهزة:", error);
      }
    );
}



function DisplayDevicesPushRemote() {
  const roomsRef = firebase.database().ref("Rooms");
  roomsRef
    .orderByChild("Name")
    .equalTo(currentName)
    .on(
      "value",
      (snapshot) => {
        devicesPushRemote.innerHTML = "";
        snapshot.forEach((childSnapshot) => {
          devicesPushRemote.innerHTML = "";
          const devicesArray = childSnapshot.val().devicesPushRemote || [];
          devicesArray.forEach((device, i) => {
            let powerIcon = `<i class="fa-solid fa-power-off" style="color: ${
              device.status_on_off == "1" ? "#32e072" : "red"
            }"></i>`;

            let volumeIcon = `<i class="fa-solid fa-volume-xmark" style="color: ${
              device.status_mute == "1" ? "#32e072" : "red"
            }"></i>`;
            let upIcon = `<i class="fa-solid fa-caret-up" style="color:${
              device.status_up == "1" ? "#32e072" : "red"
            }"></i>`;
            let downIcon = `<i class="fa-solid fa-caret-down" style="color: ${
              device.status_down == "1" ? "#32e072" : "red"
            }"></i>`;
            let PlayIcon = `<i class="fa-solid fa-circle-play" style="color: ${
              device.status_play == "1" ? "#32e072" : "red"
            }"></i>`;

            let LowIcon = `<i class="fa-solid fa-volume-low" style="color: ${
              device.status_low == "1" ? "#32e072" : "red"
            }"></i>`;
            let HighIcon = `<i class="fa-solid fa-volume-high" style="color: ${
              device.status_high == "1" ? "#32e072" : "red"
            }"></i>`;
            let RotateIcon = `<i class="fa-solid fa-rotate-left" style="color: ${
              device.status_rotate == "1" ? "#32e072" : "red"
            }"></i>`;
            let ArrowIcon = `<i class="fa-solid fa-right-left" style="color: ${
              device.status_arrow == "1" ? "#32e072" : "red"
            }"></i>`;

            let leftIcon = `<i class="fa-solid fa-caret-left" style="color: ${
              device.status_left == "1" ? "#32e072" : "red"
            }"></i>`;

            let rightIcon = `<i class="fa-solid fa-caret-right" style="color: ${
              device.status_right == "1" ? "#32e072" : "red"
            }"></i>`;

            let card = `<div class="card border-0 p-2">
            
            ${powerIcon}
            <div class="container">
              <img src="../imagesDevices/images.jpg" alt="">
              ${upIcon}
              ${downIcon}
              ${rightIcon}
              ${leftIcon}
              ${PlayIcon}
          
            </div>
            ${RotateIcon}
            ${ArrowIcon}
            ${LowIcon}
            ${HighIcon}
            ${volumeIcon}
          </div>`;

            devicesPushRemote.innerHTML += card;

            // Attach click event listeners for icons
            let icons = devicesPushRemote.querySelectorAll(
              `.fa-power-off, .fa-volume-xmark, .fa-caret-up, .fa-caret-down, .fa-caret-right, .fa-caret-left ,.fa-circle-play,.fa-rotate-left,.fa-right-left,.fa-volume-high,.fa-volume-low`
            );

            icons.forEach((icon, index) => {

                icon.addEventListener("mousedown", () => {
                  const statusType = getStatusType(index);
                  const newStatus = "1";
                  updateDeviceStatusRemote(
                    childSnapshot.key,
                    i,
                    statusType,
                    newStatus
                  );
                });

                icon.addEventListener("mouseup", () => {
                  const statusType = getStatusType(index);
                  const newStatus = "0";
                  updateDeviceStatusRemote(
                    childSnapshot.key,
                    i,
                    statusType,
                    newStatus
                  );
                });

                //************  mobile Events ************//

                icon.addEventListener("touchstart", () => {
                  const statusType = getStatusType(index);
                  const newStatus = "1";
                  updateDeviceStatusRemote(
                    childSnapshot.key,
                    i,
                    statusType,
                    newStatus
                  );
                });

                icon.addEventListener("touchend", () => {
                  const statusType = getStatusType(index);
                  const newStatus = "0";
                  updateDeviceStatusRemote(
                    childSnapshot.key,
                    i,
                    statusType,
                    newStatus
                  );
                });
              
      
            });
          });
        });
      },
      (error) => {
        console.error("حدث خطأ أثناء قراءة الأجهزة:", error);
      }
    );
}

function getStatusType(index) {
  switch (index) {
    case 0:
      return "status_on_off";
    case 1:
      return "status_up";
    case 2:
      return "status_down";
    case 3:
      return "status_right";
    case 4:
      return "status_left";
    case 5:
      return "status_play";
    case 6:
      return "status_rotate";
    case 7:
      return "status_arrow";
    case 8:
      return "status_low";
    case 9:
      return "status_high";
    case 10:
      return "status_mute";

    default:
      return "";
  }
}

function updateDeviceStatusRemote(roomKey, deviceIndex, statusType, newStatus) {
  // Update status in Firebase
  const updates = {};
  updates[`Rooms/${roomKey}/devicesPushRemote/${deviceIndex}/${statusType}`] =
    newStatus;
  firebase.database().ref().update(updates);
}

function updateStateDevice(
  uid,
  index,
  currentStatus,
  NewName,
  NameOfArray,
  newImage,
  newType
) {
  var data = {
    status: currentStatus,
    Name: NewName,
    nameImage: newImage,
    type:newType
  };

  $.ajax({
    url: `https://ashraf-27e6b-default-rtdb.firebaseio.com/Rooms/${uid}/${NameOfArray}/${index}.json`,
    method: "PUT",
    data: JSON.stringify(data),
    contentType: "application/json; charset=UTF-8",
    dataType: "json",
    success: function () {
      // Hide the clicked button
      const button = devices.querySelector(
        `[data-room-key="${uid}"][data-device-index="${index}"]`
      );
      // button.classList.add("hidden");
    },
    error: function () {
      console.error("حدث خطأ أثناء تحديث حالة الجهاز.");
    },
  });
}


