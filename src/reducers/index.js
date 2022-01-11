import { combineReducers } from 'redux'
import procedimientos from './procedimientosReducer'
import procedimiento from './procedimientoReducer'

const reducerCombinados = combineReducers({ procedimientos, procedimiento })

export default reducerCombinados