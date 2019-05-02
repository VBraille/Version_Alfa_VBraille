var usuario = localStorage.getItem("storage_User");
var contrasena = localStorage.getItem("storage_PW");
var usuario_placa = localStorage.getItem("storage_name");
var port_mqtt = parseInt(localStorage.getItem("storage_port"));
var server_mqtt = localStorage.getItem("storage_sever");

if (usuario_placa == "null"){
    alert('Debes de hacer Login primero')
    window.location.href = 'index.html';
}

// Función para arreglar la fecha
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

// Crea porción de código de nuevo mensaje enviado
function make_html_sended(message) {
    // Función que ingresa el mensaje que se va a enviar y la hora al template de código en html
    // para poder ser usado dentro del container del chat

    var d = new Date();
    var h = addZero(d.getHours());
    var m = addZero(d.getMinutes());
    var s = addZero(d.getSeconds());
    var hora = h + ":" + m + ":" + s;

    var texto = `
    <div class="container darker">
      <img src="img/person.jpg" alt="Avatar" class="right" style="width:100%;">
      <p id ="mensaje"> ${message} </p>
      <span class="time-left"> Computador a las: ${hora} </span>
    </div>
    `;
    return texto
}

// Crea porción de código de nuevo mensaje recivido
function make_html_received(message) {

    // Función que ingresa el mensaje que se recibió y la hora al template de código en html
    // para poder ser usado dentro del container del chat
    var d = new Date();
    var h = addZero(d.getHours());
    var m = addZero(d.getMinutes());
    var s = addZero(d.getSeconds());
    var hora = h + ":" + m + ":" + s;

    var texto = `
    <div class="container">
      <img src="img/person.jpg" alt="Avatar" style="width:100%;">
      <p id ="mensaje"> ${message}</p>
      <span class="time-right">Teclado a las: ${hora} </span>
    </div>
    `
    return texto
}

// Función para enviar mensaje
function send_message() {

    mensaje = document.getElementById("mensajeEnviar").value; // Mensaje que se va a enviar
    message = new Paho.MQTT.Message(mensaje); // Se convierte en mensaje con formato de MQTTcloud
    message.destinationName = '/' + usuario_placa + '/salidaDigital' // el Topic del mensaje
    client.send(message); // Enviar mensaje
    var d1 = document.getElementById('chat'); // el div del contenedor de mensajes
    html_code = make_html_sended(mensaje); // me genera el código de html del nuevo mensaje
    d1.insertAdjacentHTML('beforeend', html_code); // ingresa la porción de código al div
    document.getElementById('mensajeEnviar').value = ''; // borra lo del area de escritura del mensaje
};

// Función cuando llega nuevo mensaje
function onMessageArrived(message) {

    if (message.destinationName == '/' + usuario_placa + '/' + 'pulsador') { // Si es del topic de mi interes
        var d1 = document.getElementById('chat'); // div del contenedor de mensajes
        // genera el codigo de html para mensaje recibido
        html_code = make_html_received(message.payloadString)
        d1.insertAdjacentHTML('beforeend', html_code); // ingresa el código en el div

    }

}

// Función para cuando se conecta con MQTTcloud
function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    alert("Conexión Satisfactoria")
    console.log("onConnect");
    client.subscribe("#");
}
// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        alert("Se perdió la conexión")
        console.log("onConnectionLost:", responseObject.errorMessage);
        setTimeout(function() {
            client.connect()
        }, 5000);
    }
}

// Función para cuando no se permite el acceso al servidor
function onFailure(invocationContext, errorCode, errorMessage) {
    var errDiv = document.getElementById("error");
    errDiv.textContent = "Could not connect to WebSocket server, most likely you're behind a firewall that doesn't allow outgoing connections to port 39627";
    errDiv.style.display = "block";
}


function logout_chat(){
    localStorage.setItem("storage_User",null);
    localStorage.setItem("storage_PW",null);
    localStorage.setItem("storage_name",null);
    localStorage.setItem("storage_port",null);
    localStorage.setItem("storage_sever",null);
    window.location.href = 'index.html';
}


// Crea un nuevo Id para que se abra distinto en cada página
var clientId = "ws" + Math.random();

// Crea el nuevo cliente
// var client = new Paho.MQTT.Client("m12.cloudmqtt.com", 30961, clientId);
var client = new Paho.MQTT.Client(server_mqtt, 	port_mqtt, clientId);




// Callbacks
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// Conexión
client.connect({
    useSSL: true,
    userName: usuario,
    password: contrasena,
    onSuccess: onConnect,
    onFailure: onFailure
});
