const ajax = new XMLHttpRequest();

ajax.open("GET", "./data/data.json", true);
ajax.send();

ajax.onreadystatechange = function () {
  let content = document.getElementById("content");

  if (this.readyState !== 4 || this.status !== 200) {
    return;
  }

  const response = JSON.parse(ajax.responseText);

  if (response.length === 0) {
    content.innerHTML = warningContent();
    return;
  }

  let htmlContent = "";

  response.forEach((data) => {
    htmlContent += categoryContent(data.category);

    if (data.toys.length == 0) {
      htmlContent += warningContent();
    } else {
      htmlContent += toysContent(data.toys);
    }
  });

  content.innerHTML = htmlContent;
  dynamicCache(response);
};

function warningContent() {
  return `<div class="alert alert-warning" role="alert">
    Desculpe. Ainda não temos brinquedos cadastrados!
  </div>`;
}

function categoryContent(category) {
  return `
    <div class="row">
      <div class="col-12">
        <h2>
          <span> </span>
            ${category}
        </h2>
      </div>
    </div>`;
}

function toysContent(toys) {
  let content = '<div class="row">';

  toys.forEach((toy) => {
    content += toyCard({
      name: toy.name,
      image: toy.image,
      value: toy.value,
      whatsapp: toy.whatsapp,
    });
  });
  content += "</div>";
  return content;
}

var toyCard = function ({ name, image, value, whatsapp }) {
  return `
    <div class="col-lg-6">
      <div class="card">
        <img src="${image}" class="card-img-top" alt="${name}"> 
        <div class="card-body"> 
          <h5 class="card-title"> 
            ${name} 
          </h5> 
          <p class="card-text"><strong>Valor R$:</strong>  
            ${value}
          </p> 
          <div class="d-grid gap-2"> 
            <a href="https://api.whatsapp.com/send?phone=55${whatsapp}" 
              &text="Olá gostaria de informações sobre o brinquedo: ${name}"
              target="_blank" class="btn btn-info">
                Contato Proprietário
            </a> 
          </div> 
        </div> 
      </div> 
    </div>`;
};

function dynamicCache(data) {
  if (!("caches" in window)) {
    return;
  }

  console.info("Old dynamic cache removed!");
  caches.delete("dynamic-toy-app").then(function () {
    if (data.length === 0) {
      return;
    }
    const files = cacheCompose(data);
    caches.open("dynamic-toy-app").then((cache) => {
      cache.addAll(files).then(function () {
        console.info("New dynamic cache added!");
      }).catch(err => console.log(err));
    });
  });
}

function cacheCompose(data) {
  const files = ["./data/data.json"];

  data.forEach((item) => {
    item.toys.forEach((toy) => {
      if (files.indexOf(toy.image) === -1) {
        files.push(toy.image);
      }
    });
  });

  return files;
}
