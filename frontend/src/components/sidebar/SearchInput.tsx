import { Search } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import useGetConversations from "../../hooks/useGetConversations";
import useConversation from "../../zustand/useConversation";

const SearchInput = () => {
	const [search, setSearch] = useState('')
	const { setSelectedConversation } = useConversation();
	const { conversations } = useGetConversations();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!search) return;

		if (search.length < 3) return toast.error('Search term must be at least 3 characters long');

		const searchConversation = conversations.find((conversation) => conversation.fullname.toLowerCase().includes(search.toLowerCase()));

		if (searchConversation) {
			setSelectedConversation(searchConversation);
			setSearch('');
		} else toast.error('No such user found!!')
	}

	return (
		<form onSubmit={handleSubmit} className='flex items-center gap-2'>
			<input
				type='text'
				placeholder='Search…'
				className='input-sm md:input input-bordered rounded-full sm:rounded-full w-full'
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>
			<button type='submit' className='btn md:btn-md btn-sm btn-circle bg-sky-500 text-white  '>
				<Search className='w-4 h-4 md:w-6 md:h-6 outline-none' />
			</button>
		</form>
	);
};
export default SearchInput;