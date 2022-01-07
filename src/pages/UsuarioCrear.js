import {
    IonContent, IonPage,
    IonHeader, IonToolbar,
    IonTitle, IonButtons, IonIcon,
    IonButton, IonList, IonItem,
    IonLabel, IonInput, IonSelect,
    IonSelectOption, IonBackButton
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
            facturar: false,
            inventario: false,
            usuarios: false,

            saltingCode: saltingCode
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
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
        var perfil = document.getElementById('perfil').value;
        var fec_ing = "NOW()";
        var usr_ing = "admin";

        if (clave == repetir_clave) {

            let Parameters = '?action=getJSON&get=verificar_usuario_existe&usr=' + usuario;
            clave = MD5(this.state.clave + saltingCode);

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
                confirmButtonColor: 'yellow'
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
                            <IonInput id="telefono" type="text" placeholder="Teléfono" required></IonInput>
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
                            <IonInput id="direccion" type="text" placeholder="Dirección" required></IonInput>
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
                            <IonLabel>Rescriba la clave:</IonLabel>
                            <IonInput id="repetir_clave" type="password" placeholder="Rescriba la clave" required></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Perfil</IonLabel>
                            <IonSelect okText="Aceptar" id="perfil" cancelText="Cancelar" placeholder="Administrador" interface="action-sheet">
                                <IonSelectOption value="1">Administrador</IonSelectOption>
                                <IonSelectOption value="2">Vendedor</IonSelectOption>
                                <IonSelectOption value="3">Recepcionista</IonSelectOption>
                                <IonSelectOption value="4">Técnico</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                        <IonButton color="favorite" expand="block" onClick={() => this.registrarUsuario()}>Registrar Usuario</IonButton>
                    </IonList>

                </IonContent>
            </IonPage >
        )
    }
}

export default UsuarioCrear;