export function getClientes(_list){
    return function(dispatch){
        dispatch({
            type: 'GET_CLIENTES',
            payload: {
                list: _list
            }
        })
    }
}