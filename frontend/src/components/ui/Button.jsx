export const Button = ({ children, onClick, variant = 'primary', disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform active:scale-95 focus:outline-none
      ${
        variant === 'primary'
          ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-md hover:shadow-violet-500/50 focus:ring-2 focus:ring-violet-500/50'
          : 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 shadow-md hover:shadow-gray-500/20 focus:ring-2 focus:ring-gray-600/50'
      } 
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `}
  >
    {children}
  </button>
);
