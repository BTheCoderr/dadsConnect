import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(
  req: NextRequest,
  { params }: { params: { meetupId: string } }
) {
  try {
    const supabase = createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { meetupId } = params
    const body = await req.json()
    const { status = 'going' } = body

    // Validate status
    if (!['going', 'maybe', 'not_going'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Check if user is already an attendee
    const { data: existingAttendee, error: checkError } = await supabase
      .from('meetup_attendees')
      .select('*')
      .eq('meetup_id', meetupId)
      .eq('user_id', user.id)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking attendance:', checkError)
      return NextResponse.json({ error: 'Failed to check attendance' }, { status: 500 })
    }

    if (existingAttendee) {
      // Update existing attendance
      const { error: updateError } = await supabase
        .from('meetup_attendees')
        .update({ status })
        .eq('meetup_id', meetupId)
        .eq('user_id', user.id)

      if (updateError) {
        console.error('Error updating attendance:', updateError)
        return NextResponse.json({ error: 'Failed to update attendance' }, { status: 500 })
      }
    } else {
      // Add new attendance
      const { error: insertError } = await supabase
        .from('meetup_attendees')
        .insert({
          meetup_id: meetupId,
          user_id: user.id,
          status,
        })

      if (insertError) {
        console.error('Error adding attendance:', insertError)
        return NextResponse.json({ error: 'Failed to add attendance' }, { status: 500 })
      }
    }

    // Update current attendees count
    const { error: updateCountError } = await supabase.rpc('update_meetup_attendee_count', {
      meetup_id: meetupId
    })

    if (updateCountError) {
      console.error('Error updating attendee count:', updateCountError)
      // Don't fail the request, just log the error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in attend meetup API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { meetupId: string } }
) {
  try {
    const supabase = createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { meetupId } = params

    // Remove user from meetup
    const { error: deleteError } = await supabase
      .from('meetup_attendees')
      .delete()
      .eq('meetup_id', meetupId)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Error removing attendance:', deleteError)
      return NextResponse.json({ error: 'Failed to remove attendance' }, { status: 500 })
    }

    // Update current attendees count
    const { error: updateCountError } = await supabase.rpc('update_meetup_attendee_count', {
      meetup_id: meetupId
    })

    if (updateCountError) {
      console.error('Error updating attendee count:', updateCountError)
      // Don't fail the request, just log the error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in remove attendance API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
