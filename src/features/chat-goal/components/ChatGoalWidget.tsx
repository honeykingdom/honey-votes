import getWidgetLink from "../utils/getWidgetLink";

type Props = {
  id?: string;
};

const ChatGoalWidget = ({ id }: Props) => {
  if (!id) return null;

  return (
    <iframe
      style={{ border: "1px solid #ccc", width: "100%", height: 320 }}
      src={getWidgetLink(id)}
    />
  );
};

export default ChatGoalWidget;
