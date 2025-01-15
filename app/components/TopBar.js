const TopBar = ({ score }) => {
    return (
      <div className="flex pt-9 justify-between items-center px-36 text-white">
        <button className="px-5 font-game py-3 ml-10 rounded-xl bg-[#FFCF40] text-xl font-semibold hover:bg-[#FEBC33] text-black ">
          Back
        </button>
        <h1 className="text-5xl pl-28 font-modern text-white font-semibold [text-shadow:10px_10px_black] [--webkit-text-stroke:10px_black]">FinPlay</h1>
        <div className="flex gap-4">
          <div className="px-5 py-3 font-game mr-10 rounded-xl bg-[#FFCF40] text-black border-2 border-black text-xl font-semibold">
            Score: {score}
          </div>
          <button className="px-5 font-game py-3 mr-10 rounded-xl text-black bg-[#FFCF40] text-xl font-semibold hover:bg-[#FEBC33]">
            Info
          </button>
        </div>
      </div>
    );
  };
  
  export default TopBar;
  