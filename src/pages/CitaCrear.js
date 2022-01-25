import {
    IonContent, IonPage,
    IonHeader, IonToolbar,
    IonTitle, IonButtons,
    IonButton, IonList, IonItem,
    IonLabel, IonInput,
    IonBackButton,
    IonFooter, IonAccordion, IonAccordionGroup,
    IonSearchbar, IonItemGroup, IonDatetime,
    IonModal
} from '@ionic/react';
import {
    arrowBackOutline
} from 'ionicons/icons';
import { Component } from 'react'

//import './Home.css';
import { url, prepararPost } from '../utilities/utilities.js'
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
            imagen_anticipo_uploading: false
        }
    }

    UNSAFE_componentWillMount() {
        this._getClientes();
        this._getProcedimientos();
        this._getVendedores();
        this._getTecnicos();
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

    buscarEnLista = (kindOf) => {
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
                text = document.getElementById('search_tecnico').value;

                this.setState({
                    search_string_tecnico: text
                });
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

    _getTecnico = (item) => {

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
        })
    }

    showPicker = () => {
        this.setState({
            show_picker: true
        })
    }

    registrarCita = () => {

        this.setState({
            imagen_anticipo_uploading: true
        });

        let inputFile = document.getElementById('imagen-anticipo').files[0]; // En la posición 0; es decir, el primer elemento

        if (typeof (inputFile) !== "undefined") {
            if (inputFile) {
                let formData = new FormData();
                formData.append("archivo", inputFile);
                fetch(this.state.url_guardar_imagen + "/guardar.php", {
                    method: 'POST',
                    body: formData,
                }).then(respuesta => respuesta.text())
                    .then(nombreArchivo => {
                        this.setState({
                            image_updloaded_name: nombreArchivo,
                            imagen_anticipo_uploading: false
                        });
                        console.log(nombreArchivo);

                        setTimeout(() => {
                            let cliente = this.state.cliente_id_selected;
                            let procedimiento = this.state.procedimiento_id_selected;
                            let tecnico = this.state.tecnico_id_selected;
                            let vendedor_recepcionista = this.state.vendedor_recepcionista_id_selected;
                            let fecha_cita = this.state.date_selected;
                            let procedimiento_precio_sug = this.state.procedimiento_precio_sug_selected;
                            let image_updloaded_name = this.state.image_updloaded_name;

                            var fec_ing = "NOW()";
                            var usr_ing = "admin";
                            console.log(fecha_cita);

                            if (cliente != '' || procedimiento != '' || procedimiento_precio_sug != '' || tecnico != '' ||
                                vendedor_recepcionista != '' || fecha_cita != '') {

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
                                            });
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
                            } else {
                                Swal.fire({
                                    title: 'Faltan datos',
                                    text: 'Es necesario seleccionar un valor de cada opción del formulario',
                                    icon: 'info',
                                    confirmButtonText: 'Aceptar',
                                    confirmButtonColor: '#E0218A'
                                });
                            }
                        }, 2000);
                    });
                return true;
            }
        } else {
            Swal.fire({
                title: 'Faltan datos',
                text: 'La imagen del depósito es obligatoria, favor adjunte la imagen del depósito',
                icon: 'warning',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#E0218A'
            });
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

        let clientes = this.state.clientes;
        let procedimientos = this.state.procedimientos;
        let vendedores = this.state.vendedores;
        let tecnicos = this.state.tecnicos;

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

                    <IonAccordionGroup id="clientes">

                        {/* LISTA DE CLIENTES */}
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
                                    <IonInput id="cliente_selected_text" type="text" placeholder="Cliente">Cliente:&nbsp;</IonInput>
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
                                    <IonInput id="procedimiento_selected_text" type="text" placeholder="Procedimiento"></IonInput>
                                </IonItem>
                                <IonItem>
                                    <IonInput id="procedimiento_selected_precio" type="number" placeholder="Precio">Precio (L):&nbsp;</IonInput>
                                </IonItem>
                            </IonList>
                        </IonItemGroup>
                    </IonAccordionGroup>

                    {/* LISTA DE TÉCNICOS */}
                    <IonAccordionGroup id="tecnicos">
                        <IonAccordion value="tecnicos">
                            <IonItem slot="header">
                                <b><IonLabel>Seleccionar Técnico:</IonLabel></b>
                            </IonItem>

                            <IonList slot="content">
                                <IonSearchbar id="search_tecnico" onIonChange={(e) => this.buscarEnLista("tecnico")} showCancelButton="focus" placeholder="Buscar técnico"></IonSearchbar>
                                {
                                    tecnicos.filter(tecnico => tecnico.nombre.includes(this.state.search_string_tecnico)).map(item => (
                                        <IonItem key={item.id} onClick={(e) => this._getTecnico(item)}>
                                            {item.id} - {item.nombre}
                                        </IonItem>
                                    ))
                                }
                            </IonList>
                        </IonAccordion>
                        <IonItemGroup>
                            <IonList style={{ "display": "none" }} id="tecnico_selected">
                                <IonItem>
                                    <IonInput id="tecnico_selected_text" type="text" placeholder="Técnico">Técnico:&nbsp;</IonInput>
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
                                    <IonInput id="vendedor_selected_text" type="text" placeholder="Vendedor/Recepcionista"></IonInput>
                                </IonItem>
                            </IonList>
                        </IonItemGroup>
                    </IonAccordionGroup>
                    
                    <IonList>
                        <IonItem>
                            <IonLabel style={{ fontSize: "12px" }}>Seleccionar foto de anticipo</IonLabel>
                        </IonItem>
                        <IonItem>
                            <input id="imagen-anticipo" type="file" accept='image/*,.pdf'></input>
                        </IonItem>
                    </IonList>

                    {/* SELECCIONAR FECHA Y HORA */}
                    <IonButton id="open-modal" expand="full" color="medium">Seleccionar fecha y hora</IonButton>
                    <IonModal trigger="open-modal" style={{ Background: "transparent", paddingTop: "10vh", paddingLeft: "2vh", paddingRight: "2vh", paddingBottom: "35vh" }}>
                        <IonContent force-overscroll="false" style={{ Background: "#f2f2f7" }}>
                            <IonDatetime size="cover" showDefaultButtons="true" onIonChange={(e) => this.dateChanged(e)} doneText="Seleccionar fecha" cancelText="Cancelar" style={{ borderRadius: "8px 8px 8px 8px" }} minuteValues="0,30"></IonDatetime>
                        </IonContent>
                    </IonModal>

                    <IonItem>
                        <IonInput type="text" readonly>{this.state.fecha_rotulo}</IonInput>
                    </IonItem>
                </IonContent>
                <IonFooter>
                    <IonButton color="favorite" expand="block" onClick={() => this.registrarCita()} disabled="false">Registrar Cita</IonButton>
                </IonFooter>
            </IonPage>
        )
    }
}

export default connect(mapStateToProps)(CitaCrear);