import { render } from "ejs";
import express, { response } from "express";

const url = "https://api.visualthinking.fdnd.nl/api/v1/";

// Maak een nieuwe express app
const app = express();

// Stel in hoe we express gebruiken
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));

// Maak een route voor de index
app.get("/", (request, response) => {
  let methodsUrl = url + "/methods?first=100";
  fetchJson(methodsUrl).then((data) => {
    response.render("index", data);
  });
});

app.get("/method/:slug", (request, response) => {
  let detailPageUrl = url + "method/" + request.params.slug;
  const id = request.query.id;
  console.log(id);

  fetchJson(detailPageUrl).then((data) => {
    response.render("method", data);
  });
});

app.get("/method/:slug/form", (request, response) => {
  let detailPageUrl = url + "method/" + request.params.slug;
  const baseUrl = "https://api.visualthinking.fdnd.nl/api/v1/";
  const commentUrl = `${baseUrl}comments` + "?id=" + request.query.id;

  fetchJson(detailPageUrl).then((data) => {
    fetchJson(commentUrl).then((data2) => {
      const newdata = { detail: data, form: data2, slug: request.params.slug };

      response.render("form", newdata);
    });
  });
});

app.post("/method/:slug/form", (request, response) => {
  const baseurl = "https://api.visualthinking.fdnd.nl/api/v1/";
  const url = `${baseurl}comments`;

  postJson(url, request.body).then((data) => {
    if (data.success) {
      response.redirect(
        "/method/" + request.params.slug + "?methodPosted=true"
      );
    } else {
      response.redirect(
        "/method/" + request.params.slug + "?methodPosted=false"
      );
    }
  });
});

// Stel het poortnummer in en start express
app.set("port", process.env.PORT || 8000);
app.listen(app.get("port"), function () {
  console.log(`Application started on http://localhost:${app.get("port")}`);
});

async function fetchJson(url) {
  return await fetch(url)
    .then((response) => response.json())
    .catch((error) => error);
}

export async function postJson(url, body) {
  return await fetch(url, {
    method: "post",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .catch((error) => error);
}
