import { useEffect, useState } from "react";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

const Candidate = () => {
  const [userImage, setUserImage] = useState(null);
  const [userName, setUserName] = useState(null);
  const [designation, setDesignation] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userPhone, setUserPhone] = useState(null);
  const [userAddress, setUserAddress] = useState(null);

  const fetchProfileData = async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const response = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => ({
          userImage: document.querySelector(".evi-image")?.innerText,
          userName: document.querySelector(".TZyLsYldvXqyzgZmRUyGRPWfylsk")
            ?.innerText,
          designation: document.querySelector(".text-body-medium")?.innerText,
          userEmail: document.querySelector(".pv-contact-info")?.innerText,
          userPhone: document.querySelector(".pv-contact-info")?.innerText,
          userAddress: document.querySelector(".pv-contact-info")?.innerText,
          jobs: Array.from(document.querySelectorAll(".job-card")).map(
            (job) => job.innerText
          ),
        }),
      });

      const data = response[0].result;
      setUserName(data.userName);
      setDesignation(data.designation);
      setUserEmail(data.userEmail);
      setUserPhone(data.userPhone);
      setUserAddress(data.userAddress);

      // const res = await axios.post("http://localhost:5000/api/users", data);
      // setStatus(res.data.message);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  return (
    <div className="p-2 space-y-4">
      <section className="p-3 border border-blue-700 rounded-md">
        <div className="inline text-blue-700 font-medium text-lg">
          We are checking if this user is in your CRM
        </div>
        <div className="inline-block w-1 h-1 ml-1 bg-blue-700 rounded-full animate-pulse"></div>
        <div className="inline-block w-1 h-1 ml-1 bg-blue-700 rounded-full animate-pulse"></div>
        <div className="inline-block w-1 h-1 ml-1 bg-blue-700 rounded-full animate-pulse"></div>
      </section>

      <div className="space-y-3">
        <div className="flex flex-col items-center gap-2">
          <img src={userImage} alt="" className="w-20 h-20 rounded-full" />
          <div className="text-center">
            <h4 className="text-lg font-medium text-gray-900">{userName}</h4>
            <h6 className="font-medium text-gray-700">{designation}</h6>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-4 p-2 bg-white shadow rounded-md">
            <MdEmail size={16} />
            <p className="text-base">{userEmail}</p>
          </div>
          <div className="flex items-center gap-4 p-2 bg-white shadow rounded-md">
            <FaPhoneAlt size={16} />
            <p className="text-base">{userPhone}</p>
          </div>
          <div className="flex items-center gap-4 p-2 bg-white shadow rounded-md">
            <FaLocationDot size={16} />
            <p className="text-base">{userAddress}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Candidate;
