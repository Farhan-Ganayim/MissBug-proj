import { utilService } from './util.service.js'

const BASE_URL = '/api/bug/'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter
}

function query(filterBy) {
    return axios.get(BASE_URL, { params: filterBy })
        .then(res => res.data)
}

function getById(bugId) {
    return axios.get(BASE_URL + bugId)
        .then(res => res.data)
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId)
        .then(res => res.data)
        .catch(err => {
            console.error('Error deleting bug', err)
            throw err
        })
}

function save(bug) {

    if (bug._id) {
        return axios.put(BASE_URL + bug._Id, bug)
            .then(res => res.data)
            .catch(err => {
                console.error('Error editing bug', err)
            })
    } else {
        return axios.post(BASE_URL, bug)
            .then(res => res.data)
            .catch(err => {
                console.error('Error adding bug', err)
            })
    }
}

function getDefaultFilter() {
    return { txt: '', minSeverity: 0 }
}

// function _createBugs() {
//     let bugs = utilService.loadFromStorage(STORAGE_KEY)
//     if (bugs && bugs.length > 0) return

//     bugs = [
//         {
//             title: "Infinite Loop Detected",
//             severity: 4,
//             _id: "1NF1N1T3"
//         },
//         {
//             title: "Keyboard Not Found",
//             severity: 3,
//             _id: "K3YB0RD"
//         },
//         {
//             title: "404 Coffee Not Found",
//             severity: 2,
//             _id: "C0FF33"
//         },
//         {
//             title: "Unexpected Response",
//             severity: 1,
//             _id: "G0053"
//         }
//     ]
//     utilService.saveToStorage(STORAGE_KEY, bugs)
// }
