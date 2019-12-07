import React, { useContext, useState } from "react";
import axioswal from "axioswal";
import NumberFormat from "react-number-format";
import { UserContext } from "../../components/UserContext";
import Layout from "../../components/layout";
import Grid from "@material-ui/core/Grid";
import redirectTo from "../../lib/redirectTo";
const queryString = require("query-string");
const TransactionSection = ({
  user: { transactions: initialTransactions, balance: initialBalance, netIncome: initialNetIncome },
  dispatch
}) => {
  function createData(date, description, category, amount) {
    return { date, description, category, amount };
  }

  initialTransactions = initialTransactions ? initialTransactions : [];
  const parsed = queryString.parse(location.search);
  const [transactions,setTransactions] = useState(initialTransactions);
  const [netIncome,setNetIncome] = useState(initialTransactions);


  // Validation for wrong transaction id
  if (!transactions.filter(transaction => transaction.id === parsed.id)[0])
    return <p>Something is wrong</p>;

  let transaction = transactions.filter(
    transaction => transaction.id === parsed.id
  )[0];
  console.log(transaction);
  const [balance] = useState(initialBalance);
  const [date, setDate] = useState(transaction.date);
  const [description, setDescription] = useState(transaction.description);
  const [category, setCategory] = useState(transaction.category);
  const [amount, setAmount] = useState(transaction.amount);
  const [type, setType] = useState(
    transaction.amount > 0 ? "income" : "expense"
  );

  let rows = [];
  for (let transaction of transactions) {
    let convertedAmount =
      type === "income" ? transaction.amount : -Math.abs(transaction.amount);
    rows.push(
      createData(
        transaction.date,
        transaction.description,
        transaction.category,
        convertedAmount
      )
    );
  }

  const handleSubmit = event => {
    event.preventDefault();
    let updatedTransactions = [...transactions];
    let convertedAmount = type === "income" ? Math.abs(amount) : -Math.abs(amount);
    console.log('convertedAmount',convertedAmount)
    const index = updatedTransactions.findIndex(e => e.id === parsed.id);
    updatedTransactions[index] = {
      date: date,
      description: description,
      category: category,
      amount: convertedAmount,
      id: parsed.id
    };

    let newBalance = balance;
    newBalance += convertedAmount - initialBalance;

    // net income {month: value, netIncome: value}
    let convertedNetIncome = [...netIncome] || [];
    let year = date.substring(0,4)
    let month = date.substring(5,7)
    let convertedMonth = `${year}-${month}` 

    const netIncomeIndex = convertedNetIncome.findIndex(e => e.month === convertedMonth);
    if (netIncomeIndex === -1) {
      convertedNetIncome.push({
        month: convertedMonth,
        netIncome: Number(convertedAmount)
      });
    } else {
      convertedNetIncome[netIncomeIndex].netIncome = Number(convertedAmount) - convertedNetIncome[netIncomeIndex].netIncome;
    }

    axioswal
      .patch("/api/user/transactions", {
        transactions: updatedTransactions,
        balance: newBalance,
        netIncome:convertedNetIncome
      })
      .then(() => {
        dispatch({ type: "fetch" });
        redirectTo(`/management`);
      });
  };

  return (
    <>
      <style jsx>
        {`
          label {
            display: block;
          }
        `}
      </style>
      <section>
        <h2>Update transaction</h2>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6} md={4}>
              <label htmlFor="type">Type</label>
              <select value={type} onChange={e => setType(e.target.value)}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>

              </select>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <label htmlFor="amount">Amount</label>
              <NumberFormat
                id="amount"
                allowNegative={false}
                value={amount}
                thousandSeparator={true}
                prefix={"$"}
                onValueChange={values => {
                  const { value } = values;
                  setAmount(Number(value));
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <label htmlFor="description">Description</label>
              <input
                id="description"
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <label htmlFor="category">Category</label>
              <input
                id="category"
                type="text"
                value={category}
                onChange={e => setCategory(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <button type="submit">Save</button>
            </Grid>
          </Grid>
        </form>
      </section>
    </>
  );
};
const TransactionPage = () => {
  const {
    state: { isLoggedIn, user },
    dispatch
  } = useContext(UserContext);

  if (!isLoggedIn)
    return (
      <Layout>
        <p>Please log in</p>
      </Layout>
    );
  return (
    <Layout>
      <TransactionSection user={user} dispatch={dispatch} />
    </Layout>
  );
};
export default TransactionPage;
