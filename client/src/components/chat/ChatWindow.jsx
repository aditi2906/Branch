import { Avatar } from "@chakra-ui/avatar";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import { ChatState } from "../../Context/ChatProvider";
import InfiniteScroll from "react-infinite-scroller";
import ScrollableFeed from "react-scrollable-feed";

const ChatWindow = ({ messages }) => {
  const getSenderFull = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
  };
  const isSameSender = (messages, m, i, userId) => {
    return (
      i < messages.length - 1 &&
      (messages[i + 1].sender?._id !== m.sender?._id ||
        messages[i + 1].sender?._id === undefined) &&
      messages[i].sender?._id !== userId
    );
  };
  const senderMargin = (messages, m, i, userId) => {
    console.log(m, "yoyo");

    if (i < messages.length - 1 && m._id !== userId) return 700;
    else {
      return 0;
    }
  };
  const Row = ({ index, style }) => (
    <div style={style}>{/* define the row component using items[index] */}</div>
  );
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }}>
            <span
              style={{
                backgroundColor: `${m.sender === null ? "#BEE" : "#B9D"}`,
                marginLeft: `${m.sender === null ? "0" : "720px"}`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginTop: "4px",
              }}
            >
              {m.content}
            </span>
            {/* <span
              color="red"
              style={{
                backgroundColor: `${m.sender === null ? "#BEE" : null}`,
                marginLeft: senderMargin(messages, m, i, user._id),
                marginTop: isSameSender(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              <div style={{ display: "flex" }}>
                <div>hello</div>
                <div style={{ marginLeft: "0px" }}>hi</div>
              </div>
            </span> */}
          </div>
        ))}
    </ScrollableFeed>
    // <div style={{ overflowY: "scroll" }}>
    //   {messages &&
    //     messages.map((m, i) => (
    //       <div style={{ display: "flex" }}>
    //         <span
    //           color="red"
    //           style={{
    //             backgoundColor: "black",
    //             marginLeft: isSameSenderMargin(messages, m, i, user._id),
    //             borderRadius: "20px",
    //             padding: "5px 15px",
    //             maxWidth: "75%",
    //           }}
    //         >
    //           {m.content}
    //         </span>
    //       </div>
    //     ))}
    // </div>
  );
};

export default ChatWindow;
