import { setAllAppliedJobs, setLoading } from "@/redux/jobSlice";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const useGetAppliedJobs = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      if (!user?._id) {
        toast.error("Please log in to view your applied jobs");
        return;
      }

      try {
        dispatch(setLoading(true)); // Set loading to true
        const res = await axios.get(`${APPLICATION_API_END_POINT}/get?userId=${user._id}`, {
          withCredentials: true,
        });
        console.log("API response:", res.data);
        if (res.data.success) {
          dispatch(setAllAppliedJobs(res.data.applications)); // Use 'applications' (plural)
        } else {
          toast.error(res.data.message || "Failed to fetch applied jobs");
        }
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
        toast.error(error.response?.data?.message || "Failed to fetch applied jobs");
      } finally {
        dispatch(setLoading(false)); // Set loading to false
      }
    };
    fetchAppliedJobs();
  }, [dispatch, user]);
};

export default useGetAppliedJobs;