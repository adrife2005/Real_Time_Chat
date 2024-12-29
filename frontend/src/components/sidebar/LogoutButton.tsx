import { LogOut } from "lucide-react";
import useLogout from "../../hooks/useLogout";

const LogoutButton = () => {
	const { loading, logout } = useLogout();

	const logoutUser = () => {
		logout()
	};

	return (
		<div className='mt-auto'>
			<LogOut className='w-6 h-6 text-white cursor-pointer' onClick={logoutUser} />
			{loading && <div className='absolute inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center' />}
		</div>
	);
};
export default LogoutButton;