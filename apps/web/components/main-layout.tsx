"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HomeIcon,UsersIcon,CalendarDaysIcon,MessageCircleIcon,UserIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface MainLayoutProps{children:React.ReactNode}
const nav=[
 {href:"/feed",label:"Home",Icon:HomeIcon,active:(p:string)=>p==="/feed"},
 {href:"/groups",label:"Crews",Icon:UsersIcon,active:(p:string)=>p.startsWith("/groups")},
 {href:"/meetups",label:"Plans",Icon:CalendarDaysIcon,active:(p:string)=>p.startsWith("/meetups")},
 {href:"/discussions",label:"Ask",Icon:MessageCircleIcon,active:(p:string)=>p.startsWith("/discussions")},
 {href:"/profile",label:"Me",Icon:UserIcon,active:(p:string)=>p.startsWith("/profile")},
]
export default function MainLayout({children}:MainLayoutProps){
 const pathname=usePathname();const hideMobileChrome=pathname.startsWith('/onboarding')||pathname.includes('/chat')
 return <div className="flex min-h-[100dvh] min-w-0 flex-col overflow-x-clip bg-[#f4f1e9]">
  {!hideMobileChrome&&<header className="sticky top-0 z-40 border-b-2 border-[#ded8cd] bg-[#f4f1e9]/95 px-4 py-3 backdrop-blur md:hidden"><div className="mx-auto flex max-w-7xl items-center justify-between"><Link href="/feed" className="flex min-w-0 items-center gap-2 font-black tracking-tight"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-[11px] text-white shadow-[0_3px_0_#173b93]">DC</span><span className="truncate text-lg">DadConnect</span></Link><Link href="/profile" aria-label="Open profile" className="grid h-10 w-10 place-items-center rounded-full border-2 border-[#d6d0c5] bg-white"><UserIcon className="h-5 w-5"/></Link></div></header>}
  <header className="sticky top-0 z-40 hidden border-b-2 border-[#ded8cd] bg-[#f4f1e9]/95 backdrop-blur md:block"><div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-6"><Link href="/feed" className="mr-auto flex items-center gap-2 text-xl font-black"><span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-[11px] text-white shadow-[0_3px_0_#173b93]">DC</span>DadConnect</Link>{nav.map(({href,label,active})=><Link key={href} href={href} className={cn("rounded-full px-3 py-2 text-sm font-black transition",active(pathname)?"bg-[#10213d] text-white":"text-[#667187] hover:bg-white")}>{label}</Link>)}</div></header>
  <main className={cn("min-w-0 flex-1",!hideMobileChrome&&"pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0")}>{children}</main>
  {!hideMobileChrome&&<footer className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-[#d8d1c5] bg-[#fbfaf7]/98 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(16,33,61,.08)] backdrop-blur md:hidden"><nav aria-label="Primary" className="mx-auto grid h-[4.6rem] max-w-lg grid-cols-5 px-1">{nav.map(({href,label,Icon,active})=>{const selected=active(pathname);return <Link key={href} href={href} aria-current={selected?'page':undefined} className={cn("relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-black transition",selected?"text-primary":"text-[#778196]")} prefetch={false}>{selected&&<span className="absolute top-1 h-1 w-7 rounded-full bg-[#f5c85b]"/>}<span className={cn("grid h-8 w-10 place-items-center rounded-xl",selected&&"bg-[#eef4ff]")}><Icon className="h-5 w-5"/></span><span className="truncate">{label}</span></Link>})}</nav></footer>}
 </div>
}
