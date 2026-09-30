import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'
import { DadGroup } from '@dadsconnect/shared'

export async function GET(req: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    
    // RLS returns public groups to anonymous visitors and also includes
    // private groups for signed-in members/creators.

    const { data: { user } } = await supabase.auth.getUser()

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const city = searchParams.get('city')
    const state = searchParams.get('state')

    // Build query
    let query = supabase
      .from('dad_groups')
      .select('*')

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

    const memberGroupIds = new Set<string>()
    if (user && groups?.length) {
      const { data: memberships, error: membershipError } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', user.id)
        .in('group_id', groups.map(group => group.id))

      if (membershipError) {
        console.error('Error fetching memberships:', membershipError)
        return NextResponse.json({ error: 'Failed to load group memberships' }, { status: 500 })
      }

      memberships?.forEach(membership => memberGroupIds.add(membership.group_id))
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
      isMember: memberGroupIds.has(group.id),
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
    const name = String(body.name || '').trim()
    const description = String(body.description || '').trim()
    const category = String(body.category || '')
    const topics = Array.isArray(body.topics)
      ? body.topics.map((topic: unknown) => String(topic).trim()).filter(Boolean).slice(0, 12)
      : []
    const city = String(body.city || '').trim()
    const state = String(body.state || '').trim()
    const visibility = body.visibility === 'private' ? 'private' : 'public'
    const allowedCategories = new Set(['support','activities','sports','local','interests'])

    if (name.length < 2 || name.length > 80 || !allowedCategories.has(category)) {
      return NextResponse.json({ error: 'Use a group name between 2 and 80 characters and a valid category' }, { status: 400 })
    }

    const { data: group, error: groupError } = await supabase
      .from('dad_groups')
      .insert({
        name,
        description: description || null,
        category,
        topics,
        city: city || null,
        state: state || null,
        visibility,
        created_by: user.id
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
      await supabase.from('dad_groups').delete().eq('id', group.id)
      return NextResponse.json({ error: 'Failed to finish group creation' }, { status: 500 })
    }

    const { data: created } = await supabase
      .from('dad_groups')
      .select('*')
      .eq('id', group.id)
      .single()

    const row = created || group
    const transformedGroup: DadGroup = {
      id: row.id,
      name: row.name,
      description: row.description,
      category: row.category,
      topics: row.topics,
      city: row.city,
      state: row.state,
      visibility: row.visibility,
      memberCount: row.member_count,
      createdBy: row.created_by,
      createdAt: row.created_at,
      isMember: true,
    }

    return NextResponse.json({ group: transformedGroup }, { status: 201 })
  } catch (error) {
    console.error('Error in create group API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
