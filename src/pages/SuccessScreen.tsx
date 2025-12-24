import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Home } from "lucide-react";

const SuccessScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      <div 
        className="w-24 h-24 rounded-full bg-sage-light flex items-center justify-center mb-8 opacity-0 animate-scale-in"
        style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
      >
        <CheckCircle2 className="w-12 h-12 text-sage" />
      </div>

      <h1 
        className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4 opacity-0 animate-fade-up"
        style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
      >
        Thank You!
      </h1>

      <p 
        className="text-lg text-muted-foreground mb-2 opacity-0 animate-fade-up"
        style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
      >
        Your requirement has been submitted successfully.
      </p>

      <p 
        className="text-muted-foreground mb-10 opacity-0 animate-fade-up"
        style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
      >
        Our team will contact you shortly.
      </p>

      <div 
        className="opacity-0 animate-fade-up w-full max-w-xs"
        style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}
      >
        <Button 
          onClick={() => navigate("/home")} 
          variant="secondary" 
          size="lg" 
          className="w-full"
        >
          <Home className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default SuccessScreen;
