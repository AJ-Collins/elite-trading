import { Download } from "lucide-react";
import { useState, useEffect } from "react";

export default function Curriculum() {
  const [curriculumData, setCurriculumData] = useState([
    { type: "Download timetable", file: "/downloads/timetable.pdf" },
    { type: "Beginners curriculum", file: "/downloads/beginners.pdf" },
    { type: "Intermediate curriculum", file: "/downloads/intermediate.pdf" },
    { type: "Advanced curriculum", file: "/downloads/advanced.pdf" },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurriculumData = async () => {
      try {
        setLoading(true);

        // Use the correct API endpoint for curricula
        const API_URL = "http://localhost:1337";
        const response = await fetch(`${API_URL}/api/curricula?populate=*`);

        if (!response.ok) {
          throw new Error(`Failed to fetch curriculum data: ${response.status}`);
        }

        const data = await response.json();
        console.log("Raw curriculum API response:", JSON.stringify(data, null, 2));

        if (data && data.data) {
          // Handle both array and single object responses
          const dataArray = Array.isArray(data.data) ? data.data : [data.data];

          const formattedData = dataArray.map((item) => {
            // Extract file URL from Strapi response
            let fileUrl = "#";
            if (item.file?.[0]?.url) {
              fileUrl = `${API_URL}${item.file[0].url}`;
            }

            return {
              type: item.type || "Download",
              file: fileUrl,
            };
          });

          console.log("Formatted curriculum data:", JSON.stringify(formattedData, null, 2));

          if (formattedData.length > 0) {
            setCurriculumData(formattedData);
          }
        } else {
          console.log("No valid curriculum data received, using fallback data:", JSON.stringify(curriculumData, null, 2));
        }
      } catch (error) {
        console.error("Error fetching curriculum data:", error);
        console.log("Using fallback curriculum data:", JSON.stringify(curriculumData, null, 2));
      } finally {
        setLoading(false);
      }
    };

    fetchCurriculumData();
  }, []);

  // Function to handle file downloads
  const handleDownload = (fileUrl, fileName) => {
    if (fileUrl === "#") {
      alert("Download file not available");
      return;
    }

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-65xl mx-auto px-8 py-0 mb-16">
      {/* Learning Curriculum Section */}
      <div className="mb-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Our learning curriculum</h1>
        <p className="text-gray-700 mb-8">
          Unlock the path to success with our comprehensive curriculum, designed to equip you with the skills and knowledge needed to excel in forex trading. Whether you're just starting out or looking to advance, our step-by-step modules cover everything from foundational concepts to advanced strategies. Take the first step toward mastering your future. Click the button below to download the curriculum now and begin your journey today!
        </p>
        <div className="flex flex-wrap md:flex-nowrap gap-4">
          {curriculumData.map((item, index) => (
            <div key={index} className="flex items-center">
              <a
                href={item.file}
                download
                style={{
                  backgroundColor: "rgb(0, 128, 0)",
                  borderColor: "rgb(0, 128, 0)",
                  borderBottomRightRadius: 0,
                }}
                className="hover:bg-white hover:text-black font-bold text-white px-6 py-3 font-medium transition-colors rounded-2xl opacity-70 inline-flex items-center text-sm gap-2"
                onClick={(e) => {
                  e.preventDefault(); // Prevent default anchor behavior
                  handleDownload(item.file, item.type);
                }}
              >
                <span>{item.type}</span>
                <Download size={16} />
              </a>
              {index < curriculumData.length - 1 && <div className="hidden md:block h-6 w-px bg-gray-400 mx-3" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}