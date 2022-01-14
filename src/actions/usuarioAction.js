export function getUsuarioData(_list){
    return function(dispatch){
        dispatch({
            type: 'GET_USUARIO',
            payload: {
                list: _list
            }
        })
    }
}