import { Link } from 'react-router-dom';
import type { Gig } from '../types/gig';

interface GigCardProps {
  gig: Gig;
}

const GigCard = ({ gig }: GigCardProps) => {
  return (
    <Link to={`/gigs/${gig._id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-4xl font-bold">
                {gig.title.charAt(0).toUpperCase()}
            </span>
        </div>
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
               {typeof gig.owner === 'object' && 'name' in gig.owner ? (gig.owner as any).name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="text-sm font-medium text-gray-700">
                {typeof gig.owner === 'object' && 'name' in gig.owner ? (gig.owner as any).name : 'Owner'}
            </span>
          </div>
          <p className="text-gray-500 text-sm mb-1 line-clamp-2">{gig.description}</p>
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600">
            {gig.title}
          </h3>
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-4">
            <span className="text-gray-400 text-sm">Budget</span>
            <span className="text-lg font-bold text-gray-900">${gig.budget}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;
