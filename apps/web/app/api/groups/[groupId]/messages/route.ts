import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'
import { GroupMessage } from '@dadsconnect/shared'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const supabase = await getSupabaseServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { groupId } = await params
    const { data: membership, error: membershipError } = await supabase
      .from('group_members').select('*').eq('group_id', groupId).eq('user_id', user.id).single()

    if (membershipError || !membership) {
      return NextResponse.json({ error: 'Not a member of this group' }, { status: 403 })
    }

    const { data: messages, error } = await supabase
      .from('group_messages')
      .select(`
        *,
        profiles!group_messages_author_id_fkey(
          id,
          name,
          avatar_url
        )
      `)
      .eq('group_id', groupId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching messages:', error)
      return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
    }

    const transformedMessages: GroupMessage[] = messages?.map(message => ({
      id: message.id,
      groupId: message.group_id,
      authorId: message.author_id,
      content: message.content,
      messageType: message.message_type,
      metadata: message.metadata,
      createdAt: message.created_at,
      author: message.profiles ? {
        id: message.profiles.id,
        name: message.profiles.name,
        avatarUrl: message.profiles.avatar_url,
        city: null,
        state: null,
        bio: null,
        interests: [],
        kidsAges: [],
        createdAt: '',
      } : undefined,
    })) || []

    return NextResponse.json({ messages: transformedMessages })
  } catch (error) {
    console.error('Error in get messages API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const supabase = await getSupabaseServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { groupId } = await params
    const body = await req.json()
    const { content, messageType = 'text', metadata } = body

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 })
    }

    const { data: membership, error: membershipError } = await supabase
      .from('group_members').select('*').eq('group_id', groupId).eq('user_id', user.id).single()

    if (membershipError || !membership) {
      return NextResponse.json({ error: 'Not a member of this group' }, { status: 403 })
    }

    const { data: message, error: messageError } = await supabase
      .from('group_messages')
      .insert({ group_id: groupId, author_id: user.id, content: content.trim(), message_type: messageType, metadata: metadata || null })
      .select(`
        *,
        profiles!group_messages_author_id_fkey(
          id,
          name,
          avatar_url
        )
      `)
      .single()

    if (messageError) {
      console.error('Error creating message:', messageError)
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
    }

    const transformedMessage: GroupMessage = {
      id: message.id,
      groupId: message.group_id,
      authorId: message.author_id,
      content: message.content,
      messageType: message.message_type,
      metadata: message.metadata,
      createdAt: message.created_at,
      author: message.profiles ? {
        id: message.profiles.id,
        name: message.profiles.name,
        avatarUrl: message.profiles.avatar_url,
        city: null,
        state: null,
        bio: null,
        interests: [],
        kidsAges: [],
        createdAt: '',
      } : undefined,
    }

    return NextResponse.json({ message: transformedMessage }, { status: 201 })
  } catch (error) {
    console.error('Error in send message API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
