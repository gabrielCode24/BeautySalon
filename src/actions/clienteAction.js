export function getClienteData(_list){
    return function(dispatch){
        dispatch({
            type: 'GET_CLIENTE',
            payload: {
                list: _list
            }
        })
    }
}