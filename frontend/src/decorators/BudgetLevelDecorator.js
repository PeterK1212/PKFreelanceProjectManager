import ProjectDecorator from './ProjectDecorator';

// Adds a budgetLevel label derived from the budget amount:
//   Low    < 1000
//   Medium 1000 - 4999
//   High   >= 5000
class BudgetLevelDecorator extends ProjectDecorator {
    getData() {
        const data = super.getData();
        const budget = data.budget || 0;

        let budgetLevel = 'Low';
        if (budget >= 5000) {
            budgetLevel = 'High';
        } else if (budget >= 1000) {
            budgetLevel = 'Medium';
        }

        return { ...data, budgetLevel };
    }
}

export default BudgetLevelDecorator;
