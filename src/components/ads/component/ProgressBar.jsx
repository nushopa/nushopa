const ProgressBar = ({ duration }) => (
  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/20 z-10 overflow-hidden">
    <div
      className="h-full bg-white/70"
      style={{ animation: `adsProgress ${duration}ms linear forwards` }}
    />
    <style>{`
      @keyframes adsProgress {
        from { width: 0% }
        to   { width: 100% }
      }
    `}</style>
  </div>
);

export default ProgressBar;