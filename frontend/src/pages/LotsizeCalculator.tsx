import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

export default function LotsizeCalculator() {
  const [currency, setCurrency] = useState('USD');
  const [instrument, setInstrument] = useState('GBPUSD');
  const [accountBalance, setAccountBalance] = useState('');
  const [riskPercentage, setRiskPercentage] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [amountAtRisk, setAmountAtRisk] = useState(0);
  const [positionSize, setPositionSize] = useState(0);
  const [standardLots, setStandardLots] = useState(0);
  const [miniLots, setMiniLots] = useState(0);
  const [microLots, setMicroLots] = useState(0);
  const [riskTolerance, setRiskTolerance] = useState('low');
  const [calculated, setCalculated] = useState(false);
  const [lowRiskRecommendation, setLowRiskRecommendation] = useState('');
  const [highRiskRecommendation, setHighRiskRecommendation] = useState('');
  const [showInstrumentDropdown, setShowInstrumentDropdown] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Forex');
  const dropdownRef = useRef(null);

  // State for recommended brokers
  const [brokers, setBrokers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Instrument categories and options
  const instrumentOptions = {
    Forex: ['GBPUSD', 'EURUSD', 'NZDUSD', 'AUDUSD', 'XAUUSD', 'USDJPY', 'EURJPY', 'GBPJPY', 'AUDJPY'],
    Indices: ['US30', 'SPX500', 'NASDAQ', 'UK100', 'GER30'],
    Synthetic: ['VOLATILITY10', 'VOLATILITY25', 'VOLATILITY50', 'VOLATILITY75', 'VOLATILITY100'],
    Crypto: ['BTCUSD', 'ETHUSD', 'LTCUSD', 'XRPUSD']
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowInstrumentDropdown(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Generate risk tolerance recommendations when account balance changes
  useEffect(() => {
    if (accountBalance) {
      const balance = parseFloat(accountBalance);
      
      // Low risk tolerance (1-3%)
      const lowRiskMin = balance * 0.01;
      const lowRiskMax = balance * 0.03;
      setLowRiskRecommendation(
        `For a low risk tolerance with an account of **$${balance.toFixed(0)}**, risk between **1% - 3%** of your account per trade. ` +
        `This means you're risking **$${lowRiskMin.toFixed(1)} - $${lowRiskMax.toFixed(1)}** per trade. ` +
        `Risk consistency is very important for long-term success.`
      );
      
      // High risk tolerance (5-10%)
      const highRiskMin = balance * 0.05;
      const highRiskMax = balance * 0.10;
      setHighRiskRecommendation(
        `For a high risk tolerance with an account of **$${balance.toFixed(0)}**, risk between **5% - 10%** of your account per trade. ` +
        `This means you're risking **$${highRiskMin.toFixed(1)} - $${highRiskMax.toFixed(1)}** per trade. ` +
        `Remember that higher risk means potentially faster growth but also faster depletion of capital. Risk consistency is very important.`
      );
    } else {
      setLowRiskRecommendation('');
      setHighRiskRecommendation('');
    }
  }, [accountBalance]);

  const calculateResults = () => {
    if (accountBalance && riskPercentage && stopLoss) {
      setCalculated(true);
      const balance = parseFloat(accountBalance);
      const risk = parseFloat(riskPercentage);
      const stop = parseFloat(stopLoss);
      
      // Calculate amount at risk (account balance * risk percentage)
      const riskAmount = balance * (risk / 100);
      setAmountAtRisk(riskAmount);
      
      // Calculate position size based on stop loss
      // For forex: Position Size = Amount at Risk / (Stop Loss in pips * Pip Value)
      // This is a more accurate calculation that considers the stop loss
      // Assuming standard pip value of 0.0001 for most pairs (except JPY pairs)
      let pipValue = 0.0001;
      if (instrument.includes('JPY')) {
        pipValue = 0.01;
      }
      
      const positionSizeUnits = riskAmount / (stop * pipValue);
      setPositionSize(positionSizeUnits);
      
      // Convert to various lot sizes
      const standardLotsValue = positionSizeUnits / 100000;
      setStandardLots(standardLotsValue);
      setMiniLots(standardLotsValue * 10); // 1 mini lot = 10,000 units
      setMicroLots(standardLotsValue * 100); // 1 micro lot = 1,000 units
    } else {
      setAmountAtRisk(0);
      setPositionSize(0);
      setStandardLots(0);
      setMiniLots(0);
      setMicroLots(0);
    }
  };

  const toggleInstrumentDropdown = () => {
    setShowInstrumentDropdown(!showInstrumentDropdown);
  };

  const selectInstrument = (selected) => {
    setInstrument(selected);
    setShowInstrumentDropdown(false);
  };

  const API_URL = 'http://localhost:1337';
  // Fetch brokers from the Strapi API
  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/api/recommended-brokers`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch broker data');
        }
        
        const data = await response.json();
        setBrokers(data.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching broker data:', err);
        setError('Failed to load recommended brokers. Please try again later.');
        setBrokers([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBrokers();
  }, []);

  // Render broker component based on API data state
  const renderBrokers = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mr-2"></div>
          <span>Loading...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
      );
    }

    if (brokers.length === 0) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700">
          No broker recommendations available at this time.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {brokers.map((broker) => (
          <a 
            key={broker.id} 
            href={broker.link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-300 hover:border-green-300"
          >
            <h4 className="font-bold text-lg text-green-600">{broker.Name || "Unnamed Broker"}</h4>
            <p className="text-gray-600 mt-2">{broker.description || "No description available"}</p>
            <div className="mt-4 text-sm text-green-500 font-medium">Learn more →</div>
          </a>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="max-w-6xl mx-auto px-8 py-8 mb-16">
        <h1 className="text-4xl font-bold mb-2">Lotsize Calculator</h1>
        <p className="text-gray-600 mb-6">Enter the following information to accurately calculate your lotsize</p>
        
        <hr className="my-8 border-green-400" />
        
        <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="w-full md:w-1/2 flex flex-col items-center">
            <img 
                src="/images/logo.jpeg" 
                alt="FirepipsFX Logo" 
                className="mb-4 h-14 w-30 object-contain"
            />
            
            <h2 className="text-xl font-semibold mb-6">Position Size Calculator</h2>
            
            <div className="w-full max-w-md space-y-6">
                <div>
                <label className="block text-sm font-medium mb-2">Select Account Currency</label>
                <div className="relative">
                    <select 
                    className="w-full p-3 bg-green-700 text-white rounded-full appearance-none"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                    <option value="NGN">NGN</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    </div>
                </div>
                </div>
                
                {/* Instrument Dropdown */}
                <div className="relative" ref={dropdownRef}>
                <label className="block text-sm font-medium mb-2">Instrument</label>
                <div 
                    className="w-full p-3 border border-gray-300 rounded-full flex justify-between items-center cursor-pointer"
                    onClick={toggleInstrumentDropdown}
                >
                    <span>{instrument}</span>
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                
                {showInstrumentDropdown && (
                    <div className="absolute z-10 w-full bg-white mt-1 border border-gray-300 rounded shadow-lg">
                        <div className="flex overflow-x-auto p-2 bg-gray-100">
                            <button 
                                className={`px-3 py-1 rounded-xl mr-1 ${activeCategory === 'All' ? 'bg-gray-800 text-white' : 'bg-gray-300'}`}
                                onClick={() => setActiveCategory('All')}
                            >
                                All
                            </button>
                            {Object.keys(instrumentOptions).map((category) => (
                                <button 
                                    key={category}
                                    className={`px-3 py-1 rounded-xl mr-1 ${activeCategory === category ? 'bg-gray-800 text-white' : 'bg-gray-300'}`}
                                    onClick={() => setActiveCategory(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                            {activeCategory === 'All' ? (
                                // Show all instruments when "All" is selected
                                Object.values(instrumentOptions).flat().map((option) => (
                                    <div 
                                        key={option}
                                        className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
                                        onClick={() => selectInstrument(option)}
                                    >
                                        {option}
                                    </div>
                                ))
                            ) : (
                                // Show only instruments from the selected category
                                instrumentOptions[activeCategory].map((option) => (
                                    <div 
                                        key={option}
                                        className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
                                        onClick={() => selectInstrument(option)}
                                    >
                                        {option}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
                </div>
                
                <div>
                <label className="block text-sm font-medium mb-2">Account Balance</label>
                <div className="relative">
                    <input 
                    type="number" 
                    className="w-full p-3 border border-gray-300 rounded-full pl-8"
                    placeholder="0"
                    value={accountBalance}
                    onChange={(e) => setAccountBalance(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">$</span>
                    </div>
                </div>
                </div>
                
                <div>
                <label className="block text-sm font-medium mb-2">Risk Percentage</label>
                <div className="relative">
                    <input 
                    type="number" 
                    className="w-full p-3 border border-gray-300 rounded-full pl-8"
                    placeholder="0"
                    value={riskPercentage}
                    onChange={(e) => setRiskPercentage(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">%</span>
                    </div>
                </div>
                </div>
                
                <div>
                <label className="block text-sm font-medium mb-2">Stoploss (points)</label>
                <div className="relative">
                    <input 
                    type="number" 
                    className="w-full p-3 border border-gray-300 rounded-full"
                    placeholder="0"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    </div>
                </div>
                </div>
                
                <button
                    style={{
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        borderBottomRightRadius: 0,
                    }}
                    onClick={calculateResults}
                    className="w-full py-3 bg-green-500 text-white border border-green-500 font-medium rounded-xl hover:bg-green-600 transition-colors"
                >
                    Calculate
                </button>
                
                <div className="grid grid-cols-2 border border-gray-300 rounded overflow-hidden">
                    <button
                        className={`py-3 text-center ${riskTolerance === 'low' ? 'bg-gray-800 text-white border-2 border-green-500' : 'bg-gray-600 text-white'}`}
                        onClick={() => setRiskTolerance('low')}
                    >
                        Low Risk Tolerance
                    </button>
                    <button
                        className={`py-3 text-center ${riskTolerance === 'high' ? 'bg-gray-800 text-white border-2 border-green-500' : 'bg-gray-600 text-white'}`}
                        onClick={() => setRiskTolerance('high')}
                    >
                        High Risk Tolerance
                    </button>
                    <div className="col-span-2 bg-gray-600 text-white p-4">
                        {riskTolerance === 'low' ? (
                            <div dangerouslySetInnerHTML={{ __html: lowRiskRecommendation ? 
                                lowRiskRecommendation.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') : 
                                `Once you put in an account balance, we'll give you our recommended risk management style to use for your balance.`
                            }} />
                        ) : (
                            <div dangerouslySetInnerHTML={{ __html: highRiskRecommendation ? 
                                highRiskRecommendation.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') : 
                                `Once you put in an account balance, we'll give you our recommended risk management style to use for your balance.`
                            }} />
                        )}
                    </div>
                </div>
            </div>
            </div>
            
            <div className="w-full md:w-1/2">
            <div className="flex mb-8">
                <div className="w-1/2">
                <h3 className="text-xl font-semibold mb-4">Results</h3>
                
                <div className="space-y-6">
                    <div>
                    <p className="text-gray-600 mb-1">Amount at Risk</p>
                    <p className="font-bold">{amountAtRisk.toFixed(2)} {currency}</p>
                    </div>
                    
                    <div>
                    <p className="text-gray-600 mb-1">Position Size (units)</p>
                    <p className="font-bold">{positionSize.toFixed(0)}</p>
                    </div>
                    
                    <div>
                    <p className="text-gray-600 mb-1">Standard Lots</p>
                    <p className="font-bold">{standardLots.toFixed(2)}</p>
                    </div>
                    
                    <div>
                    <p className="text-gray-600 mb-1">Mini Lots</p>
                    <p className="font-bold">{miniLots.toFixed(2)}</p>
                    </div>
                    
                    <div>
                    <p className="text-gray-600 mb-1">Micro Lots</p>
                    <p className="font-bold">{microLots.toFixed(2)}</p>
                    </div>
                </div>
                </div>
                
                <div className="w-1/2">
                <img 
                    src="/images/photo_1.jpg" 
                    alt="Trading platform screenshot" 
                    className="rounded"
                />
                </div>
            </div>
            {/* Broker Recommendations */}
                <div className="mt-10">
                    <h3 className="text-xl font-semibold mb-6">Recommended Brokers</h3>
                    {renderBrokers()}
                </div>
            </div>
        </div>
        </div>
        <Footer />
    </div>
  );
}