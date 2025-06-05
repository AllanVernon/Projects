import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSelector, useDispatch } from 'react-redux';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import axios from 'axios';
import { JOB_API_END_POINT, COMPANY_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { setCompanies } from '@/redux/companySlice';

const PostJob = () => {
    const { user } = useSelector(store => store.auth);
    const { companies } = useSelector(store => store.company);
    const [input, setInput] = useState({
        title: '',
        description: '',
        requirements: '',
        salary: '',
        location: '',
        jobType: '',
        experience: '',
        position: 0,
        companyId: '',
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Fetch companies
    useEffect(() => {
        const fetchCompanies = async () => {
            if (!user?._id) {
                toast.error('Please log in to fetch companies');
                navigate('/login');
                return;
            }
            try {
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
    }, [dispatch, user, navigate]);

    // Debug logs
    console.log('Companies:', companies);
    console.log('Input:', input);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (value) => {
        const selectedCompany = companies.find((company) => company.name.toLowerCase() === value);
        console.log('Selected company:', selectedCompany);
        if (selectedCompany) {
            setInput({ ...input, companyId: selectedCompany._id });
        } else {
            toast.error('Selected company not found');
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!input.companyId) {
            toast.error('Please select a company');
            return;
        }
        if (!input.title || !input.description || !input.requirements || !input.salary || !input.location || !input.jobType || !input.experience || !input.position) {
            toast.error('Please fill all required fields');
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(`${JOB_API_END_POINT}/post?userId=${user._id}`, input, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate('/admin/jobs');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.response?.data?.message || 'Failed to post job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center w-screen my-5'>
                <form onSubmit={submitHandler} className='max-w-4xl p-8 border border-gray-200 rounded-md shadow-lg'>
                    <div className='grid grid-cols-2 gap-2'>
                        <div>
                            <Label>Title</Label>
                            <Input
                                type='text'
                                name='title'
                                value={input.title}
                                onChange={changeEventHandler}
                                className='my-1 focus-visible:ring-offset-0 focus-visible:ring-0'
                            />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input
                                type='text'
                                name='description'
                                value={input.description}
                                onChange={changeEventHandler}
                                className='my-1 focus-visible:ring-offset-0 focus-visible:ring-0'
                            />
                        </div>
                        <div>
                            <Label>Requirements</Label>
                            <Input
                                type='text'
                                name='requirements'
                                value={input.requirements}
                                onChange={changeEventHandler}
                                className='my-1 focus-visible:ring-offset-0 focus-visible:ring-0'
                            />
                        </div>
                        <div>
                            <Label>Salary</Label>
                            <Input
                                type='text'
                                name='salary'
                                value={input.salary}
                                onChange={changeEventHandler}
                                className='my-1 focus-visible:ring-offset-0 focus-visible:ring-0'
                            />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input
                                type='text'
                                name='location'
                                value={input.location}
                                onChange={changeEventHandler}
                                className='my-1 focus-visible:ring-offset-0 focus-visible:ring-0'
                            />
                        </div>
                        <div>
                            <Label>Job Type</Label>
                            <Input
                                type='text'
                                name='jobType'
                                value={input.jobType}
                                onChange={changeEventHandler}
                                className='my-1 focus-visible:ring-offset-0 focus-visible:ring-0'
                            />
                        </div>
                        <div>
                            <Label>Experience Level</Label>
                            <Input
                                type='text'
                                name='experience'
                                value={input.experience}
                                onChange={changeEventHandler}
                                className='my-1 focus-visible:ring-offset-0 focus-visible:ring-0'
                            />
                        </div>
                        <div>
                            <Label>No of Positions</Label>
                            <Input
                                type='number'
                                name='position'
                                value={input.position}
                                onChange={changeEventHandler}
                                className='my-1 focus-visible:ring-offset-0 focus-visible:ring-0'
                            />
                        </div>
                        {companies.length > 0 && (
                            <div>
                                <Label>Company</Label>
                                <Select onValueChange={selectChangeHandler}>
                                    <SelectTrigger className='w-[180px]'>
                                        <SelectValue placeholder='Select a Company' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {companies.map((company) => (
                                                <SelectItem key={company._id} value={company.name.toLowerCase()}>
                                                    {company.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                    {loading ? (
                        <Button className='w-full my-4'>
                            <Loader2 className='w-4 h-4 mr-2 animate-spin' /> Please wait
                        </Button>
                    ) : (
                        <Button type='submit' className='w-full my-4'>Post New Job</Button>
                    )}
                    {companies.length === 0 && (
                        <p className='my-3 text-xs font-bold text-center text-red-600'>
                            *Please register a company first, before posting a job
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default PostJob;