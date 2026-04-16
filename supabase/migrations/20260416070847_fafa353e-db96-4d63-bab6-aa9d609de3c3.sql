
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Create dramas table
CREATE TABLE public.dramas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  platform TEXT DEFAULT '',
  total_episodes INTEGER DEFAULT 16,
  episodes_watched INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'plan-to-watch',
  cover_image TEXT DEFAULT '',
  actors TEXT DEFAULT '',
  favorite_quote TEXT DEFAULT '',
  favorite_quotes JSONB DEFAULT '[]'::jsonb,
  plot TEXT DEFAULT '',
  what_i_liked TEXT DEFAULT '',
  review TEXT DEFAULT '',
  rating INTEGER DEFAULT 0,
  tags JSONB DEFAULT '[]'::jsonb,
  emotional_tags JSONB DEFAULT '[]'::jsonb,
  favorite_characters TEXT DEFAULT '',
  favorite_songs TEXT DEFAULT '',
  second_lead_syndrome BOOLEAN DEFAULT false,
  is_favorite BOOLEAN DEFAULT false,
  watching_images JSONB DEFAULT '[]'::jsonb,
  watched_with_glassimo BOOLEAN DEFAULT false,
  glassimo_review TEXT DEFAULT '',
  tmdb_id INTEGER,
  cast_data JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.dramas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own dramas" ON public.dramas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own dramas" ON public.dramas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own dramas" ON public.dramas FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own dramas" ON public.dramas FOR DELETE USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_dramas_updated_at BEFORE UPDATE ON public.dramas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
