import SortStrategy from './SortStrategy';

// Sorts projects by deadline, soonest first. Missing deadlines sort last.
class SortByDeadline extends SortStrategy {
    sort(projects) {
        const time = (p) => (p.deadline ? new Date(p.deadline).getTime() : Infinity);
        return [...projects].sort((a, b) => time(a) - time(b));
    }
}

export default SortByDeadline;
