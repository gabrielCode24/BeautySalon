import {
  IonContent, IonPage,
  IonGrid, IonRow,
  IonCol, IonImg,
  IonHeader, IonToolbar,
  IonTitle, IonButtons, IonBackButton,
  IonIcon, IonButton
} from '@ionic/react';
import {
  logOutOutline, arrowBackOutline
} from 'ionicons/icons';
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import Swal from 'sweetalert2'

class Home extends Component {
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

  render() {

    if (!localStorage.getItem("userData")) {
      return (<Redirect to={'/login'} />)
    }

    return (
      <IonPage>
        <IonContent>
          <div>
            <IonHeader style={{ textAlign: "right" }}>
              <IonToolbar>

                <IonButtons slot="end">
                  <IonButton onClick={() => this.logout()} title="Cerrar sesión">
                    <IonIcon slot="icon-only" icon={logOutOutline} />
                  </IonButton>
                </IonButtons>

                <IonButtons slot="start">
                  <IonBackButton defaultHref="/home" icon={arrowBackOutline} />
                </IonButtons>

                <IonTitle style={{ fontFamily: "sans-serif" }}><b>Eyebrows By: GR</b></IonTitle>
              </IonToolbar>
            </IonHeader>

            <h1>CITAS</h1>

          </div>
        </IonContent>
      </IonPage >
    )
  }
}

export default Home;