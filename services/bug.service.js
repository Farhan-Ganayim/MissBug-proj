import fs from 'fs'
import { utilService } from './util.service.js'

const bugs = utilService.readJsonFile('data/bugs.json')

export const bugService = {
    query,
    getById,
    remove,
    save
}

const PAGE_SIZE = 3

function query(filterBy) {
    return Promise.resolve(bugs)
        .then(bugs => {

            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                bugs = bugs.filter(bug => regExp.test(bug.title))
            }
            if (filterBy.minSeverity) {
                bugs = bugs.filter(bug => bug.severity >= +filterBy.minSeverity)
            }
            if (filterBy.sortBy) {
                const dir = +filterBy.sortDir || 1

                bugs.sort((a, b) => {
                    if (filterBy.sortBy === 'title') {
                        return a.title.localeCompare(b.title) * dir
                    } else {
                        return (a[filterBy.sortBy] - b[filterBy.sortBy]) * dir
                    }
                })
            }
            if (filterBy.pageIdx !== undefined) {
                const startIdx = filterBy.pageIdx * PAGE_SIZE
                bugs = bugs.slice(startIdx, startIdx + PAGE_SIZE)
            }
            return bugs

        })
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Cannot find bug: ' + bugId)
    return Promise.resolve(bug)
}

function remove(bugId, loggedInUser) {

    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    if (bugIdx === -1) return Promise.reject('Cannot remove bug: ' + bugId)

    if (!loggedInUser.isAdmin &&
        bugs[bugIdx].owner._id !== loggedInUser._id) {
        return Promise.reject(`Not your bug`)
    }

    bugs.splice(bugIdx, 1)
    return _saveBugsToFile()
}

function save(bugToSave, loggedinUser) {
    if (bugToSave._id) {
        const bugIdx = bugs.findIndex(bug => bug._id === bugToSave._id)
        const bugToUpdate = bugs[bugIdx]
        if (!loggedinUser.isAdmin &&
            bugToUpdate.owner._id !== loggedinUser._id) {
            return Promise.reject(`Not your bug`)
        }
        bugs[bugIdx] = { ...bugs[bugIdx], ...bugToSave }
    } else {

        bugToSave._id = utilService.makeId()
        bugToSave.createdAt = Date.now()
        bugToSave.owner = loggedinUser
        bugs.unshift(bugToSave)
    }
    return _saveBugsToFile()
        .then(() => bugToSave)
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile('data/bugs.json', data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}

