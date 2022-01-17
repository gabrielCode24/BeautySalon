import { combineReducers } from 'redux'
import procedimientos from './procedimientosReducer'
import procedimiento from './procedimientoReducer'

import usuarios from './usuariosReducer'
import usuario from './usuarioReducer'

import clientes from './clientesReducer'
import cliente from './clienteReducer'

const reducerCombinados = combineReducers({ procedimientos, procedimiento, 
                                            usuarios, usuario,
                                            clientes, cliente });

export default reducerCombinados