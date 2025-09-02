-- DadConnect Seed Data - Dad Community Focus

-- Insert sample profiles
INSERT INTO profiles (id, name, avatar_url, city, state, bio, interests, kids_ages) VALUES
('11111111-1111-1111-1111-111111111111', 'Mike Johnson', null, 'Austin', 'TX', 'Dad of two amazing kids. Love football, outdoor activities, and connecting with other dads.', ARRAY['football', 'outdoor activities', 'tech', 'cooking'], ARRAY['5-8', '9-12']),
('22222222-2222-2222-2222-222222222222', 'David Chen', null, 'Austin', 'TX', 'New dad navigating fatherhood. Always looking for advice and support from experienced dads.', ARRAY['new dad', 'support', 'reading', 'coffee'], ARRAY['0-1']),
('33333333-3333-3333-3333-333333333333', 'James Rodriguez', null, 'Austin', 'TX', 'Tech dad trying to balance work and family. Love hiking and outdoor adventures with my kids.', ARRAY['tech', 'hiking', 'work-life balance', 'photography'], ARRAY['2-4', '5-8']),
('44444444-4444-4444-4444-444444444444', 'Robert Kim', null, 'Austin', 'TX', 'Sports enthusiast and dad of three. Organizing watch parties and outdoor activities for dads.', ARRAY['football', 'basketball', 'sports', 'grilling'], ARRAY['2-4', '5-8', '9-12']),
('55555555-5555-5555-5555-555555555555', 'Chris Thompson', null, 'Austin', 'TX', 'Outdoor adventure dad. Love camping, fishing, and teaching my kids about nature.', ARRAY['camping', 'fishing', 'outdoor', 'nature'], ARRAY['5-8', '9-12']);

-- Insert sample dad groups
INSERT INTO dad_groups (id, name, description, category, topics, city, state, visibility, member_count, created_by) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Austin Dads Support', 'Support group for dads in Austin area. Share experiences, get advice, and build friendships.', 'support', ARRAY['parenting', 'support', 'local'], 'Austin', 'TX', 'public', 24, '11111111-1111-1111-1111-111111111111'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Football Dads', 'Dads who love football and watching games together. Join us for watch parties and game discussions!', 'sports', ARRAY['football', 'sports', 'watch parties'], null, null, 'public', 18, '44444444-4444-4444-4444-444444444444'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'New Dad Network', 'Support for new dads navigating fatherhood. Ask questions, share tips, and connect with other new dads.', 'support', ARRAY['new dad', 'support', 'advice'], null, null, 'public', 32, '22222222-2222-2222-2222-222222222222'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Outdoor Adventures', 'Dads who love outdoor activities with their kids. Hiking, camping, fishing, and more!', 'activities', ARRAY['outdoor', 'hiking', 'camping', 'fishing'], 'Austin', 'TX', 'public', 15, '55555555-5555-5555-5555-555555555555'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Tech Dads', 'Dads working in tech sharing experiences about work-life balance and raising kids in the digital age.', 'interests', ARRAY['tech', 'work-life balance', 'digital parenting'], null, null, 'public', 28, '33333333-3333-3333-3333-333333333333');

-- Insert group members
INSERT INTO group_members (group_id, user_id, role) VALUES
-- Austin Dads Support members
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'owner'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'member'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'member'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'member'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 'member'),

-- Football Dads members
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 'owner'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'member'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 'member'),

-- New Dad Network members
('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'owner'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'member'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 'member'),

-- Outdoor Adventures members
('dddddddd-dddd-dddd-dddd-dddddddddddd', '55555555-5555-5555-5555-555555555555', 'owner'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', 'member'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333', 'member'),

-- Tech Dads members
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333', 'owner'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-111111111111', 'member'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222', 'member');

-- Insert sample group messages
INSERT INTO group_messages (group_id, author_id, content, message_type) VALUES
-- Austin Dads Support messages
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Welcome to Austin Dads Support! This is a safe space for dads to share experiences and support each other.', 'text'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Thanks for creating this group! As a new dad, I really appreciate having a community to turn to.', 'text'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'Anyone have tips for balancing work and family time? I feel like I\'m always behind on something.', 'text'),

-- Football Dads messages
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 'NFL season is back! Who\'s ready for some Sunday watch parties?', 'text'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'I\'m in! My place has a big TV and plenty of space for the kids to play.', 'text'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 'Count me in too! I can bring snacks and drinks.', 'text'),

-- New Dad Network messages
('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'Hey fellow new dads! How are you all handling the sleep deprivation?', 'text'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'It gets better! The first few months are tough, but you\'ll find your rhythm.', 'text'),

-- Outdoor Adventures messages
('dddddddd-dddd-dddd-dddd-dddddddddddd', '55555555-5555-5555-5555-555555555555', 'Planning a family camping trip to Pedernales Falls. Anyone interested in joining?', 'text'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', 'That sounds amazing! My kids love camping. When are you thinking?', 'text'),

-- Tech Dads messages
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333', 'How do you all handle screen time with your kids? Finding the right balance is tough.', 'text'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-111111111111', 'We use parental controls and set specific times. It\'s a constant negotiation though!', 'text');

-- Insert sample meetups
INSERT INTO meetups (id, group_id, created_by, title, description, activity_type, location, address, city, state, start_time, end_time, max_attendees, current_attendees, status) VALUES
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 'NFL Sunday Watch Party', 'Come watch the game with fellow dads! Bring snacks and drinks. Kids welcome - we\'ll have a play area set up.', 'watch_party', 'Mike\'s House', '123 Main St, Austin, TX', 'Austin', 'TX', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days' + INTERVAL '4 hours', 12, 5, 'upcoming'),
('gggggggg-gggg-gggg-gggg-gggggggggggg', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '55555555-5555-5555-5555-555555555555', 'Dad & Kids Playground Meetup', 'Bring your kids to the playground for some fun and dad bonding. We\'ll have snacks and drinks.', 'playdate', 'Zilker Park Playground', '2100 Barton Springs Rd, Austin, TX', 'Austin', 'TX', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days' + INTERVAL '2 hours', 15, 8, 'upcoming'),
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Morning Coffee & Support', 'Weekly coffee meetup for dads to share experiences and support each other. No kids this time - just dads.', 'coffee', 'Local Coffee Shop', '456 Oak Ave, Austin, TX', 'Austin', 'TX', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days' + INTERVAL '1 hour', null, 12, 'upcoming'),
('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', null, '33333333-3333-3333-3333-333333333333', 'Tech Dads Networking', 'Monthly meetup for dads in tech to network and discuss work-life balance. Bring business cards!', 'other', 'WeWork Austin', '789 Tech Blvd, Austin, TX', 'Austin', 'TX', NOW() + INTERVAL '14 days', NOW() + INTERVAL '14 days' + INTERVAL '2 hours', 20, 6, 'upcoming');

-- Insert meetup attendees
INSERT INTO meetup_attendees (meetup_id, user_id, status) VALUES
-- NFL Watch Party attendees
('ffffffff-ffff-ffff-ffff-ffffffffffff', '44444444-4444-4444-4444-444444444444', 'going'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', '11111111-1111-1111-1111-111111111111', 'going'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', '33333333-3333-3333-3333-333333333333', 'going'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', '22222222-2222-2222-2222-222222222222', 'maybe'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', '55555555-5555-5555-5555-555555555555', 'going'),

-- Playground Meetup attendees
('gggggggg-gggg-gggg-gggg-gggggggggggg', '55555555-5555-5555-5555-555555555555', 'going'),
('gggggggg-gggg-gggg-gggg-gggggggggggg', '11111111-1111-1111-1111-111111111111', 'going'),
('gggggggg-gggg-gggg-gggg-gggggggggggg', '33333333-3333-3333-3333-333333333333', 'going'),
('gggggggg-gggg-gggg-gggg-gggggggggggg', '22222222-2222-2222-2222-222222222222', 'going'),
('gggggggg-gggg-gggg-gggg-gggggggggggg', '44444444-4444-4444-4444-444444444444', 'going'),

-- Coffee Meetup attendees
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '11111111-1111-1111-1111-111111111111', 'going'),
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '22222222-2222-2222-2222-222222222222', 'going'),
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '33333333-3333-3333-3333-333333333333', 'going'),
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '44444444-4444-4444-4444-444444444444', 'going'),
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '55555555-5555-5555-5555-555555555555', 'going'),

-- Tech Networking attendees
('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '33333333-3333-3333-3333-333333333333', 'going'),
('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '11111111-1111-1111-1111-111111111111', 'going'),
('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '22222222-2222-2222-2222-222222222222', 'going'),
('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '44444444-4444-4444-4444-444444444444', 'maybe'),
('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '55555555-5555-5555-5555-555555555555', 'going');

-- Create helper functions for member count updates
CREATE OR REPLACE FUNCTION increment_group_member_count(group_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE dad_groups 
  SET member_count = member_count + 1 
  WHERE id = group_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_group_member_count(group_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE dad_groups 
  SET member_count = GREATEST(member_count - 1, 0) 
  WHERE id = group_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_meetup_attendee_count(meetup_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE meetups 
  SET current_attendees = (
    SELECT COUNT(*) 
    FROM meetup_attendees 
    WHERE meetup_attendees.meetup_id = meetups.id 
    AND status = 'going'
  )
  WHERE id = meetup_id;
END;
$$ LANGUAGE plpgsql;