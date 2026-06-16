import SortByBudget from './SortByBudget';
import SortByDeadline from './SortByDeadline';
import SortByStatus from './SortByStatus';

// Maps a UI dropdown key to the concrete strategy instance used to sort
// projects at runtime. The Projects page reads from here so it never needs
// to know which sorting algorithm is running — it just calls strategy.sort().
export const sortStrategies = {
    budget: new SortByBudget(),
    deadline: new SortByDeadline(),
    status: new SortByStatus(),
};

// Options rendered in the sort dropdown, in display order.
export const sortOptions = [
    { value: '', label: 'None' },
    { value: 'budget', label: 'Budget (high to low)' },
    { value: 'deadline', label: 'Deadline (soonest first)' },
    { value: 'status', label: 'Status' },
];
