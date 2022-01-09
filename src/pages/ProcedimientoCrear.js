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
import { url, prepararPost } from '../utilities/utilities.js'
import { MD5 } from '../utilities/crypto'
import Swal from 'sweetalert2'

class ProcedimientoCrear extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: url(),
            logged: true,
            usuarios: false
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

    registrarProcedimiento = () => {
        var nombre = document.getElementById('nombre').value;
        var descripcion = document.getElementById('descripcion').value;
        var precio = document.getElementById('precio').value;

        var fec_ing = "NOW()";
        var usr_ing = "admin";

        if (nombre.length > 0 && precio.length > 0) {

            //VALIDACIONES
            //Nombre
            if (nombre.length < 6) {
                this.mensajeValidacion("El nombre debe tener al menos 6 caracteres.");
                return;
            }

            //Teléfono
            if (descripcion.length > 1) {
                if (descripcion.length < 10) {
                    this.mensajeValidacion("La descripción del procedimiento debe tener al menos 10 caracteres.");
                    return;
                }
            }

            //Identidad
            if (precio == 0.00 & precio == 0 && precio < 0) {
                this.mensajeValidacion("El precio ingresado no es correcto, favor ingrese un precio válido.");
                return;
            }

            //Si pasó todas las validaciones pasamos al siguiente bloque        

            var valuesUsuario = {
                nombre: nombre, descripcion: descripcion, precio_sug: precio,
                fec_ing: fec_ing, usr_ing: usr_ing
            }
                    
            const requestOptionsProcedimiento = prepararPost(valuesUsuario, "procedimiento", "setJsons", "jsonSingle");

            fetch(this.state.url, requestOptionsProcedimiento)
                .then((response) => {
                    if (response.status === 200) {
                        Swal.close();

                        this.setState({
                            sending: false
                        });

                        Swal.fire({
                            title: '¡Éxito!',
                            text: '¡Procedimiento ingresado exitosamente!',
                            icon: 'success',
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: '#E0218A'
                        });
                    } else {
                        Swal.fire({
                            title: 'Algo falló',
                            text: 'Ocurrió un error inesperado, no se pudo ingresar el procedimiento, favor comunicarse con el desarrollador.',
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

        if (!this.state.logged) {
            //return (<Redirect to={'/login'} />)
        }

        if (this.state.facturar) {
            //return (<Redirect to={'/factura'} />)
        }

        return (
            <IonPage>
                <IonContent>
                    <IonHeader style={{ textAlign: "right" }}>
                        <IonToolbar>

                            <IonButtons slot="start">
                                <IonBackButton defaultHref="/clientes" icon={arrowBackOutline} />
                            </IonButtons>

                            <IonTitle style={{ fontFamily: "sans-serif" }}><b>CREAR PROCEDIMIENTO</b></IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonList>
                        <IonItem>
                            <IonLabel>Nombre:</IonLabel>
                            <IonInput id="nombre" type="text" placeholder="Nombre del procedimiento" required></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Descripción:</IonLabel>
                            <IonInput id="descripcion" type="textarea" placeholder="Descripción del procedimiento" required></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Precio (L):</IonLabel>
                            <IonInput id="precio" type="number" placeholder="Precio (L)" required></IonInput>
                        </IonItem>
                    </IonList>

                </IonContent>
                <IonFooter>
                    <IonButton color="favorite" expand="block" onClick={() => this.registrarProcedimiento()}>Registrar Cliente</IonButton>
                </IonFooter>
            </IonPage >
        )
    }
}

export default ProcedimientoCrear;