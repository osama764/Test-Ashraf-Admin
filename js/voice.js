// ******************* Voice **************************//

const CloseAllDevices = document.querySelector('.closeAll');

CloseAllDevices.addEventListener("click", () => {
  updateAllDevicesStatus(0);
});

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'ar-EG';

let isRecording = false;
let recordedChunks = [];

function separateCamelCase(input) {
  // استبدال حروف الكبيرة بمسافة والحفاظ على الحروف الصغيرة
  return input.replace(/([a-zA-Z])([؀-ۿ])/g, '$1 $2');
}

recognition.onresult = async function (event) {
  const speechResult = event.results[0][0].transcript;
  console.log(speechResult);
  recordedChunks.push(speechResult);
  const words = speechResult.split(" ");

  if (words[0] == "اقفل" && words[1] == "الاضاءه") {
    changeStatusByTypeOfDevices("light", 0);
  }

  if (words[0] == "افتح" && words[1] == "الاضاءه") {
    changeStatusByTypeOfDevices("light", 1);
  }

  if (words[0] == "اقفل" && words[1] == "ساوند") {
    changeStatusByTypeOfDevices("sound", 0);
  }

  if (words[0] == "افتح" && words[1] == "ساوند") {
    changeStatusByTypeOfDevices("sound", 1);
  }

  if (words[0] == "اقفل" && words[1] == "الجميع") {
    
      updateAllDevicesStatus(0);

  }

  if (words[0] == "افتح" && words[1] == "الجميع") {

      updateAllDevicesStatus(1);
  
  }

  if (words[0] == "افتح" || words[0] == "اقفل") {
    // استخدام separateCamelCase لفصل الكلمات الكبيرة بين الكلمات
    let deviceName = separateCamelCase(words.slice(1).join(' '));

    if (deviceName.includes("واحده")) {
      deviceName = deviceName.replace("واحده", "واحد");
    }else if(deviceName.includes("2")){
      deviceName = deviceName.replace("2", "اتنين");
    }else if(deviceName.includes("3")){
      deviceName = deviceName.replace("3", "تلاتة");
    }else if(deviceName.includes("4")){
      deviceName = deviceName.replace("4", "اربعة");
    }else if(deviceName.includes("5")){
      deviceName = deviceName.replace("5", "خمسة");
    }else if(deviceName.includes("6")){
      deviceName = deviceName.replace("6", "ستة");
    }else if(deviceName.includes("7")){
      deviceName = deviceName.replace("7", "سبعة");
    }else if(deviceName.includes("8")){
      deviceName = deviceName.replace("8", "تمانية");
    }else if(deviceName.includes("9")){
      deviceName = deviceName.replace("9", "تسعة");
    }else if(deviceName.includes("10")){
      deviceName = deviceName.replace("10", "عشرة");
    }

    try {
      const roomId = await getIdByRoomName(currentName);
    
      if (roomId) {
        const deviceId = await getDeviceIdByName(deviceName, roomId);
        // تحديث حالة الجهاز بناءً على الأمر الصوتي
        const deviceStatus = words[0] == "افتح" ? 1 : 0;
        updateDeviceStatusInCurrentRoom(deviceId, deviceStatus, roomId);
      
      } else {
        console.log(`لم يتم العثور على الغرفة ${currentName}`);
      }
    } catch (error) {
    
      console.log(error);

    }
    
}
}


// دالة لتحديث حالة الجهاز في الغرفة الحالية
function updateDeviceStatusInCurrentRoom(deviceId, status, currentRoomIndex) {
  const roomsRef = database.ref(`Rooms/${currentRoomIndex}`);

  roomsRef.once('value').then(snapshot => {
    const devices = snapshot.val()?.devices;

    if (devices && devices[deviceId]) {
      const deviceRef = roomsRef.child(`devices/${deviceId}`);
      deviceRef.update({ status: status });
      console.log(`تم تحديث حالة الجهاز ${deviceId} في الغرفة ${currentRoomIndex} إلى ${status}`);
    } else {
      console.log(`الجهاز ${deviceId} غير موجود في الغرفة ${currentRoomIndex}`);
    }
  }).catch(error => {
    console.error(`حدث خطأ أثناء الوصول إلى بيانات الغرفة ${currentRoomIndex}: ${error}`);
  });
}

function updateAllDevicesStatus(status) {
  const roomsRef = database.ref('Rooms');
  roomsRef.once('value').then(snapshot => {
    const rooms = snapshot.val();

    if (rooms) {
      // تحديث حالة جميع الأجهزة في جميع الغرف
      Object.keys(rooms).forEach(roomIndex => {
        const devices = rooms[roomIndex]?.devices;
        if (devices) {
          Object.keys(devices).forEach(deviceIdInRoom => {
            const deviceRef = roomsRef.child(`${roomIndex}/devices/${deviceIdInRoom}`);
            deviceRef.update({ status: status });
            console.log(`تم تحديث حالة الجهاز ${deviceIdInRoom} في الغرفة ${roomIndex} إلى ${status}`);
          });
        }
      });
    } else {
      console.log('لا توجد غرف في قاعدة البيانات');
    }
  }).catch(error => {
    console.error("حدث خطأ أثناء الوصول إلى قاعدة البيانات", error);
  });
}


function getDeviceIdByName(deviceName, currentRoomIndex) {
  const roomsRef = database.ref(`Rooms/${currentRoomIndex}`);

  return new Promise((resolve, reject) => {
    roomsRef.once('value')
      .then(snapshot => {
        const devices = snapshot.val()?.devices;

        if (devices) {
          for (const deviceIdInRoom in devices) {
            const device = devices[deviceIdInRoom];

            if (device.Name === deviceName) {
              // تم العثور على الجهاز
              resolve(deviceIdInRoom);
              return;
            }
          }
        }

        // في حالة عدم العثور على الجهاز
        reject(`الجهاز ${deviceName} غير موجود في الغرفة ${currentRoomIndex}`);
      })
      .catch(error => {
        reject(`حدث خطأ أثناء البحث عن معرف الجهاز: ${error}`);
      });
  });
}


window.onload = () => {
  DisplayDevices();
  DisplayPushDevices();
  DisplayPushDevicesDoor();
  DisplayDevicesPushRemote();
  toggleRecording()
};

recognition.onend = function () {
  if (isRecording) {
    recognition.start();
  }
};

function toggleRecording() {
  if (isRecording) {
    recognition.stop();
  } else {
    recognition.start();
  }
  isRecording = !isRecording;
}

function getDevicesWithSameType(currentRoomIndex, targetType) {
  return new Promise((resolve, reject) => {
    const roomRef = database.ref(`Rooms/${currentRoomIndex}`);
    roomRef.once('value').then(snapshot => {
      const devices = snapshot.val()?.devices || {};

      // تصفية الأجهزة بناءً على النوع المستهدف
      const filteredDevices = Object.keys(devices)
        .filter(deviceId => devices[deviceId]?.type == targetType)
        .map(deviceId => ({ id: deviceId, ...devices[deviceId] }));

      resolve(filteredDevices);
    }).catch(error => {
      reject(`حدث خطأ أثناء الوصول إلى بيانات الغرفة ${currentRoomIndex}: ${error}`);
    });
  });
}

async function updateAllDevicesStatusByType(currentRoomIndex, targetType, newStatus) {
  try {
    const devices = await getDevicesWithSameType(currentRoomIndex, targetType);

    if (devices.length > 0) {
      const updatePromises = devices.map(device => {
        const deviceRef = database.ref(`Rooms/${currentRoomIndex}/devices/${device.id}`);
        return deviceRef.update({ status: newStatus });
      });

      await Promise.all(updatePromises);
      console.log(`تم تحديث حالة الأجهزة من النوع ${targetType} في الغرفة ${currentRoomIndex} إلى ${newStatus}`);
    } else {
      console.log(`لا توجد أجهزة من النوع ${targetType} في الغرفة ${currentRoomIndex}`);
    }
  } catch (error) {
    console.error(error);
  }
}


async function getIdByRoomName(currentName) {
  try {
    const snapshot = await database.ref('Rooms').orderByChild('Name').equalTo(currentName).once('value');
    
    if (snapshot.exists()) {
      const roomData = snapshot.val();
      const roomId = Object.keys(roomData)[0]; // يفترض وجود غرفة واحدة فقط
      return roomId;
    } else {
      console.log(`لم يتم العثور على الغرفة ${currentName}`);
      return null;
    }
  } catch (error) {
    console.error("حدث خطأ أثناء البحث عن الغرفة", error);
    return null;
  }
}


async function changeStatusByTypeOfDevices(typeOfDevice,newStatus) {

  let roomId = await getIdByRoomName(currentName);

  if (roomId) {
    
    updateAllDevicesStatusByType(roomId, typeOfDevice, newStatus);


  } else {
    console.log(`لم يتم العثور على الغرفة ${currentName}`);
  }
}



