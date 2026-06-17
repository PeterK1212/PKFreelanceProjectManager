import SortStrategy from './SortStrategy';

// Logical workflow order for project status.
const STATUS_ORDER = {
    'Pending': 0,
    'In Progress': 1,
    'Completed': 2,
};

// Sorts projects by workflow status: Pending -> In Progress -> Completed.
// Unknown statuses sort last.
class SortByStatus extends SortStrategy {
    sort(projects) {
        const rank = (p) => (p.status in STATUS_ORDER ? STATUS_ORDER[p.status] : 99);
        return [...projects].sort((a, b) => rank(a) - rank(b));
    }
}

export default SortByStatus;
