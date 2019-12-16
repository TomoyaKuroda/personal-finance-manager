import React, { useEffect, useState, useContext } from "react";
import Link from "next/link";
import Head from "../components/head";
import Nav from "../components/nav";
import { UserContext } from "../components/UserContext";
import Layout from "../components/layout";

const Home = () => {
  const [date, setDate] = useState(null);
  const {
    state: {
      isLoggedIn,
      user: { name }
    }
  } = useContext(UserContext);
  useEffect(() => {
    async function getDate() {
      const res = await fetch("/api/date");
      const newDate = await res.json();
      setDate(newDate);
    }
    getDate();
  }, []);

  return (
    <Layout title="Home">
      <div id="home-container">
        <div id="inner">
          {/* <img src="../static/pfm1.png" alt="PFM logo" id="logo" height='200'/> */}
          <h1 className="text-align-left">Personal Finance Manager</h1>
          <p className="subtitle text-align-left">
            Personal Finance Manager helps you manage your finance
          </p>
          <p className="text-align-left">
            <a href="/signup" className="cta text-align-left">
              Sign up
            </a>
          </p>
        </div>

        <div id="illustration">
          {/* <img src="assets/dash.svg" alt="dash img" id="dash" className="crypto-icons"/>
            <img src="assets/miota.svg" alt="iota img" id="iota" className="crypto-icons"/>
            <img src="assets/eth.svg" alt="eth img" id="eth" className="crypto-icons"/> */}
          <img
            src="../static/mockup.png"
            alt="monitor img"
            id="monitor"
            className="monitor"
          />
        </div>
        {/* <div className="hero">
        <h1 className="title">Personal Finance Manager</h1>
        <p className="description">
          We are here to help you manage your finance.
        </p>

        <img src="../static/sample.png" alt="Sample" className="center"/> 

        {/* <div className='row'>
          <Link href='https://github.com/zeit/next.js#setup'>
            <a className='card'>
              <h3>Getting Started &rarr;</h3>
              <p>Learn more about Next.js on GitHub and in their examples.</p>
            </a>
          </Link>
          <Link href='https://github.com/zeit/next.js/tree/master/examples'>
            <a className='card'>
              <h3>Examples &rarr;</h3>
              <p>Find other example boilerplates on the Next.js GitHub.</p>
            </a>
          </Link>
          <Link href='https://github.com/zeit/next.js'>
            <a className='card'>
              <h3>Create Next App &rarr;</h3>
              <p>Was this tool helpful? Let us know how we can improve it!</p>
            </a>
          </Link>
        </div> */}
      </div>

      <style jsx>{`
        body:{
          height: 100%;
        }
        .monitor{
          width: 100%;
          max-width:400px;
          height:auto;
        }
        .text-align-left{
          text-align: left !important;
        }
        .hero {
          color: #333;
        }
        .title {
          margin: 0;
          width: 100%;
          padding-top: 80px;
          line-height: 1.15;
          font-size: 2rem;
          color:#333
        }
        .title,
        .description {
          text-align: center;
        }
        .description{
          color:#333;
          font-size:0.8rem;
        }
        .row {
          max-width: 880px;
          margin: 80px auto 40px;
          display: flex;
          flex-direction: row;
          justify-content: space-around;
        }
        .date {
          height: 24px;
          max-width: calc(100% - 32px)
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 16px;
        }
        .date p {
          text-align: center;
        }
        .date span {
          width: 176px;
          text-align: center;
        }
        @keyframes Loading {
          0%{background-position:0% 50%}
          50%{background-position:100% 50%}
          100%{background-position:0% 50%}
        }
        .date .loading {
          max-width: 100%;
          height: 24px;
          border-radius: 4px;
          display: inline-block;
          background: linear-gradient(270deg, #D1D1D1, #EAEAEA);
          background-size: 200% 200%;
          animation: Loading 2s ease infinite;
        }
        .card {
          padding: 18px 18px 24px;
          width: 220px;
          text-align: left;
          text-decoration: none;
          color: #434343;
          border: 1px solid #9b9b9b;
        }
        .card:hover {
          border-color: #067df7;
        }
        .card h3 {
          margin: 0;
          color: #067df7;
          font-size: 18px;
        }
        .card p {
          margin: 0;
          padding: 12px 0 0;
          font-size: 13px;
          color: #333;
        }
        
        p {
          color: #888;
          font-size: 0.8rem;
        }

        .center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 100%;
}

#home-container {
    display: grid;
    grid-template-columns: 10px 1fr 10px; /* for left and right sections */
    grid-template-rows: 10px 1fr 1fr 10px;
    grid-gap: 20px;
    height: 70vh;
}

#inner {
    grid-row: 2;
    grid-column: 2;
    align-self: center;
    justify-self: center;
}

#illustration {
    grid-row: 3;
    grid-column: 2;
    align-self: center;
    justify-self: center;
    width: 100%;
    padding: 10px;
}

@media (min-width: 768px) {
    #home-container {
        grid-template-columns: 0fr 1.6fr 1fr 0fr;
        grid-template-rows: 1fr;
    }
    #inner {
        grid-column: 2;
        grid-row: 1;
    }

    #illustration {
        grid-column: 3;
        grid-row: 1;
    }
}

img#logo{
    width: 130px;
    margin-bottom: 1.6em;
}

h1{
    text-transform: uppercase;
    color: #535353;
    margin-bottom: .2em;
}

p.subtitle{
    font-size: 1.4em;
    color: #858585;
    margin-top: 0;
}

.cta{
    background-color: #09BBE9;
    padding: 1em;
    color: #fff;
    font-weight: bold;
    margin-top: 2em;
    display: inline-block;
    border-radius: 5px;
    text-decoration: none;
    /* TODO: add glowing type animation while on hover */
}

#monitor{
    animation: monitorIn 1s ease-in-out forwards; /* assign animation to monitor with 'monitorIn' as keyframe name */
    opacity: 0;
}

.crypto-icons{
    position: absolute;
    width: 12%;
}

#dash{
    margin-top: -4%;
    margin-left: 9%;
    animation: chatblips .5s ease-in-out 2.7s forwards; /* assign animation to dash with 'chatblips' as keyframe name */
    opacity: 0;
    z-index: 2;
}

#eth{
    margin-top: 9.5%;
    margin-left: 18%;
    animation: chatblips .5s ease-in-out 1.9s forwards; /* assign animation to eth with 'chatblips' as keyframe name */
    opacity: 0;
    z-index: 2;
}

#iota{
    margin-top: 5%;
    margin-left: -1.5%;
    animation: chatblips .5s ease-in-out .8s forwards; /* assign animation to iota with 'chatblips' as keyframe name */
    opacity: 0;
    z-index: 2;
}



@keyframes monitorIn{
    from{
        transform: translateY(-30px);
        opacity: 0;
    }
    to{
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes chatblips{
    /* taken from http://angrytools.com/css/animation/ for bounce-in animation*/
    0%{
        opacity: 0;
        transform: scale(.3);
      }
      50%{
        opacity: 1;
        transform: scale(1.0);
      }
      70%{
        transform: scale(0.9);
      }
      100%{
        transform: scale(1);
        opacity: 1;
      }
}

      `}</style>
    </Layout>
  );
};

export default Home;
