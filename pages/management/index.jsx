import React, { useContext } from 'react';
import Link from 'next/link';
import axioswal from 'axioswal';
import { UserContext } from '../../components/UserContext';
import Layout from '../../components/layout';
import NumberFormat from "react-number-format";
import Grid from '@material-ui/core/Grid';
const ProfilePage = () => {
  const {
    state: {
      isLoggedIn, user: {
        name, email, bio, profilePicture, balance,
      },
    },
  } = useContext(UserContext);



  if (!isLoggedIn) return (<Layout><p>Please log in</p></Layout>);
  return (
    <Layout>
      <style jsx>
        {`
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
          a {
          }
          {/* .wrapper {
            display: grid;
            grid-template-columns: 3fr 1fr;
            grid-gap:1em;
            justify-items:start;
          } */}
        `}
      </style>
      <Grid container >
      <Grid  item xs={12} sm={6}>
      <h1>Current Balance</h1>
        <h2>
        <NumberFormat value={balance} displayType={'text'} thousandSeparator={true} prefix={'$'} />

        </h2>
        <Link href="/management/balance"><button type="button">Update Balance</button></Link>
      </Grid>
      <Grid item xs={12} sm={6}>
        <h1>Recent Transactions</h1>
        <Link href="/management/transaction"><button type="button">Update Transaction</button></Link>
     </Grid>

      </Grid>
    </Layout>
  );
};

export default ProfilePage;