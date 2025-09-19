const BlobBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div
        className="
          absolute
          w-[20vw] h-[20vw]
          opacity-70 blur-3xl mix-blend-multiply
          roaming-blob
        "
      />
    </div>
  );
};

export default BlobBackground;
