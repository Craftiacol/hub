-- User Learning System: event tracking + preference aggregation
-- Enables the AI to learn from user behavior and personalize content generation.

-- ── Events table: raw user actions ──
CREATE TABLE IF NOT EXISTS public.user_learning_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_learning_events_user ON public.user_learning_events(user_id, created_at DESC);
CREATE INDEX idx_learning_events_type ON public.user_learning_events(event_type);

-- ── Preferences table: aggregated patterns ──
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  preferred_topics TEXT[] DEFAULT '{}',
  rejected_topics TEXT[] DEFAULT '{}',
  topic_history TEXT[] DEFAULT '{}',
  preferred_slide_count INT DEFAULT 5,
  preferred_position TEXT DEFAULT 'Bottom Center',
  draft_approval_rate FLOAT DEFAULT 0,
  total_generations INT DEFAULT 0,
  total_approvals INT DEFAULT 0,
  total_regenerations INT DEFAULT 0,
  caption_edit_rate FLOAT DEFAULT 0,
  total_caption_edits INT DEFAULT 0,
  total_publishes INT DEFAULT 0,
  learning_brief TEXT DEFAULT '',
  brief_updated_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_user_preferences_user ON public.user_preferences(user_id);

-- ── RLS Policies ──
ALTER TABLE public.user_learning_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Events: users can insert and read their own events
CREATE POLICY "Users can insert own events" ON public.user_learning_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own events" ON public.user_learning_events
  FOR SELECT USING (auth.uid() = user_id);

-- Preferences: users can read and update their own preferences
CREATE POLICY "Users can read own preferences" ON public.user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON public.user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON public.user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Service role can do everything (for API aggregation)
CREATE POLICY "Service role full access events" ON public.user_learning_events
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access preferences" ON public.user_preferences
  FOR ALL USING (auth.role() = 'service_role');
