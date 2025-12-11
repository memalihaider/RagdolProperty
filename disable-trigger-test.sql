-- Temporarily disable the trigger to test if signup works without it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Test signup without trigger
-- If this works, then the issue is with the trigger function