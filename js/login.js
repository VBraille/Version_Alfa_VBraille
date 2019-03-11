
var dict_users = {

    'placa1' : {
        'usuario' : 'ybhjeelu',
        'contraseña' : 'dZW2u8LkZ0Yq',
        'port' : 30961,
        'server' : 'm12.cloudmqtt.com'
    },

    'placa2' : {
        'usuario' : 'cchffnkr',
        'contraseña' : 'WMrgC9_cfSvG',
        'port' : 35681,
        'server' : 'm11.cloudmqtt.com'
    }


}


function go_to_Chat() {

    user_name = document.getElementById("user_input").value;
    var users_list = Object.keys(dict_users);
    if (users_list.includes(user_name)) {
        alert("Ingreso exitoso")
        localStorage.setItem("storage_User",dict_users[user_name]['usuario']);
        localStorage.setItem("storage_PW",dict_users[user_name]['contraseña']);
        localStorage.setItem("storage_name",user_name);
        localStorage.setItem("storage_port",dict_users[user_name]['port']);
        localStorage.setItem("storage_sever",dict_users[user_name]['server']);
        window.location.href = 'chat.html';

    } else {
        alert("Usuario inexistente")
    }


}
