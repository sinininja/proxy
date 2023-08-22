"use strict";

const https = require("https");
const fs = require("fs");
const express = require("express");
const helmet = require("helmet");
const { key } = require("./key");
const app = express();
// function isSecure(req) {
//   if (req.headers["x-forwarded-proto"]) {
//     return req.headers["x-forwarded-proto"] === "https";
//   }
//   return req.secure;
// }
// app.use((req, res, next) => {
//   if (
//     process.env.NODE_ENV !== "development" &&
//     process.env.NODE_ENV !== "test" &&
//     !isSecure(req)
//   ) {
//     res.redirect(301, `https://${req.headers.host}${req.url}`);
//   } else {
//     next();
//   }
// });
// const PORT = 80;
// const PORT_SSL = 4000;

// const options = {
//   key: fs.readFileSync("./ssl_cert/privkey.pem", "utf-8"),
//   cert: fs.readFileSync("./ssl_cert/fullchain.pem", "utf-8"),
// };

// const server = https.createServer(options, app);

// app.get("/", (req, res) => {
//   res.send("Hello from express server.");
// });
// app.use(express.static("public"));
app.use(express.json());
app.use(helmet());
app.disable("x-powered-by");

// app.get("/", (req, res) => {
//   console.log(req.json());
// });
app.post("/message", (req, res) => {
  // console.log(req.body);
  const data = req.body;
  const phone = data.phone
    .replaceAll(" ", "")
    .replaceAll("-", "")
    .replaceAll("(", "")
    .replaceAll(")", "");
  console.log(phone);
  fetch(`https://api.telegram.org/bot${key.key}/sendMessage`, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify({
      chat_id: "-981192490",
      text: `НОВЫЙ ЗАКАЗ:
Вид работ: ${data.work},
Имя клиента: ${data.amount},
Телефон клиента: ${phone},
Расстояние: ${data.distance} км,
Стоимость поездки: ${Math.round((data.distance / 100) * 1368)} рублей`,
    }),
  });

  fetch(`https://api.telegram.org/bot${key.key}/sendContact`, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify({
      chat_id: "-981192490",
      first_name: `${data.amount}`,
      phone_number: `${phone}`,
    }),
  });

  fetch(`https://api.telegram.org/bot${key.key}/sendMessage`, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify({
      chat_id: "-981192490",
      text: `https://yandex.ru/maps/?ll=${data.lng}%2C${data.lat}&mode=whatshere&whatshere%5Bpoint%5D=${data.lng}%2C${data.lat}&whatshere%5Bzoom%5D=16&z=16`,
    }),
  });
  res.json("got a post");
  res.end();
});

// app.listen(PORT, () => {
//   console.log(`Starting Proxy Server at: ${PORT}`);
// });
// server.listen(PORT_SSL, () => {
//   console.log(`Starting Proxy Server at: ${PORT_SSL}`);
// });
