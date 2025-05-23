
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: 'blue' | 'green' | 'neutral';
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon: Icon,
  title, 
  description,
  color = 'blue'
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return {
          bgLight: 'bg-tradingblue-50',
          textDark: 'text-tradingblue-600'
        };
      case 'green':
        return {
          bgLight: 'bg-tradinggreen-50',
          textDark: 'text-tradinggreen-600'
        };
      default:
        return {
          bgLight: 'bg-gray-100',
          textDark: 'text-gray-600'
        };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow card-hover">
      <div className={`w-12 h-12 ${colorClasses.bgLight} rounded-lg flex items-center justify-center mb-4`}>
        <Icon className={`h-6 w-6 ${colorClasses.textDark}`} />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;
