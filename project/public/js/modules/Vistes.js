/**
 * Classe Vistes
 * Gestiona totes les vistes i elements de la interfície d'usuari
 */
class Vistes {
    /**
     * Constructor de la classe
     * @param {string} text - Text inicial
     */
    constructor(text) {
        this.text = text;
    }

    /**
     * Crea un element HTML amb els atributs especificats
     * @param {string} tipus - Tipus d'element HTML
     * @param {string} clase - Classes CSS
     * @param {string} id - Identificador únic
     * @param {string} text - Text contingut
     * @returns {HTMLElement} Element HTML creat
     */
    static crearElement(tipus = "", clase = "", id = "", text = "") {
        let element = document.createElement(tipus);
        if (text) element.innerText = text;
        if (clase) element.className = clase;
        if (id) element.id = id;
        return element;
    }

    /**
     * Crea una targeta amb títol i contingut
     * @param {string} titol - Títol de la targeta
     * @param {string} url - URL associada
     * @param {string} graficText - Text del gràfic
     * @returns {HTMLElement} Contenidor de la targeta
     */
    static crearTargeta(titol = "", url = "", graficText = "") {
        let containerTargeta = this.crearElement("div", "container-targeta");

        // Crear el título fuera de la tarjeta
        let titolElement = this.crearElement("h3", "titol-targeta", "", titol);
        containerTargeta.appendChild(titolElement);

        // Crear la tarjeta principal
        let targeta = this.crearElement("div", "targeta");

        // Crear y añadir el gráfico clicable
        let graficElement = this.crearElement("a", "grafic", "", graficText);
        graficElement.href = url;
        graficElement.target = "_blank";
        targeta.appendChild(graficElement);

        containerTargeta.appendChild(targeta);
        return containerTargeta;
    }



    /**
     * Crea un formulari d'inici de sessió
     * @returns {HTMLElement} Formulari d'inici de sessió creat
     */
    static crearFormIniciSessio() {
        let formCreat = this.crearElement("form", "", "formulari");
        formCreat.method = "post";// Triem el mètode POST per ocultar les dades a la URL
        formCreat.action = "app/controllers/comprovarUsuari.php";// Enviem les dades al controlador comprovarUsuari.php

        let labelUsuari = this.crearElement("label", "", "", "Usuari:");
        let inputUsuari = this.crearElement("input", "", "usuari");
        inputUsuari.type = "text";
        inputUsuari.name = "name";
        inputUsuari.required = true;// Creem la etiqueta label i l'input per a l'usuari i el mandem com a requisit

        let labelPassword = this.crearElement("label", "", "", "Contrasenya:");
        let inputPassword = this.crearElement("input", "", "password");
        inputPassword.type = "password";
        inputPassword.name = "password";
        inputPassword.required = true;// Creem la etiqueta label i l'input per a la contrasenya i el mandem com a requisit

        let inputSubmit = this.crearElement("input", "", "");
        inputSubmit.type = "submit";
        inputSubmit.value = "Inicia sessió";// Creem el botó d'enviament del formulari

        formCreat.appendChild(labelUsuari);
        formCreat.appendChild(inputUsuari);
        formCreat.appendChild(labelPassword);
        formCreat.appendChild(inputPassword);
        formCreat.appendChild(inputSubmit);// Afegim tots els elements al formulari creat

        return formCreat;// Retornem el formulari creat
    }

    static paginaIniciSessio(clase ="container") {
        let contenidor = document.getElementsByClassName(clase);
        let titolInicial = this.crearElement("h1", "", "titol", "Benvingut a Inventrack");
        let imatgeInicial = this.crearElement("img", "", "", "imatge");
        let titolIniciar = this.crearElement("h2", "", "titolIniciar", "Inicia sessió");
        // Creem els elements necessaris
        let formElement = this.crearFormIniciSessio();
        // Creem el formulari d'inici de sessió amb la funció 
        contenidor.appendChild(titolInicial);
        contenidor.appendChild(imatgeInicial);
        imatgeInicial.src = "./public/images/Logo_Inventor.svg";
        contenidor.appendChild(titolIniciar);
        contenidor.appendChild(formElement);// Afegim tots els elements al contenidor
    }

    /**
     * Mostra la pàgina amb targetes
     * @param {string} id - Identificador de l'element contenidor
     */
    static async paginaAmbTargetes(id = "contenidor") {
        let contenidor = document.getElementById(id);

        let titolInicial = this.crearElement("h1", "", "titolPrincipal", "Pàgina principal");
        let divTargetes = this.crearElement("div", "", "divTargetes");
        contenidor.appendChild(titolInicial);
        contenidor.appendChild(divTargetes);

        try {
            const response = await fetch('/project/app/controllers/consultaStockMinim.php');
            // Realitzar la petició per obtenir les dades de stock mínim
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);// Comprovem si la resposta és correcta
            }
            const stockData = await response.json();// Convertim la resposta a JSON

            const responseMoviments = await fetch('/project/app/controllers/consultaUltimsMoviments.php');
            // Realitzar la petició per obtenir les dades de moviments
            if (!responseMoviments.ok) {
                throw new Error(`Error HTTP: ${responseMoviments.status}`);
            }
            const movimentsData = await responseMoviments.json();
            
            const responseMaterials = await fetch('/project/app/controllers/consultaUltimsMaterials.php');
            // Realitzar la petició per obtenir els ultims materials
            if (!responseMaterials.ok) {
                throw new Error(`Error HTTP: ${responseMaterials.status}`);
            }
            const materialsData = await responseMaterials.json();

            const responseSortides = await fetch('/project/app/controllers/consultaUltimesSortides.php');
            // Realitzar la petició per obtenir les dades de sortides
            if (!responseSortides.ok) {
                throw new Error(`Error HTTP: ${responseSortides.status}`);
            }
            const sortidesData = await responseSortides.json();

            const dadesTaules = {// Creem un objecte amb les dades de les taules
                stock: {
                    titol: "Stock Mínim",
                    headers: ["Material", "Stock", "Mínim"],
                    dades: stockData // Afegim les dades de stock mínim 
                },
                moviments: {
                    titol: "Registre Moviments",
                    headers: ["Data", "Material", "Quantitat", "Tècnic"],
                    dades: Array.isArray(movimentsData) ? movimentsData : [] 
                    // Afegim les dades de moviments 
                },
                material: {
                    titol: "Material",
                    headers: ["Codi", "Nom", "Categoria"],
                    dades: materialsData // Afegim les dades de materials
                },
                sortides: {
                    titol: "Sortides Material",
                    headers: ["Data", "Material", "Descripció"],
                    dades: sortidesData // Afegim les dades de sortides
                }
            };

            Object.entries(dadesTaules).forEach(([key, taula]) => {// Iterem sobre les taules
                let containerTargeta = this.crearElement("div", "container-targeta");
                let titolTargeta = this.crearElement("h3", "titol-targeta", "", taula.titol);
                let targeta = this.crearElement("table", "targeta");// Afegim els elements a la targeta

                // Afegir classe i event listener per a cada targeta
                if (key === 'stock') {
                    containerTargeta.classList.add('clickable');// Afegim la classe clickable
                    containerTargeta.addEventListener('click', () => {
                        contenidor.innerText = "";
                        this.paginaConsultaStock();// Redirigim a la pàgina de consulta de stock
                    });
                } else if (key === 'moviments') {
                    containerTargeta.classList.add('clickable');
                    containerTargeta.addEventListener('click', () => {
                        contenidor.innerText = "";
                        this.paginaRegistreMoviments();// Redirigim a la pàgina de registre de moviments
                    });
                } else if (key === 'material') {
                    containerTargeta.classList.add('clickable');
                    containerTargeta.addEventListener('click', () => {
                        contenidor.innerText = "";
                        this.paginaConsultaMaterial();
                    });
                } else if (key === 'sortides') {
                    containerTargeta.classList.add('clickable');
                    containerTargeta.addEventListener('click', () => {
                        contenidor.innerText = "";
                        this.paginaConsultaSortides();
                    });
                }

                // Crear capçalera de la taula
                let thead = this.crearElement("thead");
                let headerRow = this.crearElement("tr");// Afegim la fila de capçalera
                taula.headers.forEach(header => {
                    let th = this.crearElement("th", "", "", header);
                    headerRow.appendChild(th);// Afegim les capçaleres a la fila
                });
                thead.appendChild(headerRow);
                targeta.appendChild(thead);// Afegim els elements a la taula

                let tbody = this.crearElement("tbody");// Afegim el cos de la taula
                taula.dades.forEach((dada, index) => {
                    let tr = this.crearElement("tr", "", `fila${index + 1}`);
                    // Afegim les dades a la fila
                    Object.values(dada).forEach(value => {
                        let td = this.crearElement("td", "", "", value);
                        tr.appendChild(td);// Afegim les dades a la fila
                    });
                    tbody.appendChild(tr);// Afegim la fila al cos de la taula
                });
                targeta.appendChild(tbody);// Afegim el cos de la taula a la targeta

                containerTargeta.appendChild(titolTargeta);
                containerTargeta.appendChild(targeta);
                divTargetes.appendChild(containerTargeta);// Afegim la targeta al contenidor
            });

            let divQr = this.crearElement("div", "container-targeta clickable");
            let titolQr = this.crearElement("h3", "titol-targeta", "", "Llegir QR");
            let qrCode = this.crearElement("img", "qr-code", "", "");
            qrCode.src = "../images/llegirqr.png";
            divQr.appendChild(titolQr);
            divQr.appendChild(qrCode);// Afegim els elements a la targeta 

            divQr.addEventListener('click', () => {
                window.location.href = '/project/public/views/seccioQr.html';
            });// Redirigim a la pàgina de lectura de QR
            
            let divQr2 = this.crearElement("div", "container-targeta clickable");
            let titolQr2 = this.crearElement("h3", "titol-targeta", "", "Registrar localització d'actius");
            let qrCode2 = this.crearElement("img", "qr-code", "", "");
            qrCode2.src = "../images/registrarPortatil.png";
            divQr2.appendChild(titolQr2);
            divQr2.appendChild(qrCode2);

            divQr2.addEventListener('click', () => {
                window.location.href = '/project/public/views/localitzacioActius.html';
                // Redirigim a la pàgina de registre de localització d'actius
            });
            
            divTargetes.appendChild(divQr);
            divTargetes.appendChild(divQr2);

        } catch (error) {
            let errorMsg = this.crearElement("p", "error-message", "",
                `Error al carregar les dades: ${error.message}`);
            divTargetes.appendChild(errorMsg);// Afegim el missatge d'error al contenidor
        }

        let botoRetorn = this.crearElement("button", "", "botoRetorn", "Surt de l'aplicació");
        contenidor.appendChild(botoRetorn);// Creem i afegim el botó de retorn

        botoRetorn.addEventListener("click", () => {
            contenidor.innerText = "";
            window.location.href = '/project/index.php'; // Redirigim a la pàgina principal
        });
    }

    /**
     * Mostra la pàgina de consulta de stock
     * @param {string} id - Identificador de l'element contenidor
     */
    static async paginaConsultaStock(id = "contenidor") {
        let contenidor = document.getElementById(id);

        try {
            const response = await fetch('/project/app/controllers/consultaStock.php');
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();

            // Título
            let titol = this.crearElement("h1", "", "titolPrincipal", "Consulta d'estoc Mínim");
            contenidor.appendChild(titol);

            // Verificar si hi ha dades
            if (!data || data.length === 0) {
                throw new Error('No s\'han trobat dades');
            }

            let table = this.crearElement("table", "targeta");

            // Crear capçalera de la taula
            let thead = this.crearElement("thead");
            let headerRow = this.crearElement("tr");
            ["Material", "Stock Actual", "Stock Mínim", "Detalls"].forEach(header => {
                let th = this.crearElement("th", "", "", header);// Afegim les capçaleres a la fila
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);

            // Crear cos de la taula
            let tbody = this.crearElement("tbody");
            data.forEach((item, index) => {
                let tr = this.crearElement("tr", "", `fila${index + 1}`);

                [item.material, item.stockActual, item.stockMinim].forEach(value => {
                    let td = this.crearElement("td", "", "", value);
                    if (value === item.stockActual && parseInt(value) <= parseInt(item.stockMinim)) {
                        td.classList.add('stock-baix');
                        // Afegim la classe stock-baix si el stock actual és menor o igual al mínim
                    }
                    tr.appendChild(td);
                });

                let tdEnllac = this.crearElement("td");
                let enllac = this.crearElement("a", "enllac-detalls", "", "Veure detalls");
                enllac.href = item.enllaç; // Fer servir l'enllaç del servidor
                tdEnllac.appendChild(enllac);
                tr.appendChild(tdEnllac);

                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
            contenidor.appendChild(table);

            // Botó de retorn
            let botoRetorn = this.crearElement("button", "", "botoRetorn", "Tornar");
            contenidor.appendChild(botoRetorn);

            botoRetorn.addEventListener("click", () => {
                contenidor.innerText = "";
                this.paginaAmbTargetes();// Redirigim a la pàgina principal
            });

        } catch (error) {
            let errorMsg = this.crearElement("p", "error-message", "",
                `Error al carregar les dades: ${error.message}`);
            contenidor.appendChild(errorMsg);// Afegim el missatge d'error al contenidor
        }
    }

    /**
     * Mostra la pàgina de registre de moviments
     * @param {string} id - Identificador de l'element contenidor
     */
    static async paginaRegistreMoviments(id = "contenidor") {
        let contenidor = document.getElementById(id);

        try {
            const responseUser = await fetch('/project/app/controllers/getSessionUser.php');
            const userData = await responseUser.json();// Obtenim les dades de l'usuari

            if (!responseUser.ok || userData.error) {
                throw new Error(userData.message || 'Error de autenticació');// Si no hi ha sessió activa
            }

            const idTecnic = userData.idTecnic;// Obtenim l'ID del tècnic
            contenidor.innerText = "";

            let titol = this.crearElement("h1", "", "titolPrincipal", "Registre de Moviments");
            contenidor.appendChild(titol);// Afegim el títol al contenidor
            let form = this.crearElement("form", "form-moviments");// Creem el formulari de registre de moviments

            let labelMaterial = this.crearElement("label", "", "", "Material:");
            let selectMaterial = this.crearElement("select", "", "material");
            selectMaterial.name = "idMaterial";
            selectMaterial.required = true;// Creem la etiqueta label i el select per a l'ID del material

            let labelTipus = this.crearElement("label", "", "", "Tipus de moviment:");
            let selectTipus = this.crearElement("select", "", "tipus");
            selectTipus.name = "idMoviment";
            selectTipus.required = true;// Creem la etiqueta label i el select per a l'ID del moviment

            let labelQuantitat = this.crearElement("label", "", "", "Quantitat:");
            let inputQuantitat = this.crearElement("input", "", "quantitat");
            inputQuantitat.type = "number";
            inputQuantitat.name = "quantitatMaterial";
            inputQuantitat.required = true;// Creem la etiqueta label i l'input per a la quantitat del material

            let labelDetall = this.crearElement("label", "", "", "Detall del moviment:");
            let inputDetall = this.crearElement("textarea", "", "detall");
            inputDetall.name = "detallMoviment";
            inputDetall.required = true;// Creem la etiqueta label i l'input per al detall del moviment

            let labelData = this.crearElement("label", "", "", "Data:");
            let inputData = this.crearElement("input", "", "data");
            inputData.type = "date";
            inputData.name = "dataMoviment";
            inputData.required = true;// Creem la etiqueta label i l'input per a la data del moviment

            let labelQr = this.crearElement("label", "", "", "QR generat:");
            let qrCodeDiv = this.crearElement("div", "", "qrCodeDiv");// Creem el div per al codi QR generat

            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            inputData.value = `${year}-${month}-${day}`; // Estableix la data actual com a valor per defecte

            let botoSubmit = this.crearElement("button", "boto-submit", "", "Registrar Moviment");
            botoSubmit.type = "submit";
            let botoRetorn = this.crearElement("button", "", "botoRetorn", "Tornar enrrere");
            let botoGenerarQr = this.crearElement("button", "", "botoGenerarQr", "Generar QR");
            let botoImprimirQr = this.crearElement("button", "", "botoImprimirQr", "Imprimir QR");
            // Afegim els botons per enviar, tornar enrere i generar QR

            form.appendChild(labelMaterial);
            form.appendChild(selectMaterial);
            form.appendChild(labelTipus);
            form.appendChild(selectTipus);
            form.appendChild(labelQuantitat);
            form.appendChild(inputQuantitat);
            form.appendChild(labelDetall);
            form.appendChild(inputDetall);
            form.appendChild(labelData);
            form.appendChild(inputData);
            form.appendChild(labelQr);
            form.appendChild(qrCodeDiv);
            form.appendChild(botoSubmit);
            form.appendChild(botoRetorn);
            form.appendChild(botoGenerarQr);
            form.appendChild(botoImprimirQr);// Afegim tots els elements al formulari

            contenidor.appendChild(form);

            let divTaulaRegistres = this.crearElement("div", "", "divTaulaRegistres");

            let taulaRegistres = this.crearElement("table", "targeta");
            taulaRegistres.style.display = "none";
            let thead = this.crearElement("thead");
            let headerRow = this.crearElement("tr");
            ["Data", "Material", "Quantitat", "Tècnic"].forEach(header => {
                let th = this.crearElement("th", "", "", header);
                headerRow.appendChild(th);
            });// Creem la taula de registres
            thead.appendChild(headerRow);
            taulaRegistres.appendChild(thead);

            let tbody = this.crearElement("tbody");
            try {
                const response = await fetch('/project/app/controllers/consultaRegistresMoviments.php');
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                const registres = await response.json();
                registres.forEach(registre => {
                    let tr = this.crearElement("tr");
                    const data = registre.data; // La data del registre
                    const values = [
                        data,
                        registre.material,
                        registre.quantitat,
                        registre.tecnic
                    ];// Afegim les dades a la fila
                    values.forEach(value => {
                        let td = this.crearElement("td", "", "", value);
                        tr.appendChild(td);// Afegim les dades a la fila
                    });
                    tbody.appendChild(tr);
                });
            } catch (error) {
                let errorRow = this.crearElement("tr");
                let errorCell = this.crearElement("td", "", "", "Error al carregar els registres");
                errorCell.colSpan = 4; // Actualitzat per ocupar tota la fila
                errorRow.appendChild(errorCell);
                tbody.appendChild(errorRow);
            }
            taulaRegistres.appendChild(tbody);
            divTaulaRegistres.appendChild(taulaRegistres);
            contenidor.appendChild(divTaulaRegistres);

            let botoMostrarRegistres = this.crearElement("button", "", "botoMostrarRegistres", "Mostrar Registres");
            contenidor.appendChild(botoMostrarRegistres);// Afegim el botó per mostrar els registres

            botoMostrarRegistres.addEventListener("click", () => {
                if (taulaRegistres.style.display === "block") {
                    // Mostrar formulari, ocultar taula
                    form.style.display = "flex";
                    form.style.flexDirection = "column";
                    form.style.gap = "20px";
                    taulaRegistres.style.display = "none";
                    botoMostrarRegistres.innerText = "Mostrar Registres";
                } else {
                    // Mostrar taula, ocultar formulari
                    form.style.display = "none";
                    taulaRegistres.style.display = "block";
                    botoMostrarRegistres.innerText = "Mostrar Formulari";
                }
            });
            

            botoRetorn.addEventListener("click", () => {
                contenidor.innerText = "";
                this.paginaAmbTargetes();// Redirigim a la pàgina principal
            });

            await this.carregarMaterials(selectMaterial);
            await this.carregarTipusMoviment(selectTipus);

            form.addEventListener('submit', async (e) => {
                e.preventDefault();// Evitem el comportament per defecte del formulari
                try {
                    if (!qrCodeDiv.querySelector('img')) {
                        alert('És necesari generar un codi QR abans de registrar el moviment');
                        return; // Verifiquem si el QR ha estat generat
                    }

                    const formData = new FormData(form);
                    const dataInput = formData.get('dataMoviment');
                    const dataFormatejada = new Date(dataInput).toISOString().split('T')[0];
                    // Convertim la data a un format ISO
                    
                    const qrCode = qrCodeDiv.querySelector('img').src;// Obtenim la imatge del QR generat

                    const dades = {
                        idMaterial: formData.get('idMaterial'),
                        idMoviment: formData.get('idMoviment'),
                        quantitatMaterial: formData.get('quantitatMaterial'),
                        detallMoviment: formData.get('detallMoviment'),
                        dataMoviment: dataFormatejada,
                        idTecnic: idTecnic,
                        codiQR: qrCode
                    };// Creem un objecte amb les dades del formulari

                    const response = await fetch('/project/app/controllers/registrarMoviment.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(dades)// Enviem les dades al servidor
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Error al registrar el moviment');
                    }

                    const result = await response.json();

                    if (result.success) {// Si la resposta és correcta
                        alert(result.message);
                        contenidor.innerText = "";
                        this.paginaRegistreMoviments();// Redirigim a la pàgina de registre de moviments
                    } else {
                        throw new Error(result.message || 'Error desconegut');
                    }

                } catch (error) {
                    console.error('Error complet:', error);
                    alert(`Error: ${error.message}`);
                }
            });

            botoGenerarQr.addEventListener("click", async (e) => {
                e.preventDefault();
                try {
                    // Obtenim l'últim ID del registre
                    const response = await fetch('/project/app/controllers/consultaUltimIdRegistre.php');
                    if (!response.ok) {
                        throw new Error('Error obtenint últim ID');
                    }
                    const data = await response.json();
                    const ultimId = data.ultimId; // Sumem 1 a l'últim ID per generar un nou QR

                    // Netejem el contingut anterior del div QR
                    qrCodeDiv.innerHTML = '';
                    
                    // Generem el QR
                    new QRCode(qrCodeDiv, {
                        text: ultimId.toString(),
                        width: 128,
                        height: 128,
                        colorDark: "#000000",
                        colorLight: "#ffffff",
                        correctLevel: QRCode.CorrectLevel.H// Ajustem el nivell de correcció d'errors
                    });
                } catch (error) {
                    alert('Error al generar el QR');
                }
            });

            botoImprimirQr.addEventListener("click", (e) => {
                e.preventDefault();
                if (!qrCodeDiv.querySelector('img')) {
                    alert('Primer tens que generar un codi QR');// Verifiquem si el QR ha estat generat
                    return;
                }

                try {
                    const qrImage = qrCodeDiv.querySelector('img').src;
                    const printContent = `
                        <html>
                            <head>
                                <title>Imprimir QR</title>
                                <style>
                                    body {
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                        height: 100vh;
                                        margin: 0;
                                    }
                                    img {
                                        width: 300px;
                                        height: 300px;
                                    }
                                </style>
                            </head>
                            <body>
                                <img src="${qrImage}" alt="Codi QR">
                            </body>
                        </html>
                    `;

                    const printWindow = window.open('', '_blank');// Obre una finestra emergent
                    if (printWindow) {
                        printWindow.document.write(printContent);// Escriu el contingut a la finestra emergent
                        printWindow.document.close();// Tanca el document per assegurar-se que es carrega
                        printWindow.focus();// Focalitza la finestra emergent
                        setTimeout(() => {// Espera un moment per assegurar-se que la finestra està carregada
                            printWindow.print();
                            printWindow.close();
                        }, 250);
                    } else {
                        alert('Si us plau, permet les finestres emergents per imprimir el QR');
                        // Si la finestra emergent no es pot obrir, mostra un missatge d'error
                    }
                } catch (error) {
                    alert('Error al imprimir el QR');
                }
            });

        } catch (error) {
            alert('Error: Té que iniciar sessió para acceder a esta página');
            window.location.href = '/project/index.php';// Redirigim a la pàgina d'inici de sessió
            return;
        }
    }

    /**
     * Carrega els tipus de moviment en un select
     * @param {HTMLSelectElement} select - Elemento select on carregar els tipus de moviment
     */
    static async carregarTipusMoviment(select) {
        try {
            const response = await fetch('/project/app/controllers/consultaTipusMoviment.php');
            if (!response.ok) throw new Error('Error al carregar tipus de moviment');
    
            const tipus = await response.json();
            
            // Netejar primer el select
            select.innerHTML = '';
            
            // Afegir opció per defecte
            let defaultOption = this.crearElement("option", "", "", "Selecciona un tipus de moviment");
            defaultOption.value = "";
            defaultOption.disabled = true;
            defaultOption.selected = true;
            select.appendChild(defaultOption);
            
            // Afegir les opcions de tipus de moviment
            tipus.forEach(tipus => {
                let option = this.crearElement("option", "", "", tipus.descripcioMoviment);
                option.value = tipus.idMoviment;
                select.appendChild(option);
            });
        } catch (error) {
            console.error('Error al carregar tipus de moviment:', error);
            select.innerHTML = ''; // Netejar opcions existents
            let errorOption = this.crearElement("option", "", "", "Error al carregar tipus de moviment");
            errorOption.disabled = true;
            select.appendChild(errorOption);
        }
    }
    
    /**
     * Carrega els materials en un select
     * @param {HTMLSelectElement} select - Element select on carregar els materials
     */
    static async carregarMaterials(select) {
        try {
            const response = await fetch('/project/app/controllers/consultaMaterials.php');
            if (!response.ok) {
                throw new Error('Error al carregar materials');
            }
    
            const materials = await response.json();
    
            // Netejar el select abans d'afegir les novess opcions
            select.innerHTML = '';
    
            // Crear opció per defecte
            let defaultOption = this.crearElement("option", "", "", "Selecciona un material");
            defaultOption.value = "";
            defaultOption.disabled = true;
            defaultOption.selected = true;
            select.appendChild(defaultOption);
    
            // Verificar que materials sigui un array y no estigui buit
            if (!Array.isArray(materials) || materials.length === 0) {
                let noMaterialsOption = this.crearElement("option", "", "", "No hi ha materials disponibles");
                noMaterialsOption.disabled = true;
                select.appendChild(noMaterialsOption);
                return;
            }
    
            // Afegir les opcions de materials
            materials.forEach(material => {
                if (material && material.nomMaterial && material.codiMaterial) {
                    let option = this.crearElement("option", "", "", 
                        `${material.nomMaterial}`);
                    option.value = material.codiMaterial; // Assignar el valor correcte
                    select.appendChild(option);
                }
            });
        } catch (error) {
            console.error('Error al carregar materials:', error);
            select.innerHTML = ''; // Netejar opcions existents
            let errorOption = this.crearElement("option", "", "", "Error al carregar materials");
            errorOption.disabled = true;
            select.appendChild(errorOption);// Afegir opció d'error
        }
    }

    /**
     * Mostra la pàgina de consulta de materials
     * @param {string} id - Identificador de l'element contenidor
     */
    static async paginaConsultaMaterial(id = "contenidor") {
        const contenidor = document.getElementById(id);
        contenidor.innerText = "";

        contenidor.appendChild(this.crearElement("h1", "", "titolPrincipal", "Cerca de Material"));
        const formCerca = this.#crearFormulariCercaMaterial();// Creem el formulari de cerca
        contenidor.appendChild(formCerca);

        const table = this.#crearTaulaMaterials();// Creem la taula de materials
        contenidor.appendChild(table);
        const tbody = table.querySelector('tbody');

        const botoRetorn = this.crearElement("button", "", "botoRetorn", "Tornar");
        contenidor.appendChild(botoRetorn);

        formCerca.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.#cercaMaterials(tbody, formCerca.querySelector('#cercaMaterial').value.trim());
            // Obtenim el valor de cerca i cridem a la funció de cerca
        });

        botoRetorn.addEventListener("click", () => {
            contenidor.innerText = "";
            this.paginaAmbTargetes();
        });

        formCerca.dispatchEvent(new Event('submit'));// Realitzem la cerca inicial
    }

    /**
     * Crea el formulari de cerca de materials
     * @returns {HTMLFormElement} Formulari de cerca creat
     */
    static #crearFormulariCercaMaterial() {
        const formCerca = this.crearElement("form", "form-cerca", "formCercaMaterial");
        const divCerca = this.crearElement("div", "div-cerca");
        
        const labelCerca = this.crearElement("label", "", "labelCercaMaterial", "Cerca per nom o categoria:");
        labelCerca.setAttribute('for', 'cercaMaterial');
        
        const inputCerca = this.crearElement("input", "", "cercaMaterial");
        inputCerca.type = "text";
        inputCerca.name = "search";
        inputCerca.placeholder = "Introdueix el nom o categoria...";
        
        const botoCerca = this.crearElement("button", "boto-cerca", "botoCerca", "Cercar");
        botoCerca.type = "submit";

        divCerca.append(labelCerca, inputCerca);
        formCerca.append(divCerca, botoCerca);
        
        return formCerca;
    }

    /**
     * Crea la taula de materials
     * @returns {HTMLTableElement} Taula de materials creada
     */
    static #crearTaulaMaterials() {
        const table = this.crearElement("table", "taula-materials");
        const thead = this.crearElement("thead");
        const headerRow = this.crearElement("tr");
        
        ["Codi", "Nom", "Categoria", "Stock Mínim", "Stock Actual", "Detalls"]
            .forEach(header => headerRow.appendChild(this.crearElement("th", "", "", header)));
        
        thead.appendChild(headerRow);
        table.append(thead, this.crearElement("tbody"));
        return table;
    }

    /**
     * Cerca materials segons el terme de cerca
     * @param {HTMLTableSectionElement} tbody - Cos de la taula on mostrar els resultats
     * @param {string} searchTerm - Terme de cerca
     */
    static async #cercaMaterials(tbody, searchTerm) {
        try {
            tbody.innerHTML = '';
            this.#mostrarLoadingState(tbody);

            const url = new URL('/project/app/controllers/consultaMaterials.php', window.location.origin);
            // Afegim el terme de cerca a la URL
            if (searchTerm) url.searchParams.append('search', searchTerm);// Afegim el terme de cerca

            const response = await fetch(url, {
                cache: 'no-cache',
                headers: { 'Cache-Control': 'no-cache' }
            });
            
            if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
            
            const data = await response.json();
            tbody.innerHTML = '';

            if (!Array.isArray(data) || data.length === 0) {
                this.#mostrarNoResultats(tbody);// Si no hi ha resultats, mostrar missatge
                return;
            }

            data.forEach(material => tbody.appendChild(this.#crearFilaMaterial(material)));
            // Afegim les files de materials a la taula
            
        } catch (error) {
            this.#mostrarError(tbody, error);
        }
    }

    /**
     * Mostra l'estat de càrrega
     * @param {HTMLTableSectionElement} tbody - Cos de la taula on mostrar l'estat de càrrega
     */
    static #mostrarLoadingState(tbody) {
        const tr = this.crearElement("tr");
        const td = this.crearElement("td", "", "", "Cercant...");
        td.colSpan = 6;
        tr.appendChild(td);
        tbody.appendChild(tr);
    }

    /**
     * Mostra un missatge quan no hi ha resultats
     * @param {HTMLTableSectionElement} tbody - Cos de la taula on mostrar el missatge
     */
    static #mostrarNoResultats(tbody) {
        const tr = this.crearElement("tr");
        const td = this.crearElement("td", "no-results", "", "No s'han trobat resultats");
        td.colSpan = 6;
        tr.appendChild(td);
        tbody.appendChild(tr);
    }

    /**
     * Mostra un missatge d'error
     * @param {HTMLTableSectionElement} tbody - Cos de la taula on mostrar el missatge d'error
     * @param {Error} error - Error a mostrar
     */
    static #mostrarError(tbody, error) {
        const tr = this.crearElement("tr");
        const td = this.crearElement("td", "error-message", "", 
            `Error: ${error.message || 'Error desconegut'}`);
        td.colSpan = 6;
        tr.appendChild(td);
        tbody.appendChild(tr);
    }

    /**
     * Crea una fila de la taula de materials
     * @param {Object} material - Material a mostrar
     * @returns {HTMLTableRowElement} Fila de la taula creada
     */
    static #crearFilaMaterial(material) {
        const tr = this.crearElement("tr");
        
        [
            material.codiMaterial,
            material.nomMaterial,
            material.categoria,
            material.stockMinim,
            material.stockActual
        ].forEach(value => {// Afegim les dades a la fila
            const td = this.crearElement("td", "", "", value || "-");
            if (value === material.stockActual && parseInt(value) <= parseInt(material.stockMinim)) {
                td.classList.add('stock-baix');// Afegim la classe stock-baix si el stock actual és menor o igual al mínim
            }
            tr.appendChild(td);
        });

        const tdEnllac = this.crearElement("td");
        if (material.enllac) {
            const enlace = this.crearElement("a", "enllac-detalls", "", "Veure detalls");
            enlace.href = material.enllac;
            enlace.target = "_blank";
            tdEnllac.appendChild(enlace);
        } else {
            tdEnllac.textContent = "-";
        }
        tr.appendChild(tdEnllac);

        return tr;
    }

    /**
     * Mostra la pàgina de consulta de sortides
     * @param {string} id - Identificador de l'element contenidor
     */
    static async paginaConsultaSortides(id = "contenidor") {
        let contenidor = document.getElementById(id);
        contenidor.innerText = "";

        // Títol
        let titol = this.crearElement("h1", "", "titolPrincipal", "Consulta de Sortides");
        contenidor.appendChild(titol);

        try {
            // Mostrar indicador de carrega
            let loading = this.crearElement("p", "loading", "", "Carregant dades...");
            contenidor.appendChild(loading);

            const response = await fetch('/project/app/controllers/consultaSortides.php');
            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }

            const data = await response.json();
            loading.remove();// Eliminar l'indicador de càrrega

            if (!Array.isArray(data) || data.length === 0) {
                let noData = this.crearElement("p", "no-results", "", "No s'han trobat sortides registrades");
                contenidor.appendChild(noData);
                return;// Si no hi ha dades, mostrar missatge
            }

            // Crear taula
            let table = this.crearElement("table", "targeta");
            let thead = this.crearElement("thead");
            let headerRow = this.crearElement("tr");
            
            ["Data", "Material", "Descripció"].forEach(header => {
                let th = this.crearElement("th", "", "", header);
                headerRow.appendChild(th);
            });// Afegim les capçaleres a la fila
            
            thead.appendChild(headerRow);
            table.appendChild(thead);// Afegim la capçalera a la taula

            let tbody = this.crearElement("tbody");
            data.forEach(sortida => {
                let tr = this.crearElement("tr");
                [
                    sortida.data,
                    sortida.material,
                    sortida.desti
                ].forEach(value => {
                    let td = this.crearElement("td", "", "", value || "-");
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);// Afegim la fila al cos de la taula
            });

            table.appendChild(tbody);
            contenidor.appendChild(table);

        } catch (error) {
            let errorMsg = this.crearElement("p", "error-message", "", 
                `Error: ${error.message || 'Error desconegut'}`);
            contenidor.appendChild(errorMsg);
        }
        
        let botoRetorn = this.crearElement("button", "", "botoRetorn", "Tornar");
        contenidor.appendChild(botoRetorn);

        botoRetorn.addEventListener("click", () => {
            contenidor.innerText = "";
            this.paginaAmbTargetes();
        });
    }
}

/**
 * Exportació de la classe Vistes
 */
export { Vistes };

