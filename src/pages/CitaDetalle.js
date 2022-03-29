import {
    IonContent, IonPage,
    IonHeader, IonToolbar,
    IonTitle, IonButtons,
    IonButton, IonList, IonItem,
    IonLabel, IonInput,
    IonBackButton, IonFooter, IonRow, IonCol,
    IonThumbnail, IonImg, IonIcon
} from '@ionic/react';
import {
    arrowBackOutline, downloadOutline
} from 'ionicons/icons';
import { Component } from 'react'
import { Redirect } from 'react-router-dom'
//import './Home.css';
import { url, prepararPost, infoUsuario } from '../utilities/utilities.js'
import Swal from 'sweetalert2'

import { connect } from 'react-redux'
import { setTimeout } from 'timers';

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
            }
        })

        let valuesCambiarEstado = {
            id: this.state.cita[0].cita_codigo,
            estado: 0
        }
    }

    render() {

        if (this.state.redireccionar_atras) {
            return (<Redirect to={'/citas-todas'} />)
        }

        let cita = this.state.cita;
        let cita_total = 0;
        let precio_disabled = "";

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
                                <IonBackButton defaultHref="/citas-todas" icon={arrowBackOutline} />
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
                                    <div>

                                        <IonItem>
                                            {/*
                                                <li>{"Procedimiento " + (parseInt(i + 1)) + ": "} <i><b style={{ fontSize: "17px" }}>{item.procedimiento}</b></i></li>
                                                <ul>
                                                    <li>{"Técnico: "} <b>{item.tecnico}</b> <br/> {"Precio: "} <b>{"L " + item.proc_precio_sug}</b></li>
                                                </ul>
                                                */}

                                            <IonRow>
                                                <IonCol size="6">{"Procedimiento " + (parseInt(i + 1)) + ": "} <br /> <i><b style={{ fontSize: "17px" }}>{item.procedimiento}</b></i></IonCol>
                                                <IonCol size="6">{"Técnico: "} <b>{item.tecnico}</b> <br /> {"Precio: "} <b>{"L " + item.proc_precio_sug}</b></IonCol>
                                                {
                                                    cita.length === (i + 1) ?
                                                        <div>
                                                            <br />
                                                            <IonCol><IonLabel><b>Total:</b> <b style={{ fontSize: "24px" }}>{" L " + cita_total}</b></IonLabel></IonCol>
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

                        <IonItem>
                            <IonLabel>Imagen de Anticipo:</IonLabel>
                            {
                                cita[0].cita_foto_deposito.length > 0 ?
                                    <IonButton href={cita[0].cita_foto_deposito} color="favorite" size="small"><IonIcon icon={downloadOutline}></IonIcon>Descargar</IonButton> :
                                    <span style={{ fontSize: "10px" }}>Sin imagen de depósito</span>
                            }
                        </IonItem>

                        <IonItem>
                            <IonLabel>Estado:</IonLabel>
                            <b><IonInput id="estado" value={cita[0].cita_estado == 1 ? 'Abierto' : 'Completado'} type="text" readonly></IonInput></b>
                        </IonItem>
                    </IonList>
                </IonContent>
                <IonFooter>
                    <IonButton color="favorite" expand="block" onClick={() => this.modificarCita()} disabled="false">Marcar cita como completada</IonButton>
                </IonFooter>
            </IonPage >
        )
    }
}

export default connect(mapStateToProps)(CitaDetalle);