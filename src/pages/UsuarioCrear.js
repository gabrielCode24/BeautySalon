import {
    IonContent, IonPage,
    IonHeader, IonToolbar,
    IonTitle, IonButtons, IonIcon,
    IonButton, IonList, IonItem,
    IonLabel, IonInput, IonSelect,
    IonSelectOption, IonBackButton,
    IonFooter
} from '@ionic/react';
import {
    arrowBackOutline
} from 'ionicons/icons';
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
//import './Home.css';
import { url, saltingCode, prepararPost } from '../utilities/utilities.js'
import { MD5 } from '../utilities/crypto'
import Swal from 'sweetalert2'

class UsuarioCrear extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: url(),
            logged: true,
            usuarios: false,
            perfil: 1,
            saltingCode: saltingCode
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    opcionSeleccionadaPerfil = (e) => {
        let perfil = e.target.value;
        this.setState({ perfil: perfil });
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

    registrarUsuario = () => {
        var nombre = document.getElementById('nombre').value;
        var telefono = document.getElementById('telefono').value;
        var fecha_nac = document.getElementById('fecha_nac').value;
        var identidad = document.getElementById('identidad').value;
        var direccion = document.getElementById('direccion').value;

        var usuario = document.getElementById('usuario').value;
        let clave = document.getElementById('clave').value;
        var repetir_clave = document.getElementById('repetir_clave').value;
        var perfil = this.state.perfil;
        var fec_ing = "NOW()";
        var usr_ing = "admin";

        if (nombre.length > 0 && telefono.length && fecha_nac.length > 0 &&
            identidad.length > 0 && direccion.length > 0 && usuario.length > 0 &&
            clave.length > 0) {

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
            if (identidad.length < 13) {
                this.mensajeValidacion("La cédula de identidad debe tener al menos 13 caracteres.");
                return;
            }

            //Dirección
            if (direccion.length < 9) {
                this.mensajeValidacion("La dirección debe tener al menos 9 caracteres.");
                return;
            }

            //Usuario
            if (usuario.length < 5) {
                this.mensajeValidacion("El usuario debe tener al menos 5 caracteres.");
                return;
            }

            //Si pasó todas las validaciones pasamos al siguiente bloque
            if (clave == repetir_clave) {

                let Parameters = '?action=getJSON&get=verificar_usuario_existe&usr=' + usuario;
                clave = MD5(clave + saltingCode);
                console.log(clave);
                console.log(saltingCode)
                console.log(clave)
                fetch(this.state.url + Parameters)
                    .then((res) => res.json())
                    .then((responseJson) => {
                        if (responseJson.length > 0) {
                            Swal.fire({
                                title: 'Algo falló',
                                text: 'Este usuario ya existe, intente con otro.',
                                icon: 'warning',
                                confirmButtonText: 'Aceptar',
                                confirmButtonColor: 'blue'
                            });
                        } else {
                            var valuesUsuario = {
                                nombre: nombre, telefono: telefono, fecha_nac: fecha_nac, id_rtn: identidad,
                                direccion: direccion, usuario: usuario, clave: clave, perfil: perfil,
                                fec_ing: fec_ing, usr_ing: usr_ing
                            }

                            const requestOptionsUsuario = prepararPost(valuesUsuario, "usuario", "setJsons", "jsonSingle");

                            setTimeout(() => {
                                fetch(this.state.url, requestOptionsUsuario)
                                    .then((response) => {
                                        if (response.status === 200) {
                                            Swal.close();
                                            
                                            this.setState({
                                                sending: false
                                            });

                                            Swal.fire({
                                                title: '¡Éxito!',
                                                text: '¡Usuario creado exitosamente!',
                                                icon: 'success',
                                                confirmButtonText: 'Aceptar',
                                                confirmButtonColor: '#E0218A'
                                            });
                                        } else {
                                            Swal.fire({
                                                title: 'Algo falló',
                                                text: 'Ocurrió un error inesperado, no se pudo crear el usuario, favor comunicarse con el desarrollador.',
                                                icon: 'error',
                                                confirmButtonText: 'Aceptar',
                                                confirmButtonColor: 'red'
                                            });
                                        }
                                    })
                            }, 500);
                        }
                    })
            } else {
                Swal.fire({
                    title: 'Algo falló',
                    text: 'Las contraseñas no coinciden.',
                    icon: 'warning',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#E0218A'
                });
            }
        } else {
            Swal.fire({
                title: 'Faltan datos',
                text: 'Debe llenar cada campo del formulario.',
                icon: 'info',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#E0218A'
            });
        }


    }

    render() {

        if (!this.state.logged) {
            return (<Redirect to={'/login'} />)
        }

        if (this.state.facturar) {
            return (<Redirect to={'/factura'} />)
        }

        return (
            <IonPage>
                <IonContent>
                    <IonHeader style={{ textAlign: "right" }}>
                        <IonToolbar>

                            <IonButtons slot="start">
                                <IonBackButton defaultHref="/usuarios" icon={arrowBackOutline} />
                            </IonButtons>

                            <IonTitle style={{ fontFamily: "sans-serif" }}><b>CREAR USUARIO</b></IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonList>
                        <IonItem>
                            <IonLabel>Nombre:</IonLabel>
                            <IonInput id="nombre" type="text" placeholder="Nombre del usuario" required></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Telefono:</IonLabel>
                            <IonInput id="telefono" type="number" placeholder="Teléfono" required></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Fecha de Nacimiento:</IonLabel>
                            <IonInput id="fecha_nac" type="date" placeholder="Fecha de nacimiento" required></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Identidad:</IonLabel>
                            <IonInput id="identidad" type="text" placeholder="Identidad" required></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Dirección:</IonLabel>
                            <IonInput id="direccion" type="textarea" placeholder="Dirección" required></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Usuario:</IonLabel>
                            <IonInput id="usuario" type="text" placeholder="Usuario" required></IonInput>
                        </IonItem>
                        
                        <IonItem>
                            <IonLabel>Clave:</IonLabel>
                            <IonInput id="clave" type="password" placeholder="Clave" required></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Reescriba la clave:</IonLabel>
                            <IonInput id="repetir_clave" type="password" placeholder="Reescriba la clave" required></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Perfil</IonLabel>
                            <IonSelect okText="Aceptar" id="perfil" cancelText="Cancelar" placeholder="Administrador" onIonChange={(e) => this.opcionSeleccionadaPerfil(e)} interface="action-sheet">
                                <IonSelectOption value="1">Administrador</IonSelectOption>
                                <IonSelectOption value="2">Vendedor</IonSelectOption>
                                <IonSelectOption value="3">Recepcionista</IonSelectOption>
                                <IonSelectOption value="4">Técnico</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                    </IonList>

                </IonContent>
                <IonFooter>
                    <IonButton color="favorite" expand="block" onClick={() => this.registrarUsuario()}>Registrar Usuario</IonButton>
                </IonFooter>
            </IonPage >
        )
    }
}

export default UsuarioCrear;