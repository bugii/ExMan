const { ipcMain } = require("electron");
const openService = require("../utils/openService");
const updateFrontend = require("../utils/updateFrontend");
const servicesManager = require("../services/ServicesManger");

ipcMain.on("add-service", (event, name) => {
  console.log("add service", name);
  const id = servicesManager.addService({
    id: null,
    name,
    autoResponse: false,
  });

  updateFrontend();
  openService(id);
});

ipcMain.on("delete-service", (event, id) => {
  console.log("delete service", id);
  servicesManager.deleteService(id);
});

ipcMain.on("refresh-service", (e, id) => {
  console.log(`refreshing ${id}`);
  servicesManager.refreshService(id);
});
