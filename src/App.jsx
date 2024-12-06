import { TiUserAdd, TiContacts } from "react-icons/ti";
import { FaBuildingFlag } from "react-icons/fa6";
import { useState } from "react";
import Candidate from "./Pages/Candidate/Candidate";

function App() {
  const [pageView, setPageView] = useState("candidate");

  return (
    <div className="py-4 bg-[#fcfafa]">
      <h5 className="text-lg text-slate-600 text-center mb-2">
        Welcome To Smart Recruiter
      </h5>
      <section className="flex items-center">
        <button
          onClick={() => setPageView("candidate")}
          className={`flex items-center gap-2 bg-[#e7e2e2] py-2 px-4 hover:bg-slate-100 duration-300 ${
            pageView == "candidate" && "bg-slate-100"
          }`}
        >
          <TiUserAdd size={20} />
          <p className="font-semibold tracking-wider">Candidate</p>
        </button>
        <button
          onClick={() => setPageView("contact")}
          className={`flex items-center gap-2 bg-[#e7e2e2] py-2 px-4 hover:bg-slate-100 duration-300 ${
            pageView == "contact" && "bg-slate-100"
          }`}
        >
          <TiContacts size={20} />
          <p className="font-semibold tracking-wider">Contact</p>
        </button>
        <button
          onClick={() => setPageView("company")}
          className={`flex items-center gap-2 bg-[#e7e2e2] py-2 px-4 hover:bg-slate-100 duration-300 ${
            pageView == "company" && "bg-slate-100"
          }`}
        >
          <FaBuildingFlag size={20} />
          <p className="font-semibold tracking-wider">Company</p>
        </button>
      </section>

      {pageView === "candidate" && <Candidate />}
    </div>
  );
}

export default App;
