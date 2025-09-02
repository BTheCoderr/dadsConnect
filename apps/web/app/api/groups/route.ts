import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'
import { DadGroup } from '@dadsconnect/shared'

export async function GET(req: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    
    // Allow public access to view groups (no authentication required)

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const city = searchParams.get('city')
    const state = searchParams.get('state')

    // Build query
    let query = supabase
      .from('dad_groups')
      .select('*')
      .eq('visibility', 'public')

    if (category) {
      query = query.eq('category', category)
    }

    if (city) {
      query = query.eq('city', city)
    }

    if (state) {
      query = query.eq('state', state)
    }

    const { data: groups, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching groups:', error)
      return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500 })
    }

    // Transform data to match our types
    const transformedGroups: DadGroup[] = groups?.map(group => ({
      id: group.id,
      name: group.name,
      description: group.description,
      category: group.category,
      topics: group.topics,
      city: group.city,
      state: group.state,
      visibility: group.visibility,
      memberCount: group.member_count,
      createdBy: group.created_by,
      createdAt: group.created_at,
    })) || []

    return NextResponse.json({ groups: transformedGroups })
  } catch (error) {
    console.error('Error in groups API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, description, category, topics, city, state, visibility = 'public' } = body

    // Validate required fields
    if (!name || !category) {
      return NextResponse.json({ error: 'Name and category are required' }, { status: 400 })
    }

    // Create group
    const { data: group, error: groupError } = await supabase
      .from('dad_groups')
      .insert({
        name,
        description,
        category,
        topics: topics || [],
        city,
        state,
        visibility,
        created_by: user.id,
        member_count: 1, // Creator is first member
      })
      .select()
      .single()

    if (groupError) {
      console.error('Error creating group:', groupError)
      return NextResponse.json({ error: 'Failed to create group' }, { status: 500 })
    }

    // Add creator as owner
    const { error: memberError } = await supabase
      .from('group_members')
      .insert({
        group_id: group.id,
        user_id: user.id,
        role: 'owner',
      })

    if (memberError) {
      console.error('Error adding creator to group:', memberError)
      return NextResponse.json({ error: 'Failed to add creator to group' }, { status: 500 })
    }

    // Transform response
    const transformedGroup: DadGroup = {
      id: group.id,
      name: group.name,
      description: group.description,
      category: group.category,
      topics: group.topics,
      city: group.city,
      state: group.state,
      visibility: group.visibility,
      memberCount: group.member_count,
      createdBy: group.created_by,
      createdAt: group.created_at,
    }

    return NextResponse.json({ group: transformedGroup }, { status: 201 })
  } catch (error) {
    console.error('Error in create group API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
