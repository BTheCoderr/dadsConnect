import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'
import type { Meetup, MeetupAttendee } from '@dadsconnect/shared'

export async function GET(
  _request: Request,
  { params }: { params: { meetupId: string } }
) {
  try {
    const supabase=await getSupabaseServerClient()
    const {data:{user},error:authError}=await supabase.auth.getUser()
    if(authError || !user) return NextResponse.json({error:'Unauthorized'},{status:401})

    const {data:meetup,error}=await supabase
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
      .eq('id',params.meetupId)
      .maybeSingle()

    if(error){
      console.error('Error fetching meetup:',error)
      return NextResponse.json({error:'Failed to load meetup'},{status:500})
    }
    if(!meetup) return NextResponse.json({error:'Meetup not found'},{status:404})

    const attendees:MeetupAttendee[]=meetup.meetup_attendees?.map(attendee => ({
      meetupId:attendee.meetup_id,
      userId:attendee.user_id,
      status:attendee.status,
      joinedAt:attendee.joined_at,
      user:attendee.profiles ? {
        id:attendee.profiles.id,
        name:attendee.profiles.name,
        avatarUrl:attendee.profiles.avatar_url,
        city:null,
        state:null,
        bio:null,
        interests:[],
        kidsAges:[],
        createdAt:'',
      } : undefined,
    })) || []

    const transformed:Meetup={
      id:meetup.id,
      groupId:meetup.group_id,
      createdBy:meetup.created_by,
      title:meetup.title,
      description:meetup.description,
      activityType:meetup.activity_type,
      location:meetup.location,
      address:meetup.address,
      city:meetup.city,
      state:meetup.state,
      startTime:meetup.start_time,
      endTime:meetup.end_time,
      maxAttendees:meetup.max_attendees,
      currentAttendees:meetup.current_attendees,
      status:meetup.status,
      createdAt:meetup.created_at,
      creator:meetup.profiles ? {
        id:meetup.profiles.id,
        name:meetup.profiles.name,
        avatarUrl:meetup.profiles.avatar_url,
        city:null,
        state:null,
        bio:null,
        interests:[],
        kidsAges:[],
        createdAt:'',
      } : undefined,
      attendees,
      userRsvp:attendees.find(attendee => attendee.userId === user.id)?.status || null,
    }

    return NextResponse.json({meetup:transformed})
  }catch(error){
    console.error('Error in meetup detail API:',error)
    return NextResponse.json({error:'Internal server error'},{status:500})
  }
}
