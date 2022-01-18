import {
    IonContent, IonPage,
    IonHeader, IonToolbar,
    IonTitle, IonButtons, IonIcon,
    IonButton, IonList, IonItem,
    IonLabel, IonInput, IonSelect,
    IonSelectOption, IonBackButton,
    IonFooter, IonAccordion, IonAccordionGroup,
    IonSearchbar, IonItemDivider, IonItemGroup
} from '@ionic/react';
import {
    arrowBackOutline
} from 'ionicons/icons';
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
//import './Home.css';
import { url, prepararPost } from '../utilities/utilities.js'
import Swal from 'sweetalert2'

import { getClientes } from '../actions/clientesAction'
import { connect } from 'react-redux'

const mapStateToProps = store => ({
    clientes: store.clientes,
});

class CitaCrear extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: url(),
            logged: true,
            clientes: [],
            loading_clientes: false,
            search_string: ""
        }
    }
    
    UNSAFE_componentWillMount() {
        this._getClientes();
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

    _getClientes = () => {
        this.setState({ loading_clientes: true });

        let Parameters = '?action=getJSON&get=clientes_lista';

        fetch(this.state.url + Parameters)
            .then((res) => res.json())
            .then((responseJson) => {

                //Guardamos la lista de clientes que vienen del API en el store de Redux
                this.props.dispatch(getClientes(responseJson))

                this.setState({
                    loading_clientes: false,
                    clientes: this.props.clientes.list,
                });

                Swal.close();
            })
            .catch((error) => {
                console.log(error)
            });
    }

    filtrarClientes = () => {
        let text = document.getElementById('search').value;

        this.setState({
            search_string: text
        })
    }

    _getCliente = (item) => {
        document.getElementById('cliente_selected').style.display = "block";
        document.getElementById('cliente_selected_text').value = item.nombre;

        //const stateAccordion = document.querySelector('#state');
        const stateAccordion = document.getElementById('state');
        stateAccordion.value = undefined;
    }

    registrarCita = () => {
        var nombre = document.getElementById('nombre').value;
        var telefono = document.getElementById('telefono').value;
        var fecha_nac = document.getElementById('fecha_nac').value;
        var correo = document.getElementById('correo').value;
        var identidad = document.getElementById('identidad').value;
        var direccion = document.getElementById('direccion').value;

        var fec_ing = "NOW()";
        var usr_ing = "admin";

        if (nombre.length > 0) {

            //VALIDACIONES
            //Nombre
            if (nombre.length < 7) {
                this.mensajeValidacion("El nombre debe tener al menos 7 caracteres.");
                return;
            }

            //Si pasó todas las validaciones pasamos al siguiente bloque        

            var valuesUsuario = {
                nombre: nombre, telefono: telefono, fecha_nac: fecha_nac, id_rtn: identidad,
                correo: correo, direccion: direccion, fec_ing: fec_ing, usr_ing: usr_ing
            }

            const requestOptionsCliente = prepararPost(valuesUsuario, "cita", "setJsons", "jsonSingle");

            fetch(this.state.url, requestOptionsCliente)
                .then((response) => {
                    if (response.status === 200) {
                        Swal.close();

                        this.setState({
                            sending: false
                        });

                        Swal.fire({
                            title: '¡Éxito!',
                            text: '¡Cliente ingresado exitosamente!',
                            icon: 'success',
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: '#E0218A'
                        });
                    } else {
                        Swal.fire({
                            title: 'Algo falló',
                            text: 'Ocurrió un error inesperado, no se pudo ingresar el cliente, favor comunicarse con el desarrollador.',
                            icon: 'error',
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: 'red'
                        });
                    }
                })
        } else {
            Swal.fire({
                title: 'Faltan datos',
                text: 'Los campos Nombre, Teléfono y Fecha de Nacimiento son obligatorios.',
                icon: 'info',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#E0218A'
            });
        }
    }

    render() {

        if (!this.state.logged) {
            //return (<Redirect to={'/login'} />)
        }

        if (this.state.facturar) {
            //return (<Redirect to={'/factura'} />)
        }

        let clientes = this.state.clientes;

        return (
            <IonPage>
                <IonContent>
                    <IonHeader style={{ textAlign: "right" }}>
                        <IonToolbar>

                            <IonButtons slot="start">
                                <IonBackButton defaultHref="/citas" icon={arrowBackOutline} />
                            </IonButtons>

                            <IonTitle style={{ fontFamily: "sans-serif" }}><b>CREAR CITA</b></IonTitle>
                        </IonToolbar>
                    </IonHeader>

                    <IonAccordionGroup id="state">
                        <IonAccordion value="clientes">
                            <IonItem slot="header">
                                <IonLabel>Seleccionar Cliente:</IonLabel>
                            </IonItem>

                            <IonList slot="content">
                                <IonSearchbar id="search" onIonChange={(e) => this.filtrarClientes()} showCancelButton="focus" placeholder="Buscar cliente"></IonSearchbar>
                                {
                                    clientes.filter(cliente => cliente.nombre.includes(this.state.search_string)).map(item => (
                                        <IonItem key={item.id} onClick={(e) => this._getCliente(item)}>
                                            {item.id} - {item.nombre}
                                        </IonItem>
                                    ))
                                }
                            </IonList>
                        </IonAccordion>
                    </IonAccordionGroup>
                    <IonItemGroup>
                    <IonList style={{ "display": "none" }} id="cliente_selected">
                        <IonItem>
                            <IonInput id="cliente_selected_text" type="text" placeholder="Cliente"></IonInput>
                        </IonItem>
                    </IonList>
                    </IonItemGroup>

                </IonContent>
                <IonFooter>
                    <IonButton color="favorite" expand="block" onClick={() => this.registrarCita()}>Registrar Cita</IonButton>
                </IonFooter>
            </IonPage >
        )
    }
}

export default connect(mapStateToProps)(CitaCrear);