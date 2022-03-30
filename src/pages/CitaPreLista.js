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
import { Component } from 'react'
import { Redirect } from 'react-router-dom'
import citasHoy from '../assets/images/hoy.png'
import citasTodas from '../assets/images/todas.png'
import citasManana from '../assets/images/manana.png'
import citasCompletadas from '../assets/images/completadas.png'
import citasAnuladas from '../assets/images/anuladas.png'

import Swal from 'sweetalert2'

class CitaPreLista extends Component {
    constructor(props) {
        super(props);
        this.state = {
            citas_todas: false,
            citas_hoy: false,
            citas_manana: false,
            citas_completadas: false,
            citas_anuladas: false
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
            case 'citas_todas':
                this.setState({ citas_todas: true });
                break;
            case 'citas_hoy':
                this.setState({ citas_hoy: true });
                break;
            case 'citas_manana':
                this.setState({ citas_manana: true });
                break;
            case 'citas_completadas':
                this.setState({ citas_completadas: true });
                break;
            case 'citas_anuladas':
                this.setState({ citas_anuladas: true });
                break;
        }
    }

    render() {

        if (this.state.citas_todas) {
            return (<Redirect to={'/citas-todas'} />)
        }
        
        if (this.state.citas_hoy) {
            return (<Redirect to={'/citas-hoy'} />)
        }

        if (this.state.citas_manana) {
            return (<Redirect to={'/citas-manana'} />)
        }

        if (this.state.citas_completadas) {
            return (<Redirect to={'/citas-completadas'} />)
        }

        if (this.state.citas_anuladas) {
            return (<Redirect to={'/citas-anuladas'} />)
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
                                <IonCol size="6" onClick={() => this.redirigir('citas_todas')} style={{
                                    height: "140px", borderColor: "#C0C0C0",
                                    borderWidth: "1px", borderStyle: "solid", backgroundSize: "cover"
                                }}>{<IonImg src={citasTodas} style={{ height: "100%" }}></IonImg>}</IonCol>

                                <IonCol size="6" onClick={() => this.redirigir('citas_hoy')} style={{
                                    height: "140px", borderColor: "#C0C0C0",
                                    borderWidth: "1px", borderStyle: "solid"
                                }}>{<IonImg src={citasHoy} style={{ height: "100%" }}></IonImg>}</IonCol>

                                <IonCol size="6" onClick={() => this.redirigir('citas_manana')} style={{
                                    height: "140px", borderColor: "#C0C0C0",
                                    borderWidth: "1px", borderStyle: "solid"
                                }}>{<IonImg src={citasManana} style={{ height: "100%" }}></IonImg>}</IonCol>

                                <IonCol size="6" onClick={() => this.redirigir('citas_completadas')} style={{
                                    height: "140px", borderColor: "#C0C0C0",
                                    borderWidth: "1px", borderStyle: "solid"
                                }}>{<IonImg src={citasCompletadas} style={{ height: "100%" }}></IonImg>}</IonCol>

                                <IonCol size="6" onClick={() => this.redirigir('citas_anuladas')} style={{
                                    height: "140px", borderColor: "#C0C0C0",
                                    borderWidth: "1px", borderStyle: "solid"
                                }}>{<IonImg src={citasAnuladas} style={{ height: "100%" }}></IonImg>}</IonCol>
                            </IonRow>
                        </IonGrid>
                    </div>
                </IonContent>
            </IonPage >
        )
    }
}

export default CitaPreLista;