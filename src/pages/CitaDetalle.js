import {
    IonContent, IonPage,
    IonHeader, IonToolbar,
    IonTitle, IonButtons,
    IonButton, IonList, IonItem,
    IonLabel, IonInput,
    IonBackButton, IonFooter,
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
            cita: this.props.cita.list[0]
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
        
    }

    render() {

        if (this.state.redireccionar_atras) {
            return (<Redirect to={'/citas-todas'} />)
        }

        let cita = this.state.cita;
        let precio_disabled = "";

        this.state.usuario_perfil == 1 ? precio_disabled = "false" : precio_disabled = "true";

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
                            <b><IonInput id="id" value={cita.cita_codigo} type="text" readonly></IonInput></b>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Cliente:</IonLabel>
                            <IonInput id="cliente" value={cita.cliente_nombre} type="text" placeholder="Nombre del cliente" readonly></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Fecha y Hora:</IonLabel>
                            <IonInput id="fecha_hora" value={cita.cita_fecha_hora} type="text"></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Procedimiento:</IonLabel>
                            <IonInput id="procedimiento" value={cita.procedimiento_nombre} type="text" readonly></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Precio (L):</IonLabel>
                            <IonInput id="precio" disabled={ precio_disabled } value={cita.procedimiento_precio} type="number"></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Técnico Asignado:</IonLabel>
                            <IonInput id="tecnico" value={cita.tecnico_nombre} type="text" readonly></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonThumbnail slot="start">
                                <IonImg src={cita.tecnico_foto} />
                            </IonThumbnail>
                            <IonLabel>{ cita.tecnico_nombre }</IonLabel>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Vendedor o Recep.:</IonLabel>
                            <IonInput id="vend_recep" value={cita.vendedor_recep_nombre} type="text" readonly></IonInput>
                        </IonItem>                        
                        
                        <IonItem>
                            <IonLabel>Imagen de Anticipo:</IonLabel>
                            {
                                cita.cita_foto_deposito.length > 0 ?
                                <IonButton href={cita.cita_foto_deposito} color="favorite" size="small"><IonIcon icon={downloadOutline}></IonIcon>Descargar</IonButton> :
                                <span style={{ fontSize:"10px" }}>Sin imagen de depósito</span>
                            }
                        </IonItem>  

                        <IonItem>
                            <IonLabel>Estado:</IonLabel>
                            <b><IonInput id="estado" value={cita.cita_estado == 1 ? 'Abierto' : 'Completado'} type="text" readonly></IonInput></b>
                        </IonItem>
                    </IonList>
                </IonContent>
                <IonFooter>
                    <IonButton color="favorite" expand="block" onClick={() => this.modificarCita()} disabled>Modificar Cita</IonButton>
                </IonFooter>
            </IonPage >
        )
    }
}

export default connect(mapStateToProps)(CitaDetalle);