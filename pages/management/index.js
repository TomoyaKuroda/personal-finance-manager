import React, { useContext,useState, Fragment } from 'react';
import Link from 'next/link';
import axioswal from 'axioswal';
import { UserContext } from '../../components/UserContext';
import Layout from '../../components/layout';
import NumberFormat from "react-number-format";
import Grid from '@material-ui/core/Grid';
import loadable from 'loadable-components';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

const Chart = loadable(() => import('react-apexcharts'));
const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: '60em',
    backgroundColor: theme.palette.background.paper,
    // position: 'relative',
    overflow: 'auto',
    maxHeight: '25em',
  },
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
}));
const ManagementPage = () => {
  const classes = useStyles();




const MenuButton = ({transaction}) =>{
  // Menu
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = event => {
     setAnchorEl(event.currentTarget);
  };
  const handleClose = () =>{
    setAnchorEl(null);
  }
  const deleteTransaction = (transaction) => {
    let currentTransactions =[...transactions]
    let filteredAry = currentTransactions.filter(e => e !== transaction)
    axioswal.patch("/api/user/transactions", {  transactions: filteredAry }).then(() => {
      dispatch({ type: "fetch" });     
    });
    setAnchorEl(null);
  };
  return  (
    <Fragment key={transaction.id}>
    <ListItem  button onClick={handleClick}>
      <ListItemText primary={
<>
<Typography>{transaction.description}</Typography>
<Typography variant="h6" style={{ color: '#ff6f00' }}>${transaction.amount}</Typography>
</>
}          
secondary={transaction.category+ ' / ' + transaction.date} />
    </ListItem>
  <Menu
  elevation={2}
  id="simple-menu"
  anchorEl={anchorEl}
  keepMounted
  open={Boolean(anchorEl)}
  onClose={handleClose}
>
  <MenuItem onClick={()=>{}}>Edit</MenuItem>
<MenuItem onClick={()=>deleteTransaction(transaction)}>Delete</MenuItem>
</Menu>
</Fragment>
  )
}


  const {
    state: {
      isLoggedIn, user: {
        name, email, bio, profilePicture, balance, transactions
      }
    },
    dispatch
  } = useContext(UserContext);

  let options = {
    labels: ['Income', 'Expense'],
    legend: {
      position:'bottom',
      horizontalAlign: 'center',
      verticalAlign: 'middle'
      },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom',
          horizontalAlign: 'center',
          verticalAlign: 'middle'
        }
      }
    }]
  }

  let series =  [44, 55]





  if (!isLoggedIn) return (<Layout><p>Please log in</p></Layout>);
  return (
    <Layout>
      <Grid container >
      <Grid  item xs={12} sm={6}>
      <h2>Current Balance</h2>
        <h3>
        <NumberFormat value={balance} displayType={'text'} thousandSeparator={true} prefix={'$'} />
        </h3>
        <Link href="/management/balance"><button type="button">Update Balance</button></Link>
        <h2>Income and Expense Chart</h2>
        <Grid container justify = "center">
        <Chart options={options} series={series} type="pie" width="380"  />
        </Grid>
      </Grid>
      <Grid item xs={12} sm={6}>
        <h2>This month's transactions</h2>
        <List className={classes.root}>
          {transactions.map((transaction) => 
          {
            // // const [anchorEl, setAnchorEl] = useState(null);
            // let open;
            // const handleClick = event => {
            //   //  setAnchorEl(event.currentTarget);
            //   open=true
            // };
            // const handleClose = () =>{
            //   // setAnchorEl(null);
            //   open=false
            // }
            // const deleteTransaction = (index) => {
            //   let newTransactions =[...transactions]
            //   newTransactions.splice(index,1)
            //   axioswal.patch("/api/user/transactions", {  transactions: newTransactions }).then(() => {
            //     dispatch({ type: "fetch" });     
            //   });
            //   // setAnchorEl(null);
            //   open=false
            // };
            return (
            
        //     <Fragment key={transaction.id}>
        //       <ListItem  button onClick={handleClick}>
        //         <ListItemText primary={
        //   <>
        // <Typography>{transaction.description}</Typography>
        // <Typography variant="h6" style={{ color: '#ff6f00' }}>${transaction.amount}</Typography>
        //   </>
        // }          
        //   secondary={transaction.category+ ' / ' + transaction.date} />
        //       </ListItem>

<MenuButton transaction={transaction} key={transaction.id} /> 

                
      )
}
      )
      }
      </List>
        <Link href="/management/transaction"><button type="button">Add Transaction</button></Link>
     </Grid>

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
            margin: .5rem 0;
          }
          .transactions {
            background-color: white;
            border-radius: 4px;
          }
        `}</style>
    </Layout>
  );
};

export default ManagementPage;