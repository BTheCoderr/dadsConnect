import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase-server"

export async function POST() {
  try {
    const supabase = await getSupabaseServerClient()
    
    // Sample groups data
    const groups = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        name: 'Providence New Dads',
        description: 'A supportive community for new dads in Providence navigating the early stages of fatherhood.',
        category: 'support',
        topics: ['new dad', 'support', 'sleep training', 'feeding'],
        city: 'Providence',
        state: 'RI',
        visibility: 'public',
        member_count: 42,
        created_by: '11111111-1111-1111-1111-111111111111'
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        name: 'Warwick Sports Dads',
        description: 'Organizing pickup games, coaching youth sports, and staying active with our kids.',
        category: 'sports',
        topics: ['basketball', 'soccer', 'baseball', 'youth coaching'],
        city: 'Warwick',
        state: 'RI',
        visibility: 'public',
        member_count: 19,
        created_by: '11111111-1111-1111-1111-111111111111'
      },
      {
        id: '66666666-6666-6666-6666-666666666666',
        name: 'New Dad Support Group',
        description: 'A safe space for new dads to share experiences, ask questions, and support each other through the journey of fatherhood.',
        category: 'support',
        topics: ['new dad', 'support', 'mental health', 'fatherhood'],
        city: 'Providence',
        state: 'RI',
        visibility: 'public',
        member_count: 45,
        created_by: '11111111-1111-1111-1111-111111111111'
      },
      {
        id: '77777777-7777-7777-7777-777777777777',
        name: 'Tech Dad Hackers',
        description: 'Dads who work in tech sharing tips on work-life balance, remote work, and teaching kids about technology.',
        category: 'interests',
        topics: ['technology', 'coding', 'remote work', 'STEM education'],
        city: 'Providence',
        state: 'RI',
        visibility: 'public',
        member_count: 28,
        created_by: '11111111-1111-1111-1111-111111111111'
      },
      {
        id: '88888888-8888-8888-8888-888888888888',
        name: 'Outdoor Adventure Dads',
        description: 'Hiking, camping, fishing, and outdoor activities with our kids. Building memories in nature.',
        category: 'activities',
        topics: ['hiking', 'camping', 'fishing', 'outdoor activities'],
        city: 'Warwick',
        state: 'RI',
        visibility: 'public',
        member_count: 22,
        created_by: '11111111-1111-1111-1111-111111111111'
      },
      {
        id: '99999999-9999-9999-9999-999999999999',
        name: 'Single Dad Network',
        description: 'Support and resources for single dads navigating custody, co-parenting, and raising kids solo.',
        category: 'support',
        topics: ['single dad', 'custody', 'co-parenting', 'support'],
        city: 'Providence',
        state: 'RI',
        visibility: 'public',
        member_count: 35,
        created_by: '11111111-1111-1111-1111-111111111111'
      },
      {
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        name: 'Warwick Dad Book Club',
        description: 'Monthly book discussions about parenting, personal development, and great reads to share with our kids.',
        category: 'interests',
        topics: ['books', 'reading', 'parenting', 'personal development'],
        city: 'Warwick',
        state: 'RI',
        visibility: 'public',
        member_count: 18,
        created_by: '11111111-1111-1111-1111-111111111111'
      },
      {
        id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        name: 'Cooking with Kids Dads',
        description: 'Sharing recipes, cooking tips, and fun ways to get kids involved in the kitchen.',
        category: 'activities',
        topics: ['cooking', 'recipes', 'kids activities', 'family meals'],
        city: 'Providence',
        state: 'RI',
        visibility: 'public',
        member_count: 24,
        created_by: '11111111-1111-1111-1111-111111111111'
      }
    ]

    // Insert groups
    const { data: insertedGroups, error: groupsError } = await supabase
      .from('dad_groups')
      .upsert(groups, { onConflict: 'id' })
      .select()

    if (groupsError) {
      console.error('Error inserting groups:', groupsError)
      return NextResponse.json({ error: 'Failed to insert groups' }, { status: 500 })
    }

    // Sample messages data
    const messages = [
      {
        id: 'msg-001',
        group_id: '66666666-6666-6666-6666-666666666666',
        user_id: '11111111-1111-1111-1111-111111111111',
        content: 'Hey everyone! New dad here with a 3-month-old. Any tips for getting through the sleep deprivation?',
        message_type: 'text'
      },
      {
        id: 'msg-002',
        group_id: '66666666-6666-6666-6666-666666666666',
        user_id: '22222222-2222-2222-2222-222222222222',
        content: 'Welcome! The first few months are tough but it gets better. Try to sleep when the baby sleeps, even during the day.',
        message_type: 'text'
      },
      {
        id: 'msg-003',
        group_id: '66666666-6666-6666-6666-666666666666',
        user_id: '33333333-3333-3333-3333-333333333333',
        content: 'I found that establishing a bedtime routine early really helped. Bath, book, bottle, bed - the 4 Bs!',
        message_type: 'text'
      },
      {
        id: 'msg-004',
        group_id: '77777777-7777-7777-7777-777777777777',
        user_id: '11111111-1111-1111-1111-111111111111',
        content: 'Anyone else struggling with work-life balance while working from home with kids?',
        message_type: 'text'
      },
      {
        id: 'msg-005',
        group_id: '77777777-7777-7777-7777-777777777777',
        user_id: '44444444-4444-4444-4444-444444444444',
        content: 'I set up a dedicated workspace and use noise-canceling headphones. Also, communicate your schedule with your partner.',
        message_type: 'text'
      }
    ]

    // Insert messages
    const { data: insertedMessages, error: messagesError } = await supabase
      .from('group_messages')
      .upsert(messages, { onConflict: 'id' })
      .select()

    if (messagesError) {
      console.error('Error inserting messages:', messagesError)
      return NextResponse.json({ error: 'Failed to insert messages' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      groups: insertedGroups?.length || 0,
      messages: insertedMessages?.length || 0
    })

  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
