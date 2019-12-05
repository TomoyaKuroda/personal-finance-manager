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
  }
}));
const ManagementSection = ({
  user: { transactions: initialTransactions, balance: initialBalance },
  dispatch
}) => {
  const classes = useStyles();
  const [transactions, setTransactions] = useState(initialTransactions);
  const [balance, setBalance] = useState(initialBalance);

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
      axioswal
        .patch("/api/user/transactions", { transactions: filteredAry })
        .then(() => {
          dispatch({ type: "fetch" });
        });
      setAnchorEl(null);
      setTransactions(filteredAry);
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
          <MenuItem onClick={() => {}}>Edit</MenuItem>
          <MenuItem onClick={() => deleteTransaction(transaction)}>
            Delete
          </MenuItem>
        </Menu>
      </Fragment>
    );
  };

  let options = {
    colors:["#00ad9f", "#ff6f00"],
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
  for (let transaction of transactions) {
    console.log("amount", transaction.amount);
    let amount = Number(transaction.amount);
    if (amount > 0) income += amount;
    else expense += Math.abs(amount);
  }
  let series = [income, expense];

  return (
    <Grid container>
      <Grid item xs={12} sm={6}>
        <h2>Current Balance</h2>
        <h3>
          <NumberFormat
            value={balance}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"$"}
          />
        </h3>
        <Link href="/management/balance">
          <button type="button">Update Balance</button>
        </Link>
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
      `}</style>
    </Grid>
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
    <Layout>
      <ManagementSection user={user} dispatch={dispatch} />
    </Layout>
  );
};

export default ManagementPage;
