import { Card, Menu } from "antd";
import "antd/dist/antd.css";
import {
  useContractLoader,
  useUserProviderAndSigner,
} from "eth-hooks";
import React, { useCallback, useEffect, useState } from "react";
import { Link, Route, Switch, useLocation } from "react-router-dom";
import "./App.css";
import {
  Account,
  Contract,
  Header,
  ThemeSwitch,
  NetworkDisplay,
} from "./components";
import { NETWORKS } from "./constants";
import externalContracts from "./contracts/external_contracts";
// contracts
import deployedContracts from "./contracts/hardhat_contracts.json";
import { Web3ModalSetup } from "./helpers";
import { useStaticJsonRPC } from "./hooks";

const { ethers } = require("ethers");
/*
    Welcome to 🏗 scaffold-eth !

    Code:
    https://github.com/scaffold-eth/scaffold-eth

    Support:
    https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA
    or DM @austingriffith on twitter or telegram

    🌏 EXTERNAL CONTRACTS:
    You can also bring in contract artifacts in `constants.js`
    (and then use the `useExternalContractLoader()` hook!)
*/

/// 📡 What chain are your contracts deployed to?
const initialNetwork = NETWORKS.mainnetHarmony; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = false;
const NETWORKCHECK = true;
const USE_BURNER_WALLET = false; // toggle burner wallet feature
const USE_NETWORK_SELECTOR = false;

const web3Modal = Web3ModalSetup();

// 🛰 providers
const providers = [
  initialNetwork.rpcUrl
];

function App(props) {
  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();
  const [selectedNetwork, setSelectedNetwork] = useState(initialNetwork.name);
  const location = useLocation();

  const targetNetwork = NETWORKS[selectedNetwork];

  // 🔭 block explorer URL
  const blockExplorer = targetNetwork.blockExplorer;

  // load all your providers
  const localProvider = useStaticJsonRPC([
    process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : targetNetwork.rpcUrl,
  ]);
  const mainnetProvider = useStaticJsonRPC(providers);

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == "function") {
      await injectedProvider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  // /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  // const price = useExchangeEthPrice(targetNetwork, mainnetProvider);

  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProviderAndSigner = useUserProviderAndSigner(injectedProvider, localProvider, USE_BURNER_WALLET);
  const userSigner = userProviderAndSigner.signer;

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setAddress(newAddress);
      }
    }
    getAddress();
  }, [userSigner]);

  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId =
    userSigner && userSigner.provider && userSigner.provider._network && userSigner.provider._network.chainId;

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  const harmonyChainId = NETWORKS.mainnetHarmony.chainId;

  const contractConfig = { deployedContracts: deployedContracts || {}, externalContracts: externalContracts || {} };

  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  const mainnetContracts = useContractLoader(mainnetProvider, contractConfig, harmonyChainId);


  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new ethers.providers.Web3Provider(provider));

    provider.on("chainChanged", chainId => {
      console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    provider.on("accountsChanged", () => {
      console.log(`account changed!`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  return (
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name */}
      <Header />
      <NetworkDisplay
        NETWORKCHECK={NETWORKCHECK}
        localChainId={localChainId}
        selectedChainId={selectedChainId}
        targetNetwork={targetNetwork}
        logoutOfWeb3Modal={logoutOfWeb3Modal}
        USE_NETWORK_SELECTOR={USE_NETWORK_SELECTOR}
      />
      <Menu style={{ textAlign: "center", marginTop: 40 }} selectedKeys={[location.pathname]} mode="horizontal">
        <Menu.Item key="/">
          <Link to="/">Start</Link>
        </Menu.Item>
        <Menu.Item key="/auctions">
          <Link to="/auctions">Tavern</Link>
        </Menu.Item>
        <Menu.Item key="/bank">
          <Link to="/bank">Bank</Link>
        </Menu.Item>
        <Menu.Item key="/gardens">
          <Link to="/gardens">Gardens</Link>
        </Menu.Item>
        <Menu.Item key="/jewel">
          <Link to="/jewel">Jewel Token</Link>
        </Menu.Item>
        {/* <Menu.Item key="/hero">
          <Link to="/hero">Hero NFT</Link>
        </Menu.Item> */}
      </Menu>

      <Switch>
        <Route exact path="/">
          <Card title="Tips" size="large">
            <h1></h1>
            <h2>👆 Pick a DFK contract to interact with from the options above 👆</h2>
            <h3></h3>
            <h3><b>Why? To allow making transaction using non DFK UI</b></h3>
            If DFK's UI (e.g. tavern) isn't working correctly, this tool can be used for transacting 
            (as DFK's contracts aren't verified interacting on the block explorer isn't possible)
            <h3></h3>
            <h3><b>Gotchas & Tips</b></h3>
            1. Don't forget to make the numbers into 18 decimals format by pressing the 💥 button
            <h3></h3>
            <h3><b>Security</b></h3>
            <p>1. To verify you're interacting with correct contracts check discord "#serendale-contracts"</p>
            <p>2. The contracts ABIs were published by DFK at: <a href="https://github.com/DefiKingdoms/contracts/tree/main/abi" target="_blank">github.com/DefiKingdoms/contracts</a></p>
          </Card>
        </Route>
        <Route path="/auctions">
          <div style={{ margin: "auto", width: "70vw" }}>
            <Card title="Resources" size="small">              
              <h3>General community resources
                : <a href="http://dfktavern.com/" target="_blank">dfktavern</a>
                , <a href="https://dfking.co/" target="_blank">dfking.co</a>
                , <a href="https://kingdom.watch" target="_blank">kingdom.watch</a>
                , <a href="https://dfktracker.app/" target="_blank">dfktracker</a>
              </h3>
              <h3>Real-time listings monitors:
                : <a href="http://dfktavern.com/saleAuction-alert" target="_blank">dfktavern-sales</a>
                , <a href="https://dfking.co/sales" target="_blank">dfking-sales</a>
                , discord "#tavern-listings"
              </h3>
            </Card>
            <Card title="Tips" size="small">
              <p>Find recent listing via above resources and then:</p>
              <p>1. Check current price using <b>"getCurrentPrice"</b> if it fails - it's no longer listed</p>
              <p>2. For <b>"bid"</b> make the <i>_bidAmount</i> into 18 decimals format by pressing the 💥 button</p>
            </Card>
          </div>
          <Contract
            name="Tavern Auctions Contract"
            customContract={mainnetContracts?.AUCTIONS}
            showFirst={["getCurrentPrice", "bid"]}
            signer={userSigner}
            provider={mainnetProvider}
            address={address}
            blockExplorer={blockExplorer}
            contractConfig={contractConfig}
            chainId={initialNetwork.chainId}
          />
        </Route>
        <Route path="/bank">
          <Contract
            name="Bank Contract"
            customContract={mainnetContracts?.BANK}
            showFirst={["balanceOf", "enter", "leave"]}
            signer={userSigner}
            provider={mainnetProvider}
            address={address}
            blockExplorer={blockExplorer}
            contractConfig={contractConfig}
            chainId={initialNetwork.chainId}
          />
        </Route>
        <Route path="/gardens">
          <Contract
            name="Gardens Contract"
            customContract={mainnetContracts?.GARDENS}
            showFirst={["claimReward", "claimRewards"]}
            signer={userSigner}
            provider={mainnetProvider}
            address={address}
            blockExplorer={blockExplorer}
            contractConfig={contractConfig}
            chainId={initialNetwork.chainId}
          />
        </Route>
        <Route path="/jewel">
          <Contract
            name="Jewel Token Contract (ERC20)"
            customContract={mainnetContracts?.JEWEL}
            showFirst={["balanceOf", "claimRewards"]}
            signer={userSigner}
            provider={mainnetProvider}
            address={address}
            blockExplorer={blockExplorer}
            contractConfig={contractConfig}
            chainId={initialNetwork.chainId}
          />
        </Route>
        {/* <Route path="/hero">
          <Contract
            name="Hero NFT Contract (ERC721)"
            customContract={mainnetContracts?.HERO}
            signer={userSigner}
            provider={mainnetProvider}
            address={address}
            blockExplorer={blockExplorer}
            contractConfig={contractConfig}
            chainId={initialNetwork.chainId}
          />
        </Route> */}
      </Switch>

      <ThemeSwitch />

      {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
      <div style={{ position: "fixed", textAlign: "right", right: 0, top: 0, padding: 10 }}>
        <div style={{ display: "flex", flex: 1, alignItems: "center" }}>          
          <Account
            web3Modal={web3Modal}
            loadWeb3Modal={loadWeb3Modal}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
          />
        </div>
      </div>

    </div>
  );
}

export default App;
