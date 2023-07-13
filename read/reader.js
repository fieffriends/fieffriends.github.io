var page = 1;
var id = null;
var pages = null;
var urlParams = null;
var max_page = 0;

//For server
const apicdn = true;

const map_blue = '{ "pages": [] }';
const post_blue = '{ "thumb": "", "img": "" }';

const json = JSON.parse(map_blue);

function loadGalleryData() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    id = urlParams.get('id');

    if (id === "urbosa") {
        console.log(atob("VXJib3NhIGlzIGxvdmUuIFVyYm9zYSBpcyBsaXZlLg=="));
        reward_urbosa();
    } else if (!Number.isInteger(parseInt(id))) {
        compensation_404();
    } else {
        getPool(id).then(() => {
            console.log(json);

            pages = json.pages;
            max_page = json.pages.length;
            if (urlParams.get('page') != null) {
                page = urlParams.get('page');
            }

            if (max_page <= 0) {
                compensation_404();
            } else if (page > max_page || page < 1) {
                compensation_no_page();
            }

            document.getElementById("iswear").setAttribute("src", pages[page - 1].img);
            generateSelector();
        });
    }
}

function getPool(poolid) {
    return fetch('https://cors-anywhere.herokuapp.com/https://rule34.xxx/index.php?page=pool&s=show&id=' + poolid)
        .then(response => {
            if (!response.ok) {
                compensation_404();
                return undefined;
            }
            return response.text();
        })
        .then(html => {
            if (html === undefined) {
                return undefined;
            }
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            try {
                const chicks = doc.querySelector("#content > h1");
                if (chicks.innerHTML === 'Nobody here but us chickens!') {
                    compensation_404();
                    return undefined;
                }
            } catch (err) {
            }

            const list = doc.querySelector("#pool-show > div:nth-child(6)");

            const children = list.childNodes;
            children.forEach(child => {
                if (child.id !== "paginator" && child.id !== undefined) {
                    console.log(child.id)
                    const post = JSON.parse(post_blue);

                    let src = child.childNodes[1].childNodes[1].src;
                    let id = new URL(child.childNodes[1].href);
                    id = new URLSearchParams(id.search);
                    source = src.split('/');

                    //Choose server (wimg may not work reliable, use api server)
                    let server = 'wimg';
                    if (apicdn) {
                        server = 'api-cdn';
                    }

                    post.thumb = src;
                    post.img = 'https://' + server + '.rule34.xxx//images/' + source[5] + '/' + source[6].split('_')[1].split('.')[0] + '.jpeg';

                    json.pages.push(post);

                    const img = document.createElement('img');
                    img.setAttribute('rereferrerpolicy', 'no-referrer');
                    img.src = src;
                    //document.getElementById('main').appendChild(img);
                }
            });
        });
}

function compensation_404() {
    const main = document.getElementById('content');
    main.style.background = '#91666e';
    document.getElementById("iswear").setAttribute("src", "404.png");
}

function compensation_no_page() {
    document.getElementById("iswear").setAttribute("src", "https://i.nhentai.net/galleries/1493636/28.jpg");
    const p = document.getElementById("error");
    p.innerHTML = "Page number not defined.";
}

function reward_urbosa() {
    fetch("https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&tags=urbosa&json=1")
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                const p = document.getElementById("error");
                p.innerHTML = "You deserve a reward.\nBut it broke.";
            }
        })
        .then(json1 => {
            json1.forEach(post => {
                if (!post.tags.includes("animated")) {
                    const jpost = JSON.parse('{ "thumb": "", "img": "", "sauce": ""}');
                    jpost.thumb = post.preview_url;
                    jpost.img = post.file_url;
                    jpost.sauce = 'https://rule34.xxx/index.php?page=post&s=view&id=' + post.id;
                    json.pages.push(jpost);
                }
            });
        })
        .then(() => {
            console.log(json);

            pages = json.pages;
            max_page = json.pages.length;

            if (max_page <= 0) {
                compensation_404();
            } else if (page > max_page || page < 1) {
                compensation_no_page();
            }

            const alpha = document.createElement("a");
            alpha.setAttribute("onclick", "getSauce()");
            alpha.id = 'sauce';
            alpha.innerHTML = 'Sauce';
            document.getElementsByClassName('topnav')[0].appendChild(alpha);

            document.getElementById("iswear").setAttribute("src", pages[page - 1].img);
            generateSelector();
        });
}

function getSauce() {
    console.log(pages[page - 1].sauce)
    window.open(pages[page - 1].sauce, '_blank').focus();
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
    document.getElementById("iswear").setAttribute("src", pages[page - 1].img);
}

async function pageDown() {
    if (page > 1) {
        page--;
    }
    document.getElementById("bust").value = Number(page);
    document.getElementById("iswear").setAttribute("src", pages[page - 1].img);
}

async function pageTo(pagenum) {
    page = pagenum;
    document.getElementById("bust").value = Number(page);
    document.getElementById("iswear").setAttribute("src", pages[page - 1].img);
}

async function backToGallery() {
    document.location.href = "/";
}