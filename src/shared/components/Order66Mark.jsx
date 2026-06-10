import { cn } from '@/lib/utils'

export default function Order66Mark({ className }) {
  return (
    <div className={cn('order66-mark', className)} aria-hidden="true">
      <span className="order66-mark__orbit" />
      <span className="order66-mark__axis order66-mark__axis--x" />
      <span className="order66-mark__axis order66-mark__axis--y" />
      <span className="order66-mark__core">66</span>
    </div>
  )
}
