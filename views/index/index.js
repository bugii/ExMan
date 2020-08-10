const { ipcRenderer } = require("electron");

const whatsapp = document.getElementById("whatsapp");
const slack = document.getElementById("slack");
const teams = document.getElementById("teams");
const setDnd = document.getElementById("set-dnd");
const home = document.getElementById("home");
//const teamsMessage = document.getElementById("teams-message");
const test = document.getElementById("test");

const iconClicked = (name) => {
  ipcRenderer.send("app-change", name);
};

const handleDnd = () => {
  ipcRenderer.send("set-dnd");
};

/*
const sendTeams = () => {
  ipcRenderer.send("teams-message");
};
*/
const tester = () => {
  ipcRenderer.send("test");
};

home.addEventListener("click", () => iconClicked("home"));
whatsapp.addEventListener("click", () => iconClicked("whatsapp"));
slack.addEventListener("click", () => iconClicked("slack"));
teams.addEventListener("click", () => iconClicked("teams"));
setDnd.addEventListener("click", handleDnd);
//teamsMessage.addEventListener("click", sendTeams);
test.addEventListener("click", tester);
