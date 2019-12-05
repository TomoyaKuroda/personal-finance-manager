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
import Grid from '@material-ui/core/Grid';
import EditIcon from '@material-ui/icons/Edit';
import { IconButton } from "@material-ui/core";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
const uuidv1 = require('uuid/v1');
const TransactionSection = ({
  user: { transactions: initialTransactions },
  dispatch
}) => {
    function createData(date, description, category, amount) {
        return { date, description, category, amount };
      }

    //   const rows = [
    //     createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    //     createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    //     createData('Eclair', 262, 16.0, 24, 6.0),
    //     createData('Cupcake', 305, 3.7, 67, 4.3),
    //     createData('Gingerbread', 356, 16.0, 49, 3.9),
    //   ];



      initialTransactions = initialTransactions ? initialTransactions : []

  const [transactions, setTransactions] = useState(initialTransactions);
  const [date, setDate] = useState(new Date())
  const [description, setDescription] = useState('')
  const [category,setCategory] = useState('')
  const [amount,setAmount] = useState('')

      let rows=[]
  for (let transaction of transactions) {
    rows.push(createData(transaction.date, transaction.description, transaction.category, transaction.amount))
  } 

  console.log(initialTransactions)

  const handleSubmit = event => {
    event.preventDefault();
      let newTransactions = [...transactions]
      newTransactions.push({date:date,description:description,category:category,amount:amount, id:uuidv1()})
        // console.log(newTransactions)
    //   setTransactions([...transactions, {date,description,category,amount}])
      console.log(newTransactions)
    axioswal.patch("/api/user/transactions", { transactions: newTransactions }).then(() => {
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
      <h2>Transactions</h2>
      <Card>
      <CardContent>
        <Typography  color="textSecondary" gutterBottom>
          Word of the Day
        </Typography>
        <Typography variant="h5" component="h2">
          be
          nev
          lent
        </Typography>
        <Typography color="textSecondary">
          adjective
        </Typography>
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
        <Typography  color="textSecondary" gutterBottom>
          Word of the Day
        </Typography>
        <Typography variant="h5" component="h2">
          be
          nev
          lent
        </Typography>
        <Typography color="textSecondary">
          adjective
        </Typography>
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
      <Paper >
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell >Description</TableCell>
            <TableCell align="right">Category</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row,index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {row.date}
              </TableCell>
              <TableCell >{row.description}</TableCell>
              <TableCell align="right">{row.category}</TableCell>
              <TableCell align="right">{row.amount}</TableCell>
              <TableCell align="right">
                  <IconButton style={{boxShadow:'initial'}} size="small" onClick={()=>alert('hehe')}><EditIcon/></IconButton>
                  </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>


        {/* <h2>${balance}</h2> */}

        <h2>Add new transaction</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="date">Date</label>
          <input id='date' type='date' value={date} onChange={e=>setDate(e.target.value)}/>
          <label htmlFor="description">Description</label>
          <input id='description' type='text' value={description} onChange={e=>setDescription(e.target.value)}/>
          <label htmlFor="category">Category</label>
          <input id='category' type='text' value={category} onChange={e=>setCategory(e.target.value)}/>
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

          <button type="submit">Save</button>
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
