const { useState, useEffect, useRef } = React
import { utilService } from "../services/util.service.js"

export function BugFilter({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
    const onSetFilterDebounce = useRef(utilService.debounce(onSetFilterBy, 700))

    useEffect(() => {
        onSetFilterDebounce.current(filterByToEdit)
        console.log('Current filterBy 👌:', filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                break


            default:
                break
        }

        if (field === 'sortDir') value = +value
        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }

    const { txt, minSeverity } = filterByToEdit
    return (
        <section className="bug-filter">
            <h2>Filter</h2>
            <form onSubmit={onSubmitFilter}>
                <label htmlFor="txt">Text: </label>
                <input value={txt} onChange={handleChange} type="text" placeholder="By Text" id="txt" name="txt" />

                <label htmlFor="minSeverity">Min Severity: </label>
                <input value={minSeverity} onChange={handleChange} type="number" placeholder="By Min Severity" id="minSeverity" name="minSeverity" />
            </form>

            <label htmlFor="sortBy">Sort by:</label>
            <select id="sortBy" name="sortBy" value={filterByToEdit.sortBy} onChange={handleChange}>
                <option value="">-- None --</option>
                <option value="title">Title</option>
                <option value="severity">Severity</option>
                <option value="createdAt">Created At</option>
            </select>

            <label htmlFor="sortDir">Direction:</label>
            <select id="sortDir" name="sortDir" value={filterByToEdit.sortDir} onChange={handleChange}>
                <option value="1">Ascending</option>
                <option value="-1">Descending</option>
            </select>
        </section>
    )
}