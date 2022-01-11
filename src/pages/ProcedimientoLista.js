import {
    IonContent, IonPage,
    IonHeader, IonToolbar,
    IonTitle, IonButtons,
    IonButton, IonList, IonItem,
    IonBackButton,
    IonFooter, IonSearchbar
} from '@ionic/react';
import {
    arrowBackOutline
} from 'ionicons/icons';
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import { url, prepararPost } from '../utilities/utilities.js'
import Swal from 'sweetalert2'

import { connect } from 'react-redux'
import { getProcedimientos } from '../actions/procedimientosAction'
import { getProcedimiento } from '../actions/procedimientoAction'

const mapStateToProps = store => ({
    procedimientos: store.procedimientos,
    procedimiento: store.procedimiento
});

class ProcedimientoLista extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: url(),
            logged: true,
            loading_procedimientos: false,
            loading_procedimiento_data: false,
            procedimientos: [],
            procedimiento: [],
            search_string: "",
            redirigir_a_procedimiento_detalle: false
        }
    }

    UNSAFE_componentWillMount() {
        this._getProcedimientos();
    }

    _getProcedimientos = () => {
        this.setState({ loading_procedimientos: true });

        let Parameters = '?action=getJSON&get=procedimientos_lista';

        fetch(this.state.url + Parameters)
            .then((res) => res.json())
            .then((responseJson) => {

                //Guardamos la lista de procedimientos que vienen del API en el store de Redux
                this.props.dispatch(getProcedimientos(responseJson))
                
                this.setState({
                    loading_procedimientos: false,
                    procedimientos: this.props.procedimientos.list,
                });

                Swal.close();
            })
            .catch((error) => {
                console.log(error)
            });
    }

    mensajeValidacion = (mensaje) => {
        Swal.fire({
            title: 'Aviso',
            text: mensaje,
            icon: 'info',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#E0218A'
        });
    }

    registrarProcedimiento = () => {
        var nombre = document.getElementById('nombre').value;
        var descripcion = document.getElementById('descripcion').value;
        var precio = document.getElementById('precio').value;

        var fec_ing = "NOW()";
        var usr_ing = "admin";

        if (nombre.length > 0 && precio.length > 0) {

            //VALIDACIONES
            //Nombre
            if (nombre.length < 6) {
                this.mensajeValidacion("El nombre debe tener al menos 6 caracteres.");
                return;
            }

            //Teléfono
            if (descripcion.length > 1) {
                if (descripcion.length < 10) {
                    this.mensajeValidacion("La descripción del procedimiento debe tener al menos 10 caracteres.");
                    return;
                }
            }

            //Identidad
            if (precio == 0.00 & precio == 0 && precio < 0) {
                this.mensajeValidacion("El precio ingresado no es correcto, favor ingrese un precio válido.");
                return;
            }

            //Si pasó todas las validaciones pasamos al siguiente bloque        

            var valuesUsuario = {
                nombre: nombre, descripcion: descripcion, precio_sug: precio,
                fec_ing: fec_ing, usr_ing: usr_ing
            }

            const requestOptionsProcedimiento = prepararPost(valuesUsuario, "procedimiento", "setJsons", "jsonSingle");

            fetch(this.state.url, requestOptionsProcedimiento)
                .then((response) => {
                    if (response.status === 200) {
                        Swal.close();

                        this.setState({
                            sending: false
                        });

                        Swal.fire({
                            title: '¡Éxito!',
                            text: '¡Procedimiento ingresado exitosamente!',
                            icon: 'success',
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: '#E0218A'
                        });
                    } else {
                        Swal.fire({
                            title: 'Algo falló',
                            text: 'Ocurrió un error inesperado, no se pudo ingresar el procedimiento, favor comunicarse con el desarrollador.',
                            icon: 'error',
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: 'red'
                        });
                    }
                })
        } else {
            Swal.fire({
                title: 'Faltan datos',
                text: 'Los campos Nombre y Precio son obligatorios.',
                icon: 'info',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#E0218A'
            });
        }
    }

    filtrarProcedimientos = () => {
        let text = document.getElementById('search').value;

        this.setState({
            search_string: text
        })
    }

    _getProcedimiento = (id) => {
        this.setState({ loading_procedimiento_data: true });

        let Parameters = '?action=getJSON&get=procedimiento&id=' + id;

        fetch(this.state.url + Parameters)
            .then((res) => res.json())
            .then((responseJson) => {

                //Guardamos la lista de procedimientos que vienen del API en el store de Redux
                this.props.dispatch(getProcedimiento(responseJson))
                
                this.setState({
                    loading_procedimiento_data: false,
                    procedimiento: this.props.procedimiento.list,
                    redirigir_a_procedimiento_detalle: true
                });
                
                Swal.close();
            })
            .catch((error) => {
                console.log(error)
            });
    }

    render() {

        if (this.state.loading_procedimientos) {
            return <h1>
                {Swal.showLoading()}
            </h1>;
        }

        if (this.state.redirigir_a_procedimiento_detalle) {
            return (<Redirect to={'/procedimiento-detalle'} />)
          }

        let procedimientos = this.state.procedimientos;

        return (
            <IonPage>
                <IonContent>
                    <IonHeader style={{ textAlign: "right" }}>
                        <IonToolbar>

                            <IonButtons slot="start">
                                <IonBackButton defaultHref="/procedimientos" icon={arrowBackOutline} />
                            </IonButtons>

                            <IonTitle style={{ fontFamily: "sans-serif", fontSize: "15px" }}><b>LISTA DE PROCEDIMIENTOS</b></IonTitle>
                        </IonToolbar>
                    </IonHeader>

                    <IonSearchbar id="search" onIonChange={(e) => this.filtrarProcedimientos()} showCancelButton="focus" placeholder="Buscar procedimiento"></IonSearchbar>
                    <IonList>
                        {
                            procedimientos.filter(procedimiento => procedimiento.nombre.includes(this.state.search_string)).map(item => (
                                <IonItem key={item.id} onClick={(e) => this._getProcedimiento(item.id)}>
                                    {item.id} - {item.nombre}
                                </IonItem>
                            ))
                        }
                    </IonList>

                </IonContent>
                <IonFooter>
                    <IonButton color="favorite" expand="block" onClick={() => this.registrarProcedimiento()}>Registrar Cliente</IonButton>
                </IonFooter>
            </IonPage >
        )
    }
}

export default connect(mapStateToProps)(ProcedimientoLista);