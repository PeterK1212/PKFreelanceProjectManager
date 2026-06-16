import SortStrategy from './SortStrategy';

// Sorts projects by budget, highest first. Missing/undefined budgets sort last.
class SortByBudget extends SortStrategy {
    sort(projects) {
        return [...projects].sort((a, b) => (b.budget || 0) - (a.budget || 0));
    }
}

export default SortByBudget;
