// ******************* Voice **************************//

const CloseAllDevices = document.querySelector('.closeAll');

CloseAllDevices.addEventListener("click", () => {
  updateAllDevicesStatus(0);
});

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'ar-EG';

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
    }else if(deviceName.includes("1")){
      deviceName = deviceName.replace("1", "واحد");
    }

  try {
      const roomId = await getIdByRoomName(currentName);
    
      if (roomId) {
        const deviceId = await getDeviceIdByName(deviceName, roomId);
        // تحديث حالة الجهاز بناءً على الأمر الصوتي
        const deviceStatus = words[0] == "افتح" ? "1" : "0";
    
        // استدعاء الدالة بدون توفير snapshot
        updateDeviceStatusInCurrentRoom(roomId, deviceId, deviceStatus);
      } else {
        console.log(`لم يتم العثور على الغرفة ${currentName}`);
      }
    } catch (error) {
      console.error(error);
    }
    
}

if (words[0] == "شغل" && words.length > 1) {

  const surahName = words.slice(1).join(' ');
  await speak("جاري تنفيذ طلبك");
  searchAndPlaySurahOnYouTube(surahName);

} 
if (words[0] == "وقف" || words[0] == "اسكت") {
  stopYouTubePlayer();
} 



// if (words[0] == "اخبار" && words[1] == "الطقس") {
//   inquireWeatherConditions()
//     .then(result => speak(result))
//     .catch(error => speak(error));
// }

// if(words[0] == "اخر" && words[1] == "الاخبار"){
//   getLatestNews('638f1888cc444206b6e8664439735bbd');
// }

// if (words[0] == "ابحث" && words.length > 1) {
//   const query = words.slice(1).join(' ');
//   searchOnGoogle(query);
// }
}


// دالة لتحديث حالة الجهاز في الغرفة الحالية
function updateDeviceStatusInCurrentRoom(roomKey, deviceIndex, newStatus) {
  const roomsRef = database.ref(`Rooms/${roomKey}`);

  roomsRef.once('value').then(snapshot => {
    const devicesArray = snapshot.child(`devices`).val() || [];

    // Check if the deviceIndex is within the valid range
    if (deviceIndex >= 0 && deviceIndex < devicesArray.length) {
      const deviceRef = roomsRef.child(`devices/${deviceIndex}`);

      const device = devicesArray[deviceIndex];
      const data = {
        status: newStatus,
        Name: device.Name,
        nameImage: device.nameImage,
      
      };

      deviceRef.update(data)
        .then(() => {
          console.log(`تم تحديث حالة الجهاز ${deviceIndex} في الغرفة ${roomKey} إلى ${newStatus}`);
        })
        .catch(error => {
          console.error(`حدث خطأ أثناء تحديث حالة الجهاز ${deviceIndex} في الغرفة ${roomKey}: ${error}`);
        });
    }
  }).catch(error => {
    console.error(`حدث خطأ أثناء الوصول إلى بيانات الغرفة ${roomKey}: ${error}`);
  });
}


function updateAllDevicesStatus(status) {
  const roomsRef = database.ref('Rooms');
  roomsRef.once('value').then(snapshot => {
    const rooms = snapshot.val();
    if (rooms) {
      Object.keys(rooms).forEach(roomIndex => {
        const devices = rooms[roomIndex]?.devices;
        if (devices) {
          Object.keys(devices).forEach((deviceIdInRoom, index) => {
            setTimeout(() => {
              updateDeviceStatusInCurrentRoom(roomIndex, deviceIdInRoom, status);
            }, index * 500);
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
  // recognition.start();
};

let openmicrphone = document.querySelector(".openmicrphone")

openmicrphone.addEventListener("click",()=>{
  recognition.start();
})



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


async function speak(text) {
  console.log(text);
  try {
    await responsiveVoice.speak(text, 'Arabic Male');
  } catch (error) {
    console.error('حدث خطأ أثناء تشغيل الصوت:', error);
  }
}


// ************************* اوامر اضافية******************


let player;

function searchAndPlaySurahOnYouTube(surahName) {
  const apiKey = 'AIzaSyB6-iYMYCniXT5xCoKOV6JH2KLLTRCWado';
  const apiUrl = `https://www.googleapis.com/youtube/v3/search?q=${surahName}&part=snippet&type=video&key=${apiKey}`;

  // قبل تشغيل الفيديو الجديد، تأكد من إيقاف أي فيديو قيد التشغيل

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (data.items && data.items.length > 0) {
          const videoId = data.items[0].id.videoId;

          // قم بتشغيل الفيديو الجديد
          player = new YT.Player('youtube-player', {
            height: '0',
            width: '0',
            videoId: videoId,
            playerVars: {
              'autoplay': 1,
              'controls': 0,
              'showinfo': 0,
              'modestbranding': 1,
              'loop': 1,
              'fs': 0,
              'cc_load_policy': 0,
              'iv_load_policy': 3,
            },
            events: {
              'onReady': onPlayerReady,
            },
          });
        } else {
          console.error('لم يتم العثور على فيديوهات.');
        }
      })
      .catch(error => {
        console.error('حدث خطأ أثناء البحث عن السورة على YouTube:', error);
      });
  
}

function onPlayerReady(event) {
  console.log('تم تشغيل الفيديو');
  event.target.playVideo();
  // يمكنك إضافة رسالة إلى المستخدم هنا
}

function stopYouTubePlayer() {

  // إذا كان هناك فيديو قيد التشغيل وليس محذوفًا، قم بإيقافه
  if (player && player.stopVideo) {
    console.log('تم إيقاف الفيديو');
    player.stopVideo();
    if (player.destroy) {
      console.log('تم قطع الاتصال مع المشغل السابق');
      player.destroy(); // قطع الاتصال مع المشغل السابق
    }
    // يمكنك إضافة رسالة إلى المستخدم هنا
  }

}



// recognition.onend = function() {
//   recognition.start();
// };

let closeFav        = document.querySelector(".closeFav")
let openFav         = document.querySelector(".openFav")
let media_Player    = document.querySelector(".media-player")
let playFav         = document.querySelector(".playFav")
let closeCurrentFav = document.querySelector(".closeCurrentFav")

openFav.addEventListener("click",()=>{
  recognition.stop();
  recognition.onend = function() {
    recognition.stop();
  };
  
  media_Player.style.transform="translateY(0)"
})

closeFav.addEventListener("click",()=>{


  recognition.start();
  recognition.onend = function() {
    recognition.start();
  };
  media_Player.style.transform="translateY(110%)"
})

closeCurrentFav.addEventListener("click",()=>{
  recognition.stop();
  recognition.onend = function() {
    recognition.stop();
  };
  stopYouTubePlayer()
})

playFav.addEventListener("click",()=>{
  recognition.start();
})



// // تابع لاستعلام حالة الطقس
// async function inquireWeatherConditions() {
//   try {
//     const apiKey = '4dd7652a83af4d7580b90511240201';
//     const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=cairo`;

//     const response = await fetch(apiUrl);
//     const data = await response.json();

//     if (response.ok) {
//       const temperature = data.current.temp_c;
//       const condition = data.current.condition.text;

//       console.log(`حالة الطقس الحالية: ${temperature} درجة مئوية`);
//       return `حالة الطقس الحالية: ${temperature} درجة مئوية`;
//     } else {
//       console.error(`حدث خطأ أثناء استعلام حالة الطقس: ${data.error.message}`);
//       return `حدث خطأ أثناء استعلام حالة الطقس: ${data.error.message}`;
//     }
//   } catch (error) {
//     console.error('حدث خطأ غير متوقع أثناء استعلام حالة الطقس:', error);
//     return 'حدث خطأ غير متوقع أثناء استعلام حالة الطقس';
//   }
// }

// // تابع لجلب آخر الأخبار باستخدام NewsAPI
// function getLatestNews(apiKey) {
//   const apiUrl = `https://newsapi.org/v2/top-headlines?country=eg&apiKey=${apiKey}`;

//   fetch(apiUrl)
//     .then(response => response.json())
//     .then(data => {
//       // عرض العناوين الرئيسية للأخبار
//       const headlines = data.articles.map(article => article.title);
//       console.log('آخر الأخبار:', headlines);

//       // يمكنك استخدام headlines لعرض الأخبار في واجهة المستخدم
//       // على سبيل المثال: قم بإنشاء قائمة HTML وعرض العناوين فيها
//       // displayNewsInUI(headlines);
//     })
//     .catch(error => {
//       console.error('حدث خطأ أثناء جلب الأخبار:', error);
//     });
// }


// // دالة للبحث على Google
// function searchOnGoogle(query) {
//   const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
//   window.open(searchUrl, '_blank');
// }

