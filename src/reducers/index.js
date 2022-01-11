import { combineReducers } from 'redux'
import procedimientos from './procedimientosReducer'

const reducerCombinados = combineReducers({ procedimientos })

export default reducerCombinados