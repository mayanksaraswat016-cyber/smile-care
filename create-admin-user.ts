import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vtayqrvuinkfjoftwvtb.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0YXlxcnZ1aW5rZmpvZnR3dnRiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzMwNjc2MiwiZXhwIjoyMDkyODgyNzYyfQ.3p9DydKUXDmnP0YFCTl-chfU1vOnZ6RNaBgGdk7Rsxs';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function confirmAdminUser() {
  try {
    // List all users to find the admin user
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError.message);
      return;
    }

    const adminUser = users.find(u => u.email === 'admin@smilecare.com');
    
    if (!adminUser) {
      console.log('❌ Admin user not found. Creating new user...');
      
      // Create the user with auto-confirm
      const { data, error } = await supabase.auth.admin.createUser({
        email: 'admin@smilecare.com',
        password: '123456789',
        email_confirm: true,
      });

      if (error) {
        console.error('Error creating admin user:', error.message);
      } else {
        console.log('✅ Admin user created and confirmed successfully!');
        console.log('Email:', data.user?.email);
        console.log('User ID:', data.user?.id);
      }
    } else {
      console.log('✅ Admin user found:', adminUser.email);
      const isConfirmed = !!adminUser.email_confirmed_at;
      console.log('Email confirmed:', isConfirmed);
      
      if (!isConfirmed) {
        // Update user to confirm email
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          adminUser.id,
          { email_confirm: true }
        );

        if (updateError) {
          console.error('Error confirming email:', updateError.message);
        } else {
          console.log('✅ Email confirmed successfully!');
        }
      } else {
        console.log('✅ Email is already confirmed.');
      }
    }

    // Test sign in
    console.log('\nTesting sign in...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'admin@smilecare.com',
      password: '123456789',
    });

    if (signInError) {
      console.error('❌ Sign in failed:', signInError.message);
    } else {
      console.log('✅ Sign in successful! Admin can now login.');
    }
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

confirmAdminUser();
