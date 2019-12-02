import React, { useContext, useState } from 'react';
import axioswal from 'axioswal';
import { UserContext } from '../../components/UserContext';
import Layout from '../../components/layout';

const TransactionSection = ({ user: { name: initialName, balance: initialBalance, transactions: initialTransactions }, dispatch }) => {
  const [name, setName] = useState(initialName);
  const [balance, setBalance] = useState(initialBalance);
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
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">
            Name
            <input
              required
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>

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
      <h1>Settings</h1>
      <TransactionSection user={user} dispatch={dispatch} />
    </Layout>
  );
};
export default SettingPage;