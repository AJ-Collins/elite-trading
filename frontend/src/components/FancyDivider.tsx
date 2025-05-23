const FancyDivider = () => {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 mb-8">
        <div className="relative h-px">
          {/* Gradient from transparent to gray */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400 to-transparent">
            {/* Thicker middle section */}
            <div className="absolute left-1/4 right-1/4 top-0 bottom-0 bg-gradient-to-r from-transparent via-green-400 to-transparent h-1 -mt-0.5"></div>
          </div>
        </div>
      </div>
    );
  };
  
  export default FancyDivider;