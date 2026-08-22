import { PageLoader } from '@/components/ui/PageLoader';
import { SUSPENSE_LABELS } from '@/config/app.constants';

export default function Loading() {
  return <PageLoader label={SUSPENSE_LABELS.route} fullScreen />;
}
