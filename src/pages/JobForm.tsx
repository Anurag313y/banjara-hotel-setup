import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, Camera, X } from "lucide-react";
import { toast } from "sonner";
import { cloud as supabase } from "@/lib/cloudClient";


const JobForm = () => {
  const navigate = useNavigate();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    photo: null as File | null,
    fullName: "",
    age: "",
    location: "",
    jobProfile: "",
    experience: "",
    phone: "",
    lastSalary: "",
    expectedSalary: "",
    resume: null as File | null,
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setFormData({ ...formData, photo: file });
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_DOCUMENT_SIZE) {
        toast.error("Resume size must be less than 10MB");
        return;
      }
      setFormData({ ...formData, resume: file });
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
    
    if (!formData.fullName || !formData.phone || !formData.jobProfile || !formData.resume) {
      toast.error("Please fill in all required fields including resume");
      return;
    }

    // Validate age (must be 18+)
    if (formData.age) {
      const age = parseInt(formData.age);
      if (isNaN(age) || age < 18) {
        toast.error("Age must be 18 or older");
        return;
      }
    }

    // Validate experience (must be non-negative)
    if (formData.experience) {
      const experience = parseInt(formData.experience);
      if (isNaN(experience) || experience < 0) {
        toast.error("Work experience cannot be negative");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      let photoUrl = null;
      let resumeUrl = null;

      // Upload photo if provided
      if (formData.photo) {
        photoUrl = await uploadFile(formData.photo, 'photos');
      }

      // Upload resume
      if (formData.resume) {
        resumeUrl = await uploadFile(formData.resume, 'resumes');
      }

      // Insert into database
      const { error } = await supabase.from('job_seekers').insert({
        full_name: formData.fullName,
        age: formData.age ? parseInt(formData.age) : null,
        location: formData.location || null,
        job_profile: formData.jobProfile,
        experience: formData.experience || null,
        phone: formData.phone,
        last_salary: formData.lastSalary || null,
        expected_salary: formData.expectedSalary || null,
        photo_url: photoUrl,
        resume_url: resumeUrl,
      });

      if (error) throw error;

      toast.success("Application submitted successfully!");
      navigate("/success");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit application. Please try again.");
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
            <h1 className="text-lg font-display font-semibold text-white">Looking For Job</h1>
            <p className="text-sm" style={{ color: "rgb(253, 239, 52)" }}>Submit your profile</p>
          </div>
        </div>
      </header>

      {/* Form - Single Column */}
      <form onSubmit={handleSubmit} className="px-5 py-6 space-y-5 pb-32 max-w-lg mx-auto">
        {/* Photo Upload */}
        <div className="flex flex-col items-center gap-3">
          <div 
            className="w-24 h-24 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center overflow-hidden bg-secondary cursor-pointer hover:border-primary transition-colors"
            onClick={() => photoInputRef.current?.click()}
          >
            {photoPreview ? (
              <div className="relative w-full h-full">
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhotoPreview(null);
                    setFormData({ ...formData, photo: null });
                  }}
                  className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <Camera className="w-7 h-7 text-muted-foreground" />
            )}
          </div>
          <Label className="text-xs text-muted-foreground">Upload Professional Photo</Label>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </div>

        {/* Form Fields - Single Column */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              placeholder="e.g. 25"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
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
            <Label htmlFor="jobProfile">Job Profile *</Label>
            <Input
              id="jobProfile"
              placeholder="Enter your job profile (e.g. Chef, Manager)"
              value={formData.jobProfile}
              onChange={(e) => setFormData({ ...formData, jobProfile: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Work Experience (Years)</Label>
            <Input
              id="experience"
              type="number"
              placeholder="e.g. 3"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastSalary">Last In-Hand Salary (₹/month)</Label>
            <Input
              id="lastSalary"
              type="number"
              placeholder="e.g. 25000"
              value={formData.lastSalary}
              onChange={(e) => setFormData({ ...formData, lastSalary: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedSalary">Expected Salary (₹/month)</Label>
            <Input
              id="expectedSalary"
              type="number"
              placeholder="e.g. 30000"
              value={formData.expectedSalary}
              onChange={(e) => setFormData({ ...formData, expectedSalary: e.target.value })}
            />
          </div>

          {/* Resume Upload */}
          <div className="space-y-2">
            <Label>Upload Resume (PDF) *</Label>
            <div
              className="border-2 border-dashed border-border rounded-xl p-5 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => resumeInputRef.current?.click()}
            >
              <Upload className="w-7 h-7 mx-auto text-muted-foreground mb-2" />
              {formData.resume ? (
                <p className="text-sm text-primary font-medium">{formData.resume.name}</p>
              ) : (
                <p className="text-sm text-muted-foreground">Tap to upload PDF (Required)</p>
              )}
            </div>
            <input
              ref={resumeInputRef}
              type="file"
              accept=".pdf"
              onChange={handleResumeChange}
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
          className="w-full max-w-lg mx-auto block" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
    </div>
  );
};

export default JobForm;
