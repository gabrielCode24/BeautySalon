export default function reducer(state = { list: undefined }, action){
	switch(action.type){
		case 'GET_CITA':
		
		state = {
		   ...state.cita, list: action.payload.list
		}
		break;
		
		default:
		return state;
	}

	return state
}