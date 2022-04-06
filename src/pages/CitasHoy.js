import {
  IonContent, IonPage,
  IonGrid, IonRow,
  IonCol, IonImg,
  IonHeader, IonToolbar,
  IonTitle, IonButtons, IonBackButton,
  IonIcon, IonButton
} from '@ionic/react';
import {
  arrowBackOutline, downloadOutline
} from 'ionicons/icons';
import { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { url, formatearFechaLista } from '../utilities/utilities.js'

import Swal from 'sweetalert2'

import { connect } from 'react-redux'
import { getCitaData } from '../actions/citaAction'

const mapStateToProps = store => ({
  cita: store.cita
});

class CitasHoy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: url(),
      citas: [],
      loading_citas: false,
      redirigir_a_cita_detalle: false,
      loading_cita_data: false
    }
  }

  UNSAFE_componentWillMount() {
    this._getCitas();
    if (localStorage.getItem('route_from')) {
      localStorage.removeItem('route_from');
    }
  }

  _getCitas = () => {
    this.setState({ loading_citas: true })

    let Parameters = "?action=getJSON&get=citas&filtro=hoy";
    
    fetch(this.state.url + Parameters)
      .then((res) => res.json())
      .then((responseJson) => {

        this.setState({
          loading_citas: false,
          citas: responseJson
        });
        Swal.close();
        console.log(this.state.citas)
      })
      .catch((error) => {
        console.log(error)
      });
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

  _getCita = (e, id) => {
    this.setState({ loading_cita_data: true });

    let Parameters = '?action=getJSON&get=cita_data&id=' + id;
    console.log(this.state.url + Parameters)
    fetch(this.state.url + Parameters)
      .then((res) => res.json())
      .then((responseJson) => {
        console.log(JSON.stringify(responseJson))
        //Guardamos la lista de clientes que vienen del API en el store de Redux
        this.props.dispatch(getCitaData(responseJson))

        this.setState({
          loading_cita_data: false,
          redirigir_a_cita_detalle: true
        });

        Swal.close();
      })
      .catch((error) => {
        console.log(error)
      });
  }

  render() {

    if (!localStorage.getItem("userData")) {
      return (<Redirect to={'/login'} />)
    }

    if (this.state.loading_citas) {
      return <h1>
        {Swal.showLoading()}
      </h1>;
    }

    if (this.state.redirigir_a_cita_detalle) {
      return (<div><Redirect to={'/cita-detalle'} /> { localStorage.setItem("route_from", "hoy") }</div>);
    }

    let citas = this.state.citas;

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/cita-pre-lista" icon={arrowBackOutline} />
              <IonTitle><b>Citas de hoy</b></IonTitle>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <IonGrid style={{ borderRadius: "50% 50% 50% 50%" }}>
            <IonRow style={{ backgroundColor: "#ffcc33", color: "#FFFFFF", textAlign: "center", fontFamily: "sans-serif" }}>
              <IonCol size="2">#CITA</IonCol>
              <IonCol size="2">CLI</IonCol>
              <IonCol size="4">FECHA</IonCol>
              <IonCol size="2">IMG ANT</IonCol>
            </IonRow>

            {
              citas.map((item, i) => {
                return (
                  <IonRow key={item.cita_codigo} 
                    style={{ backgroundColor: ((i % 2 == 0) ? "#D4D4D4" : "#FFE4E1"), fontFamily: "sans-serif" }} /*onClick={(e) => this.setRedirect(e, item)}*/>
                    <IonCol onClick={(e) => this._getCita(e, item.cita_codigo)} style={{ fontSize:"12px" }} size="2"> {item.cita_codigo} </IonCol>
                    <IonCol onClick={(e) => this._getCita(e, item.cita_codigo)} style={{ fontSize:"12px" }} size="2"> {item.cliente_nombre} </IonCol>
                    <IonCol onClick={(e) => this._getCita(e, item.cita_codigo)} style={{ fontSize:"12px" }} size="4"> {formatearFechaLista(item.cita_fecha_hora)} </IonCol>
                    {
                        item.cita_foto_deposito.length > 0 ?
                        <IonCol size="2"><IonButton href={item.cita_foto_deposito} color="favorite" size="small"><IonIcon icon={downloadOutline}></IonIcon></IonButton></IonCol> :
                        <IonCol onClick={(e) => this._getCita(e, item.cita_codigo)} size="2" style={{ fontSize: "10px" }}>Sin imagen de anticipo</IonCol>
                    }
                  </IonRow>
                )
              })
            }
          </IonGrid>
        </IonContent>
      </IonPage >
    )
  }
}

export default connect(mapStateToProps)(CitasHoy);