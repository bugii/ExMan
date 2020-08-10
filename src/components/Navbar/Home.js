import React from "react";

function Home(props) {
  const handleSettingClick = () => {
    props.setActiveService("home");
  };

  return (
    <button className="home-icon" onClick={handleSettingClick}>
      Home
    </button>
  );
}

export default Home;
