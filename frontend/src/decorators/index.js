import ProjectDecorator from './ProjectDecorator';
import OverdueDecorator from './OverdueDecorator';
import BudgetLevelDecorator from './BudgetLevelDecorator';

// Stacks the display decorators onto a plain project and returns an enriched
// copy with computed fields (isOverdue, budgetLevel). The original project
// object is never mutated.
export const decorateProject = (project) =>
    new BudgetLevelDecorator(new OverdueDecorator(project)).getData();

export { ProjectDecorator, OverdueDecorator, BudgetLevelDecorator };
