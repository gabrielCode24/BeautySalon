import {
    IonContent, IonPage,
    IonHeader, IonToolbar,
    IonTitle, IonButtons,
    IonButton, IonList, IonItem,
    IonLabel, IonInput,
    IonBackButton,
    IonFooter, IonAccordion, IonAccordionGroup,
    IonSearchbar, IonItemGroup, IonDatetime,
    IonGrid, IonRow, IonCol, IonItemDivider
} from '@ionic/react';
import {
    arrowBackOutline
} from 'ionicons/icons';
import { Component } from 'react'

import { Redirect } from 'react-router-dom'
import { url, prepararPost, infoUsuario } from '../utilities/utilities.js'
import Swal from 'sweetalert2'

import { getClientes } from '../actions/clientesAction'
import { getProcedimientos } from '../actions/procedimientosAction'
import { connect } from 'react-redux'

import { format, parseISO, isPast } from 'date-fns';
import { setTimeout } from 'timers';

const mapStateToProps = store => ({
    clientes: store.clientes,
    procedimientos: store.procedimientos
});

class CitaCrear extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: url(),
            logged: true,
            usuario_logueado: infoUsuario('usuario'),
            usuario_perfil: infoUsuario('perfil'),
            clientes: [],
            procedimientos: [],
            vendedores: [],
            tecnicos: [],
            loading_clientes: false,
            loading_procedimientos: false,
            loading_vendedores: false,
            loading_tecnicos: false,
            search_string_cliente: "",
            search_string_procedimiento: "",
            search_string_vendedor: "",
            search_string_tecnico: "",
            date_selected: '',
            show_picker: true,
            fecha_rotulo: '',

            cliente_id_selected: '',
            procedimiento_id_selected: '',
            procedimiento_precio_sug_selected: '',
            tecnico_id_selected: '',
            vendedor_recepcionista_id_selected: '',
            fecha_cita_selected: '',

            url_guardar_imagen: 'https://pymesys.000webhostapp.com/beautysalon_eyebrowsbygr',
            image_updloaded_name: '',
            imagen_anticipo_uploading: false,
            sending: false,
            redireccionar_atras: false,

            itemArray: []
        }
    }

    UNSAFE_componentWillMount() {
        this._getClientes();
        this._getProcedimientos();
        this._getVendedores();
        this._getTecnicos();

        //Limpiamos la localStorage de técnicos seleccionados
        if (localStorage.getItem('arrayTecnicos')) {
            localStorage.removeItem('arrayTecnicos');
        }
    }

    mensajeValidacion = (mensaje) => {
        Swal.fire({
            title: 'Aviso',
            text: mensaje,
            icon: 'info',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#E0218A'
        });
    }

    buscarEnLista = (kindOf, id_element) => {
        let id = "";
        let text = "";

        switch (kindOf) {
            case "cliente":
                text = document.getElementById('search_cliente').value;

                this.setState({
                    search_string_cliente: text
                });
                break;
            case "procedimiento":
                text = document.getElementById('search_procedimiento').value;

                this.setState({
                    search_string_procedimiento: text
                });
                break;
            case "vendedor":
                text = document.getElementById('search_vendedor').value;

                this.setState({
                    search_string_vendedor: text
                });
                break;
            case "tecnico":
                id = "search_tecnico_" + id_element;
                text = document.getElementById(id).value;

                this.setState({
                    search_string_tecnico: text
                });

                if (text === "") {
                    setTimeout(() => {
                        let itemArray = this.state.itemArray;
                        let arrayTecnicosLista = this.state.tecnicos;

                        for (let z = 0; z < arrayTecnicosLista.length; z++) {
                            for (let y = 0; y < itemArray.length; y++) {
                                //Si un elemento de cada lista de técnicos no está en el arreglo de técnicos
                                if (!this.inArray(document.getElementById(arrayTecnicosLista[z].id + "_" + parseInt(itemArray[y].id_element)), arrayTecnicosLista)) {
                                    document.getElementById(arrayTecnicosLista[z].id + "_" + parseInt(itemArray[y].id_element)).disabled = 'false'
                                } else {
                                    document.getElementById(arrayTecnicosLista[z].id + "_" + parseInt(itemArray[y].id_element)).disabled = 'true'
                                }
                            }
                        }

                        if (localStorage.getItem('arrayTecnicos')) {
                            let arrayTecnicosSeleccionados = JSON.parse(localStorage.getItem('arrayTecnicos'));
                            console.log(arrayTecnicosSeleccionados.length);
                            for (let i = 0; i < arrayTecnicosSeleccionados.length; i++) {
                                for (let y = 0; y < itemArray.length; y++) {
                                    //Si el elemento no tiene letras verdes en el texto, entonces le aplicamos la propiedad disabled="true"
                                    if (this.inArray((arrayTecnicosSeleccionados[i].id_tecnico + "_" + parseInt(itemArray[y].id_element)), arrayTecnicosSeleccionados)) {
                                        document.getElementById(arrayTecnicosSeleccionados[i].id_tecnico + "_" + parseInt(itemArray[y].id_element)).style.color = '#43D440';
                                    }

                                    if (document.getElementById(arrayTecnicosSeleccionados[i].id_tecnico + "_" + parseInt(itemArray[y].id_element)).style.color !== 'rgb(67, 212, 64)') {
                                        document.getElementById(arrayTecnicosSeleccionados[i].id_tecnico + "_" + parseInt(itemArray[y].id_element)).disabled = 'true'
                                    }
                                }
                            }
                        }

                    }, 500);
                }



                break;
            default:
                break;
        }
    }

    //CLIENTES
    _getClientes = () => {
        this.setState({ loading_clientes: true });

        let Parameters = '?action=getJSON&get=clientes_lista';

        fetch(this.state.url + Parameters)
            .then((res) => res.json())
            .then((responseJson) => {

                //Guardamos la lista de clientes que vienen del API en el store de Redux
                this.props.dispatch(getClientes(responseJson))

                this.setState({
                    loading_clientes: false,
                    clientes: this.props.clientes.list,
                });

                Swal.close();
            })
            .catch((error) => {
                console.log(error)
            });
    }

    _getCliente = (item) => {
        this.setState({
            cliente_id_selected: item.id
        });

        setTimeout(() => {
            console.log("El id del cliente seleccionado es el: " + this.state.cliente_id_selected + " , correspondiente a: " + item.nombre);
        }, 1000);

        document.getElementById('cliente_selected').style.display = "block";
        document.getElementById('cliente_selected_text').value = item.nombre;

        const stateAccordion = document.getElementById('clientes');
        stateAccordion.value = undefined;

        document.getElementById("search_cliente").value = "";
    }

    //PROCEDIMIENTOS
    _getProcedimientos = () => {
        this.setState({ loading_procedimientos: true });

        let Parameters = '?action=getJSON&get=procedimientos_lista';

        fetch(this.state.url + Parameters)
            .then((res) => res.json())
            .then((responseJson) => {

                //Guardamos la lista de procedimientos que vienen del API en el store de Redux
                this.props.dispatch(getProcedimientos(responseJson))

                this.setState({
                    loading_procedimientos: false,
                    procedimientos: this.props.procedimientos.list,
                });

                Swal.close();
            })
            .catch((error) => {
                console.log(error)
            });
    }

    _getProcedimiento = (item) => {

        this.setState({
            procedimiento_id_selected: item.id,
            procedimiento_precio_sug_selected: item.precio_sug
        });

        setTimeout(() => {
            console.log("El id del procedimiento seleccionado es el: " + this.state.procedimiento_id_selected + " , correspondiente a: " + item.nombre);
            console.log("El precio del procedimiento seleccionado es: L " + this.state.procedimiento_precio_sug_selected + " , correspondiente a: " + item.nombre);
        }, 1000);

        document.getElementById('procedimiento_selected').style.display = "block";
        document.getElementById('procedimiento_selected_text').value = item.nombre;
        document.getElementById('procedimiento_selected_precio').value = item.precio_sug;

        const stateAccordion = document.getElementById('procedimientos');
        stateAccordion.value = undefined;

        document.getElementById("search_procedimiento").value = "";
    }

    //TÉCNICOS
    _getTecnicos = () => {
        this.setState({ loading_tecnicos: true });

        let Parameters = '?action=getJSON&get=tecnicos_lista';

        fetch(this.state.url + Parameters)
            .then((res) => res.json())
            .then((responseJson) => {

                this.setState({
                    loading_tecnicos: false,
                    tecnicos: responseJson
                });
                Swal.close();
            })
            .catch((error) => {
                console.log(error)
            });
    }

    _getTecnico = (item, index, id_element) => {

        let itemArray = this.state.itemArray;

        if (!localStorage.getItem('arrayTecnicos')) {
            let arrayTecnicos = [];

            arrayTecnicos.push({ id_tecnico: item.id, id_element: id_element, id_option: item.id + "_" + id_element });

            localStorage.setItem('arrayTecnicos', JSON.stringify(arrayTecnicos));

            document.getElementById(index + "_" + id_element).style.color = '#43D440';

            console.log(localStorage.getItem('arrayTecnicos'));
        } else {
            let arrayTecnicos = JSON.parse(localStorage.getItem('arrayTecnicos'));

            for (let i = 0; i < arrayTecnicos.length; i++) {
                console.log(arrayTecnicos[i].id_tecnico + "_" + id_element);
                if (arrayTecnicos[i].id_element == id_element) {
                    if(document.getElementById(arrayTecnicos[i].id_tecnico + "_" + id_element) !== null){
                        document.getElementById(arrayTecnicos[i].id_tecnico + "_" + id_element).style.color = '#000000';
                    }
                    arrayTecnicos.splice(i, 1);
                }
            }

            arrayTecnicos.push({ id_tecnico: item.id, id_element: id_element, id_option: item.id + "_" + id_element });

            document.getElementById(index + "_" + id_element).style.color = '#43D440';

            localStorage.setItem('arrayTecnicos', JSON.stringify(arrayTecnicos));

            setTimeout(() => {

                let arrayTecnicosLista = this.state.tecnicos;
                //console.log(arrayTecnicosLista);
                //console.log(itemArray);
                for (let z = 0; z < arrayTecnicosLista.length; z++) {
                    for (let y = 0; y < itemArray.length; y++) {
                        //Si un elemento de cada lista de técnicos no está en el arreglo de técnicos
                        if (!this.inArray(document.getElementById(arrayTecnicosLista[z].id + "_" + parseInt(itemArray[y].id_element)), arrayTecnicosLista)) {
                            document.getElementById(arrayTecnicosLista[z].id + "_" + parseInt(itemArray[y].id_element)).disabled = 'false'
                        }
                    }
                }
                //console.log(itemArray);
                let arrayTecnicosSeleccionados = JSON.parse(localStorage.getItem('arrayTecnicos'));
                for (let i = 0; i < arrayTecnicosSeleccionados.length; i++) {
                    for (let y = 0; y < itemArray.length; y++) {
                        console.log(arrayTecnicosSeleccionados[i].id_tecnico + "_" + parseInt(itemArray[y].id_element));
                        //Si el elemento no tiene letras verdes en el texto, entonces le aplicamos la propiedad disabled="true"
                        if(document.getElementById(arrayTecnicosSeleccionados[i].id_tecnico + "_" + parseInt(itemArray[y].id_element)) === null){
                            continue;
                        } else if (document.getElementById(arrayTecnicosSeleccionados[i].id_tecnico + "_" + parseInt(itemArray[y].id_element)) !== null) {
                            if(document.getElementById(arrayTecnicosSeleccionados[i].id_tecnico + "_" + parseInt(itemArray[y].id_element)).style.color !== 'rgb(67, 212, 64)'){
                                document.getElementById(arrayTecnicosSeleccionados[i].id_tecnico + "_" + parseInt(itemArray[y].id_element)).disabled = 'true'
                            }
                        }
                    }
                }
            }, 1000);



        }
        document.getElementById('agregar').disabled = "false";
        return;

        if (localStorage.getItem('arrayTecnicos')) {
            let arrayTecnicos = JSON.parse(localStorage.getItem('arrayTecnicos'));

            for (let i = 0; i < arrayTecnicos.length; i++) {
                for (let y = 0; y < itemArray.length; y++) {
                    //Si el elemento tiene letras verdes en el texto, entonces no le aplicamos la propiedad disabled="true"
                    if (document.getElementById(arrayTecnicos[i].id_tecnico + "_" + parseInt(itemArray[y].id_element)).style.color !== 'rgb(67, 212, 64)' && document.getElementById(arrayTecnicos[i].id_tecnico + "_" + parseInt(itemArray[y].id_element)).disabled === "true") {
                        document.getElementById(arrayTecnicos[i].id_tecnico + "_" + parseInt(itemArray[y].id_element)).disabled = 'false'
                    }
                }
            }
        }

        return;
        this.setState({
            tecnico_id_selected: item.id
        });

        setTimeout(() => {
            console.log("El id del técnico seleccionado es el: " + this.state.tecnico_id_selected + " , correspondiente a: " + item.nombre);
        }, 1000);

        document.getElementById('tecnico_selected').style.display = "block";
        document.getElementById('tecnico_selected_text').value = item.nombre;

        const stateAccordion = document.getElementById('tecnicos');
        stateAccordion.value = undefined;

        document.getElementById("search_tecnico").value = "";
    }

    //VENDEDORES
    _getVendedores = () => {
        this.setState({ loading_vendedores: true });

        let Parameters = '?action=getJSON&get=vendedores_recepcionistas_lista';

        fetch(this.state.url + Parameters)
            .then((res) => res.json())
            .then((responseJson) => {

                this.setState({
                    loading_vendedores: false,
                    vendedores: responseJson
                });
                Swal.close();
            })
            .catch((error) => {
                console.log(error)
            });
    }

    _getVendedor = (item) => {

        this.setState({
            vendedor_recepcionista_id_selected: item.id
        });

        setTimeout(() => {
            console.log("El id del vendedor/recepcionista seleccionado es el: " + this.state.vendedor_recepcionista_id_selected + " , correspondiente a: " + item.nombre);
        }, 1000);

        document.getElementById('vendedor_selected').style.display = "block";
        document.getElementById('vendedor_selected_text').value = item.nombre + " - (" + item.perfil + ")";

        const stateAccordion = document.getElementById('vendedores');
        stateAccordion.value = undefined;

        document.getElementById("search_vendedor").value = "";
    }

    dateChanged = (event) => {
        let datetime = event.detail.value;

        const dateFromIonDatetime = datetime;
        const formattedString = format(parseISO(dateFromIonDatetime), 'yyyy-MM-dd hh:mm:ss a');
        const formattedStringDate = format(parseISO(dateFromIonDatetime), 'yyyy-MM-dd');

        let optionsDate = {};
        let optionsHour = {};

        this.setState({
            fecha_cita_selected: formattedString
        })

        //FECHA FORMATEADA EN ESPAÑOL
        let d = new Date(formattedString);
        let date = '';
        let hour = '';

        optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        optionsHour = { hour: 'numeric', minute: 'numeric', hour12: false };

        date = d.toLocaleDateString("es-MX", optionsDate);
        hour = d.toLocaleString("es-MX", optionsHour);

        //Fecha que será guardada en la base de datos
        let dateAndTimeOfAppointment = formattedStringDate + " " + hour;

        this.setState({
            date_selected: dateAndTimeOfAppointment
        });

        let datex = new Date(formattedString);
        let datePast = isPast(datex);

        if (datePast) {
            Swal.fire({
                title: 'Fecha no válida',
                text: 'No se permite establecer una fecha u hora del pasado como una fecha para cita.',
                icon: 'info',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#E0218A'
            });

            this.setState({
                date_selected: ''
            });
            return;
        } else {
            console.log("Es una fecha en el futuro");
        }

        console.log("Cita agendada para el " + date + " a las " + hour + " horas");

        console.log(dateFromIonDatetime);
        console.log(this.state.date_selected);

        setTimeout(() => {
            console.log("Fecha y hora seleccionada para la cita: " + dateAndTimeOfAppointment);
        }, 1000);

        this.setState({
            show_picker: false,
            fecha_rotulo: "Fecha y hora seleccionadas: " + date + " a las " + hour + " horas"
        });

        document.getElementById("fecha_rotulo").style.display = 'block';
    }

    showPicker = () => {
        this.setState({
            show_picker: true
        })
    }

    registrarCita = () => {

        let cliente = this.state.cliente_id_selected;
        let procedimiento = this.state.procedimiento_id_selected;
        let tecnico = this.state.tecnico_id_selected;
        let vendedor_recepcionista = this.state.vendedor_recepcionista_id_selected;
        let fecha_cita = this.state.date_selected;
        let procedimiento_precio_sug = document.getElementById('procedimiento_selected_precio').value;

        if (cliente != '' && procedimiento != '' && procedimiento_precio_sug != '' && tecnico != '' &&
            vendedor_recepcionista != '' && fecha_cita.length > 0) {

            let inputFile = document.getElementById('imagen-anticipo').files[0]; // En la posición 0; es decir, el primer elemento

            if (typeof (inputFile) !== "undefined") {

                this.setState({
                    imagen_anticipo_uploading: true
                });

                if (inputFile) {
                    let formData = new FormData();
                    formData.append("archivo", inputFile);

                    fetch(this.state.url_guardar_imagen + "/guardar.php?foto_tipo=anticipo", {
                        method: 'POST',
                        body: formData,
                    }).then(respuesta => respuesta.text())
                        .then(nombreArchivo => {
                            this.setState({
                                image_updloaded_name: nombreArchivo,
                                imagen_anticipo_uploading: false,
                                sending: true
                            });

                            setTimeout(() => {

                                let image_updloaded_name = this.state.image_updloaded_name;

                                var fec_ing = "NOW()";
                                var usr_ing = this.state.usuario_logueado;

                                let image_uploaded_path = this.state.url_guardar_imagen + "/archivos_imagenes/" + image_updloaded_name;

                                var valuesCita = {
                                    cliente_id: cliente, proc_id: procedimiento, proc_precio_sug: procedimiento_precio_sug,
                                    tecnico_id: tecnico, vend_recep_id: vendedor_recepcionista,
                                    deposito_foto: image_uploaded_path, fecha_hora: fecha_cita, fec_ing: fec_ing, usr_ing: usr_ing
                                }

                                const requestOptionsCita = prepararPost(valuesCita, "cita", "setJsons", "jsonSingle");

                                fetch(this.state.url, requestOptionsCita)
                                    .then((response) => {
                                        if (response.status === 200) {
                                            Swal.close();

                                            this.setState({
                                                sending: false
                                            });

                                            Swal.fire({
                                                title: '¡Éxito!',
                                                text: '¡Cita ingresada exitosamente!',
                                                icon: 'success',
                                                confirmButtonText: 'Aceptar',
                                                confirmButtonColor: '#E0218A'
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    this.setState({ redireccionar_atras: true });
                                                }
                                            })
                                        } else {
                                            Swal.fire({
                                                title: 'Algo falló',
                                                text: 'Ocurrió un error inesperado, no se pudo ingresar la cita, favor comunicarse con el desarrollador.',
                                                icon: 'error',
                                                confirmButtonText: 'Aceptar',
                                                confirmButtonColor: 'red'
                                            });
                                        }
                                    })
                            }, 2000);
                        });
                    return true;
                }
            } else { //Si no se adjunta la imagen del anticipo, se pregunta la clave maestra de autorización que el administrador ha establecido previamente
                Swal.fire({
                    title: 'Imagen de anticipo no adjuntada, ingrese la clave maestra para registrar cita sin imagen de anticipo',
                    input: 'text',
                    inputAttributes: {
                        autocapitalize: 'off'
                    },
                    showCancelButton: true,
                    confirmButtonText: 'OK',
                    showLoaderOnConfirm: true,
                    preConfirm: async (valor) => {
                        return fetch(this.state.url + "?action=getJSON&get=valor_parametro&id=1&valor=" + valor)
                            .then(response => {
                                if (!response.ok) {
                                    //throw new Error(response.statusText)
                                    alert("Error en la solicitud.")
                                }
                                return response.json()
                            })
                            .catch(error => {
                                Swal.showValidationMessage(
                                    //`Request failed: ${error}`
                                    alert("Falló la solicitud, error: " + error)
                                )
                            })
                    },
                    allowOutsideClick: () => !Swal.isLoading()
                }).then((result) => {
                    let resultado = result.value[0].validated;

                    if (resultado == 1) {

                        this.setState({ sending: true })

                        setTimeout(() => {

                            var fec_ing = "NOW()";
                            var usr_ing = this.state.usuario_logueado;

                            var valuesCita = {
                                cliente_id: cliente, proc_id: procedimiento,
                                proc_precio_sug: procedimiento_precio_sug,
                                tecnico_id: tecnico, vend_recep_id: vendedor_recepcionista,
                                fecha_hora: fecha_cita, fec_ing: fec_ing, usr_ing: usr_ing
                            }

                            const requestOptionsCita = prepararPost(valuesCita, "cita", "setJsons", "jsonSingle");

                            fetch(this.state.url, requestOptionsCita)
                                .then((response) => {
                                    if (response.status === 200) {
                                        Swal.close();

                                        this.setState({
                                            sending: false
                                        });

                                        Swal.fire({
                                            title: '¡Éxito!',
                                            text: '¡Cita ingresada exitosamente!',
                                            icon: 'success',
                                            confirmButtonText: 'Aceptar',
                                            confirmButtonColor: '#E0218A'
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                this.setState({ redireccionar_atras: true });
                                            }
                                        })
                                    } else {
                                        Swal.fire({
                                            title: 'Algo falló',
                                            text: 'Ocurrió un error inesperado, no se pudo ingresar la cita, favor comunicarse con el desarrollador.',
                                            icon: 'error',
                                            confirmButtonText: 'Aceptar',
                                            confirmButtonColor: 'red'
                                        });
                                    }
                                })
                        }, 2000);
                    } else {
                        Swal.fire({
                            title: 'Clave maestra incorrecta',
                            text: 'La clave maestra ingresada no es correcta',
                            icon: 'error',
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: '#E0218A'
                        });
                    }
                })
                /*
                Swal.fire({
                    title: 'Faltan datos',
                    text: 'La imagen del depósito es obligatoria, favor adjunte la imagen del depósito',
                    icon: 'warning',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#E0218A'
                });
                */
            }
        } else {
            Swal.fire({
                title: 'Faltan datos',
                text: 'Es necesario seleccionar un valor de cada opción del formulario',
                icon: 'info',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#E0218A'
            });
        }
    }

    agregarSetTecnicoProcedimiento = () => {
        let itemArray = this.state.itemArray;
        let itemArraySize = itemArray.length;

        const item = this.state.itemArray;
        const title = itemArray.length + 1;
        const text = '';
        const id_element = itemArraySize + 1;
        item.push({ title, text, id_element });
        this.setState({ itemArray: item });

        document.getElementById('agregar').disabled = "true";

        setTimeout(() => {
            if (localStorage.getItem('arrayTecnicos')) {
                let arrayTecnicos = JSON.parse(localStorage.getItem('arrayTecnicos'));
                console.log(arrayTecnicos);
                for (let i = 0; i < arrayTecnicos.length; i++) {
                    for (let y = 0; y < itemArray.length; y++) {
                        //Si el elemento tiene letras verdes en el texto, entonces no le aplicamos la propiedad disabled="true"
                        if (document.getElementById(arrayTecnicos[i].id_tecnico + "_" + parseInt(itemArray[y].id_element)).style.color === 'rgb(67, 212, 64)') {
                            continue;
                        } else {
                            document.getElementById(arrayTecnicos[i].id_tecnico + "_" + parseInt(itemArray[y].id_element)).disabled = 'false'
                        }
                        document.getElementById(arrayTecnicos[i].id_tecnico + "_" + parseInt(itemArray[y].id_element)).disabled = 'true'
                        console.log(arrayTecnicos[i].id_tecnico + "_" + parseInt(itemArray[y].id_element));
                    }
                }
            }
        }, 1000);

    }

    quitarSetTecnicoProcedimiento = () => {
        let itemArray = this.state.itemArray;

        //Primero eliminamos el último elemento del arreglo, el de los HTML
        itemArray.pop();
        this.setState({ itemarray: itemArray });
        itemArray = this.state.itemArray;

        //Luego comprobamos que exista la localStorage de arrayTecnicos
        if (localStorage.getItem('arrayTecnicos')) {
            //Como ya sabemos que existe una localStorage de arrayTecnicos, lo traemos como un arreglo
            let arrayTecnicos = JSON.parse(localStorage.getItem('arrayTecnicos'));
            let idElementsItemArray = []; //Definimos una variable para meter ahí todos los índices de los elementos HTML, y así saber cuántos elementos hay

            //Metemos en la variable de arreglo cada índice de itemArray
            for (let i = 0; i < itemArray.length; i++) {
                idElementsItemArray.push(itemArray[i].id_element);
            }

            //Verificamos cuáles de los índices id_element de la localStorage arrayTecnicos no hace match con
            //el arreglo idElementsItemArray para eliminarlo del arreglo arrayTecnicos
            for (let y = 0; y < arrayTecnicos.length; y++) {
                if (!this.inArray(arrayTecnicos[y].id_element, idElementsItemArray)) {
                    arrayTecnicos.splice(y, 1);
                }
            }
            //Finalmente actualizamos la localStorage con el resultado del ciclo anterior
            localStorage.setItem('arrayTecnicos', JSON.stringify(arrayTecnicos));
        }
        document.getElementById('agregar').disabled = "false";

        return;
    }

    inArray = (needle, haystack) => {
        var length = haystack.length;
        for (var i = 0; i < length; i++) {
            if (needle == haystack[i].id_option) return true;
        }
        return false;
    }

    render() {

        if (this.state.loading_clientes && this.state.loading_procedimientos &&
            this.state.loading_tecnicos && this.state.loading_vendedores) {
            return <h1>
                {Swal.showLoading()}
            </h1>;
        }

        if (this.state.imagen_anticipo_uploading) {
            return <h1>
                {Swal.showLoading()}
            </h1>
        }

        if (this.state.sending) {
            return <h1>
                {Swal.showLoading()}
            </h1>
        }

        if (this.state.redireccionar_atras) {
            return (<Redirect to={'/citas'} />)
        }

        let clientes = this.state.clientes;
        let procedimientos = this.state.procedimientos;
        let vendedores = this.state.vendedores;
        let tecnicos = this.state.tecnicos;

        let txn = [];
        for (let w = 0; w < this.state.itemArray.length; w++) {
            txn[w] = tecnicos;
        }
        console.log(txn);
        let precio_readonly = "";

        this.state.usuario_perfil === 1 ? precio_readonly = "false" : precio_readonly = "true";

        return (
            <IonPage>
                <IonContent>
                    <IonHeader style={{ textAlign: "right" }}>
                        <IonToolbar>

                            <IonButtons slot="start">
                                <IonBackButton defaultHref="/citas" icon={arrowBackOutline} />
                            </IonButtons>

                            <IonTitle style={{ fontFamily: "sans-serif" }}><b>CREAR CITA</b></IonTitle>
                        </IonToolbar>
                    </IonHeader>

                    {/* LISTA DE CLIENTES */}
                    <IonAccordionGroup id="clientes">
                        <IonAccordion value="clientes">
                            <IonItem slot="header">
                                <b><IonLabel>Seleccionar Cliente:</IonLabel></b>
                            </IonItem>

                            <IonList slot="content">
                                <IonSearchbar id="search_cliente" onIonChange={(e) => this.buscarEnLista("cliente")} showCancelButton="focus" placeholder="Buscar cliente"></IonSearchbar>
                                {
                                    clientes.filter(cliente => cliente.nombre.includes(this.state.search_string_cliente)).map(item => (
                                        <IonItem key={item.id} onClick={(e) => this._getCliente(item)}>
                                            {item.id} - {item.nombre}
                                        </IonItem>
                                    ))
                                }
                            </IonList>
                        </IonAccordion>
                        <IonItemGroup>
                            <IonList style={{ "display": "none" }} id="cliente_selected">
                                <IonItem>
                                    <IonInput id="cliente_selected_text" type="text" readonly="true" placeholder="Cliente">Cliente:&nbsp;</IonInput>
                                </IonItem>
                            </IonList>
                        </IonItemGroup>
                    </IonAccordionGroup>

                    {/* LISTA DE VENDEDORES / RECEPCIONISTAS */}
                    <IonAccordionGroup id="vendedores">
                        <IonAccordion value="vendedores">
                            <IonItem slot="header">
                                <b><IonLabel>Seleccionar Vendedor/Recepcionista:</IonLabel></b>
                            </IonItem>

                            <IonList slot="content">
                                <IonSearchbar id="search_vendedor" onIonChange={(e) => this.buscarEnLista("vendedor")} showCancelButton="focus" placeholder="Buscar vendedor o recepcionista"></IonSearchbar>
                                {
                                    vendedores.filter(vendedor => vendedor.nombre.includes(this.state.search_string_vendedor)).map(item => (
                                        <IonItem key={item.id} onClick={(e) => this._getVendedor(item)}>
                                            {item.id} - {item.nombre} ({item.perfil})
                                        </IonItem>
                                    ))
                                }
                            </IonList>
                        </IonAccordion>
                        <IonItemGroup>
                            <IonList style={{ "display": "none" }} id="vendedor_selected">
                                <IonItem>
                                    <IonInput id="vendedor_selected_text" readonly="true" type="text" placeholder="Vendedor/Recepcionista"></IonInput>
                                </IonItem>
                            </IonList>
                        </IonItemGroup>
                    </IonAccordionGroup>








                    { /* SELECCIONABLE DINAMICO */
                        this.state.itemArray.map((itemx) => {
                            return (

                                <div id={itemx.id_element}>
                                    <hr size="5px" color="black" />
                                    {/* SELECCIONAR FECHA Y HORA */}
                                    <IonItemDivider>
                                        <IonLabel>
                                            <b># {itemx.id_element}</b>
                                        </IonLabel>
                                    </IonItemDivider>
                                    <IonAccordionGroup id="fecha_hora">
                                        <IonAccordion value="fecha_hora">
                                            <IonItem slot="header">
                                                <b><IonLabel>Seleccionar Fecha y Hora:</IonLabel></b>
                                            </IonItem>

                                            <IonList slot="content">
                                                <IonDatetime size="cover" showDefaultButtons="true" onIonChange={(e) => this.dateChanged(e)} doneText="Seleccionar fecha" cancelText="Cancelar" style={{ borderRadius: "8px 8px 8px 8px" }} minuteValues="0,30" hourValues="9,10,11,12,13,14,15,16,17,18" hourCycle="h23"></IonDatetime>
                                            </IonList>
                                        </IonAccordion>

                                        <IonInput id="fecha_rotulo" type="text" style={{ display: "none", left: "5px", right: "5px" }} readonly>{this.state.fecha_rotulo}</IonInput>
                                    </IonAccordionGroup>

                                    {/* LISTA DE TÉCNICOS */}
                                    <IonAccordionGroup id="tecnicos">
                                        <IonAccordion value="tecnicos">
                                            <IonItem slot="header">
                                                <b><IonLabel>Seleccionar Técnico:</IonLabel></b>
                                            </IonItem>

                                            <IonList slot="content">
                                                <IonSearchbar id={"search_tecnico_" + itemx.id_element} onIonChange={(e) => this.buscarEnLista("tecnico", itemx.id_element)} showCancelButton="focus" placeholder="Buscar técnico"></IonSearchbar>
                                                {
                                                    txn[itemx.id_element - 1].filter(tecnico => tecnico.nombre.includes(this.state.search_string_tecnico)).map(item => (
                                                        <IonItem id={item.id + "_" + itemx.id_element} key={item.id} onClick={(e) => this._getTecnico(item, item.id, itemx.id_element)} disabled="false">
                                                            {item.id} - {item.nombre}
                                                        </IonItem>
                                                    ))
                                                }
                                            </IonList>
                                        </IonAccordion>
                                        <IonItemGroup>
                                            <IonList style={{ "display": "none" }} id="tecnico_selected">
                                                <IonItem>
                                                    <IonInput readonly="true" id="tecnico_selected_text" type="text" placeholder="Técnico">Técnico:&nbsp;</IonInput>
                                                </IonItem>
                                            </IonList>
                                        </IonItemGroup>
                                    </IonAccordionGroup>

                                    {/* LISTA DE PROCEDIMIENTOS */}
                                    <IonAccordionGroup id="procedimientos">
                                        <IonAccordion value="procedimientos">
                                            <IonItem slot="header">
                                                <b><IonLabel>Seleccionar Procedimiento:</IonLabel></b>
                                            </IonItem>

                                            <IonList slot="content">
                                                <IonSearchbar id="search_procedimiento" onIonChange={(e) => this.buscarEnLista("procedimiento")} showCancelButton="focus" placeholder="Buscar procedimiento"></IonSearchbar>
                                                {
                                                    procedimientos.filter(procedimiento => procedimiento.nombre.includes(this.state.search_string_procedimiento)).map(item => (
                                                        <IonItem key={item.id} onClick={(e) => this._getProcedimiento(item)}>
                                                            {item.id} - {item.nombre}
                                                        </IonItem>

                                                    ))
                                                }
                                            </IonList>
                                        </IonAccordion>
                                        <IonItemGroup>
                                            <IonList style={{ "display": "none" }} id="procedimiento_selected">
                                                <IonItem>
                                                    <IonInput id="procedimiento_selected_text" readonly="true" type="text" placeholder="Procedimiento"></IonInput>
                                                </IonItem>
                                                <IonItem>
                                                    <IonInput id="procedimiento_selected_precio" readonly={precio_readonly} type="number" placeholder="Precio">Precio (L):&nbsp;</IonInput>
                                                </IonItem>
                                            </IonList>
                                        </IonItemGroup>
                                    </IonAccordionGroup>
                                </div>
                            )
                        })}

















                </IonContent>
                <IonFooter>
                    <IonList>
                        <IonItem>
                            <IonLabel style={{ fontSize: "12px" }}>Seleccionar foto de anticipo</IonLabel>
                        </IonItem>
                        <IonItem>
                            <input id="imagen-anticipo" type="file" accept='image/*,.pdf'></input>
                        </IonItem>
                    </IonList>
                    <IonGrid>
                        <IonRow>
                            <IonCol size="6"><IonButton color="dark" expand="block" onClick={() => this.agregarSetTecnicoProcedimiento()} id="agregar">Agregar (+)</IonButton></IonCol>
                            <IonCol size="6"><IonButton color="danger" expand="block" onClick={() => this.quitarSetTecnicoProcedimiento()}>Quitar Último (X)</IonButton></IonCol>
                        </IonRow>
                    </IonGrid>
                    <IonButton color="favorite" expand="block" onClick={() => this.registrarCita()} disabled="false">Registrar Cita</IonButton>
                </IonFooter>
            </IonPage>
        )
    }
}

export default connect(mapStateToProps)(CitaCrear);