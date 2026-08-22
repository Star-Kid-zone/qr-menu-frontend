import Link from 'next/link';
import { PiCompassBold } from 'react-icons/pi';
import { EmptyState } from '@/components/ui/EmptyState';
import { buttonVariants } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <EmptyState
        icon={<PiCompassBold size={32} />}
        title="Page not found"
        description="The page you're looking for doesn't exist or may have been moved."
        action={
          <Link href="/" className={buttonVariants({ variant: 'primary' })}>
            Go home
          </Link>
        }
      />
    </div>
  );
}
