import React, { useContext, useState } from "react";
import axioswal from "axioswal";
import NumberFormat from "react-number-format";
import { UserContext } from "../../components/UserContext";
import Layout from "../../components/layout";
import Grid from "@material-ui/core/Grid";
import { useRouter } from "next/router";
import redirectTo from "../../lib/redirectTo";
const queryString = require("query-string");
const uuidv1 = require("uuid/v1");

const TransactionSection = ({
  user: {
    transactions: initialTransactions,
    balance: initialBalance,
    netIncome: initialNetIncome
  },
  dispatch
}) => {
  const router = useRouter();
  const parsed = queryString.parse(location.search);
  const [transactions, setTransactions] = useState(initialTransactions || []);
  const [netIncome, setNetIncome] = useState(initialNetIncome || []);

  // Validation for wrong transaction id
  if (
    parsed.id !== undefined &&
    !transactions.filter(transaction => transaction.id === parsed.id)[0]
  ) {
    router.push("/management");
    return <p></p>;
  }

  // queried transaction
  let transaction =
    transactions.filter(transaction => transaction.id === parsed.id)[0] || {};
  const [balance, setBalance] = useState(initialBalance || 0);
  const [date, setDate] = useState(transaction.date || new Date());
  const [description, setDescription] = useState(transaction.description || "");
  const [category, setCategory] = useState(transaction.category || "");
  const [amount, setAmount] = useState(transaction.amount || "");
  let initialType = transaction.amount
    ? transaction.amount > 0
      ? "income"
      : "expense"
    : "expense";
  const [type, setType] = useState(initialType);

  const handleSubmit = event => {
    event.preventDefault();
    let newTransactions = [...transactions];
    let convertedAmount =
      type === "income" ? Math.abs(amount) : -Math.abs(amount);

    let newBalance = Number(balance);
    if (parsed.id !== undefined) {
      const index = newTransactions.findIndex(e => e.id === parsed.id);
      newTransactions[index] = {
        date: date,
        description: description,
        category: category,
        amount: convertedAmount,
        id: parsed.id
      };

      newBalance += convertedAmount - transaction.amount;
    } else {
      newTransactions.push({
        date: date,
        description: description,
        category: category,
        amount: convertedAmount,
        id: uuidv1()
      });
      newBalance += convertedAmount;
    }

    // net income {month: value, netIncome: value}
    let convertedNetIncome = [...netIncome] || [];
    let year = date.substring(0, 4);
    let month = date.substring(5, 7);
    let convertedMonth = `${year}-${month}`;

    const netIncomeIndex = convertedNetIncome.findIndex(
      e => e.month === convertedMonth
    );
    if (netIncomeIndex === -1) {
      convertedNetIncome.push({
        month: convertedMonth,
        netIncome: Number(convertedAmount)
      });
    } else {
      parsed.id !== undefined
        ? (convertedNetIncome[netIncomeIndex].netIncome +=
            Number(convertedAmount) - transaction.amount)
        : (convertedNetIncome[netIncomeIndex].netIncome += Number(
            convertedAmount
          ));
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
    setBalance(newBalance);
    setNetIncome(convertedNetIncome);
    setTransactions(newTransactions);
    setDate(new Date());
    setType("expense");
    setAmount("");
    setCategory("");
    setDescription("");
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
            <Grid item xs={12} sm={6}>
              <label htmlFor="type">Type</label>
              <select value={type} onChange={e => setType(e.target.value)}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <label htmlFor="description">Description</label>
              <input
                id="description"
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <label htmlFor="category">Category</label>
              <input
                id="category"
                type="text"
                value={category}
                onChange={e => setCategory(e.target.value)}
                required
              />
            </Grid> */}

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
