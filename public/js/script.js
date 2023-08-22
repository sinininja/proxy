"use strict";

// import status from "./proxy";
// const btn = document.querySelector(".button_submit");
// const work = document.querySelector(".work");
// const amount = document.querySelector(".amount");
const phone = document.querySelector(".phone");
const form = document.getElementById("form");
const inputLat = document.getElementById("lat");
const inputLng = document.getElementById("lng");
const overlay = document.querySelector(".overlay");
const modalErr = document.querySelector(".modal_error");
const modalSuc = document.querySelector(".modal_succes");
const modalClose = document.querySelectorAll(".modal__close");
const inputDistance = document.getElementById("distance");
const intro = document.querySelector(".intro");
const introBtn = document.querySelector(".intro_btn");
const sideBtn = document.querySelector(".side_btn");
const services = document.querySelector(".services");
const serviceClose = document.querySelector(".service_close");
let lat, lng;
let myPlacemark;
let newPlacemark;
let multiRoute;
let distance;
const startCoords = [56.060392, 92.940353];
const test = document.getElementById("test");

phone.addEventListener("click", function (e) {
  phone.value = "+7";
  phone.focus();
  phone.selectionStart = phone.value.length;
});

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude, longitude } = position.coords;
      lat = inputLat.value = latitude;
      lng = inputLng.value = longitude;
      const coords = [lat, lng];

      ymaps.ready(init);
      function init() {
        // Создание карты.
        const myMap = new ymaps.Map(
          "map",
          {
            // Координаты центра карты.
            // Порядок по умолчанию: «широта, долгота».
            // Чтобы не определять координаты центра карты вручную,
            // воспользуйтесь инструментом Определение координат.
            center: coords,
            // type: 'hybrid',
            // Уровень масштабирования. Допустимые значения:
            // от 0 (весь мир) до 19.
            zoom: 13,
          },
          {
            searchControlProvider: "yandex#search",
          }
        );

        myPlacemark = new ymaps.Placemark(
          coords,
          {
            iconCaption: "Вы здесь",
          },
          {
            preset: "islands#greenDotIconWithCaption",
          }
        );
        myMap.geoObjects.add(myPlacemark);

        multiRoute = new ymaps.multiRouter.MultiRoute({
          referencePoints: [`${[...startCoords]}`, `${lat},${lng}`],
          params: {
            results: 1,
          },
        });
        // console.log(multiRoute);
        // myMap.geoObjects.add(multiRoute);
        // Повесим обработчик на событие построения маршрута.

        myMap.events.add("click", function (event) {
          console.log(event.get("coords"));

          [lat, lng] = event.get("coords");
          inputLat.value = lat;
          inputLng.value = lng;
          if (newPlacemark) {
            myMap.geoObjects.remove(newPlacemark);
          }
          newPlacemark = new ymaps.Placemark(
            [lat, lng],
            {
              iconCaption: "Кординаты зафиксированы",
            },
            {
              preset: "islands#greenDotIconWithCaption",
            }
          );

          myMap.geoObjects.add(newPlacemark);

          multiRoute = new ymaps.multiRouter.MultiRoute({
            referencePoints: [`${[...startCoords]}`, `${lat},${lng}`],
            params: {
              results: 1,
            },
          });
          // myMap.geoObjects.add(multiRoute);
          multiRoute.model.events.add("requestsuccess", function () {
            let activeRoute = multiRoute.getActiveRoute();
            if (activeRoute) {
              // Получим протяженность маршрута.
              distance = multiRoute.getActiveRoute().properties.get("distance");
              // Вычислим стоимость доставки.
              console.log(length);
              inputDistance.value = Math.ceil(distance.value / 1000);
            }
          });
        });
        multiRoute.model.events.add("requestsuccess", function () {
          let activeRoute = multiRoute.getActiveRoute();
          if (activeRoute) {
            // Получим протяженность маршрута.
            distance = multiRoute.getActiveRoute().properties.get("distance");
            // Вычислим стоимость доставки.
            inputDistance.value = Math.ceil(distance.value / 1000);
            console.log(distance);
          }
        });
      }
    },
    function () {
      alert("ошибка navigator.geolocation");
    }
  );
}
modalClose.forEach((modal) => {
  modal.addEventListener("click", () => {
    modalSuc.classList.add("hidden");
    modalErr.classList.add("hidden");
    overlay.classList.add("hidden");
  });
});
const sendReq = async function (data) {
  try {
    const reqGet = await fetch(`https://xn--24-ilci9b.xn--p1ai:4337`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer,
      body: JSON.stringify(Object.fromEntries(data)),
    });

    console.log(reqGet);
    const res = await reqGet.json();
    console.log(res);
    if (reqGet.status === 200) {
      amount.value = "";
      phone.value = "";

      modalSuc.classList.remove("hidden");
      overlay.classList.remove("hidden");
    }
  } catch (e) {
    modalErr.textContent = `Возникла ошибка: ${e}`;
    сonsole.log(e);
    modalErr.classList.remove("hidden");
  }
};
form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (phone.value[0] === "8") {
    amount.value = "";
    phone.value = "";
    modalErr.classList.remove("hidden");
    overlay.classList.remove("hidden");
    return;
  }
  console.log(e.target);
  console.log(this);
  let formData = new FormData(form);
  console.log(formData);
  sendReq(formData);
  // const data = formData.json();
});

window.addEventListener("load", (e) => {
  e.preventDefault();
  setTimeout(() => {
    overlay.classList.remove("hidden");
    intro.classList.remove("hidden");
  }, 1000);
});

introBtn.addEventListener("click", (e) => {
  overlay.classList.add("hidden");
  intro.classList.add("hidden");
});

window.addEventListener("click", (e) => {
  overlay.classList.add("hidden");
  intro.classList.add("hidden");
  modalErr.classList.add("hidden");
});

window.addEventListener("keydown", (e) => {
  console.log(e);
  if (e.key === "Escape") {
    overlay.classList.add("hidden");
    intro.classList.add("hidden");
    modalErr.classList.add("hidden");
  }
});
sideBtn.addEventListener("click", (e) => {
  services.classList.toggle("active");
  if (services.classList.contains("active")) {
    sideBtn.textContent = "Назад";
  } else {
    sideBtn.textContent = "Услуги";
  }
});

serviceClose.addEventListener("click", () => {
  services.classList.toggle("active");
  if (services.classList.contains("active")) {
    sideBtn.textContent = "Назад";
  } else {
    sideBtn.textContent = "Услуги";
  }
});
