const API_URL = process.env.REACT_APP_API_URL;
const API_PORT = process.env.REACT_APP_API_PORT;

export function uploadfile (file) {
    // upload image file via a POST request "http://${API_URL}:${API_PORT}/uploadfile/"
    // return the response from the server
    const formData = new FormData();
    formData.append('file', file);
    return fetch(`http://${API_URL}:${API_PORT}/uploadfile/`, {
        method: 'POST',
        body: formData
    })
}
