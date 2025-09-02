import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'
import { Meetup } from '@dadconnect/shared'

export async function GET(req: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const activityType = searchParams.get('activity_type')
    const city = searchParams.get('city')
    const state = searchParams.get('state')
    const status = searchParams.get('status') || 'upcoming'

    // Build query
    let query = supabase
      .from('meetups')
      .select(`
        *,
        profiles!meetups_created_by_fkey(
          id,
          name,
          avatar_url
        ),
        meetup_attendees(
          user_id,
          status,
          profiles!meetup_attendees_user_id_fkey(
            id,
            name,
            avatar_url
          )
        )
      `)
      .eq('status', status)
      .gte('start_time', new Date().toISOString()) // Only future meetups
      .order('start_time', { ascending: true })

    if (activityType) {
      query = query.eq('activity_type', activityType)
    }

    if (city) {
      query = query.eq('city', city)
    }

    if (state) {
      query = query.eq('state', state)
    }

    const { data: meetups, error } = await query

    if (error) {
      console.error('Error fetching meetups:', error)
      return NextResponse.json({ error: 'Failed to fetch meetups' }, { status: 500 })
    }

    // Transform data to match our types
    const transformedMeetups: Meetup[] = meetups?.map(meetup => ({
      id: meetup.id,
      groupId: meetup.group_id,
      createdBy: meetup.created_by,
      title: meetup.title,
      description: meetup.description,
      activityType: meetup.activity_type,
      location: meetup.location,
      address: meetup.address,
      city: meetup.city,
      state: meetup.state,
      startTime: meetup.start_time,
      endTime: meetup.end_time,
      maxAttendees: meetup.max_attendees,
      currentAttendees: meetup.current_attendees,
      status: meetup.status,
      createdAt: meetup.created_at,
      creator: meetup.profiles ? {
        id: meetup.profiles.id,
        name: meetup.profiles.name,
        avatarUrl: meetup.profiles.avatar_url,
        city: null,
        state: null,
        bio: null,
        interests: [],
        kidsAges: [],
        createdAt: '',
      } : undefined,
      attendees: meetup.meetup_attendees?.map(attendee => ({
        meetupId: attendee.meetup_id,
        userId: attendee.user_id,
        status: attendee.status,
        joinedAt: attendee.joined_at,
        user: attendee.profiles ? {
          id: attendee.profiles.id,
          name: attendee.profiles.name,
          avatarUrl: attendee.profiles.avatar_url,
          city: null,
          state: null,
          bio: null,
          interests: [],
          kidsAges: [],
          createdAt: '',
        } : undefined,
      })) || [],
    })) || []

    return NextResponse.json({ meetups: transformedMeetups })
  } catch (error) {
    console.error('Error in meetups API:', error)
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
    const { 
      title, 
      description, 
      activityType, 
      location, 
      address, 
      city, 
      state, 
      startTime, 
      endTime, 
      maxAttendees,
      groupId 
    } = body

    // Validate required fields
    if (!title || !activityType || !startTime) {
      return NextResponse.json({ 
        error: 'Title, activity type, and start time are required' 
      }, { status: 400 })
    }

    // Validate start time is in the future
    if (new Date(startTime) <= new Date()) {
      return NextResponse.json({ 
        error: 'Start time must be in the future' 
      }, { status: 400 })
    }

    // Create meetup
    const { data: meetup, error: meetupError } = await supabase
      .from('meetups')
      .insert({
        group_id: groupId || null,
        created_by: user.id,
        title,
        description,
        activity_type: activityType,
        location,
        address,
        city,
        state,
        start_time: startTime,
        end_time: endTime || null,
        max_attendees: maxAttendees || null,
        current_attendees: 1, // Creator is first attendee
        status: 'upcoming',
      })
      .select()
      .single()

    if (meetupError) {
      console.error('Error creating meetup:', meetupError)
      return NextResponse.json({ error: 'Failed to create meetup' }, { status: 500 })
    }

    // Add creator as attendee
    const { error: attendeeError } = await supabase
      .from('meetup_attendees')
      .insert({
        meetup_id: meetup.id,
        user_id: user.id,
        status: 'going',
      })

    if (attendeeError) {
      console.error('Error adding creator to meetup:', attendeeError)
      return NextResponse.json({ error: 'Failed to add creator to meetup' }, { status: 500 })
    }

    // Transform response
    const transformedMeetup: Meetup = {
      id: meetup.id,
      groupId: meetup.group_id,
      createdBy: meetup.created_by,
      title: meetup.title,
      description: meetup.description,
      activityType: meetup.activity_type,
      location: meetup.location,
      address: meetup.address,
      city: meetup.city,
      state: meetup.state,
      startTime: meetup.start_time,
      endTime: meetup.end_time,
      maxAttendees: meetup.max_attendees,
      currentAttendees: meetup.current_attendees,
      status: meetup.status,
      createdAt: meetup.created_at,
    }

    return NextResponse.json({ meetup: transformedMeetup }, { status: 201 })
  } catch (error) {
    console.error('Error in create meetup API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
