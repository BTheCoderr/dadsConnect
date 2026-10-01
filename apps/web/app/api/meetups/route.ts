import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'
import type { Meetup, MeetupAttendee } from '@dadsconnect/shared'

const ACTIVITY_TYPES = new Set(['watch_party','outdoor','sports','coffee','playdate','other'])

export async function GET(req: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const activityType = searchParams.get('activity_type')
    const city = searchParams.get('city')
    const state = searchParams.get('state')
    const groupId = searchParams.get('group_id')
    const status = searchParams.get('status') || 'upcoming'

    let query = supabase
      .from('meetups')
      .select(`
        *,
        profiles!meetups_created_by_fkey(id,name,avatar_url),
        meetup_attendees(
          meetup_id,
          user_id,
          status,
          joined_at,
          profiles!meetup_attendees_user_id_fkey(id,name,avatar_url)
        )
      `)
      .eq('status', status)
      .order('start_time', { ascending: true })

    if (status === 'upcoming') query = query.gte('start_time', new Date().toISOString())
    if (activityType) query = query.eq('activity_type', activityType)
    if (city) query = query.eq('city', city)
    if (state) query = query.eq('state', state)
    if (groupId) query = query.eq('group_id', groupId)

    const { data: meetups, error } = await query
    if (error) {
      console.error('Error fetching meetups:', error)
      return NextResponse.json({ error: 'Failed to fetch meetups' }, { status: 500 })
    }

    const transformedMeetups: Meetup[] = meetups?.map(meetup => {
      const attendees: MeetupAttendee[] = meetup.meetup_attendees?.map(attendee => ({
        meetupId: attendee.meetup_id,
        userId: attendee.user_id,
        status: attendee.status as MeetupAttendee["status"],
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
      })) || []

      return {
        id: meetup.id,
        groupId: meetup.group_id,
        createdBy: meetup.created_by,
        title: meetup.title,
        description: meetup.description,
        activityType: meetup.activity_type as Meetup["activityType"],
        location: meetup.location,
        address: meetup.address,
        city: meetup.city,
        state: meetup.state,
        startTime: meetup.start_time,
        endTime: meetup.end_time,
        maxAttendees: meetup.max_attendees,
        currentAttendees: meetup.current_attendees,
        status: meetup.status as Meetup["status"],
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
        attendees,
        userRsvp: attendees.find(attendee => attendee.userId === user.id)?.status || null,
      }
    }) || []

    return NextResponse.json({ meetups: transformedMeetups })
  } catch (error) {
    console.error('Error in meetups API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const title = String(body.title || '').trim()
    const description = String(body.description || '').trim()
    const activityType = String(body.activityType || '')
    const location = String(body.location || '').trim()
    const address = String(body.address || '').trim()
    const city = String(body.city || '').trim()
    const state = String(body.state || '').trim()
    const startTime = String(body.startTime || '')
    const endTime = String(body.endTime || '')
    const groupId = body.groupId ? String(body.groupId) : null
    const parsedMax = body.maxAttendees === '' || body.maxAttendees == null ? null : Number(body.maxAttendees)

    if (!title || !ACTIVITY_TYPES.has(activityType) || !startTime) {
      return NextResponse.json({ error: 'Title, activity type, and start time are required' }, { status: 400 })
    }

    const start = new Date(startTime)
    if (Number.isNaN(start.getTime()) || start <= new Date()) {
      return NextResponse.json({ error: 'Start time must be in the future' }, { status: 400 })
    }

    if (endTime) {
      const end = new Date(endTime)
      if (Number.isNaN(end.getTime()) || end <= start) {
        return NextResponse.json({ error: 'End time must be after the start time' }, { status: 400 })
      }
    }

    if (parsedMax !== null && (!Number.isInteger(parsedMax) || parsedMax < 1 || parsedMax > 10000)) {
      return NextResponse.json({ error: 'Max attendees must be a whole number between 1 and 10,000' }, { status: 400 })
    }

    const { data: meetup, error: meetupError } = await supabase
      .from('meetups')
      .insert({
        group_id: groupId,
        created_by: user.id,
        title: title.slice(0,120),
        description: description || null,
        activity_type: activityType,
        location: location || null,
        address: address || null,
        city: city || null,
        state: state || null,
        start_time: start.toISOString(),
        end_time: endTime ? new Date(endTime).toISOString() : null,
        max_attendees: parsedMax,
        status: 'upcoming',
      })
      .select()
      .single()

    if (meetupError) {
      console.error('Error creating meetup:', meetupError)
      return NextResponse.json({ error: 'Failed to create meetup' }, { status: 500 })
    }

    const { error: attendeeError } = await supabase
      .from('meetup_attendees')
      .insert({
        meetup_id: meetup.id,
        user_id: user.id,
        status: 'going',
      })

    if (attendeeError) {
      console.error('Error adding creator to meetup:', attendeeError)
      await supabase.from('meetups').delete().eq('id', meetup.id)
      return NextResponse.json({ error: 'Failed to finish meetup creation' }, { status: 500 })
    }

    const { data: created } = await supabase
      .from('meetups')
      .select('*')
      .eq('id', meetup.id)
      .single()

    const row = created || meetup
    const transformedMeetup: Meetup = {
      id: row.id,
      groupId: row.group_id,
      createdBy: row.created_by,
      title: row.title,
      description: row.description,
      activityType: row.activity_type as Meetup["activityType"],
      location: row.location,
      address: row.address,
      city: row.city,
      state: row.state,
      startTime: row.start_time,
      endTime: row.end_time,
      maxAttendees: row.max_attendees,
      currentAttendees: row.current_attendees,
      status: row.status as Meetup["status"],
      createdAt: row.created_at,
      userRsvp: 'going',
    }

    return NextResponse.json({ meetup: transformedMeetup }, { status: 201 })
  } catch (error) {
    console.error('Error in create meetup API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
