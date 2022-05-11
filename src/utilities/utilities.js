import { format, parseISO } from 'date-fns';

//Guarda la información del usuario que está logueado
export function infoUsuario(info) {
  if (localStorage.getItem('userData')) {
    var userData = JSON.parse(localStorage.getItem("userData"));
    userData = userData[0][info];
    
    return userData;
  }
  return "X";
}

//Función genérica para preparar solicitudes POST en el formato de la app (action - set - data)
export function prepararPost(values, set, action = "setJsons", structure = "jsonSingle") {

  if (structure == "jsonSingle") {
    let data = [];

    //Ingresamos en un arreglo el JSON guardado en variable values
    data.push(values);
    const requestMetaData = { //Armamos los datos necesarios para hacer el request POST
      action: action,
      set: set,
      data: JSON.stringify(data)
    }

    //Formateamos requestMetaData de JSON a formato de URL (ej. => &x=1&y=2&z=3)
    var formBody = [];
    for (var property in requestMetaData) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(requestMetaData[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    //Finalmente preparamos toda la estructura del request que enviaremos a la función fetch para hacer el POST
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: formBody
    };
    return requestOptions;

  } else if (structure == "jsonArray") {
    let data = values;

    //Ingresamos en un arreglo el JSON guardado en variable values
    //data.push(values);

    const requestMetaData = { //Armamos los datos necesarios para hacer el request POST
      action: "setJsons",
      set: set,
      data: JSON.stringify(data)
    }
    
    var formBody = [];
    for (var property in requestMetaData) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(requestMetaData[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: formBody
    };
    return requestOptions;

  }
  return;
}

export function getTodayDate(params) {
  let options = {};
  let d = new Date();
  let date = '';

  switch (params) {
    case 1:
      options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      break;

    case 2:
      date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
      return date;
  }

  date = d.toLocaleDateString("es-MX", options);

  return date;
}

export function url() {
  return 'https://eyebrowsbygr.site/system/api/beautysalon_eyebrowsbygr.php';
}

export var saltingCode = "kDHXM!yMMS$mS60x*EPJD*";

//FECHA FORMATEADA EN ESPAÑOL
export function formatearFechaLista(dateParam) {

  let formattedString = format(parseISO(dateParam), 'yyyy-MM-dd hh:mm:ss a');

  let d = new Date(formattedString);
  let fecha_cita = '';
  let date = '';
  let hour = '';
  let optionsDate = {};
  let optionsHour = {};

  optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  optionsHour = { hour: 'numeric', minute: 'numeric', hour12: false };

  date = d.toLocaleDateString("es-MX", optionsDate);
  hour = d.toLocaleString("es-MX", optionsHour);

  fecha_cita = date + ", a las " + hour + " horas";

  return fecha_cita;
}

//Suma una determinada cantidad de minutos a una DateTime
export function addTimeToDatetime(fecha_cita, minutes) {
  var date = new Date(fecha_cita);
  date.setHours(date.getHours(), date.getMinutes() + parseInt(minutes), 0, 0);

  return date;
}

//Resta una determinada cantidad de minutos a una DateTime
export function substractTimeToDatetime(fecha_cita, minutes) {
  var date = new Date(fecha_cita);
  date.setHours(date.getHours(), date.getMinutes() - parseInt(minutes), 0, 0);

  return date;
}

//Convierte a una DateTime a un formato "YYYY-MM-DD hh:mm"
export function convert(str) {
  var date = new Date(str);
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  var day = ("0" + date.getDate()).slice(-2);
  var hour = ("0" + date.getHours()).slice(-2);
  var minute = ("0" + date.getMinutes()).slice(-2);

  return [date.getFullYear(), month, day].join("-") + " " + hour + ":" + minute;
}