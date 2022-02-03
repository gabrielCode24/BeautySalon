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

    modificarCliente = () => {
        var id = document.getElementById('id').value;
        var telefono = document.getElementById('telefono').value;
        var fecha_nac = document.getElementById('fecha_nac').value;
        var identidad = document.getElementById('identidad').value;
        var direccion = document.getElementById('direccion').value;

        var activo = document.getElementById('activo').value;
        var fec_act = "NOW()";
        var usr_act = this.state.usuario_logueado;

        if (telefono.length > 0 && fecha_nac.length > 0 &&
            identidad.length > 0) {

            //VALIDACIONES

            //Teléfono
            if (telefono.length < 8) {
                this.mensajeValidacion("El teléfono debe tener al menos 8 dígitos.");
                return;
            }

            //Identidad
            if (identidad.length < 13) {
                this.mensajeValidacion("La cédula de identidad debe tener al menos 13 caracteres.");
                return;
            }

            //Dirección
            if (direccion.length < 9) {
                this.mensajeValidacion("La dirección debe tener al menos 9 caracteres.");
                return;
            }

            //Si pasó todas las validaciones pasamos al siguiente bloque
            var valuesCliente = {
                id: id, telefono: telefono, fecha_nac: fecha_nac, id_rtn: identidad,
                direccion: direccion, activo: activo, fec_act: fec_act, usr_act: usr_act
            }

            const requestOptionsCliente = prepararPost(valuesCliente, "update_cliente", "updateJsons", "jsonSingle");

            fetch(this.state.url, requestOptionsCliente)
                .then((response) => {
                    if (response.status === 200) {
                        Swal.close();

                        this.setState({
                            sending: false
                        });

                        setTimeout(() => {
                            this.setState({
                                redireccionar_atras: true
                            });
                        }, 1500);

                        Swal.fire({
                            title: '¡Éxito!',
                            text: 'Cita modificada exitosamente!',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        Swal.fire({
                            title: 'Algo falló',
                            text: 'Ocurrió un error inesperado, no se pudo modificar la información de esta cita, favor comunicarse con el desarrollador.',
                            icon: 'error',
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: 'red'
                        });
                    }
                })
        } else {
            Swal.fire({
                title: 'Faltan datos',
                text: 'Los campos Nombre y Precio son obligatorios.',
                icon: 'info',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#E0218A'
            });
        }
    }

    render() {

        if (this.state.redireccionar_atras) {
            return (<Redirect to={'/cita-pre-lista'} />)
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
                                <IonBackButton defaultHref="/cita-pre-lista" icon={arrowBackOutline} />
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
                            <IonLabel>Precio:</IonLabel>
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
                    <IonButton color="favorite" expand="block" onClick={() => this.modificarCliente()} disabled>Modificar Cliente</IonButton>
                </IonFooter>
            </IonPage >
        )
    }
}

export default connect(mapStateToProps)(CitaDetalle);