import { combineReducers } from 'redux'
import procedimientos from './procedimientosReducer'
import procedimiento from './procedimientoReducer'

import usuarios from './usuariosReducer'
import usuario from './usuarioReducer'

const reducerCombinados = combineReducers({ procedimientos, procedimiento, 
                                            usuarios, usuario });

export default reducerCombinados