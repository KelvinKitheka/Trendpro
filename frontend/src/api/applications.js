import axios from "axios";

const client = axios.create({
    baseURL: "http://localhost:8000/api",
    headers: {"Content-Type": "application/json"},
})

const get = (url) => client.get(url).then(r => r.data)
const post = (url, data) => client.post(url, data).then(r => r.data)
const patch = (url, data) => client.patch(url, data).then(r => r.data)

export const api = {
    list: () => get("/applications"),
    get: (id) => get(`/applications/${id}`),
    create: (data) => post("/applications", data),
    update: (id, data) => patch(`/applications/${id}`, data),
    submit: (id) => post(`/applications/${id}/submit`),
    startReview: (id) => post(`/applications/${id}/start-review`),
    decision: (id, data) => post(`/applications/${id}/decision`, data),
}