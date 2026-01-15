-- Add username and monthly_budget columns to user_preferences
ALTER TABLE public.user_preferences 
ADD COLUMN username text,
ADD COLUMN monthly_budget numeric;

-- Add index for faster lookups
CREATE INDEX idx_user_preferences_username ON public.user_preferences(username);