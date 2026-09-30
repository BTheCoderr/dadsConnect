import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'

const RSVP_STATUSES = new Set(['going','maybe','not_going'])

export async function POST(
  req: NextRequest,
  { params }: { params: { meetupId: string } }
) {
  try {
    const supabase = await getSupabaseServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { meetupId } = params
    const { status = 'going' } = await req.json()

    if (!RSVP_STATUSES.has(status)) {
      return NextResponse.json({ error: 'Invalid RSVP status' }, { status: 400 })
    }

    const { data: meetup, error: meetupError } = await supabase
      .from('meetups')
      .select('id,status,max_attendees,current_attendees')
      .eq('id', meetupId)
      .maybeSingle()

    if (meetupError) {
      console.error('Error loading meetup:', meetupError)
      return NextResponse.json({ error: 'Failed to load meetup' }, { status: 500 })
    }
    if (!meetup || meetup.status !== 'upcoming') {
      return NextResponse.json({ error: 'This meetup is not accepting RSVPs' }, { status: 404 })
    }

    const { data: existingAttendee, error: checkError } = await supabase
      .from('meetup_attendees')
      .select('status')
      .eq('meetup_id', meetupId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (checkError) {
      console.error('Error checking attendance:', checkError)
      return NextResponse.json({ error: 'Failed to check attendance' }, { status: 500 })
    }

    const becomingGoing = status === 'going' && existingAttendee?.status !== 'going'
    if (
      becomingGoing &&
      meetup.max_attendees !== null &&
      meetup.current_attendees >= meetup.max_attendees
    ) {
      return NextResponse.json({ error: 'This meetup is full' }, { status: 409 })
    }

    const { error: upsertError } = await supabase
      .from('meetup_attendees')
      .upsert({
        meetup_id: meetupId,
        user_id: user.id,
        status,
      }, { onConflict: 'meetup_id,user_id' })

    if (upsertError) {
      console.error('Error saving RSVP:', upsertError)
      return NextResponse.json({ error: 'Failed to update RSVP' }, { status: 500 })
    }

    const { data: refreshed } = await supabase
      .from('meetups')
      .select('current_attendees,max_attendees')
      .eq('id', meetupId)
      .single()

    return NextResponse.json({
      success: true,
      status,
      currentAttendees: refreshed?.current_attendees ?? meetup.current_attendees,
      maxAttendees: refreshed?.max_attendees ?? meetup.max_attendees,
    })
  } catch (error) {
    console.error('Error in attend meetup API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { meetupId: string } }
) {
  try {
    const supabase = await getSupabaseServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { meetupId } = params
    const { error: deleteError } = await supabase
      .from('meetup_attendees')
      .delete()
      .eq('meetup_id', meetupId)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Error removing RSVP:', deleteError)
      return NextResponse.json({ error: 'Failed to remove RSVP' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in remove attendance API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
