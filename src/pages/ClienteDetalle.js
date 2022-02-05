import {
    IonContent, IonPage,
    IonHeader, IonToolbar,
    IonTitle, IonButtons,
    IonButton, IonList, IonItem,
    IonLabel, IonInput,
    IonBackButton, IonFooter,
    IonSelect, IonSelectOption
} from '@ionic/react';
import {
    arrowBackOutline
} from 'ionicons/icons';
import { Component } from 'react'
import { Redirect } from 'react-router-dom'
//import './Home.css';
import { url, prepararPost, infoUsuario } from '../utilities/utilities.js'
import Swal from 'sweetalert2'

import { connect } from 'react-redux'
import { setTimeout } from 'timers';

const mapStateToProps = store => ({
    cliente: store.cliente
});

class ClienteDetalle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: url(),
            usuario_logueado: infoUsuario('usuario'),
            cliente: [],
            redireccionar_atras: false,
        }
    }
    
    UNSAFE_componentWillMount() {
        this.setState({
            cliente: this.props.cliente.list[0]
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
                            text: 'Información del cliente modificada exitosamente!',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        Swal.fire({
                            title: 'Algo falló',
                            text: 'Ocurrió un error inesperado, no se pudo modificar la información cliente, favor comunicarse con el desarrollador.',
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
            return (<Redirect to={'/cliente-lista'} />)
        }

        let cliente = this.state.cliente;
        console.log(JSON.stringify(cliente))

        return (
            <IonPage>
                <IonContent>
                    <IonHeader style={{ textAlign: "right" }}>
                        <IonToolbar>

                            <IonButtons slot="start">
                                <IonBackButton defaultHref="/clientes" icon={arrowBackOutline} />
                            </IonButtons>

                            <IonTitle style={{ fontFamily: "sans-serif", fontSize: "15px" }}><b>MODIFICAR CLIENTE</b></IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonList>

                        <IonInput id="id" value={cliente.id} type="hidden"></IonInput>

                        <IonItem>
                            <IonLabel>Nombre:</IonLabel>
                            <IonInput id="nombre" value={cliente.nombre} type="text" placeholder="Nombre del cliente" style={{ color: "gray" }} readonly></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Telefono:</IonLabel>
                            <IonInput id="telefono" value={cliente.telefono} type="number" placeholder="Teléfono" required></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Fecha de Nacimiento:</IonLabel>
                            <IonInput id="fecha_nac" value={cliente.fecha_nac} type="date" placeholder="" required></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Identidad:</IonLabel>
                            <IonInput id="identidad" value={cliente.id_rtn} type="text" placeholder="Identidad" required></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Dirección:</IonLabel>
                            <IonInput id="direccion" value={cliente.direccion} type="text" placeholder="Nombre del cliente" required></IonInput>
                        </IonItem>
                        
                        <IonItem>
                            <IonLabel>Activo</IonLabel>
                            <IonSelect okText="Aceptar" id="activo" value={cliente.activo} cancelText="Cancelar" placeholder={cliente.activo == 1 ? 'Sí' : 'No'} interface="action-sheet" key={cliente.id}>
                                <IonSelectOption value="1">Sí</IonSelectOption>
                                <IonSelectOption value="0">No</IonSelectOption>
                            </IonSelect>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Fecha Ingreso:</IonLabel>
                            <IonInput id="fec_ing" style={{ "color": "gray" }} value={cliente.fec_ing} type="text" readonly></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Usuario Ingresa:</IonLabel>
                            <IonInput id="usr_ing" style={{ "color": "gray" }} value={cliente.usr_ing} type="text" readonly></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Fecha Actualiza:</IonLabel>
                            <IonInput id="fec_act" style={{ "color": "gray" }} value={cliente.fec_act} type="text" readonly></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Usuario Actualiza:</IonLabel>
                            <IonInput id="usr_act" style={{ "color": "gray" }} value={cliente.usr_act} type="text" readonly></IonInput>
                        </IonItem>

                    </IonList>
                </IonContent>
                <IonFooter>
                    <IonButton color="favorite" expand="block" onClick={() => this.modificarCliente()}>Modificar Cita</IonButton>
                </IonFooter>
            </IonPage >
        )
    }
}

export default connect(mapStateToProps)(ClienteDetalle);