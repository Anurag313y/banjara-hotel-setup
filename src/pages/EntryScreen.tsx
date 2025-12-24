import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroIllustration from "@/assets/hero-illustration.png";
const EntryScreen = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen flex flex-col bg-background">
      {/* Hero Image Section */}
      <div className="flex-1 relative overflow-hidden">
        <img src={heroIllustration} alt="Luxury hotel entrance" style={{
        animationDelay: "0.1s",
        animationFillMode: "forwards"
      }} className="w-full h-full object-cover opacity-0 animate-fade-in shadow-none" />
        {/* Image fades downward */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent via-[#4b5763]/50 to-[#4b5763] z-10" />
      </div>

      {/* Content Section */}
      <div className="px-6 pb-10 space-y-6 relative z-20 bg-[#4b5763]">
        <div className="space-y-3 text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold opacity-0 animate-fade-up" style={{
          animationDelay: "0.3s",
          animationFillMode: "forwards",
          color: "#fdef34"
        }}>
            Welcome To Banjara
          </h1>
          <p className="text-lg font-display opacity-0 animate-fade-up" style={{
          animationDelay: "0.4s",
          animationFillMode: "forwards",
          color: "#c4a866"
        }}>
            Set Up My Hotel
          </p>
        </div>

        <p style={{
        animationDelay: "0.5s",
        animationFillMode: "forwards"
      }} className="text-center leading-relaxed max-w-sm mx-auto opacity-0 animate-fade-up text-sidebar-border">
          Transform your Resort, Hotel, Restaurant, Cafe, Kiosk or Bar into a professionally managed hospitality business.
        </p>

        <div className="pt-4 opacity-0 animate-fade-up" style={{
        animationDelay: "0.6s",
        animationFillMode: "forwards"
      }}>
          <Button onClick={() => navigate("/home")} variant="hero" size="xl" className="w-full">
            Next
          </Button>
        </div>
      </div>
    </div>;
};
export default EntryScreen;