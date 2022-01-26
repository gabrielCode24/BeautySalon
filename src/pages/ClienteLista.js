import {
    IonContent, IonPage,
    IonHeader, IonToolbar,
    IonTitle, IonButtons,
    IonList, IonItem,
    IonBackButton,
    IonSearchbar, IonAccordion, IonAccordionGroup,
    IonLabel
} from '@ionic/react';
import {
    arrowBackOutline
} from 'ionicons/icons';
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import { url, prepararPost } from '../utilities/utilities.js'
import Swal from 'sweetalert2'

import { connect } from 'react-redux'
import { getClientes } from '../actions/clientesAction'
import { getClienteData } from '../actions/clienteAction'

const mapStateToProps = store => ({
    clientes: store.clientes,
    cliente: store.cliente
});

class ClienteLista extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: url(),
            logged: true,
            loading_clientes: false,
            loading_cliente_data: false,
            clientes: [],
            cliente: [],
            search_string: "",
            redirigir_a_cliente_detalle: false
        }
    }

    UNSAFE_componentWillMount() {
        this._getClientes();
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

    mensajeValidacion = (mensaje) => {
        Swal.fire({
            title: 'Aviso',
            text: mensaje,
            icon: 'info',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#E0218A'
        });
    }

    filtrarClientes = () => {
        let text = document.getElementById('search').value;

        this.setState({
            search_string: text
        })
    }

    _getCliente = (id) => {
        this.setState({ loading_cliente_data: true });

        let Parameters = '?action=getJSON&get=cliente_data&id=' + id;

        fetch(this.state.url + Parameters)
            .then((res) => res.json())
            .then((responseJson) => {
                console.log(JSON.stringify(responseJson))
                //Guardamos la lista de clientes que vienen del API en el store de Redux
                this.props.dispatch(getClienteData(responseJson))

                this.setState({
                    loading_cliente_data: false,
                    cliente: this.props.cliente.list,
                    redirigir_a_cliente_detalle: true
                });

                Swal.close();
            })
            .catch((error) => {
                console.log(error)
            });
    }

    render() {

        if (this.state.loading_clientes) {
            return <h1>
                {Swal.showLoading()}
            </h1>;
        }

        if (this.state.redirigir_a_cliente_detalle) {
            return (<Redirect to={'/cliente-detalle'} />)
        }

        let clientes = this.state.clientes;

        return (
            <IonPage>
                <IonContent>
                    <IonHeader style={{ textAlign: "right" }}>
                        <IonToolbar>

                            <IonButtons slot="start">
                                <IonBackButton defaultHref="/clientes" icon={arrowBackOutline} />
                            </IonButtons>

                            <IonTitle style={{ fontFamily: "sans-serif", fontSize: "15px" }}><b>LISTA DE CLIENTES</b></IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    
                    <IonSearchbar id="search" onIonChange={(e) => this.filtrarClientes()} showCancelButton="focus" placeholder="Buscar cliente"></IonSearchbar>
                    <IonList>
                        {
                            clientes.filter(cliente => cliente.nombre.includes(this.state.search_string)).map(item => (
                                <IonItem key={item.id} onClick={(e) => this._getCliente(item.id)}>
                                    {item.id} - {item.nombre}
                                </IonItem>
                            ))
                        }
                    </IonList>
                    
                </IonContent>
            </IonPage >
        )
    }
}

export default connect(mapStateToProps)(ClienteLista);