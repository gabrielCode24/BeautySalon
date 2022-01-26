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
import { Component } from 'react'
import { Redirect } from 'react-router-dom'
//import './Home.css';
import agregarProcedimiento from '../assets/images/agregar.JPG'
import listaProcedimientos from '../assets/images/lista.png'

import { infoUsuario } from '../utilities/utilities.js'

class Usuarios extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuario_logueado_perfil: infoUsuario('perfil'),
      usuario_logueado_perfil: infoUsuario('perfil'),
      lista_procedimientos: false,
      crear_procedimiento: false
    }
  }

  redirigir = (modulo) => {
    switch (modulo) {
      case 'lista_procedimientos':
        this.setState({ lista_procedimientos: true });
        break;
      case 'crear_procedimiento':
        this.setState({ crear_procedimiento: true });
        break;
    }
  }

  render() {

    let perfil_usuario = this.state.usuario_logueado_perfil;

    if (this.state.lista_procedimientos) {
      return (<Redirect to={'/procedimiento-lista'} />)
    }

    if (this.state.crear_procedimiento) {
      return (<Redirect to={'/procedimiento-crear'} />)
    }

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/home" icon={arrowBackOutline} />
              <IonTitle><b>Procedimientos</b></IonTitle>
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
                }}>{<IonImg src={listaProcedimientos} style={{ height: "100%" }}></IonImg>}</IonCol>


                {
                  perfil_usuario == 4 ? '' :
                    <IonCol size="6" onClick={() => this.redirigir('crear_procedimiento')} style={{
                      height: "140px", borderColor: "#C0C0C0",
                      borderWidth: "1px", borderStyle: "solid"
                    }}>{<IonImg src={agregarProcedimiento} style={{ height: "100%" }}></IonImg>}</IonCol>
                }
              </IonRow>
            </IonGrid>
          </div>
        </IonContent>
      </IonPage >
    )
  }
}

export default Usuarios;