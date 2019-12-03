import React, { useContext, useState } from 'react';
import axioswal from 'axioswal';
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';
import { UserContext } from '../../components/UserContext';
import Layout from '../../components/layout';

const TransactionSection = ({ user: { name: initialName, balance: initialBalance, transactions: initialTransactions }, dispatch }) => {
  const [name, setName] = useState(initialName);
  const [balance, setBalance] = useState(initialBalance || 0);
  const [transactions, setTransactions] = useState(initialTransactions)

  const handleSubmit = (event) => {
    event.preventDefault();
    axioswal
      .patch(
        '/api/user',
        { name, balance, transactions },
      )
      .then(() => {
        dispatch({ type: 'fetch' });
      });
  };

  function NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;
  
    return (
      <NumberFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={values => 
          setBalance(values.value)
        //   {
        //   onChange({
        //     target: {
        //       value: values.value,
        //     },
        //   });
        // }
      }
        thousandSeparator
        isNumericString
        prefix="$"
      />
    );
  }
  


  return (
    <>
      <style jsx>
        {`
        label {
          display: block
        }
      `}
      </style>
      <section>
        <h2>Total balance</h2>
      <h2>${balance}</h2>
        {/* <h2>Update balance</h2> */}
        <form onSubmit={handleSubmit}>
          {/* <label htmlFor="balance">
            Update Balance
            <input
              required
              id="balance"
              type="number"
              placeholder="100"
              value={balance}
              min='0'
              onChange={e => setBalance(e.target.value)}
            />
          </label> */}
          <TextField
        label="Current Balance"
        value={balance}
        // onChange={e => setBalance(e.target.value)}
        // onChange={setBalance}
        id="formatted-numberformat-input"
        InputProps={{
          inputComponent: NumberFormatCustom,
        }}
      />

          <button type="submit">
            Save
          </button>
        </form>

      </section>
    </>
  );
};
const SettingPage = () => {
  const { state: { isLoggedIn, user }, dispatch } = useContext(UserContext);
  if (!isLoggedIn) return (<Layout><p>Please log in</p></Layout>);
  return (
    <Layout>
      {/* <h1>Settings</h1> */}
      <TransactionSection user={user} dispatch={dispatch} />
    </Layout>
  );
};
export default SettingPage;