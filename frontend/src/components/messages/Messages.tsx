import Message from "./Message";
import useGetMessages from "../../hooks/useGetMessages";
import useListenMessages from "../../hooks/useListenMessages";
import useChatScroll from "../../hooks/useChatScroll";

const Messages = () => {
	const { loading, messages } = useGetMessages();
	useListenMessages()

	const ref = useChatScroll(messages) as React.MutableRefObject<HTMLDivElement>;

	return (
		<div className='px-4 flex-1 overflow-auto' ref={ref}>
			{messages.map((message) => (
				<Message key={message.id} message={message} />
			))}
			{loading ? <span className="loading loading-spinner"/> : null}
		</div>
	);
};
export default Messages;