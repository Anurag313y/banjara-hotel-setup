import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import hotelIllustration from "@/assets/hotel-illustration.png";

const EntryScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Top Image Section - Full image, no purple overlay */}
      <div className="flex-1 relative flex items-start justify-center">
        <div className="relative w-full">
          <img
            src={hotelIllustration}
            alt="Hotel management illustration"
            style={{
              animationDelay: "0.1s",
              animationFillMode: "forwards"
            }}
            className="w-full h-auto object-cover opacity-0 animate-fade-in"
          />
          {/* Gradient Overlay - fades from transparent to purple going downward */}
          <div
            className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, transparent 0%, #5a2aa0 100%)"
            }}
          />
        </div>
      </div>

      {/* Bottom Content Section - Purple background */}
      <div 
        className="relative px-6 pb-10 pt-6 space-y-6 z-10"
        style={{ backgroundColor: "#5a2aa0" }}
      >
        <div className="space-y-1 text-center relative z-10">
          <h1
            className="text-3xl md:text-4xl font-display font-bold italic opacity-0 animate-fade-up leading-tight"
            style={{
              animationDelay: "0.3s",
              animationFillMode: "forwards",
              color: "rgba(252, 236, 54, 1)"
            }}
          >
            Welcome
          </h1>
          <h1
            className="text-3xl md:text-4xl font-display font-bold italic opacity-0 animate-fade-up leading-tight"
            style={{
              animationDelay: "0.35s",
              animationFillMode: "forwards",
              color: "rgba(252, 236, 54, 1)"
            }}
          >
            To
          </h1>
          <h1
            className="text-2xl md:text-3xl font-display font-bold italic opacity-0 animate-fade-up leading-tight"
            style={{
              animationDelay: "0.4s",
              animationFillMode: "forwards",
              color: "rgba(252, 236, 54, 1)"
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
