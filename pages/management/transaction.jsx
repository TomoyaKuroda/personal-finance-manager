import React, { useContext, useState } from "react";
import axioswal from "axioswal";
import NumberFormat from "react-number-format";
import { UserContext } from "../../components/UserContext";
import Layout from "../../components/layout";
import Grid from "@material-ui/core/Grid";
const uuidv1 = require("uuid/v1");
const TransactionSection = ({
  user: {
    transactions: initialTransactions,
    balance: initialBalance,
    netIncome: initialNetIncome
  },
  dispatch
}) => {


  // initialTransactions = initialTransactions ? initialTransactions : [];

  const [transactions, setTransactions] = useState(initialTransactions || []);
  const [balance, setBalance] = useState(initialBalance);
  const [netIncome, setNetIncome] = useState(initialNetIncome || []);
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");

  const handleSubmit = event => {
    event.preventDefault();
    let newTransactions = [...transactions];
    let convertedAmount =
      type === "income" ? Math.abs(amount) : -Math.abs(amount);
    console.log("convertedAmount", convertedAmount);
    newTransactions.push({
      date: date,
      description: description,
      category: category,
      amount: convertedAmount,
      id: uuidv1()
    });

    let newBalance = balance;
    newBalance += convertedAmount;

    // net income {month: value, netIncome: value}
    let convertedNetIncome = [...netIncome] || [];
    let year = date.substring(0,4)
    let month = date.substring(5,7)
    let convertedMonth = `${year}-${month}` 
    const index = convertedNetIncome.findIndex(e => e.month == convertedMonth);
    if (index === -1) {
      convertedNetIncome.push({
        month: convertedMonth,
        netIncome: Number(convertedAmount)
      });
    } else {
      convertedNetIncome[index].netIncome += Number(convertedAmount);
    }


    axioswal
      .patch("/api/user/transactions", {
        transactions: newTransactions,
        balance: newBalance,
        netIncome: convertedNetIncome
      })
      .then(() => {
        dispatch({ type: "fetch" });
      });

      console.log('newTransactions',newTransactions)
      setTransactions(newTransactions)
      setBalance(newBalance)
      setNetIncome(convertedNetIncome)
      setDate(new Date())
      setType('expense')
      setAmount('')
      setCategory('')
      setDescription('')

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
        <h2>Add new transaction</h2>

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
              required
                id="date"
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <label htmlFor="amount">Amount</label>
              <NumberFormat
              required
                id="amount"
                allowNegative={false}
                value={amount}
                thousandSeparator={true}
                prefix={"$"}
                onValueChange={values => {
                  const { formattedValue, value } = values;
                  setAmount(Number(value));
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <label htmlFor="description">Description</label>
              <input
              required
                id="description"
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <label htmlFor="category">Category</label>
              <input
              required
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
