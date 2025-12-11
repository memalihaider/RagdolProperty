-- Corrected trigger function for profile creation
-- This version handles potential issues with the trigger

-- First, ensure the function is properly created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  user_type text;
  full_name text;
  phone text;
BEGIN
  -- Extract user metadata safely
  user_type := COALESCE(new.raw_user_meta_data->>'user_type', 'customer');
  full_name := COALESCE(new.raw_user_meta_data->>'full_name', '');
  phone := COALESCE(new.raw_user_meta_data->>'phone', '');

  -- Insert profile with error handling
  BEGIN
    INSERT INTO public.profiles (id, full_name, phone, role, email_verified, created_at, updated_at)
    VALUES (
      new.id,
      full_name,
      phone,
      user_type,
      true,
      now(),
      now()
    );
  EXCEPTION
    WHEN others THEN
      -- Log error but don't fail the user creation
      RAISE WARNING 'Failed to create profile for user %: %', new.id, SQLERRM;
  END;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure trigger exists and is properly configured
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also update the metadata update trigger
CREATE OR REPLACE FUNCTION public.handle_user_metadata_update()
RETURNS trigger AS $$
DECLARE
  user_type text;
  full_name text;
  phone text;
BEGIN
  -- Only update if metadata actually changed
  IF old.raw_user_meta_data IS DISTINCT FROM new.raw_user_meta_data THEN
    user_type := COALESCE(new.raw_user_meta_data->>'user_type', old.raw_user_meta_data->>'user_type');
    full_name := COALESCE(new.raw_user_meta_data->>'full_name', old.raw_user_meta_data->>'full_name');
    phone := COALESCE(new.raw_user_meta_data->>'phone', old.raw_user_meta_data->>'phone');

    UPDATE public.profiles
    SET
      full_name = COALESCE(full_name, full_name),
      phone = COALESCE(phone, phone),
      role = COALESCE(user_type, role),
      updated_at = now()
    WHERE id = new.id;
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (old.raw_user_meta_data IS DISTINCT FROM new.raw_user_meta_data)
  EXECUTE FUNCTION public.handle_user_metadata_update();