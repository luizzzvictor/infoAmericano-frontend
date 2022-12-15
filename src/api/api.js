import axios from 'axios'

// original
 const apiURLs = {
    development: "http://localhost:8080",
    production:  "https://infoamericano.fly.dev/"
 }

// roda front-end (local) acessando base de dados remota (criada pelo Luiz)
//const apiURLs = {
//    development: "https://infoamericano.fly.dev/",
//    production:  "https://infoamericano.fly.dev/"
// }

// roda front-end (local) acessando base de dados definida no .env
//const apiURLs = {
//   development: "http://localhost:8080",
//   production:  "https://infoamericano.fly.dev/"
//}

const api = axios.create({baseURL: apiURLs[process.env.NODE_ENV]})

//token - Necessário à implementação da AUTENTICAÇÃO
// http://localhost:8080
api.interceptors.request.use((config) => {
    const loggedInUserJSON = localStorage.getItem("loggedInUser")

    const parseLoggedInUser = JSON.parse(loggedInUserJSON || '""')

    if (parseLoggedInUser.token) {
        config.headers = {Authorization: `Bearer ${parseLoggedInUser.token}`}
    }

    return config
})

export default api