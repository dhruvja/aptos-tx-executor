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
        </Menu>
      </Segment>
    </div>
  );
}

export default Startbar;
