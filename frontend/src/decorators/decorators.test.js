import ProjectDecorator from './ProjectDecorator';
import OverdueDecorator from './OverdueDecorator';
import BudgetLevelDecorator from './BudgetLevelDecorator';
import { decorateProject } from './index';

// Fixed past/future dates so the overdue logic is deterministic.
const PAST = '2000-01-01';
const FUTURE = '2999-01-01';

describe('ProjectDecorator base', () => {
  test('returns a copy of the plain project, not the same reference', () => {
    const project = { _id: '1', title: 'A' };
    const data = new ProjectDecorator(project).getData();
    expect(data).toEqual(project);
    expect(data).not.toBe(project);
  });
});

describe('OverdueDecorator', () => {
  test('flags a past deadline that is not completed', () => {
    const data = new OverdueDecorator({ deadline: PAST, status: 'Pending' }).getData();
    expect(data.isOverdue).toBe(true);
  });

  test('does not flag a completed project even if past deadline', () => {
    const data = new OverdueDecorator({ deadline: PAST, status: 'Completed' }).getData();
    expect(data.isOverdue).toBe(false);
  });

  test('does not flag a future deadline', () => {
    const data = new OverdueDecorator({ deadline: FUTURE, status: 'Pending' }).getData();
    expect(data.isOverdue).toBe(false);
  });

  test('does not flag when there is no deadline', () => {
    const data = new OverdueDecorator({ status: 'Pending' }).getData();
    expect(data.isOverdue).toBe(false);
  });
});

describe('BudgetLevelDecorator', () => {
  test.each([
    [0, 'Low'],
    [999, 'Low'],
    [1000, 'Medium'],
    [4999, 'Medium'],
    [5000, 'High'],
    [12000, 'High'],
  ])('budget %i -> %s', (budget, expected) => {
    expect(new BudgetLevelDecorator({ budget }).getData().budgetLevel).toBe(expected);
  });

  test('treats a missing budget as Low', () => {
    expect(new BudgetLevelDecorator({}).getData().budgetLevel).toBe('Low');
  });
});

describe('decorateProject (stacked decorators)', () => {
  test('adds both computed fields and keeps original fields', () => {
    const project = { _id: '1', title: 'A', budget: 6000, deadline: PAST, status: 'In Progress' };
    const data = decorateProject(project);

    expect(data.title).toBe('A');
    expect(data.budgetLevel).toBe('High');
    expect(data.isOverdue).toBe(true);
  });

  test('does not mutate the original project', () => {
    const project = { _id: '1', budget: 6000, deadline: PAST, status: 'Pending' };
    decorateProject(project);
    expect(project).not.toHaveProperty('budgetLevel');
    expect(project).not.toHaveProperty('isOverdue');
  });
});
