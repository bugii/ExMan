import Table from "@material-ui/core/Table";
import Service from "../Navbar/Service";
import React from //useState
"react";

export default function ServiceMessageSummaryBox(props) {
  const shortenMessage = (msg) => {
    let shortMessage = msg;
    //if(shortMessage.length > props.charLimit)
    //    shortMessage = shortMessage.substring(0,props.charLimit)+"...";

    return shortMessage;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Table>
        {props.focusSession.services.map((service) =>
          service.messages.length > 0 ? (
            <tr
              style={{
                backgroundColor: props.backgroundColor,
                borderRadius: 25,
              }}
            >
              <td style={{ width: 150 }}>
                <Service
                  key={service.id}
                  id={service.id}
                  setActiveService={props.setActiveService}
                  name={service.name}
                  unreadCount={service.unreadCount}
                  icon={props.offeredServices[service.name].icon}
                  deleteApp={props.deleteApp}
                />
              </td>
              {service.messages.sort(((a, b) => a.title !== b.title ? a.title < b.title ? -1 : 1 : 0)).map((message) => (
                <tr style={{ fontSize: 12, textAlign: "left" }}>
                  <td>{props.formatTime(message.timestamp)}</td>
                  <td>{message.title}</td>
                  <td>
                    {service.name === "whatsapp"
                      ? shortenMessage(message.body.slice(0, -9))
                      : shortenMessage(message.body)}
                  </td>
                </tr>
              ))}
            </tr>
          ) : (
            <tr
              style={{
                backgroundColor: props.backgroundColor,
                borderRadius: 25,
              }}
            >
              <td style={{ width: 150 }}>
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
              </td>
              <td>No messages received.</td>
            </tr>
          )
        )}
      </Table>
    </div>
  );
}
