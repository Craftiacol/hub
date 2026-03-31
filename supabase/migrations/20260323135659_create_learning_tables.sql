-- User Learning Events: tracks every user action for preference learning
CREATE TABLE IF NOT EXISTS public.user_learning_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User Preferences: aggregated patterns + learning brief
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_topics TEXT[] DEFAULT '{}',
  preferred_slide_count INT DEFAULT 5,
  preferred_position TEXT DEFAULT 'Bottom Center',
  draft_approval_rate FLOAT DEFAULT 0,
  avg_caption_edits FLOAT DEFAULT 0,
  caption_edit_style TEXT DEFAULT '',
  topic_history TEXT[] DEFAULT '{}',
  rejected_topics TEXT[] DEFAULT '{}',
  total_carousels INT DEFAULT 0,
  total_fixes INT DEFAULT 0,
  learning_brief TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_learning_events_user ON public.user_learning_events(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_events_type ON public.user_learning_events(event_type);
CREATE INDEX IF NOT EXISTS idx_learning_events_created ON public.user_learning_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_preferences_user ON public.user_preferences(user_id);

-- RLS
ALTER TABLE public.user_learning_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Users can only read/write their own events
CREATE POLICY "Users can insert own events"
  ON public.user_learning_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own events"
  ON public.user_learning_events FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can read/write their own preferences
CREATE POLICY "Users can read own preferences"
  ON public.user_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON public.user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON public.user_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Service role needs access for the learn.ts edge function
CREATE POLICY "Service role full access events"
  ON public.user_learning_events FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access preferences"
  ON public.user_preferences FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
