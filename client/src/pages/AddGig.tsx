import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gigApi } from '../api/gig.api';
import toast from 'react-hot-toast';

const AddGig = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        budget: Number(formData.budget)
      };
      await gigApi.create(data);
      toast.success('Gig posted successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to post gig');
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Post a New Gig</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" name="title" required className="w-full mt-1 border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500" onChange={handleChange} />
        </div>
        
        <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" rows={4} required className="w-full mt-1 border-gray-300 rounded shadow-sm" onChange={handleChange} />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Budget ($)</label>
            <input type="number" name="budget" required min="1" className="w-full mt-1 border-gray-300 rounded shadow-sm" onChange={handleChange} />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 font-medium">Create Gig</button>
      </form>
    </div>
  );
};

export default AddGig;
