import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
//import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import Login from './pages/Login'
import Home from './pages/Home'
import Citas from './pages/Citas'
import Clientes from './pages/Clientes'
import Procedimientos from './pages/Procedimientos'
import Usuarios from './pages/Usuarios'
import UsuarioCrear from './pages/UsuarioCrear'
import ClienteCrear from './pages/ClienteCrear'
import ProcediminetoCrear from './pages/ProcedimientoCrear'
import ProcedimientoLista from './pages/ProcedimientoLista'

setupIonicReact();

function App() {

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/citas">
            <Citas />
          </Route>
          <Route exact path="/clientes">
            <Clientes />
          </Route>
          <Route exact path="/procedimientos">
            <Procedimientos />
          </Route>
          <Route exact path="/usuarios">
            <Usuarios />
          </Route>
          <Route exact path="/usuario-crear">
            <UsuarioCrear />
          </Route>
          <Route exact path="/cliente-crear">
            <ClienteCrear />
          </Route>
          <Route exact path="/procedimiento-crear">
            <ProcediminetoCrear />
          </Route>
          <Route exact path="/procedimiento-lista">
            <ProcedimientoLista />
          </Route>
          
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  )
}

export default App;
