import {
    IonContent, IonPage,
    IonHeader, IonToolbar,
    IonTitle, IonButtons,
    IonSelectOption, IonSelect, IonButton,
    IonList, IonItem,
    IonLabel, IonInput,
    IonBackButton, IonFooter
} from '@ionic/react';
import {
    arrowBackOutline
} from 'ionicons/icons';
import { Component } from 'react'
import { Redirect } from 'react-router-dom'

import { url, prepararPost, infoUsuario } from '../utilities/utilities.js'
import Swal from 'sweetalert2'

class ProcedimientoCrear extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: url(),
            logged: true,
            usuario_logueado: infoUsuario('usuario'),
            usuarios: false,
            redireccionar_atras: false,
            loading_tiempo_est: false,
            tiempos_est: [],
            tiempo_estimado_selected: 1
        }
    }

    UNSAFE_componentWillMount() {
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

    registrarProcedimiento = () => {
        var nombre = document.getElementById('nombre').value;
        var descripcion = document.getElementById('descripcion').value;
        var precio = document.getElementById('precio').value;
        var perm_camb_pre_vend = document.getElementById('perm_camb_pre_vend').value;
        var tiempo_estimado = this.state.tiempo_estimado_selected;

        if (typeof (perm_camb_pre_vend)) {
            perm_camb_pre_vend = 1;
        }

        var fec_ing = "NOW()";
        var usr_ing = this.state.usuario_logueado;

        if (nombre.length > 0 && precio.length > 0) {

            //VALIDACIONES
            //Nombre del procedimiento
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
                nombre: nombre, descripcion: descripcion, precio_sug: precio,
                tiempo_estimado: tiempo_estimado, permitido_cambiar_pre_vendedor: perm_camb_pre_vend,
                fec_ing: fec_ing, usr_ing: usr_ing
            }

            this.setState({
                sending: true
            });

            const requestOptionsProcedimiento = prepararPost(valuesProcedimiento, "procedimiento", "setJsons", "jsonSingle");
            
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
                        }).then((result) => {
                            if (result.isConfirmed) {
                                this.setState({ redireccionar_atras: true });
                            }
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

    render() {

        if (this.state.redireccionar_atras) {
            return (<Redirect to={'/procedimientos'} />)
        }

        if (this.state.sending) {
            return <h1>
                {Swal.showLoading()}
            </h1>;
        }

        return (
            <IonPage>
                <IonContent>
                    <IonHeader style={{ textAlign: "right" }}>
                        <IonToolbar>

                            <IonButtons slot="start">
                                <IonBackButton defaultHref="/procedimientos" icon={arrowBackOutline} />
                            </IonButtons>

                            <IonTitle style={{ fontFamily: "sans-serif" }}><b>CREAR PROCEDIMIENTO</b></IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonList>
                        <IonItem>
                            <IonLabel>Nombre:</IonLabel>
                            <IonInput id="nombre" type="text" placeholder="Nombre del procedimiento" required></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Descripción:</IonLabel>
                            <IonInput id="descripcion" type="textarea" placeholder="Descripción del procedimiento" required></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Tiempo estimado ejecución:</IonLabel>
                            <IonSelect onIonChange={(e) => this._getTiempoEstimadoSeleccionado(e)} interface="action-sheet" placeholder="Una hora" cancelText="Cerrar lista">
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
                            <IonInput id="precio" type="number" placeholder="Precio (L)" required></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel style={{ fontSize: "13px" }}>¿Permitido cambiar precio en cita por Vendedor?</IonLabel>
                            <IonSelect id="perm_camb_pre_vend" okText="Aceptar" placeholder="Sí" cancelText="Cancelar" interface="action-sheet">
                                <IonSelectOption value="1">Sí</IonSelectOption>
                                <IonSelectOption value="0">No</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                    </IonList>

                </IonContent>
                <IonFooter>
                    <IonButton color="favorite" expand="block" onClick={() => this.registrarProcedimiento()}>Registrar Procedimiento</IonButton>
                </IonFooter>
            </IonPage >
        )
    }
}

export default ProcedimientoCrear;