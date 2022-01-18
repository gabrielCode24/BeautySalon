import {
    IonContent, IonPage,
    IonGrid, IonRow,
    IonCol, IonImg,
    IonHeader, IonToolbar,
    IonTitle, IonButtons, IonBackButton,
    IonIcon, IonButton
} from '@ionic/react';
import {
    arrowBackOutline
} from 'ionicons/icons';
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import agregarCita from '../assets/images/agregar.JPG'
import listaCitas from '../assets/images/lista.png'

import Swal from 'sweetalert2'

class CitaPreLista extends Component {
    constructor(props) {
        super(props);
        this.state = {
            citas: false,
            clientes: false,
            procedimientos: false,
            usuarios: false,
            logged: true
        }
    }

    logout = () => {
        Swal.fire({
            title: 'Cerrar sesión',
            text: "¿Está seguro de cerrar la sesión?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'No',
            confirmButtonText: 'Sí',
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('userData');
                this.setState({ logged: false });
            }
        })
    }

    redirigir = (modulo) => {
        switch (modulo) {
            case 'lista_usuarios':
                this.setState({ lista_usuarios: true });
                break;
            case 'crear_usuario':
                this.setState({ crear_usuario: true });
                break;
        }
    }

    render() {

        if (!localStorage.getItem("userData")) {
            return (<Redirect to={'/login'} />)
        }

        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonBackButton defaultHref="/citas" icon={arrowBackOutline} />
                            <IonTitle><b>Citas</b></IonTitle>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <div>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="6" onClick={() => this.redirigir('lista_procedimientos')} style={{
                                    height: "140px", borderColor: "#C0C0C0",
                                    borderWidth: "1px", borderStyle: "solid", backgroundSize: "cover"
                                }}>{/*<IonImg src={listaCitas} style={{ height: "100%" }}></IonImg>*/}TODAS LAS CITAS</IonCol>

                                <IonCol size="6" onClick={() => this.redirigir('crear_procedimiento')} style={{
                                    height: "140px", borderColor: "#C0C0C0",
                                    borderWidth: "1px", borderStyle: "solid"
                                }}>{/*<IonImg src={agregarCita} style={{ height: "100%" }}></IonImg>*/}CITAS DE HOY</IonCol>

                                <IonCol size="6" onClick={() => this.redirigir('crear_procedimiento')} style={{
                                    height: "140px", borderColor: "#C0C0C0",
                                    borderWidth: "1px", borderStyle: "solid"
                                }}>{/*<IonImg src={agregarCita} style={{ height: "100%" }}></IonImg>*/}CITAS DE MAÑANA</IonCol>

                                <IonCol size="6" onClick={() => this.redirigir('crear_procedimiento')} style={{
                                    height: "140px", borderColor: "#C0C0C0",
                                    borderWidth: "1px", borderStyle: "solid"
                                }}>{/*<IonImg src={agregarCita} style={{ height: "100%" }}></IonImg>*/}CITAS COMPLETADAS</IonCol>
                            </IonRow>
                        </IonGrid>
                    </div>
                </IonContent>
            </IonPage >
        )
    }
}

export default CitaPreLista;