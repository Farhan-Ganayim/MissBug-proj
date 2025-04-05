const { useState, useEffect } = React

// import { bugService } from '../services/bug.service.local.js'
import { bugService } from '../services/bug.service.js'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

import { BugFilter } from '../cmps/BugFilter.jsx'
import { BugList } from '../cmps/BugList.jsx'

export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())

    useEffect(loadBugs, [filterBy])

    function loadBugs() {
        bugService.query(filterBy)
            .then(setBugs)
            .catch(err => showErrorMsg(`Couldn't load bugs - ${err}`))
    }

    function onRemoveBug(bugId) {
        bugService.remove(bugId)
            .then(() => {
                const bugsToUpdate = bugs.filter(bug => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => showErrorMsg(`Cannot remove bug`, err))
    }

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?', 'Bug ' + Date.now()),
            description: prompt('Bug description?'),
            severity: +prompt('Bug severity?')
        }

        bugService.save(bug)
            .then(savedBug => {
                setBugs([...bugs, savedBug])
                showSuccessMsg('Bug added')
            })
            .catch(err => showErrorMsg(`Cannot add bug`, err))
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?', bug.severity)
        const bugToSave = { ...bug, severity }

        bugService.save(bugToSave)
            .then(savedBug => {
                const bugsToUpdate = bugs.map(currBug =>
                    currBug._id === savedBug._id ? savedBug : currBug)

                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch(err => showErrorMsg('Cannot update bug', err))
    }

    // function onSetFilterBy(filterBy) {
    //     setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))

    function onSetFilterBy(filterBy) {
        setFilterBy(prevFilter => {
            const isSorting = filterBy.sortBy !== prevFilter.sortBy
                || filterBy.sortDir !== prevFilter.sortDir
            if (isSorting && filterBy.pageIdx !== undefined) return ({ ...prevFilter, ...filterBy, pageIdx: 0 })
            else return ({ ...prevFilter, ...filterBy })
        })
    }

    function togglePaging(ev) {
        const isChecked = ev.target.checked
        setFilterBy(prevFilter => {
            if (isChecked) return { ...prevFilter, pageIdx: 0 }
            else return { ...prevFilter, pageIdx: undefined }
        })
    }

    function onChangePage(diff) {
        if (filterBy.pageIdx === undefined) return
        setFilterBy(prevFilter => {
            let nextPageIdx = prevFilter.pageIdx + diff
            if (nextPageIdx < 0) nextPageIdx = 0
            return { ...prevFilter, pageIdx: nextPageIdx }
        })

    }


    return <section className="bug-index main-content">

        <BugFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
        <header>
            <h3>Bug List</h3>
            <button onClick={onAddBug}>Add Bug</button>
        </header>
        <section className="bug-index-paging">
            <label htmlFor="paging-toggle">Use pages</label>
            <input
                type='checkbox'
                id='paging-toggle'
                name="paging"
                onChange={togglePaging}>

            </input>
            <button onClick={() => onChangePage(-1)}>←</button>
            {filterBy.pageIdx + 1 || '--'}
            <button onClick={() => onChangePage(1)}>→</button>

        </section>
        <BugList
            bugs={bugs}
            onRemoveBug={onRemoveBug}
            onEditBug={onEditBug} />
    </section>
}
