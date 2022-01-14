export default function reducer(state = { list: undefined }, action){
	switch(action.type){
		case 'GET_USUARIO':
		
		state = {
		   ...state.usuario, list: action.payload.list
		}
		break;
		
		default:
		return state;
	}

	return state
}