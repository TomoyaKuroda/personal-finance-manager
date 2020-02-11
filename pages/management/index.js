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
import { Typography, Button } from "@material-ui/core";
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
  },
  monthlyButton: {
    backgroundColor: "white",
    height: "1.5rem"
  }
}));
const ManagementSection = ({
  user: {
    transactions: initialTransactions,
    balance: initialBalance,
    netIncome: initialNetIncome
  },
  dispatch
}) => {
  const classes = useStyles();
  const [transactions, setTransactions] = useState(initialTransactions || []);
  const [balance, setBalance] = useState(initialBalance || 0);
  const [netIncome, setNetIncome] = useState(initialNetIncome || []);

  // Transaction Button
  const [transactionAnchorEl, setTransactionAnchorEl] = React.useState(null);
  const handleTransactionClick = event => {
    setTransactionAnchorEl(event.currentTarget);
  };
  const handleTransactionClose = () => {
    setTransactionAnchorEl(null);
  };

  //Month Transaction
  let thisMonth = new Date();
  function pad(number) {
    if (number < 10) {
      return "0" + number;
    }
    return number;
  }
  const [month, setMonth] = useState(
    `${thisMonth.getFullYear()}-${pad(thisMonth.getMonth() + 1)}`
  );

  // net income
  let netIncomeThisMonth = [...netIncome];
  let filteredNetIncome = 0;
  if (
    Array.isArray(netIncomeThisMonth) &&
    netIncomeThisMonth.length &&
    netIncomeThisMonth.filter(item => item.month === month)[0] !== undefined
  ) {
    filteredNetIncome = netIncomeThisMonth.filter(
      item => item.month === month
    )[0].netIncome;
  }

  let monthlyTransactions = [...transactions];
  if (transactions.length) {
    monthlyTransactions = transactions.filter(
      item => item.date.substring(0, 7) === month
    );
  }

  //Update Month
  const updateMonth = event => {
    handleTransactionClose();
    setMonth(event.target.textContent);
  };
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

      let newNetIncome = [...netIncome];
      let year = transaction.date.substring(0, 4);
      let month = transaction.date.substring(5, 7);
      let convertedMonth = `${year}-${month}`;

      const index = newNetIncome.findIndex(e => e.month == convertedMonth);
      newNetIncome[index].netIncome =
        newNetIncome[index].netIncome - transaction.amount;

      axioswal
        .patch("/api/user/transactions", {
          transactions: filteredAry,
          balance: newBalance,
          netIncome: newNetIncome
        })
        .then(() => {
          dispatch({ type: "fetch" });
        });
      setAnchorEl(null);
    };

    const editTransaction = transaction => {
      redirectTo(`/management/transaction?id=${transaction.id}`);
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
            secondary={transaction.date}
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
  if (monthlyTransactions)
    for (let transaction of monthlyTransactions) {
      let amount = Number(transaction.amount);
      if (amount > 0) income += amount;
      else expense += Math.abs(amount);
    }
  let series = [income, expense];

  return (
    <>
      <Grid
        justify="space-between" // Add it here :)
        container
        spacing={24}
      >
        <Grid item>
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
        </Grid>
        <Grid item>
          <span>
            <Button
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleTransactionClick}
              className={classes.monthlyButton}
            >
              {month}
            </Button>
          </span>
        </Grid>
      </Grid>

      <Menu
        id="simple-menu"
        anchorEl={transactionAnchorEl}
        keepMounted
        open={Boolean(transactionAnchorEl)}
        onClose={handleTransactionClose}
        PaperProps={{
          style: {
            maxHeight: 200,
            width: 200
          }
        }}
      >
        {netIncome.length ? (
          netIncome
            .sort((a, b) => a - b)
            .map(value => {
              return (
                <MenuItem onClick={updateMonth} value={value.month}>
                  {value.month}
                </MenuItem>
              );
            })
        ) : (
          <MenuItem onClick={updateMonth} value={month}>
            {month}
          </MenuItem>
        )}
      </Menu>

      <Grid container>
        <Grid item xs={12} sm={6}>
          <h2>Monthly net income</h2>
          <h3>
            <NumberFormat
              value={filteredNetIncome}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"$"}
            />
          </h3>

          {series[0] || series[1] ? (
            <>
              <h2>Income</h2>
              <h3>
                <NumberFormat
                  value={series[0]}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />
              </h3>
              <h2>Expense</h2>
              <h3>
                <NumberFormat
                  value={series[1]}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />
              </h3>
            </>
          ) : null}
        </Grid>
        <Grid item xs={12} sm={6}>
          <h2>Income and Expense Chart</h2>
          <Grid container justify="center">
            {series[0] || series[1] ? (
              <Chart options={options} series={series} type="pie" width="380" />
            ) : (
              <p>There is no transaction this month.</p>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12}>
          <h2>Monthly transactions </h2>

          {monthlyTransactions.length ? (
            <List className={classes.root}>
              {monthlyTransactions.map(transaction => (
                <MenuButton transaction={transaction} key={transaction.id} />
              ))}
            </List>
          ) : (
            <p>There is no transaction this month</p>
          )}

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
