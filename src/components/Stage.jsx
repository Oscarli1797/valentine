export default function Stage({ children }) {
  return (
    <div className="stage">
      <div className="stage-inner">
        {children}
      </div>
    </div>
  );
}
