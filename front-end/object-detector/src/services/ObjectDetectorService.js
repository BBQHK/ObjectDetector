const API_URL = '127.0.0.1';
const API_PORT = '8002';

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
