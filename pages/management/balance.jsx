import React, { useContext, useState } from "react";
import axioswal from "axioswal";
import NumberFormat from "react-number-format";
import TextField from "@material-ui/core/TextField";
import { UserContext } from "../../components/UserContext";
import Layout from "../../components/layout";
import redirectTo from "../../lib/redirectTo";

const BalanceSection = ({
  user: {
    name: initialName,
    balance: initialBalance,
    // transactions: initialTransactions
  },
  dispatch
}) => {
  const [name, setName] = useState(initialName);
  const [balance, setBalance] = useState(initialBalance);
  // const [transactions, setTransactions] = useState(initialTransactions);

  const handleSubmit = event => {
    event.preventDefault();
    axioswal.patch("/api/user/balance", {  balance }).then(() => {
      dispatch({ type: "fetch" });
      redirectTo('/management');
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
        <h2>Total balance</h2>
        {/* <h2>${balance}</h2> */}
        <h2>
        <NumberFormat value={balance} displayType={'text'} thousandSeparator={true} prefix={'$'} />
        </h2>
        <h2>Update balance</h2>
        <form onSubmit={handleSubmit}>
          {/* <label htmlFor="balance">Update Balance</label> */}

          <NumberFormat
            id='balance'
            allowNegative={false}
            value={balance}
            thousandSeparator={true}
            prefix={"$"}
            onValueChange={values => {
              const { formattedValue, value } = values;
              setBalance(Number(value));
            }}
          />

          <button type="submit">Save</button>
        </form>
      </section>
    </>
  );
};
const BalancePage = () => {
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
      {/* <h1>Settings</h1> */}
      <BalanceSection user={user} dispatch={dispatch} />
    </Layout>
  );
};
export default BalancePage;
