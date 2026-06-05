'use client'

import { X } from 'lucide-react'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'

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
        showCloseButton={false}
        className="bg-base border-l border-border p-0 overflow-y-auto !w-[520px] !max-w-[90vw] flex flex-col gap-0"
      >
        {member && (
          <>
            {/* Image header with gradient overlay */}
            <div className="relative w-full aspect-[4/3] flex-shrink-0 overflow-hidden">
              <img
                src={member.image.sourceUrl}
                alt={member.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-base via-base/30 to-transparent" />

              {/* Identity block at bottom of image */}
              <div className="absolute bottom-0 left-0 p-8">
                <p className="font-body text-[10px] uppercase tracking-[0.2em] text-gold mb-3">
                  {member.title}
                </p>
                <SheetTitle className="font-display italic text-[38px] text-cream leading-tight font-normal">
                  {member.name}
                </SheetTitle>
              </div>

              {/* Minimal close button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center text-cream/50 hover:text-cream transition-colors duration-200"
              >
                <X size={16} strokeWidth={1} />
              </button>
            </div>

            {/* Gold rule */}
            <div className="mx-8 mt-8 mb-0 h-px bg-gold/40" />

            {/* Bio */}
            <div className="px-8 py-8 space-y-5">
              <div
                className="font-body font-light text-[15px] text-muted leading-[1.9] [&_p]:mb-4 [&_p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: member.text1 }}
              />
              {member.text2 && (
                <div
                  className="font-body font-light text-[15px] text-muted leading-[1.9] [&_p]:mb-4 [&_p:last-child]:mb-0"
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
