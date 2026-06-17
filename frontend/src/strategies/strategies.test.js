import SortStrategy from './SortStrategy';
import SortByBudget from './SortByBudget';
import SortByDeadline from './SortByDeadline';
import SortByStatus from './SortByStatus';
import { sortStrategies } from './index';

const projects = [
  { _id: '1', title: 'A', budget: 500, status: 'Completed', deadline: '2026-03-10' },
  { _id: '2', title: 'B', budget: 1500, status: 'Pending', deadline: '2026-01-05' },
  { _id: '3', title: 'C', budget: 1000, status: 'In Progress', deadline: '2026-02-20' },
];

const ids = (list) => list.map((p) => p._id);

describe('SortStrategy base class', () => {
  test('throws if sort() is not overridden', () => {
    const base = new SortStrategy();
    expect(() => base.sort(projects)).toThrow();
  });
});

describe('SortByBudget', () => {
  test('orders by budget, highest first', () => {
    expect(ids(new SortByBudget().sort(projects))).toEqual(['2', '3', '1']);
  });

  test('does not mutate the input array', () => {
    const input = [...projects];
    new SortByBudget().sort(input);
    expect(ids(input)).toEqual(['1', '2', '3']);
  });
});

describe('SortByDeadline', () => {
  test('orders by deadline, soonest first', () => {
    expect(ids(new SortByDeadline().sort(projects))).toEqual(['2', '3', '1']);
  });
});

describe('SortByStatus', () => {
  test('orders Pending -> In Progress -> Completed', () => {
    expect(ids(new SortByStatus().sort(projects))).toEqual(['2', '3', '1']);
  });
});

describe('sortStrategies registry (polymorphism)', () => {
  test('every registered strategy exposes a sort() method', () => {
    Object.values(sortStrategies).forEach((strategy) => {
      expect(strategy).toBeInstanceOf(SortStrategy);
      expect(typeof strategy.sort).toBe('function');
    });
  });
});
