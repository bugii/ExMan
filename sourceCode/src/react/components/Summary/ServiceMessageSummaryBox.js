import Table from "@material-ui/core/Table";
import Service from "../Navbar/Service";
import React from "react"; //useState

export default function ServiceMessageSummaryBox(props) {
  //const shortenMessage = (msg) => {
  //let shortMessage = msg;
  //if(shortMessage.length > props.charLimit)
  //    shortMessage = shortMessage.substring(0,props.charLimit)+"...";

  //return shortMessage;
  //};

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Table>
        {props.focusSession.services.map((service) => (
          <tr
            style={{
              backgroundColor: props.backgroundColor,
              borderRadius: 25,
            }}
          >
            <td style={{ width: 150 }}>
              {!service.isOther ? (
                <Service
                  key={service.id}
                  id={service.id}
                  setActiveService={props.setActiveService}
                  name={service.name}
                  unreadCount={service.unreadCount}
                  icon={props.offeredServices[service.name].icon}
                  deleteApp={props.deleteApp}
                  showBubble={false}
                />
              ) : (
                <Service
                  key={service.id}
                  id={service.id}
                  setActiveService={props.setActiveService}
                  name={service.name}
                  unreadCount={service.unreadCount}
                  icon={`http://icons.duckduckgo.com/ip2/${
                    new URL(service.url).hostname
                  }.ico`}
                  deleteApp={props.deleteApp}
                  showBubble={false}
                />
              )}
            </td>
            <td>
              <b>{service.messages.length}</b> missed notifications from{" "}
              {service.name}.
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
