axios.get(config.urlBase + "verSession.php").then(response => {
    const tema = response.data.tema_nombre || "light";
    console.log("Tema recibido desde sesión:", tema);
    console.log("Session actual:", response.data.rol);

    applyTheme(tema);
  })

  .catch(error => {
    console.error("Error al obtener sesión:", error);
});
  
function applyTheme(nombreTema) {
    const clase = nombreTema.endsWith("-theme") ? nombreTema : nombreTema + "-theme";
    document.body.classList.remove("light-theme", "dark-theme", "blue-theme", "green-theme", "preload-theme");
    document.body.classList.add(clase);
}

function toggleSidebar() {
    let sidebar = document.getElementById("sidebar");
    let content = document.getElementById("content");
    let body = document.body;

    if (sidebar.style.left === "0px") {
        sidebar.style.left = "-250px";
        body.classList.add("sidebar-collapsed")
        // content.style.paddingLeft = "20px";

    } else {
    sidebar.style.left = "0px";
    body.classList.remove("sidebar-collapsed")
    // content.style.marginLeft= "270px";
    }
}


const loadedScripts = new Set();

function loadPage(page) {
    $("#content").load("pages/" + page, function () {
        console.log("Página cargada:", page);

        //extraer ruta del archivo
        const parts = page.split('/');
        const folder = parts.length > 1 ? parts[0] : '';
        const fileName = folder.length > 1 ? parts[1] : parts[0];

        //ruta del script
        const scriptPath = folder
            ? `assets/js/${folder}/${fileName.replace('.html', '.js')}`
            : `assets/js/$${fileName.replace('.html', '.js')}`;

        if (!loadedScripts.has(scriptPath)) {
            const script = document.createElement("script");
            script.src = scriptPath;
            script.onload = () => {
                console.log("Script cargado: ", scriptPath);
                loadedScripts.add(scriptPath);
            };
            script.onerror = () => {
                console.error("Error cargando el script: ", scriptPath);
            };
            document.body.appendChild(script);
        }
        if (page === "users.html") {
            loadUsers();
        }

        if (page === "Pullman/index.html") {
            initModulo();
        }
    });
}



function logout() {
    axios.post(config.urlBase+"logout.php", {}, { withCredentials: true })
        .then(() => {
            window.location.href = "pages/login.html";
        });
}


$(document).ready(function () {
    axios.get(config.urlBase +"check_session.php", { withCredentials: true })
        .then(response => {
            if (!response.data.loggedIn) {
                window.location.href = "pages/login.html"; // Redirige si no hay sesión
            } else {
                let rol_id = response.data.rol_id;
                let empresa = response.data.empresa || "Sin empresa asignada";
            $("#empresas").text(empresa);

            }
        });

        axios.get(config.urlBase+"get_menu.php", { withCredentials: true })
    .then(response => {
        if (response.data.error) {
            console.log(response.data.error);
            window.location.href = "pages/login.html"; // Redirigir si no está logueado
            return;
        }



        let navbar = $("#navbar-items");
        let sidebar = $("#sidebar-items");

        navbar.empty();
        sidebar.empty();

        response.data.navbar.forEach(item => {
            navbar.append(`<li class="nav-item"><a class="nav-link" href="#" onclick="loadPage('${item.url}')">${item.nombre}</a></li>`);
        });

        response.data.sidebar.forEach(item => {
            sidebar.append(`<li><a href="#" onclick="loadPage('${item.url}')">${item.nombre}</a></li>`);
        });
    })
    .catch(error => {
        console.error("Error al obtener menús:", error);
        window.location.href = "pages/login.html";
    });

})