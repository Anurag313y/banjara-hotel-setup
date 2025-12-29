import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import img1Min from "@/assets/img1-min.png";

const EntryScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-b from-[#5a9bb8] via-[#6b7db8] to-[#5a2aa0]">
      {/* Top Image Section with Fade */}
      <div className="flex-1 relative flex items-start justify-center pt-8 px-4">
        <div className="relative w-full max-w-md">
          <img
            src={img1Min}
            alt="Hotel management illustration"
            style={{
              animationDelay: "0.1s",
              animationFillMode: "forwards"
            }}
            className="w-full h-auto object-contain opacity-0 animate-fade-in"
          />
          {/* Gradient Overlay for smooth fade - fades from transparent to purple */}
          <div
            className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, transparent 0%, rgba(90, 42, 160, 0.3) 50%, rgba(90, 42, 160, 0.8) 100%)"
            }}
          />
        </div>
      </div>

      {/* Bottom Content Section with Fade */}
      <div className="relative px-6 pb-10 pt-2 space-y-6 z-10">
        {/* Top fade overlay for smooth transition from image */}
        <div
          className="absolute inset-x-0 top-0 h-24 pointer-events-none -mt-24"
          style={{
            background: "linear-gradient(to top, rgba(90, 42, 160, 0.95) 0%, rgba(90, 42, 160, 0.4) 70%, transparent 100%)"
          }}
        />

        <div className="space-y-2 text-center relative z-10">
          <h1
            className="text-3xl md:text-4xl font-display font-bold italic opacity-0 animate-fade-up leading-tight"
            style={{
              animationDelay: "0.3s",
              animationFillMode: "forwards",
              color: "#fcec36"
            }}
          >
            Welcome
          </h1>
          <h1
            className="text-3xl md:text-4xl font-display font-bold italic opacity-0 animate-fade-up leading-tight"
            style={{
              animationDelay: "0.35s",
              animationFillMode: "forwards",
              color: "#fcec36"
            }}
          >
            To
          </h1>
          <h1
            className="text-2xl md:text-3xl font-display font-bold italic opacity-0 animate-fade-up leading-tight"
            style={{
              animationDelay: "0.4s",
              animationFillMode: "forwards",
              color: "#fcec36"
            }}
          >
            Banjara Set-up My Hotel
          </h1>
        </div>

        <p
          style={{
            animationDelay: "0.5s",
            animationFillMode: "forwards",
            color: "rgba(220, 220, 240, 0.95)"
          }}
          className="text-center leading-relaxed max-w-sm mx-auto opacity-0 animate-fade-up text-base px-2"
        >
          Transform your Resort, Hotel, Restaurant, Cafe, Kiosk or Bar into a professionally managed hospitality business.
        </p>

        <div
          className="pt-4 opacity-0 animate-fade-up max-w-md mx-auto"
          style={{
            animationDelay: "0.6s",
            animationFillMode: "forwards"
          }}
        >
          <Button
            onClick={() => navigate("/home")}
            size="xl"
            className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-full shadow-lg text-lg"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EntryScreen;
