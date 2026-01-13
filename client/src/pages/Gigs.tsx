import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GigCard from '../components/GigCard';
import { gigApi } from '../api/gig.api';
import type { Gig } from '../types/gig';
import Loader from '../components/Loader';
import { logger } from '../utils/logger';

const Gigs = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const q = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(q);

  useEffect(() => {
    const fetchGigs = async () => {
      setLoading(true);
      try {
        const response = await gigApi.getAll(q);
        setGigs(response.data);
      } catch (err: any) {
        logger.error('Error fetching gigs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGigs();
  }, [q]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/gigs?search=${searchTerm}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Explore Gigs</h1>
        <form onSubmit={handleSearch} className="flex w-full md:w-auto">
          <input
            type="text"
            placeholder="Search for services..."
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-r-md hover:bg-blue-700"
          >
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {gigs.length > 0 ? (
            gigs.map((gig) => ( 
              gig.status !== 'assigned' && <GigCard key={gig._id} gig={gig} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 py-12">No gigs found matching your criteria.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Gigs;
