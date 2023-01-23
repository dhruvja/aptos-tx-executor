import React, { useState, useRef } from "react";
import "./App.css";
import {
  Header,
  Segment,
  Form,
  Button,
  Card,
  Image,
  Message,
  Accordion,
  Icon,
  List,
  Input,
  Dropdown,
} from "semantic-ui-react";
import Startbar from "./Startbar";
import { Types, AptosClient, BCS } from "aptos";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
var Buffer = require("buffer/").Buffer;

function App() {
  // Retrieve aptos.account on initial render and store it.
  const n = 15;
  const networkOptions = [
    {key: 'Devnet', value: 'https://fullnode.devnet.aptoslabs.com/v1', text: 'Devnet'},
    {key: 'Testnet', value: 'https://fullnode.testnet.aptoslabs.com/v1', text: 'Testnet'},
    {key: 'Mainnet', value: 'https://fullnode.mainnet.aptoslabs.com/v1', text: 'Mainnet'}
  ]

  const [moduleDetails, setModuleDetails] = useState({
    address: "",
    name: "",
  });
  const [address, setAddress] = useState("");
  const [moduleFetchStatus, setModuleFetchStatus] = useState({
    status: false,
    result: false,
    message: "",
  });
  const [present, setPresent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [moduleFetchLoading, setModuleFetchLoading] = useState<boolean>(false);
  const [moduleABI, setModuleABI] = useState<Types.MoveModule>();
  const [activeFunctionsIndex, setActiveFunctionsIndex] = useState<number>(-1);
  const [transactionArgument, setTransactionArguments] = useState(
    Array(n).fill(Array(n).fill(""))
  );
  const [transactionLoading, setTransactionLoading] = useState<boolean>(false);
  const [transactionStatus, setTransactionStatus] = useState({
    status: false,
    result: false,
    message: "",
  });
  const [network, setNetwork] = useState<string>(
    "https://fullnode.devnet.aptoslabs.com"
  );
  const [typeArgument, setTypeArguments] = useState(
    Array(n).fill(Array(n).fill(""))
  );

  const {
    connect,
    account,
    connected,
    disconnect,
    wallet,
    wallets,
    signAndSubmitTransaction,
    signTransaction,
    signMessage,
    signMessageAndVerify,
  } = useWallet();

  // React.useEffect(() => {
  //   // connectToWallet();
  //   console.log(address);
  // }, []);

  // const connectToWallet = async () => {
  //   const status = await (window as any).aptos.isConnected();
  //   if (!status) {
  //     const result = await window.aptos.connect();
  //     const account = await window.aptos.account();
  //     setAddress(account.address);
  //   } else {
  //     const account = await window.aptos.account();
  //     setAddress(account.address);
  //     console.log("Wallet connected", address);
  //   }
  // };

  const handleNetworkChange = (e: any, data: any) => {
    setNetwork(data.value);
    setModuleFetchStatus({
      status: false,
      result: false,
      message: ""
    })
  }

  const handleChange = (e: any) => {
    setModuleDetails({
      ...moduleDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleModuleDetailsSubmit = async (e: any) => {
    e.preventDefault();
    setModuleFetchLoading(true);
    const client = new AptosClient(network);
    try {
      const moduleABI = await client.getAccountModule(
        moduleDetails.address,
        moduleDetails.name
      );
      console.log(moduleABI);
      setModuleFetchStatus({
        status: true,
        result: true,
        message: "",
      });
      setModuleABI(moduleABI.abi);
      setModuleFetchLoading(false);
      const totalFunctions = moduleABI.abi?.exposed_functions.length;
      let maximumArgs = 1;
      moduleABI.abi?.exposed_functions.forEach((func, index) => {
        if (func.params.length > maximumArgs)
          maximumArgs = func.params.length;
      });
      const totalArguments = Array(totalFunctions).fill(Array(maximumArgs).fill(""))
      const totalTypeArguments = Array(totalFunctions).fill(Array(maximumArgs).fill(""))
      setTransactionArguments(totalArguments);
      setTypeArguments(totalTypeArguments);
    } catch (error) {
      console.log((error as Error).message);
      setModuleFetchStatus({
        status: true,
        result: false,
        message: (error as Error).message,
      });
      setModuleFetchLoading(false);
    }
  };

  const handleFunctionsAccordion = (e: any, titleProps: any) => {
    const { index } = titleProps;
    index === activeFunctionsIndex
      ? setActiveFunctionsIndex(-1)
      : setActiveFunctionsIndex(index);
  };

  const handleTransactionArguments = (
    functionIndex: number,
    paramIndex: number,
    e: any
  ) => {
    let copy = JSON.parse(JSON.stringify(transactionArgument)); 
    copy[functionIndex][paramIndex] = e.target.value;
    setTransactionArguments(copy);
  };

  const handleTypeArguments = (
    functionIndex: number,
    paramIndex: number,
    e: any
  ) => {
    let copy = JSON.parse(JSON.stringify(typeArgument)); 
    copy[functionIndex][paramIndex] = e.target.value;
    setTypeArguments(copy);
  };

  const executeTransaction = async (
    functionIndex: number,
    functionName: string
  ) => {
    if(!connected) {
      alert("Please Connect your wallet");
      return;
    }
    setTransactionLoading(true);
    const client = new AptosClient(network);
    console.log(transactionArgument[functionIndex]);
    console.log(typeArgument[functionIndex]);
    const localArguments = transactionArgument[functionIndex].filter(
      (args: any) => {
        return args !== "";
      }
    );
    const localTypeArguments = typeArgument[functionIndex].filter(
      (args: any) => {
        return args !== "";
      }
    );
    console.log(localArguments);
    console.log(localTypeArguments);
    const payload = {
      arguments: localArguments,
      function: `${moduleDetails.address}::${moduleDetails.name}::${functionName}`,
      type: "entry_function_payload",
      type_arguments: localTypeArguments,
    };
    try {
      const pendingTransaction = await signAndSubmitTransaction(payload);

      // In most cases a dApp will want to wait for the transaction, in these cases you can use the typescript sdk
      const txn = await client.waitForTransactionWithResult(
        pendingTransaction.hash
      );
      console.log(txn);
      console.log(txn.hash, txn.type);
      setTransactionStatus({
        status: true,
        result: true,
        message: "The transaction went through successfully",
      });
    } catch (error) {
      console.log(error);
      setTransactionStatus({
        status: true,
        result: false,
        message: (error as Error).message,
      });
    }
    setTransactionLoading(false);
  };

  return (
    <div>
      <Startbar />
      <Header as="h1" className="centerAlign">
        Aptos Module Explorer
      </Header>
      <div className="content">
        <Segment className="content">
          <Header as="h3" dividing>
            Enter the details
          </Header>
          <WalletSelector />
          <br/><br/>
          {/* {address !== "" ? (
            <p>
              Wallet Connected: <b>{address}</b>
            </p>
          ) : (
            <p>Not Connected</p>
          )} */}
          <Form>
            <Dropdown
              placeholder="Select Network"
              defaultValue="https://fullnode.devnet.aptoslabs.com/v1"
              selection
              options={networkOptions}
              onChange={handleNetworkChange}
            />
            <br />
            <br />
            <Form.Field>
              <label>Module Address</label>
              <input
                placeholder="Eg: 0xd507361592f08b3b06b91d150b0f56537bafc30a806c4c29db51991408f34acc"
                name="address"
                value={moduleDetails.address}
                onChange={handleChange}
                required
              />
            </Form.Field>
            <Form.Field>
              <label>Module Name</label>
              <input
                placeholder="Eg: tictactoe"
                name="name"
                value={moduleDetails.name}
                onChange={handleChange}
                required
              />
            </Form.Field>
            {moduleFetchLoading ? (
              <Button primary loading>
                Fetching
              </Button>
            ) : (
              <Button primary onClick={handleModuleDetailsSubmit}>
                Fetch
              </Button>
            )}
            <br />
            <br />
            {moduleFetchStatus.status && !moduleFetchStatus.result && (
              <Message negative>
                <Message.Header>Could not fetch the module</Message.Header>
                <p>{moduleFetchStatus.message}</p>
              </Message>
            )}
            {transactionStatus.status &&
              (!transactionStatus.result ? (
                <Message negative>
                  <Message.Header>Transaction Failed</Message.Header>
                  <p>{transactionStatus.message}</p>
                </Message>
              ) : (
                <Message positive>
                  <Message.Header>
                    Transaction Executed Successfully
                  </Message.Header>
                  <p>{transactionStatus.message}</p>
                </Message>
              ))}
            {moduleFetchStatus.result && (
              <div>
                <Header as="h3" dividing>
                  Entry Functions
                </Header>
                {moduleABI?.exposed_functions.map((func, index) => {
                  if(!func.is_entry)
                    return;
                  return (
                    <Accordion>
                      <Accordion.Title
                        active={activeFunctionsIndex === index}
                        index={index}
                        onClick={handleFunctionsAccordion}
                      >
                        <Icon name="dropdown" />
                        <b>{func.name}</b>
                      </Accordion.Title>
                      <Accordion.Content
                        active={activeFunctionsIndex === index}
                      >
                        {moduleABI.exposed_functions[index].params.length >
                          0 && <Header as="h5">Transaction Arguments</Header>}
                        <List>
                          {moduleABI.exposed_functions[index].params.map(
                            (params, paramIndex) => {
                              if (params !== "&signer")
                                return (
                                  <List.Item>
                                    {/* <Button content={params} /> */}
                                    <Input
                                      key={paramIndex}
                                      label={params}
                                      placeholder={params}
                                      onChange={(e) =>
                                        handleTransactionArguments(
                                          index,
                                          paramIndex,
                                          e
                                        )
                                      }
                                      value={
                                        transactionArgument[index][paramIndex] != undefined ? transactionArgument[index][paramIndex] : ""
                                      }
                                    />
                                  </List.Item>
                                );
                            }
                          )}
                        </List>
                        {moduleABI.exposed_functions[index].generic_type_params
                          .length > 0 && (
                          <Header as="h5">Type Arguments</Header>
                        )}
                        <List >
                          {moduleABI.exposed_functions[
                            index
                          ].generic_type_params.map((params, paramIndex) => {
                            return (
                              <List.Item>
                                <Input
                                  key={paramIndex}
                                  label="Enter the Type parameter"
                                  placeholder="Eg: 0x1::aptos_coin::AptosCoin"
                                  onChange={(e) =>
                                    handleTypeArguments(index, paramIndex, e)
                                  }
                                  // value={typeArgument[index][paramIndex]}
                                />
                              </List.Item>
                            );
                          })}
                        </List>
                        {transactionLoading ? (
                          <Button secondary loading>
                            Executing
                          </Button>
                        ) : (
                          <Button
                            secondary
                            onClick={() => executeTransaction(index, func.name)}
                          >
                            Execute
                          </Button>
                        )}
                      </Accordion.Content>
                    </Accordion>
                  );
                })}
              </div>
            )}
            <br/><br/>
            {moduleFetchStatus.result && (
              <div>
                <Header as="h3" dividing>
                  Public Functions (cannot be called using API/SDK)
                </Header>
                {moduleABI?.exposed_functions.map((func, index) => {
                  if(func.is_entry)
                    return;
                  return (
                    <Accordion>
                      <Accordion.Title
                        active={activeFunctionsIndex === index}
                        index={index}
                        onClick={handleFunctionsAccordion}
                      >
                        <Icon name="dropdown" />
                        <b>{func.name}</b>
                      </Accordion.Title>
                      <Accordion.Content
                        active={activeFunctionsIndex === index}
                      >
                        {moduleABI.exposed_functions[index].params.length >
                          0 && <Header as="h5">Transaction Arguments</Header>}
                        <List>
                          {moduleABI.exposed_functions[index].params.map(
                            (params, paramIndex) => {
                              if (params !== "&signer")
                                return (
                                  <List.Item>
                                    {/* <Button content={params} /> */}
                                    <Input
                                      key={paramIndex}
                                      label={params}
                                      placeholder={params}
                                      onChange={(e) =>
                                        handleTransactionArguments(
                                          index,
                                          paramIndex,
                                          e
                                        )
                                      }
                                      value={
                                        transactionArgument[index][paramIndex] != undefined ? transactionArgument[index][paramIndex] : ""
                                      }
                                    />
                                  </List.Item>
                                );
                            }
                          )}
                        </List>
                        {moduleABI.exposed_functions[index].generic_type_params
                          .length > 0 && (
                          <Header as="h5">Type Arguments</Header>
                        )}
                        <List >
                          {moduleABI.exposed_functions[
                            index
                          ].generic_type_params.map((params, paramIndex) => {
                            return (
                              <List.Item>
                                <Input
                                  key={paramIndex}
                                  label="Enter the Type parameter"
                                  placeholder="Eg: 0x1::aptos_coin::AptosCoin"
                                  onChange={(e) =>
                                    handleTypeArguments(index, paramIndex, e)
                                  }
                                  // value={typeArgument[index][paramIndex]}
                                />
                              </List.Item>
                            );
                          })}
                        </List>
                        {/* {transactionLoading ? (
                          <Button secondary loading>
                            Executing
                          </Button>
                        ) : (
                          <Button
                            secondary
                            disabled
                          >
                            Execute
                          </Button>
                        )} */}
                      </Accordion.Content>
                    </Accordion>
                  );
                })}
              </div>
            )}
          </Form>
        </Segment>
      </div>
    </div>
  );
}

export default App;
