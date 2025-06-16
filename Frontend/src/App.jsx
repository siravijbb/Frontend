import React, { useState, useEffect } from "react";
import logonav from "./assets/SIT30L.png";
import robot from "./assets/robot.png";
import sitlogo from "./assets/sitlogo.png";
import mockData from "../Backend/mockdata";
import { ChevronDown, Building2, GraduationCap } from "lucide-react";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);
  const [isDropdownAnimating, setIsDropdownAnimating] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState("SIT");
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [data, setData] = useState(null);
  const [alerts, setAlerts] = useState([]);

  const addAlert = (message) => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, message }]);
  };

  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const renderObjectEmoji = (object) => {
    switch (object.toLowerCase()) {
      case "banana":
        return "🍌";
      case "tv":
        return "📺";
      case "laptop":
        return "💻";
      case "coffee":
        return "☕";
      default:
        return "📦";
    }
  };

  const renderChairs = (peopleCount) => {
    const chairs = [];
    for (let i = 0; i < 4; i++) {
      chairs.push(
        <div
          key={i}
          className={`chair ${i < peopleCount ? "occupied" : "available"}`}
        ></div>
      );
    }
    return chairs;
  };

  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };
  useEffect(() => {
    setIsDropdownAnimating(true);
    const timer = setTimeout(() => setIsDropdownAnimating(false), 600);
    return () => clearTimeout(timer);
  }, [selectedBuilding]);

  useEffect(() => {
    // ให้ดึงข้อมูลใหม่
    const buildingData = mockData[selectedBuilding];

    // ถ้าเปลี่ยนจาก SIT เป็น LX ต้องปรับ default floor
    if (selectedBuilding === "LX" && selectedFloor < 10) {
      setSelectedFloor(10); // ตั้งค่า default floor สำหรับ LX
      return; // ออกจาก effect เพื่อรอการ re-render ด้วย floor ใหม่
    }

    // ถ้าเปลี่ยนจาก LX เป็น SIT ต้องปรับ default floor
    if (selectedBuilding === "SIT" && selectedFloor >= 10) {
      setSelectedFloor(1); // ตั้งค่า default floor สำหรับ SIT
      return; // ออกจาก effect เพื่อรอการ re-render ด้วย floor ใหม่
    }

    if (buildingData && buildingData[selectedFloor]) {
      setData(buildingData[selectedFloor]);
      console.log("Data updated for", selectedBuilding, "floor", selectedFloor);
    } else {
      console.warn(
        `No data found for ${selectedBuilding} floor ${selectedFloor}`
      );
      setData({ zones: [] }); // Fallback to empty data to avoid loading screen
    }
  }, [selectedBuilding, selectedFloor]); // ไม่ใส่dataในdependencyนะ!!!!!

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-gray-100 text-gray-800 font-sans">
      {/* Navbar */}
        <Navbar/>

      {/* Hero Section */}
      <section className="hero-section flex flex-col md:flex-row items-center justify-center py-16 px-6 bg-white relative overflow-hidden">
        <div className="absolute inset-0  animate-parallax"></div>
        <div className="absolute inset-0 particles"></div>
        <div className="md:w-1/2 p-8 animate-slide-in-left z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-400 mb-6 leading-tight">
            Seating Monitor System
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed animate-fade-in-delayed">
            ระบบตรวจสอบที่นั่งในอาคารเรียนรวมวิทยาการข้อมูล (SIT) และอาคาร LX
            <br />
            ติดตามสถานะที่นั่งแบบเรียลไทม์
            เพื่อการจัดการพื้นที่อย่างมีประสิทธิภาพ
          </p>
          <p className="text-sm md:text-base text-gray-500 animate-fade-in-delayed">
            พัฒนาโดยทีม SIT KMUTT เพื่อการเรียนรู้และทำงานที่สะดวกสบายยิ่งขึ้น
          </p>
        </div>
        <div className="md:w-1/2 p-8 flex justify-center animate-bounce z-10">
          <div className="relative">
            <img src={sitlogo} alt="SIT Logo" className="h-72 w-auto " />
            <div className="absolute inset-0 rounded-full  opacity-20 "></div>
          </div>
        </div>
      </section>

      {/* Building and Floor Selection */}
      <section className="flex flex-col items-center py-8 px-6 bg-white/80 backdrop-blur-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 animate-fade-in">
          เลือกอาคารและชั้น
        </h2>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
        <div className="relative">
  {/* Custom Select Button */}
  <div
    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
    onMouseEnter={() => setIsDropdownHovered(true)}
    onMouseLeave={() => setIsDropdownHovered(false)}
    className={`flex items-center justify-between w-full p-4 rounded-full cursor-pointer transition-all duration-500
              border border-white/40 shadow-lg
              ${isDropdownHovered ? 'shadow-xl' : 'shadow-md'} 
              ${isDropdownOpen ? 'bg-white/40' : 'bg-white/30'} 
              backdrop-blur-md group`}
  >
    <div className="flex items-center gap-3 pl-4">
      {selectedBuilding === 'SIT' ? (
        <Building2 className={`w-5 h-5 text-blue-600 transition-all duration-300 ${isDropdownAnimating ? 'rotate-12' : ''}`} />
      ) : (
        <GraduationCap className={`w-5 h-5 text-purple-600 transition-all duration-300 ${isDropdownAnimating ? 'rotate-12' : ''}`} />
      )}
      <span className="font-medium text-gray-800">
        {selectedBuilding === 'SIT' ? 'อาคาร SIT' : 'อาคาร LX'}
      </span>
    </div>
    <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform duration-300 mr-4 ${isDropdownOpen ? 'rotate-180' : ''}`} />
    
    {/* Decorative Glowing Effect */}
    <div className={`absolute inset-0 -z-10 bg-gradient-to-r 
                  ${selectedBuilding === 'SIT' 
                    ? 'from-blue-300/20 to-cyan-300/20' 
                    : 'from-purple-300/20 to-pink-300/20'} 
                  rounded-full blur-sm transition-opacity duration-500
                  ${isDropdownHovered ? 'opacity-100' : 'opacity-50'}`}>
    </div>
  </div>
  
  {/* Dropdown Options */}
  {isDropdownOpen && (
    <div className="absolute left-0 right-0 mt-2 rounded-xl overflow-hidden bg-red border border-white/40 shadow-xl z-100 transition-all duration-300 animate-fadeIn">
    <div 
      onClick={() => {
        setSelectedBuilding('SIT');
        setIsDropdownOpen(false);
      }}
      className={`flex items-center gap-3 p-4 cursor-pointer transition-all duration-200 hover:bg-blue-100/50 ${selectedBuilding === 'SIT' ? 'bg-blue-100/30' : ''}`}
    >
      <Building2 className="w-5 h-5 text-blue-600 ml-4" />
      <span className="font-medium text-gray-800">อาคาร SIT</span>
    </div>
    <div 
      onClick={() => {
        setSelectedBuilding('LX');
        setIsDropdownOpen(false);
      }}
      className={`flex items-center gap-3 p-4 cursor-pointer transition-all duration-200 hover:bg-purple-100/50 ${selectedBuilding === 'LX' ? 'bg-purple-100/30' : ''}`}
    >
      <GraduationCap className="w-5 h-5 text-purple-600 ml-4" />
      <span className="font-medium text-gray-800">อาคาร LX</span>
    </div>
  </div>
  )}
  
  {/* Ripple Animation */}
  {isDropdownAnimating && (
    <div className="absolute inset-0 -z-10">
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                    ${selectedBuilding === 'SIT' ? 'bg-blue-400/30' : 'bg-purple-400/30'} 
                    rounded-full w-4 h-4 animate-ping`}>
      </div>
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                    ${selectedBuilding === 'SIT' ? 'bg-blue-400/20' : 'bg-purple-400/20'} 
                    rounded-full w-8 h-8 animate-ping animation-delay-100`}>
      </div>
    </div>
  )}
</div>
          <div className="flex flex-wrap justify-center gap-3">
            {selectedBuilding === "SIT"
              ? [1, 2, 3, 4].map((floor) => (
                  <button
                    key={floor}
                    onClick={() => setSelectedFloor(floor)}
                    className={`px-6 py-2 rounded-full text-gray-700 bg-white/30 backdrop-blur-md border border-gray-200/50 hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-50 hover:text-blue-600 transition-all duration-300 glassmorphism ${
                      selectedFloor === floor
                        ? "border-gradient glow-selected slide-border selected"
                        : ""
                    }`}
                  >
                    ชั้น {floor}
                  </button>
                ))
              : [10, 11, 12, 13].map((floor) => (
                  <button
                    key={floor}
                    onClick={() => setSelectedFloor(floor)}
                    className={`px-6 py-2 rounded-full text-gray-700 bg-white/30 backdrop-blur-md border border-gray-200/50 hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-50 hover:text-blue-600 transition-all duration-300 glassmorphism ${
                      selectedFloor === floor
                        ? "border-gradient glow-selected slide-border selected"
                        : ""
                    }`}
                  >
                    ชั้น {floor}
                  </button>
                ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-3xl font-bold text-gray-800 mb-6 animate-fade-in" style={{width:"100%", marginLeft:"12%"}}>
           <h1>{selectedBuilding === 'SIT' ? 'SIT' : 'LX'}</h1>
        </div>
       
        {data ? (
          <div className="data-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl w-full">
            {data.zones.map((zone, index) => (
              <div
                key={index}
                className="desk bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 ease-in-out transform hover:-translate-y-3 hover:scale-105 card glassmorphism"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img
                  src={robot}
                  alt="Robot Icon"
                  className="h-16 mx-auto mb-4 transition-transform hover:scale-110 glow-effect"
                />
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  {zone.name}
                </h2>
                <p className="text-gray-600">
                  <strong>People:</strong> {zone.people || "None"}
                </p>
                {/* <p className="text-gray-600">
                  <strong>Objects:</strong>{" "}
                  {zone.objects.length > 0
                    ? zone.objects
                        .map((obj) => renderObjectEmoji(obj))
                        .join(", ")
                    : "None"}
                </p> */}
                <p className="text-gray-600">
                  <strong>Date & Time:</strong>{" "}
                  {new Date(zone.date_time).toUTCString()}
                </p>
                <div className="chair-container flex justify-around mt-4">
                  {renderChairs(zone.people)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="loader flex items-center justify-center">
            <span className="loader__element"></span>
            <span className="loader__element"></span>
            <span className="loader__element"></span>
          </div>
        )}

        {/* Alerts */}
        <div className="alert-container fixed top-6 right-6 flex flex-col gap-4 z-50">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="alert bg-red-500 text-white p-4 rounded-lg shadow-lg flex justify-between items-center animate-slide-in glassmorphism"
            >
              <span>{alert.message}</span>
              <button
                onClick={() => removeAlert(alert.id)}
                className="close-button text-xl"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#336699] text-white p-8 text-center shadow-inner">
        <div className="flex justify-center mb-4">
          <img
            src={logonav}
            alt="SIT Logo"
            className="h-12 transition-opacity hover:opacity-80"
          />
        </div>
        <p className="mb-2 text-sm">School of Information Technology</p>
        <p className="mb-2 text-sm">
          King Mongkut's University of Technology Thonburi
        </p>
        <p className="mb-4 text-sm">
          Empowering Boundless Digital Transformation
        </p>
        <div className="flex justify-center space-x-4 text-sm">
          <a
            href="tel:+6624709850"
            className="hover:text-blue-300 transition-colors"
          >
            +66 2470 9850
          </a>
          <a
            href="mailto:webadmin@sit.kmutt.ac.th"
            className="hover:text-blue-300 transition-colors"
          >
            webadmin@sit.kmutt.ac.th
          </a>
          <a href="#" className="hover:text-blue-300 transition-colors">
            SIT Family
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
