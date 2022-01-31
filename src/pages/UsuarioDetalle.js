import {
    IonContent, IonPage,
    IonHeader, IonToolbar,
    IonTitle, IonButtons,
    IonButton, IonList, IonItem,
    IonLabel, IonInput,
    IonBackButton, IonFooter, IonImg, IonThumbnail,
    IonSelect, IonSelectOption
} from '@ionic/react';
import {
    arrowBackOutline
} from 'ionicons/icons';
import { Component } from 'react'
import { Redirect } from 'react-router-dom'

import { url, saltingCode, prepararPost, infoUsuario } from '../utilities/utilities.js'
import { MD5 } from '../utilities/crypto'
import Swal from 'sweetalert2'

import { connect } from 'react-redux'
import { setTimeout } from 'timers';

const mapStateToProps = store => ({
    usuario: store.usuario
});

class UsuarioDetalle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: url(),
            usuario_logueado: infoUsuario('usuario'),
            usuario_logueado_perfil: infoUsuario('perfil'),
            usuario: [],
            redireccionar_atras: false,
        }
    }

    UNSAFE_componentWillMount() {
        this.setState({
            usuario: this.props.usuario.list[0]
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

    mensajeValidacion = (mensaje) => {
        Swal.fire({
            title: 'Aviso',
            text: mensaje,
            icon: 'info',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#E0218A'
        });
    }

    modificarUsuario = () => {
        var id = document.getElementById('id').value;
        var telefono = document.getElementById('telefono').value;
        var fecha_nac = document.getElementById('fecha_nac').value;
        var identidad = document.getElementById('identidad').value;
        var direccion = document.getElementById('direccion').value;

        var activo = document.getElementById('activo').value;
        var fec_act = "NOW()";
        var usr_act = this.state.usuario_logueado;
        
        var clave = document.getElementById('clave').value;
        var clave_hidden = document.getElementById('clave_hidden').value;

        clave = (clave.length > 0) ? MD5(clave + saltingCode) : clave_hidden;

        if (telefono.length > 0 && fecha_nac.length > 0 &&
            identidad.length > 0 && direccion.length > 0) {

            //VALIDACIONES

            //Teléfono
            if (telefono.length < 8) {
                this.mensajeValidacion("El teléfono debe tener al menos 8 dígitos.");
                return;
            }

            //Identidad
            if (identidad.length < 13) {
                this.mensajeValidacion("La cédula de identidad debe tener al menos 13 caracteres.");
                return;
            }

            //Dirección
            if (direccion.length < 9) {
                this.mensajeValidacion("La dirección debe tener al menos 9 caracteres.");
                return;
            }

            //Si pasó todas las validaciones pasamos al siguiente bloque
            var valuesUsuario = {
                id: id, telefono: telefono, fecha_nac: fecha_nac, id_rtn: identidad,
                direccion: direccion, activo: activo, fec_act: fec_act, usr_act: usr_act
            }

            const requestOptionsUsuario = prepararPost(valuesUsuario, "update_usuario", "updateJsons", "jsonSingle");

            fetch(this.state.url, requestOptionsUsuario)
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
                            text: 'Información del usuario modificada exitosamente!',
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

    render() {

        if (this.state.redireccionar_atras) {
            return (<Redirect to={'/usuario-lista'} />)
        }

        let usuario = this.state.usuario;
        let usuario_perfil = this.state.usuario_logueado_perfil;

        return (
            <IonPage>
                <IonContent>
                    <IonHeader style={{ textAlign: "right" }}>
                        <IonToolbar>

                            <IonButtons slot="start">
                                <IonBackButton defaultHref="/usuarios" icon={arrowBackOutline} />
                            </IonButtons>

                            <IonTitle style={{ fontFamily: "sans-serif", fontSize: "15px" }}><b>MODIFICAR USUARIO</b></IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonList>

                        <IonInput id="id" value={usuario.id} type="hidden"></IonInput>
                        <IonInput id="clave_hidden" value={usuario.clave} type="hidden"></IonInput>

                        <IonItem>
                            <IonLabel>Nombre:</IonLabel>
                            <IonInput id="nombre" value={usuario.nombre} type="text" placeholder="Nombre del usuario" style={{ color: "gray" }} readonly></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Telefono:</IonLabel>
                            <IonInput id="telefono" value={usuario.telefono} type="number" placeholder="Teléfono" required></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Fecha de Nacimiento:</IonLabel>
                            <IonInput id="fecha_nac" value={usuario.fecha_nac} type="date" placeholder="" required></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Identidad:</IonLabel>
                            <IonInput id="identidad" value={usuario.id_rtn} type="text" placeholder="Identidad" required></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Dirección:</IonLabel>
                            <IonInput id="direccion" value={usuario.direccion} type="text" placeholder="Nombre del usuario" required></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonThumbnail slot="start">
                                <IonImg src={usuario.foto} />
                            </IonThumbnail>
                            <IonButton color="favorite">Cambiar foto</IonButton>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Usuario:</IonLabel>
                            <IonInput id="usuario" value={usuario.usuario} type="text" style={{ color: "gray" }} readonly></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Clave:</IonLabel>
                            <IonInput id="clave" type="password" placeholder="••••••••••••••••••"></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Perfil</IonLabel>
                            <IonSelect okText="Aceptar" id="perfil" value={usuario.perfil} cancelText="Cancelar" interface="action-sheet" key={usuario.perfil}>
                                <IonSelectOption value="1">Administrador</IonSelectOption>
                                <IonSelectOption value="2">Vendedor</IonSelectOption>
                                <IonSelectOption value="3">Recepcionista</IonSelectOption>
                                <IonSelectOption value="4">Técnico</IonSelectOption>
                            </IonSelect>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Activo</IonLabel>
                            <IonSelect okText="Aceptar" id="activo" value={usuario.activo} cancelText="Cancelar" placeholder={usuario.activo == 1 ? 'Sí' : 'No'} interface="action-sheet" key={usuario.id}>
                                <IonSelectOption value="1">Sí</IonSelectOption>
                                <IonSelectOption value="0">No</IonSelectOption>
                            </IonSelect>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Fecha Ingreso:</IonLabel>
                            <IonInput id="fec_ing" style={{ "color": "gray" }} value={usuario.fec_ing} type="text" readonly></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Usuario Ingresa:</IonLabel>
                            <IonInput id="usr_ing" style={{ "color": "gray" }} value={usuario.usr_ing} type="text" readonly></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Fecha Actualiza:</IonLabel>
                            <IonInput id="fec_act" style={{ "color": "gray" }} value={usuario.fec_act} type="text" readonly></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Usuario Actualiza:</IonLabel>
                            <IonInput id="usr_act" style={{ "color": "gray" }} value={usuario.usr_act} type="text" readonly></IonInput>
                        </IonItem>

                    </IonList>
                </IonContent>
                <IonFooter>
                    {
                        usuario_perfil == 4 ?
                            <IonButton disabled="true" color="favorite" expand="block" onClick={() => this.modificarUsuario()}>Modificar Usuario</IonButton> :
                            <IonButton disabled="false" color="favorite" expand="block" onClick={() => this.modificarUsuario()}>Modificar Usuario</IonButton>
                    }
                </IonFooter>
            </IonPage >
        )
    }
}

export default connect(mapStateToProps)(UsuarioDetalle);