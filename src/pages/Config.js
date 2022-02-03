import {
  IonContent, IonPage, IonList,
  IonItem, IonInput, IonLabel, IonItemDivider,
  IonHeader, IonToolbar,
  IonTitle, IonButtons, IonIcon,
  IonButton, IonFooter
} from '@ionic/react';
import {
  logOutOutline, arrowBackOutline
} from 'ionicons/icons';
import { Component } from 'react'
import { Redirect } from 'react-router-dom'

import Swal from 'sweetalert2'
import { infoUsuario, prepararPost, url } from '../utilities/utilities.js'

class Config extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: url(),
      home: false,
      config: false,
      parametros: [],
      logged: true,
      usuario_logueado: infoUsuario('usuario'),
    }
  }

  UNSAFE_componentWillMount() {
    this._getParametros();
  }

  _getParametros = () => {
    this.setState({ loading_parametros: true });

    let Parameters = '?action=getJSON&get=parametros';
    
    fetch(this.state.url + Parameters)
      .then((res) => res.json())
      .then((responseJson) => {

        localStorage.setItem('ultimoValorParametro1', responseJson[0].valor);
        localStorage.setItem('ultimoValorParametro2', responseJson[1].valor);

        this.setState({
          loading_parametros: false,
          parametros: responseJson
        });
        Swal.close();
      })
      .catch((error) => {
        console.log(error)
      });
  }

  redirigir = (modulo) => {
    switch (modulo) {
      case 'home':
        this.setState({ home: true });
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

  modificarParametros = () => {

    let ultimoValorParametro1 = localStorage.getItem('ultimoValorParametro1');
    let ultimoValorParametro2 = localStorage.getItem('ultimoValorParametro2');

    var id_1 = document.getElementById('id_1').value;
    var valor_1 = document.getElementById('valor_1').value;

    var id_2 = document.getElementById('id_2').value;
    var valor_2 = document.getElementById('valor_2').value;

    var fec_act = "NOW()";
    var usr_act = this.state.usuario_logueado;

    //PARAMETRO 1
    if (valor_1 != ultimoValorParametro1) {
      let valuesParametro1 = {
        id: id_1, valor: valor_1,
        fec_act: fec_act, usr_act: usr_act
      }

      let requestOptionsParametro1 = prepararPost(valuesParametro1, "update_parametro", "updateJsons", "jsonSingle");

      fetch(this.state.url, requestOptionsParametro1)
        .then((response) => {
          if (response.status === 200) {
            Swal.close();

            this.setState({
              sending: false
            });

            setTimeout(() => {
              this.setState({
                redireccionar_atras: true
              });
            }, 1500);

            Swal.fire({
              title: '¡Éxito!',
              text: 'Parámetros modificados exitosamente!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500
            });
          } else {
            Swal.fire({
              title: 'Algo falló',
              text: 'Ocurrió un error inesperado, no se pudo modificar la información usuario, favor comunicarse con el desarrollador.',
              icon: 'error',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: 'red'
            });
          }
        })
    }

    //PARAMETRO 2
    if (valor_2 != ultimoValorParametro2) {
      let valuesParametro2 = {
        id: id_2, valor: valor_2,
        fec_act: fec_act, usr_act: usr_act
      }

      let requestOptionsParametro2 = prepararPost(valuesParametro2, "update_parametro", "updateJsons", "jsonSingle");

      fetch(this.state.url, requestOptionsParametro2)
        .then((response) => {
          if (response.status === 200) {
            Swal.close();

            this.setState({
              sending: false
            });

            setTimeout(() => {
              this.setState({
                redireccionar_atras: true
              });
            }, 1500);

            Swal.fire({
              title: '¡Éxito!',
              text: 'Parámetros modificados exitosamente!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500
            });
          } else {
            Swal.fire({
              title: 'Algo falló',
              text: 'Ocurrió un error inesperado, no se pudo modificar la información usuario, favor comunicarse con el desarrollador.',
              icon: 'error',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: 'red'
            });
          }
        })
    }
  }

  render() {

    if (this.state.loading_parametros) {
      return <h1>
        {Swal.showLoading()}
      </h1>;
    }

    if (!this.state.logged || !localStorage.getItem("userData")) {
      return (<Redirect to={'/login'} />)
    }

    if (this.state.home || this.state.redireccionar_atras) {
      return (<Redirect to={'/home'} />)
    }

    let parametros = this.state.parametros;

    return (
      <IonPage>
        <IonContent>
          <div>
            <IonHeader style={{ textAlign: "right" }}>
              <IonToolbar>

                <IonButtons slot="start">
                  <IonButton onClick={() => this.redirigir('home')} title="Configuración">
                    <IonIcon slot="icon-only" icon={arrowBackOutline} />
                  </IonButton>
                  <IonButton onClick={() => this.logout()} title="Cerrar sesión">
                    <IonIcon slot="icon-only" icon={logOutOutline} />
                  </IonButton>
                </IonButtons>

                {/*<IonTitle style={{ fontFamily: "sans-serif" }}><b>Eyebrows By: GR</b></IonTitle>*/}
                <IonTitle><b>PARÁMETROS</b></IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonList>

              {
                parametros.map((item, i) => {
                  return (
                    <div key={i}>
                      <IonItemDivider>
                        <b><IonLabel style={{ fontSize: "15px" }}>
                          {item.descripcion}
                        </IonLabel></b>
                      </IonItemDivider>
                      <IonItem>
                        <IonLabel>Valor:</IonLabel>
                        <IonInput type="number" id={"valor_" + item.id} value={item.valor}></IonInput>
                      </IonItem>
                      <IonItem>
                        <IonLabel>Fecha actualización:</IonLabel>
                        <IonInput disabled type="text" value={item.fec_act}></IonInput>
                      </IonItem>
                      <IonItem>
                        <IonLabel>Usuario actualiza:</IonLabel>
                        <IonInput disabled type="text" value={item.usr_act}></IonInput>
                      </IonItem>
                      <IonInput type="hidden" value={item.id} id={"id_" + item.id}></IonInput>
                    </div>
                  )
                })
              }

            </IonList>
          </div>
        </IonContent>
        <IonFooter>
          <IonButton disabled="false" color="favorite" expand="block" onClick={() => this.modificarParametros()}>Modificar Parámetros</IonButton>
        </IonFooter>
      </IonPage >
    )
  }
}

export default Config;