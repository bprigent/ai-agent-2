import React from 'react';
import MainPageWrap from '../components/templateComponents/MainPageWrap';
import { fetchExpenses } from '../store/expensesSlice';
import { useDispatch, useSelector } from 'react-redux'; 
import { useEffect } from 'react';
import CustomTableHeader from '../components/expensesComponents/TableHeader';
import CustomTableRow from '../components/expensesComponents/TableRow';
import './Expenses.scss';


const Expenses = () => {
    const dispatch = useDispatch();
    // get expenses from redux store
    const expenses = useSelector((state) => state.expenses.items);
    const status = useSelector((state) => state.expenses.status);
    const error = useSelector((state) => state.expenses.error);

    // fetch expenses from backend when component mounts
    useEffect(() => {
        dispatch(fetchExpenses());
    }, [dispatch]);

    const expenseColumns = [
        { 
            id: 'date', 
            label: 'Date',
            render: (expense) => new Date(expense.Date).toLocaleDateString()
        },
        { 
            id: 'expenseName', 
            label: 'Expense Name',
            render: (expense) => expense['Expense Name']
        },
        { 
            id: 'budgetCategory', 
            label: 'Budget Category',
            render: (expense) => expense['Budget Category']
        },
        { 
            id: 'accountNumber', 
            label: 'Account Number',
            render: (expense) => expense['Account Number']
        },
        { 
            id: 'amount', 
            label: 'Amount',
            render: (expense) => `$${Math.abs(expense.Amount).toFixed(2)}`
        }
    ];



    if (status === 'loading') {
        return (
            <MainPageWrap title="Expenses">
                <p>Loading expenses...</p>
            </MainPageWrap>
        );
    }

    if (status === 'failed') {
        return (
            <MainPageWrap title="Expenses">
                <p>Error loading expenses: {error}</p>
            </MainPageWrap>
        );
    }

    return (
        <MainPageWrap title="Expenses">
            <div className="expense_page-table-container_w">
                <CustomTableHeader columns={expenseColumns} />
                {expenses.map((expense, index) => (
                    <CustomTableRow key={index} columns={expenseColumns} data={expense} />
                ))}
            </div>
        </MainPageWrap>
    );
};

export default Expenses;
