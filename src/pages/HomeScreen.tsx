import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

import banjaraLogo from "@/assets/banjara-logo.png";
import jobReceptionist from "@/assets/job-receptionist.jpeg";
import staffIllustration from "@/assets/staff-illustration.png";
import kitchenIllustration from "@/assets/kitchen-illustration.png";
import ccgIllustration from "@/assets/ccg-illustration.png";

interface CategoryCardProps {
  title: string;
  description: string;
  image: string;
  path: string;
  bgColor: string;
  delay: string;
}

const CategoryCard = ({ title, description, image, path, bgColor, delay }: CategoryCardProps) => {
  const navigate = useNavigate();

  return (
    <div 
      className={`rounded-2xl py-5 px-4 cursor-pointer group animate-fade-up h-[130px] ${bgColor}`}
      style={{ animationDelay: delay }}
      onClick={() => navigate(path)}
    >
      <div className="flex items-center gap-3 h-full">
        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-1">
          <div>
            <h3 className="text-sm font-semibold text-foreground leading-tight">{title}</h3>
            <p className="text-xs text-muted-foreground leading-snug mt-0.5">{description}</p>
          </div>
          <Button 
            variant="default" 
            size="sm" 
            className="h-6 px-2 py-1 text-xs rounded-full text-white w-fit"
            style={{ backgroundColor: "#5a2aa0" }}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};

interface PersonCardProps {
  name: string;
  image: string;
}

const PersonCard = ({ name, image }: PersonCardProps) => (
  <div className="flex flex-col items-center gap-2 min-w-[100px]">
    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
      <img src={image} alt={name} className="w-full h-full object-cover" />
    </div>
    <span 
      className="text-xs font-medium text-white px-3 py-1.5 rounded-full text-center flex items-center justify-center w-[90px] h-[32px] whitespace-nowrap overflow-hidden text-ellipsis"
      style={{ backgroundColor: "#5a2aa0" }}
    >
      {name}
    </span>
  </div>
);

interface ResortCardProps {
  name: string;
  logo: string;
}

const ResortCard = ({ name, logo }: ResortCardProps) => (
  <div className="flex flex-col items-center gap-2 min-w-[100px]">
    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
      <img src={logo} alt={name} className="w-full h-full object-cover" />
    </div>
    <span 
      className="text-xs font-medium text-white px-3 py-1.5 rounded-full text-center flex items-center justify-center w-[90px] h-[32px] whitespace-nowrap overflow-hidden text-ellipsis"
      style={{ backgroundColor: "#5a2aa0" }}
    >
      {name}
    </span>
  </div>
);

interface JobSeeker {
  id: string;
  full_name: string;
  photo_url: string | null;
}

interface Business {
  id: string;
  hotel_name: string;
  logo_url: string | null;
}

const HomeScreen = () => {
  const occupiedRef = useRef<HTMLDivElement>(null);
  const resortsRef = useRef<HTMLDivElement>(null);
  
  const [jobSeekers, setJobSeekers] = useState<JobSeeker[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);

  useEffect(() => {
    // Fetch job seekers
    const fetchJobSeekers = async () => {
      const { data, error } = await supabase
        .from('job_seekers')
        .select('id, full_name, photo_url')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setJobSeekers(data);
      }
    };

    // Fetch businesses
    const fetchBusinesses = async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('id, hotel_name, logo_url')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setBusinesses(data);
      }
    };

    fetchJobSeekers();
    fetchBusinesses();
  }, []);

  const categories = [
    {
      title: "Looking For Job ?",
      description: "Actively seeking new employment opportunities in hospitality.",
      image: jobReceptionist,
      path: "/apply/job",
      bgColor: "bg-purple-100",
    },
    {
      title: "Looking For Staff ?",
      description: "Recruiting talented individuals for your hospitality business.",
      image: staffIllustration,
      path: "/apply/staff",
      bgColor: "bg-green-100",
    },
    {
      title: "Looking For Kitchen Equipment ?",
      description: "Premium kitchen solutions tailored to your culinary needs.",
      image: kitchenIllustration,
      path: "/apply/kitchen",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Looking For CCG ?",
      description: "Cutlery, Crockery & Glassware for enhanced dining experience.",
      image: ccgIllustration,
      path: "/apply/ccg",
      bgColor: "bg-orange-100",
    },
  ];

  // Default placeholder people if no job seekers in database
  const defaultPeople = [
    { name: "Pankaj Namdev", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
    { name: "Kiran Yadav", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face" },
    { name: "Nisha", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" },
    { name: "Rahul Singh", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face" },
  ];

  // Default placeholder resorts if no businesses in database
  const defaultResorts = [
    { name: "Swaram", logo: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=150&h=150&fit=crop" },
    { name: "Rudraksh", logo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=150&h=150&fit=crop" },
    { name: "Bagicha", logo: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=150&h=150&fit=crop" },
    { name: "Palm Resort", logo: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=150&h=150&fit=crop" },
  ];

  // Combine database data with defaults
  const occupiedPeople = jobSeekers.length > 0 
    ? jobSeekers.map(js => ({
        name: js.full_name,
        image: js.photo_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      }))
    : defaultPeople;

  const verifiedResorts = businesses.length > 0
    ? businesses.map(b => ({
        name: b.hotel_name,
        logo: b.logo_url || "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=150&h=150&fit=crop"
      }))
    : defaultResorts;

  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -150 : 150;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Professional Header */}
      <header 
        className="px-4 py-4 animate-fade-up shadow-lg mb-4" 
        style={{ 
          animationDelay: "0.1s",
          backgroundColor: "#5a2aa0"
        }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <img src={banjaraLogo} alt="Banjara" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-display font-bold text-white leading-tight tracking-wide">Banjara</h1>
            <p className="text-sm text-purple-200 font-medium">Set Up My Hotel</p>
          </div>
        </div>
      </header>

      {/* Category Cards */}
      <main className="px-4 pb-4 space-y-2.5">
        {categories.map((category, index) => (
          <CategoryCard
            key={category.path}
            {...category}
            delay={`${0.15 + index * 0.08}s`}
          />
        ))}
      </main>

      {/* Divider */}
      <div className="flex justify-center gap-1 py-3">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
        ))}
      </div>

      {/* Occupied People Section */}
      <section className="px-4 pb-4 animate-fade-up" style={{ animationDelay: "0.5s" }}>
        <div className="bg-amber-50/90 border border-amber-100/70 rounded-2xl p-4">
          <div className="text-center mb-3">
            <h2 className="text-base font-semibold text-foreground mb-0.5">Occupied People</h2>
            <p className="text-xs text-muted-foreground">
              Engaged individuals managing multiple responsibilities.
            </p>
          </div>
          <div className="relative">
            <button 
              onClick={() => scroll(occupiedRef, 'left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div 
              ref={occupiedRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide py-2 px-8"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {occupiedPeople.map((person, index) => (
                <PersonCard key={`${person.name}-${index}`} {...person} />
              ))}
            </div>
            <button 
              onClick={() => scroll(occupiedRef, 'right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Verified Resorts Section */}
      <section className="px-4 pb-6 animate-fade-up" style={{ animationDelay: "0.6s" }}>
        <div className="bg-blue-50/90 border border-blue-100/70 rounded-2xl p-4">
          <div className="text-center mb-3">
            <h2 className="text-base font-semibold text-foreground mb-0.5">Verified Resorts</h2>
            <p className="text-xs text-muted-foreground">
              Discover peace of mind with verified resorts.
            </p>
          </div>
          <div className="relative">
            <button 
              onClick={() => scroll(resortsRef, 'left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div 
              ref={resortsRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide py-2 px-8"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {verifiedResorts.map((resort, index) => (
                <ResortCard key={`${resort.name}-${index}`} {...resort} />
              ))}
            </div>
            <button 
              onClick={() => scroll(resortsRef, 'right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;
