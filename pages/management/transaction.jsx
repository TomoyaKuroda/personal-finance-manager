import React, { useContext, useState } from "react";
import axioswal from "axioswal";
import NumberFormat from "react-number-format";
import TextField from "@material-ui/core/TextField";
import { UserContext } from "../../components/UserContext";
import Layout from "../../components/layout";
import redirectTo from "../../lib/redirectTo";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import EditIcon from "@material-ui/icons/Edit";
import { IconButton, MenuItem } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
const uuidv1 = require("uuid/v1");
const TransactionSection = ({
  user: { transactions: initialTransactions, balance: initialBalance },
  dispatch
}) => {
  function createData(date, description, category, amount) {
    return { date, description, category, amount };
  }

  initialTransactions = initialTransactions ? initialTransactions : [];

  const [transactions, setTransactions] = useState(initialTransactions);
  const [balance, setBalance] = useState(initialBalance);
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");

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
    let newTransactions = [...transactions];
    let convertedAmount = type === "income" ? amount : -Math.abs(amount);
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

    console.log(newTransactions);
    axioswal
      .patch("/api/user/transactions", {
        transactions: newTransactions,
        balance: newBalance
      })
      .then(() => {
        dispatch({ type: "fetch" });
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
        {/* <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Word of the Day
            </Typography>
            <Typography variant="h5" component="h2">
              be nev lent
            </Typography>
            <Typography color="textSecondary">adjective</Typography>
            <Typography variant="body2" component="p">
              well meaning and kindly.
              <br />
              {'"a benevolent smile"'}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>

        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Word of the Day
            </Typography>
            <Typography variant="h5" component="h2">
              be nev lent
            </Typography>
            <Typography color="textSecondary">adjective</Typography>
            <Typography variant="body2" component="p">
              well meaning and kindly.
              <br />
              {'"a benevolent smile"'}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
        <Paper>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Category</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {row.date}
                  </TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell align="right">{row.category}</TableCell>
                  <TableCell align="right">{row.amount}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      style={{ boxShadow: "initial" }}
                      size="small"
                      onClick={() => alert("hehe")}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper> */}

        {/* <h2>${balance}</h2> */}

        <h2>Add new transaction</h2>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6} md={4}>
              <label htmlFor="type">Type</label>
              <select value={type} onChange={e => setType(e.target.value)}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
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
                  const { formattedValue, value } = values;
                  setAmount(Number(value));
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} >
              <label htmlFor="description">Description</label>
              <input
                id="description"
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} >
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
