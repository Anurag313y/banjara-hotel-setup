import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroIllustration from "@/assets/hero-illustration.png";

const EntryScreen = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(to bottom, #7b3fc9, #5a2aa0)" }}>
      {/* Hero Image Section */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center pt-4 px-4">
        <img 
          src={heroIllustration} 
          alt="Luxury hotel entrance" 
          style={{
            animationDelay: "0.1s",
            animationFillMode: "forwards"
          }} 
          className="w-full max-w-md h-auto object-contain opacity-0 animate-fade-in shadow-none" 
        />
      </div>

      {/* Content Section */}
      <div className="px-6 pb-10 pt-6 space-y-6 relative z-20">
        <div className="space-y-2 text-center">
          <h1 
            className="text-3xl md:text-4xl font-display font-bold italic opacity-0 animate-fade-up" 
            style={{
              animationDelay: "0.3s",
              animationFillMode: "forwards",
              color: "rgba(252, 236, 54, 1)"
            }}
          >
            Welcome
          </h1>
          <h1 
            className="text-3xl md:text-4xl font-display font-bold italic opacity-0 animate-fade-up" 
            style={{
              animationDelay: "0.35s",
              animationFillMode: "forwards",
              color: "rgba(252, 236, 54, 1)"
            }}
          >
            To
          </h1>
          <h1 
            className="text-3xl md:text-4xl font-display font-bold italic opacity-0 animate-fade-up" 
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
            color: "rgba(200, 200, 220, 0.9)"
          }} 
          className="text-center leading-relaxed max-w-sm mx-auto opacity-0 animate-fade-up text-base"
        >
          Transform your Resort, Hotel, Restaurant, Cafe, Kiosk or Bar into a professionally managed hospitality business.
        </p>

        <div 
          className="pt-4 opacity-0 animate-fade-up" 
          style={{
            animationDelay: "0.6s",
            animationFillMode: "forwards"
          }}
        >
          <Button 
            onClick={() => navigate("/home")} 
            size="xl" 
            className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-full shadow-lg"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EntryScreen;
