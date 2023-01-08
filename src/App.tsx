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
} from "semantic-ui-react";
import Startbar from "./Startbar";
import { Types, AptosClient, BCS } from "aptos";
var Buffer = require("buffer/").Buffer;

const client = new AptosClient("https://fullnode.devnet.aptoslabs.com");

function App() {
  // Retrieve aptos.account on initial render and store it.

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

  React.useEffect(() => {
    connectToWallet();
    console.log(address);
  }, []);

  const connectToWallet = async () => {
    const status = await (window as any).aptos.isConnected();
    if (!status) {
      const result = await window.aptos.connect();
      const account = await window.aptos.account();
      setAddress(account.address);
    } else {
      const account = await window.aptos.account();
      setAddress(account.address);
      console.log("Wallet connected", address);
    }
  };

  const handleChange = (e: any) => {
    setModuleDetails({
      ...moduleDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleModuleDetailsSubmit = async (e: any) => {
    e.preventDefault();
    setModuleFetchLoading(true);
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
          {address !== "" ? (
            <p>
              Wallet Connected: <b>{address}</b>
            </p>
          ) : (
            <p>Not Connected</p>
          )}
          <Form>
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
            {moduleFetchStatus.result && (
              <div>
                <Header as="h3" dividing>
                  Exposed Functions
                </Header>
                {moduleABI?.exposed_functions.map((func, index) => {
                  return (
                    <Accordion>
                      <Accordion.Title
                        active={activeFunctionsIndex === index}
                        index={index}
                        onClick={handleFunctionsAccordion}
                      >
                        <Icon name="dropdown" />
                        {func.name}
                      </Accordion.Title>
                      <Accordion.Content
                        active={activeFunctionsIndex === index}
                      >
                        <List unordered>
                          {moduleABI.exposed_functions[index].params.map(
                            (params, index) => {
                              if (params !== "&signer")
                                return (
                                  <List.Item>
                                    {/* <Button content={params} /> */}
                                    <Input label={params} placeholder={params} />
                                  </List.Item>
                                );
                            }
                          )}
                        </List>
                        <Button secondary>Execute</Button>
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
