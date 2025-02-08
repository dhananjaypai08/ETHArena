export const Card = ({ children, glowing = false }) => (
  <div
    className={`
      bg-gray-900 rounded-2xl p-6 shadow-md transition-all duration-300 relative overflow-hidden border
      ${glowing ? 'border-violet-500/40 shadow-violet-500/30' : 'border-gray-800 shadow-gray-700/20'}
      hover:border-violet-500/50 hover:shadow-violet-500/20
    `}
  >
    {glowing && (
      <div className="absolute inset-0 bg-violet-500 opacity-10 blur-2xl rounded-2xl"></div>
    )}
    <div className="relative z-10">{children}</div>
  </div>
);
