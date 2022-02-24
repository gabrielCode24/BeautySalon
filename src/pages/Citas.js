import {
  IonContent, IonPage,
  IonGrid, IonRow,
  IonCol, IonImg,
  IonHeader, IonToolbar,
  IonTitle, IonButtons, IonBackButton,
  IonButton
} from '@ionic/react';
import {
  arrowBackOutline
} from 'ionicons/icons';
import { Component } from 'react'
import { Redirect } from 'react-router-dom'
import agregarCita from '../assets/images/agregar_nueva.JPG'
import listaCitas from '../assets/images/lista.png'

import Swal from 'sweetalert2'

class Citas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pre_lista_citas: false,
      crear_cita: false,
      logged: true,
      itemArray: []
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
      case 'pre_lista_citas':
        this.setState({ pre_lista_citas: true });
        break;
      case 'crear_cita':
        this.setState({ crear_cita: true });
        break;
    }
  }

  render() {

    if (this.state.pre_lista_citas) {
      return (<Redirect to={'/cita-pre-lista'} />)
    }

    if (this.state.crear_cita) {
      return (<Redirect to={'/cita-crear'} />)
    }

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/home" icon={arrowBackOutline} />
              <IonTitle><b>Citas</b></IonTitle>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent>
            <IonGrid>
              <IonRow>
                <IonCol size="6" onClick={() => this.redirigir('pre_lista_citas')} style={{
                  height: "140px", borderColor: "#C0C0C0",
                  borderWidth: "1px", borderStyle: "solid", backgroundSize: "cover"
                }}>{<IonImg src={listaCitas} style={{ height: "100%" }}></IonImg>}</IonCol>

                <IonCol size="6" onClick={() => this.redirigir('crear_cita')} style={{
                  height: "140px", borderColor: "#C0C0C0",
                  borderWidth: "1px", borderStyle: "solid"
                }}>{<IonImg src={agregarCita} style={{ height: "100%" }}></IonImg>}</IonCol>
              </IonRow>
            </IonGrid>
        </IonContent>
      </IonPage >
    )
  }
}

export default Citas;