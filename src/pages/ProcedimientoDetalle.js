import {
    IonContent, IonPage,
    IonHeader, IonToolbar,
    IonTitle, IonButtons,
    IonButton, IonList, IonItem,
    IonLabel, IonInput,
    IonBackButton, IonFooter, IonTextarea,
    IonSelect, IonSelectOption
} from '@ionic/react';
import {
    arrowBackOutline
} from 'ionicons/icons';
import { Component } from 'react'
import { Redirect } from 'react-router-dom'
//import './Home.css';
import { url, prepararPost, infoUsuario } from '../utilities/utilities.js'
import Swal from 'sweetalert2'

import { connect } from 'react-redux'

const mapStateToProps = store => ({
    procedimiento: store.procedimiento
});

class ProcedimientoDetalle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: url(),
            usuario_logueado: infoUsuario('usuario'),
            usuario_logueado_perfil: infoUsuario('perfil'),
            procedimiento: [],
            redireccionar_atras: false,
            loading_tiempo_est: false,
            tiempos_est: [],
            tiempo_estimado_selected: ''
        }
    }

    UNSAFE_componentWillMount() {
        this.setState({
            procedimiento: this.props.procedimiento.list[0],
            tiempo_estimado_selected: this.props.procedimiento.list[0].tiempo_estimado
        });
        this._getProcedimientoTiempoEst();
    }

    _getProcedimientoTiempoEst = () => {
        this.setState({ loading_tiempo_est: true })

        let Parameters = "?action=getJSON&get=procedimiento_tiempo_est";

        fetch(this.state.url + Parameters)
            .then((res) => res.json())
            .then((responseJson) => {

                this.setState({
                    loading_tiempo_est: false,
                    tiempos_est: responseJson
                });
                Swal.close();
            })
            .catch((error) => {
                console.log(error)
            });
    }

    _getTiempoEstimadoSeleccionado = (e) => {
        let id = e.target.value.id;

        this.setState({
            tiempo_estimado_selected: id
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

    modificarProcedimiento = () => {
        var id = document.getElementById('id').value;
        var nombre = document.getElementById('nombre').value;
        var descripcion = document.getElementById('descripcion').value;
        var precio = document.getElementById('precio').value;
        var activo = document.getElementById('activo').value;
        var perm_camb_pre_vend = document.getElementById('perm_camb_pre_vend').value;
        var tiempo_estimado = this.state.tiempo_estimado_selected;
        var fec_act = "NOW()";
        var usr_act = this.state.usuario_logueado;

        if (nombre.length > 0 && precio.length > 0) {

            //VALIDACIONES
            //Nombre
            if (nombre.length < 6) {
                this.mensajeValidacion("El nombre debe tener al menos 6 caracteres.");
                return;
            }

            //Descripción
            if (descripcion.length > 1) {
                if (descripcion.length < 10) {
                    this.mensajeValidacion("La descripción del procedimiento debe tener al menos 10 caracteres.");
                    return;
                }
            }

            //Precio
            if (precio == 0.00 & precio == 0 && precio < 0) {
                this.mensajeValidacion("El precio ingresado no es correcto, favor ingrese un precio válido.");
                return;
            }

            //Si pasó todas las validaciones pasamos al siguiente bloque
            var valuesProcedimiento = {
                id: id, nombre: nombre, descripcion: descripcion, precio_sug: precio, activo: activo,
                tiempo_estimado: tiempo_estimado, permitido_cambiar_pre_vendedor: perm_camb_pre_vend,
                fec_act: fec_act, usr_act: usr_act
            }

            const requestOptionsProcedimiento = prepararPost(valuesProcedimiento, "update_procedimiento", "updateJsons", "jsonSingle");

            fetch(this.state.url, requestOptionsProcedimiento)
                .then((response) => {
                    if (response.status === 200) {
                        Swal.close();

                        this.setState({
                            sending: false
                        });

                        Swal.fire({
                            title: '¡Éxito!',
                            text: '¡Procedimiento modificado exitosamente!',
                            icon: 'success',
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: '#E0218A'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                this.setState({ redireccionar_atras: true });
                            }
                        });
                    } else {
                        Swal.fire({
                            title: 'Algo falló',
                            text: 'Ocurrió un error inesperado, no se pudo modificar el procedimiento, favor comunicarse con el desarrollador.',
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
            return (<Redirect to={'/procedimiento-lista'} />)
        }

        let procedimiento = this.state.procedimiento;
        let usuario_perfil = this.state.usuario_logueado_perfil;

        return (
            <IonPage>
                <IonContent>
                    <IonHeader style={{ textAlign: "right" }}>
                        <IonToolbar>

                            <IonButtons slot="start">
                                <IonBackButton defaultHref="/procedimientos" icon={arrowBackOutline} />
                            </IonButtons>

                            <IonTitle style={{ fontFamily: "sans-serif", fontSize: "15px" }}><b>MODIFICAR PROCEDIMIENTO</b></IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonList>

                        <IonInput id="id" value={procedimiento.id} type="hidden"></IonInput>

                        <IonItem>
                            <IonLabel>Nombre:</IonLabel>
                            <IonInput id="nombre" value={procedimiento.nombre} type="text" placeholder="Nombre del procedimiento" required></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Descripción:</IonLabel>
                            <IonTextarea id="descripcion" value={procedimiento.descripcion} type="textarea" placeholder="Descripción del procedimiento" rows={3} required></IonTextarea>
                        </IonItem>

                        <IonItem>
                            <IonLabel style={{ fontSize: "13px" }}>Tiempo estimado ejecución:</IonLabel>
                            <IonSelect onIonChange={(e) => this._getTiempoEstimadoSeleccionado(e)} interface="action-sheet" placeholder={procedimiento.descripcion_tiempo_est} cancelText="Cerrar lista">
                                {
                                    this.state.tiempos_est.map((item) => {
                                        return (
                                            <IonSelectOption value={item} key={item.id}>{item.descripcion}</IonSelectOption>
                                        )
                                    })
                                }
                            </IonSelect>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Precio (L):</IonLabel>
                            {
                                usuario_perfil == 2 && procedimiento.permitido_cambiar_pre_vendedor == 0 ?
                                    <IonInput id="precio" value={procedimiento.precio_sug} type="number" placeholder="Precio (L) " readonly="true"></IonInput> :
                                    <IonInput id="precio" value={procedimiento.precio_sug} type="number" placeholder="Precio (L) " readonly="false" required></IonInput>

                            }
                        </IonItem>

                        {
                            usuario_perfil != 2 ?
                                <IonItem>
                                    <IonLabel style={{ fontSize: "13px" }}>¿Permitido cambiar precio en cita por Vendedor?</IonLabel>
                                    <IonSelect id="perm_camb_pre_vend" okText="Aceptar" value={procedimiento.permitido_cambiar_pre_vendedor} placeholder={procedimiento.permitido_cambiar_pre_vendedor == 1 ? 'Sí' : 'No'} cancelText="Cancelar" interface="action-sheet">
                                        <IonSelectOption value="1">Sí</IonSelectOption>
                                        <IonSelectOption value="0">No</IonSelectOption>
                                    </IonSelect>
                                </IonItem> :
                            ''
                        }

                        <IonItem>
                            <IonLabel>Activo</IonLabel>
                            <IonSelect okText="Aceptar" id="activo" value={procedimiento.activo} cancelText="Cancelar" placeholder={procedimiento.activo == 1 ? 'Sí' : 'No'} interface="action-sheet" key={procedimiento.id}>
                                <IonSelectOption value="1">Sí</IonSelectOption>
                                <IonSelectOption value="0">No</IonSelectOption>
                            </IonSelect>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Fecha Ingreso:</IonLabel>
                            <IonInput id="fec_ing" style={{ "color": "gray" }} value={procedimiento.fec_ing} type="text" readonly></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Usuario Ingresa:</IonLabel>
                            <IonInput id="usr_ing" style={{ "color": "gray" }} value={procedimiento.usr_ing} type="text" readonly></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Fecha Actualiza:</IonLabel>
                            <IonInput id="fec_act" style={{ "color": "gray" }} value={procedimiento.fec_act} type="text" readonly></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Usuario Actualiza:</IonLabel>
                            <IonInput id="usr_act" style={{ "color": "gray" }} value={procedimiento.usr_act} type="text" readonly></IonInput>
                        </IonItem>

                    </IonList>
                </IonContent>
                <IonFooter>
                    {
                        usuario_perfil == 4 ?
                            <IonButton disabled="true" color="favorite" expand="block" onClick={() => this.modificarProcedimiento()}>Modificar Procedimiento</IonButton> :
                            <IonButton disabled="false" color="favorite" expand="block" onClick={() => this.modificarProcedimiento()}>Modificar Procedimiento</IonButton>
                    }
                </IonFooter>
            </IonPage >
        )
    }
}

export default connect(mapStateToProps)(ProcedimientoDetalle);