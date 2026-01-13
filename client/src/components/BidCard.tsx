import { Link } from 'react-router-dom';
import type { Bid } from '../types/bid';
import { bidApi } from '../api/bid.api';
import toast from 'react-hot-toast';
import { logger } from '../utils/logger';

interface BidCardProps {
  bid: Bid;
  isOwner?: boolean;
  onHire?: () => void;
}

const BidCard = ({ bid, isOwner, onHire }: BidCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
  };

  const handleHireUser = async () => {
    try {
      if (confirm(`Are you sure you want to hire ${bid.freelancer.name}?`)) {
        await bidApi.hire(bid._id, bid.gig);
        toast.success(`Hired ${bid.freelancer.name} successfully!`);
        if (onHire) onHire();
      }
    } catch (e) {
      logger.error('Hire failed', e);
      toast.error('Failed to hire freelancer');
    }
  };

  if (isOwner) {
    // Gig Owner View (Incoming Proposal)
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-2">
            <div>
                <h4 className="font-bold text-gray-900">{bid.freelancer?.name || 'Unknown Freelancer'}</h4>
                <p className="text-xs text-gray-500">{formatDate(bid.createdAt)}</p>
            </div>
            <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-gray-900">${bid.amount}</span>
            </div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded text-gray-600 text-sm mb-4 italic border border-gray-100">
            "{bid.message}"
        </div>

        <div className="flex justify-between items-center">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${getStatusColor(bid.status)}`}>
              {bid.status}
            </span>
            {bid.status === 'pending' && (
                <button 
                  onClick={handleHireUser}
                  className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors shadow-sm"
                >
                    Hire Candidate
                </button>
            )}
        </div>
      </div>
    );
  }

  // Freelancer View (My Bid)
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden group">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Link 
              to={`/gigs/${bid.gig._id}`}
              className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1 group-hover:text-blue-600"
            >
              {bid.gig.title}
            </Link>
            <p className="text-sm text-gray-500 mt-1">
              Applied {formatDate(bid.createdAt)}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(bid.status)}`}>
            {bid.status}
          </span>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 text-sm line-clamp-2 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
            "{bid.message}"
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Bid Amount:</span>
            <span className="text-lg font-bold text-gray-900">${bid.amount}</span>
          </div>
          <Link
            to={`/gigs/${bid.gig._id}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
          >
            View Gig
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BidCard;
