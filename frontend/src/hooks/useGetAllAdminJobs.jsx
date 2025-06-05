import { setAllAdminJobs } from '@/redux/jobSlice';
import { JOB_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const useGetAllAdminJobs = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);

    useEffect(() => {
        const fetchAllAdminJobs = async () => {
            if (!user?._id) {
                toast.error('Please log in to view your jobs');
                return;
            }

            try {
                const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs?userId=${user._id}`, {
                    withCredentials: true,
                });
                if (res.data.success) {
                    dispatch(setAllAdminJobs(res.data.jobs));
                } else {
                    toast.error(res.data.message || 'Failed to fetch jobs');
                }
            } catch (error) {
                console.error('Error fetching admin jobs:', error);
                toast.error(error.response?.data?.message || 'Failed to fetch jobs');
            }
        };
        fetchAllAdminJobs();
    }, [dispatch, user]);
};

export default useGetAllAdminJobs;