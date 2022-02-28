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

        //Limpiamos la localStorage de procedimientos seleccionados
        if (localStorage.getItem('arrayProcedimientos')) {
            localStorage.removeItem('arrayProcedimientos');
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
        let itemArray = this.state.itemArray;
        let arrayPreDisabledOptions = [];

        switch (kindOf) {
            case "cliente":
                text = document.getElementById('search_cliente').value;

                this.setState({
                    search_string_cliente: text
                });
                break;
            case "procedimiento":
                id = "search_procedimiento_" + id_element;
                text = document.getElementById(id).value;

                this.setState({
                    search_string_procedimiento: text
                });

                let arrayProcedimientosLista = this.state.tecnicos;
                let arrayProcedimientosSeleccionados = JSON.parse(localStorage.getItem('arrayProcedimientos'));

                // Mecánica para marcar los elementos deshabilitados cuando se busca en el área de searching
                for (let y = 0; y < arrayProcedimientosSeleccionados.length; y++) {
                    for (let x = 0; x < arrayProcedimientosSeleccionados.length; x++) {
                        arrayPreDisabledOptions.push({ item: arrayProcedimientosSeleccionados[x].id_tecnico + "_" + parseInt(y + 1) })
                    }
                    if (y + 1 === arrayProcedimientosSeleccionados.length) {
                        break;
                    }
                }

                for (let r = 0; r < arrayPreDisabledOptions.length; r++) {
                    if (document.getElementById(arrayPreDisabledOptions[r].item) !== null) {
                        if (!this.inArray(arrayPreDisabledOptions[r].item, arrayProcedimientosSeleccionados, "1")) {
                            setTimeout(() => {
                                console.log(arrayPreDisabledOptions[r].item + " no está en el arreglo de procedimientos seleccionados.")
                                document.getElementById(arrayPreDisabledOptions[r].item).disabled = true;
                            }, 500)
                        }
                    }
                }
                //

                if (text === "") {
                    setTimeout(() => {
                        for (let z = 0; z < arrayProcedimientosLista.length; z++) {
                            for (let y = 0; y < itemArray.length; y++) {
                                //Si un elemento de cada lista de procedimientos no está en el arreglo de procedimientos
                                if (!this.inArray(document.getElementById(arrayProcedimientosLista[z].id + "_" + parseInt(itemArray[y].id_element)), arrayProcedimientosLista, "1")) {
                                    document.getElementById(arrayProcedimientosLista[z].id + "_" + parseInt(itemArray[y].id_element)).disabled = 'false'
                                } else {
                                    document.getElementById(arrayProcedimientosLista[z].id + "_" + parseInt(itemArray[y].id_element)).disabled = 'true'
                                }
                            }
                        }

                        if (localStorage.getItem('arrayProcedimientos')) {
                            for (let i = 0; i < arrayProcedimientosSeleccionados.length; i++) {
                                for (let y = 0; y < itemArray.length; y++) {
                                    //Si el elemento no tiene letras verdes en el texto, entonces le aplicamos la propiedad disabled="true"
                                    if (this.inArray((arrayProcedimientosSeleccionados[i].id_proc + "_" + parseInt(itemArray[y].id_element)), arrayProcedimientosSeleccionados, "1")) {
                                        document.getElementById(arrayProcedimientosSeleccionados[i].id_proc + "_" + parseInt(itemArray[y].id_element)).style.color = '#43D440';
                                    }

                                    if (document.getElementById(arrayProcedimientosSeleccionados[i].id_proc + "_" + parseInt(itemArray[y].id_element)).style.color !== 'rgb(67, 212, 64)') {
                                        document.getElementById(arrayProcedimientosSeleccionados[i].id_proc + "_" + parseInt(itemArray[y].id_element)).disabled = 'true'
                                    }
                                }
                            }
                        }

                    }, 500);
                }

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

                let arrayTecnicosLista = this.state.tecnicos;
                let arrayTecnicosSeleccionados = JSON.parse(localStorage.getItem('arrayTecnicos'));

                // Mecánica para marcar los elementos deshabilitados cuando se busca en el área de searching
                for (let y = 0; y < arrayTecnicosSeleccionados.length; y++) {
                    for (let x = 0; x < arrayTecnicosSeleccionados.length; x++) {
                        arrayPreDisabledOptions.push({ item: arrayTecnicosSeleccionados[x].id_tecnico + "_" + parseInt(y + 1) })
                    }
                    if (y + 1 === arrayTecnicosSeleccionados.length) {
                        break;
                    }
                }

                for (let r = 0; r < arrayPreDisabledOptions.length; r++) {
                    if (document.getElementById(arrayPreDisabledOptions[r].item) !== null) {
                        if (!this.inArray(arrayPreDisabledOptions[r].item, arrayTecnicosSeleccionados, "1")) {
                            setTimeout(() => {
                                document.getElementById(arrayPreDisabledOptions[r].item).disabled = true;
                            }, 500)
                        }
                    }
                }
                //

                if (text === "") {
                    setTimeout(() => {
                        for (let z = 0; z < arrayTecnicosLista.length; z++) {
                            for (let y = 0; y < itemArray.length; y++) {
                                //Si un elemento de cada lista de técnicos no está en el arreglo de técnicos
                                if (!this.inArray(document.getElementById(arrayTecnicosLista[z].id + "_" + parseInt(itemArray[y].id_element)), arrayTecnicosLista, "1")) {
                                    document.getElementById(arrayTecnicosLista[z].id + "_" + parseInt(itemArray[y].id_element)).disabled = 'false'
                                } else {
                                    document.getElementById(arrayTecnicosLista[z].id + "_" + parseInt(itemArray[y].id_element)).disabled = 'true'
                                }
                            }
                        }

                        if (localStorage.getItem('arrayTecnicos')) {
                            for (let i = 0; i < arrayTecnicosSeleccionados.length; i++) {
                                for (let y = 0; y < itemArray.length; y++) {
                                    //Si el elemento no tiene letras verdes en el texto, entonces le aplicamos la propiedad disabled="true"
                                    if (this.inArray((arrayTecnicosSeleccionados[i].id_tecnico + "_" + parseInt(itemArray[y].id_element)), arrayTecnicosSeleccionados, "1")) {
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

    _getProcedimiento = (item, index, id_element) => {
        let itemArray = this.state.itemArray;

        if (!localStorage.getItem('arrayProcedimientos')) {
            let arrayProcedimientos = [];

            arrayProcedimientos.push({ id_proc: item.id, id_element: id_element, id_option: item.id + "_" + id_element });

            localStorage.setItem('arrayProcedimientos', JSON.stringify(arrayProcedimientos));

            document.getElementById(index + "_" + id_element).style.color = '#43D440';
        } else {
            let arrayProcedimientos = JSON.parse(localStorage.getItem('arrayProcedimientos'));

            //Si al tocar un procedimiento éste ya estaba en el arreglo, lo eliminamos del arreglo y lo pintamos
            //en negro, si no estaba entonces simplemente lo agregamos al arreglo y lo pintamos en verde
            if (this.inArray(index + "_" + id_element, arrayProcedimientos, "1")) {
                for (let k = 0; k < arrayProcedimientos.length; k++) {
                    if (arrayProcedimientos[k].id_option === index + "_" + id_element) {
                        arrayProcedimientos.splice(k, 1);
                        localStorage.setItem('arrayProcedimientos', JSON.stringify(arrayProcedimientos));
                    }
                }

                document.getElementById(index + "_" + id_element).style.color = '#000000';
            } else {
                arrayProcedimientos.push({ id_proc: item.id, id_element: id_element, id_option: item.id + "_" + id_element });
                localStorage.setItem('arrayProcedimientos', JSON.stringify(arrayProcedimientos));
                document.getElementById(index + "_" + id_element).style.color = '#43D440';
            }
            //

            setTimeout(() => {
                let arrayProcedimientosLista = this.state.procedimientos;

                for (let z = 0; z < arrayProcedimientosLista.length; z++) {
                    for (let y = 0; y < itemArray.length; y++) {
                        //Si un elemento de cada lista de procedimientos no está en el arreglo de procedimientos
                        if (!this.inArray(document.getElementById(arrayProcedimientosLista[z].id + "_" + parseInt(itemArray[y].id_element)), arrayProcedimientosLista, "1")) {
                            document.getElementById(arrayProcedimientosLista[z].id + "_" + parseInt(itemArray[y].id_element)).disabled = 'false'
                        }
                    }
                }

                let arrayProcedimientosSeleccionados = JSON.parse(localStorage.getItem('arrayProcedimientos'));
                for (let i = 0; i < arrayProcedimientosSeleccionados.length; i++) {
                    for (let y = 0; y < itemArray.length; y++) {
                        //Si el elemento no tiene letras verdes en el texto, entonces le aplicamos la propiedad disabled="true"
                        if (document.getElementById(arrayProcedimientosSeleccionados[i].id_proc + "_" + parseInt(itemArray[y].id_element)) === null) {
                            continue;
                        } else if (document.getElementById(arrayProcedimientosSeleccionados[i].id_proc + "_" + parseInt(itemArray[y].id_element)) !== null) {

                            if (document.getElementById(arrayProcedimientosSeleccionados[i].id_proc + "_" + parseInt(itemArray[y].id_element)).style.color !== 'rgb(67, 212, 64)') {
                                document.getElementById(arrayProcedimientosSeleccionados[i].id_proc + "_" + parseInt(itemArray[y].id_element)).disabled = 'true'
                            }
                        }
                    }
                }
            }, 1000);
        }
        document.getElementById('agregar').disabled = "false";
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
        } else {
            let arrayTecnicos = JSON.parse(localStorage.getItem('arrayTecnicos'));

            for (let i = 0; i < arrayTecnicos.length; i++) {
                if (arrayTecnicos[i].id_element == id_element) {
                    if (document.getElementById(arrayTecnicos[i].id_tecnico + "_" + id_element) !== null) {
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
                for (let z = 0; z < arrayTecnicosLista.length; z++) {
                    for (let y = 0; y < itemArray.length; y++) {
                        //Si un elemento de cada lista de técnicos no está en el arreglo de técnicos
                        if (!this.inArray(document.getElementById(arrayTecnicosLista[z].id + "_" + parseInt(itemArray[y].id_element)), arrayTecnicosLista, "1")) {
                            document.getElementById(arrayTecnicosLista[z].id + "_" + parseInt(itemArray[y].id_element)).disabled = 'false'
                        }
                    }
                }

                let arrayTecnicosSeleccionados = JSON.parse(localStorage.getItem('arrayTecnicos'));
                for (let i = 0; i < arrayTecnicosSeleccionados.length; i++) {
                    for (let y = 0; y < itemArray.length; y++) {
                        //Si el elemento no tiene letras verdes en el texto, entonces le aplicamos la propiedad disabled="true"
                        if (document.getElementById(arrayTecnicosSeleccionados[i].id_tecnico + "_" + parseInt(itemArray[y].id_element)) === null) {
                            continue;
                        } else if (document.getElementById(arrayTecnicosSeleccionados[i].id_tecnico + "_" + parseInt(itemArray[y].id_element)) !== null) {
                            if (document.getElementById(arrayTecnicosSeleccionados[i].id_tecnico + "_" + parseInt(itemArray[y].id_element)).style.color !== 'rgb(67, 212, 64)') {
                                document.getElementById(arrayTecnicosSeleccionados[i].id_tecnico + "_" + parseInt(itemArray[y].id_element)).disabled = 'true'
                            }
                        }
                    }
                }
            }, 1000);
        }
        document.getElementById('agregar').disabled = "false";
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
        const id_element = itemArraySize + 1;
        item.push({ id_element });
        this.setState({ itemArray: item });

        document.getElementById('agregar').disabled = "true";

        setTimeout(() => {
            if (localStorage.getItem('arrayTecnicos')) {
                let arrayTecnicos = JSON.parse(localStorage.getItem('arrayTecnicos'));
                for (let i = 0; i < arrayTecnicos.length; i++) {
                    for (let y = 0; y < itemArray.length; y++) {
                        //Si el elemento tiene letras verdes en el texto, entonces no le aplicamos la propiedad disabled="true"
                        if (document.getElementById(arrayTecnicos[i].id_tecnico + "_" + parseInt(itemArray[y].id_element)) !== null) {
                            if (document.getElementById(arrayTecnicos[i].id_tecnico + "_" + parseInt(itemArray[y].id_element)).style.color === 'rgb(67, 212, 64)') {
                                continue;
                            } else {
                                document.getElementById(arrayTecnicos[i].id_tecnico + "_" + parseInt(itemArray[y].id_element)).disabled = 'false'
                            }
                            document.getElementById(arrayTecnicos[i].id_tecnico + "_" + parseInt(itemArray[y].id_element)).disabled = 'true'
                        }
                    }
                }
            }

            if (localStorage.getItem('arrayProcedimientos')) {
                let arrayProcedimientos = JSON.parse(localStorage.getItem('arrayProcedimientos'));

                for (let i = 0; i < arrayProcedimientos.length; i++) {
                    for (let y = 0; y < itemArray.length; y++) {
                        //Si el elemento tiene letras verdes en el texto, entonces no le aplicamos la propiedad disabled="true"
                        if (document.getElementById(arrayProcedimientos[i].id_proc + "_" + parseInt(itemArray[y].id_element)) !== null) {
                            if (document.getElementById(arrayProcedimientos[i].id_proc + "_" + parseInt(itemArray[y].id_element)).style.color === 'rgb(67, 212, 64)') {
                                continue;
                            } else {
                                document.getElementById(arrayProcedimientos[i].id_proc + "_" + parseInt(itemArray[y].id_element)).disabled = 'false'
                            }
                            document.getElementById(arrayProcedimientos[i].id_proc + "_" + parseInt(itemArray[y].id_element)).disabled = 'true'
                        }
                    }
                }
            }
        }, 1000);

    }

    quitarSetTecnicoProcedimiento = () => {
        let itemArray = this.state.itemArray;
        //Primero eliminamos el último elemento del arreglo, el de los HTML
        itemArray.pop();
        this.setState({ itemArray: itemArray });
        itemArray = this.state.itemArray;

        //Luego comprobamos que exista la localStorage de arrayTecnicos
        if (localStorage.getItem('arrayTecnicos')) {
            //Como ya sabemos que existe una localStorage de arrayTecnicos, lo traemos como un arreglo
            let arrayTecnicos = JSON.parse(localStorage.getItem('arrayTecnicos'));
            let idElementsItemArray = []; //Definimos una variable para meter ahí todos los índices de los elementos HTML, y así saber cuántos elementos hay
            
            //Metemos en la variable de arreglo cada índice de itemArray
            for (let i = 0; i < itemArray.length; i++) {
                idElementsItemArray.push({ id_element: itemArray[i].id_element });
            }

            if (idElementsItemArray.length > 0) {
                //Verificamos cuáles de los índices id_element de la localStorage arrayTecnicos no hace match con
                //el arreglo idElementsItemArray para eliminarlo del arreglo arrayTecnicos
                for (let y = 0; y < arrayTecnicos.length; y++) {
                    if (!this.inArray(arrayTecnicos[y + 1].id_element, idElementsItemArray, "2")) {
                        arrayTecnicos.splice(y + 1, 1);
                    }
                }
                //Finalmente actualizamos la localStorage con el resultado del ciclo anterior
                localStorage.setItem('arrayTecnicos', JSON.stringify(arrayTecnicos));

                let arrayPreDisabledOptions = [];

                //Mecánica para marcar los elementos deshabilitados cuando se busca en el área de searching
                for (let y = 0; y < arrayTecnicos.length; y++) {
                    for (let x = 0; x < arrayTecnicos.length; x++) {
                        arrayPreDisabledOptions.push({ item: arrayTecnicos[x].id_tecnico + "_" + parseInt(y + 1) })
                    }
                    if (y + 1 === arrayTecnicos.length) {
                        break;
                    }
                }

                for (let r = 0; r < arrayPreDisabledOptions.length; r++) {
                    if (document.getElementById(arrayPreDisabledOptions[r].item) !== null) {
                        if (!this.inArray(arrayPreDisabledOptions[r].item, arrayTecnicos, "1")) {
                            setTimeout(() => {
                                document.getElementById(arrayPreDisabledOptions[r].item).disabled = true;
                            }, 500)
                        }
                    }
                }
            } else {
                localStorage.removeItem('arrayTecnicos')
            }
            //
        }

        ///////////////////////////////////////////////////////////////////////////PROCEDIMIENTOS////////////////////

        //Si ya no hay elements (set de Técnico - Procedimiento), eliminamos la localStorage de Procedimientos
        if (itemArray.length === 0) {
            localStorage.removeItem('arrayProcedimientos');
            return;
        }

        //Comprobamos que exista la localStorage de arrayProcedimientos
        if (localStorage.getItem('arrayProcedimientos')) {
            //Como ya sabemos que existe una localStorage de arrayProcedimientos, lo traemos como un arreglo
            let arrayProcedimientos = JSON.parse(localStorage.getItem('arrayProcedimientos'));

            //Metemos en la variable de arreglo cada id_option eliminado del último element
            let arrElementosQuitados = [];
            for (let i = 0; i < itemArray.length; i++) {
                for (let xy = 0; xy < arrayProcedimientos.length; xy++) {
                    if (!this.inArray(arrayProcedimientos[xy].id_element, itemArray, "2")) {
                        arrElementosQuitados.push(({ id_proc: arrayProcedimientos[xy].id_proc, id_option: arrayProcedimientos[xy].id_option }));
                    }
                }
            }

            //Creamos una variable auxiliar, en la cual vamos a almacenar los id_option que NO estén en el
            //arreglo arrElementosQuitados, es decir, los id_option que no se han eliminado por el usuario
            let arrAuxProcedimientos = [];
            for (let q = 0; q < arrayProcedimientos.length; q++) {
                if (!this.inArray(arrayProcedimientos[q].id_option, arrElementosQuitados, "1")) {
                    arrAuxProcedimientos.push({ id_proc: arrayProcedimientos[q].id_proc, id_element: arrayProcedimientos[q].id_element, id_option: arrayProcedimientos[q].id_option })
                }
            }
            //Sobrescribimos la localStorage de Procedimientos con la variable auxiliar resultante del for anterior
            localStorage.setItem('arrayProcedimientos', JSON.stringify(arrAuxProcedimientos));

            //Para actualizar la vista de procedimientos, sin importa cuantos elements haya
            setTimeout(() => {
                let arr = JSON.parse(localStorage.getItem('arrayProcedimientos'));

                for (let r = 0; r < arrElementosQuitados.length; r++) {
                    if (!this.inArray(arrElementosQuitados[r].id_option, arr, "1")) {
                        setTimeout(() => {
                            for (let m = 0; m < itemArray.length + 1; m++) {
                                document.getElementById(arrElementosQuitados[r].id_proc + "_" + arr[m].id_element).disabled = false;
                            }
                        }, 500)
                    }
                }

                /*if (localStorage.getItem('arrayProcedimientos').length < localStorage.getItem('arrayTecnicos')) {
                    document.getElementById('agregar').disabled = "false";
                } else if (localStorage.getItem('arrayProcedimientos').length >= localStorage.getItem('arrayTecnicos')) {
                    document.getElementById('agregar').disabled = "true";
                }*/

            }, 250)
        }
        document.getElementById('agregar').disabled = "true";
    }

    inArray = (needle, haystack, type) => {
        var length = haystack.length;

        switch (type) {
            case "1":
                for (var i = 0; i < length; i++) {
                    if (needle === haystack[i].id_option) return true;
                }
                return false;
            case "2":
                for (var i = 0; i < length; i++) {
                    if (needle === haystack[i].id_element) return true;
                }
                return false;
            default:
                break;
        }
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

        let pxn = [];
        for (let p = 0; p < this.state.itemArray.length; p++) {
            pxn[p] = procedimientos;
        }
        
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
                        this.state.itemArray.map((itemx, i) => {
                            return (

                                <div id={itemx.id_element} key={i}>
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
                                                <IonSearchbar id={"search_procedimiento_" + itemx.id_element} onIonChange={(e) => this.buscarEnLista("procedimiento", itemx.id_element)} showCancelButton="focus" placeholder="Buscar procedimiento"></IonSearchbar>
                                                {
                                                    pxn[itemx.id_element - 1].filter(procedimiento => procedimiento.nombre.includes(this.state.search_string_procedimiento)).map(item => (
                                                        <IonItem id={item.id + "_" + itemx.id_element} key={item.id} onClick={(e) => this._getProcedimiento(item, item.id, itemx.id_element)}>
                                                            {item.id} - {item.nombre} - {"(" + item.tiempo_estimado + ")"}
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
                    <IonButton color="favorite" expand="block" onClick={() => this.registrarCita()} disabled="true">Registrar Cita</IonButton>
                </IonFooter>
            </IonPage>
        )
    }
}

export default connect(mapStateToProps)(CitaCrear);