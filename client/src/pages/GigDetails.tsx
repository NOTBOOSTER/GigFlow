import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { gigApi } from '../api/gig.api';
import { bidApi } from '../api/bid.api';
import type { Gig } from '../types/gig';
import type { Bid } from '../types/bid';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/Loader';
import BidCard from '../components/BidCard';
import toast from 'react-hot-toast';
import { logger } from '../utils/logger';

const GigDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [gig, setGig] = useState<Gig | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  
  const [bidPrice, setBidPrice] = useState<number>(0);
  const [bidMessage, setBidMessage] = useState('');
  const [hasBid, setHasBid] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const gigResponse = await gigApi.getOne(id);
        setGig(gigResponse.data);

        const gigOwnerId = typeof gigResponse.data.owner === 'string' ? gigResponse.data.owner : gigResponse.data.owner._id;
        if (currentUser && currentUser._id === gigOwnerId) {
          try {
             const bidsResponse = await bidApi.getByGigId(id);
             setBids(bidsResponse.data || []);
          } catch (err) {
             logger.error('Failed to fetch bids for owner', err);
          }
        }
      } catch (err) {
        toast.error('Failed to load gig details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, currentUser]);

  const handleHire = () => {
      const gigOwnerId = typeof gig === 'object' && gig && (typeof gig.owner === 'string' ? gig.owner : gig.owner._id);
      if(id && currentUser && gig && currentUser._id === gigOwnerId) {
          bidApi.getByGigId(id).then(res => setBids(res.data || []));
      }
  };

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !gig) return;

    try {
      await bidApi.create({
        gig: id,
        amount: bidPrice,
        message: bidMessage
      });
      toast.success('Bid placed successfully!');
      setHasBid(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to place bid');
    }
  };

  if (loading) return <div className="p-8"><Loader /></div>;
  if (!gig) return <div className="p-8 text-center">Gig not found</div>;

  const gigOwnerId = typeof gig.owner === 'string' ? gig.owner : gig.owner._id;
  const isOwner = currentUser?._id === gigOwnerId;
  console.log(gig)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded shadow">
             <h1 className="text-3xl font-bold text-gray-900 mb-4">{gig.title}</h1>
             
             <h2 className="text-xl font-semibold mb-2">About This Gig</h2>
             <p className="text-gray-700 whitespace-pre-line mb-6">{gig.description}</p>
             

             {currentUser && !isOwner && !hasBid && gig.status !== "assigned" && currentUser?.role === "freelancer" && (
                 <div className="bg-gray-50 p-6 rounded border border-blue-100">
                     <h3 className="text-lg font-semibold mb-4">Place a Bid</h3>
                     <form onSubmit={handlePlaceBid} className="space-y-4">
                         <div>
                             <label className="block text-sm font-medium text-gray-700">Your Offer ($)</label>
                             <input 
                                type="number" 
                                required 
                                min="1"
                                className="mt-1 w-full border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                value={bidPrice}
                                onChange={e => setBidPrice(Number(e.target.value))}
                             />
                         </div>
                         <div>
                             <label className="block text-sm font-medium text-gray-700">Message</label>
                             <textarea 
                                required 
                                rows={3}
                                className="mt-1 w-full border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                value={bidMessage}
                                onChange={e => setBidMessage(e.target.value)}
                             />
                         </div>
                         <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                             Submit Bid
                         </button>
                     </form>
                 </div>
             )}
             {hasBid && (
                 <div className="p-4 bg-green-100 text-green-800 rounded">
                     Allowed to place only one bid. Bid submitted!
                 </div>
             )}
        </div>
        

        {isOwner && (
            <div className="bg-gray-50 p-6 rounded shadow border-t-4 border-blue-500">
                <h2 className="text-2xl font-bold mb-4">Bids ({bids.length})</h2>
                {gig.status === "assigned" && (
                    <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded">
                        Gig assigned to freelancer : {gig?.hiredBid?.freelancer?.name}
                    </div>
                )}
                {bids.length === 0 ? (
                    <p className="text-gray-500">No bids yet.</p>
                ) : (
                    bids.map(bid => (
                        <BidCard 
                            key={bid._id} 
                            bid={bid}
                            isOwner={true} 
                            onHire={handleHire} 
                        />
                    ))
                )}
            </div>
        )}
      </div>


      <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded shadow sticky top-4">
             <div className="mb-4 pb-4 border-b border-gray-100">
                 <p className="text-sm text-gray-500">Gig Budget</p>
                 <p className="text-3xl font-bold text-gray-900">${gig.budget}</p>
             </div>
             <p className="text-gray-700 mb-4">Status: <span className="uppercase font-bold">{gig.status}</span></p>
          </div>
      </div>
    </div>
  );
};

export default GigDetails;
