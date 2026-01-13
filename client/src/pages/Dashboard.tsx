import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { Gig } from '../types/gig';
import type { Bid } from '../types/bid';
import { gigApi } from '../api/gig.api';
import { bidApi } from '../api/bid.api';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';
import GigCard from '../components/GigCard';
import BidCard from '../components/BidCard';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [items, setItems] = useState<(Gig | Bid)[]>([]);
  const [loading, setLoading] = useState(false);

  const isClient = currentUser?.role === 'client';

  useEffect(() => {
    if (!currentUser) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        if (isClient) {
          const allGigsResponse = await gigApi.getAll();
          const myData = allGigsResponse.data.filter((g) =>
            typeof g.owner === 'object' ? g.owner._id === currentUser._id : g.owner === currentUser._id
          );
          setItems(myData);
        } else {
          const myBidsResponse = await bidApi.getMyBids();
          setItems(myBidsResponse.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, isClient]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {isClient ? 'My Gigs' : 'My Bids'}
          </h1>
          <p className="text-gray-500 mt-2">
            {isClient
              ? 'Manage your posted gigs and review proposals.'
              : 'Track your active bids and application status.'}
          </p>
        </div>
        {isClient && (
          <Link
            to="/add"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Post New Gig
          </Link>
        )}
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div>
          {items.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      isClient
                        ? 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                        : 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                    }
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {isClient ? 'No gigs posted yet' : 'No bids placed yet'}
              </h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                {isClient
                  ? "Get started by creating your first gig listing. It only takes a few minutes."
                  : "Start browsing available gigs and submit your first proposal."}
              </p>
              {isClient ? (
                <Link
                  to="/add"
                  className="text-blue-600 font-medium hover:text-blue-700 hover:underline"
                >
                  Create your first gig &rarr;
                </Link>
              ) : (
                <Link
                  to="/gigs"
                  className="text-blue-600 font-medium hover:text-blue-700 hover:underline"
                >
                  Browse Gigs &rarr;
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {isClient
                ? (items as Gig[]).map((g) => <GigCard key={g._id} gig={g} />)
                : (items as Bid[]).map((b) => <BidCard key={b._id} bid={b} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
