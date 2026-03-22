CREATE TYPE public.pipeline_stage AS ENUM ('lead', 'contacted', 'proposal', 'negotiation', 'won', 'lost');

CREATE TABLE public.pipeline_deals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  value NUMERIC(12, 2),
  currency TEXT DEFAULT 'USD',
  stage public.pipeline_stage DEFAULT 'lead' NOT NULL,
  probability INTEGER DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
  expected_close_date DATE,
  notes TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.pipeline_deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own deals"
  ON public.pipeline_deals FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_pipeline_deals_user_id ON public.pipeline_deals(user_id);
CREATE INDEX idx_pipeline_deals_stage ON public.pipeline_deals(stage);

-- Shared updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER pipeline_deals_updated_at BEFORE UPDATE ON public.pipeline_deals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
