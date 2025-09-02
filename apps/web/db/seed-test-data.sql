-- Test data for DadConnect
-- This creates some sample groups and meetups for testing

-- First, let's create a test user profile (you'll need to replace this with actual user IDs)
-- For now, we'll use a placeholder UUID that you can replace with real user IDs

-- Sample Dad Groups
INSERT INTO dad_groups (id, name, description, category, topics, city, state, visibility, member_count, created_by) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'New Dads Support Group',
  'A supportive community for first-time fathers navigating the challenges and joys of parenthood.',
  'support',
  ARRAY['new fathers', 'parenting tips', 'sleep training', 'work-life balance'],
  'San Francisco',
  'CA',
  'public',
  15,
  '11111111-1111-1111-1111-111111111111'
),
(
  '22222222-2222-2222-2222-222222222222',
  'Bay Area Adventure Dads',
  'Join us for hiking, camping, and outdoor adventures with our kids!',
  'activities',
  ARRAY['hiking', 'camping', 'outdoor activities', 'family adventures'],
  'San Francisco',
  'CA',
  'public',
  23,
  '11111111-1111-1111-1111-111111111111'
),
(
  '33333333-3333-3333-3333-333333333333',
  'Single Dads Unite',
  'Support and community for single fathers raising their children.',
  'support',
  ARRAY['single parenting', 'custody', 'co-parenting', 'financial planning'],
  'Oakland',
  'CA',
  'public',
  8,
  '11111111-1111-1111-1111-111111111111'
),
(
  '44444444-4444-4444-4444-444444444444',
  'SF Tech Dads',
  'For dads working in tech - discussing work-life balance, remote work, and raising kids in the digital age.',
  'interests',
  ARRAY['technology', 'remote work', 'work-life balance', 'digital parenting'],
  'San Francisco',
  'CA',
  'public',
  31,
  '11111111-1111-1111-1111-111111111111'
),
(
  '55555555-5555-5555-5555-555555555555',
  'East Bay Sports Dads',
  'Organizing pickup games, coaching youth sports, and staying active with our kids.',
  'sports',
  ARRAY['basketball', 'soccer', 'baseball', 'youth coaching'],
  'Berkeley',
  'CA',
  'public',
  19,
  '11111111-1111-1111-1111-111111111111'
),
(
  '66666666-6666-6666-6666-666666666666',
  'New Dad Support Group',
  'A safe space for new dads to share experiences, ask questions, and support each other through the journey of fatherhood.',
  'support',
  ARRAY['new dad', 'support', 'mental health', 'fatherhood'],
  'San Francisco',
  'CA',
  'public',
  45,
  '11111111-1111-1111-1111-111111111111'
),
(
  '77777777-7777-7777-7777-777777777777',
  'Tech Dad Hackers',
  'Dads who work in tech sharing tips on work-life balance, remote work, and teaching kids about technology.',
  'interests',
  ARRAY['technology', 'coding', 'remote work', 'STEM education'],
  'San Francisco',
  'CA',
  'public',
  28,
  '11111111-1111-1111-1111-111111111111'
),
(
  '88888888-8888-8888-8888-888888888888',
  'Outdoor Adventure Dads',
  'Hiking, camping, fishing, and outdoor activities with our kids. Building memories in nature.',
  'activities',
  ARRAY['hiking', 'camping', 'fishing', 'outdoor activities'],
  'Oakland',
  'CA',
  'public',
  22,
  '11111111-1111-1111-1111-111111111111'
),
(
  '99999999-9999-9999-9999-999999999999',
  'Single Dad Network',
  'Support and resources for single dads navigating custody, co-parenting, and raising kids solo.',
  'support',
  ARRAY['single dad', 'custody', 'co-parenting', 'support'],
  'San Jose',
  'CA',
  'public',
  35,
  '11111111-1111-1111-1111-111111111111'
),
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Bay Area Dad Book Club',
  'Monthly book discussions about parenting, personal development, and great reads to share with our kids.',
  'interests',
  ARRAY['books', 'reading', 'parenting', 'personal development'],
  'Palo Alto',
  'CA',
  'public',
  18,
  '11111111-1111-1111-1111-111111111111'
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Cooking with Kids Dads',
  'Sharing recipes, cooking tips, and fun ways to get kids involved in the kitchen.',
  'activities',
  ARRAY['cooking', 'recipes', 'kids activities', 'family meals'],
  'Fremont',
  'CA',
  'public',
  24,
  '11111111-1111-1111-1111-111111111111'
);

-- Sample Meetups
INSERT INTO meetups (id, group_id, created_by, title, description, activity_type, location, address, city, state, start_time, end_time, max_attendees, current_attendees, status) VALUES
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'Family Hike at Muir Woods',
  'Join us for a family-friendly hike through the redwoods. Perfect for kids 5+ with moderate difficulty.',
  'outdoor',
  'Muir Woods National Monument',
  '1 Muir Woods Rd, Mill Valley, CA 94941',
  'Mill Valley',
  'CA',
  '2024-01-15 10:00:00+00',
  '2024-01-15 14:00:00+00',
  12,
  8,
  'upcoming'
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '11111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'New Dad Coffee Meetup',
  'Weekly coffee meetup for new dads to share experiences and get support.',
  'coffee',
  'Blue Bottle Coffee',
  '66 Mint St, San Francisco, CA 94103',
  'San Francisco',
  'CA',
  '2024-01-12 09:00:00+00',
  '2024-01-12 11:00:00+00',
  8,
  5,
  'upcoming'
),
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  '55555555-5555-5555-5555-555555555555',
  '11111111-1111-1111-1111-111111111111',
  'Weekend Basketball Game',
  'Pickup basketball game for dads and their kids (ages 8+). Bring water and snacks!',
  'sports',
  'Berkeley High School Gym',
  '1980 Allston Way, Berkeley, CA 94704',
  'Berkeley',
  'CA',
  '2024-01-14 15:00:00+00',
  '2024-01-14 17:00:00+00',
  16,
  12,
  'upcoming'
),
(
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  '44444444-4444-4444-4444-444444444444',
  '11111111-1111-1111-1111-111111111111',
  'Tech Dads Happy Hour',
  'Monthly happy hour for tech dads to network and discuss work-life balance.',
  'other',
  'The View Lounge',
  '780 Mission St, San Francisco, CA 94103',
  'San Francisco',
  'CA',
  '2024-01-18 18:00:00+00',
  '2024-01-18 20:00:00+00',
  20,
  15,
  'upcoming'
),
(
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  'Single Dads Support Group Meeting',
  'Monthly support group meeting for single fathers. Childcare provided.',
  'other',
  'Community Center',
  '123 Main St, Oakland, CA 94601',
  'Oakland',
  'CA',
  '2024-01-20 10:00:00+00',
  '2024-01-20 12:00:00+00',
  15,
  6,
  'upcoming'
);

-- Add some group members (you'll need to replace user IDs with real ones)
INSERT INTO group_members (group_id, user_id, role) VALUES
('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'owner'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'owner'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'owner'),
('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'owner'),
('55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'owner');

-- Add some meetup attendees
INSERT INTO meetup_attendees (meetup_id, user_id, status) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'going'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'going'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'going'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', 'going'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-111111111111', 'going');

-- Sample Group Messages/Discussions
INSERT INTO group_messages (id, group_id, user_id, content, message_type) VALUES
-- New Dad Support Group messages
('msg-001', '66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'Hey everyone! New dad here with a 3-month-old. Any tips for getting through the sleep deprivation?', 'text'),
('msg-002', '66666666-6666-6666-6666-666666666666', '22222222-2222-2222-2222-222222222222', 'Welcome! The first few months are tough but it gets better. Try to sleep when the baby sleeps, even during the day.', 'text'),
('msg-003', '66666666-6666-6666-6666-666666666666', '33333333-3333-3333-3333-333333333333', 'I found that establishing a bedtime routine early really helped. Bath, book, bottle, bed - the 4 Bs!', 'text'),

-- Tech Dad Hackers messages
('msg-004', '77777777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', 'Anyone else struggling with work-life balance while working from home with kids?', 'text'),
('msg-005', '77777777-7777-7777-7777-777777777777', '44444444-4444-4444-4444-444444444444', 'I set up a dedicated workspace and use noise-canceling headphones. Also, communicate your schedule with your partner.', 'text'),
('msg-006', '77777777-7777-7777-7777-777777777777', '55555555-5555-5555-5555-555555555555', 'Teaching my 8-year-old to code with Scratch. Any other coding resources for kids?', 'text'),

-- Outdoor Adventure Dads messages
('msg-007', '88888888-8888-8888-8888-888888888888', '11111111-1111-1111-1111-111111111111', 'Planning a family camping trip this weekend. Any kid-friendly campgrounds in the Bay Area?', 'text'),
('msg-008', '88888888-8888-8888-8888-888888888888', '22222222-2222-2222-2222-222222222222', 'Big Basin Redwoods State Park is great for families. The trails are easy and the redwoods are amazing!', 'text'),
('msg-009', '88888888-8888-8888-8888-888888888888', '33333333-3333-3333-3333-333333333333', 'Don''t forget to pack extra snacks and layers. Kids get cold and hungry quickly outdoors!', 'text'),

-- Single Dad Network messages
('msg-010', '99999999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111', 'Looking for advice on co-parenting communication. How do you handle scheduling conflicts?', 'text'),
('msg-011', '99999999-9999-9999-9999-999999999999', '44444444-4444-4444-4444-444444444444', 'I use a shared calendar app with my ex. It helps keep everyone on the same page.', 'text'),
('msg-012', '99999999-9999-9999-9999-999999999999', '55555555-5555-5555-5555-555555555555', 'Remember to take care of yourself too. Self-care isn''t selfish when you''re a single parent.', 'text'),

-- Bay Area Dad Book Club messages
('msg-013', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'This month we''re reading "The Whole-Brain Child" by Daniel Siegel. Anyone started it yet?', 'text'),
('msg-014', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Just finished chapter 3. The concept of "upstairs brain" vs "downstairs brain" is really helpful!', 'text'),
('msg-015', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'Meeting this Saturday at 2 PM at the Palo Alto Library. Can''t wait to discuss!', 'text'),

-- Cooking with Kids Dads messages
('msg-016', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Made pizza with my 5-year-old last night. Messy but so much fun! Any other kid-friendly recipes?', 'text'),
('msg-017', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 'Try making homemade pasta! Kids love rolling out the dough and cutting shapes.', 'text'),
('msg-018', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555', 'Smoothie bowls are a hit in our house. Let them pick their own toppings!', 'text');
