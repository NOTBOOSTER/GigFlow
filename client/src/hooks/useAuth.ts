import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { login as loginAction, register as registerAction, logout as logoutAction } from '../features/auth/authSlice';

export const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { currentUser, loading, error } = useSelector((state: RootState) => state.auth);



    const logout = async () => {
        await dispatch(logoutAction()).unwrap();
    };

    return {
        currentUser,
        loading,
        error,
        login: async (data: { email: string; password: string }) => {
            const result = await dispatch(loginAction(data)).unwrap();
            return result;
        },
        register: async (data: { name: string; email: string; password: string; role: 'client' | 'freelancer' }) => {
            const result = await dispatch(registerAction(data)).unwrap();
            return result;
        },
        logout
    };
};
