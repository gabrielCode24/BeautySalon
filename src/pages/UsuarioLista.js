import {
    IonContent, IonPage,
    IonHeader, IonToolbar,
    IonTitle, IonButtons,
    IonList, IonItem,
    IonBackButton,
    IonSearchbar
} from '@ionic/react';
import {
    arrowBackOutline
} from 'ionicons/icons';
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import { url, prepararPost } from '../utilities/utilities.js'
import Swal from 'sweetalert2'

import { connect } from 'react-redux'
import { getUsuarios } from '../actions/usuariosAction'
import { getUsuarioData } from '../actions/usuarioAction'

const mapStateToProps = store => ({
    usuarios: store.usuarios,
    usuario: store.usuario
});

class UsuarioLista extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: url(),
            logged: true,
            loading_usuarios: false,
            loading_usuario_data: false,
            usuarios: [],
            usuario: [],
            search_string: "",
            redirigir_a_usuario_detalle: false
        }
    }

    UNSAFE_componentWillMount() {
        this._getUsuarios();
    }

    _getUsuarios = () => {
        this.setState({ loading_usuarios: true });

        let Parameters = '?action=getJSON&get=usuarios_lista';

        fetch(this.state.url + Parameters)
            .then((res) => res.json())
            .then((responseJson) => {

                //Guardamos la lista de usuarios que vienen del API en el store de Redux
                this.props.dispatch(getUsuarios(responseJson))
                
                this.setState({
                    loading_usuarios: false,
                    usuarios: this.props.usuarios.list,
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

    filtrarUsuarios = () => {
        let text = document.getElementById('search').value;

        this.setState({
            search_string: text
        })
    }

    _getUsuario = (id) => {
        this.setState({ loading_usuario_data: true });

        let Parameters = '?action=getJSON&get=usuario_data&id=' + id;

        fetch(this.state.url + Parameters)
            .then((res) => res.json())
            .then((responseJson) => {

                //Guardamos la lista de usuarios que vienen del API en el store de Redux
                this.props.dispatch(getUsuarioData(responseJson))
                
                this.setState({
                    loading_usuario_data: false,
                    usuario: this.props.usuario.list,
                    redirigir_a_usuario_detalle: true
                });
                
                Swal.close();
            })
            .catch((error) => {
                console.log(error)
            });
    }

    render() {

        if (this.state.loading_usuarios) {
            return <h1>
                {Swal.showLoading()}
            </h1>;
        }

        if (this.state.redirigir_a_usuario_detalle) {
            return (<Redirect to={'/usuario-detalle'} />)
          }

        let usuarios = this.state.usuarios;

        return (
            <IonPage>
                <IonContent>
                    <IonHeader style={{ textAlign: "right" }}>
                        <IonToolbar>

                            <IonButtons slot="start">
                                <IonBackButton defaultHref="/usuarios" icon={arrowBackOutline} />
                            </IonButtons>

                            <IonTitle style={{ fontFamily: "sans-serif", fontSize: "15px" }}><b>LISTA DE PROCEDIMIENTOS</b></IonTitle>
                        </IonToolbar>
                    </IonHeader>

                    <IonSearchbar id="search" onIonChange={(e) => this.filtrarUsuarios()} showCancelButton="focus" placeholder="Buscar usuario"></IonSearchbar>
                    <IonList>
                        {
                            usuarios.filter(usuario => usuario.nombre.includes(this.state.search_string)).map(item => (
                                <IonItem key={item.id} onClick={(e) => this._getUsuario(item.id)}>
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

export default connect(mapStateToProps)(UsuarioLista);