import React from "react";
import { Segment, Menu } from "semantic-ui-react";

function Startbar(props) {
  const handleItemClick = () => {
    console.log("Item Clicked");
  };

  return (
    <div>
      <Segment inverted>
        <Menu inverted pointing secondary>
          <Menu.Item header>Aptos Module Explorer</Menu.Item>
          <a href="https://github.com/dhruvja/aptos-tx-executor#aptos-transaction-executor-ui"><Menu.Item link={true}>Documentation</Menu.Item></a>
        </Menu>
      </Segment>
    </div>
  );
}

export default Startbar;
