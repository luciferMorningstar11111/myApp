import { createConsumer } from "@rails/actioncable";

const CableApp = {};
CableApp.cable = createConsumer(
  `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/cable`
);

export default CableApp;
