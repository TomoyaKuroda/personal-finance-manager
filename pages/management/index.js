import React, { useContext, useState, Fragment } from "react";
import Link from "next/link";
import axioswal from "axioswal";
import { UserContext } from "../../components/UserContext";
import Layout from "../../components/layout";
import NumberFormat from "react-number-format";
import Grid from "@material-ui/core/Grid";
import loadable from "loadable-components";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Typography } from "@material-ui/core";
import List from "@material-ui/core/List";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import redirectTo from "../../lib/redirectTo";

const Chart = loadable(() => import("react-apexcharts"));
const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: "60em",
    backgroundColor: theme.palette.background.paper,
    // position: 'relative',
    overflow: "auto",
    maxHeight: "25em"
  },
  listSection: {
    backgroundColor: "inherit"
  },
  ul: {
    backgroundColor: "inherit",
    padding: 0
  },
  p: {
    float: "left",
    margin: 0,
    fontSize: "0.8em"
  }
}));
const ManagementSection = ({
  user: { transactions: initialTransactions, balance: initialBalance, netIncome:initialNetIncome },
  dispatch
}) => {
  const classes = useStyles();
  const [transactions, setTransactions] = useState(initialTransactions||[]);
  const [balance, setBalance] = useState(initialBalance||0);
  const [netIncome,setNetIncome] = useState(initialNetIncome || [])

  let netIncomeThisMonth = [...netIncome]
  let today = new Date()
  let firstDay = new Date(today.getFullYear(),today.getMonth(),1).toISOString().substring(0,7)
  let filteredNetIncome = 0
  if(Array.isArray(netIncomeThisMonth) && netIncomeThisMonth.length && netIncomeThisMonth.filter(item=>item.month===firstDay)[0] !==undefined){
  filteredNetIncome = netIncomeThisMonth.filter(item=>item.month===firstDay)[0].netIncome
  }
  //Menu
  const MenuButton = ({ transaction }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = event => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    const deleteTransaction = transaction => {
      let currentTransactions = [...transactions];
      let filteredAry = currentTransactions.filter(e => e !== transaction);
      setTransactions(prevTransactions => {
        return prevTransactions.filter(item => item !== transaction);
      });

      let newBalance = balance;
      newBalance -= transaction.amount;
      setBalance(prevBalance => {
        return prevBalance - transaction.amount;
      });

      let newNetIncome = [...netIncome]
      let year = transaction.date.substring(0,4)
      let month = transaction.date.substring(5,7)
      let convertedMonth = `${year}-${month}`

      const index = newNetIncome.findIndex(e => e.month == convertedMonth);
      newNetIncome[index].netIncome = newNetIncome[index].netIncome - transaction.amount;
      

      axioswal
        .patch("/api/user/transactions", {
          transactions: filteredAry,
          balance: newBalance,
          netIncome:newNetIncome
        })
        .then(() => {
          dispatch({ type: "fetch" });
        });
      setAnchorEl(null);
    };

    const editTransaction = transaction => {
      redirectTo(`/management/editTransaction?id=${transaction.id}`);
    };
    return (
      <Fragment key={transaction.id}>
        <ListItem button onClick={handleClick}>
          <ListItemText
            primary={
              <>
                <Typography>{transaction.description}</Typography>
                <Typography
                  variant="h6"
                  style={{
                    color: transaction.amount > 0 ? "#00ad9f" : "#ff6f00"
                  }}
                >
                  <NumberFormat
                    value={transaction.amount}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"$"}
                  />
                </Typography>
              </>
            }
            secondary={transaction.category + " / " + transaction.date}
          />
        </ListItem>
        <Menu
          elevation={2}
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem
            onClick={() => {
              editTransaction(transaction);
            }}
          >
            Edit
          </MenuItem>
          <MenuItem onClick={() => deleteTransaction(transaction)}>
            Delete
          </MenuItem>
        </Menu>
      </Fragment>
    );
  };

  let options = {
    colors: ["#00ad9f", "#ff6f00"],
    labels: ["Income", "Expense"],
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      verticalAlign: "middle"
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: "bottom",
            horizontalAlign: "center",
            verticalAlign: "middle"
          }
        }
      }
    ]
  };

  let income = 0,
    expense = 0;
  if (transactions)
    for (let transaction of transactions) {
      let amount = Number(transaction.amount);
      if (amount > 0) income += amount;
      else expense += Math.abs(amount);
    }
  let series = [income, expense];

  return (
    <>
      <p className={classes.p}>
        Total balance:{" "}
        <NumberFormat
          value={balance}
          displayType={"text"}
          thousandSeparator={true}
          prefix={"$"}
        />{" "}
        <Link href="/management/balance">Update Balance</Link>
      </p>
      <Grid container>
        <Grid item xs={12} sm={6}>
          <h2>This month's net income</h2>
          <h3>
            <NumberFormat
              value={filteredNetIncome}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"$"}
            />
          </h3>
          <h2>Income and Expense Chart</h2>
          <Grid container justify="center">
            <Chart options={options} series={series} type="pie" width="380" />
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <h2>This month's transactions</h2>
          <List className={classes.root}>
            {transactions.map(transaction => (
              <MenuButton transaction={transaction} key={transaction.id} />
            ))}
          </List>
          <Link href="/management/transaction">
            <button type="button">Add Transaction</button>
          </Link>
        </Grid>
        <style jsx>{`
          img {
            max-width: 100vh;
            border-radius: 50%;
            box-shadow: rgba(0, 0, 0, 0.05) 0 10px 20px 1px;
          }
          div {
            color: #777;
            margin-bottom: 1.5rem;
          }
          h2 {
            text-align: center;
            color: #333;
          }
          p {
            color: #444;
            margin: 0.5rem 0;
          }
          .transactions {
            background-color: white;
            border-radius: 4px;
          }
          span {
            text-align: left;
          }
        `}</style>
      </Grid>
    </>
  );
};

const ManagementPage = () => {
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
    <Layout title="Management">
      <ManagementSection user={user} dispatch={dispatch} />
    </Layout>
  );
};

export default ManagementPage;
