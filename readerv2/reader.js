var page = 1;
var id = null;
var media_id = null;
var pages = null;
var urlParams = null;
var max_page = 0;
var code = 200;

async function loadGalleryData() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    id = urlParams.get('id');
    let ip = "";
    let person = prompt("Please enter IP:", "");
    if (person == null || person == "") {
      ip = "";
    } else {
      ip = person;
    }
    const response = await fetch("https://nhentai-api.onrender.com/http://"+ip+"/api/gallery/" + id);
    if (response.status != 200) {
        await document.getElementById("iswear").setAttribute("src", "https://nhentai-api.onrender.com/https://i.nhentai.net/galleries/1493636/28.jpg");
        const p = document.getElementById("error");
        p.innerHTML = response.status + "\nCouldn't load gallery."
        code = response.status;
    }
    const data = await response.json();
    media_id = data.media_id;
    pages = data.images.pages;
    max_page = data.num_pages;
    if (urlParams.get('page') != null)
        page = urlParams.get('page');
    if(page>max_page || page<1) {
        await document.getElementById("iswear").setAttribute("src", "https://i.nhentai.net/galleries/1493636/28.jpg");
        const p = document.getElementById("error");
        p.innerHTML = "Page number not defined.";
    }
    document.getElementById("iswear").setAttribute("src", "https://i.nhentai.net/galleries/" + media_id + "/" + page + getExtension(pages[page - 1]));
    generateSelector();
}

async function generateSelector() {
    for (var i = 0; i < max_page; i++) {
        const opt = document.createElement("option");
        opt.setAttribute("value", i + 1);
        opt.innerHTML = i + 1;
        document.getElementById("bust").appendChild(opt);
    }
    document.getElementById("bust").value = Number(page);
}

async function pageUp() {
    if (page < max_page) {
        page++;
    }
    document.getElementById("bust").value = Number(page);
    document.getElementById("iswear").setAttribute("src", "https://i.nhentai.net/galleries/" + media_id + "/" + page + getExtension(pages[page - 1]));
}

async function pageDown() {
    if (page > 1) {
        page--;
    }
    document.getElementById("bust").value = Number(page);
    document.getElementById("iswear").setAttribute("src", "https://i.nhentai.net/galleries/" + media_id + "/" + page + getExtension(pages[page - 1]));
}

async function pageTo(pagenum) {
    page = pagenum;
    document.getElementById("bust").value = Number(page);
    document.getElementById("iswear").setAttribute("src", "https://i.nhentai.net/galleries/" + media_id + "/" + page + getExtension(pages[page - 1]));
}

function getExtension(image) {
    switch (image.t) {
        case "j":
            return ".jpg";
        case "p":
            return ".png";
        case "g":
            return ".gif";
    }
    return "err";
}

async function backToGallery() {
    if (code != 200) {
        document.location.href = "index.html";
    }
    else {
        document.location.href = "gallery.html?id=" + id;
    }
}
