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
//import lista_usuarios from '../assets/images/lista_usuarios.jpg'
//import agregar_usuario from '../assets/images/agregar_usuario.png'
import Swal from 'sweetalert2'

class Usuarios extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lista_clientes: false,
      crear_cliente: false
    }
  }

  redirigir = (modulo) => {
    switch (modulo) {
      case 'lista_clientes':
        this.setState({ lista_clientes: true });
        break;
      case 'crear_cliente':
        this.setState({ crear_cliente: true });
        break;
    }
  }

  render() {

    if (this.state.lista_clientes) {
      //return (<Redirect to={'/usuarios-lista'} />)
    }
    
    if (this.state.crear_cliente) {
      return (<Redirect to={'/cliente-crear'} />)
    }

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/home" icon={arrowBackOutline} />
              <IonTitle><b>Clientes</b></IonTitle>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <div>
            <IonGrid>
              <IonRow>
                <IonCol size="6" onClick={() => this.redirigir('lista_clientes')} style={{
                  height: "140px", borderColor: "#C0C0C0",
                  borderWidth: "1px", borderStyle: "solid", backgroundSize: "cover"
                  
                }}>LISTA DE CLIENTES</IonCol>

                <IonCol size="6" onClick={() => this.redirigir('crear_cliente')} style={{
                  height: "140px", borderColor: "#C0C0C0",
                  borderWidth: "1px", borderStyle: "solid"
                }}>{/*<IonImg src={agregar_usuario} style={{ height: "100%" }}></IonImg>*/}CREAR CLIENTE</IonCol>
              </IonRow>
            </IonGrid>
          </div>
        </IonContent>
      </IonPage >
    )
  }
}

export default Usuarios;