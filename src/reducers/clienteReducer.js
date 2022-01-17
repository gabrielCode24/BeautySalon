export default function reducer(state = { list: undefined }, action){
	switch(action.type){
		case 'GET_CLIENTE':
		
		state = {
		   ...state.cliente, list: action.payload.list
		}
		break;
		
		default:
		return state;
	}

	return state
}