'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

export interface TrusteeData {
  name: string
  title: string
  thumb: { sourceUrl: string }
  image: { sourceUrl: string }
  text1: string
  text2: string | null
}

interface TeamSheetProps {
  member: TrusteeData | null
  onClose: () => void
}

export default function TeamSheet({ member, onClose }: TeamSheetProps) {
  return (
    <Sheet open={!!member} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="bg-surface border-border w-full max-w-lg overflow-y-auto"
      >
        {member && (
          <>
            <SheetHeader className="mb-8">
              <img
                src={member.image.sourceUrl}
                alt={member.name}
                className="w-full aspect-square object-cover mb-6"
              />
              <SheetTitle className="font-display italic text-[28px] text-cream text-left leading-tight">
                {member.name}
              </SheetTitle>
              <p className="font-body text-[12px] uppercase tracking-[0.12em] text-gold text-left">
                {member.title}
              </p>
            </SheetHeader>
            <div className="space-y-4">
              <p
                className="font-body font-light text-[15px] text-muted leading-relaxed"
                dangerouslySetInnerHTML={{ __html: member.text1 }}
              />
              {member.text2 && (
                <p
                  className="font-body font-light text-[15px] text-muted leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: member.text2 }}
                />
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
