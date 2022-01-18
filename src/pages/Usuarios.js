 import {
  IonContent, IonPage,
  IonGrid, IonRow,
  IonCol, IonImg,
  IonHeader, IonToolbar,
  IonTitle, IonButtons,
  IonBackButton
} from '@ionic/react';
import {
  arrowBackOutline
} from 'ionicons/icons';
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
//import './Home.css';
import agregarUsuario from '../assets/images/agregar.JPG'
import listaUsuarios from '../assets/images/lista.png'

class Usuarios extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lista_usuarios: false,
      crear_usuario: false
    }
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

    if (this.state.lista_usuarios) {
      return (<Redirect to={'/usuario-lista'} />)
    }
    
    if (this.state.crear_usuario) {
      return (<Redirect to={'/usuario-crear'} />)
    }

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/home" icon={arrowBackOutline} />
              <IonTitle><b>Usuarios</b></IonTitle>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <div>
            <IonGrid>
              <IonRow>
                <IonCol size="6" onClick={() => this.redirigir('lista_usuarios')} style={{
                  height: "140px", borderColor: "#C0C0C0",
                  borderWidth: "1px", borderStyle: "solid", backgroundSize: "cover"
                  
                }}>{<IonImg src={listaUsuarios} style={{ height: "100%" }}></IonImg>}</IonCol>

                <IonCol size="6" onClick={() => this.redirigir('crear_usuario')} style={{
                  height: "140px", borderColor: "#C0C0C0",
                  borderWidth: "1px", borderStyle: "solid"
                }}>{<IonImg src={agregarUsuario} style={{ height: "100%" }}></IonImg>}</IonCol>
              </IonRow>
            </IonGrid>
          </div>
        </IonContent>
      </IonPage >
    )
  }
}

export default Usuarios;