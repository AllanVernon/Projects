import { setCompanies } from '@/redux/companySlice';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const useGetAllCompanies = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);

    useEffect(() => {
        const fetchCompanies = async () => {
            if (!user?._id) {
                toast.error('Please log in to fetch companies');
                return;
            }

            try {
                // console.log('Fetching companies from:', `${COMPANY_API_END_POINT}/get?userId=${user._id}`);
                const res = await axios.get(`${COMPANY_API_END_POINT}/get?userId=${user._id}`, {
                    withCredentials: true,
                });
                if (res.data.success) {
                    dispatch(setCompanies(res.data.companies));
                } else {
                    toast.error(res.data.message || 'No companies found');
                }
            } catch (error) {
                console.error('Error fetching companies:', error);
                toast.error(error.response?.data?.message || 'Failed to fetch companies');
            }
        };
        fetchCompanies();
    }, [dispatch, user]);
};

export default useGetAllCompanies;