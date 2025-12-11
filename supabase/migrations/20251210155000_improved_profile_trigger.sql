-- Improved trigger function that handles transaction timing and data validation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  user_type text;
  profile_role text;
  full_name text;
  phone text;
BEGIN
  -- Extract and validate user metadata
  user_type := COALESCE(new.raw_user_meta_data->>'user_type', 'customer');
  full_name := COALESCE(new.raw_user_meta_data->>'full_name', '');
  phone := COALESCE(new.raw_user_meta_data->>'phone', '');

  -- Map user_type to valid role values
  CASE user_type
    WHEN 'customer' THEN profile_role := 'customer';
    WHEN 'agent' THEN profile_role := 'agent';
    WHEN 'admin' THEN profile_role := 'admin';
    WHEN 'developer' THEN profile_role := 'developer';
    ELSE profile_role := 'customer';
  END CASE;

  -- Insert profile with proper error handling
  -- Use ON CONFLICT DO NOTHING to prevent duplicate key errors
  INSERT INTO public.profiles (
    id,
    full_name,
    phone,
    role,
    email_verified,
    created_at,
    updated_at
  ) VALUES (
    new.id,
    full_name,
    phone,
    profile_role,
    true,
    now(),
    now()
  )
  ON CONFLICT (id) DO NOTHING; -- Prevent duplicate profiles

  RETURN new;
EXCEPTION
  WHEN others THEN
    -- Log error but don't fail the user creation
    RAISE WARNING 'Failed to create profile for user %: %', new.id, SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also recreate the metadata update trigger
CREATE OR REPLACE FUNCTION public.handle_user_metadata_update()
RETURNS trigger AS $$
DECLARE
  user_type text;
  profile_role text;
  full_name text;
  phone text;
BEGIN
  -- Only update if metadata actually changed
  IF old.raw_user_meta_data IS DISTINCT FROM new.raw_user_meta_data THEN
    user_type := COALESCE(new.raw_user_meta_data->>'user_type', old.raw_user_meta_data->>'user_type');
    full_name := COALESCE(new.raw_user_meta_data->>'full_name', old.raw_user_meta_data->>'full_name');
    phone := COALESCE(new.raw_user_meta_data->>'phone', old.raw_user_meta_data->>'phone');

    -- Map user_type to valid role values
    CASE COALESCE(user_type, 'customer')
      WHEN 'customer' THEN profile_role := 'customer';
      WHEN 'agent' THEN profile_role := 'agent';
      WHEN 'admin' THEN profile_role := 'admin';
      WHEN 'developer' THEN profile_role := 'developer';
      ELSE profile_role := 'customer';
    END CASE;

    UPDATE public.profiles
    SET
      full_name = COALESCE(full_name, full_name),
      phone = COALESCE(phone, phone),
      role = COALESCE(profile_role, role),
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