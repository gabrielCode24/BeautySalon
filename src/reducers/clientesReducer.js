export default function reducer(state = { list: undefined }, action){
	switch(action.type){
		case 'GET_CLIENTES':
		
		state = {
		   ...state.clientes, list: action.payload.list
		}
		break;
		
		default:
		return state;
	}

	return state
}