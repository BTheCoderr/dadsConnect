import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(
  req: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const supabase = createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { groupId } = params

    // Check if user is already a member
    const { data: existingMember, error: checkError } = await supabase
      .from('group_members')
      .select('*')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking membership:', checkError)
      return NextResponse.json({ error: 'Failed to check membership' }, { status: 500 })
    }

    if (existingMember) {
      return NextResponse.json({ error: 'Already a member of this group' }, { status: 400 })
    }

    // Add user to group
    const { error: joinError } = await supabase
      .from('group_members')
      .insert({
        group_id: groupId,
        user_id: user.id,
        role: 'member',
      })

    if (joinError) {
      console.error('Error joining group:', joinError)
      return NextResponse.json({ error: 'Failed to join group' }, { status: 500 })
    }

    // Update member count
    const { error: updateError } = await supabase.rpc('increment_group_member_count', {
      group_id: groupId
    })

    if (updateError) {
      console.error('Error updating member count:', updateError)
      // Don't fail the request, just log the error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in join group API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const supabase = createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { groupId } = params

    // Remove user from group
    const { error: leaveError } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', user.id)

    if (leaveError) {
      console.error('Error leaving group:', leaveError)
      return NextResponse.json({ error: 'Failed to leave group' }, { status: 500 })
    }

    // Update member count
    const { error: updateError } = await supabase.rpc('decrement_group_member_count', {
      group_id: groupId
    })

    if (updateError) {
      console.error('Error updating member count:', updateError)
      // Don't fail the request, just log the error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in leave group API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
