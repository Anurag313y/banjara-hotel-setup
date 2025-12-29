-- Create table for job seekers (will appear in Occupied People)
CREATE TABLE public.job_seekers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    age INTEGER,
    location TEXT,
    job_profile TEXT NOT NULL,
    experience TEXT,
    phone TEXT NOT NULL,
    last_salary TEXT,
    expected_salary TEXT,
    photo_url TEXT,
    resume_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for businesses (will appear in Verified Resorts)
CREATE TABLE public.businesses (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    hotel_name TEXT NOT NULL,
    location TEXT,
    owner_name TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    logo_url TEXT,
    document_url TEXT,
    business_type TEXT NOT NULL, -- 'staff', 'kitchen', 'ccg'
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.job_seekers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- Public read policies (so data shows on homepage)
CREATE POLICY "Anyone can view job seekers" ON public.job_seekers FOR SELECT USING (true);
CREATE POLICY "Anyone can insert job seekers" ON public.job_seekers FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view businesses" ON public.businesses FOR SELECT USING (true);
CREATE POLICY "Anyone can insert businesses" ON public.businesses FOR INSERT WITH CHECK (true);

-- Create storage buckets for uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true);

-- Storage policies for public access
CREATE POLICY "Anyone can upload photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'photos');
CREATE POLICY "Anyone can view photos" ON storage.objects FOR SELECT USING (bucket_id = 'photos');

CREATE POLICY "Anyone can upload resumes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resumes');
CREATE POLICY "Anyone can view resumes" ON storage.objects FOR SELECT USING (bucket_id = 'resumes');

CREATE POLICY "Anyone can upload logos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'logos');
CREATE POLICY "Anyone can view logos" ON storage.objects FOR SELECT USING (bucket_id = 'logos');

CREATE POLICY "Anyone can upload documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents');
CREATE POLICY "Anyone can view documents" ON storage.objects FOR SELECT USING (bucket_id = 'documents');