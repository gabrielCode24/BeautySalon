import {
  IonContent, IonPage,
  IonGrid, IonRow,
  IonCol, IonImg,
  IonHeader, IonToolbar,
  IonTitle, IonButtons, IonIcon,
  IonButton
} from '@ionic/react';
import {
  logOutOutline
} from 'ionicons/icons';
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
//import './Home.css';

import calendario from '../assets/images/calendario.png'
import clientes from '../assets/images/clientes.jpg'
import procedimientos from '../assets/images/procedimientos.png'
import usuarios from '../assets/images/usuarios.jpg'

import Swal from 'sweetalert2'
import { infoUsuario } from '../utilities/utilities.js'

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      citas: false,
      clientes: false,
      procedimientos: false,
      usuarios: false,
      logged: true,
      usuario_logueado: infoUsuario('nombre'),
    }
  }

  redirigir = (modulo) => {
    switch (modulo) {
      case 'citas':
        this.setState({ citas: true });
        break;
      case 'clientes':
        this.setState({ clientes: true });
        break;
      case 'procedimientos':
        this.setState({ procedimientos: true });
        break;
      case 'usuarios':
        this.setState({ usuarios: true });
        break;
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

    if (!this.state.logged || !localStorage.getItem("userData")) {
      return (<Redirect to={'/login'} />)
    }
    
    if (this.state.citas) {
      return (<Redirect to={'/citas'} />)
    }

    if (this.state.clientes) {
      return (<Redirect to={'/clientes'} />)
    }

    if (this.state.procedimientos) {
      return (<Redirect to={'/procedimientos'} />)
    }

    if (this.state.usuarios) {
      return (<Redirect to={'/usuarios'} />)
    }
    
    return (
      <IonPage>
        <IonContent>
          <div>
            <IonHeader style={{ textAlign: "right" }}>
              <IonToolbar>

                <IonButtons slot="start">
                  <IonButton onClick={() => this.logout()} title="Cerrar sesión">
                    <IonIcon slot="icon-only" icon={logOutOutline} />
                  </IonButton>
                </IonButtons>

                {/*<IonTitle style={{ fontFamily: "sans-serif" }}><b>Eyebrows By: GR</b></IonTitle>*/}
                <IonTitle style={{ fontFamily: "sans-serif", fontSize:"13px" }}><b>Bienvenida(o) { this.state.usuario_logueado }</b></IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonGrid>
              <IonRow>
                <IonCol size="6" onClick={() => this.redirigir('citas')} style={{
                  height: "140px", borderColor: "#C0C0C0",
                  borderWidth: "1px", borderStyle: "solid", backgroundSize: "cover"
                }}><IonImg src={calendario} style={{ height: "100%" }}></IonImg></IonCol>

                <IonCol size="6" onClick={() => this.redirigir('clientes')} style={{
                  height: "140px", borderColor: "#C0C0C0",
                  borderWidth: "1px", borderStyle: "solid"
                }}><IonImg src={clientes} style={{ height: "100%" }}></IonImg></IonCol>
              </IonRow>

              <IonRow>
                <IonCol size="6" onClick={() => this.redirigir('procedimientos')} style={{
                  height: "140px", borderColor: "#C0C0C0",
                  borderWidth: "1px", borderStyle: "solid"
                }}><IonImg src={procedimientos} style={{ height: "100%" }}></IonImg></IonCol>

                <IonCol size="6" onClick={() => this.redirigir('usuarios')} style={{
                  height: "140px", borderColor: "#C0C0C0",
                  borderWidth: "1px", borderStyle: "solid"
                }}><IonImg src={usuarios} style={{ height: "100%" }}></IonImg></IonCol>
              </IonRow>
            </IonGrid>
          </div>
        </IonContent>
      </IonPage >
    )
  }
}

export default Home;