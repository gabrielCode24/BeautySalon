import {
    IonContent, IonPage,
    IonHeader, IonToolbar,
    IonTitle, IonButtons,
    IonButton, IonList, IonItem,
    IonLabel, IonInput, IonBackButton,
    IonFooter
} from '@ionic/react';
import {
    arrowBackOutline
} from 'ionicons/icons';
import { Component } from 'react'

import { Redirect } from 'react-router-dom'
import { url, prepararPost, infoUsuario } from '../utilities/utilities.js'
import Swal from 'sweetalert2'

class ClienteCrear extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: url(),
            logged: true,
            usuario_logueado: infoUsuario('usuario'),
            usuarios: false,
            redireccionar_atras: false
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

    registrarCliente = () => {
        var nombre = document.getElementById('nombre').value;
        var telefono = document.getElementById('telefono').value;
        var fecha_nac = document.getElementById('fecha_nac').value;
        var correo = document.getElementById('correo').value;
        var identidad = document.getElementById('identidad').value;
        var direccion = document.getElementById('direccion').value;

        var fec_ing = "NOW()";
        var usr_ing = this.state.usuario_logueado;

        if (nombre.length > 0 && telefono.length && fecha_nac.length > 0) {

            //VALIDACIONES
            //Nombre
            if (nombre.length < 7) {
                this.mensajeValidacion("El nombre debe tener al menos 7 caracteres.");
                return;
            }

            //Teléfono
            if (telefono.length < 8) {
                this.mensajeValidacion("El teléfono debe tener al menos 8 dígitos.");
                return;
            }

            //Identidad
            if (identidad.length > 1) {
                if (identidad.length < 13) {
                    this.mensajeValidacion("La cédula de identidad debe tener al menos 13 caracteres.");
                    return;
                }
            }

            //Dirección
            if (direccion.length > 1) {
                if (direccion.length < 9) {
                    this.mensajeValidacion("La dirección debe tener al menos 9 caracteres.");
                    return;
                }
            }

            //Si pasó todas las validaciones pasamos al siguiente bloque        

            var valuesUsuario = {
                nombre: nombre, telefono: telefono, fecha_nac: fecha_nac, id_rtn: identidad,
                correo: correo, direccion: direccion, fec_ing: fec_ing, usr_ing: usr_ing
            }

            this.setState({
                sending: true
            });

            const requestOptionsCliente = prepararPost(valuesUsuario, "cliente", "setJsons", "jsonSingle");

            fetch(this.state.url, requestOptionsCliente)
                .then((response) => {
                    if (response.status === 200) {
                        Swal.close();

                        this.setState({
                            sending: false
                        });

                        Swal.fire({
                            title: '¡Éxito!',
                            text: '¡Cliente ingresado exitosamente!',
                            icon: 'success',
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: '#E0218A'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                this.setState({ redireccionar_atras: true });
                            }
                        });
                    } else {
                        Swal.fire({
                            title: 'Algo falló',
                            text: 'Ocurrió un error inesperado, no se pudo ingresar el cliente, favor comunicarse con el desarrollador.',
                            icon: 'error',
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: 'red'
                        });
                    }
                })
        } else {
            Swal.fire({
                title: 'Faltan datos',
                text: 'Los campos Nombre, Teléfono y Fecha de Nacimiento son obligatorios.',
                icon: 'info',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#E0218A'
            });
        }
    }

    render() {

        if (this.state.redireccionar_atras) {
            return (<Redirect to={'/clientes'} />)
        }

        if (this.state.sending) {
            return <h1>
                {Swal.showLoading()}
            </h1>;
        }

        return (
            <IonPage>
                <IonContent>
                    <IonHeader style={{ textAlign: "right" }}>
                        <IonToolbar>

                            <IonButtons slot="start">
                                <IonBackButton defaultHref="/clientes" icon={arrowBackOutline} />
                            </IonButtons>

                            <IonTitle style={{ fontFamily: "sans-serif" }}><b>CREAR CLIENTE</b></IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonList>
                        <IonItem>
                            <IonLabel>Nombre:</IonLabel>
                            <IonInput id="nombre" type="text" placeholder="Nombre del cliente" required></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Telefono:</IonLabel>
                            <IonInput id="telefono" type="number" placeholder="Teléfono" required></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Correo Electrónico:</IonLabel>
                            <IonInput id="correo" type="email" placeholder="Correo electrónico" required></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Dirección:</IonLabel>
                            <IonInput id="direccion" type="textarea" placeholder="Dirección"></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Fecha de Nacimiento:</IonLabel>
                            <IonInput id="fecha_nac" type="date" placeholder="Fecha de nacimiento" required></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Identidad/RTN:</IonLabel>
                            <IonInput id="identidad" type="text" placeholder="Identidad"></IonInput>
                        </IonItem>
                    </IonList>

                </IonContent>
                <IonFooter>
                    <IonButton color="favorite" expand="block" onClick={() => this.registrarCliente()}>Registrar Cliente</IonButton>
                </IonFooter>
            </IonPage >
        )
    }
}

export default ClienteCrear;