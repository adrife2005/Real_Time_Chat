import Message from "./Message";
import useGetMessages from "../../hooks/useGetMessages";

const Messages = () => {
	const {loading, messages} = useGetMessages();

	return (
		<div className='px-4 flex-1 overflow-auto'>
			{messages.map((message) => (
				<Message key={message.id} message={message} />
			))}
			{loading ? <span className="loading loading-spinner"/> : null}
		</div>
	);
};
export default Messages;