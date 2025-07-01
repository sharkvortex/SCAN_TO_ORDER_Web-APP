import { MdOutlineFastfood } from "react-icons/md";
import DataList from "../components/DataList";
import CallEmployee from "../components/CallEmployee";

function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto max-w-4xl pb-10">
        <div className="relative flex transform flex-col items-center justify-center rounded-b-4xl bg-gradient-to-r from-blue-500 to-blue-600 py-8">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm">
            <MdOutlineFastfood className="text-5xl text-white" />
          </div>
          <h1 className="mt-6 mb-2 text-3xl font-bold tracking-tight text-white">
            สั่งอาหารออนไลน์
          </h1>
          <p className="mb-6 max-w-md text-center text-blue-100">
            สั่งอาหารอร่อยๆ ได้ง่ายๆ ในไม่กี่คลิก
          </p>
          <CallEmployee />
        </div>

        <div className="px-4">
          <DataList />
        </div>

        <button className="focus:ring-opacity-50 fixed right-6 bottom-6 transform rounded-full bg-blue-600 p-4 text-white shadow-lg transition-all hover:scale-105 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
      </div>
    </main>
  );
}

export default Home;
