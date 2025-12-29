import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, Building2, X } from "lucide-react";
import { toast } from "sonner";
import { cloud as supabase } from "@/lib/cloudClient";


interface BusinessFormProps {
  title: string;
  subtitle: string;
  documentLabel: string;
  businessType: string;
}

const BusinessForm = ({ title, subtitle, documentLabel, businessType }: BusinessFormProps) => {
  const navigate = useNavigate();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    logo: null as File | null,
    hotelName: "",
    location: "",
    ownerName: "",
    contactNumber: "",
    document: null as File | null,
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, logo: file });
      const reader = new FileReader();
      reader.onload = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, document: file });
    }
  };

  const uploadFile = async (file: File, bucket: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);
    
    if (error) throw error;
    
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);
    
    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.hotelName || !formData.contactNumber || !formData.ownerName || !formData.document) {
      toast.error("Please fill in all required fields including the document");
      return;
    }

    setIsSubmitting(true);

    try {
      let logoUrl = null;
      let documentUrl = null;

      // Upload logo if provided
      if (formData.logo) {
        logoUrl = await uploadFile(formData.logo, 'logos');
      }

      // Upload document
      if (formData.document) {
        documentUrl = await uploadFile(formData.document, 'documents');
      }

      // Insert into database
      const { error } = await supabase.from('businesses').insert({
        hotel_name: formData.hotelName,
        location: formData.location || null,
        owner_name: formData.ownerName,
        contact_number: formData.contactNumber,
        logo_url: logoUrl,
        document_url: documentUrl,
        business_type: businessType,
      });

      if (error) throw error;

      toast.success("Requirement submitted successfully!");
      navigate("/success");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit requirement. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header 
        className="sticky top-0 z-50 backdrop-blur-sm border-b border-white/10"
        style={{ backgroundColor: "#5a2aa0" }}
      >
        <div className="px-4 py-4 flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/home")}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-display font-semibold text-white">{title}</h1>
            <p className="text-sm" style={{ color: "rgb(253, 239, 52)" }}>{subtitle}</p>
          </div>
        </div>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6 pb-32">
        {/* Logo Upload */}
        <div className="flex flex-col items-center gap-4">
          <div 
            className="w-28 h-28 rounded-2xl border-2 border-dashed border-primary/30 flex items-center justify-center overflow-hidden bg-secondary cursor-pointer hover:border-primary transition-colors"
            onClick={() => logoInputRef.current?.click()}
          >
            {logoPreview ? (
              <div className="relative w-full h-full">
                <img src={logoPreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLogoPreview(null);
                    setFormData({ ...formData, logo: null });
                  }}
                  className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <Building2 className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          <Label className="text-sm text-muted-foreground">Upload Hotel Photo / Logo</Label>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="hidden"
          />
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hotelName">Hotel Name *</Label>
            <Input
              id="hotelName"
              placeholder="Enter Hotel Name"
              value={formData.hotelName}
              onChange={(e) => setFormData({ ...formData, hotelName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="City, State"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerName">Owner Name *</Label>
            <Input
              id="ownerName"
              placeholder="Enter owner's name"
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactNumber">Contact Number *</Label>
            <Input
              id="contactNumber"
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
            />
          </div>

          {/* Document Upload */}
          <div className="space-y-2">
            <Label>{documentLabel} *</Label>
            <div
              className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => docInputRef.current?.click()}
            >
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              {formData.document ? (
                <p className="text-sm text-primary font-medium">{formData.document.name}</p>
              ) : (
                <p className="text-sm text-muted-foreground">Tap to upload PDF/Image (Required)</p>
              )}
            </div>
            <input
              ref={docInputRef}
              type="file"
              accept=".pdf,image/*"
              onChange={handleDocChange}
              className="hidden"
            />
          </div>
        </div>
      </form>

      {/* Sticky Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/50 p-4">
        <Button 
          type="submit" 
          variant="hero" 
          size="xl" 
          className="w-full" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Requirement"}
        </Button>
      </div>
    </div>
  );
};

export const StaffForm = () => (
  <BusinessForm
    title="Looking For Staff"
    subtitle="Submit your requirement"
    documentLabel="Upload Staff Requirement Document"
    businessType="staff"
  />
);

export const KitchenForm = () => (
  <BusinessForm
    title="Looking For Kitchen Equipment"
    subtitle="Submit your requirement"
    documentLabel="Upload Equipment Requirement Document"
    businessType="kitchen"
  />
);

export const CCGForm = () => (
  <BusinessForm
    title="Looking For CCG"
    subtitle="Cutlery, Crockery & Glassware"
    documentLabel="Upload CCG Requirement Document"
    businessType="ccg"
  />
);

export default BusinessForm;
