let currentStatus = 1;

fetch("https://worldtimeapi.org/api/ip")
  .then((response) => response.json())
  .then((data) => {
    const currentTime = new Date(data.datetime);
    console.log(currentTime);

    setInterval(() => {
      const currentTime = new Date();

      // التحقق من الساعة والدقائق لتحديث القيمة فقط في الساعة 6 صباحًا ومساءًا
      if (
        (currentTime.getHours() === 6 && currentTime.getMinutes() === 0) ||
        (currentTime.getHours() === 18 && currentTime.getMinutes() === 0)
      ) {
        updateStatus();
      }
    }, 1000);
  })
  .catch((error) => console.log(error));

function updateStatus() {
  const currentTime = new Date();

  if (currentTime.getHours() >= 6 && currentTime.getHours() < 18) {
    currentStatus = 0;
  } else {
    currentStatus = 1;
  }

  const roomsRef = firebase.database().ref("Rooms");
  const frontRoomRef = roomsRef.child("2");

  frontRoomRef.once("value", (snapshot) => {
    const devicesArray = snapshot.val().devices || [];

    devicesArray.forEach((device, i) => {
      setTimeout(() => {
        const deviceRef = frontRoomRef.child("devices").child(i.toString());
        deviceRef.update({ status: currentStatus });
      }, i * 1000);
    });
  });
}

