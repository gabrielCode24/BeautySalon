import {
    IonContent, IonPage,
    IonHeader, IonToolbar,
    IonTitle, IonButtons,
    IonButton, IonList, IonItem,
    IonLabel, IonInput,
    IonBackButton, IonFooter, IonRow, IonCol,
    IonThumbnail, IonImg, IonIcon, IonCheckbox
} from '@ionic/react';
import {
    arrowBackOutline, downloadOutline
} from 'ionicons/icons';
import { Component } from 'react'
import { Redirect } from 'react-router-dom'

import { url, prepararPost, infoUsuario } from '../utilities/utilities.js'
import Swal from 'sweetalert2'

import { connect } from 'react-redux'

const mapStateToProps = store => ({
    cita: store.cita
});

class CitaDetalle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: url(),
            usuario_logueado: infoUsuario('usuario'),
            usuario_perfil: infoUsuario('perfil'),
            cita: [],
            redireccionar_atras: false,
            url_guardar_imagen: 'https://pymesys.000webhostapp.com/beautysalon_eyebrowsbygr',
            imagen_terminos_uploading: false,
            sending: false,
            cita_anulada: false,
            texto_boton_procesar: 'Marcar cita como completada'
        }
    }

    UNSAFE_componentWillMount() {
        this.setState({
            cita: this.props.cita.list
        });
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

    modificarCita = () => {
        
        let inputFile = document.getElementById('imagen-terminos-condiciones').files[0];
        var fec_act = "NOW()";
        var usr_act = this.state.usuario_logueado;

        if (typeof (inputFile) !== "undefined") { // CUANDO SE ADJUNTA LA IMAGEN DE ANTICIPO
            Swal.fire({
                title: 'Cerrar Cita',
                text: "¿Está seguro(a) de marcar esta cita como completada?, esta acción no podrá revertirse.",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'No',
                confirmButtonText: 'Sí',
            }).then((result) => {
                if (result.isConfirmed) {

                    this.setState({
                        sending: true
                    });

                    if (inputFile) {
                        let formData = new FormData();
                        formData.append("archivo", inputFile);

                        fetch(this.state.url_guardar_imagen + "/guardar.php?foto_tipo=terminos_y_condiciones", {
                            method: 'POST',
                            body: formData,
                        }).then(respuesta => respuesta.text())
                            .then(nombreArchivo => {
                                this.setState({
                                    image_updloaded_name: nombreArchivo,
                                    imagen_terminos_uploading: false,
                                });

                                setTimeout(() => {

                                    let image_updloaded_name = this.state.image_updloaded_name;
                                    console.log("NOMBRE DE LA IMAGEN: " + image_updloaded_name);

                                    let image_uploaded_path = this.state.url_guardar_imagen + "/archivos_imagenes/terminos_y_condiciones/" + image_updloaded_name;

                                    let valuesCambiarEstado = {
                                        id: this.state.cita[0].cita_codigo,
                                        estado: 0,
                                        terminos_y_cond_foto: image_uploaded_path,
                                        fec_act: fec_act,
                                        usr_act: usr_act
                                    }

                                    const requestOptionsCambiarEstadoCita = prepararPost(valuesCambiarEstado, "update_cita_estado", "updateJsons", "jsonSingle");

                                    fetch(this.state.url, requestOptionsCambiarEstadoCita)
                                        .then((response) => {
                                            if (response.status === 200) {
                                                Swal.close();

                                                this.setState({
                                                    sending: false
                                                });

                                                Swal.fire({
                                                    title: '¡Éxito!',
                                                    text: '¡Cita cerrada correctamente!',
                                                    icon: 'success',
                                                    confirmButtonColor: '#E0218A'
                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        this.setState({ redireccionar_atras: true });
                                                    }
                                                });
                                            } else {
                                                Swal.fire({
                                                    title: 'Algo falló',
                                                    text: 'Ocurrió un error inesperado, no se cerró la cita, favor comunicarse con el desarrollador.',
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

                    /*
                    const requestOptionsCambiarEstadoCita = prepararPost(valuesCambiarEstado, "update_cita_estado", "updateJsons", "jsonSingle");
                    
                    fetch(this.state.url, requestOptionsCambiarEstadoCita)
                        .then((response) => {
                            if (response.status === 200) {
                                Swal.close();

                                this.setState({
                                    sending: false
                                });

                                Swal.fire({
                                    title: '¡Éxito!',
                                    text: '¡Cita cerrada correctamente!',
                                    icon: 'success',
                                    confirmButtonColor: '#E0218A'
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        this.setState({ redireccionar_atras: true });
                                    }
                                });
                            } else {
                                Swal.fire({
                                    title: 'Algo falló',
                                    text: 'Ocurrió un error inesperado, no se cerró la cita, favor comunicarse con el desarrollador.',
                                    icon: 'error',
                                    confirmButtonText: 'Aceptar',
                                    confirmButtonColor: 'red'
                                });
                            }
                        })
                        */
                }
            })
        } else if (this.state.cita_anulada) {
            Swal.fire({
                title: 'Anular Cita',
                text: "¿Está seguro(a) de marcar esta cita como anulada?, esta acción no podrá revertirse.",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'No',
                confirmButtonText: 'Sí',
            }).then((result) => {
                if (result.isConfirmed) {

                    let valuesCambiarEstado = {
                        id: this.state.cita[0].cita_codigo,
                        estado: 2,
                        terminos_y_cond_foto: '',
                        fec_act: fec_act,
                        usr_act: usr_act
                    }

                    const requestOptionsCambiarEstadoCita = prepararPost(valuesCambiarEstado, "update_cita_estado", "updateJsons", "jsonSingle");

                    fetch(this.state.url, requestOptionsCambiarEstadoCita)
                        .then((response) => {
                            if (response.status === 200) {
                                Swal.close();

                                this.setState({
                                    sending: false
                                });

                                Swal.fire({
                                    title: '¡Éxito!',
                                    text: '¡Cita anulada correctamente!',
                                    icon: 'success',
                                    confirmButtonColor: '#E0218A'
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        this.setState({ redireccionar_atras: true });
                                    }
                                });
                            } else {
                                Swal.fire({
                                    title: 'Algo falló',
                                    text: 'Ocurrió un error inesperado, no se anuló la cita, favor comunicarse con el desarrollador.',
                                    icon: 'error',
                                    confirmButtonText: 'Aceptar',
                                    confirmButtonColor: 'red'
                                });
                            }
                        })
                }
            })
        } else {
            Swal.fire({
                title: 'Aviso',
                text: 'Para marcar una cita como completada debe adjuntar la imagen correspondiente a los Términos y Condiciones.',
                icon: 'warning',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#E0218A'
            });
        }
    }

    //Controla el checkbox de cita anulada
    citaAnulada = (ev) => {
        if (ev.detail.checked === true) {
            this.setState({ cita_anulada: true });
            this.setState({ texto_boton_procesar: 'Marcar cita como anulada' });
        } else if (ev.detail.checked === false) {
            this.setState({ cita_anulada: false });
            this.setState({ texto_boton_procesar: 'Marcar cita como completada' });
        }
    }

    render() {

        if (this.state.redireccionar_atras) {
            return (<Redirect to={'/citas-todas'} />)
        }

        if (this.state.sending) {
            return <h1>
                {Swal.showLoading()}
            </h1>
        }

        let cita = this.state.cita;
        let cita_total = 0;
        let precio_disabled = "";
        let route_from = localStorage.getItem("route_from");
        let cita_estado = "";

        if (cita[0].cita_estado == 0) {
            cita_estado = "Abierta";
        } else if (cita[0].cita_estado == 1) {
            cita_estado = "Completada";
        } else if (cita[0].cita_estado == 2) {
            cita_estado = "Anulada";
        }

        this.state.usuario_perfil == 1 ? precio_disabled = "false" : precio_disabled = "true";

        for (let i = 0; i < cita.length; i++) {
            cita_total += (parseFloat(cita[i].proc_precio_sug));
        }

        return (
            <IonPage>
                <IonContent>
                    <IonHeader style={{ textAlign: "right" }}>
                        <IonToolbar>

                            <IonButtons slot="start">
                                <IonBackButton defaultHref="/citas" icon={arrowBackOutline} />
                            </IonButtons>

                            <IonTitle style={{ fontFamily: "sans-serif", fontSize: "15px" }}><b>DETALLE CITA</b></IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonList>

                        <IonItem>
                            <IonLabel># Cita:</IonLabel>
                            <b><IonInput id="id" value={cita[0].cita_codigo} type="text" readonly></IonInput></b>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Cliente:</IonLabel>
                            <IonInput id="cliente" value={cita[0].cliente_nombre} type="text" placeholder="Nombre del cliente" readonly></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Fecha y Hora:</IonLabel>
                            <IonInput id="fecha_hora" value={cita[0].cita_fecha_hora} type="text"></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Vendedor o Recep.:</IonLabel>
                            <IonInput id="vend_recep" value={cita[0].vendedor_recep_nombre} type="text" readonly></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>
                                Detalle de la cita:
                            </IonLabel>
                        </IonItem>

                        {
                            cita.map((item, i) => {
                                return (
                                    <div key={i}>

                                        <IonItem>
                                            <IonRow>
                                                <IonCol size="6">{"Procedimiento " + (parseInt(i + 1)) + ": "} <br /> <i><b style={{ fontSize: "17px" }}>{item.procedimiento}</b></i></IonCol>
                                                <IonCol size="6">{"Técnico: "} <b>{item.tecnico}</b> <br /> {"Precio: "} <b>{"L " + item.proc_precio_sug}</b></IonCol>
                                                {
                                                    cita.length === (i + 1) ?
                                                        <div>
                                                            <br />
                                                            <IonCol><IonLabel><b>Total:</b> <b style={{ fontSize: "24px" }}><u>{" L " + cita_total.toFixed(2)}</u></b></IonLabel></IonCol>
                                                            <br />
                                                        </div>
                                                        :
                                                        ""
                                                }
                                            </IonRow>

                                        </IonItem>

                                        <hr />
                                    </div>
                                )
                            })
                        }

                        {
                            (route_from !== "completadas" && route_from !== "anuladas") ?
                                <div>
                                    <IonItem>
                                        <IonLabel>Imagen de Anticipo:</IonLabel>
                                        {
                                            cita[0].cita_foto_deposito.length > 0 ?
                                                <IonButton href={cita[0].cita_foto_deposito} color="favorite" size="small"><IonIcon icon={downloadOutline}></IonIcon>Descargar</IonButton> :
                                                <span style={{ fontSize: "10px" }}>Sin imagen de depósito</span>
                                        }
                                    </IonItem>
                                </div> : ""
                        }

                        <IonItem>
                            <IonLabel>Estado:</IonLabel>
                            <b><IonInput id="estado" value={cita_estado} type="text" readonly></IonInput></b>
                        </IonItem>

                        {
                            (route_from !== "completadas" && route_from !== "anuladas") ?
                                <div>
                                    <IonItem>
                                        <IonLabel>Seleccionar foto de términos y condiciones:</IonLabel>
                                    </IonItem>
                                    <IonItem>
                                        <input id="imagen-terminos-condiciones" type="file" accept='image/*,.pdf'></input>
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel>¿Cita Anulada?</IonLabel>
                                        <IonCheckbox id="anulada" onIonChange={(e) => this.citaAnulada(e)}></IonCheckbox>
                                    </IonItem>
                                </div> : ""
                        }
                    </IonList>
                </IonContent>
                <IonFooter>
                    <IonButton color="favorite" expand="block" onClick={() => this.modificarCita()} disabled="false">{this.state.texto_boton_procesar}</IonButton>
                </IonFooter>
            </IonPage >
        )
    }
}

export default connect(mapStateToProps)(CitaDetalle);